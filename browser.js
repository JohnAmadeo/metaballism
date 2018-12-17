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

function getCanvasAsPNG(canvasId) {
	return document.getElementById(canvasId).toDataURL("image/png");
}

function fillPixels(canvasId, pixelWidth, pixelHeight, pixelColors) {
	let { ctx, imageData } = getImageData(canvasId, pixelWidth, pixelHeight);
	for (let [pixel, color] of pixelColors) {
		setPixelColor(imageData, pixel.x, pixel.y, color);
	}		
	
	ctx.putImageData(imageData, 0, 0);
}

function downloadURIs(uris, name) {
	for (let i = 0; i < uris.length; i++) {
		var link = document.createElement("a");
		link.download = `metaball${i}.png`;
		link.href = uris[i];
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		delete link;
	}
}


// module.exports = {
// 	setPixelColor,
// };