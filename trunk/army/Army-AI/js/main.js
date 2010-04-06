$(function(){
	$("#restartBtn").click(function(){
		var board = $("#board");
		Army.init.startInit();
		Army.init.createSpace(board);
		Army.init.createPieces(board);
	})

    $("#descBtn").click(function(){
       $("#desc").toggle("normal"); 
    })
    $("#descCloseBtn").click(function(){
       $("#desc").fadeOut("normal"); 
    })
});

