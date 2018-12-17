function render(pixelWidth, pixelHeight) {
	// If user has not uploaded a JSON file that describes the scene
	if (SCENE === null) {
		SCENE = DEFAULT_SCENE;
	}
	
	let scene = SCENE;

	let frame = 0;
	let images = [];
	
	const id = setInterval(() => {
		const step = 1;
		const widthStep = pixelWidth / step;
		const heightStep = pixelHeight / step;
		
		const pixelColors = raytrace(pixelWidth, pixelHeight, scene);
		fillPixels('c', pixelWidth, pixelHeight, pixelColors);
		
		// Update the scene
		scene = moveScene(scene);
		
		// Saving rendered frames
		images.push(getCanvasAsPNG('c'));
		frame += 1;
		if (frame > 1000) {
			clearInterval(id);
			// downloadURIs(images);
		}	
	}, 20);
}

function raytrace(pixelWidth, pixelHeight, scene) {
	let numPixels = 0;
	let pixelColors = new Map();
	
	for (let pixelY = 0; pixelY < pixelHeight; pixelY++) {
		for (let pixelX = 0; pixelX < pixelWidth; pixelX++) {
			const ray = pixelToRay(pixelX, pixelY, pixelWidth, pixelHeight, scene.CAMERA);
			let intersection = intersect(
				ray, 
				scene.OBJECTS, 
			);
			
			if (intersection === null) {
				pixelColors.set(Pixel(pixelX, pixelY), Color.RED);
				continue					
			}
			
			const { rayPoint, object } = intersection;
			const pixelColor = shade(rayPoint, object, scene.LIGHTS, scene.OBJECTS);
			pixelColors.set(Pixel(pixelX, pixelY), pixelColor);
		}
	}
	
	return pixelColors;
}

function pixelToRay(pixelX, pixelY, pixelWidth, pixelHeight, camera) {
	const ndcX = (pixelX + 0.5) / pixelWidth;
	const ndcY = (pixelY + 0.5) / pixelHeight;
	const aspectRatio = pixelWidth / pixelHeight;
	
	const { fov, zDirection } = camera;
	return Ray(
		origin=camera.origin,
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
function intersect(ray, objects) {
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
	
	return null;
}