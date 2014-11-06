Class("Helper", {
	Helper : function() {
		this.CLASS_ERROR = "Error while creating class."
		this.counter = 0;
	},

	li : function(id, classes, content, type) {
		var c;
		if (typeof(classes) == "object") {
			c = "";
			for (var i in classes) {
				c += classes[i] + " "; 
			}
		} else if (typeof(classes) == "string") {
			c = classes;
		} else {
			throw this.CLASS_ERROR;
		}
		switch(type) {
			case "string" : {
				return "<li id='"+id+"' class='"+c+"'>"+content+"</li>";
			}
			default : {
				var li = document.createElement("li");
				li.className = c;
				li.id = id;
				li.innerHTML = content;
				return li;
			}
		}
	},

	i : function(id, classes, content, type) {
		var c;
		if (typeof(classes) == "object") {
			c = "";
			for (var i in classes) {
				c += classes[i] + " "; 
			}
		} else if (typeof(classes) == "string") {
			c = classes;
		} else {
			throw this.CLASS_ERROR;
		}
		switch(type) {
			case "string" : {
				return "<i id='"+id+"' class='"+c+"'>"+content+"</i>";
			}
			default : {
				var i = document.createElement("i");
				i.className = c;
				i.id = id;
				i.innerHTML = content;
				return i;
			}
		}
	},

	ul : function(id, classes, content, type) {
		var c;
		if (typeof(classes) == "object") {
			c = "";
			for (var i in classes) {
				c += classes[i] + " "; 
			}
		} else if (typeof(classes) == "string") {
			c = classes;
		} else {
			throw this.CLASS_ERROR;
		}
		switch(type) {
			case "string" : {
				return "<ul id='"+id+"' class='"+c+"'>"+content+"</ul>";
			}
			default : {
				var ul = document.createElement("ul");
				ul.className = c;
				ul.id = id;
				ul.innerHTML = content;
				return ul;
			}
		}
	},

	div : function(id, classes, content, type) {
		var c;
		if (typeof(classes) == "object") {
			c = "";
			for (var i in classes) {
				c += classes[i] + " "; 
			}
		} else if (typeof(classes) == "string") {
			c = classes;
		} else {
			throw this.CLASS_ERROR;
		}
		switch(type) {
			case "string" : {
				return "<div id='"+id+"' class='"+c+"'>"+content+"</div>";
			}
			default : {
				var div = document.createElement("div");
				div.className = c;
				div.id = id;
				div.innerHTML = content;
				return div;
			}
		}
	},

	span : function(id, classes, content, type) {
		var c;
		if (typeof(classes) == "object") {
			c = "";
			for (var i in classes) {
				c += classes[i] + " "; 
			}
		} else if (typeof(classes) == "string") {
			c = classes;
		} else {
			throw this.CLASS_ERROR;
		}
		switch(type) {
			case "string" : {
				return "<span id='"+id+"' class='"+c+"'>"+content+"</span>";
			}
			default : {
				var span = document.createElement("span");
				span.className = c;
				span.id = id;
				span.innerHTML = content;
				return span;
			}
		}
	},

	_isEmptyObject : function(obj) {
		return (Object.getOwnPropertyNames.call(this, obj).length == 0)
	},

	parseElement : function(object) {
		var ul = app.helper.ul(""+this.counter, "object_root", "");
		ul.appendChild(this.i(this.counter+"_selector", "fa fa-caret-right",object.constructor.name));
		//ul.innerHTML += object.constructor.name;
		this.counter += 1;

		for (var prop in object ) {
			//if (object.hasOwnProperty(prop)) {
				ul.appendChild(app.helper.li(prop, "object_prop", prop));
			//}
		}
		$(ul).data("isOpen", "false");
		$(ul).click(function() {
			if ($(this).data("isOpen") == "false") {
				//$(this).children().css("display", "block");
				$(this).children().each(function() {
					if ($(this).hasClass("object_prop")) {
						$(this).css("display", "block");
					}
				});
				$("#"+$(this).attr("id") + "_selector").removeClass().addClass("fa fa-caret-down");
				$(this).data("isOpen", "true");
			} else {
				//$(this).children().css("display", "none");
				$(this).children().each(function() {
					if ($(this).hasClass("object_prop")) {
						$(this).css("display", "none");
					}
				});
				$(this).data("isOpen", "false");
				$("#"+$(this).attr("id") + "_selector").removeClass().addClass("fa fa-caret-right");
			}
		});
		return ul;
	}
})