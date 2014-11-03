include("app/Helper");

Class("Editor", {

	Editor : function() {
		this.codeMirror = CodeMirror(document.getElementById("editor"), {
			lineNumbers: true,	
			mode:  "javascript",
			styleActiveLine: true,
			matchBrackets: true,
			theme: "monokai"
		});

		this.text = [];
		this.result = document.getElementById("result_content");
		this.helper = new Helper();
		this.lastUpdateLine = 0; //reference to last line where eval was executed

		this.configureConsole();
		this.setCodeListeners();

	},

	saveText : function() {
		var lines = this.codeMirror.display.view;
		this.text = [];
		for (var i in lines) {
			this.text.push(lines[i].line.text);
		}
	},

	_textToString : function() {
		return this.text.join("\n");
	},

	setCodeListeners : function() {
		this.codeMirror.on("change", function(istance, changes) {
			var currentInner = app.editor.result.innerHTML;
			try {
				app.editor.saveText();
				app.editor.result.innerHTML = "";
				eval(app.editor._textToString());
				app.editor.toggleError(false);
			} catch (e) {
				app.editor.toggleError(true);
				//app.editor.old_log(e);
				app.editor.result.innerHTML = currentInner;
			}
		});
	},

	configureConsole : function() {
		var self = this;
		this.old_log = console.log;
		console.log = function(obj) {
			if (typeof obj == "string") {
				self.result.appendChild(self.helper.li(" ", "string", '"'+obj+'"'));
			} else if (typeof obj == "object") {
				self.result.appendChild(self.helper.parseElement(obj));
			}
		}
		/*
		console.log = function(obj) {
			app.editor.print(obj);
			app.editor.old_log(obj);
		}*/
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
				document.getElementById("messages").appendChild(app.editor.helper.li("", "log", message));
				break;
			}
			case "warn" : {
				document.getElementById("messages").appendChild(app.editor.helper.li("", "warn", message));
				break;
			}
			case "err" : {
				document.getElementById("messages").appendChild(app.editor.helper.li("", "err", message));
				break;
			}
			case "info" : {
				document.getElementById("messages").appendChild(app.editor.helper.li("", "info", message));
				break;
			}
			default : break;
		}
	}

});