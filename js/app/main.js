include("app/Editor");

Class("App", {

	App : function() {
		$('body').addClass("monokai");

		this.availableThemes = ["monokai"];

		this.currentTheme = "monokai";
		this.editor = new Editor("editor");
	},
});