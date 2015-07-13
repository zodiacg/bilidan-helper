(function(){
    var bkg_page = chrome.extension.getBackgroundPage();
    var options = {};
    function reloadOptions(){
        options = {
            "use_cookie": bkg_page.getOption("use_cookie"),
            "source": bkg_page.getOption("source"),
            "d2aflags": bkg_page.getOption("d2aflags"),
            "mpvflags": bkg_page.getOption("mpvflags"),
            "quality": bkg_page.getOption("quality"),
        }

        $("#o_use_cookie").attr("checked",options.use_cookie);
        $("#o_source").val(options.source);
        $("#o_d2aflags").val(options.d2aflags);
        $("#o_mpvflags").val(options.mpvflags);
        $("#o_quality").val(options.quality);
    };
    function saveOptions(){
        var new_options = {};
        if($("#o_use_cookie").is(":checked")){
            new_options.use_cookie = true;
        }else{
            new_options.use_cookie = false;
        };
        new_options.d2aflags = $("#o_d2aflags").val();
        new_options.mpvflags = $("#o_mpvflags").val();
        new_options.source = $("#o_source").val();
        if(($("#o_quality").val() >= 0) && ($("#o_quality").val() <=4)){
            new_options.quality = $("#o_quality").val();
        }else{
            alert("视频质量请填写0-4之间的数值");
            return;
        };

        bkg_page.setOption("use_cookie",new_options.use_cookie);
        bkg_page.setOption("source",new_options.source);
        bkg_page.setOption("d2aflags",new_options.d2aflags);
        bkg_page.setOption("mpvflags",new_options.mpvflags);
        bkg_page.setOption("quality",new_options.quality);

        reloadOptions();
    };
    function connectTest(){
        chrome.runtime.sendMessage({command:"init_test"});
    };
    chrome.runtime.onMessage.addListener(
        function(request,sender,sendResponse){
            switch(request.command){
                case "comp_test":
                    if(request.msg==="succ"){
                        alert("Host连接测试成功");
                    }else if(request.msg==="fail_nohost"){
                        alert("Host连接测试失败！Host未正常安装");
                    }else if(request.msg==="fail_msg"){
                        alert("Host连接测试失败！Host工作不正常");
                    }
                    return true;
                default:
                    return false;
            }
        }
    )
    $(document).ready(function(){
        $("#submit").click(saveOptions);
        $("#reset").click(reloadOptions);
        $("#conntest").click(connectTest);
        reloadOptions();
    });
})();


