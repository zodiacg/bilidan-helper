var defaultOptions = {
    "use_cookie": false,
    "source": "default",
    "d2aflags": "",
    "mpvflags": "",
    "quality": 4
}

var nmport = null;
var testflag = false;

function onNativeMessage(message){
    switch (message.command) {
        case 'echo':
            console.log("Host echo:" + message.msg);
            break;
        case 'succ':
            console.log("Successfully invoked bilidan with param:" + message.msg);
            break;
        case 'pong':
            if(testflag){
                chrome.runtime.sendMessage({command:"comp_test",msg:"succ"});
                testflag = false;
            }
            console.log("Connection test success");
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

function connection_test(){
    testflag = true;
    var host_name = "com.hoodoo.bilidanhelper";
    nmport = chrome.runtime.connectNative(host_name);
    nmport.onMessage.addListener(onNativeMessage);
    setTimeout(test_send,3000);
}

function test_send(){
    if(testflag){
    try{
        nmport.postMessage({command:"ping",msg:""});
    }catch(e){
        console.log("connection_test fail");
        chrome.runtime.sendMessage({command:"comp_test",msg:"fail_nohost"});
        testflag = false;
        nmport = null;
    }
    }
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

function onCMClicked(info,tab) {
    var url=info.linkUrl;
    var cookie;
    chrome.tabs.executeScript(tab.id,{code:"document.cookie"},function(result){
        cookie=result;
    });
    open_bilidan(url,cookie);
}

function open_bilidan(url,cookie) {
    console.log("invoked open");
    var bilidan_args={
        "use_cookie": getOption("use_cookie"),
        "cookie": getOption("use_cookie")?cookie:"",
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

chrome.contextMenus.create({
    id:"BDH",
    title:"Play in BiliDan",
    contexts:['link'],
    targetUrlPatterns:["*://*.bilibili.com/video/av*","*://acg.tv/av*"]
})

chrome.contextMenus.onClicked.addListener(onCMClicked);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.command) {
        case 'open':
            open_bilidan(request.url,request.cookie);
            return true;
        case 'init_test':
            connection_test();
            return true;
        default:
            return false;
    }
});
