Class("Editor", {

	Editor : function(id) {
		this.codeMirror = CodeMirror(document.getElementById(id), {
			lineNumbers: true,
			mode: "javascript",
			styleActiveLine: true,
			matchBrackets: true,
			theme: "monokai"
		});

		this.text = [];

		this.keyListener = new keypress.Listener();

		this.configureConsole();
		this.setCodeListeners();

	},

	focus : function() {
		this.codeMirror.focus();
	},

	download : function() {
		var filename = $("#tab_"+app.currentTab + " span").text();
		var text = app.editors[app.currentTab].text.join("\n");
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		pom.setAttribute('download', filename);
		pom.click();
	},

	saveText : function() {
		var lines = this.codeMirror.display.view;
		this.text = [];
		for (var i in lines) {
			this.text.push(lines[i].line.text);
		}
	},

	_textToString : function() {
		return this.text.join(" ");
	},

	setCodeListeners : function() {
		this.codeMirror.on("change", function(istance, changes) {
			var currentInner = app.result.innerHTML;
			try {
				app.result.innerHTML = "";
				app._eval();
				app.editors[app.currentTab].toggleError(false);
			} catch (e) {
				app.editors[app.currentTab].toggleError(true);
				//app.editors[app.currentTab].old_log(e);
				app.result.innerHTML = currentInner;
				//console.log(e.message);
			}
		});

		this.keyListener.simple_combo("ctrl s", function() {
			app.editors[app.currentTab].download();
		});
	},

	configureConsole : function() {
		this.old_log = console.log;
		console.log = function(obj) {
			if (typeof obj == "string") {
				app.result.appendChild(app.helper.li(" ", "string", '"'+obj+'"'));
			} else if (typeof obj == "object") {
				app.result.appendChild(app.helper.parseElement(obj));
			}
		};

		alert = function(obj) {
			console.log("Alert has been disabled. Sorry.");
		};
	},

	toggleError : function(flag) {
		if (flag) {
			$("#errorAlert").css("display", "block");
		} else {
			$("#errorAlert").css("display", "none");
		}
	},

	flash : function (message, type) {
		switch(type) {
			case "log" : {
				document.getElementById("messages").appendChild(app.helper.li("", "log", message));
				break;
			}
			case "warn" : {
				document.getElementById("messages").appendChild(app.helper.li("", "warn", message));
				break;
			}
			case "err" : {
				document.getElementById("messages").appendChild(app.helper.li("", "err", message));
				break;
			}
			case "info" : {
				document.getElementById("messages").appendChild(app.helper.li("", "info", message));
				break;
			}
			default : break;
		}
	}

});