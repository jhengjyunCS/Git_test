
//在動態表單都會用到的JS、CSS在這邊一併引入
function includeHead(completeCall, removeDefaultUI){
  //[removeDefaultUI] 可選，拿掉預設UI，包含CSS和JS
  /**
   * mode[
   *     default 預設，包含bootstrap(js,css)及nurse_event(css)，不包含bootstrap-datetimepicker
   *     nurse_event 僅移除nurse_event.css
   */
  //人形圖不支援IE9以下(不含)
  if ( !(eNursing.isIE(5) || eNursing.isIE(7) || eNursing.isIE(8) )){
    //不支援chrome 40版
    var chromeVersion = 50;
    if (navigator && navigator.userAgent && navigator.userAgent.indexOf("Chrome/")!==-1){
		chromeVersion = parseInt(navigator.userAgent.split("Chrome/")[1].split(".")[0], 10);
    }
    if (chromeVersion>=50){
		loadjscssfile("../customFormV3/plugins/canvas_BodyRegion/js/fabric.min.js", "js"); //人形圖
    }else{
		console.log("人形圖不支援太低版本瀏覽器");
    }
  }else{
		console.log("人形圖不支援IE9以下(不含)");
  }
  if (removeDefaultUI && removeDefaultUI==="default"){
    completeCall();
    return;
  }else if (removeDefaultUI && removeDefaultUI==="nurse_event"){
    loadjscssfile("../customFormV3/css2/bootstrap.min.css", "css");
    loadjscssfile("../customFormV3/css2/bootstrap-reset.css", "css");
    loadjscssfile("../customFormV3/js2/bootstrap.js", "js");
    completeCall();
    return;
  }else if (removeDefaultUI && removeDefaultUI==="DingTool"){
    loadjscssfile("../customFormV3/css/form.css", "css");
    loadjscssfile("../customFormV3/plugins/bootstrap/bootstrap-4.6.0-dist/css/bootstrap.min.css", "css");
    loadjscssfile("../customFormV3/plugins/bootstrap/bootstrap-icons/font/bootstrap-icons.css", "css");
    // loadjscssfile("../customFormV3/plugins/tablesorter-master/dist/js/jquery.tablesorter.min.js", "js");
    completeCall();
    return;
  }
  loadjscssfile("../customFormV3/css/nurse_event.css", "css");
  //  loadjscssfile("../customFormV3/css/bootstrap-datetimepicker.css", "css");
  loadjscssfile("../customFormV3/css2/bootstrap.min.css", "css");
  loadjscssfile("../customFormV3/css2/bootstrap-reset.css", "css");
  loadjscssfile("../customFormV3/js2/bootstrap.js", "js");
 //  loadjscssfile("../customFormV3/js2/bootstrap.js", "js");
 //  loadjscssfile("../customFormV3/js2/datetimepicker/bootstrap-datetimepicker.js", "js");
 //  loadjscssfile("../customFormV3/js2/datetimepicker/locales/bootstrap-datetimepicker.zh-TW.js", "js");


  completeCall();
}

//跳轉頁面
function doURL(linkURL){
    window.localStorage["previousPage_addOrUpd"] = location.href;
    location.href = linkURL;
}

function openURL(url,height,width,reloadWin) {
  var winWidth=screen.width;  //获取屏幕宽度
  var winHeight=screen.height;  //获取屏幕高度
  var newWinHeight=height||610, newWinWidth=width||860;
  //获取新窗口距离屏幕左侧的位置
  var left=(winWidth-newWinWidth)/2;
  //获取新窗口距离屏幕顶部的位置
  var top=(winHeight-newWinHeight)/2;
  var newWin=window.open(url, 'newWin', 'width=' + newWinWidth + ',height=' + newWinHeight + ',left=' + left + ',top=' + top + ',toolbar=no, menubar=no, location=no, status=no');
  newWin.reloadWin=reloadWin;
  return newWin;
}

function closeOpenWin() {
  (window.reloadWin||window.opener).location.reload();
  window.close();
}

function openURLModal(url,height,width) {
  var newWinHeight=height||610, newWinWidth=width||860;
  if(!window.bootbox)  loadjscssfile("../../../plugins/bootbox/bootbox.min.js", "js");
  if(!$.fn.modal||$.fn.modal.Constructor.VERSION<'4.2')loadjscssfile("../../../plugins/bootstrap/js/bootstrap.min.js", "js");
  var dialog=bootbox.dialog({
    container: $("body", top.document),
    // title: 'A custom dialog with buttons and callbacks',
    message: "<iframe style='width: 100%;height: "+newWinHeight+"px;border: 0' src='" +location.href.replace(location.search,'').replace(/[^\/]+\.(html|jsp|do)/,'')+ url + "'></iframe>",
    size: "xl",
    centerVertical: true
    // closeButton: false,
  });
  dialog.css("background-color", "rgba(0,0,0,0.69)");
  var iframeWin=dialog.find("iframe")[0].contentWindow
  iframeWin.dialog=dialog;
  return iframeWin;
}

function closeModal(reload) {
  if(reload) {
    if (window.reloadWin) reloadWin.location.reload();
    if (window.reloadGformData) reloadGformData();
  }
  if(window.dialog) {
    dialog.modal('hide');
    dialog.off('escape.close.bb');
    dialog.off('click');
  }
}