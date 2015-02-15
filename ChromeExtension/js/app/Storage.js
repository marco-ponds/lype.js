Class("DB", {
    DB: function() {
        this.localStorage = window.localStorage || null;
        this.available = !(this.localStorage == null);
        if (this.available) {
            var saved = this.localStorage.getItem("saved");
            this.saved = saved == "true" ? true : false;
        }
    },

    save: function() {
        //save app content.
        //console.log("..saving..");
        //console.log("saving numTab "+app.numTab);
        //console.log("saving currentTab"+app.currentTab);
        this._set("numTab", app.numTab);
        this._set("currentTab", app.currentTab);
        for (var i=0; i<app.numTab; i++) {
            //console.log("editor "+i);
            //console.log("saving name"+app.editors[i].name);
            //console.log("saving type"+app.editors[i].type);
            //console.log("saving content"+app.editors[i].text.join("\n");//._textToString());
            this._set("editor_"+i+"_name", app.editors[i].name);
            this._set("editor_"+i+"_type", app.editors[i].type);
            this._set("editor_"+i+"_content", app.editors[i].text.join("\n"));
        }
        this._set("saved", "true");
        this.saved = true;
    },

    restore: function() {
        //restoring app content with saved content
        //app.numTab = 1;
        //app.currentTab = 0;
        var num = this._get("numTab");
        for (var i=0; i<num; i++) {
            if (i==0) {
                app.createEditor(app.currentTab, "root.js", "javascript");
                app.editors[0].codeMirror.setValue(this._get("editor_0_content"));
            } else {
                var name = this._get("editor_"+i+"_name");
                var type = this._get("editor_"+i+"_type");
                var content = this._get("editor_"+i+"_content");
                app._restoreTab(name, type);
                app.editors[app.currentTab].codeMirror.setValue(content);
            }
        }
    },

    _get: function(key) {
        if (this.available) {
            return this.localStorage.getItem(key);
        }
    },

    _set: function(key, value) {
        if (this.available) {
            return this.localStorage.setItem(key, value);
        }
    }
});