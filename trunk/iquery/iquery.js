(function (window) {

var iQuery = function( selector, context ) {
		return new iQuery.fn.init( selector, context );
	},
	
	isReady = false,
	readyList = [],
	
	// Used for trimming whitespace
	rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,
	
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document
	
iQuery.fn = iQuery.prototype = {
	init: function( selector, context ) {
		var context = context || document,
			result
			
		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
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
		
		this.selector = selector;
		this.context = context;
		result = context.querySelectorAll(selector);
		return iQuery.makeArray( result, this );
	},
	
	length: 0,
	

	selector: "",
	
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
	
	eq : function ( index ) {
		return index;
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
		
			if ( arr.length == null || typeof arr === "string"  ) {
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
		if (typeof elems == "string") {
			var div = document.createElement("div");
			div.innerHTML = elems;
			elems = div.childNodes;
			
			while ( elems.length ) {
				//todo：用while危险，这里每次appendel elems的元素就会减少，而下面不会，
				fragment.appendChild( elems[0] );
			}
			return fragment.cloneNode(true);
		}
		if ( elems[0].nodeType ) {
			for ( var i = 0; i < elems.length; i++ ) {
				fragment.appendChild( elems[i] );
			}
			return fragment.cloneNode(true)
		}
		return false;
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
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var className = " " + this[i].className + " ";
				if ( className.indexOf( " " + name + " ") < 0 ) {
					this[i].className += " " + name;
				}
			}
		}
		
		return this;
	},
	
	removeClass: function ( name ) {
		for ( var i = 0, l = this.length; i < l; i++ ) {
			var elem = this[i];
			if ( name ) {
				var className = " " + elem.className + " ";
				className = className.replace(" " + name + " ", " ");
				elem.className = className.substring(1, className.length - 1);
			} else {
				elem.className = "";
			}
		}
		return this;
	},
	
	toggleClass: function ( name ) {
		for ( var i = 0, l = this.length; i < l; i++ ) {
			var self = iQuery(this[i]);
			if ( self.hasClass( name ) ) {
				self.removeClass( name );
			} else {
				self.addClass( name );
			}
		}
		return this;
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
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( this[i].nodeType === 1 ) {
				this[i].removeAttribute( name );
			}
		}
		return this;
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
	
	empty: function () {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}
		return this;
	},
	
	append: function ( elems ) {
		var elems = iQuery.toElem( elems );
		if ( elems )  {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				this[i].appendChild( elems );
			}
		}
		return this;
	},
	
	prepend: function ( elems ) {
		var elems = iQuery.toElem( elems );
		if ( elems )  {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				this[i].insertBefore( elems, this[i].firstChild );
			}
		}
		return this;
	},
	
	before: function ( elems ) {
		var elems = iQuery.toElem( elems );
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if (this[i] && this[i].parentNode) {
				this[i].parentNode.insertBefore( elems, this[i] );
			}
		}
		return this;
	},
	
	after: function ( elems ) {
		var elems = iQuery.toElem( elems );
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if (this[i] && this[i].parentNode) {
				this[i].parentNode.insertBefore( elems, this[i].nextSibling );
			}
		}
		return this;
	}
	
	
});


window.iQuery = window.$ = iQuery;

})(window);