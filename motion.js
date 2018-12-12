function move_DANGEROUS() {
	for (let i = 0; i < SCENE.OBJECTS.length; i++) {
		if (SCENE.OBJECTS[i].type === 'MetaballGroup') {
			for (let j = 0; j < SCENE.OBJECTS[i].metaballs.length; j++) {
				const metaball = SCENE.OBJECTS[i].metaballs[j];
				if (metaball.center.initX === undefined) {
					metaball.center.initX = metaball.center.x;
				}
				if (metaball.center.initX < 0) {
					metaball.center.x += 0.1;
					SCENE.OBJECTS[i].metaballs[j] = metaball;
				}
				else {
					metaball.center.x -= 0.1;
					SCENE.OBJECTS[i].metaballs[j] = metaball;
				}
			}
		}
	}
}