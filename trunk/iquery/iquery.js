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
	document = window.document
	
iQuery.fn = iQuery.prototype = {
	init: function( selector, context ) {
		var context = context || document,
			result
			
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
}

iQuery.fn.init.prototype = iQuery.fn;

iQuery._extend = iQuery.fn._extend = function ( obj ) {
	for ( name in obj ) {
		this[ name ] = obj [ name ];
	}
	return this;
}




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
	
	makeArray: function ( arr, results ) {
		var ret = results || [];
		
		if ( arr != null ) {
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
			
			for ( var i = 0; i < elems.length; i++ ) {
				//todo：用while危险，这里每次appendel elems的元素就会减少，而下面不会，
				fragment.appendChild( elems[i] );
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
					o.className += " " + name;
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
		if ( content === undefined ) {
			var ret = "";
			for ( var i = 0; this[i]; i++ ) {
				ret += this[i].textContent;
			}
			return ret;
		} else {
			for ( var i = 0; this[i]; i++ ) {
				 this[i].textContent = content;
			}
			return this;
		}
	},
	
	html: function ( content ) {
		if ( !content ) {
			var ret = "";
			for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
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
	speeds = {
		"slow" : 15,
		"normal" : 10,
		"fast" : 5
	}
	
iQuery._extend({
	isIphone: function () {
		return navigator.appVersion.indexOf('iPhone OS ') >= 0
	},
	
	isStandalone: function() {
		return window.navigator.standalone;
	},
	orient: function() {
		return window.orientation;
	},
	
	scrollTo: function( pos, time ) {
		var speed = time,
			offset;
		scrollFlag = true;
		
		if ( typeof time == "string" ) {
			speed = speeds[time];
		}
		if ( typeof speed != "number" ) {
			speed = 10
		}
		
		//点击屏幕时停止滚动
		$().bind("touchstart", stopScroll, true);
		
		setTimeout(function(){
			offset = (pos  - window.pageYOffset)/speed;
			if ( Math.abs(offset) < 1 )  {
				offset = offset > 0? 1: -1;
			}
			window.scrollTo(0, window.pageYOffset + offset);
			if ( Math.abs(window.pageYOffset - pos) > 1 && scrollFlag) {
				setTimeout(arguments.callee, 20);
			} else {
				$().unbind("touchstart", stopScroll, true);
			}
		}, 20);
		
		function stopScroll(e) {
			scrollFlag = false;
			$().unbind("touchstart", stopScroll, true);
		}
	}
	
});

iQuery.fn._extend({
	bind: function( type, fn, useCapture ) {
		useCapture = useCapture? true: false;
		this.each(function(i, o){
			o.addEventListener( type, fn, useCapture );
		})
	},
	unbind: function( type, fn, useCapture ) {
		useCapture = useCapture? true: false;
		this.each(function(i, o){
			o.removeEventListener( type, fn, useCapture );
		});
	}
	
});

iQuery.each( ("touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend " +
			  "orientationchange click unload focus blur submit change abort " +
			  "mousemove mousedown mouseup mouseover mouseout").split(" "), function(i, o) {
	iQuery.fn[o] = function ( fn, useCapture ) {
		this.bind( o, fn, useCapture );
	}
});
iQuery.fn.touch = iQuery.fn.touchstart;
iQuery.fn.orient = iQuery.fn.orientationchange;



var rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
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
		elem.style[ name ] = value;
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
						iQuery.setCss( o, j, name[j] );
					}
				});
			}
		
		} else {
			this.each(function(i, o) {
				iQuery.setCss( o, name, value );
			});
		}
		
		return this;
	}
});


window.iQuery = window.$ = iQuery;

})(window);