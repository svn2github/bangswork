Army.AI = {
    /* AI棋盘
     * 每个元素对应棋盘相应位置 例如board[0]对应位置为0的棋盘位置
     * index: 0: role 角色号码
     *        1: group 组别
     *        2: status 是否已经翻开
     *        3: value 角色价值
     * */
    board: [],
    //最佳走法
    bestMove: [],
    //遍历深度
    depth: 3,
    //还未掀开的棋子位置
    close: [],
    roleValue: [20,60,45,35,30,26,20,16,10,27,40,1000],
    initAIBoard: function() {
        for (var i = 0; i < 60; i++) {
            var $p = Army.game.board[i],
                role = $p? $p.data("role"): null,
                group = $p? $p.data("group"): null,
                status = $p? $p.data("status"): null,
                val = Army.AI.getValueByRole(role, group, i);
                
            Army.AI.board[i] = [role, group, status, val];
        }
    },
    getValueByRole: function(role, group, pos) {
        /*
        * 角色号码  0-炸弹 1-司令 2-军长 3-师长 4-旅长 5-团长 6-营长 7-连长 8-排长 9-工兵 10-地雷 11-军旗
        * 角色价值  6-炸弹 10-司令 9-军长 8-师长 7-旅长 6-团长 5-营长 4-连长 3-排长 5-工兵 8-地雷 0-军旗
        */
/*
        var val = 0;
        if (role >= 1 || role <= 8) {
            val = 11 - role;
        } else {
            switch (role) {
                case 0:
                    val = 6;
                    break;
                case 9:
                    val = 5;
                    break;
                case 10:
                    val = 8;
                    break;
                case 11:
                    val = 0;
                    break;
            }
        }
        */
        var val = Army.AI.roleValue[role];
        //if ($.inArray(pos, Army.cfg.protect) > -1) val += 10;
        val = group == Army.game.group? -val: val;
        return val;
    },

    go: function() {
        Army.AI.close = [];
        var walkable = [],
            close = Army.AI.close,
            boardItem = null;
        
        for (var i = 0; i < 60; i++) {
            boardItem = Army.AI.board[i];
            if (boardItem) {
                if (Army.AI.checkWalkable(boardItem)) {
                    walkable.push([Army.AI.board[i],i]);
                }
                if (boardItem[2] == 0) {
                    close.push(i);
                }
            }
        }
        //console.info(Army.AI.boardValue());
        if (!walkable.length) {
            Army.action.openPieces(close[Math.floor(Math.random()*close.length)], true);
        } else {
            var move = Army.AI.minimax(Army.AI.depth, Army.AI.board, Army.game.group?0:1);
            //console.info(move, Army.AI.bestMove);
            if (Army.AI.bestMove[0] == 0) {
                Army.action.movePieces(Army.AI.bestMove[1], Army.AI.bestMove[2], true);
            } else if (Army.AI.bestMove[0] == 1){
                Army.action.killPieces(Army.AI.bestMove[1], Army.AI.bestMove[2], Army.AI.bestMove[3], true);
            } else if (Army.AI.bestMove[0] == 2){
                Army.action.openPieces(close[Math.floor(Math.random()*close.length)], true);
            }
        }

    },
    minimax: function(depth, board, turn) {
        var point, 
            scores = [], 
            action = [], 
            walkable = [],
            step = Army.cfg.step,
            AI = Army.AI,
            close = Army.AI.close;
        
        if (depth == 0) {
            return AI.boardScore(board);
        } else {
            depth -= 1;
            walkable = AI.getWalkable(board, turn);
            
            if (!walkable.length) {
                return AI.boardScore(board);
            } else {
                var walkFlag = false, actionBoard, type, i, j, killIndex;
                //遍历每一个可走的棋子的每一步走法
                for (var i = 0, len = walkable.length; i < len; i++) {
                    for (var j = 0, slen = step[walkable[i]].length; j < slen; j++) {

                        var currPos = walkable[i],
                            aimPos = step[walkable[i]][j];
                        
                        //目标位置有棋子
                        if (board[aimPos][0] != null) {
                            //status == 0 未翻开
                            if (board[aimPos][2] == 0) continue;
                            //目标棋子为己方棋子
                            if (board[aimPos][1] == turn) continue;

                            var type = AI.isKillable(currPos, aimPos, board);
                            if (type) {
                                walkFlag = true;
                                actionBoard = AI.killPieces(type, currPos, aimPos, board);
                                point = AI.minimax(depth, actionBoard, turn?0:1);
                                scores.push(point);
                                action.push([1, type, currPos, aimPos]);

                                //记录第一层杀棋子的位置
                                if (depth == Army.AI.depth - 1) killIndex = scores.length-1
                            }
                        //目标位置无棋子
                        } else if ( AI.passable(currPos, aimPos, board) ) {
                            walkFlag = true;
                            actionBoard = AI.movePieces(currPos, aimPos, board);
                            point = AI.minimax(depth, actionBoard, turn?0:1);
                            scores.push(point);
                            action.push([0, currPos, aimPos]);
                        }

                    }
                }
                //无棋可下，返回当前棋局分数
                if (!walkFlag) {
                    if (depth == Army.AI.depth-1) AI.bestMove = [2];
                    return AI.boardScore(board);
                }

                //轮到玩家，取最小值
                if (turn == Army.game.group) {  
                    var l = scores.length, i, min = scores[0];
                    for (i = 1; i < l; i++) {
                        if (min > scores[i]) {
                            min = scores[i];
                        }
                    }
                    return min;

                //轮到电脑，取最大值
                } else {
                    var l = scores.length, i, max = scores[0], maxIndex = 0, min = scores[0];
                    for (i = 1; i < l; i++) {
                        if (max < scores[i]) {
                            max = scores[i];
                            //如果是最上一层，记录最大值的位置index
                            if (depth == Army.AI.depth-1) maxIndex = i;
                        }

                        //如果是最顶层，记录最差走法
                        if (depth == Army.AI.depth-1 && min > scores[i]) min = scores[i] 
                    }

                    //如果是最顶层
                    if (depth == Army.AI.depth - 1) {
                        //console.info(max, AI.boardScore(AI.board), killIndex);
                        //记录最佳走法
                        AI.bestMove = action[maxIndex];
                        //如果存在杀棋子的步法，以及最佳走法的分数与杀棋子的分数一致，优先选择杀棋子
                        if (killIndex >= 0 && scores[maxIndex] == scores[killIndex]) AI.bestMove = action[killIndex];
                        //如果最佳走法和最差走法分数相同，则动作为open
                        if (max == min /*&& max == Army.AI.boardScore(Army.AI.board)*/) AI.bestMove = [2];
                    }
                    return max;
                }
                

            } //end if (!walkable.length)
        } //end if (depth == 0)
    },
    getWalkable: function(board, turn) {
        var walkable = []; 
        for (var i = 0; i < 60; i++) {
            if (board[i][2] == 1 &&    //status==1 翻开状态
                board[i][1] == turn &&    //
                board[i][0] != 11 &&   //不为军旗
                board[i][0] != 10){    //不为地雷
                walkable.push(i);
            }
        }
        return walkable;
    },
    killPieces: function(type, currPos, aimPos, AIBoard) {
        var board = AIBoard.slice();
        if (type == 2 || type == 3) {
            board[currPos] = [null, null, null, null];
            board[aimPos] = [null, null, null, null];
        } else {
            board[aimPos] = board[currPos].slice();
            board[currPos] = [null, null, null, null];
        }
        return board;
    },
    
    movePieces: function(currPos, aimPos, AIBoard) {
        var board = AIBoard.slice();
        board[aimPos] = board[currPos].slice();
        board[currPos] = [null, null, null, null];
        return board;
    },

    boardScore: function(board) {
        var val = 0, b;
        for (var i = 0; i < 60; i++) {
            b = board[i];
            if (b && b[2]) {
                val += b[3];
                /*
                if ($.inArray(i, Army.cfg.protect) > -1) {
                    b[1] == Army.game.group? val -= 10: val += 10;
                }
                */
            }
        }
        return val;
    },

    passable: function(piecesPos, aimPos, board) {
		var ret = false, cfg = Army.cfg;
		for (var i=0; i<cfg.step[piecesPos].length; i++) {
			if (cfg.step[piecesPos][i] == aimPos) ret = true;
		}

		//限制垂直线上的行走，如果路线中间有棋子则无法移动
		$.each(["leftVer","rightVer"], function(o,v){
		   if ($.inArray(piecesPos, cfg[v]) > -1 && $.inArray(aimPos, cfg[v]) > -1) {
				if (piecesPos < aimPos) {
					var t = piecesPos;
					piecesPos = aimPos;
					aimPos = t;
				}
				for (var i = $.inArray(aimPos, cfg[v])+1; i < $.inArray(piecesPos, cfg[v]); i++) {
                    //role != null 存在棋子
					if (board[cfg[v][i]][0] != null) {
						ret = false;
					}
				}
			}
		});

		//限制水平线上的行走，如果路线中间有棋子则无法移动
		$.each(["hori1", "hori2", "hori3", "hori4"], function(o,v){
		   if ($.inArray(piecesPos, cfg[v]) > -1 && $.inArray(aimPos, cfg[v]) > -1) {
				if (piecesPos < aimPos) {
					var t = piecesPos;
					piecesPos = aimPos;
					aimPos = t;
				}
				for (var i = $.inArray(aimPos, cfg[v])+1; i < $.inArray(piecesPos, cfg[v]); i++) {
                    //role != null 存在棋子
					if (board[cfg[v][i]][0] != null) {
						ret = false;
					}
				}
			}
		});

		return ret;
	},
    /*
     * 判断两个棋子是否可杀
     * param: currPos: 当前棋子位置
     *        aimPos: 目标棋子位置
     *        board: 棋局
     * return: 
     * */
	isKillable: function(currPos, aimPos, board) {
		if (Army.AI.passable(currPos, aimPos, board)) {
			var type = Army.game.killType(board[currPos][0], board[aimPos][0]);
			//可杀以及目标不在行营里面
			if (type && board[aimPos][1] != board[currPos][1]  && $.inArray(aimPos, Army.cfg.protect) == -1) {
                return type;
			}
		}
        return false;
	},
    checkWalkable: function(boardItem) {
        var group = Army.game.group? 0:1;
        if (boardItem[2] == 1 &&    //status==1 翻开状态
            boardItem[1] == group &&    //group为电脑
            boardItem[0] != 11 &&   //不为军旗
            boardItem[0] != 10){    //不为地雷
            return true;
        }
        return false;
    }
}
