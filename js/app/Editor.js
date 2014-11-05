Class("Editor", {

	Editor : function(id, name, type) {

		this.text = [];
		this.name = name;
		this.type = type;
		this.compiled = "";
		this.keyListener = new keypress.Listener();

		this.codeMirror = CodeMirror(document.getElementById(id), {
			lineNumbers: true,
			mode: type,
			styleActiveLine: true,
			matchBrackets: true,
			theme: "monokai"
		});

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

	compile : function() {
		this.saveText();
		var compiled = CoffeeScript.compile(this.text.join("\n")).split("\n");
		this.compiled = compiled.slice(1, compiled.length -2).join("\n");
		app._eval();
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

		this.keyListener.simple_combo("command s", function() {
			app.editors[app.currentTab].download();
		});
	},

	toggleError : function(flag) {
		if (flag) {
			$("#errorAlert").css("display", "block");
		} else {
			$("#errorAlert").css("display", "none");
		}
	}
});