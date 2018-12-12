function render(pixelWidth, pixelHeight) {
	let { ctx, imageData } = getImageData('c', pixelWidth, pixelHeight);
	
	for (let pixelY = 0; pixelY < pixelHeight; pixelY++) {
		for (let pixelX = 0; pixelX < pixelWidth; pixelX++) {
			const ray = pixelToRay(pixelX, pixelY, pixelWidth, pixelHeight);
			
			if (SCENE.ALGORITHM === 'spheretracing') {
				const pixelColor = sphereTrace(ray, SCENE.OBJECTS);
				setPixelColor(imageData, pixelX, pixelY, pixelColor);	
			}
			else if (SCENE.ALGORITHM === 'roots'){
				const sphere = SCENE.OBJECTS[0];
				
				const spherePoint = sphereIntersection(ray, sphere);
				let pixelColor;

				if (spherePoint === null) {
					setPixelColor(imageData, pixelX, pixelY, Color.RED);
				} else {				
					setPixelColor(imageData, pixelX, pixelY, Color.BLACK);
				}
			}
		}
	}
	
	// fill the canvas with the computer pixel values
	ctx.putImageData(imageData, 0, 0);
}

// VERIFIED
function pixelToRay(pixelX, pixelY, pixelWidth, pixelHeight) {
	const ndcX = (pixelX + 0.5) / pixelWidth;
	const ndcY = (pixelY + 0.5) / pixelHeight;
	const aspectRatio = pixelWidth / pixelHeight;
	
	return Ray(
		origin=SCENE.CAMERA.origin,
		direction=Vec.unitVector(
			Vec(
				((2 * ndcX) - 1) * Math.tan(SCENE.CAMERA.fov / 2) * aspectRatio,
				(1 - (2 * ndcY)) * Math.tan(SCENE.CAMERA.fov / 2),
				SCENE.CAMERA.zDirection,
			)	
		),		
	);
}

function sphereTrace(ray, objects) {
	const maxDistance = 100;
	// the magnitude of the distance the ray has travelled from its origin
	let rayDistance = 0;
	
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
		
		// ALL SPHERES
		for (let object of objects) {
			const sphere = object;
			// get a distance x <= the distance from the point on the ray to the
			// closest point on the surface of the primitive
			const rayToObjDistance = sphere.duf(rayPoint);
			if (rayToObjDistance < minRayToObjDistance) {
				minRayToObjDistance = rayToObjDistance;
			}
		}
		
		// Check if ray point is so close to an object we can approximate 
		// that it has intersected with that object
		if (minRayToObjDistance <= threshold * rayDistance) {
			return Color.BLACK;
		}
		
		rayDistance += minRayToObjDistance;
	}
	// let numSteps = 0;
	
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