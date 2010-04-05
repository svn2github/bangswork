$(function(){
	$("#restartBtn").click(function(){
		var board = $("#board");
		Army.init.startInit();
		Army.init.createSpace(board);
		Army.init.createPieces(board);
	})
});

