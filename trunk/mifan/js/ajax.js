
$(document).ready(function(){
	
	//评论按钮
	$(".commentBtn").hover(
		function(){
			$(this).css("backgroundColor", "#f2f2f2");
		},
		function(){
			$(this).css("backgroundColor", "#f5f5f5");
		}
	).click(function(){
		var msgId = $(this).find("a").attr("href").split("=")[1];
		var msgArea = $(this).parent().parent();
		var thisBtn = $(this);
		if (msgArea.find(".comment").length == 1) {
			$(this).css("backgroundPosition", "100% 0%");
			msgArea.find(".comment").remove();
		} else {
			$(this).prev().html('<img src="img/loading.gif" />');
			$.ajax({
				url:"ajaxphp/cmtRequest.php",
				type:"post",
				data:"id=" + msgId,
				success:function(html) {
					thisBtn.prev().html('');
					if (msgArea.find(".comment").length == 0) {
						msgArea.append(html);
						initComment(msgId, msgArea);
					}
				}
			});
			$(this).css("backgroundPosition", "100% 100%");
		}
		
	});
	
	
});


//初始化评论
function initComment(msgId, msgArea) {
	
	//提交评论
	msgArea.find(".cSubmit").click(function(){
		
		var cmtArea = $(this).parent().parent();
		var content = cmtArea.find(".cInput").val();
		
		if (content == "") {
			$(this).next().html("<b>请输入评论内容</b>");
			return ;
		}
		
		var name = cmtArea.find(".cAuthorInput").val();
		var thisBtn = $(this);
		thisBtn.attr("disabled","disabled");
		$(this).next().html('<img src="img/loading.gif" />');
		
		$.ajax({
			url:"ajaxphp/cmtPost.php",
			type:"post",
			data:"msgId=" + msgId + "&content=" + content + "&name=" + name,
			cache:false,
			success:function(html){
				if (html == "error") {
					thisBtn.attr("disabled","");
					thisBtn.next().html('<b>服务器出错，请重试</b>');
				} else {
					cmtArea.find(".cArea").append(html);
					thisBtn.attr("disabled","");
					cmtArea.find(".cInput").val("");
					cmtArea.find(".cAuthorInput").val("匿名");
					thisBtn.next().html('评论成功');
				}
			},
			error:function(){
				thisBtn.attr("disabled","");
				thisBtn.next().html('<b>请求失败，请重试</b>');
				
			}
		});
		
	});
	
	
	//评论用户名输入
	$(".cAuthorInput").focus(function(){
		$(this).next().show();
		$(this).val("");
	}).blur(function(){
		$(this).next().hide();
		if ($(this).val() == "") {
			$(this).val("匿名");
		}
	});
	
	
}