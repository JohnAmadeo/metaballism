function moveScene(scene) {
	for (let i = 0; i < scene.OBJECTS.length; i++) {
		if (scene.OBJECTS[i].type === 'MetaballGroup') {
			for (let j = 0; j < scene.OBJECTS[i].metaballs.length; j++) {
				const metaball = scene.OBJECTS[i].metaballs[j];
				const { radius, center, velocity } = metaball;
				
				metaball.center.x += velocity.x;
				if (center.x - radius < scene.BORDERS.LEFT) {
					metaball.velocity.x = Math.abs(velocity.x);
				}
				else if(center.x + radius > scene.BORDERS.RIGHT) {
					metaball.velocity.x = -Math.abs(velocity.x);
				}
				
				metaball.center.y += velocity.y;
				if (center.y - radius < scene.BORDERS.BOTTOM) {
					metaball.velocity.y = Math.abs(velocity.y);
				}
				else if(center.y + radius > scene.BORDERS.TOP) {
					metaball.velocity.y = -Math.abs(velocity.y);
				}
				
				metaball.center.z += velocity.z;
				if (center.z - radius < scene.BORDERS.BACK) {
					metaball.velocity.z = Math.abs(velocity.z);
				}
				else if(center.z + radius > scene.BORDERS.FRONT) {
					metaball.velocity.z = -Math.abs(velocity.z);
				}
			}
		}
	}
	
	return scene;
}