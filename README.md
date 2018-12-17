Final Project
--------------------------------------------

Instructions
- Open index.html
- Upload one of the JSON files inside the folder to load the scene 
 		- data1.json is a simpler demo w/ 2 metaballs colliding with each other
		- data2.json is a more complicated demo with multiple metaballs
		- if you don't load a scene, a default one will be selected
		
- Click the 'Make the image' button
		- In index.html, clicking this button executes 'render(256, 256)'. I've chosen
		a small canvas size to make the animation a little bit smoother. You can 
		change it to something like 'render(512, 512)' if you want a larger canvas
		
- The scene will render (it's not quite real-time so the animation is a bit choppy)
- After 1000 frames, each frame will be saved to your Downloads folder as a PNG
- I've also included a sample screenshot sample1.png

Raytracer Details
- I wrote the raytracer mostly from scratch, although the lighting logic was 
	borrowed from the literate raytracer
- It uses perspective viewing (not orthographic)
- I did not have time to implement acceleration structures
- I experimented with dividing the canvas into 8 sections and letting a separate
thread (via the browser's Web Worker API) render each section in parallel, but 
unfortunately that did not yield a speedup (the code can be seen in my Git 
	history or https://github.com/JohnAmadeo/metaballism/commits/master)

"2 Hard things" Details
- The "2 hard things" I chose for the project were:
		- Metaball primitive (see models.js)
				- A metaball is represented with a center and a radius
				- Rendering was done using the spheretracing technique
				- Lambertian shading was used for lighting
				
		- 3D collisions (see motion.js)
				- The initial goal was to implement 3D elastic collisions
				- In the end, I only had time to do 2D elastic collisions
				- The environment has invisible borders so the metaballs won't 
				just float off into the distance but I did not have time to render 
				them properly
				- Given how I implemented collisions, the logic should be extensible
				to 3D
				- Having said this, there are tricky aspects to collision:
						- We want the metaballs to slightly merge before colliding to get 
						the interest "blobby" effect when metaballs merge.
						i.e our collision check in 
						 
						abs(b1.center - b2.center) < k * (b1.radius + b2.radius)
						
						where k is 0 <= k <= 1
						
						However, we run into situations where the balls merge, but then 
						the resulting collision does not provide enough separation so they
						can fail the collision check on the next frame, resulting in 2 balls 
						being "sticky" and permanently stuck together.




