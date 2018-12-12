const SCENE = {
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
					center=Vec(-1.8, 0, -11),
					radius=2,
				),
				Metaball(
					center=Vec(-0.4, 2.3, -11),
					radius=1.5,
				),
				Metaball(
					center=Vec(0.6, 0.8, -11),
					radius=1.5,
				),
			],
			color=Color(100, 0, 255), // blue
			lambert=0.8,
		),
	],
	LIGHTS: [
		PointLight(
			position=Vec(0, 5, -8),
			color=Color.WHITE,
		),
	],
}