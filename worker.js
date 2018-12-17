importScripts(
	'utils.js',
	'models.js',
	'objects.js',
	'lighting.js',
	'raytracer.js',
);

onmessage = function(raytracerArgs) {
	const { 	
		fromWidth, 
		toWidth, 
		pixelWidth, 
		fromHeight, 
		toHeight, 
		pixelHeight, 
		jsonScene, 
	} = raytracerArgs.data;
	
	// console.log(raytracerArgs);
	// console.log(JSON.parse(raytracerArgs.data.jsonScene));
	
	const pixelColors = raytrace(
		fromWidth, 
		toWidth, 
		pixelWidth, 
		fromHeight, 
		toHeight, 
		pixelHeight, 
		deserializeScene(jsonScene), 
	);
	
	postMessage(pixelColors);
}