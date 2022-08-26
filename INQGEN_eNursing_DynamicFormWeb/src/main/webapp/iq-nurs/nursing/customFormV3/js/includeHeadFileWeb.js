
//在動態表單都會用到的JS、CSS在這邊一併引入
function includeHead(completeCall, removeDefaultUI){
  //[removeDefaultUI] 可選，拿掉預設UI，包含CSS和JS
  /**
   * mode[
   *     default 預設，包含bootstrap(js,css)及nurse_event(css)，不包含bootstrap-datetimepicker
   *     nurse_event 僅移除nurse_event.css
   */
  if (removeDefaultUI && removeDefaultUI==="default"){
    completeCall();
    return;
  }else if (removeDefaultUI && removeDefaultUI==="nurse_event"){
    loadjscssfile("../customFormV3/css2/bootstrap.min.css", "css");
    loadjscssfile("../customFormV3/css2/bootstrap-reset.css", "css");
    loadjscssfile("../customFormV3/js2/bootstrap.js", "js");
    completeCall();
    return;
  }
  loadjscssfile("../customFormV3/css/nurse_event.css", "css");
  //  loadjscssfile("../customFormV3/css2/bootstrap-datetimepicker.css", "css");
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