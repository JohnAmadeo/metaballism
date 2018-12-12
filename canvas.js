function setPixelColor(imageData, x, y, color) {
	index = (x * 4) + (y * imageData.width * 4),
	imageData.data[index + 0] = color.r;
	imageData.data[index + 1] = color.g;
	imageData.data[index + 2] = color.b;
	imageData.data[index + 3] = 255;
}

function getImageData(canvasId, width, height) {
	let c = document.getElementById(canvasId);
	c.width = width;
	c.height = height;
	c.style.cssText = 'width:' + width + 'px;height:' + height + 'px';
	let ctx = c.getContext('2d');
	let imageData = ctx.getImageData(0, 0, width, height);	
	
	return { ctx, imageData };
}


// module.exports = {
// 	setPixelColor,
// };