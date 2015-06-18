var defaultOptions = {
    "use_cookie": false,
    "source": "default",
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


function open_bilidan(url,cookie) {
	console.log("invoked open");
	bilidan_args={
		"use_cookie": getOption("use_cookie"),
		"cookie": cookie,
		"source": getOption("source"),
		"d2aflags": getOption("d2aflags"),
		"mpvflags": getOption("mpvflags"),
		"quality": getOption("quality"),
		"url": url
	};

    
    chrome.runtime.sendNativeMessage("com.hoodoo.bilidanhelper",
		bilidan_args,
		function(response){
			console.log("Bilidan-Helper Host returned: " + JSON.stringify(response));
		});
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.command) {
		case 'init':
			sendResponse({"use_cookie" : getOption("use_cookie")});
			return true;
        case 'open':
            open_bilidan(request.url,request.cookie);
            return true;
        default:
            return false;
    }
});