$(function(){
	var board = $("#board");
	Army.init.createSpace(board);
	Army.init.createPieces(board);
    Army.game.group = Army.game.turns;
});