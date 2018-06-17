
var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		// Send message to back ground...
		// Should we highlight keywords?
		requestKeywords();
		// ----------------------------------------------------------
	}
}, 100);

function requestKeywords(){
	chrome.runtime.sendMessage({
		action: 'page_ready'
	},
	function(response) {
		console.log(response);
		handleKeywordResponse(response.switched_on, response.data)
	});
}

function handleKeywordResponse(switched_on, keywords) {
	if (switched_on) {
		var instance = new Mark(document.body);
		instance.mark(keywords, {
	    "wildcards": "enabled"
	});
}
}
