(function (window) {

var iQuery = function( selector, context ) {
		return new iQuery.fn.init( selector, context );
	},
	
	isReady = false,
	readyList = [],
	
	// Used for trimming whitespace
	rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,
	quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,

	
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document;
	
iQuery.fn = iQuery.prototype = {
	init: function( selector, context ) {
		var result;
		
		context = context || document;
			
		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			selector = document;
		}
		
		if ( selector.iQuery ) {
			return selector;
		}
		
		if ( typeof selector === "string" ) {
			match = quickExpr.exec( selector );
			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {
				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					result = iQuery.toElem( selector );
					this.context = document;
					return iQuery.makeArray( result.childNodes, this );
					
				// HANDLE: $("#id")
				} else {
					result = document.getElementById( match[2] );

					if ( result ) {
						this.length = 1;
						this[0] = result;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}
				
			// HANDLE: $("TAG")
			} else if ( !context && /^\w+$/.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				result = document.getElementsByTagName( selector );
				return iQuery.makeArray( result, this );
			}
			
			
			this.selector = selector;
			this.context = context;
			result = context.querySelectorAll(selector);
			return iQuery.makeArray( result, this );
		}
		
		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		
		//
		if ( iQuery.isFunction( selector ) ) {
			return this.ready( selector );
		}
		
		return iQuery.makeArray( selector, this );
		
	},
	
	length: 0,
	
	selector: "",
	
	iquery: "0.1",
	
	ready: function( fn ) {
		iQuery.bindReady();
		// If the DOM is already ready
		if ( isReady ) {
			// Execute the function immediately
			fn.call( document, iQuery );

		// Otherwise, remember the function for later
		} else {
			// Add the function to the wait list
			readyList.push( fn );
		}

		return this;
	},
	
	eq : function ( i ) {
		return i === -1 ?
			this[this.length + i]:
			this[i];
	},
	
	first: function() {
		return this.eq( 0 );
	},
	
	last: function() {
		return this.eq( -1 );
	},
	
	each: function ( callback ) {
		return iQuery.each( this, callback );
	}
};

iQuery.fn.init.prototype = iQuery.fn;

iQuery._extend = iQuery.fn._extend = function ( obj ) {
	for ( var name in obj ) {
		if ( obj.hasOwnProperty(name) ) {
			this[ name ] = obj [ name ];
		}
	}
	return this;
};



iQuery._extend({
	each: function ( object, callback ) {
		if ( iQuery.isFunction( callback ) ) {
			if ( object.length === undefined ) {
				for ( var name in object ) {
					if ( callback.call( object, name, object[name] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0], i = 0, l = object.length;
					i < l && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}
		
		return object;
	},
	
	mix: function ( self, obj, o ) {
		for ( var name in obj ) {
			if ( self[ name ] === undefined || o ) {
				self[ name ] = obj[ name ];
			}
		}
		return self;
	},
	
	bindReady: function () {
		document.addEventListener( "DOMContentLoaded", function(){
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
			iQuery.ready();
		}, false );
	},

	ready: function () {
		isReady = true;
		var fn, i = 0;
		while ( (fn = readyList[ i++ ]) ) {
			fn.call( document, iQuery );
		}
		// Reset the list of functions
		readyList = null;
	},
	
	load: function ( fn ) {
		window.addEventListener( "load", fn, false );
	},
	
	makeArray: function ( arr, results ) {
		var ret = results || [];
		
		if ( arr !== null ) {
			if ( arr.length === null || typeof arr === "string"  ) {
				push.call( ret, arr );
			} else {
				var i = ret.length, j = 0;
				while ( arr[j] !== undefined ) {
					ret[ i++ ] = arr[ j++ ];
				}
				ret.length = i;
			}
		}
		
		return ret;
	},
	
	trim: function( text ) {
		return (text || "").replace( rtrim, "" );
	},

	
	isFunction: function ( obj ) {
		return typeof obj === "function";
	}
});



iQuery._extend({
	toElem: function ( elems ) {
		var fragment = document.createDocumentFragment();
		if ( elems.nodeType == 1 ) {
			return elems;
		} 
		if (typeof elems == "string" || typeof elems == "number") {
			var div = document.createElement("div");
			div.innerHTML = elems;
			elems = div.childNodes;
			
			while ( elems[0] ) {
				//todo：用while危险，这里每次appendel elems的元素就会减少，而下面不会，
				fragment.appendChild( elems[0] );
			}
			
		} else if ( elems[0] && elems[0].nodeType ) {
			for ( var i = 0; i < elems.length; i++ ) {
				fragment.appendChild( elems[i] );
			}
		}
		return fragment;
	}
});

iQuery.fn._extend({

	hasClass: function( name ) {
		var className = " " + name + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").indexOf( className ) > -1 ) {
				return true;
			}
		}
		
		return false;
	},
	
	addClass: function ( name ) {
		if ( name && typeof name == "string" ) {
			return this.each(function(i, o) {
				var className = " " + o.className + " ";
				if ( className.indexOf( " " + name + " ") < 0 ) {
					o.className += o.className? " " + name: name;
				}
			});
		}
		
		return this;
	},
	
	removeClass: function ( name ) {
		return this.each(function(i, o) {
			if ( name ) {
				var className = " " + o.className + " ";
				className = className.replace(" " + name + " ", " ");
				o.className = className.substring(1, className.length - 1);
			} else {
				o.className = "";
			}
		});
	},
	
	toggleClass: function ( name ) {
		return this.each(function(i, o) {
			var self = iQuery(o);
			if ( self.hasClass( name ) ) {
				self.removeClass( name );
			} else {
				self.addClass( name );
			}
		});
	},
	
	attr: function ( name, value ) {
		//只对第一个元素操作
		if ( value === undefined ) {
			return this[0].getAttribute( name );
		} else {
			this[0].setAttribute( name, value );
		}
		
		return this;
	},
	
	removeAttr: function ( name ) {
		return this.each(function(i, o) {
			if ( o.nodeType === 1 ) {
				o.removeAttribute( name );
			}
		});
	},
	
	text: function ( content ) {
		var ret = "", i;
		if ( content === undefined ) {
			for ( i = 0; this[i]; i++ ) {
				ret += this[i].textContent;
			}
			return ret;
		} else {
			for ( i = 0; this[i]; i++ ) {
				 this[i].textContent = content;
			}
			return this;
		}
	},
	
	html: function ( content ) {
		if ( !content ) {
			var ret = "";
			for ( var i = 0, elem; (elem = this[i]) !== null; i++ ) {
				ret += elem.innerHTML;
			}
			return ret;
		} else {
			return this.empty().append( content );
		}
	},
	
	empty: function () {
		return this.each(function(i, o) {
			while ( o && o.firstChild ) {
				o.removeChild( o.firstChild );
			}
		});
	},
	
	append: function ( elems ) {
		return this.domManip( elems, function( elem ) {
			if ( this.nodeType == 1 ) {
				this.appendChild( elem );
			}
		});
	},
	
	prepend: function ( elems ) {
		return this.domManip( elems, function( elem ) {
			if ( this.nodeType == 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},
	
	before: function ( elems ) {
		return this.domManip( elems, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},
	
	after: function ( elems ) {
		return this.domManip( elems, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},
	
	remove: function () {
		return this.each(function( i, o ){
			if ( o.parentNode ) {
				 o.parentNode.removeChild( o );
			}
		});
	},
	
	domManip: function ( args, callback ) {
		if ( this.length > 0 ) {
			var elems = iQuery.toElem( args );
			for ( var i = 0, l = this.length; i < l; i++ ) {
				callback.call( this[i], l > 1? elems.cloneNode(true): elems );
			}
		}
		return this;
		
	}
});

iQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after"
}, function( name, original ) {
	iQuery.fn[ name ] = function( selector ) {
		var ret = [], insert = iQuery( selector );
		insert[ original ]( this );
		return this;
	};
});

iQuery.fn._extend({
	find: function( selector ) {
		var ret = [];
		this.each(function(i, o){
			var result = o.querySelectorAll(selector);
			iQuery.each(result, function(i, o) {
				ret.push(o);
			});
		});
		//没有判断是否有重复元素
		return iQuery( ret );
	},
	
	parent: function() {
		var ret = [];
		this.each(function(i, o){
			ret.push(o.parentNode);
		});
		//没有判断是否有重复元素
		return iQuery( ret );
	},
	
	prev: function() {
		var ret = [];
		this.each(function(i, o){
			while (o) {
				o = o.previousSibling;
				if ( o && o.nodeType == 1 ) {
					break;
				}
			}
			ret.push(o);
		});
		return iQuery( ret );
	},
	
	next: function() {
		var ret = [];
		this.each(function(i, o){
			while (o) {
				o = o.nextSibling;
				if ( o && o.nodeType == 1 ) {
					break;
				}
			}
			ret.push(o);
		});
		return iQuery( ret );
	},
	
	siblings: function() {
		var ret = [];
		this.each(function(i, o){
			var elem = o.parentNode.firstChild;
			while (elem) {
				if ( elem.nodeType == 1 && elem != o ) {
					ret.push(elem);
				}
				elem = elem.nextSibling;
			}
		});
		return iQuery( ret );
	},
	
	children: function() {
		var ret = [];
		this.each(function(i, o){
			var elem = o.firstChild;
			while (elem) {
				if ( elem.nodeType == 1 ) {
					ret.push(elem);
				}
				elem = elem.nextSibling;
			}
		});
		return iQuery( ret );
	}
});

var scrollFlag,
	scrollSpeeds = {
		"slow" : 15,
		"normal" : 10,
		"fast" : 5
	};
	
iQuery._extend({
	isIphone: function () {
		return navigator.appVersion.indexOf('iPhone OS ') >= 0;
	},
	
	isStandalone: function() {
		return window.navigator.standalone;
	},
	orient: function() {
		return window.orientation;
	},
	
	scrollTo: function( pos, time ) {
		var speed = time,
			dom = iQuery(),
			offset,
			stopScroll = function(e) {
				scrollFlag = false;
				dom.unbind("touchstart", stopScroll, true);
			};
		scrollFlag = true;
		
		if ( typeof time == "string" ) {
			speed = scrollSpeeds[time];
		}
		if ( typeof speed != "number" ) {
			speed = 10;
		}
		
		//点击屏幕时停止滚动
		dom.bind("touchstart", stopScroll, true);
		
		setTimeout(function(){
			offset = (pos  - window.pageYOffset)/speed;
			if ( Math.abs(offset) < 1 )  {
				offset = offset > 0? 1: -1;
			}
			window.scrollTo(0, window.pageYOffset + offset);
			if ( Math.abs(window.pageYOffset - pos) > 1 && scrollFlag) {
				setTimeout(arguments.callee, 20);
			} else {
				dom.unbind("touchstart", stopScroll, true);
			}
		}, 20);
		
	},
	
	//隐藏地址栏 需要在onload里才能用
	hideBar : function() {
		$.load(function(){
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 0);
		});
	},

	setup: function( options ) {
		var defaults = {
				icon: "",
				iconGloss: true,
				startup: "",
				viewport: true,
				fullScreen: true,
				statusBar: true
			},
			html = "";
		
		options = iQuery.mix( defaults, options, true );
		// Set icon
		if ( options.icon ) {
			var precomposed = (options.iconGloss) ? '' : '-precomposed';
			html += '<link rel="apple-touch-icon' + precomposed + '" href="' + options.icon + '" />';
		}
		// Set startup screen
		if ( options.startup ) {
			html += '<link rel="apple-touch-startup-image" href="' + options.startup + '" />';
		}
		// Set viewport
		if ( options.viewport ) {
			html += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"/>';
		}
		// Set full-screen
		if ( options.fullScreen ) {
			html += '<meta name="apple-mobile-web-app-capable" content="yes" />';
			if ( options.statusBar ) {
				html += '<meta name="apple-mobile-web-app-status-bar-style" content="black" />';
			}
		}
		if ( html != "" ) {
			iQuery("head").append( html );
		}
		
	}
	
	
});

iQuery.fn._extend({
	bind: function( type, fn, useCapture ) {
		useCapture = useCapture? true: false;
		this.each(function(i, o){
			if (o) o.addEventListener( type, fn, useCapture );
		});
	},
	unbind: function( type, fn, useCapture ) {
		useCapture = useCapture? true: false;
		this.each(function(i, o){
			if (o)  o.removeEventListener( type, fn, useCapture );
		});
	}
	
});

iQuery.each( ("touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend " +
			  "webkitTransitionEnd, orientationchange click unload focus blur submit change abort scroll " +
			  "mousemove mousedown mouseup mouseover mouseout").split(" "), function(i, o) {
	iQuery.fn[o] = function ( fn, useCapture ) {
		this.bind( o, fn, useCapture );
		return this;
	};
});
iQuery.fn.touch = function ( touchFn, touchendFn, touchmoveFn, compat ) {
	if (compat && !$.isIphone()) {
		this.bind( "mousedown", touchFn );
		this.bind( "mousemove", touchmoveFn );
		this.bind( "mouseup", touchendFn );
		return this;
	}
	
	this.bind( "touchstart", touchFn );
	touchendFn && this.bind( "touchend", touchendFn );
	touchmoveFn && this.bind( "touchmove", touchmoveFn );
	return this;
};
iQuery.fn.orient = iQuery.fn.orientationchange;


var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

	
var tranSpeeds = {
	slow: 3,
	normal: 2,
	fast: 1
};

iQuery._extend({
	curCss: function( elem, name ) {
		var style = elem.style, ret,
			defaultView = elem.ownerDocument.defaultView;
		
		if ( style && style[name] ) {
			ret = style[name];
			
		} else {
			var computedStyle = defaultView.getComputedStyle( elem, null );
			name = name.replace( rupper, "-$1" ).toLowerCase();
			
			ret = computedStyle.getPropertyValue( name );
			if ( name === "opacity" && ret === "" ) {
				ret = "1";
			}
		}
		
		return ret;
		
	},
	
	setCss: function( elem, name, value ) {
		name = name.replace(rdashAlpha, fcamelCase);
		if ( typeof value === "number" && !rexclude.test(name) ) {
			value += "px";
		}
		elem.style[ name ] = value;
	},
	
	//问题1：从display:none转到display:block时无法进行动画
	//问题2：如果上一次动画未结束即进行下一个动画，则动画结束后所有传进的fn都会执行
	//	fadeIn("slow", fn1) fadeOut("slow", fn2)  在fadeIn未结束时执行fadeOut 则动画结束后fn1 fn2都会执行
	fade: function ( to, self, speed, fn ) {
		if ( typeof speed != "number" ) {
			speed = tranSpeeds[speed] || 2;
		}
		self.each( function( i, o ){
			var elem = iQuery(o)
			elem.css({
				"-webkit-transition-property": "opacity",
				"-webkit-transition-duration": speed + "s",
				"opacity": to
			});
			if ( fn ) {
				elem.bind( "webkitTransitionEnd", function(e) {
					fn(e);
					elem.unbind("webkitTransitionEnd", arguments.callee);
				});
			}
			
		});
	}
});

iQuery.fn._extend({
	css: function( name, value ) {
		if ( !this[0] ) {
			return this;
		}
		if ( value === undefined ) {
			if ( typeof name == "string" ) {
				return iQuery.curCss( this[0], name );
		
			//name is object
			} else {
				this.each(function(i, o) {
					for ( var j in name ) {
						if ( name.hasOwnProperty(j) ) {
							iQuery.setCss( o, j, name[j] );	
						}
					}
				});
			}
		
		} else {
			this.each(function(i, o) {
				iQuery.setCss( o, name, value );
			});
		}
		
		return this;
	},
	
	offset: function() {
		var elem = this[0];
		if ( elem ) {
			var offset = elem.offsetTop;
			while ( elem = elem.offsetParent ) {
				console.info(elem, elem.offsetTop);
				offset += elem.offsetTop;
			}
			return offset;
		}
		return 0;
	},
	
	show: function( speed, fn ) {
		if (!speed) {
			this.each(function(i, o) {
				iQuery(o).css("display", "block");
			});
		} else {
			this.fadeIn( speed, fn );
		}
	},
	
	hide: function( speed, fn ) {
		if (!speed) {
			this.each(function(i, o) {
				iQuery(o).css("display", "none");
			});
		} else {
			this.fadeOut( speed, fn );
		}
	},
	fadeIn: function( speed, fn ) {
		iQuery.fade( 1, this, speed, fn );
	},
	
	fadeOut: function( speed, fn ) {
		iQuery.fade( 0, this, speed, fn );
	}
});


iQuery._extend({

	/*	method, type, timeout, data, url, success, error, username, password
	*/
	ajax: function ( options ) {
		var xhr = new XMLHttpRequest(),
			//method默认为GET
			method = options.method? (options.method.toUpperCase() == "POST"? "POST": "GET") : "GET",
			timeout = options.timeout || false,
			url = options.url,
			type = options.type,
			postData, hasCompleted;
			
		if ( options.data ) {
			postData = [];
			for ( var d in options.data ) {
				if ( d && options.data.hasOwnProperty(d) ) {
					postData.push( d + "=" + encodeURIComponent( options.data[d] ) );
				}
			}
			postData = postData.join("&").replace(/%20/g, "+");
		}
		
		if ( options.timeout && options.timeout > 0 ) {
			setTimeout(function() {
					if (!hasCompleted) {
						xhr.abort();
						timeout = "absort";
						if ( options.error ) {
							options.error( xhr, "timeout" );
						}
					}
			}, options.timeout
			);
		}
		
		xhr.onreadystatechange = function () {
			if ( xhr.readyState == 4 ) {
				if ( xhr.status == 200 ) {
					var ct = xhr.getResponseHeader("content-type") || "",
						xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
						data = xhr.responseText;
					options.success && options.success( data, xhr );
				} else {
					options.error && options.error();
				}
			}
		};
		
		if (postData && method === "GET" ) {
			url += ("?" + postData);
			postData = null;
		}
		
		xhr.open( method, url, true, options.username, options.password );
		
		// 设置header
		if (options.headers) {
			for (var h in options.headers) {
				if ( options.headers.hasOwnProperty(h) ) {
					xhr.setRequestHeader(h, options.headers[h]);
				}
			}
		}
		method === "POST" && xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
		xhr.send(postData);
		return xhr;
	}
});


window.iQuery = window.$ = iQuery;

})(window);