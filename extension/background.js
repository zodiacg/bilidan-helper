var defaultOptions = {
    "use_cookie": false,
    "source": default,
    "d2aflags": "",
    "mpvflags": "",
    "quality": 4
}

function getOption(key) {
	if (localStorage.getItem(key) === null) {
		localStorage.setItem(key, defaultOptions[key]);
	}
	return localStorage.getItem(key);
}

function setOption(key, value) {
	localStorage.setItem(key, value);
}

function open_bilidan(url) {
    
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.command) {
        case 'open':
            open_bilidan(request.url);
            return ture;
        default:
            return false;
    }
});