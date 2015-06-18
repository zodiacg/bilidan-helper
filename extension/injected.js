(function(){
	var bh_options = {};
	bh_options.use_cookie = false;
	
	function invoke_bilidan(){
		var msg = {};
		msg.command = "open";
		if (bh_options.use_cookie) {
			msg.cookie=document.cookie;
		}else{
			msg.cookie="";
		};
		msg.url=document.URL.split('#')[0].split('?')[0];
		chrome.extension.sendMessage(msg);
	}
	
	function init_helper(){
		chrome.extension.sendMessage(
			{"command":"init"},
			function(response){
				bh_options.use_cookie = response.use_cookie;
		});
		
		var helper_button = $("<div class=\"block\" style=\"float:right;border-left:1px solid #ddd;border-right:none;position:relative;padding:0 15px;font-size:10px;cursor:pointer;\"><span class=\"title\">BDH</span></div>");
		helper_button.find('.title').click(invoke_bilidan);
		$('.player-wrapper .arc-tool-bar').append(helper_button);
	}
	
	$(document).ready(init_helper);
})();