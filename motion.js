function borderCheck(b, borders) {
	let collided = false;
	// Check for border collision
	if (b.center.x - b.radius < borders.LEFT) {
		b.velocity.x = Math.abs(b.velocity.x);
		collided = true;
	}
	else if(b.center.x + b.radius > borders.RIGHT) {
		b.velocity.x = -Math.abs(b.velocity.x);
		collided = true;
	}
	
	if (b.center.y - b.radius < borders.BOTTOM) {
		b.velocity.y = Math.abs(b.velocity.y);
		collided = true;		
	}
	else if(b.center.y + b.radius > borders.TOP) {
		b.velocity.y = -Math.abs(b.velocity.y);
		collided = true;
	}
	
	if (b.center.z - b.radius < borders.BACK) {
		b.velocity.z = Math.abs(b.velocity.z);
		collided = true;
	}
	else if(b.center.z + b.radius > borders.FRONT) {
		b.velocity.z = -Math.abs(b.velocity.z);
		collided = true;
	}
	
	return { b, collided };
}

function moveScene(scene) {
	for (let i = 0; i < scene.OBJECTS.length; i++) {
		if (scene.OBJECTS[i].type === 'MetaballGroup') {
			
			const metaballs = scene.OBJECTS[i].metaballs;
			
			for (let j = 0; j < metaballs.length; j++) {
				metaballs[j].collided = false;
			}
			
			for (let j = 0; j < metaballs.length; j++) {
				const { b: b1, collided } = borderCheck(metaballs[j], scene.BORDERS);
				if (collided) {
					metaballs[j] = b1;
					continue;
				}
				
				for (let k = j + 1; k < metaballs.length; k++) {
					const b2 = metaballs[k];
					
					if (Metaball.isCollision(b1, b2)) {
						m1 = Metaball.mass(b1);
						m2 = Metaball.mass(b2);
						
						var { v1f, v2f } = Metaball.collide(m1, m2, b1.velocity.x, b2.velocity.x);
						metaballs[j].velocity.x = v1f;
						metaballs[k].velocity.x = v2f;
						
						var { v1f, v2f } = Metaball.collide(m1, m2, b1.velocity.y, b2.velocity.y);
						metaballs[j].velocity.y = v1f;
						metaballs[k].velocity.y = v2f;
						
						// const { v1fz, v2fz } = Metaball.collide(m1, m2, b1.velocity.z, b2.velocity.z);
						// metaballs[j].velocity.z = v1fz;
						// metaballs[k].velocity.z = v2fz;
						
						metaballs[j].collided = true;
						metaballs[k].collided = true;
					}
				}
			}
			
			for (let j = 0; j < metaballs.length; j++) {
				metaballs[j].collided = false;
				metaballs[j].center = Vec.add(
					metaballs[j].center,
					metaballs[j].velocity,
				);
			}
			
			scene.OBJECTS[i].metaballs = metaballs;
		}
	}
	
	return scene;
}