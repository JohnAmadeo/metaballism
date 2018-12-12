const NUM_STEPS = {};

function render(pixelWidth, pixelHeight) {
	let { ctx, imageData } = getImageData('c', pixelWidth, pixelHeight);
	
	let numPixels = 0;
	for (let pixelY = 0; pixelY < pixelHeight -100; pixelY++) {
		for (let pixelX = 0; pixelX < pixelWidth; pixelX++) {
			if (Math.random() < 0) {
				setPixelColor(imageData, pixelX, pixelY, Color.WHITE);
				continue;
			}
			
			const ray = pixelToRay(pixelX, pixelY, pixelWidth, pixelHeight);
			
			if (SCENE.ALGORITHM === 'spheretracing') {
				const pixelColor = sphereTrace(ray, SCENE.OBJECTS);
				setPixelColor(imageData, pixelX, pixelY, pixelColor);	
			}
			// else if (SCENE.ALGORITHM === 'roots'){
			// 	const sphere = SCENE.OBJECTS[0];
			// 
			// 	const spherePoint = sphereIntersection(ray, sphere);
			// 	let pixelColor;
			// 
			// 	if (spherePoint === null) {
			// 		setPixelColor(imageData, pixelX, pixelY, Color.RED);
			// 	} else {				
			// 		setPixelColor(imageData, pixelX, pixelY, Color.BLACK);
			// 	}
			// }
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

function sphereTrace(ray, objects) {
	// NOTE: Cheat optimization: make the distance short 
	const maxDistance = 20;
	// the magnitude of the distance the ray has travelled from its origin
	let rayDistance = 0;
	let numSteps = 0;
	const threshold = 10e-6;
	
	while (rayDistance < maxDistance) {
		// keeps track of the shortest distance we've found between our ray 
		// and the surface of a primitive
		let minRayToObjDistance = Number.POSITIVE_INFINITY;
		const rayPoint = Vec.add(
			ray.origin,
			Vec.scale(
				ray.direction,
				rayDistance
			)
		);
		
		for (let object of objects) {
			// get a distance x <= the distance from the point on the ray to the
			// closest point on the surface of the primitive
			const rayToObjDistance = object.duf(rayPoint);
			if (rayToObjDistance < minRayToObjDistance) {
				minRayToObjDistance = rayToObjDistance;
			}
		}
		
		// Check if ray point is so close to an object we can approximate 
		// that it has intersected with that object
		if (minRayToObjDistance <= threshold * rayDistance) {
			// return Color.BLACK;
			return Color(
				Color.WHITE.r * Math.min(1, (numSteps / 10)),
				Color.WHITE.g * Math.min(1, (numSteps / 10)),
				Color.WHITE.b * Math.min(1, (numSteps / 10)),
			);
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