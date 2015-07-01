(function(){
    function invoke_bilidan(){
        var msg = {};
        msg.command = "open";
        msg.cookie=document.cookie;
        msg.url=document.URL.split('#')[0].split('?')[0];
        chrome.extension.sendMessage(msg);
    }

    function init_helper(){
        var helper_button = $("<div class=\"block\" style=\"float:right;border-left:1px solid #ddd;border-right:none;position:relative;padding:0 15px;font-size:10px;cursor:pointer;\"><span class=\"title\">BDH</span></div>");
        helper_button.find('.title').click(invoke_bilidan);
        $('.player-wrapper .arc-tool-bar').append(helper_button);
    }

    $(document).ready(init_helper);
})();
