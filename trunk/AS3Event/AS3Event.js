//事件发送者类
var EventDispatcher = function() {
	this.listeners = {};
}
EventDispatcher.prototype = {
	addEventListener: function(type, fn, obj) {
		if (!fn) {
			throw new Error("function no found");
		}
	
		if (!this.listeners[type]) {
			this.listeners[type] = [];
		}
	
		var lis = this.listeners[type];
		if (!lis) {
			lis = [];
		}
		lis.push({"fn": fn, "obj": obj});
	},
	
	dispatchEvent: function(event) {
		var lis = this.listeners[event.type];
		if (lis && lis.length) {
			for (var i=0; i<lis.length; i++) {
				event.target = this;
				lis[i].fn.call(lis[i].obj, event)
			}
		}
	},
	
	removeEventListener: function(type, fn, obj) {
		var lis = this.listeners[type],
			ret = false;
			
		if (!lis) {
			return false;
		}
		
		for (var i=lis.length-1; i>-1; i--) {
			if (!fn || (lis[i].fn == fn && lis[i].obj == obj)) {
				delete lis[i];
				lis.splice(i, 1);
				ret = true;
			}
		}
		
		if (!lis.length) {
			delete this.listeners[type];
		}
		
		return ret;
	},
	
	hasEventListener: function(type) {
		var lis = this.listeners[type]
		return lis && lis.length > 0 ? true: false;
	}
}

//事件类
var Event = function(type) {
	this.type = type;
	this.target = null;
}
Event.prototype = {
	toString: function(){
		return this.type;
	},
	
	//clone功能未完善
	clone: function(){
		return new Event(this.type);
	}
}