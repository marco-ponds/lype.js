/*
	setInterval implementation thanks to https://github.com/bendemeyer
*/

Class("Console", {

	Console : function() {
		this._oldSetInterval = setInterval;
		this._oldSetTimeout = setTimeout;
		this._oldConsoleLog = console.log;
		this._oldAlert = alert;
	},

	set : function() {
		console.log = app.console.log;
		alert = app.console.alert;
		//method to override
		//setTimeout
		//setInterval
		//alert
		//setTimeout = app.console.setTimeout;
		setInterval = app.console.setInterval;
		clearInterval = app.console.clearInterval;
	},

	log : function(obj) {
		if (typeof obj == "string") {
			app.result.appendChild(app.helper.li(" ", "string", '"'+obj+'"'));
		} else if (typeof obj == "object") {
			app.result.appendChild(app.helper.parseElement(obj));
		} else {
			//default behaviour
			app.result.appendChild(app.helper.li(" ", "string", '"'+obj+'"'));
		}
	},

	alert : function() {
		console.log("Alert has been disabled. Sorry.");
	},

	setTimeout : function(method, time) {
		if (!(typeof method == "function")) return;
		app.console._oldSetTimeout(function() {
			try {
				method();
			} catch (exc) {
				//Do nothing
			}
		}, time);
	},

	setInterval : function (func, time) {
		//window.setInterval.count is used to assign a unique intervalId to each interval created
		//these IDs are used by the custom clearInterval() function
		var intervalId = window.setInterval.count ? ++window.setInterval.count : window.setInterval.count = 1;
		//store the arguments as a local variable so they can be used inside other functions
		var args = arguments;
		//create a property on the window.setInterval object for the current intervalId
		//this property will be a function that is called recursively with setTimeout()
		window.setInterval[intervalId] = function () {
			//check if the current interval is still active
			//this will be true unless clearInterval() has been called on this interval
			if (window.setInterval[intervalId].active) {
				//handle all three possible cases of arguments passed to setInterval
				//if a string is passed instead of a function, use eval() to run the string
				if (typeof func == "string") {
					try {
						eval(func);
					} catch (e) {
						return;
					}
				}
				//if arguments for the function are passed in addition to the function and time delay
				//call the function with the specified arguments
				else if (args.length > 2) {
					//the apply() method allows passing an array as different arguments to a function
					//create an array out of the original arguments after the time delay argument, and pass that array to apply()
					try {
						func.apply(this, Array.prototype.slice.call(args, 2));
					} catch(e) {
						return;
					}
				}
				//if neither special case applies, call the function directly
				else {
					try {
						func();
					} catch (e) {
						return;
					}
				}
				//call this function again after the specified time delay has passed
				if (time) {
					setTimeout(window.setInterval[intervalId], time);
				}
			}
		}
		//set the current interval to active
		window.setInterval[intervalId].active = true;
		//call the current interval after the specified time delay
		if (time) {
			setTimeout(window.setInterval[intervalId], time);
		}
		//return an object with the current intervalId, use it to clear this interval using clearInterval()
		return intervalId;
	},

	clearInterval : function (id) {
		//set the active status of the interval associated with the passed object to false
		try {
			window.setInterval[id].active = false;
		} catch(e) {
			return;
		}
	},

	clearAllIntervals : function() {
		try {
			for (var i in window.setInterval) {
				this.clearInterval(i);
			}
		} catch(e) {
			return;
		}
	}
});