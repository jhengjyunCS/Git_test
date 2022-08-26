
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
    loadjscssfile("iq-nurs/nursing/customFormV3/css2/bootstrap.min.css", "css");
    loadjscssfile("iq-nurs/nursing/customFormV3/css2/bootstrap-reset.css", "css");
    loadjscssfile("iq-nurs/nursing/customFormV3/js2/bootstrap.js", "js");
    completeCall();
    return;
  }
  // loadjscssfile("iq-nurs/nursing/customFormV3/css/nurse_event.css", "css");
  //  loadjscssfile("iq-nurs/nursing/customFormV3/css/bootstrap-datetimepicker.css", "css");
  loadjscssfile("iq-nurs/nursing/customFormV3/css2/bootstrap.min.css", "css");
  loadjscssfile("iq-nurs/nursing/customFormV3/css2/bootstrap-reset.css", "css");
  loadjscssfile("iq-nurs/nursing/customFormV3/js2/bootstrap.js", "js");
	// loadjscssfile("iq-nurs/nursing/customFormV3/css/scroll-nice.css", "css");
	// loadjscssfile("iq-nurs/nursing/customFormV3/css/bootstrap-datetimepicker.css", "css");
	// //    <!-- Bootstrap core CSS -->
	// loadjscssfile("iq-nurs/nursing/customFormV3/css/bootstrap.min.css", "css");
	// loadjscssfile("iq-nurs/nursing/customFormV3/css/bootstrap-reset.css", "css");
	// //    <!--external css-->
	// // loadjscssfile("assets/font-awesome/iq-nurs/nursing/customFormV3/css/font-awesome.css", "css");
	// //    <!-- Custom styles for this template -->
	// loadjscssfile("iq-nurs/nursing/customFormV3/css/style.css", "css");
	// loadjscssfile("iq-nurs/nursing/customFormV3/css/style-responsive.css", "css");



	// loadjscssfile("iq-nurs/nursing/customFormV3/js/bootstrap.js", "js");
	// loadjscssfile("dist/core/js/jquery.mmenu.min.all.js", "js");
	// loadjscssfile("iq-nurs/nursing/customFormV3/js/setmmenu.js", "js");
	// loadjscssfile("iq-nurs/nursing/customFormV3/js/global/nis/v2.0/CS-System.js", "js");
	// loadjscssfile("iq-nurs/nursing/customFormV3/js/bootbox.js", "js" ,"async");
	// loadjscssfile("iq-nurs/nursing/customFormV3/js/jquery.scrollTo.min.js", "js");
	// loadjscssfile("iq-nurs/nursing/customFormV3/js/jquery.nicescroll.js", "js");
	// loadjscssfile("iq-nurs/nursing/customFormV3/js/jquery.validate.min.js", "js");
	// loadjscssfile("iq-nurs/nursing/customFormV3/js/cordova-1.8.1.js", "js");
	// loadjscssfile("iq-nurs/nursing/customFormV3/js/datetimepicker/bootstrap-datetimepicker.js", "js");
	// loadjscssfile("iq-nurs/nursing/customFormV3/js/datetimepicker/locales/bootstrap-datetimepicker.zh-TW.js", "js");

	completeCall();
}
