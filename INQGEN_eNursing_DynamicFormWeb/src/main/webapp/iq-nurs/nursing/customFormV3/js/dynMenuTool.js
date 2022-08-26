// 一个page被load之后要执行的function
function afterLink(linkId){
	// linkId : menu上某一个link的id
	for(var i=0; i<vecLinkIds.size(); i++){
		// 判断有无这个id, 而且该物件支援"disabled"属性, 而且该属性为true
		if(document.all(vecLinkIds.elementAt(i)) && document.all(vecLinkIds.elementAt(i)).disabled){
			document.all(vecLinkIds.elementAt(i)).disabled = false;
			document.all(vecLinkIds.elementAt(i)).style.cursor = "hand";
		}
	}
	// 判断有无这个id, 而且该物件支援"disabled"属性
	if(document.all(linkId)){
		document.all(linkId).disabled = true;
		document.all(linkId).style.cursor = "default";
	}
}

// 一个link被连结之前要执行的function
function beforeLink(linkId){
	// linkId : menu上某一个link的id
	// 判断该linkId是存在的, 而且是可以连结的
	if(document.all(linkId) && !(document.all(linkId).disabled)){
		// 检查是否有文件正在编辑中
		if(window.top.main_frame && window.top.main_frame.mainFrame){
			try{
				var doc = window.top.main_frame.mainFrame.document;
				if(doc.all("fun")){
					if(doc.all("fun").value == "add"){
						return window.confirm("要放弃正在新增的资料吗 ?");
					}else if(doc.all("fun").value == "edit"){
						return window.confirm("要放弃正在修改的资料吗 ?");
					}
				}
			}catch(kuku){
				alert("主网页尚未Ready");
			}
		}
		return true;
	}else{
		return false;	//表示function执行中断
	}
}

function doAfterLink(linkId){
	//先判断window.top与window.top.top_frame物件是否存在
	if(window.top && window.top.top_frame && window.top.top_frame.afterLink){
		// 执行位于top_frame中top.jsp中的javascript function : afterLink()，该function被包在dynMenuTool.js中
		// 'demo'是menu上某一个link的id，以便将该连结disable掉
		window.top.top_frame.afterLink(linkId);
	}
}

// 在子menu之下的menu, 要回到第一层menu时所呼叫的function
// menu_id : 在top主menu中某一个连结的id
// menu_url: 上述id连结所指向的url
function goMenuTop(menu_id, menu_url){
	//alert("goMenuTop('"+menu_id+"','"+menu_url+"')");
	if(window.top.top_frame){
		// 呼叫在top_frame中的top.jsp中javascript的beforeLink()来执行检验的作业
		if(window.top.top_frame && window.top.top_frame.beforeLink(menu_id)){
			window.parent.location.href = menu_url;
		}
	}
}

// Button onMouseOver, onMouseOut
function buttonOnMouseOver(){
	// 暂时取消
	// window.event.srcElement.style.background = "#FF0000";
}
function buttonOnMouseOut(){
	// 暂时取消
	// window.event.srcElement.style.background = "#999999";
}
// 开始onlineHelp视窗
function openHelp(url){
	//alert("Help...");
	var args = "width=350,height=400,resizable=1,scrollbars=1,left="+((screen.width-350)/2)+",top="+((screen.height-400)/2);
	//var rwin = window.open("/blank.htm", "helpWindow", args);
	var rwin = window.open(url, "helpWindow", args);
	rwin.focus();
	//rwin.location.href = url;
}
// 连结至说明档目录
function toHelpRoot(){
	//alert("建构中");
}

// test
/*
document.write("<script for=\"Button\" event=\"onmouseover\" language=\"javascript\">");
document.write("var obj = event.srcElement;");
document.write("obj.style.background=\"#FF0000\";");
document.write("</script>

document.write("<script for=\"Button\" event=\"onmouseout\" language=\"javascript\">");
document.write("var obj = event.srcElement;");
document.write("obj.style.background=\"#999999\";");
document.write("</script>
*/

// alice add function 
// 于Table 中移动时颜色之反应
// selId : td 的名称
// selCount : 每一列共有几栏

//--用于同一列做区块不同色调的区分时使用--//
	// selBeg   : 起始栏号码
	// selEnd   : 结束栏号码
//--用于同一列做区块不同色调的区分时使用--//
function TableMouseover(selId,selCount,selBeg,selEnd)
{
	for (var i=1;i<=selCount;i++)
	{
		var str=""
		if(document.all(selId+i)!=null && i>=selBeg && i<=selEnd)
			//str=selId+i+".style.background='#BBBBBB'"
			document.all(selId+i).style.background = "#FFD7FF"
		else if(document.all(selId+i)!=null)
			//str=selId+i+".style.background='#DDDDDD'"
			document.all(selId+i).style.background = "#FFFF99"
			//eval(str)
	}
}
function TableMouseOut(selId,selCount)
{
	for (var i=1;i<=selCount;i++)
	{
		//var str=selId+i+".style.background='#FFFFFF'"
		//eval(str)
		if(document.all(selId+i)!=null)
		{
			document.all(selId+i).style.background ="#FFFFFF"
		}
	}
}
function TrMouseover(selId)
{
	if(selId!=null && selId.length>0)
	{
		document.all(selId).style.background = "#FFFF99"
	}
}
function TrMouseOut(selId)
{
	var clickId = document.all("clickId")
	if(clickId!=null && clickId.value.length>0 && selId!=null && selId.length>0 && clickId.value!=selId)
	{
		document.all(selId).style.background ="#FFFFFF"
	}else if(clickId==null && selId!=null && selId.length>0)
	{
		document.all(selId).style.background ="#FFFFFF"
	}
}

//--用来计算视窗大小
function getWinWH()
{
  var w=screen.width*0.95
  var h=screen.height*0.9
  var l=(screen.width-w)/2-5
  var t=(screen.height*.05)/2
  var wh='width='+w+',height='+h+',left='+l+',top='+t
  return wh
}
// alice add function
