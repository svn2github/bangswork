/**
 * @author bang
 */

//检测接口类
var Interface = function(name, methods){
	if (arguments.length != 2) {
		throw new Error("Interface constructor called with" + arguments.length + "arguments, but expected exactly 2.");
	}
	
	this.name = name;
	this.methods = [];
	for (var i=0; i < methods.length; i++){
		if (typeof methods[i] != 'string') {
			throw Error("Interface constructor expects method names to be passed in as a string.");
		}
		this.methods.push(methods[i]);
	}
};
//接口类静态方法
Interface.ensureImplements = function(object){
	if (arguments.length <2 ) {
		throw new Errow("Function Interface.ensureImplements call with" + arguments.length + "arguments, but expected at least 2.");
	}
	
	for (var i = 1; i < arguments.length; i++) {
		var interfaceObj = arguments[i];
		if (interfaceObj.constructor !== Interface) {
			throw new Error ("Function Interface.ensureImplements expects arguments weo and above to be instances of Interface.");
		}
		
		for (var j = 0; j<interfaceObj.methods.length; j++) {
			var method = interfaceObj.methods[j];
			if (!object[method] || typeof object[method] !== 'function'){
				throw new Error("Function Interface.ensureImplements: object does not implement the " + interfaceObj.name + " interface. Method " + method + " was not found.");
			}
		}
	}
};
/*
//mixin classes
function augment(receivingClass, givingClass) {
	if (arguments[2]) { //如果给出了继承特定的方法
		for (var i = 2; i < arguments.length; i++){
			receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
		}
	}
	else {	//继承所有方法
		for (methodName in givingClass.prototope) {
			if (!receivingClass.prototpye[methodName]) {
				receivingClass.prototype[methodName] = givingClass.prototype[methodName];
			}
		}
	}
}
*/

//继承
function extend(subClass, superClass) {
	var F = function() {};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	
	subClass.superclass = superClass.prototype;
	if (superClass.prototype.constructor == Object.prototype.constructor) {
		superClass.prototype.constructor = superClass;
	}
}

//接口
var ReadData = new Interface('ReadData', ['userMsg', 'friendsMsg', 'friendList'])


/* 
 * 数据控制类
 * 作为父类
 */
var DataCtrl = function() {
	//储存数据的字符串
	this.xml = '<?xml version="1.0" encoding="UTF-8"?>';		
}
DataCtrl.prototype = {
	
	/*
	 * 把数据追加到字符串this.xml
	 */
	appendXml: function(content, date, author) {
		//如果有传入作者参数，则是读取朋友信息
		if (author) {
			this.xml += '<item>\n	<content>' + content +'</content>\n	<date>' + date +'</date>\n	<author>' + author + '</author>\n</item>\n';
		} else {
			this.xml += '<item>\n	<content>' + content +'</content>\n	<date>' + date +'</date>\n</item>\n';
		}
	},
	
	/*
	 * 把数据写进文件
	 * 参数说明：
	 * file：文件，包含路径
	 */
	writeToFile: function(file) {
		var stream = new air.FileStream();
		stream.open(file, air.FileMode.WRITE);
		
		//如果停止读取后储存xml，会没有</message>
		if (!(/"<\/message>"/.test(this.xml))) {
			this.xml += "</message>\n</main>"
		}
		stream.writeUTFBytes(this.xml);
		stream.close();
	},
	
	
	/*
	 * 创建每一页的div
	 */
	createDiv: function(divId, page, startPage){
		document.getElementById(divId).innerHTML += '<div id="page' + page + '"></div>';
		document.getElementById("page" + page).style.display = "none";
		if (page == startPage) {
			document.getElementById("page"+startPage).style.display = "block";
		}
		document.getElementById("pageSelect").innerHTML += '<option value="' + page + '">' + page + '</option>';
	},
	
	/*
	 * 向页面追加数据
	 */
	appendDom: function(divId, content, date, author){
		if (!author) {
			document.getElementById(divId).lastChild.innerHTML += '<div class="c">' + content + '</div><div class="d">' + date + '</div>';
		} else {
			document.getElementById(divId).lastChild.innerHTML += '<div class="c">' + content + '</div><div class="a">' + author +'</div><div class="d">' + date + '</div>';
		}
	},
	
	
	/*
	 * 读取数据时调用的函数
	 */
	reading: function(id, page){
		document.getElementById(id).innerHTML = "loading page " + page;
		$("#pageSelect").hide();
	},
	
	/*
	 * 暂停数据时调用的函数
	 */
	readPause: function(id, page){
		document.getElementById(id).innerHTML = "stop in page " + (page-1);
		$("#pageSelect").fadeIn("slow");
	},
	
	/*
	 * 数据读取结束时调用的函数
	 */
	readEnd: function(id, page, startPage){
		document.getElementById(id).innerHTML = "complete, total loaded " + (page-startPage) + " pages.";
		$("#pageSelect").fadeIn("slow");
		$("#loadStop").hide();
		$("#loadStart").hide();
	},
	
	/*
	 * 没有找到数据时调用的函数
	 */
	readNone: function(id){
		document.getElementById(id).innerHTML = "name error, haven't found any data.";
		
		//权宜之计 隐藏控制栏
		$("#loadCtrl").fadeOut("slow");
		$("#pageCtrl").fadeOut("slow");
		
	}
}

/*
 * 饭否类 
 * 继承接口ReadData
 * 继承类DataCtrl
 */
var Fanfou = function(id, totalPage, page){ //implement ReadData
	Fanfou.superclass.constructor.call(this);
	
	//用户ID
	this.id = id;	
	
	//储存起始页码
	this.startPage = page;
	
	//起始页码，默认为1				
	if (!page) {
		this.page = 1;				
	} else {
		this.page = page;
	}
	
	//读取总页数
	this.totalPage = totalPage;		
	
	
	//是否暂停读取
	this.isStop = 0; 				
	
	//读取类型 是user还是friends 用于继续读取的start()函数
	this.readType = "";
	
	//设置要添加到的DIV块ID
	this.setDivId = function(divId) {
		this.divId = divId;
	}
	
	//设置状态栏ID
	this.setStateId = function(stateId) {
		this.stateId = stateId;
	}
	
	//暂停读取
	this.stop = function() {
		this.isStop = 1;
	}
	
	//继续读取
	this.start = function() {
		this.isStop = 0;
		if (this.readType == 'user') {
			this.userMsg();
		} else {
			this.friendsMsg();
		}
	}
}

//继承DataCtrl类
extend(Fanfou, DataCtrl);

Fanfou.prototype.readUser = function(){
	this.readType = 'user';
	this.userMsg();
	this.xml += '\n<main>\n<title>饭否</title>\n<user>' + this.id + '</user>\n<message>\n';
}


Fanfou.prototype.readFriends= function(){
	this.readType = 'friends';
	this.xml += '\n<main>\n<title>饭否</title>\n<user>' + this.id + '和好友</user>\n<message>\n';
	this.friendsMsg();
}
/*
 * 获取单人信息
 * 
 */
Fanfou.prototype.userMsg = function(){
	
		var url = "http://fanfou.com/" + this.id + "/p." + this.page;
		var isEnd = 0;			//判断是否读取结束
		var content,date;		//储存内容，日期的变量
		var that = this;		//that指向当前对象
		
		
		//获取数据
		$.get(url, function(data){
			
			//判断是否结束，若已到尽头，$(data).find("#stream li")[0]的值会为undefined
			if (!$(data).find("#stream li")[0] || that.page > that.totalPage) {
				isEnd = 1;
			} else if(!that.isStop) {
				//若还没读取结束，而且没有暂停
				
				//读取暂停 传入状态栏ID、读取页数为参数
				that.reading(that.stateId, that.page);
				
				//创建一页
				if (that.divId) {
					that.createDiv(that.divId, that.page, that.startPage);
				}
				
				$(data).find("#stream li").each(function(i, n){
					//如果内容中有 ** 把 **  加为好友了  会出现错误 所以用try跳过
					try{
						content = n.childNodes[0].innerText;
							try {
								date = n.childNodes[2].firstChild.getAttribute("title");
							} catch (e) {
								date = n.childNodes[1].firstChild.getAttribute("title");
							}
						
						if (content.indexOf("<")!=-1 || content.indexOf(">")!=-1 || content.indexOf("&")!=-1) {
							content=content.replace(/&/g,"&amp;");
							content=content.replace(/</g,"&gt;");
							content=content.replace(/>/g,"&lt;");
						}
						
						//添加到this.xml字符串
						that.appendXml(content, date);
						
						//如果有传入divId参数，则追加元素
						if (that.divId) {
							that.appendDom(that.divId, content, date);
						}
					}catch(e){}
				})
				//当前页码加1
				that.page++;
			};
			
			//如果还没结束
			if (!isEnd ) {
				//如果没有暂停
				if (!that.isStop) {
					that.userMsg();
				} else {
					//读取暂停 传入状态栏ID、读取页数为参数
					that.readPause(that.stateId, that.page);
				}
			} else {
				if (that.page == that.startPage) {
					that.readNone(that.stateId);
				} else {
					that.readEnd(that.stateId, that.page, that.startPage);
				};
			}
		});
}

/*
 * 获取好友信息
 */
Fanfou.prototype.friendsMsg = function(divId){
	
		var url = "http://fanfou.com/message/" + this.id + "/p." + this.page;
		var isEnd = 0;			//判断是否读取结束
		var content, date, content;		//储存内容，日期的变量
		var that = this;		//that指向当前对象
				
		this.readType = 'friends';
		
		//获取数据
		$.get(url, function(data){
			
			//判断是否结束，若已到尽头，$(data).find("#stream li")[0]的值会为undefined
			if (!$(data).find("#stream li")[0] || that.page > that.totalPage) {
				isEnd = 1;
			} else if(!that.isStop) {
				//若还没读取结束，而且没有暂停
				
				//读取暂停 传入状态栏ID、读取页数为参数
				that.reading(that.stateId, that.page);
				
				//创建一页
				if (that.divId) {
					that.createDiv(that.divId, that.page, that.startPage);
				}
				
				$(data).find("#stream li").each(function(i, n){
					//如果内容中有 ** 把 **  加为好友了  会出现错误 所以用try跳过
					try{
						content = n.childNodes[3].innerText;
						date = n.childNodes[5].firstChild.getAttribute("title");
						author = n.childNodes[1].innerText;
						
						if (content.indexOf("<")!=-1 || content.indexOf(">")!=-1 || content.indexOf("&")!=-1) {
							content=content.replace(/&/g,"&amp;");
							content=content.replace(/</g,"&gt;");
							content=content.replace(/>/g,"&lt;");
						}
						
						//添加到this.xml字符串
						that.appendXml(content, date, author);
						
						//如果有传入divId参数，则追加元素
						if (that.divId) {
							that.appendDom(that.divId, content, date, author);
						}
					}catch(e){}
					
				})
				//当前页码加1
				that.page++;
			};
			
			//如果还没结束
			if (!isEnd) {
				//如果没有暂停
				if (!that.isStop) {
					that.friendsMsg();
				} else {
					//读取暂停 传入状态栏ID、读取页数为参数
					that.readPause(that.stateId, that.page)
				}
			} else {
				if (that.page == 1) {
					that.readNone(that.stateId);
				} else {
					that.readEnd(that.stateId, that.page, that.startPage);
				};
			}
		});
}	






/*
 * 叽歪类 
 * 继承接口ReadData
 * 继承类DataCtrl
 */
var Jiwai = function(id, totalPage, page){ //implement ReadData
	Jiwai.superclass.constructor.call(this);
	
	//用户ID
	this.id = id;	
	
	//储存起始页码
	this.startPage = page;
	
	//起始页码，默认为1				
	if (!page) {
		this.page = 1;				
	} else {
		this.page = page;
	}
	
	//读取总页数
	this.totalPage = totalPage;		
	
	
	//是否暂停读取
	this.isStop = 0; 				
	
	//读取类型 是user还是friends 用于继续读取的start()函数
	this.readType = "";
	
	//设置要添加到的DIV块ID
	this.setDivId = function(divId) {
		this.divId = divId;
	}
	
	//设置状态栏ID
	this.setStateId = function(stateId) {
		this.stateId = stateId;
	}
	
	//暂停读取
	this.stop = function() {
		this.isStop = 1;
	}
	
	//继续读取
	this.start = function() {
		this.isStop = 0;
		if (this.readType == 'user') {
			this.userMsg();
		} else {
			this.friendsMsg();
		}
	}
}

//继承DataCtrl类
extend(Jiwai, DataCtrl);

Jiwai.prototype.readUser = function(){
	this.readType = 'user';
	this.userMsg();
	this.xml += '\n<main>\n<title>叽歪</title>\n<user>' + this.id + '</user>\n<message>\n';
}


Jiwai.prototype.readFriends= function(){
	this.readType = 'friends';
	this.xml += '\n<main>\n<title>叽歪</title>\n<user>' + this.id + '和好友</user>\n<message>\n';
	this.friendsMsg();
}
/*
 * 获取单人信息
 * 
 */
Jiwai.prototype.userMsg = function(){
	
		var url = "http://jiwai.de/" + this.id + "/?page=" + this.page;
		var isEnd = 0;			//判断是否读取结束
		var content,date;		//储存内容，日期的变量
		var that = this;		//that指向当前对象
		
		
		//获取数据
		$.get(url, function(data){
			
			//判断是否结束，若已到尽头，$(data).find("#wtTimeline .odd")[0]的值会为undefined
			if (!$(data).find("#wtTimeline .odd")[0] || that.page > that.totalPage) {
				isEnd = 1;
			} else if(!that.isStop) {
				//若还没读取结束，而且没有暂停
				
				//读取暂停 传入状态栏ID、读取页数为参数
				that.reading(that.stateId, that.page);
				
				//创建一页
				if (that.divId) {
					that.createDiv(that.divId, that.page, that.startPage);
				}
				
				$(data).find("#wtTimeline .odd").each(function(i, n){
					//如果内容中有 ** 把 **  加为好友了  会出现错误 所以用try跳过
					try{
						content = n.childNodes[3].childNodes[2].nodeValue;
						date = n.childNodes[3].getElementsByTagName("a")[0].getAttribute("title");
						
						if (content.indexOf("<")!=-1 || content.indexOf(">")!=-1 || content.indexOf("&")!=-1) {
							content=content.replace(/&/g,"&amp;");
							content=content.replace(/</g,"&gt;");
							content=content.replace(/>/g,"&lt;");
						}
						
						//添加到this.xml字符串
						that.appendXml(content, date);
						
						//如果有传入divId参数，则追加元素
						if (that.divId) {
							that.appendDom(that.divId, content, date);
						}
					}catch(e){}
				})
				//当前页码加1
				that.page++;
			};
			
			//如果还没结束
			if (!isEnd ) {
				//如果没有暂停
				if (!that.isStop) {
					that.userMsg();
				} else {
					//读取暂停 传入状态栏ID、读取页数为参数
					that.readPause(that.stateId, that.page);
				}
			} else {
				if (that.page == 1) {
					that.readNone(that.stateId);
				} else {
					that.readEnd(that.stateId, that.page, that.startPage);
				};
			}
		});
}

/*
 * 获取好友信息
 */
Jiwai.prototype.friendsMsg = function(divId){
	
		var url = "http://jiwai.de/" + this.id + "/with_friends/?page=" + this.page;
		var isEnd = 0;			//判断是否读取结束
		var content, date, content;		//储存内容，日期的变量
		var that = this;		//that指向当前对象
				
		this.readType = 'friends';
		
		//获取数据
		$.get(url, function(data){
			
			//判断是否结束，若已到尽头，$(data).find("#stream li")[0]的值会为undefined
			if (!$(data).find("#wtTimeline .odd")[0] || that.page > that.totalPage) {
				isEnd = 1;
			} else if(!that.isStop) {
				//若还没读取结束，而且没有暂停
				
				//读取暂停 传入状态栏ID、读取页数为参数
				that.reading(that.stateId, that.page);
				
				//创建一页
				if (that.divId) {
					that.createDiv(that.divId, that.page, that.startPage);
				}
				
				$(data).find("#wtTimeline .odd").each(function(i, n){
					//如果内容中有 ** 把 **  加为好友了  会出现错误 所以用try跳过
					try{
						content = n.childNodes[3].childNodes[2].nodeValue;
						date = n.childNodes[3].getElementsByTagName("a")[0].getAttribute("title");
						author = n.childNodes[3].getElementsByTagName("a")[1].innerText;
					
						if (content.indexOf("<")!=-1 || content.indexOf(">")!=-1 || content.indexOf("&")!=-1) {
							content=content.replace(/&/g,"&amp;");
							content=content.replace(/</g,"&gt;");
							content=content.replace(/>/g,"&lt;");
						}
						
						//添加到this.xml字符串
						that.appendXml(content, date, author);
						
						//如果有传入divId参数，则追加元素
						if (that.divId) {
							that.appendDom(that.divId, content, date, author);
						}
					}catch(e){}
					
				})
				//当前页码加1
				that.page++;
			};
			
			//如果还没结束
			if (!isEnd) {
				//如果没有暂停
				if (!that.isStop) {
					that.friendsMsg();
				} else {
					//读取暂停 传入状态栏ID、读取页数为参数
					that.readPause(that.stateId, that.page)
				}
			} else {
				if (that.page == 1) {
					that.readNone(that.stateId);
				} else {
					that.readEnd(that.stateId, that.page, that.startPage);
				};
			}
		});
}	






/*
 * 静态方法
 * 获得好友列表
 * 参数说明：
 * 		userId：用户ID
 * 		dom：要插入到的dom对象

Fanfou.friendList = function(userId, dom, stateDom){
	var isEnd = 0;
	var page = 1;
	readFriendList();
	function readFriendList(){
		var f, id;
		var url = "http://fanfou.com/friends/" + userId + "/p." + page;
		document.getElementById(stateDom).innerHTML = 'loading';
		//获取数据
		$.get(url, function(data){
			
			if (!$(data).find("#stream li")[0]) {
				isEnd = 1;
			} else {	
				$(data).find("#stream li").each(function(i, n){
					try{
						id = n.childNodes[1].getAttribute('href').slice(1);
						f = n.innerText;
						document.getElementById(dom).innerHTML += '<li><a href="#" onclick="Fanfou.friendList(\'' + id + '\', \'' + dom + '\', \'' + stateDom + '\' )">' + f + '</a></li>';
					}catch(e){}
				})
			};
			page += 1;
			//如果还没结束
			if (!isEnd) {
				readFriendList();
			} else {
				document.getElementById(stateDom).innerHTML = '';
			}
		});
	}
}
 */


