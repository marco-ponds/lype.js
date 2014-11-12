Class("Interface", {
	
	// class init
	Interface : function() {
		this.fullscreenToggle = $('#fullscreenToggle');
	},

	set : function() {
		this.setSizes();
		this.setClickListeners();
	},

	setClickListeners : function() {
		//setting click listener on toggleFullScreen.
		this.fullscreenToggle.on('click', app.ui.onClickFullscreen);

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
	},

	//TOGGLING RESULTS /html container and console.
	toggleResults : function() {
		if (this.consoleVisible) {
			$('#result').css("display", "none");
			$('.editor').css("width", "100%");
			this.consoleVisible = false;
		} else {
			$('#result').css("display", "visible");
			$('.editor').css("width", "50%");
			this.consoleVisible = true;
		}
	},

	//METHOD TO FLASH MESSAGES
	flash : function (message, type) {
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
})