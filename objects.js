const SCENE = {
	CAMERA: Camera(
		origin=Point(0, 0, 0),
		fov=rad(90),
		zDirection=-1,
	),
	OBJECTS: [
		Sphere(
			center=Vec(4, 0, -6),
			radius=1,
		),
		// Sphere(
		// 	center=Vec(3, 0, -5),
		// 	radius=1,
		// ),
	],
	ALGORITHM: 'roots'
}