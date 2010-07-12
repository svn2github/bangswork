
$(document).ready(function(){
	leaveWord();
	$("#textInput").focus();
	$("#textInput").keydown(leaveWord).keyup(leaveWord).keydown(function(event){
		if (event.ctrlKey && event.keyCode==13) {
			$("form:first").submit();
		}
		});
	
	//标签帮助
	$("#tagTipBtn").hover(
		function(){
			$("#tagTip").show();
		},
		function(){
			$("#tagTip").hide();
		}
	);
	//导航
	$(".navLink").hover(
		function(){
			$(this).css("background-color", "#ffffff").css("border","1px solid #acdae5");
		},
		function(){
			$(this).css("background-color", "#acdae5").css("border","none");
		}
	);
	
	
try {
var pageTracker = _gat._getTracker("UA-1895639-3");
pageTracker._trackPageview();
} catch(err) {}
	
});



function leaveWord() {
	var leave = 140-$("#textInput").val().length;
	if (leave < 0) {
		$("#tip").css("color","#CC0000");
		$("#tip b").css("color","#CC0000");
		$("#tip").html("已经超出<b>" + (-leave) + "</b>个字");
	} else {
		$("#tip").css("color","#000000");
		$("#tip b").css("color","#000000");
		$("#tip").html("还可以输入<b>" + leave + "</b>个字");
	}
}

