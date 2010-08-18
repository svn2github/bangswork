(function (window) {
	var timerId,
		timers = [],
		rfxnum = /^([+-]=)?([\d+-.]+)(.*)$/,
		effect = {
			animate : function (elems, prop, duration) {
				for ( var i = 0, l = elems.length; i < l; i ++ ) {
					for ( var p in prop ) {
						var e = new effect.fx ( elems[i], p, prop[p], duration ),
							parts = rfxnum.exec(prop[p]),
							start = e.cur(),	//获得属性初始状态
							end = parseFloat( parts[2] ),
							unit = p == "opacity" ? "" : parts[3] || "px";
						e.custom( start, end, unit );
					}
				}
			},
			now : function () {
				return new Date().getTime();
			},
			stop : function (elems) {
				//stop清除timers里于传进的elems有关的元素
				for ( var i = 0, l = elems.length; i < l; i ++ ) {
					for ( var j = timers.length - 1; j >= 0; j-- ) {
						if ( timers[j].elem === elems[i] ) {
							timers.splice(j, 1);
						}
					}
				};
			},
			easing: {
				//线性变化公式
				linear: function( p, n, firstNum, diff ) {
					return firstNum + diff * p;
				},
				//缓动公式
				swing: function( p, n, firstNum, diff ) {
					return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
				}
			},
			fx : function (elem, name, val, duration) {
				this.val = val;
				this.duration = duration;
				this.elem = elem;
				this.name = name;
			}
		}
		
	effect.fx.prototype = {
		cur : function () {
			return parseFloat( this.elem.style[this.name] );
		},
		custom : function (from, to, unit) {
			this.startTime = effect.now();
			this.start = from;
			this.end = to;
			this.unit = unit;
			this.now = this.start;
			this.state = this.pos= 0;	//如果是线性变化 state会一直等于pos 如果是缓动 会通过state计算出pos 即此刻应该达到几分之几的状态
			
			//为了让step里的this指向正确，创建一个闭包
			var self = this;
			function t() {
				return self.step();
			}
			//指明这个函数对应的dom元素，在stop里可以根据这个元素指定特定dom停止动画
			t.elem = this.elem
			
			timers.push(t)
			if ( !timerId ) {
				timerId = setInterval( effect.fx.tick, 13 );
			}
		},
		step : function () {
			var t = effect.now(),
				done = true;
			
			if ( t >= this.duration + this.startTime ) {
				this.now = this.end;
				this.state = this.pos = 1;
				this.update();
				return false;
			} else {
				var n = t - this.startTime;
				this.state = n / this.duration;
				
				//如果只是线性渐变，这里可以直接this.pos = this.state
				this.pos = effect.easing.swing( this.state, n, 0, 1, this.duration);
				
				this.now = this.start + ( (this.end - this.start) * this.pos );
				this.update();
				return true;
			}
		},
		update : function () {
			this.elem.style[this.name] = this.now + this.unit;
		}
	}
	
	effect.fx.tick = function () {
		for ( var i = 0; i < timers.length; i ++ ) {
			!timers[i]() && timers.splice( i--, 1 );
		}
		!timers.length && effect.fx.stop();
	}
	effect.fx.stop = function () {
		clearInterval( timerId );
		timerId = null;
	}
	
	window.effect = effect;
})(window);