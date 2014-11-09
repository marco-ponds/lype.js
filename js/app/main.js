include("app/Editor");
include("app/Helper");
include("app/Console");

Class("App", {

	MAX_NUM_TABS : 5,
	FILE_EXTENSIONS : ["js", "coffee"],
	MIN_HEIGHT : 600,
	MIN_WIDTH : 800,
	HEIGHT : 600,
	WIDTH : 800,
	LINT_CONFIG : {
		undef : false,
		unused : false
	},
	LINT_GLOBALS : "/*global alert $ window document console setInterval setTimeout require*/\n",

	App : function() {
		$('body').addClass("monokai");

		this.detectEnvinronment();
		this.setSizes();
		this.setClickListeners();
		this.setTabListener();

		this.availableThemes = ["monokai"];

		this.currentTheme = "monokai";
		this.currentTab = 0;
		this.numTab = 1;
		this.editors = [];
		this.result = document.getElementById("result_content");

		//node-webkit
		this.enlarged = false;

		this.console = new Console();
		//this.console.set();
		this.helper = new Helper();

		this.createEditor(this.currentTab, "root.js", "javascript");
		this.setUpLintWorker();
	},

	handleResize : function() {
		app.setSizes();
	},

	detectEnvinronment : function() {
		//trying to detect if we are within node-webkit or not
		var os="Unknown OS";
		if (navigator.appVersion.indexOf("Win")!=-1) os="Windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) os="MacOS";
		if (navigator.appVersion.indexOf("X11")!=-1) os="UNIX";
		if (navigator.appVersion.indexOf("Linux")!=-1) os="Linux";
		this.os = os;
		if (window.process) {
			//node-webkit
			this.environment = "node-webkit";
		} else {
			this.environment = "browser";
		}
	},

	setSizes : function() {
		var height = ($(document).height() - 150) + "px";
		$('#main_container').css("height", height);
		$('#coffee_compiler').css("top", ($('#main_container').height() + 30) + "px");
	},

	setClickListeners : function() {
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

	setToolbar : function() {
		var toShow = this.os;
		var toHide = (this.os == "MacOS") ? "Windows" : "MacOS";
		$('.toolbar.'+toShow).removeClass().addClass("toolbar visible " + toShow);
		$('.toolbar.'+toHide).removeClass().addClass("toolbar invisible " + toHide);

		$('#exit').on("click", function() {
			//console.log("inside exit click");
			if (process) {
				process.kill();
			}
		});

		$('#reduce').on("click", function() {
			//console.log("inside reduce click");
		});

		$('#enlarge').on("click", function() {
			if (!app.enlarged) {
				app.gui = require("nw.gui");
				app.window = app.gui.Window.get();
				app.window.resizeTo(window.screen.width, window.screen.height - 20);
				app.window.moveTo(0,20);
				app.enlarged = true;
			} else {
				app.gui = require("nw.gui");
				app.window = app.gui.Window.get();
				app.window.resizeTo(app.WIDTH, app.HEIGHT);
				//app.window.moveTo(window.screen.width/4, window.screen.height/4);
				app.window.setPosition("center");
				app.enlarged = false;
			}
		});

	},

	setTabListener : function() {
		$('.tab').unbind("click");
		$(".tab").on("click", function() {
			var id = $(this).attr("id");
			var tab = parseInt(id.substr(4, id.length));
			app.selectTab(tab);
		});
	},

	setUpLintWorker : function() {
		this.worker = new Worker("/js/app/worker.js");
		this.worker.addEventListener("message", function(e){
			var data = JSON.parse(e.data.result);
			//console.log(data);
			for (var k in data.errors) {
				var error = data.errors[k];
				//console.log(error.line-2);
				app.editors[e.data.toCheck].codeMirror.addLineClass(error.line-2, "background", "errorLine");
				app.editors[e.data.toCheck].saveError({
					line : error.line-2,
					reason : error.reason,
					index : k
				});
				$($('.errorLine')[k]).attr("title",error.reason);
				var t = new jBox('Tooltip', {
					theme : "TooltipDark",
					closeOnMouseLeave : true
				});
				t.attach($($('.errorLine')[k]));
				app.editors[e.data.toCheck].saveTooltip(t);
			}
		});
	},

	lint : function(){
		for (var i=0; i< app.numTab; i++) {
			if (app.editors[i].type == "javascript") {
				app.editors[i].removeAllErrors();
				app.editors[i].removeAllJBoxes();
				app.editors[i].saveText();
				var text = app.editors[i].text.join("\n");
				text = app.LINT_GLOBALS + text;				
				this.worker.postMessage({
					task : "lint",
					code : text,
					config : app.LINT_CONFIG,
					toCheck : i
				});
		 	} 
			
		}
		
	},

	_eval : function() {
		app.console.clearAllIntervals();
		app.lint();
		app.result.innerHTML = "";
		for (var i=0; i< app.numTab; i++) {
			switch (app.editors[i].type) {
				case "javascript" : {
					app.editors[i].saveText();
					eval(app.editors[i]._textToString());
				}
				case "coffeescript" : {
					app.editors[i].saveText();
					eval(app.editors[i].compiled);
				}
 			} 
			
		}
	},

	addNewTab : function() {
		var previous = this.currentTab;
		if ((this.numTab+1) > this.MAX_NUM_TABS) return;
		
		this.numTab ++;
		//selecting new tab
		var filename = prompt("Please insert script's name.");

		if (!(typeof filename == "string"))  {
			console.log("Please use a valid filename.");
			return;
		}
		if (app.FILE_EXTENSIONS.indexOf(filename.split(".")[1]) == -1) {
			//trying to use a invalid file extension
			console.log("Please use a valid file extension.");
			return;
		}
		
		$('#add_tab').before(app.helper.li("tab_"+(app.numTab -1), "tab inactive", "<span>"+filename+"</span>", {checkHtml : false}));
		$('#editor_'+app.currentTab).after(app.helper.div("editor_"+(app.numTab-1), "editor invisible", "", {checkHtml : false}));
		this.setTabListener();
		var name = filename;
		var type = filename.split(".")[1] == "coffee" ? "coffeescript" : "javascript";
		this.createEditor((app.numTab -1), name, type);
		this.selectTab((app.numTab -1));
	},

	createEditor : function(tab, name, type) {
		this.editors[tab] = new Editor("editor_"+tab, name, type);
	},

	selectTab : function(tab) {
		if (tab > this.MAX_NUM_TABS) return;
		for (var i=0; i<this.numTab; i++) {
			if (i != tab) {
				$("#editor_"+i).removeClass().addClass("editor invisible");
				$("#tab_"+i).removeClass().addClass("tab inactive");
			} else{
				$('#editor_'+i).removeClass().addClass("editor visible");
				$("#tab_"+i).removeClass().addClass("tab active");
			}
		}
		if (this.editors[tab].type == "coffeescript") {
			$("#coffee_compiler").removeClass().addClass("visible");
		} else {
			$("#coffee_compiler").removeClass().addClass("invisible");
		}
		this.currentTab = tab;
		this.editors[tab].focus();
	},
	
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

});