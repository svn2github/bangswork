/* 棋盘position:
1  2  3  4  5
6  7  8  9  10
11 12 13 14 15
16 17 18 19 20 
21 22 23 24 25 
26 27 28 29 30 

31 32 33 34 35
36 37 38 39 40
41 42 43 44 45
46 47 48 49 50
51 52 53 54 55
56 57 58 59 60
*/
var Army = {};
Army.cfg = {
    //行营位置
    protect: [12,14,18,22,24,37,39,43,47,49],

    //棋子在棋盘上的css位置，cssPosHori为left, cssPosVer为top
    cssPosHori: [11,105,199,294,387],
    cssPosVer:  [13,60,108,156,203,251,351,399,446,494,542,589],

    /* 存在棋子的data
    * pos: 在棋盘上的位置，与棋盘矩阵对应
    * role: 角色号码
    *       0-炸弹 1-司令 2-军长 3-师长 4-旅长 5-团长 6-营长 7-连长 8-排长 9-工兵 10-地雷 11-军旗
    * group: 0-黑方 1-红方
    * status: 是否已揭开 0-未揭 1-揭开
    * */
    pieces_role_arr: [0,0,1,2,3,3,4,4,5,5,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11],
    
    //棋盘上的六条快速通道
    leftVer: [6,11,16,21,26,31,36,41,46,51],
    rightVer: [10,15,20,25,30,35,40,45,50,55],
    hori1: [6,7,8,9,10],
    hori2: [26,27,28,29,30],
    hori3: [31,32,33,34,35],
    hori4: [51,52,53,54,55]
}
//棋盘上每一个位置可以走到的步法
Army.cfg.step = {
    "6": Army.cfg.leftVer.concat(Army.cfg.hori1, [1,12]),
    "26": Army.cfg.leftVer.concat(Army.cfg.hori2, 22),
    "10": Army.cfg.rightVer.concat(Army.cfg.hori1, [5,14]),
    "30": Army.cfg.rightVer.concat(Army.cfg.hori2, 24),
    "31": Army.cfg.leftVer.concat(Army.cfg.hori3, 37),
    "51": Army.cfg.leftVer.concat(Army.cfg.hori4, [47,56]),
    "35": Army.cfg.rightVer.concat(Army.cfg.hori3, 39),
    "55": Army.cfg.rightVer.concat(Army.cfg.hori4, [49,60]),

    "11": Army.cfg.leftVer.concat(12),
    "16": Army.cfg.leftVer.concat([12,17,22]),
    "21": Army.cfg.leftVer.concat(22),
    "36": Army.cfg.leftVer.concat(37),
    "41": Army.cfg.leftVer.concat([37,42,47]),
    "46": Army.cfg.leftVer.concat(47),
    "15": Army.cfg.rightVer.concat(14),
    "20": Army.cfg.rightVer.concat([14,19,24]),
    "25": Army.cfg.rightVer.concat(24),
    "40": Army.cfg.rightVer.concat(39),
    "45": Army.cfg.rightVer.concat(39,44,49),
    "50": Army.cfg.rightVer.concat(49),

    "7": Army.cfg.hori1.concat([2,12]),
    "8": Army.cfg.hori1.concat([3,12,13,14]),
    "9": Army.cfg.hori1.concat([4,14]),
    "27": Army.cfg.hori2.concat(22),
    "28": Army.cfg.hori2.concat([33,23,22,24]),
    "29": Army.cfg.hori2.concat(24),
    "32": Army.cfg.hori3.concat(37),
    "33": Army.cfg.hori3.concat([28,37,38,39]),
    "34": Army.cfg.hori3.concat(39),
    "52": Army.cfg.hori4.concat([57,47]),
    "53": Army.cfg.hori4.concat([58,47,48,49]),
    "54": Army.cfg.hori4.concat([59,49]),

    "1": [2,6],
    "2": [1,3,7],
    "3": [2,4,8],
    "4": [3,5,9],
    "5": [4,10],
    "12": [6,7,8,11,13,16,17,18],
    "13": [8,12,14,18],
    "14": [8,9,10,13,15,18,19,20],
    "17": [12,16,18,22],
    "18": [12,13,14,17,19,22,23,24],
    "19": [14,18,20,24],
    "22": [16,17,18,21,23,26,27,28],
    "23": [18,22,24,28],
    "24": [18,19,20,23,25,28,29,30],
    "37": [31,32,33,36,38,41,42,43],
    "38": [33,37,39,43],
    "39": [33,34,35,38,40,43,44,45],
    "42": [37,41,43,47],
    "43": [37,38,39,42,44,47,48,49],
    "44": [39,43,45,49],
    "47": [41,42,43,46,48,51,52,53],
    "48": [43,47,49,53],
    "49": [43,44,45,48,50,53,54,55],
    "56": [51,57],
    "57": [52,56,58],
    "58": [53,57,59],
    "59": [54,58,60],
    "60": [55,59]
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
                .data("pos", j*5+i+1)
                .appendTo(board)
                .click(function(){
                    var aimPos = $(this).data("pos"),
                        piecesPos = $(".pieces_selected").data("pos"),
                        cssPos = Army.game.getCssPosByPos(aimPos);
                    if (piecesPos && Army.game.passable(piecesPos, aimPos)) {
                        $(".pieces_selected").animate({
                            top: cssPos.top,
                            left: cssPos.left
                        }).data("pos", aimPos).removeClass("pieces_selected");
                    }
                });
            }
        }
    },
    
    /*
     * 摆放棋子
     * */
    createPieces: function(board) {
        //红/黑双方棋子
        var pieces_role1 = Army.cfg.pieces_role_arr.slice(),
            pieces_role2 = Army.cfg.pieces_role_arr.slice();

        //摆放60个棋子
        for (var i = 0; i < 60; i++) {
            //行营处不放棋子
            if ($.inArray(i+1, Army.cfg.protect) > -1) {
                continue;
            }
            
            //棋子位置
            var cssPos = Army.game.getCssPosByPos(i+1);
            //棋子角色
            var cfg = Army.init._getPiecesConfig(pieces_role1, pieces_role2);

            $("<span>", {
                "class": "pieces_c",
                css:{
                    top: cssPos.top,
                    left: cssPos.left,
                    "z-index": 1
                }
            })
            .addClass("pieces")
            .appendTo(board)
            .data("pos", i+1).data("role", cfg.role).data("group", cfg.group).data("status", 0)
            .click(function(){
                var self = $(this);

                //处于未翻开状态
                if (self.data("status") == 0) {
                    bg_position = -self.data("group")*60 + "px " + (-self.data("role")*30) + "px";
                    self.removeClass("pieces_c")
                        .css("background-position", bg_position)
                        .data("status", 1);
                    $(".pieces_selected").removeClass("pieces_selected");

                //处于翻开状态，并且未被选择
                } else if (!self.hasClass("pieces_selected")) {
                    //杀对方棋子
                    if ($(".pieces_selected").length > 0 && $(".pieces_selected").data("group") != self.data("group")) {
                        Army.game.piecesHit($(".pieces_selected"), self);
                    
                    //正常选中，军旗/地雷除外
                    } else {
                        if (self.data("role") != 10 && self.data("role") != 11) {
                            $(".pieces_selected").removeClass("pieces_selected");
                            self.addClass("pieces_selected");
                        }
                    }
                
                //处于翻开状态，已被选择，点击取消选择
                } else {
                    self.removeClass("pieces_selected");
                }
            })
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


Army.game = {
    currPieces0: Army.cfg.pieces_role_arr.slice(),
    currPieces1: Army.cfg.pieces_role_arr.slice(),
    killedPieces0: [],
    killedPieces1: [],
	
    /*
     * 处理两个棋子相碰撞
     * param: currPieces: 当前棋子
     *        aimPieces: 目标棋子
     * */
	piecesHit: function(currPieces, aimPieces) {
		var currPos   = currPieces.data("pos"),
			aimPos    = aimPieces.data("pos"),
			cssPos    = Army.game.getCssPosByPos(aimPos),
			currRole  = currPieces.data("role"),
            aimRole   = aimPieces.data("role");


		if (Army.game.passable(currPos, aimPos)) {
			var type = Army.game.killType(currRole, aimRole)
			//可杀以及目标不在行营里面
			if (type && $.inArray(aimPos, Army.cfg.protect) == -1) {
				$(".pieces_selected")
				//置于最上层
				.css("z-index", 2)
				.animate({
					top: cssPos.top,
					left: cssPos.left
				},"linear", function(){
					Army.game.killPieces(aimPieces);
					if (type == 2 || type == 3) {
						Army.game.killPieces(currPieces);
					}
					//恢复原有层级
					$(this).css("z-index", 1);
				})
				.data("pos", aimPos)
				.removeClass("pieces_selected");

			}
		}
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
     * 杀死棋子，存入数组，并删除棋子元素
     * param: pieces: 被杀死的棋子
     * */
	killPieces: function(pieces) {
		var role = pieces.data("role"),
			g = Army.game;
		if (pieces.data("group") == 0) {
			g.currPieces0.splice($.inArray(role, g.currPieces0), 1);
			g.killedPieces0.push(role);
		} else {
			g.currPieces1.splice($.inArray(role, g.currPieces1), 1);
			g.killedPieces1.push(role);
		}
		pieces.remove();
	},

	/*
	 * 获得某位置上的棋子
	 * param pos: 棋盘上的位置
	 * return: 如果此位置有棋子，返回此棋子封装后的jquery对象
	 *         如果此位置无棋子，返回null
	*/
	getPiecesByPos: function(pos) {
		var ret = null;
		$(".pieces").each(function(){
			if ($(this).data("pos") == pos) ret = $(this);
		})
		return ret;
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
		$.each(["leftVer","rightVer"], function(i,v){
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
		$.each(["hori1", "hori2", "hori3", "hori4"], function(i,v){
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
		var t = pos % 5 - 1;
		t = t == -1? 4: t;
		return {
			top: Army.cfg.cssPosVer[parseInt((pos-1)/5)],
			left: Army.cfg.cssPosHori[t]
		}
	}

}

$(function(){
    var board = $("#board");
    Army.init.createSpace(board);
    Army.init.createPieces(board);
});

