/* 棋盘position:
0  1  2  3  4
5  6  7  8  9
10 11 12 13 14
15 16 17 18 19 
20 21 22 23 24 
25 26 27 28 29 

30 31 32 33 34
35 36 37 38 39
40 41 42 43 44
45 46 47 48 49
50 51 52 53 54
55 56 57 58 59
*/
var Army = {};
Army.cfg = {
    //行营位置
    protect: [11,13,17,21,23,36,38,42,46,48],

    //棋子在棋盘上的css位置，cssPosHori为left, cssPosVer为top
    cssPosHori: [10,104,198,293,386],
    cssPosVer:  [12,59,107,155,202,250,350,398,445,493,541,588],
	
    /* 存在棋子的data
    * pos: 在棋盘上的位置，与棋盘矩阵对应
    * role: 角色号码
    *       0-炸弹 1-司令 2-军长 3-师长 4-旅长 5-团长 6-营长 7-连长 8-排长 9-工兵 10-地雷 11-军旗
    * group: 0-黑方 1-红方
    * status: 是否已揭开 0-未揭 1-揭开
    * */
    pieces_role_arr: [0,0,1,2,3,3,4,4,5,5,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11],
    
    //棋盘上的六条快速通道
    leftVer: [5,10,15,20,25,30,35,40,45,50],
    rightVer: [9,14,19,24,29,34,39,44,49,54],
    hori1: [5,6,7,8,9],
    hori2: [25,26,27,28,29],
    hori3: [30,31,32,33,34],
    hori4: [50,51,52,53,54]
}
//棋盘上每一个位置可以走到的步法
Army.cfg.step = {
    "5": Army.cfg.leftVer.concat(Army.cfg.hori1, [0,11]),
    "25": Army.cfg.leftVer.concat(Army.cfg.hori2, 21),
    "9": Army.cfg.rightVer.concat(Army.cfg.hori1, [4,13]),
    "29": Army.cfg.rightVer.concat(Army.cfg.hori2, 23),
    "30": Army.cfg.leftVer.concat(Army.cfg.hori3, 36),
    "50": Army.cfg.leftVer.concat(Army.cfg.hori4, [46,55]),
    "34": Army.cfg.rightVer.concat(Army.cfg.hori3, 38),
    "54": Army.cfg.rightVer.concat(Army.cfg.hori4, [48,59]),

    "10": Army.cfg.leftVer.concat(11),
    "15": Army.cfg.leftVer.concat([11,16,21]),
    "20": Army.cfg.leftVer.concat(21),
    "35": Army.cfg.leftVer.concat(36),
    "40": Army.cfg.leftVer.concat([36,41,46]),
    "45": Army.cfg.leftVer.concat(46),
    "14": Army.cfg.rightVer.concat(13),
    "19": Army.cfg.rightVer.concat([13,18,23]),
    "24": Army.cfg.rightVer.concat(23),
    "39": Army.cfg.rightVer.concat(38),
    "44": Army.cfg.rightVer.concat(38,43,48),
    "49": Army.cfg.rightVer.concat(48),

    "6": Army.cfg.hori1.concat([1,11]),
    "7": Army.cfg.hori1.concat([2,11,12,13]),
    "8": Army.cfg.hori1.concat([3,13]),
    "26": Army.cfg.hori2.concat(21),
    "27": Army.cfg.hori2.concat([32,22,21,23]),
    "28": Army.cfg.hori2.concat(23),
    "31": Army.cfg.hori3.concat(36),
    "32": Army.cfg.hori3.concat([27,36,37,38]),
    "33": Army.cfg.hori3.concat(38),
    "51": Army.cfg.hori4.concat([56,46]),
    "52": Army.cfg.hori4.concat([57,46,47,48]),
    "53": Army.cfg.hori4.concat([58,48]),

    "0": [1,5],
    "1": [0,2,6],
    "2": [1,3,7],
    "3": [2,4,8],
    "4": [3,9],
    "11": [5,6,7,10,12,15,16,17],
    "12": [7,11,13,17],
    "13": [7,8,9,12,14,17,18,19],
    "16": [11,15,17,21],
    "17": [11,12,13,16,18,21,22,23],
    "18": [13,17,19,23],
    "21": [15,16,17,20,22,25,26,27],
    "22": [17,21,23,27],
    "23": [17,18,19,22,24,27,28,29],
    "36": [30,31,32,35,37,40,41,42],
    "37": [32,36,38,42],
    "38": [32,33,34,37,39,42,43,44],
    "41": [36,40,42,46],
    "42": [36,37,38,41,43,46,47,48],
    "43": [38,42,44,48],
    "46": [40,41,42,45,47,50,51,52],
    "47": [42,46,48,52],
    "48": [42,43,44,47,49,52,53,54],
    "55": [50,56],
    "56": [51,55,57],
    "57": [52,56,58],
    "58": [53,57,59],
    "59": [54,58]
}

Army.init = {
    /* 
     * 创建棋盘上每个位置的按钮
     * */
    createSpace: function(board){
         for (var i=0; i<5; i++) {
            for (var j=0; j<12; j++){
                $("<span>", {
                    "class": "space",
                    css: {
                        top: Army.cfg.cssPosVer[j],
                        left: Army.cfg.cssPosHori[i]
                    }
                })
                .data("pos", j*5+i)
                .appendTo(board)
                .click(Army.init._spaceClick);
            }
        }
    },
    
    /*
     * 点击空白处执行的函数
     * */
    _spaceClick: function() {
        //turns==group时轮到当前玩家下棋
        if (Army.game.turns == Army.game.group) {
            var aimPos = $(this).data("pos"),
                piecesPos = $(".pieces_selected").data("pos"),
                currPieces = $(".pieces_selected");
            console.info(piecesPos, aimPos);
            if (piecesPos != null && Army.game.passable(piecesPos, aimPos)) {
                Army.action.movePieces(piecesPos, aimPos);
            }
        }
    },
    /*
     * 摆放棋子
     * */
    createPieces: function(board, initPieces) {
        //红/黑双方棋子
        var pieces_role1 = Army.cfg.pieces_role_arr.slice(),
            pieces_role2 = Army.cfg.pieces_role_arr.slice();

        //摆放60个棋子
        for (var i = 0; i < 60; i++) {
            //行营处不放棋子
            if ($.inArray(i, Army.cfg.protect) > -1) {
                Army.game.board.push(null);
                continue;
            }
            
            //棋子位置
            var cssPos = Army.game.getCssPosByPos(i);
            
            //棋子角色
            //随机创建棋子
            if (!initPieces) {
                var cfg = Army.init._getPiecesConfig(pieces_role1, pieces_role2);
                Army.game.initPieces.push([cfg.role, cfg.group]);
            
            //通过参数传递棋子摆放
            } else {
				var pieces = initPieces.shift();
                var cfg = {role:pieces[0], group:pieces[1]};
            }
			
            var pieces = $("<span>", {
                "class": "pieces_c",
                css:{
                    top: cssPos.top,
                    left: cssPos.left,
                    "z-index": 1
                }
            })
            .addClass("pieces")
            .appendTo(board)
            .data("pos", i).data("role", cfg.role).data("group", cfg.group).data("status", 0)
            .click(Army.init._piecesClick);

            Army.game.board.push(pieces);
        }
        Army.AI.refreshAIBoard();
    },
    
    /*
     * 点击棋子执行的函数
     * */
    _piecesClick: function() {
                      /*
        var self = $(this);
        console.info(Army.AI.board[self.data("pos")][0] == self.data("role"))
        console.info(Army.AI.board[self.data("pos")][1] == self.data("group"))
        console.info(Army.AI.board[self.data("pos")][2] == self.data("status"))
        console.info(self.data("role") == Army.game.board[self.data("pos")].data("role"))
        console.info(self.data("group") == Army.game.board[self.data("pos")].data("group"))
        console.info(self.data("status") == Army.game.board[self.data("pos")].data("status"))
        */

        //turns==group时轮到当前玩家下棋
        if (Army.game.turns == Army.game.group) {
            var self = $(this);

            //处于未翻开状态
            if (self.data("status") == 0) {
                Army.action.openPieces(self.data("pos"));

            //处于翻开状态，并且未被选择
            } else if (!self.hasClass("pieces_selected")) {
                //杀对方棋子
                if ($(".pieces_selected").length > 0 && $(".pieces_selected").data("group") != self.data("group")) {
                    Army.game.piecesHit($(".pieces_selected"), self);
                
                //正常选中，军旗/地雷除外，敌人的棋子除外
                } else {
                    if (self.data("role") != 10 && self.data("role") != 11 && self.data("group") == Army.game.group) {
                        $(".pieces_selected").removeClass("pieces_selected");
                        self.addClass("pieces_selected");
                    }
                }
            
            //处于翻开状态，已被选择，点击取消选择
            } else {
                self.removeClass("pieces_selected");
            }
        }
    },
    /*
     * 摆放棋子时随机抽取出棋子
     * param: role1:黑方棋子数组
     *        role2:红方棋子数组
     * return: 对象obj, obj.role为此棋子角色，obj.group为此棋子分组
     * */
    _getPiecesConfig: function(role1, role2) {
        var group = Math.floor(Math.random()*2), role, index;
        if (role1.length == 0) {
            group = 1;
        } else if (role2.length == 0) {
            group = 0;
        }
        if (group == 0) {
            index = Math.floor(Math.random()*role1.length);
            role = role1[index];
            role1.splice(index, 1);
        } else {
            index = Math.floor(Math.random()*role2.length);
            role = role2[index];
            role2.splice(index, 1);     
        }
        return {
             role: role,
             group: group
        }
    }
}

Army.action = {
    /*
     * 翻开棋子
     * @param pos 棋子的位置
     * @param isRemote 是否对方发出的动作
     * */
    openPieces: function(pos, isRemote) {
        var pieces = Army.game.getPiecesByPos(pos),
            bg_position = -pieces.data("group")*60 + "px " + (-pieces.data("role")*30) + "px";
        
		/*
        //第一次揭开棋子，判定双方角色
        if (Army.game.firstStep) {
            Army.game.firstStep = false;
            var group = Army.game.getPiecesByPos(pos).data("group");
            if (isRemote) {
                Army.game.group = group? 0:1;
                Army.game.turns = Army.game.group;
            } else {
                Army.game.group = group;
                Army.game.turns = Army.game.group? 0:1;
            }
        }
		*/

        //第一次揭开棋子，判定角色
        if (Army.game.firstStep) {
            Army.game.firstStep = false;
            Army.game.group = Army.game.getPiecesByPos(pos).data("group");
            Army.game.turns = Army.game.group;
            
            //默认group为0，如果此时group为1，需要修改AI里的board表
            if (Army.game.group == 1) Army.AI.refreshAIBoard();
        }

        pieces.removeClass("pieces_c")
            .css("background-position", bg_position)
            .data("status", 1);
        $(".pieces_selected").removeClass("pieces_selected");

        Army.action.go("open", isRemote, {
            pos: pos
        })
    },

    /*
     * 杀死棋子
     * @param type 杀死棋子的类型  
     *             1: 普通大吃小
	 *             2: 俩棋子地位相等
	 *             3: 有一方是炸弹,且目标不为军旗
	 *             4: 工兵挖地雷
     * @param currPos 当前棋子位置
     * @param aimPos 目的棋子位置
     * @param isRemote 是否对方发出的动作
     * */
    killPieces: function(type, currPos, aimPos, isRemote) {
		var currPieces = Army.game.getPiecesByPos(currPos),
			aimPieces  = Army.game.getPiecesByPos(aimPos),
            cssPos     = Army.game.getCssPosByPos(aimPos);

        currPieces
        //置于最上层
        .css("z-index", 2)
        .animate({
            top: cssPos.top,
            left: cssPos.left
        },"linear", function(){
            Army.action._removePieces(aimPieces);
            if (type == 2 || type == 3) {
                Army.action._removePieces(currPieces);
            }
            //恢复原有层级
            $(this).css("z-index", 1);
        })
        .data("pos", aimPos);

        $(".pieces_selected").removeClass("pieces_selected")
        Army.action.go("kill", isRemote, {
            currPos: currPos,
            aimPos: aimPos,
            killType: type,
			currPieces: currPieces
        })
    },
    
    /*
     * 移动棋子
     * @param currPos 当前棋子位置
     * @param aimPos 目的位置
     * @param isRemote 是否对方发出的动作
     * */
    movePieces: function(currPos, aimPos, isRemote) {
        var cssPos = Army.game.getCssPosByPos(aimPos),
            currPieces = Army.game.getPiecesByPos(currPos);
        currPieces.animate({
            top: cssPos.top,
            left: cssPos.left
        }).data("pos", aimPos).removeClass("pieces_selected");

        $(".pieces_selected").removeClass("pieces_selected")
        Army.action.go("move", isRemote, {
            currPos: currPos,
            aimPos: aimPos,
			currPieces: currPieces
        });
    },
    /*
     * 移除棋子，存入数组，并删除棋子元素
     * param: pieces: 被杀死的棋子
     * */
    _removePieces: function(pieces) {
		var role = pieces.data("role"),
			g = Army.game;
		if (pieces.data("group") == 0) {
			g.currPieces0.splice($.inArray(role, g.currPieces0), 1);
			g.killedPieces0.push(role);
		} else {
			g.currPieces1.splice($.inArray(role, g.currPieces1), 1);
			g.killedPieces1.push(role);
		}
        Army.action._updateKilledPieces(pieces.data("group"), pieces.data("role"));
		pieces.remove();
	},

    /*
     * 更新被杀棋子的显示
     * @param group 被杀棋子的组别
     * @param role  被杀棋子的角色
     * */
    _updateKilledPieces: function(group, role) {
        var $killedPieces = group? $("#killedPieces0"): $("#killedPieces1"),
            found = false;

        $killedPieces.find(".killedPieces_item").each(function(){
            var $this = $(this);
            if ($this.data("role") == role) {
                found = true;
                if ($this.find("b").length > 0) {
                    $this.find("b").text("*" + (parseInt($this.find("b").text().substr(1)) + 1) );
                } else {
                    $this.html("<b>*2</b>");
                }
            }
        });

        if (!found) {
            var bg_position = -group*60 + "px " + (-role*30) + "px";
            $("<span>", {
                "class": "killedPieces_item",
                css: {
                    "background-position": bg_position
                }
            })
            .appendTo($killedPieces)
            .data("role", role)
        }
    },

    /* 
     * 每走一步执行的函数
     * */
    go: function(type, isRemote, obj) {
		/*
        if (!isRemote) {
            switch (type) {
                case "open":
                    Army.Comet.publishOpen(obj.pos);
                    break;
                case "move":
                Army.Comet.publishMove(obj.currPos, obj.aimPos);
                    break;
                case "kill":
                    Army.Comet.publishKill(obj.currPos, obj.aimPos, obj.killType);
                    break;
            }
            Army.game.turns = Army.game.group? 0:1;
        } else {
            Army.game.turns = Army.game.group;
        }*/
        switch (type) {
            case "open":
                //status为1
                Army.AI.board[obj.pos][2] = 1;
                break;

            case "move":
                Army.game.board[obj.currPos] = null
                Army.game.board[obj.aimPos] = obj.currPieces;
                
                var role = obj.currPieces.data("role"),
                    group = obj.currPieces.data("group"),
                    status = obj.currPieces.data("status"),
                    val = Army.AI.getValueByRole(role, group);
                Army.AI.board[obj.currPos] = [null, null, null, null];
                Army.AI.board[obj.aimPos] = [role, group, status, val];
                break;

            case "kill":
                Army.game.board[obj.currPos] = null;
                Army.AI.board[obj.currPos] = [null, null, null, null];

                if (obj.killType == 2 || obj.killType == 3) {
                    Army.game.board[obj.aimPos] = null;
                    Army.AI.board[obj.aimPos] = [null, null, null, null];
                } else {
                    Army.game.board[obj.aimPos] = obj.currPieces;

                    var role = obj.currPieces.data("role"),
                        group = obj.currPieces.data("group"),
                        status = obj.currPieces.data("status"),
                        val = Army.AI.getValueByRole(role, group);
                    Army.AI.board[obj.aimPos] = [role, group, status, val];
                }

                break;
        }
        if (!isRemote) {
            setTimeout(Army.AI.go, 50);
        }
        Army.game.turns = Army.game.turns? 0:1;
        //Army.game.group = Army.game.group? 0:1;
    }
}

Army.game = {
    //双方剩余棋子数组
    currPieces0: Army.cfg.pieces_role_arr.slice(),
    currPieces1: Army.cfg.pieces_role_arr.slice(),
    //双方被杀棋子数组
    killedPieces0: [],
    killedPieces1: [],
    //初始化棋盘的棋位置
    initPieces: [],
    //当前玩家角色
    group: 0,
    //轮到哪一方玩家下
    turns: 0,
    //是否为第一步
    firstStep: true,
	board: [],
	
    /*
     * 处理两个棋子相碰撞
     * param: currPieces: 当前棋子
     *        aimPieces: 目标棋子
     * */
	piecesHit: function(currPieces, aimPieces) {
		var currPos   = currPieces.data("pos"),
			aimPos    = aimPieces.data("pos"),
			currRole  = currPieces.data("role"),
            aimRole   = aimPieces.data("role");

		if (Army.game.passable(currPos, aimPos)) {
			var type = Army.game.killType(currRole, aimRole)
			//可杀以及目标不在行营里面
			if (type && $.inArray(aimPos, Army.cfg.protect) == -1) {
                Army.action.killPieces(type, currPos, aimPos);
                return true;
			}
		}

        return false;
	},
	

	/*
	 * 两棋子相碰出现的情况
	 * param: currRole: 移动的棋子的角色
	 *        aimRole:  目标棋子的角色
	 * return: 1: 普通大吃小
	 *         2: 俩棋子地位相等
	 *         3: 有一方是炸弹,且目标不为军旗
	 *         4: 工兵挖地雷
	 *         null: 无符合条件的规则
	 * */
	killType: function(currRole, aimRole) {
		
		//普通大吃小
		if (currRole > 0 && currRole < 10 && aimRole > 0 && aimRole < 10 && currRole < aimRole)
			return 1;
		//俩棋子地位相等
		if (currRole == aimRole) 
			return 2;
		//双方有一方是炸弹，且目标不为军旗
		if ((currRole == 0 || aimRole == 0) && aimRole != 11) 
			return 3;
		//工兵挖地雷
		if (currRole == 9 && aimRole == 10)
			return 4;

		return null;
	},
    

	/*
	 * 获得某位置上的棋子
	 * param pos: 棋盘上的位置
	 * return: 如果此位置有棋子，返回此棋子封装后的jquery对象
	 *         如果此位置无棋子，返回null
	*/
	getPiecesByPos: function(pos) {
        /*
		var ret = null;
		$(".pieces").each(function(){
			if ($(this).data("pos") == pos) ret = $(this);
		})
		return ret;
        */
        return Army.game.board[pos];
	},
	
    /* 
     * 判断棋子是否可以移动到目标位置
     * param: piecesPos: 当前棋子位置
     *        aimPos: 目标位置
     * return: true: 可以移动
     *         false: 不可移动
     * */
	passable: function(piecesPos, aimPos) {
		var ret = false;
		for (var i=0; i<Army.cfg.step[piecesPos].length; i++) {
			if (Army.cfg.step[piecesPos][i] == aimPos) ret = true;
		}

		//限制垂直线上的行走，如果路线中间有棋子则无法移动
		$.each(["leftVer","rightVer"], function(o,v){
		   if ($.inArray(piecesPos, Army.cfg[v]) > -1 && $.inArray(aimPos, Army.cfg[v]) > -1) {
				if (piecesPos < aimPos) {
					var t = piecesPos;
					piecesPos = aimPos;
					aimPos = t;
				}
				for (var i = $.inArray(aimPos, Army.cfg[v])+1; i < $.inArray(piecesPos, Army.cfg[v]); i++) {
					if (Army.game.getPiecesByPos(Army.cfg[v][i])) {
						ret = false;
					}
				}
			}
		});

		//限制水平线上的行走，如果路线中间有棋子则无法移动
		$.each(["hori1", "hori2", "hori3", "hori4"], function(o,v){
		   if ($.inArray(piecesPos, Army.cfg[v]) > -1 && $.inArray(aimPos, Army.cfg[v]) > -1) {
				if (piecesPos < aimPos) {
					var t = piecesPos;
					piecesPos = aimPos;
					aimPos = t;
				}
				for (var i = $.inArray(aimPos, Army.cfg[v])+1; i < $.inArray(piecesPos, Army.cfg[v]); i++) {
					if (Army.game.getPiecesByPos(Army.cfg[v][i])) {
						ret = false;
					}
				}
			}
		});

		return ret;
	},

    /*
     * 通过棋盘上的位置获取此位置上的css位置属性
     * param: pos:棋盘上的位置
     * return: obj.top & obj.left
     * */
	getCssPosByPos: function(pos){
		var t = pos % 5;
		return {
			top: Army.cfg.cssPosVer[parseInt((pos)/5)],
			left: Army.cfg.cssPosHori[t]
		}
	}

}