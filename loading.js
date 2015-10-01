function load() {

	var index = typeof arguments[0] !== "number" ? 0 : arguments[0];

	var node = document.querySelector("#loading");

	if (index >= 0 && index < 3) {
		node.innerHTML += ".";
	} else {
		index = 0;
		node.innerHTML = "Loading.";
	}

	setTimeout(function(){
		load(index);
	}, 1e3);

	index++;

};

document.addEventListener("DOMContentLoaded", load, false);