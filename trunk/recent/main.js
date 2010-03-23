
function mouseOver(e,num){
	var word=document.getElementById("word")
	word.style.display="block";
	word.style.left=e.clientX+document.documentElement.scrollLeft-50+"px";
	word.style.top=e.clientY+document.documentElement.scrollTop+50+"px";
	word.style.opacity = 0.7;
	switch(num){
		case 1:
			word.innerHTML="今年寒假做的ADOBE AIR程序——ACCOUNT的外观。";
			break;
		case 2:
			word.innerHTML="今年寒假学校社团师大青年的任务：桃李苑网站。";
			break;
		case 3:
			word.innerHTML="高二做的电子杂志。";
			break;
		case 4:
			word.innerHTML="高二为影视帝国论坛做的杂志外观。";
			break;
		case 5:
			word.innerHTML="高二为影视帝国做的动漫特刊杂志。";
			break;
		case 6:
			word.innerHTML="大一上学期学生会培训后的作业。";
			break;
		case 7:
			word.innerHTML="大一上学期班徽设计的肩章 别人手绘图，我输入电脑加上色。";
			break;
	}
}
function mouseOut(){
	var word=document.getElementById("word");
	word.style.display="none";
}
function mouseMove(e){
	var word=document.getElementById("word")
	word.style.left=e.clientX+document.documentElement.scrollLeft-50+"px";
	word.style.top=e.clientY+document.documentElement.scrollTop+50+"px";
}