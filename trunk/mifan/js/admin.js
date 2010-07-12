
$(document).ready(function(){
	//导航
	$(".navLink").hover(
		function(){
			$(this).css("background-color", "#ffffff").css("border","1px solid #acdae5");
		},
		function(){
			$(this).css("background-color", "#acdae5").css("border","none");
		}
	);
	
	$(".acceptBtn").click(function(){
		var id = $(this).parent().parent().find(".number").html();
		var tag = $(this).parent().find(".tagTest").val();
		var thisBtn = $(this);
		thisBtn.next().attr("disabled","disabled");
		thisBtn.attr("disabled","disabled");
		
		$.ajax({
			url:"ajaxSPost.php",
			type:"post",
			data:"id=" + id + "&tag=" + tag,
			cache:false,
			success:function(html){
				if (html == "success") {
					thisBtn.next().next().html("发送成功");
					thisBtn.next().remove();
					thisBtn.remove();
				} else {
					thisBtn.next().attr("disabled","");
					thisBtn.attr("disabled","");
					thisBtn.next().next().html('失败');
				}
			},
			error:function(){
				thisBtn.next().attr("disabled","");
				thisBtn.attr("disabled","");
				thisBtn.next().next().html('出错 ');
				
			}
		});
		
	});
	
	$(".deleteBtn").click(function(){
		var id = $(this).parent().parent().find(".number").html();
		var thisBtn = $(this);
		thisBtn.prev().attr("disabled","disabled");
		thisBtn.attr("disabled","disabled");
		
		$.ajax({
			url:"ajaxSDelete.php",
			type:"post",
			data:"id=" + id,
			cache:false,
			success:function(html){
				if (html == "success") {
					thisBtn.parent().parent().remove();
					$("#adminTip").html('已删除编号为'+id+'的消息');
					$("#adminTip").css('display','block');
				} else {
					thisBtn.prev().attr("disabled","");
					thisBtn.attr("disabled","");
					thisBtn.next().html('失败');
				}
			},
			error:function(){
				thisBtn.prev().attr("disabled","");
				thisBtn.attr("disabled","");
				thisBtn.next().html('出错 ');
				
			}
		});
		
	});
	
	
	$(".tag").click(function(){
		if ($(this).find('input').length < 1) {
			$(this).append('<input type="text" value="" class="tagTest" />');
		}
	});
	
	$(".sentMsgBtn").click(function(){
		var content = $(this).parent().parent().find(".word span").html();
		var id = $(this).parent().parent().find(".msgId").val();
		var tag = $(this).parent().parent().find(".tagTest").val();
		var thisBtn = $(this);
		thisBtn.attr("disabled","disabled");
		if (!tag) {
			tag = null;
		}
		
		$.ajax({
			url:"ajaxMsgPost.php",
			type:"post",
			data:"id=" + id + "&tag=" + tag + "&content=" + content,
			cache:false,
			success:function(html){
				if (html == "success") {
					thisBtn.next().html("已发送");
					thisBtn.remove();
				} else {
					thisBtn.attr("disabled","");
					thisBtn.next().html('失败');
				}
			},
			error:function(){
				thisBtn.attr("disabled","");
				thisBtn.next().html('出错 ');
			}
		});
	});
	

	$(".updateBtn").click(function(){
		var id = $(this).parent().parent().find(".number").html();
		var tag = $(this).parent().find(".tagTest").val();
		var statusId = $(this).parent().find(".statusId").val();
		var thisBtn = $(this);
		thisBtn.attr("disabled","disabled");
		
		$.ajax({
			url:"ajaxSUpdate.php",
			type:"post",
			data:"id=" + id + "&tag=" + tag + "&statusId=" + statusId,
			cache:false,
			success:function(html){
				if (html == "success") {
					thisBtn.next().next().html("修改成功");
					thisBtn.attr("disabled","");
				} else {
					thisBtn.attr("disabled","");
					thisBtn.next().next().html('失败');
				}
			},
			error:function(){
				thisBtn.attr("disabled","");
				thisBtn.next().next().html('出错 ');
				
			}
		});
		
	});
	

	$(".CommentDelBtn").click(function(){
		var id = $(this).prev().val();
		var msgId = $(this).prev().prev().val();
		var thisBtn = $(this);
		thisBtn.attr("disabled","disabled");
		
		$.ajax({
			url:"ajaxCDelete.php",
			type:"post",
			data:"id=" + id + "&msgId=" + msgId,
			cache:false,
			success:function(html){
				if (html == "success") {
					thisBtn.parent().parent().remove();
					$("#adminTip").html('已删除编号为'+id+'的评论');
					$("#adminTip").css('display','block');
				} else {
					thisBtn.attr("disabled","");
					thisBtn.next().html('失败');
				}
			},
			error:function(){
				thisBtn.attr("disabled","");
				thisBtn.next().html('出错 ');
				
			}
		});
	});
});

