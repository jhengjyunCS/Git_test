
//在動態表單都會共用的JS程式，在這邊統一執行
var include_main = false;
var include_common_scripts = false;
function includeFoot(completeCall){
	//非同步讀取body
	$.ajax({url: "iq-nurs/nursing/customFormV3/includeBodyApp.html", cache: false, async: false}).done(function( context ) {
		//引入body
		$("#bodyContent").append(context);
		//設定title名稱
		$("#headerTitle").html(headerTitle);
		//引入menu
	    $("#sidebar").load('menu.html');

	    document.getElementById("loadeffect").style.display = "block";
	    //header初始化
	    setTitle();
	    //footer初始化
	    var ptstr1 = '';
	    var record = parseInt(window.localStorage["record"]) - parseInt("1");
	    if (record >= 0)
	        ptstr1 = ptstr1 + '<img alt="" src="img/left.png" onclick="location=\'right.html\'"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	    else
	        ptstr1 = ptstr1 + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

	    ptstr1 = ptstr1 + '<img alt="" src="img/Home_32x32.png" onclick="location=\'home.html\'"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	    ptstr1 = ptstr1 + '<img alt="" src="img/scan_32x32.png"  href="javascript: return false;" onclick="location=\'pt-list.html\'" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	    document.getElementById("bottomToolbar").innerHTML = ptstr1;

	    //引入頁面上初始化所需的js、css
		$.ajax({url: "js/main.js", cache: false, async: false}).done(function( context ) {if(!include_main) appendScriptToBody(context);}).fail(function(err){/*error*/});
		$.ajax({url: "js/common-scripts.js", cache: false, async: false}).done(function( context ) {if(!include_common_scripts) appendScriptToBody(context);}).fail(function(err){/*error*/});

		//完成
		completeCall();

	}).fail(function(err){/*error*/});
}