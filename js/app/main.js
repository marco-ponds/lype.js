include("app/Editor");
include("app/Helper");

Class("App", {

	MAX_NUM_TABS : 5,

	App : function() {
		$('body').addClass("monokai");
		$('#add_tab').on("click", function() {
			app.addNewTab();
		});

		this.setTabListener();

		this.availableThemes = ["monokai"];

		this.currentTheme = "monokai";
		this.currentTab = 0;
		this.numTab = 1;
		this.editors = [];
		this.createEditor(this.currentTab);
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
		for (var i=0; i< app.numTab; i++) {
			app.editors[i].saveText();
			eval(app.editors[i]._textToString());
		}
	},

	addNewTab : function() {
		var previous = this.currentTab;
		if ((this.numTab+1) > this.MAX_NUM_TABS) return;
		
		this.numTab ++;
		//selecting new tab
		var filename = prompt("Please insert script's name.");
		if (!(typeof filename == "string")) {
			console.log("Please use a valid filename.");
		}
		$('#add_tab').before(app.helper.li("tab_"+(app.numTab -1), "tab inactive", "<span>"+filename+"</span>"));
		this.setTabListener();
		this.createEditor((app.numTab -1));
		this.selectTab((app.numTab -1));
	},

	createEditor : function(tab) {
		this.editors[tab] = new Editor("editor_"+tab);
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
		this.currentTab = tab;
		this.editors[tab].focus();
	}
});