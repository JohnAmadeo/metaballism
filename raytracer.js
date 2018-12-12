const NUM_STEPS = {};

function render(pixelWidth, pixelHeight) {
	let { ctx, imageData } = getImageData('c', pixelWidth, pixelHeight);
	
	let numPixels = 0;
	for (let pixelY = 0; pixelY < pixelHeight -100; pixelY++) {
		for (let pixelX = 0; pixelX < pixelWidth; pixelX++) {
			const ray = pixelToRay(pixelX, pixelY, pixelWidth, pixelHeight);
			let intersection = intersectWSphereTracing(
				ray, 
				SCENE.OBJECTS, 
			);
			
			if (intersection === null) {
				setPixelColor(imageData, pixelX, pixelY, Color.RED);
				continue					
			}
			
			const { rayPoint, object } = intersection;
			const pixelColor = shade(rayPoint, object, SCENE.LIGHTS);
			setPixelColor(imageData, pixelX, pixelY, pixelColor);
		}
	}
	
	l(NUM_STEPS);
	
	// fill the canvas with the computer pixel values
	ctx.putImageData(imageData, 0, 0);
}

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

// Check for ray-object intersection using sphere-tracing 
function intersectWSphereTracing(ray, objects) {
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
		
		// keeps track of shortest distance between ray and an object's surface
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
			return { rayPoint, object: intersectingObject };
		}
		
		rayDistance += minRayToObjDistance;
		numSteps += 1;
	}
	
	if (!(numSteps in NUM_STEPS)) {
		NUM_STEPS[numSteps] = 0;
	}
	NUM_STEPS[numSteps] += 1;
	
	return null;
}