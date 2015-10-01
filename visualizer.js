var audio = new Audio();
		audio.src = 'Nu - Man o to.mp3';
		audio.controls = true;
		audio.loop = true;
		audio.autoplay = true;

var source;
var context;
var analyzer;
var FBCArray;
var bars;
var barHeight;
var lastColorChange;
var color;

/**
 * Calculate an average
 * @param  {array} array
 * @return {number} average
 */
Math.average = function(array) {

  var sum = 0;

  var length = array.length;

  for (var ii = 0; ii < length; ii++) {
    sum += parseFloat(array[ii], 10);
  }

  return (sum / length);

};

function $(id) {
	return (document.querySelector(".content").children[id]);
};

function changeBgColor(change) {

	lastColorChange = new Date().getTime();

	var styles = document.querySelectorAll("style");
	for (var ii = 0; ii < styles.length; ++ii) {
		styles[ii].parentNode.removeChild(styles[ii]);
	}
	var style = document.createElement("style");

	if (change) {
		style.innerHTML = ".dot { background: " + color + " }";
	} else {
		style.innerHTML = ".dot { background: #ddd; }";
	}

	document.body.appendChild(style);

};

function initMP3Player() {
	context = new AudioContext();
	analyzer = context.createAnalyser();

	source = context.createMediaElementSource(audio);
	source.connect(analyzer);
	analyzer.connect(context.destination);
	frameLooper();
};

function frameLooper() {
	var value = 0;
	window.requestAnimationFrame(frameLooper);
	FBCArray = new Uint8Array(analyzer.frequencyBinCount);
	analyzer.getByteFrequencyData(FBCArray);
	bars = 64;
	/** Calculate averages */
	var average = [];
	var ii = bars;
	while (ii) {
		--ii;
		average.push(ii * FBCArray[ii * 5]);
	}
	average = Math.floor(Math.average(average) / 100) / 2;
	ii = bars - 1;
	barHeight = (FBCArray[ii * 5]) / 10;
	/** Left */
	while (ii) {
		value = average;
		value = Math.ceil(value * (Math.sqrt(ii) / 10)) + average;
		value += barHeight;
		value *= 1.85;
		$(ii).setAttribute("style", "height:" + value * 2 + "px; width:" + average + "px;");
		--ii;
	}
	if (new Date().getTime() - lastColorChange < 1e3) return;
	if (value > 64) {
		if (value >= 68) {
			color = "#448AFF";
		} else {
			color = "#64B5F6";
		}
		changeBgColor(true);
	}
	else changeBgColor(true);
};

audio.addEventListener('loadstart', function() {
	setTimeout(function() {
		document.querySelector("#loading").style.opacity = 0;
		document.querySelector(".container").style.opacity = 1;
		initMP3Player();
	}, 1e3);
});