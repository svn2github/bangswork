$(function(){
    Army.Comet.connect();
	    
});

Army.Comet = {
	_subscription: false,
	_connected: false,
    subscribeChannel: "",
    publishChannel: "",

	_connectionSucceeded: function() {
        $(".status_light_off").removeClass("status_light_off").addClass("status_light_on");

		$("#start_btn").click(function(){
			$.cometd.batch(function(){
				$.cometd.publish('/army/1/init', { type: 0 });
                $('#status b').html('waiting connect game');
                
                var _sub = $.cometd.subscribe('/army/1/init', function(msg){
                    if (msg.data.type == 0) {
                        $.cometd.unsubscribe(_sub);
                        Army.Comet._hostInit();
                        $('#status b').html('host game connect success');
                    } else {
                        $.cometd.unsubscribe(_sub);
                        Army.Comet._clientInit(msg);
                        $('#status b').html('client game connect success');
                    }
                });
			}); 
		})
	},
    _hostInit: function() {
        var board = $("#board");
        Army.init.createSpace(board);
        Army.init.createPieces(board);
        Army.game.group = 0;
        Army.game.turns = 0;
        Army.Comet.subscribeChannel = "/army/1/1";
        Army.Comet.publishChannel = "/army/1/0";
        $.cometd.publish('/army/1/init', { type: 1, pieces: Army.game.initPieces });
        Army.Comet.subscribe();
    },
    _clientInit: function(msg) {
        var board = $("#board");
        Army.init.createSpace(board);
        Army.init.createPieces(board, msg.data.pieces);
        Army.Comet.subscribeChannel = "/army/1/0";
        Army.Comet.publishChannel = "/army/1/1";
        Army.game.group = 1;
        Army.game.turns = 0
        Army.Comet.subscribe();
    },
	_metaConnect: function(message) {
		var wasConnected = Army.Comet._connected;
		Army.Comet._connected = message.successful === true;
		if (!wasConnected && Army.Comet._connected) {
			Army.Comet._connectionSucceeded();
			
		} else if (wasConnected && !Army.Comet._connected) {
			Army.Comet._connectionBroken();
		}
	},
	
	_connectionBroken: function() {
        $(".status_light_on").removeClass("status_light_on").addClass("status_light_off");
	},
	
	connect: function() {
		var cometURL = location.protocol + "//" + location.host + config.contextPath + "/cometd";
		$.cometd.configure({
			url: cometURL,
			logLevel: 'debug'
		});

		$.cometd.addListener('/meta/connect', Army.Comet._metaConnect);
		$.cometd.handshake();
	},
	
	disconnect: function(){
		$.cometd.disconnect();
	},
	
	publishOpen: function(pos) {
		$.cometd.publish(Army.Comet.publishChannel, { type: "open", pos: pos });
        Army.game.turns = Army.game.group? 0: 1;
	},
	publishMove: function(currPos, aimPos) {
		$.cometd.publish(Army.Comet.publishChannel, { type: "move", currPos: currPos, aimPos: aimPos });
        Army.game.turns = Army.game.group? 0: 1;
	},
	publishKill: function(currPos, aimPos, killType) {
		$.cometd.publish(Army.Comet.publishChannel, { type: "kill", currPos: currPos, aimPos: aimPos, killType: killType });
        Army.game.turns = Army.game.group? 0: 1;
	},

	subscribe: function() {
		if(Army.Comet._subscription) {
			$.cometd.unsubscribe(Army.Comet._subscription);
		}
		Army.Comet._subscription = $.cometd.subscribe(Army.Comet.subscribeChannel, function(msg){
			switch (msg.data.type) {
				case "open":
                    Army.action.openPieces(msg.data.pos, true);
                    break;
				case "move":
                    Army.action.movePieces(msg.data.currPos, msg.data.aimPos, true);
                    break;
				case "kill":
                    Army.action.killPieces(msg.data.killType, msg.data.currPos, msg.data.aimPos, true);
                    break;
					
			}
            Army.game.turns = Army.game.group;
		});
	}
	
}
