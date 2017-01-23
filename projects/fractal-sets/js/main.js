var Canvas = {
	canvas: null,
	tempContext: null,
	canvasData: null,
	height: null,
	width: null,
	blockSize: null,
	finished: null,
	workersCount: null,
	iterations: null,
	startTime: null,
};

$(document).ready(function () {
	Canvas.canvas = document.getElementById("canvasElement");
	if (!Canvas.canvas.getContext) {
		alert("Canvas not supported. Please install a HTML5 compatible browser.");
		return;
	}

	$("body").fadeIn(500);
	initializeCanvas();
	
	//set the size of the Canvas element based on the current screen
	Canvas.width = $("#container").width();
	Canvas.height = Canvas.width/1.2;
	$("#canvasElement").attr("width", Canvas.width);
	$("#canvasElement").attr("height",  Canvas.height);
	//update canvas size
	$( window ).resize(function() {
		Canvas.width = $("#container").width();
		Canvas.height = Canvas.width/1.2;
		$("#canvasElement").attr("width", Canvas.width);
		$("#canvasElement").attr("height",  Canvas.height);
	});


	$("#slider-range-iterations").slider({
		range: "min",
		min: 500,
		max: 10000,
		value: 5000,
		step: 500,
	});

	$("#slider-range-webWorkers").slider({
		range: "min",
		min: 1,
		max: 4,
		value: 1,
		step: 1,
	});

	$("a.ui-slider-handle").mousemove(function(evt){
		var id = evt.target.parentNode.id;
		showSliderBubble(id);
		updateCellSliderValues(id);
	});

	$("a.ui-slider-handle").mouseout(function(evt){
		var id = evt.target.parentNode.id;
		hideSliderBubble(id);
		updateCellSliderValues(id);
	});

	$("#start").click(function(){
		Canvas.tempContext.clearRect(0, 0, Canvas.width, Canvas.height);
		
		var radioChecked = $("input:checked").val();
		Canvas.iterations = $("#slider-range-iterations").slider("values",0);
		Canvas.workersCount = $("#slider-range-webWorkers").slider("values",0);

		Canvas.blockSize = Math.floor(Canvas.height / Canvas.workersCount);
		Canvas.finished = 0;

		if (radioChecked === "mandelbrot")
		{
			showLoadingGif();
			doMandelbrot();
		}
		else
		{
			//Do Julia Set
		}
	});
});

function doMandelbrot()
{
	Canvas.startTime = new Date().getTime();
	for (var i = 0; i < Canvas.workersCount; i++) {
		var worker = new Worker("js/tools.js");
		worker.onmessage = messageHandler;

		var startY = Math.floor(Canvas.blockSize * i);

		var canvasData = Canvas.tempContext.getImageData(0, startY, Canvas.width, Canvas.blockSize);
		worker.postMessage({ workerData: canvasData, workerIndex: i, start: startY, maxIterations: Canvas.iterations, fullHeight: Canvas.height});
	}
}

function messageHandler(e) 
{	
	var canvasData = e.data.result;
	var index = e.data.index;
	Canvas.tempContext.putImageData(canvasData, 0, Canvas.blockSize * index);
	Canvas.finished++;
	if (Canvas.finished === Canvas.workersCount) {
		timeLog();
		hideLoadingGif();
	}
}

function timeLog()
{
	$div = $("#timeLog");
	$div .empty();
	var totalTime = (new Date().getTime() - Canvas.startTime)/1000;
	var text = totalTime + " seconds using " + Canvas.workersCount + 
				" Web Worker(s) @" + Canvas.iterations + " iterations.";
	$div.text(text);
}

function initializeCanvas()
{
	Canvas.height = Canvas.canvas.height;
	Canvas.width = Canvas.canvas.width;
	Canvas.tempContext = Canvas.canvas.getContext("2d");
	Canvas.canvasData = Canvas.tempContext.getImageData(0, 0, Canvas.width, Canvas.height);
}

function showLoadingGif()
{
	$div = $("#timeLog");
	$div .empty();
	$div.text("Processing...");
	$("#start").hide();
	$("#loading").show();
}

function hideLoadingGif()
{
	$("#loading").hide();
	$("#start").show();	
}

function hideSliderBubble(id)
{
	$("#" + id + "-bubbleValue").hide();
}

function showSliderBubble(id)
{
	$("#" + id + "-bubbleValue").show();
}

function updateCellSliderValues(id)
{
	var value = $("#"+ id).slider("values",0);
	var denominator;
	if (id === "slider-range-webWorkers")
			denominator = $("#slider-range-webWorkers").slider("option", "max") - $("#slider-range-webWorkers").slider("option", "min"),
		offSet = ((value-$("#slider-range-webWorkers").slider("option", "min"))*100)/denominator;
	else
		denominator = $("#slider-range-iterations").slider("option", "max") - $("#slider-range-iterations").slider("option", "min"),
		offSet = ((value-$("#slider-range-iterations").slider("option", "min"))*100)/denominator;
	$("#"+ id + "-bubbleValue").text(value).css({"left": + offSet + "%"});
}
