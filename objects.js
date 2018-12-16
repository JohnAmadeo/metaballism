let SCENE = null;

function readScene() {
	const f = document.getElementById('input').files[0];
	const reader = new FileReader();
	
	// Closure to capture the file information.
	reader.onload = (function(f) {
		// SCENE is a global variable
		return function(e) { SCENE = deserializeScene(e.target.result); };
	})(f);

	// Read in the image file as a data URL.
	reader.readAsText(f);
}

function deserializeScene(json) {
	// SCENE is a global variable
	let scene = JSON.parse(json);
	
	// Load in DUF functions
	for (let i = 0; i < scene.OBJECTS.length; i++) {
		const object = scene.OBJECTS[i];
		if (object.type === 'MetaballGroup') {
			const { metaballs, color, lambert } = object;
			scene.OBJECTS[i] = MetaballGroup(metaballs, color, lambert);
		}
		else if (object.type === 'Sphere') {
			const { center, radius, color, lambert } = object;
			scene.OBJECTS[i] = Sphere(center, radius, color, lambert);
		}
	}
	
	return scene;
}

const DEFAULT_SCENE = {
	CAMERA: Camera(
		origin=Point(0, 0, 0),
		// https://stackoverflow.com/questions/49236966/raytracer-high-fov-distortion
		// https://www.gamedev.net/forums/topic/635868-ray-tracer-perspective-distortion/
		// Scratchapixel demo uses 60 degrees as well. High FOV causes objects 
		// to be distorted towards the edges of the screen. Partial explanation
		// in the 2 StackOverflow links above. 
		fov=rad(60),
		zDirection=-1,
	),
	BORDERS: {
		LEFT: -8,
		RIGHT: 8,
		TOP: 5,
		BOTTOM: -5,
		BACK: -15,
		FRONT: -5,
	},
	OBJECTS: [
		// Sphere(
		// 	center=Vec(0, 0, -7),
		// 	radius=1,
		// ),
		// Sphere(
		// 	center=Vec(3, 0, -5),
		// 	radius=1,
		// ),
		MetaballGroup(
			metaballs=[
				// Metaball(
				// 	center=Vec(0, 0, -11),
				// 	radius=1,
				// ),
				// Metaball(
				// 	center=Vec(1.4, 0, -11),
				// 	radius=1,
				// ),
				Metaball(
					center=Vec(-2, 0, -11),
					radius=2,
					velocity=Vec(0.2, 0.1, 0.1),
				),
				Metaball(
					center=Vec(2.4, 2.3, -11),
					radius=2,
					velocity=Vec(-0.2, 0.4, 0.1),
				),
				Metaball(
					center=Vec(2.6, 0.4, -11),
					radius=1.5,
					velocity=Vec(0.2, 0, -0.2),
				),
				//
				Metaball(
					center=Vec(-2, 4, -11),
					radius=2,
					velocity=Vec(0.2, 0.1, 0.1),
				),
				Metaball(
					center=Vec(0.4, 2.3, -7),
					radius=1,
					velocity=Vec(-0.2, 0.4, 0.1),
				),
			],
			color=Color(100, 0, 255), // blue
			lambert=0.8,
		),
	],
	LIGHTS: [
		PointLight(
			position=Vec(5, 0, -5),
			color=Color.WHITE,
		),
	],
}