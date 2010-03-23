/**
 * JPuzzle
 * Copyright (c) 2009 bang
 * contract me at http://webbang.net or Email: bang590@gmail.com
 */

var puzzle = function (options) {
	
	var defaults={
		//area to play, should be a jquery object
		area: $("#puzzle"),
		
		//piece num, image will be cut to pieceNum*pieceNum rectangle
		pieceNum: 2,
		
		//max width and height of image, out of limit will auto adjust
		maxWidth: 600,
		maxHeight: 400,
		
		//defualt finish function, should be override
		finish: function(){
			alert("finish");
		},		
		
		//place to put piece, Xpos and Ypos are the distance from $(this) to piece			
		pieceArea: {
			Xpos: 10,
			Ypos: 10,
			XRange: 100,
			YRange: 100
		}	
	};
	
	//custom options to take place default options
	var o = $.extend(defaults, options);
	
	//count finish piece to determine finish
	var finishPiece = 0;
	
	var area = o.area;
	var img = area.find("img");
	
	//image width and height
	var width = img.width();
	var height = img.height();
	
	//if image's width or height larger than max, adjust them
	if (width > o.maxWidth || height > o.maxHeight) {
		var scaleX = o.maxWidth/width;
		var scaleY = o.maxHeight/height;
		var scale = scaleX<scaleY? scaleX: scaleY;
		width = width*scale;
		height = height*scale;
		img.css({width: width, height: height});
	}
	
	//image url, for the piece 
	var imgUrl = area.find("img").attr("src");
	
	//the image position in area
	var Xpos = (area.width() - width) / 2;
	var Ypos = (area.height() - height) / 2;
	
	//flag array to record piece is drop or not
	var flag = [];
	for (var k=0; k<o.pieceNum; k++) flag[k] = [];
	
	//confirm the position of puzzle area is relative
	$(this).css("position","relative");
	
	//set image's opacity and position
	img.css({
		opacity: "0.3",
		position: "absolute",
		left: Xpos,
		top: Ypos
	});

	//loop for create piece and target area
	for (var i=0; i<o.pieceNum; i++) {
		for (var j=0; j<o.pieceNum; j++) {
			var piece = $('<div class="puzzle_piece" id="puzzle_'+i+'_'+j+'"><img src="'+imgUrl+'" /></div>');
			
			//show the part of image
			piece.find("img").css({
				position: "absolute",
				left: -i*width/o.pieceNum,
				top: -j*height/o.pieceNum,
				width: width, 
				height: height
			});
			
			//set the position of piece
			piece.css({
				position: "absolute",
				overflow: "hidden",
				width: width/o.pieceNum,
				height: height/o.pieceNum,
				left: o.pieceArea.Xpos+Math.random()*o.pieceArea.XRange,
				top: o.pieceArea.Ypos+Math.random()*o.pieceArea.YRange,
				zIndex: "1"
				
			});
			
			//create target area of the piece
			var target = $('<div class="target"></div>');
			target.css({
				position: "absolute",
				width: width/o.pieceNum,
				height: height/o.pieceNum,
				left: Xpos + i*width/o.pieceNum,
				top: Ypos + j*height/o.pieceNum
			});
			
			
			piece.draggable();
			target.droppable({
				accept: '#puzzle_'+i+'_'+j,
				
				//use closure to bind drop event for every target area
				drop: (function(i,j){
					return function(){
						//fixed the piece position
						$('#puzzle_'+i+'_'+j).css({
							left: Xpos + i*width/o.pieceNum,
							top: Ypos + j*height/o.pieceNum
						});
						
						//flag[i][j] show the i j piece is droped or not
						if (!flag[i][j]) {
							finishPiece ++;
							if (finishPiece == o.pieceNum*o.pieceNum) {
								o.finish();
							}
						}
						
						//set the i j piece is droped
						flag[i][j] = 1;
					};
				})(i,j),
				
				//use closure to bind deactivate event for every piece
				deactivate: (function(i,j){
					return function (){
						
						//when piece drop out of the target, set flag to false and count down finishPiece
						//the position may be float number, so can not use "==" to test if piece in target area
						if (parseInt($('#puzzle_'+i+'_'+j).css("left")) - (Xpos + i*width/o.pieceNum) > 1  &&
							parseInt($('#puzzle_'+i+'_'+j).css("top")) - (Ypos + j*height/o.pieceNum) > 1 &&
							flag[i][j] == 1){
								finishPiece --;
								flag[i][j] = 0;
							}
					};
				})(i,j)
				
			});
			
			//add target and piece to area
			area.append(target);
			area.append(piece);
		}
	}
	return ;
};
	

//timer plugin
(function($){
	
	$.fn.timer = function(options) {
		
		var defaults={
			time: 20
		};
		
		var o = $.extend(defaults, options);
		if (o.time>1000) o.time=1000;
		if (o.time<20) o.time = 20;
		
		var timer;
		var millisecond = 0;
		var second = 0;
		var minue = 0;
		var hour = 0;
		var timeArea = $(this);
		timeArea.html("00:00:00");
		
		var fixNum = function(num) {return ("0" + num).slice(-2);};
		
		var counter = function (){
			
			if (o.time == 1000) second++;
			else {
				millisecond += o.time;
				if (millisecond >= 1000) {
					second ++;
					millisecond = 0;
				}
			}
			if (second >= 60) {
				second = 0;
				minue ++;
			}
			if (minue >= 60) {
				minue = 0;
				hour ++;
			}
			if (o.time == 1000) {
				timeArea.html(fixNum(hour) + ":" + fixNum(minue) + ":" + fixNum(second));
			} else {
				timeArea.html(fixNum(hour) + ":" + fixNum(minue) + ":" + fixNum(second) + ":" + Math.floor(millisecond * 60 / 1000));
			}
		};
		
		return {
			
			startTimer: function() {
				timer = timer? timer:setInterval(counter, o.time);
			},
			
			stopTimer: function() {
				clearInterval(timer);
				timer = null;
			},
			
			clearTimer: function(){
				hour = 0;
				minue = 0;
				second = 0;
				millisecond = 0;
			},
			
			time: function(){
				return {
					hour: hour,
					minue: minue,
					second: second,
					millisecond: millisecond
				};
			}
		};
		
	};
	
})(jQuery);




//main
$(function(){
	
	//define a timer
	var time = $("#timer").timer({time:1000});
	var pieceNum;
	
	$("#loadbtn").click(function(){
		//clear the puzzle_area
		$("#puzzle_area").html("");
		
		//clear timer area
		time.clearTimer();
		time.stopTimer();
		$("#timer").html("00:00:00");
		
		pieceNum = $("#piecenum").val();
		var img = $('<img src="' + $("#imgurl").val() + '" />');
		
		//hide img before it loaded
		img.hide();
		$("#puzzle_area").append(img);
		
		//add loading img
		var loading = $('<img src="img/loading.gif" class="loading"/>');
		$("#puzzle_area").append(loading);
		
		
		img.load(function(){
			
			//show image and remove loading
			img.show();
			loading.remove();
			
			//init puzzle
			puzzle({
				area: $("#puzzle_area"),
				pieceNum: pieceNum, 
				maxWidth: 665,
				maxHeight: 515,
				finish: function(){
					time.stopTimer();
					
					var timeObj = time.time();
					var score = pieceNum*pieceNum*pieceNum*40 - (timeObj.second + timeObj.minue*60 + timeObj.hour*3600)*33;
					$("#score_area").show("normal");
					$("#black_cover").show();
					$("#score").html(score);
					
					$(".puzzle_piece").remove();
					$("#puzzle_area").find("img").css("opacity","1");
				},
				pieceArea: {
					Xpos: 700,
					Ypos: 10,
					XRange: 100,
					YRange: 400
				}
			});
			
			time.startTimer();
		});
		
		
	});
	
	
	$("#black_cover").click(function(){
		$(this).hide();
		$("#rank").hide("normal");
		$("#score_area").hide("normal");
	});
	$("#black_cover").css({
		opacity: 0.5,
		height: $(document).height(),
		width: $(document).width()
	});
	
	$("#rank").load("rank/rankRead.php");
	$("#rankbtn").click(function(){
		$("#black_cover").show();
		$("#rank").show("normal");
	});
	
	$("#photo_select").change(function(){
		$("#imgurl").val($(this).val());
	});
	
	$("#name").focus(function(){
		$(this).val("");
	});
	
	
	//submit data to rank.php
	$("#submitbtn").click(function(){
		var score = $("#score").html();
		var name = $("#name").val();
		if (name === "" || name.length > 15) {
			$("#name").val("please input your name, less than 15 word");
			return;
		}
		
		$("#submit_loading").show();
		$.ajax({
			type: "POST",
			url: "rank/rank.php",
			data: "score="+ score + "&name=" + name,
			success: function(){
				$("#submit_loading").hide();
				
				//update content of rank
				$.ajax({
					type: "GET",
					cache: false,
					url: "rank/rankRead.php",
					success: function(data){
						$("#rank").html(data);
						$("#score_area").hide("normal");
						$("#rank").show("normal");
					}
				});	
				
			}
		});	//end of ajax
	});//end of click
});//end of document ready

