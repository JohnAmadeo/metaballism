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

	return pixelColor;
}
