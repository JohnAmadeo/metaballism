const NUM_STEPS = {};

function render(pixelWidth, pixelHeight) {
	let { ctx, imageData } = getImageData('c', pixelWidth, pixelHeight);
	
	let numPixels = 0;
	for (let pixelY = 0; pixelY < pixelHeight -100; pixelY++) {
		for (let pixelX = 0; pixelX < pixelWidth; pixelX++) {
			const ray = pixelToRay(pixelX, pixelY, pixelWidth, pixelHeight);
			const pixelColor = sphereTrace(ray, SCENE.OBJECTS, SCENE.LIGHTS);
			setPixelColor(imageData, pixelX, pixelY, pixelColor);	
		}
	}
	
	l(NUM_STEPS);
	
	// fill the canvas with the computer pixel values
	ctx.putImageData(imageData, 0, 0);
}

// VERIFIED
function pixelToRay(pixelX, pixelY, pixelWidth, pixelHeight) {
	const ndcX = (pixelX + 0.5) / pixelWidth;
	const ndcY = (pixelY + 0.5) / pixelHeight;
	const aspectRatio = pixelWidth / pixelHeight;
	
	const { fov, zDirection } = SCENE.CAMERA;
	return Ray(
		origin=SCENE.CAMERA.origin,
		direction=Vec.unitVector(
			Vec(
				((2 * ndcX) - 1) * Math.tan(fov / 2) * aspectRatio,
				(1 - (2 * ndcY)) * Math.tan(fov / 2),
				zDirection,
			)	
		),		
	);
}

function sphereTrace(ray, objects, lights) {
	// NOTE: Cheat optimization: make the distance short 
	const maxDistance = 20;
	// the magnitude of the distance the ray has travelled from its origin
	let rayDistance = 0;
	let numSteps = 0;
	const threshold = 10e-6;
	
	while (rayDistance < maxDistance) {
		const rayPoint = Vec.add(
			ray.origin,
			Vec.scale(
				ray.direction,
				rayDistance
			)
		);
		
		// keeps track of the shortest distance we've found between our ray 
		// and the surface of a primitive
		let minRayToObjDistance = Number.POSITIVE_INFINITY;
		let intersectingObject = null;
		
		for (let object of objects) {
			// get a distance x <= the distance from the point on the ray to the
			// closest point on the surface of the primitive
			const rayToObjDistance = object.duf(rayPoint);
			if (rayToObjDistance < minRayToObjDistance) {
				minRayToObjDistance = rayToObjDistance;
				intersectingObject = object;
			}
		}
		
		// Check if ray point is so close to an object we can approximate 
		// that it has intersected with that object
		if (minRayToObjDistance <= threshold * rayDistance) {
			// return Color.BLACK;
			// return Color(
			// 	Color.WHITE.r * Math.min(1, (numSteps / 10)),
			// 	Color.WHITE.g * Math.min(1, (numSteps / 10)),
			// 	Color.WHITE.b * Math.min(1, (numSteps / 10)),
			// );
			return shade(rayPoint, intersectingObject, lights);
			// return Color.BLACK;
		}
		
		rayDistance += minRayToObjDistance;
		numSteps += 1;
	}
	
	if (!(numSteps in NUM_STEPS)) {
		NUM_STEPS[numSteps] = 0;
	}
	NUM_STEPS[numSteps] += 1;
	
	return Color.RED;
}

function getNormal(rayPoint, object) {
	const delta = 10e-5;
	const pt = rayPoint;
	
	const xNorm = 
		object.duf(Vec.add(rayPoint, Vec(delta, 0, 0))) - 
		object.duf(Vec.add(rayPoint, Vec(-delta, 0, 0)));
		
	const yNorm = 
		object.duf(Vec.add(rayPoint, Vec(0, delta, 0))) - 
		object.duf(Vec.add(rayPoint, Vec(0, -delta, 0)));
		
	const zNorm = 
		object.duf(Vec.add(rayPoint, Vec(0, 0, delta))) - 
		object.duf(Vec.add(rayPoint, Vec(0, 0, -delta)));
		
	return Vec.unitVector(Vec(xNorm, yNorm, zNorm));
}

function shade(rayPoint, object, lights) {
	const normal = getNormal(rayPoint, object);
	let pixelColor = Color.BLACK;
	
	for (let light of lights) {
		const lightDirection = Vec.unitVector(
			Vec.subtract(light.point, rayPoint)
		);
		
		const illumination = Math.max(
			0,
			Vec.dotProduct(
				lightDirection, 
				// unit normal coming out of the sphere
				normal,
			),
		);
		
		pixelColor = Color.add(
			pixelColor,
			Color.scale(
				light.color,
				illumination,
			)
		);
	}
	
	pixelColor = Color(
		pixelColor.r * object.color.r,
		pixelColor.g * object.color.g,
		pixelColor.b * object.color.b,
	);
	
	pixelColor = Color.scale(pixelColor, object.lambert);
	pixelColor = Color.scale(pixelColor, 1 / 255);

	// l(pixelColor);
	return pixelColor;
}

function sphereIntersection(ray, sphere) {
	const A = Vec.dotProduct(ray.direction, ray.direction);
	const originMinusSphereCenter = Vec.subtract(ray.origin, sphere.center);
	const B = Vec.dotProduct(
		Vec.scale(ray.direction, 2),
		originMinusSphereCenter,
	);
	const C = 
		Vec.dotProduct(originMinusSphereCenter, originMinusSphereCenter) - 
		(sphere.radius * sphere.radius);
		
	if (discriminant(A, B, C) < 0) {
		return null;
	} else {
		const root = smallestRoot(A, B, C);
		return Vec.add(
			ray.origin,
			Vec.scale(ray.direction, root),
		);
	}
}

function discriminant(A, B, C) {
	return (B * B) - (4 * A * C);
}

function smallestRoot(A, B, C) {
 	const discrim = discriminant(A, B, C);
	const root1 = (-B + Math.sqrt(discrim)) / (2 * A);
	const root2 = (-B - Math.sqrt(discrim)) / (2 * A);
	return Math.min(root1, root2);
}