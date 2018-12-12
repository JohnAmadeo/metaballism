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
		Sphere(
			center=Vec(4, 4, -10),
			radius=1,
		),
		// Sphere(
		// 	center=Vec(3, 0, -5),
		// 	radius=1,
		// ),
	],
	ALGORITHM: 'spheretracing'
}