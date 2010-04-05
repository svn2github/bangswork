importScripts("army.js", "army.ai.js");
var $ = {};
$.each = function( object, callback) {
	var name, i = 0,
		length = object.length
		
	for ( var value = object[0];
		i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}

	return object;
},
$.inArray = function( elem, array ) {
	if ( array.indexOf ) {
		return array.indexOf( elem );
	}

	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[ i ] === elem ) {
			return i;
		}
	}

	return -1;
}
Army.AI.go = function() {
    Army.AI.close = [];
	var walkable = [],
		close = Army.AI.close,
		boardItem = null;
	
	for (var i = 0; i < 60; i++) {
		boardItem = Army.AI.board[i];
		if (boardItem) {
			if (Army.AI.checkWalkable(boardItem, Army.game.group?0:1)) {
				walkable.push([Army.AI.board[i],i]);
			}
			if (boardItem[2] == 0) {
				close.push(i);
			}
		}
	}
	
	if (!walkable.length) {
		postMessage({
			type: "open",
			piecesPos: close[Math.floor(Math.random()*close.length)]
		});
	} else {
		var move = Army.AI.minimax(Army.AI.depth, Army.AI.board, Army.game.group?0:1, -1000, 1000);
		if (Army.AI.bestMove[0] == 0) {
			postMessage({
				type: "move",
				currPos: Army.AI.bestMove[1], 
				aimPos: Army.AI.bestMove[2]
			});
		} else if (Army.AI.bestMove[0] == 1){
			postMessage({
				type: "kill",
				killType: Army.AI.bestMove[1], 
				currPos: Army.AI.bestMove[2],
				aimPos: Army.AI.bestMove[3]
			});
		} else if (Army.AI.bestMove[0] == 2){
			postMessage({
				type: "open",
				piecesPos: close[Math.floor(Math.random()*close.length)]
			});
		}
	}

}


var errorReceiver = function(event){
    throw event.data;
};

var onmessage = function(event){
	Army.game.group = event.data.group;
	Army.AI.board = event.data.AIBoard;
	Army.AI.go()
};