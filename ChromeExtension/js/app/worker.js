importScripts("../lib/jshint.js")

self.onmessage = function (ev) {
	var ret, req = ev.data;

	if (req.task === "lint") {
		JSHINT(req.code, req.config);
		ret = JSHINT.data();
		ret.options = null;
		var _toCheck = req.toCheck;
		self.postMessage({ task: "lint", result: JSON.stringify(ret), toCheck: _toCheck })
	}
}