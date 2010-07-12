/**
 * @author bang
 */
var readXML = {
	xmlData: "",
	fileSelect: function(){
		readFile = new air.File();
		readFile.browseForOpen('choose a file');
		readFile.addEventListener(air.Event.SELECT, readXML.fileOpened);
	},
	
	fileOpened: function(e){
		initFileLoad();
		//默认每页显示20条
		readXML.readData(20);
	},
	
	fileOpenByName:function(fileName){
		readFile = air.File.applicationStorageDirectory.resolvePath(fileName);
		readXML.readData(20);
	},
	
	
	
	//通过XMLHttpRequest获取数据 参数为每页显示多少条
	readData: function(num) {
		var xml = new XMLHttpRequest();
		xml.onreadystatechange = function(){
			if (xml.readyState == 4) {
				readXML.displayXmlData(xml.responseXML, num);		
				readXML.xmlData = xml.responseXML;	
				//初始化统计数据
				initStat();
			}
		}
		xml.open('GET', readFile.url, true);
		xml.send(null);
	},
		
	
	/*
	 * 函数功能：提取符合条件的数据转换成数组
	 * 参数说明:
	 * 		xmlData:xml数据
	 * 		startTime:开始时间
	 * 		endTime:结束时间
	 * 		name:要显示的人的名字，用英文逗号隔开
	 * 		keyWord:关键字，用英文逗号隔开
	 */
	dataToArray: function(xmlData, startTime, endTime, name, keyWord) {
		var data = [];
		var date = '';
		//读取单人还是好友信息。1为单人信息。
		var isUser = 1;
		
		//是否存在<author> 即读取单人还是好友信息。
		if (xmlData.documentElement.getElementsByTagName( 'author' )[0]) {
			isUser = 0; 	//读取好友信息
		}
		
		//元素数组
		var elems = xmlData.documentElement.getElementsByTagName( 'item' )
		for (var i = 0; i < elems.length; i++) {
			date = elems[i].getElementsByTagName("date")[0].textContent;
			message = elems[i].getElementsByTagName("content")[0].textContent;
			if (!isUser) {
				author = elems[i].getElementsByTagName("author")[0].textContent;
			}
			datearr = date.split('-');
			
			//比较开始时间
			if (startTime) {
				startarr = startTime.split('-');
				datearr[2] = datearr[2].split(" ")[0];
				if ((Number(datearr[0]) < Number(startarr[0])) || 
					(Number(datearr[0]) == Number(startarr[0]) && Number(datearr[1]) < Number(startarr[1])) ||
					(Number(datearr[0]) == Number(startarr[0]) && Number(datearr[1]) == Number(startarr[1]) && Number(datearr[2]) < Number(startarr[2]))
					) {
						continue;
					}
			}
			
			//比较结束时间
			if (endTime) {
				endarr = endTime.split('-');
				datearr[2] = datearr[2].split(" ")[0];
				if ((Number(datearr[0]) > Number(endarr[0])) || 
					(Number(datearr[0]) == Number(endarr[0]) && Number(datearr[1]) > Number(endarr[1])) ||
					(Number(datearr[0]) == Number(endarr[0]) && Number(datearr[1]) == Number(endarr[1]) && Number(datearr[2]) > Number(endarr[2]))
					) {
						continue;
					}
			}
			
			//判断名字
			if (!isUser && name) {
				var accordName = 0;
				var namearr = name.split(',');
				for (var j=0; j<namearr.length; j++){
					if (author == namearr[j]) {
						accordName = 1;
						break;
					}
				}
				if (!accordName) {
					continue;
				}
			}
			
			//关键字
			if (keyWord) {
				var keyWordArr = keyWord.split(',');
				var accordKey = 0;
				for (var j=0; j<keyWordArr.length; j++) {
					if (message.indexOf(keyWordArr[j]) >= 0) {
						accordKey = 1;
					}
				}
				if (!accordKey) {
					continue;
				}
			}			
			
			//数据插入数组
			data[data.length] = [];
			data[data.length-1][0] = message;
			data[data.length-1][1] = date;
			if (!isUser) {
				data[data.length-1][2] = author;
			}
		}
		return data;
	},
	
	//显示搜索数据
	displayData: function(data, num){
		
		var domId = "rPages";
		var messageClass = "c";
		var dateClass = "d";
		var authorClass = "a";
		var currentPage;
		var contentArr = [];
		
		//当前页面
		var page = 1;  
		//当前页面条数
		var itemnum = -1;
		//读取单人还是好友信息。1为单人信息。
		var isUser = 1;
		
		//清空内容
		document.getElementById(domId).innerHTML = "";
		
		//是否存在<author> 即读取单人还是好友信息。
		if (data[0].length == 3) {
			isUser = 0; 	//读取好友信息
		}
		//第一页
		contentArr.push('<div id="rPage' + page + '">');
		document.getElementById("rPageSelect").innerHTML += '<option value="' + page + '">' + page + '</option>';
				
		for (var i = 0; i < data.length; i++) {
			itemnum ++;
			if (itemnum>=num) {
				itemnum = 0;
				page ++;
				contentArr.push('</div><div id="rPage' + page + '">');
				document.getElementById("rPageSelect").innerHTML += '<option value="' + page + '">' + page + '</option>';
			}
						
			message = data[i][0];
			date = data[i][1];
			if (!isUser) {
				author = data[i][2];
			}
			
			contentArr.push('<div class="' + messageClass + '">' + message + '</div>');
			
			if (!isUser) {
				contentArr.push('<div class="' + authorClass + '">' + author + '</div>');
			}
				contentArr.push('<div class="' + dateClass + '">' + date + '</div>');
		}
		contentArr.push('</div>')
  		document.getElementById(domId).innerHTML = contentArr.join("");
		for (var i=2; i<=page; i++) {
			document.getElementById("rPage" + i).style.display = "none";
		}
	},
	
	
	//显示数据
	displayXmlData: function(xmlData, num){
		var domId = "rPages";
		var messageClass = "c";
		var dateClass = "d";
		var authorClass = "a";
		var currentPage;
		var contentArr = [];
		
		//当前页面
		var page = 1;  
		//当前页面条数
		var itemnum = -1;
		//读取单人还是好友信息。1为单人信息。
		var isUser = 1;
		
		//元素数组
		var elems = xmlData.documentElement.getElementsByTagName( 'item' )
		
		//清空内容
		document.getElementById(domId).innerHTML = "";
		
		//是否存在<author> 即读取单人还是好友信息。
		if (xmlData.documentElement.getElementsByTagName( 'author' )[0]) {
			isUser = 0; 	//读取好友信息
		}
		
		//第一页
		contentArr.push('<div id="rPage' + page + '">');
		document.getElementById("rPageSelect").innerHTML += '<option value="' + page + '">' + page + '</option>';
		
		for (var i = 0; i < elems.length; i++) {
			itemnum ++;
			if (itemnum>=num) {
				itemnum = 0;
				page ++;
				contentArr.push('</div><div id="rPage' + page + '">');
				document.getElementById("rPageSelect").innerHTML += '<option value="' + page + '">' + page + '</option>';
			}
			
			message = elems[i].getElementsByTagName("content")[0].textContent;
			date = elems[i].getElementsByTagName("date")[0].textContent;
			if (!isUser) {
				author = elems[i].getElementsByTagName("author")[0].textContent;
			}
			contentArr.push('<div class="' + messageClass + '">' + message + '</div>');
			if (!isUser) {
				contentArr.push('<div class="' + authorClass + '">' + author + '</div>');
			}
			contentArr.push('<div class="' + dateClass + '">' + date + '</div>');
	
		}
		contentArr.push('</div>')
  		document.getElementById(domId).innerHTML = contentArr.join("");
		for (var i=2; i<=page; i++) {
			document.getElementById("rPage" + i).style.display = "none";
		}
	},
	
	
	//统计
	stat: function(xmlData){
		//总消息条数
		var totalMsg = 0;
		//总字数
		var totalWord = 0;
		//总@数
		var totalAt = 0;
		
		/*	数据数组
		 *  data[0][0]:日期（2008-10）
		 *  data[0][1]:条数
		 *  data[0][2]:字数
		 *  data[0][3]:@的个数
		 */
		var data = new Array();
		
		/*	每小时数据
		 * 	hour[0]~hour[23]
		 */
		var hour = new Array();
		//初始化
		for (var i=0; i<24; i++) {
			hour[i] = 0;
		}
		
		
		//元素数组
		var elems = xmlData.documentElement.getElementsByTagName( 'item' )
		
		//第一条
		date = elems[0].getElementsByTagName("date")[0].textContent;
		datearr = date.split("-");
		
		data[0] = new Array();
		data[0][0] = datearr[0] + "-" + datearr[1];
		data[0][1] = 0;
		data[0][2] = 0;
		data[0][3] = 0;
		
		
		for (var i = 0; i < elems.length; i++) {
			message = elems[i].getElementsByTagName("content")[0].textContent;
			date = elems[i].getElementsByTagName("date")[0].textContent;
			datearr = date.split('-');
			hourNum = Number(datearr[2].split(" ")[1].split(":")[0]);
			hour[hourNum] += 1;
			
			if (data[data.length-1][0] == datearr[0] + "-" + datearr[1]) {
				data[data.length-1][1] += 1;
				data[data.length-1][2] += message.length;
				if (message.indexOf("@") >= 0) {
					data[data.length-1][3] += 1;
					totalAt += 1;
				}
			} else { //新的一个月
				data[data.length] = new Array();
				data[data.length-1][0] = datearr[0] + "-" + datearr[1];
				data[data.length-1][1] = 0;
				data[data.length-1][2] = 0;
				data[data.length-1][3] = 0;
				data[data.length-1][1] += 1;
				data[data.length-1][2] += message.length;
				if (message.indexOf("@") >= 0) {
					data[data.length-1][3] += 1;
					totalAt += 1;
				}
			}
			
			totalMsg += 1;
			totalWord += message.length;
		}
		
		var obj = {
			totalMsg: totalMsg,
			totalWord: totalWord,
			totalAt: totalAt,
			data: data,
			hour: hour
			}
		return obj;
	}
};

