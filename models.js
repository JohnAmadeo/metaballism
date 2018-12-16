// const { l, within } = require('./utils');
function Pixel(x, y) { return {x,y}; }
function Color(r, g, b) { return {r,g,b}; }
function Vec(x, y, z) { return {x,y,z}; }
function Point(x, y, z) { return Vec(x, y, z); }
// P = orig + t * dir
function Ray(origin, direction) {
	if (!Vec.valid(origin) || !Vec.valid(direction) || !within(Vec.magnitude(direction), 1)) {
		l(Vec.magnitude(direction))
		throw "Not a valid ray"
	}
	return { origin, direction }; 
}

function Camera(origin, fov, zDirection) {
	if (!Vec.valid(origin) || typeof fov !== 'number' || (zDirection !== -1 && zDirection !== 1)) {
		throw "Not a valid camera";
	}
	return { origin, fov, zDirection };
}

function Sphere(center, radius, color, lambert)  {
	if (
		typeof radius !== 'number' || 
		typeof lambert !== 'number' || 
		!Vec.valid(center) || 
		!Color.valid(color)
	) {
		throw "Not a valid sphere"
	}
	return {
		type: 'Sphere',
		center,
		radius,
		color,
		lambert,
		// distance underestimating function
		duf: function(point) {
			if (!Vec.valid(point)) {
				throw "Invalid point passed in to DUF"
			}
			return Vec.magnitude(Vec.subtract(point, center)) - radius;
		}
	}
}

function MetaballGroup(metaballs, color, lambert) {	
	if (
		typeof lambert !== 'number' || 
		!Color.valid(color)
	) {
		throw "Not a valid metaball group"
	}
	
	// precompute so we don't have to redo it every time duf is called
	const radiiSum = metaballs
		.map(metaball => metaball.radius)
		.reduce((tot, radius) => tot + radius, 0);
	
	// define density function of a metaball as a closure
	function getDensity(metaball, point) {
		// distance from ray point to the center of the metaball
		const r = Vec.distance(point, metaball.center);
		const R = metaball.radius;
		
		if (r >= R) {
			return 0;
		}
		
		return (
			(2 * (r**3 / R**3)) -
			(3 * (r**2 / R**2)) + 
			1
		);
	}
		
	return {
		type: 'MetaballGroup',
		metaballs,
		color,
		lambert,
		duf: function(point) {
			const threshold = 0.2;
			
			const densitySum = metaballs
				.map(metaball => getDensity(metaball, point))
				.reduce((tot, density) => tot + density, 0);
				
			// Treat metaballs as spheres and calculate the shrotest distance 
			// from the ray point to the "surface" of the sphere. This optimization
			// step is needed as otherwise the sphere tracing algorithm can only 
			// move forward by [threshold] every iteration even if the ray
			// is very far from any metaballs
			const minRayToSurfaceDist = metaballs
				.map(m => Vec.distance(m.center, point) - m.radius)
				.reduce((min, dist) => dist < min ? dist : min, Number.POSITIVE_INFINITY);
			
			return Math.max(
				minRayToSurfaceDist, 
				(2 / 3) * (threshold - densitySum) * radiiSum
			);
		}
	}
}

function Metaball(center, radius, velocity) {
	if (
		typeof radius !== 'number' || 
		!Vec.valid(center) ||
		!Vec.valid(velocity)
	) {
		throw "Not a valid metaball"
	}
	return { center, radius, velocity };
}

function PointLight(point, color) {
	if (!Color.valid(color) || !Vec.valid(point)) {
		throw "Not a valid point light";
	}
	return {point, color};
}

Vec.valid = function(v) { 
	return typeof v === 'object' &&
		typeof v.x === 'number' &&
		typeof v.y === 'number' &&
		typeof v.z === 'number';
}

Vec.distance = function(p1, p2) {
	return Vec.magnitude(Vec.subtract(p1, p2));
}

Vec.dotProduct = function(v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
};

Vec.magnitude = function(v) { return Math.sqrt(Vec.dotProduct(v, v)); };

// also a normalized vector
Vec.unitVector = function(v) { return Vec.scale(v, 1 / Vec.magnitude(v)); };

Vec.scale = function(v, scalar) {
	return Vec(v.x * scalar, v.y * scalar, v.z * scalar);
}

Vec.add = function(p1, p2) {
	return Vec(p1.x + p2.x, p1.y + p2.y, p1.z + p2.z);
}

Vec.subtract = function(v1, v2) {
    return Vec(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
};

Color.add = function(c1, c2) {
	return Color(c1.r + c2.r, c1.g + c2.g, c1.b + c2.b);
}

Color.valid = function(c) {
	return typeof c === 'object' &&
		typeof c.r === 'number' && 0 <= c.r && c.r <= 255
		typeof c.g === 'number' && 0 <= c.g && c.g <= 255
		typeof c.b === 'number' && 0 <= c.b && c.b <= 255;
}

Color.scale = function(c, scalar) {
	return Color(c.r * scalar, c.g * scalar, c.b * scalar);
}
Color.BLACK = Color(0, 0, 0);
Color.WHITE = Color(255, 255, 255);
Color.RED = Color(255, 0, 0);

// module.exports = {
// 	Vec,
// 	Point,
// 	Ray,
// 	Sphere,
// 	Color,
// };