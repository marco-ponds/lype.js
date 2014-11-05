include("app/Editor");
include("app/Helper");

Class("App", {

	MAX_NUM_TABS : 5,
	FILE_EXTENSIONS : ["js", "coffee"],

	App : function() {
		$('body').addClass("monokai");
		var height = ($(document).height() - 150) + "px";
		$('#main_container').css("height", height);
		$('#coffee_compiler').css("top", ($('#main_container').height() + 30) + "px");
		
		$('#add_tab').on("click", function() {
			app.addNewTab();
		});
		$('#coffee_compiler').on("click", function() {
			if (app.editors[app.currentTab].type == "coffeescript") {
				app.editors[app.currentTab].compile();
			}
		});

		this.setTabListener();

		this.availableThemes = ["monokai"];

		this.currentTheme = "monokai";
		this.currentTab = 0;
		this.numTab = 1;
		this.editors = [];
		this.createEditor(this.currentTab, "root.js", "javascript");
		this.result = document.getElementById("result_content");


		this.helper = new Helper();
	},

	setTabListener : function() {
		$('.tab').unbind("click");
		$(".tab").on("click", function() {
			var id = $(this).attr("id");
			var tab = parseInt(id.substr(4, id.length));
			app.selectTab(tab);
		});
	},

	_eval : function() {
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
		
		$('#add_tab').before(app.helper.li("tab_"+(app.numTab -1), "tab inactive", "<span>"+filename+"</span>"));
		$('#editor_'+app.currentTab).after(app.helper.div("editor_"+(app.numTab-1), "editor invisible", ""));
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