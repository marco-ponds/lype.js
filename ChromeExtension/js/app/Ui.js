Class("Interface", {
	
	// class init
	Interface : function() {
		this.fullscreenToggle = $('#fullscreenToggle');
		this.consoleToggle = $('#consoleToggle');
		this.canvasToggle = $('#canvasToggle');
	},

	set : function() {
		this.setSizes();
		this.setClickListeners();
		this.toggleFrames("console");
		//this.addCanvas();
	},

	addCanvas : function() {
		var obj = createCanvas("2d");
		canvas = obj.canvas;
		context = obj.context;
		//dom_container.appendChild(canvas);
		return {
			"canvas" : canvas,
			"context" : context
		}
	},

	setClickListeners : function() {
		//setting click listener on toggleFullScreen.
		this.fullscreenToggle.on('click', app.ui.onClickFullscreen);
		this.canvasToggle.on("click", function() {app.ui.toggleFrames("canvas");});
		this.consoleToggle.on("click", function() {app.ui.toggleFrames("console");});

		//new tab button
		$('#add_tab').on("click", function() {
			app.addNewTab();
		});
		//coffee compiler button
		$('#coffee_compiler').on("click", function() {
			if (app.editors[app.currentTab].type == "coffeescript") {
				app.editors[app.currentTab].compile();
			}
		});
		//if we are using node-webkit, we must provide a custom toolbar
		if (this.environment == "node-webkit") {
			this.setToolbar();
		}

	},

	//FULLSCREEN HANDLING
	_launchFullScreen : function(element) {
		if(element.requestFullScreen) { element.requestFullScreen(); }
		else if(element.mozRequestFullScreen) { element.mozRequestFullScreen(); }
		else if(element.webkitRequestFullScreen) { element.webkitRequestFullScreen(); }
	},

	_cancelFullScreen : function() {
		if(document.cancelFullScreen) { document.cancelFullScreen(); }
		else if(document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
		else if(document.webkitCancelFullScreen) { document.webkitCancelFullScreen(); }
	},

	_isFullScreen : function() {
		return document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitIsFullScreen ? true : false;
		//fullScreen = document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled ? true : false;
		//if(this.debug) console.log('Fullscreen enabled? ' + fullScreen);
		//return fullScreen;
	},

	// callbacks
	onClickFullscreen : function(e) {
		//e.stopPropagation();
		if(app.ui._isFullScreen()) {
			app.ui.fullscreenToggle.removeClass("active");
			app.ui._cancelFullScreen();
		}
		else {
			app.ui.fullscreenToggle.addClass("active");
			app.ui._launchFullScreen(document.documentElement);
		}
		app.ui.setSizes();
	},

	//SET SIZE METHOD
	setSizes : function() {
		var height = ($(document).height() - 150) + "px";
		$('#main_container').css("height", height);
		$('#coffee_compiler').css("top", ($('#main_container').height() + 30) + "px");

		//Resetting canvas height and width on document resize.
		if (canvas) {
			canvas.height = $('#canvas').height() < $('#console').height() ? $('#console').height() : $('#canvas').height() ;
			canvas.width = $('#canvas').width() < $('#console').width() ? $('#console').width() : $('#canvas').width() ;
		}
	},

	//TOGGLING RESULTS /html container and console.
	toggleFrames : function(frame) {
			if (frame == "console") {
				$('#console').removeClass("invisible").addClass("visible");
				$('#canvas').removeClass("visible").addClass("invisible");
				app.ui.consoleToggle.addClass("active");
				app.ui.canvasToggle.removeClass("active");
			}
			else if (frame == "canvas") {
				$('#console').removeClass("visible").addClass("invisible");
				$('#canvas').removeClass("invisible").addClass("visible");
				app.ui.consoleToggle.removeClass("active");
				app.ui.canvasToggle.addClass("active");
			}
			else {
				$('#console').removeClass("invisible").addClass("visible");
				$('#canvas').removeClass("visible").addClass("invisible");
				app.ui.consoleToggle.addClass("active");
				app.ui.canvasToggle.removeClass("active");
			}
	},

	clearCanvas : function() {
		if (canvas && context) {
			context.clearRect(0, 0, canvas.height, canvas.width);
		}
	},

	//METHOD TO FLASH MESSAGES
	flash : function(message, type) {
		switch(type) {
			case "log" : {
				document.getElementById("messages").appendChild(app.helper.li("", "log", message, {checkHtml : false}));
				break;
			}
			case "warn" : {
				document.getElementById("messages").appendChild(app.helper.li("", "warn", message, {checkHtml : false}));
				break;
			}
			case "err" : {
				document.getElementById("messages").appendChild(app.helper.li("", "err", message, {checkHtml : false}));
				break;
			}
			case "info" : {
				document.getElementById("messages").appendChild(app.helper.li("", "info", message, {checkHtml : false}));
				break;
			}
			default : break;
		}
	}
});

var jq_container = $('#canvas');
//var dom_container = document.getElementById("canvas");
var canvas, context;

function createCanvas (type) {
	var canvas = document.createElement("canvas");
	canvas.height = $('#canvas').height() < $('#console').height() ? $('#console').height() : $('#canvas').height() ;
	canvas.width = $('#canvas').width() < $('#console').width() ? $('#console').width() : $('#canvas').width() ;

	if (type == "2d") {
		var context = canvas.getContext("2d");
		return {
			"canvas" : canvas,
			"context" : context
		};
	} else {

	}
}


