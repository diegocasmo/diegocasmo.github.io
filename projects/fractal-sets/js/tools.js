self.onmessage = function (e) {
	importScripts("mandelbrot.js");
	var canvasData = e.data.workerData;
	var	height = canvasData.height;
	var	width = canvasData.width;
	var	binaryData = canvasData.data;
	var	index = e.data.workerIndex;
	var	startY = e.data.start;
	var iterations = e.data.maxIterations;
	var imageHeight = e.data.fullHeight;

	Mandelbrot.doMandelbrot(binaryData, iterations, height, width, startY, imageHeight);
	self.postMessage({ result: canvasData, index: index});
};
