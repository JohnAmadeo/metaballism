// const { l, within } = require('./utils');
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

function Sphere(center, radius)  {
	if (typeof radius !== 'number' || !Vec.valid(center)) {
		throw "Not a valid sphere"
	}
	return {
		center,
		radius,
		// distance underestimating function
		duf: function(point) {
			if (!Vec.valid(point)) {
				throw "Invalid point passed in to DUF"
			}
			return Vec.magnitude(Vec.subtract(point, center)) - radius;
		}
	}
}

function MetaballGroup(metaballs) {
	// define density function of a metaball as a closure
	function getDensity(metaball, point) {
		// distance from ray point to the center of the metaball
		const r = Vec.magnitude(
			Vec.subtract(point, metaball.center)
		);
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
		metaballs,
		duf: function(point) {
			const threshold = 0.2;
			const radiiSum = metaballs
				.map(metaball => metaball.radius)
				.reduce((tot, radius) => tot + radius, 0);
			
			const densitySum = metaballs
				.map(metaball => getDensity(metaball, point))
				.reduce((tot, density) => tot + density, 0);
				
			return (2 / 3) * (threshold - densitySum) * radiiSum;			
		}
	}
}

function Metaball(center, radius) {
	// take advantage of built-in type checking in Sphere
	let sphere = Sphere(center, radius);
	delete sphere.duf;
	return sphere;
}

Vec.valid = function(v) { 
	return typeof v === 'object' &&
		typeof v.x === 'number' &&
		typeof v.y === 'number' &&
		typeof v.z === 'number';
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