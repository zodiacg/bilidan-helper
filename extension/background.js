var defaultOptions = {
    "use_cookie": false,
    "source": "default",
    "d2aflags": "",
    "mpvflags": "",
    "quality": 0
}

var nmport = null;

function onNativeMessage(message){
    switch (message.command) {
        case 'echo':
            console.log("Host echo:" + message.msg);
            break;
        default:
            console.log("Unrecognized command from NativeMessage" + message.command);
    }
}

function onDisconnected(){
    console.log("Host disconnected");
    nmport = null;
}

function connect_host(){
    var host_name = "com.hoodoo.bilidanhelper";
    nmport = chrome.runtime.connectNative(host_name);
    nmport.onMessage.addListener(onNativeMessage);
    nmport.onDisconnect.addListener(onDisconnected);
}

function send_message(message){
    if(!nmport) connect_host();
    nmport.postMessage(message);
}

function getOption(key) {
    if (localStorage.getItem("options") === null) {
        localStorage.setItem("options", JSON.stringify(defaultOptions));
    }
    var config = JSON.parse(localStorage.getItem("options"));
    return config[key];
}

function setOption(key, value) {
    if (localStorage.getItem("options") === null) {
        localStorage.setItem("options", JSON.stringify(defaultOptions));
    }
    var config = JSON.parse(localStorage.getItem("options"));
    config[key]=value;
    localStorage.setItem("options", JSON.stringify(config));
}


function open_bilidan(url,cookie) {
    console.log("invoked open");
    var bilidan_args={
        "use_cookie": getOption("use_cookie"),
        "cookie": cookie,
        "source": getOption("source"),
        "d2aflags": getOption("d2aflags"),
        "mpvflags": getOption("mpvflags"),
        "quality": getOption("quality"),
        "url": url
    };

    var req_msg = {
        "command": "open",
        "msg": bilidan_args
    }
    
    send_message(req_msg);
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
