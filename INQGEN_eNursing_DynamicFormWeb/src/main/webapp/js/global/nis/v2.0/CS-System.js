function checkClient(verCode,show,successCall){
    $N.sendMsg("serverService.check","CS-Client",verCode,"",function (data) {
        /** @namespace resultMsg.hasNew */
        if (data.resultMsg.hasNew)
            ShowDialog('#check-version');
        else if(show){
            ShowDialog('#check-version1');
        }
        if (successCall != undefined)
            successCall();
    },function (e) {
        console.error(e);
    })
}
function ShowDialog(dialogItem){
    $(dialogItem).modal('show');
}
function getGateway(successCall){
    $N.sendMsg("serverService.get","CS-Gateway","","",function (data) {
        /** @namespace resultMsg.curVersion */
        var curVersion=data.resultMsg.curVersion;
        document.getElementById("version1").innerHTML = "服务程序 "+($N.isNumber(curVersion)?("Ver." + curVersion +".0"):curVersion);
        checkGateway(true, successCall);
    },function (e) {
        console.error(e);
    },true);
}

function checkGateway(hide, successCall) {
    $N.sendMsg("serverService.check", "CS-Gateway", "", "", function (data) {
        if (data.resultMsg.hasNew)
            ShowDialog('#gateway-version');
        else if(!hide)
            ShowDialog('#check-version1');
        if (successCall != undefined)
            successCall();
    }, function (e) {
        console.error(e);
    })
}

//-------------------------安裝新版CS-Client-----------------------------
function Install_Client(verCode){
    $N.sendMsg("serverService.install","CS-Client",verCode,"",function (data) {
    },function (e) {
        console.error(e);
    })
}

function Install_Gateway(){
    $N.sendMsg("serverService.install","CS-Gateway","","",function (data) {
    },function (e) {
        console.error(e);
    })
}

function doURL(linkURL){
    var currentPatient=nursing.getPatient().getCurrent();
    window.localStorage["previousPage"] = linkURL;
    window.localStorage["previousPage_addOrUpd"] = location.href;
    if(!currentPatient){
        location.href = "pt-list.html";
    }else
        location.href = linkURL;
}
//-------------------------設定功能項目連結位址(動態表單)---------------------------
function doURL_dynamicForm(formType, frameModel){
    var currentPatient=nursing.getPatient().getCurrent();

    var menu=dynamicForm_setLocalStorage(formType, frameModel);

    if(currentPatient==null){
        location.href = "pt-list.html";
    }else
        location.href = menu[frameModel].url;
}
//設定動態表單需要用到的 localStorage
function dynamicForm_setLocalStorage(formType, frameModel){
    var menu=dFormMenu[formType];
    //未設定menu
    if (menu==undefined){
        menu = setDefaultMenu(formType);
    }else if (menu[frameModel]==undefined){
        menu = setDefaultMenu(formType);
    }

    function setDefaultMenu(formType){
        return {
            AppLIST:{
                url: "AppLIST.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,frameModel: "AppLIST"
                ,frameModel_INIT: "AppLIST_INIT"
            }
            ,AppADD:{
                url: "AppADD.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,frameModel: "AppADD"
                ,frameModel_INIT: "AppADD_INIT"
            }
            ,AppUPD:{
                url: "AppUPD.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,frameModel: "AppUPD"
                ,frameModel_INIT: "AppUPD_INIT"
            }
            ,WebLIST:{
                url: "iq-nurs/nursing/customFormV3/WebLIST.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,frameModel: "WebLIST"
                ,frameModel_INIT: "WebLIST_INIT"
            }
            ,WebADD:{
                url: "iq-nurs/nursing/customFormV3/WebADD.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,frameModel: "WebADD"
                ,frameModel_INIT: "WebADD_INIT"
            }
            ,WebUPD:{
                url: "iq-nurs/nursing/customFormV3/WebUPD.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,frameModel: "WebUPD"
                ,frameModel_INIT: "WebUPD_INIT"
            }
            ,gFormWebLIST:{
                url: "iq-nurs/nursing/customFormV4/gFormWebLIST.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,sourceId: formType
                ,frameModel: "gFormWebLIST"
                ,frameModel_INIT: "gFormWebLIST_INIT"
            }
            ,gFormWebADD:{
                url: "iq-nurs/nursing/customFormV4/gFormWebADD.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,frameModel: "gFormWebADD"
                ,frameModel_INIT: "gFormWebADD_INIT"
            }
            ,gFormWebUPD:{
                url: "iq-nurs/nursing/customFormV4/gFormWebUPD.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,frameModel: "gFormWebUPD"
                ,frameModel_INIT: "gFormWebUPD_INIT"
            }
            ,gFormWebPRINT:{
                url: "iq-nurs/nursing/customFormV4/gFormWebPRINT.html"
                ,headerTitle: "尚未註冊menu"
                ,formType: formType
                ,frameModel: "gFormWebPRINT"
                ,frameModel_INIT: "gFormWebPRINT_INIT"
            }
            ,formTemplateLIST:{
                url: "iq-nurs/nursing/customFormV4/formTemplateLIST.html"
                ,headerTitle: "test"
                ,formType: "formTemplate"
                ,sourceId: "formTemplate"
                ,frameModel: "formTemplateLIST"
                ,frameModel_INIT: "formTemplateLIST_INIT"
            }
            ,formTemplateADD:{
                url: "iq-nurs/nursing/customFormV4/formTemplateADD.html"
                ,headerTitle: "test"
                ,formType: "formTemplate"
                ,sourceId: "formTemplate"
                ,frameModel: "formTemplateADD"
                ,frameModel_INIT: "formTemplateADD_INIT"
            }
            ,formTemplateUPD:{
                url: "iq-nurs/nursing/customFormV4/formTemplateUPD.html"
                ,headerTitle: "test"
                ,formType: "formTemplate"
                ,sourceId: "formTemplate"
                ,frameModel: "formTemplateUPD"
                ,frameModel_INIT: "formTemplateUPD_INIT"
            }
            ,formItemTemplateLIST:{
                url: "iq-nurs/nursing/customFormV4/formItemTemplateLIST.html"
                ,headerTitle: "test"
                ,formType: "formItemTemplate"
                ,frameModel: "formItemTemplateLIST"
                ,frameModel_INIT: "formItemTemplateLIST_INIT"
            }
            ,formItemTemplateADD:{
                url: "iq-nurs/nursing/customFormV4/formItemTemplateADD.html"
                ,headerTitle: "test"
                ,formType: "formItemTemplate"
                ,frameModel: "formItemTemplateADD"
                ,frameModel_INIT: "formItemTemplateADD_INIT"
            }
            ,formItemTemplateUPD:{
                url: "iq-nurs/nursing/customFormV4/formItemTemplateUPD.html"
                ,headerTitle: "test"
                ,formType: "formItemTemplate"
                ,frameModel: "formItemTemplateUPD"
                ,frameModel_INIT: "formItemTemplateUPD_INIT"
            }
            ,gFormAppAdd:{
                url: "iq-nurs/nursing/customFormV4/gFormAppADD.html"
                ,headerTitle: "test"
                ,formType: formType
                ,frameModel: "gFormAppAdd"
                ,frameModel_INIT: "gFormAppAdd_INIT"
            }
            ,gFormAppUpd:{
                url: "iq-nurs/nursing/customFormV4/gFormAppUPD.html"
                ,headerTitle: "test"
                ,formType: formType
                ,frameModel: "gFormAppUpd"
                ,frameModel_INIT: "gFormAppUpd_INIT"
            }
            ,gFormAppList:{
                url: "iq-nurs/nursing/customFormV4/gFormAppLIST.html"
                ,headerTitle: "test"
                ,formType: formType
                ,frameModel: "gFormAppList"
                ,frameModel_INIT: "gFormAppList_INIT"
            }
            ,gFormAppADD:{
                url: "iq-nurs/nursing/customFormV4/gFormAppADD.html"
                ,headerTitle: "test"
                ,formType: formType
                ,frameModel: "gFormAppAdd"
                ,frameModel_INIT: "gFormAppAdd_INIT"
            }
            ,gFormAppUPD:{
                url: "iq-nurs/nursing/customFormV4/gFormAppUPD.html"
                ,headerTitle: "test"
                ,formType: formType
                ,frameModel: "gFormAppUpd"
                ,frameModel_INIT: "gFormAppUpd_INIT"
            }
            ,gFormAppLIST:{
                url: "iq-nurs/nursing/customFormV4/gFormAppLIST.html"
                ,headerTitle: "test"
                ,formType: formType
                ,frameModel: "gFormAppList"
                ,frameModel_INIT: "gFormAppList_INIT"
            }
        };
    }
    if (menu[frameModel]==undefined){ //預設沒有就是載入gform的list頁
        menu[frameModel] = {
            url: "iq-nurs/nursing/customFormV4/gFormWebLIST.html"
            ,headerTitle: "defult"
            ,formType: formType
            ,frameModel: frameModel
            ,frameModel_INIT: frameModel+"_INIT"
        }
    }
    if (frameModel)
        window.localStorage["previousPage"] = menu[frameModel].url;
    else
        window.localStorage["previousPage"] = menu.AppLIST.url;
    //AppLIST
    window.localStorage["AppLIST_headerTitle"] = menu.AppLIST.headerTitle;  //設定Title
    window.localStorage["AppLIST_formType"] = menu.AppLIST.formType;  //設定此form的beanName
    window.localStorage["AppLIST_frameModel"] = menu.AppLIST.frameModel;  //設定此page的對應功能頁面
    window.localStorage["AppLIST_frameModel_INIT"] = menu.AppLIST.frameModel_INIT;  //設定此page的對應功能頁面程式
    //AppADD
    window.localStorage["AppADD_headerTitle"] = menu.AppADD.headerTitle;  //設定Title
    window.localStorage["AppADD_formType"] = menu.AppADD.formType;  //設定此form的beanName
    window.localStorage["AppADD_frameModel"] = menu.AppADD.frameModel;  //設定此page的對應功能頁面
    window.localStorage["AppADD_frameModel_INIT"] = menu.AppADD.frameModel_INIT;  //設定此page的對應功能頁面程式
    //AppUPD
    window.localStorage["AppUPD_headerTitle"] = menu.AppUPD.headerTitle;  //設定Title
    window.localStorage["AppUPD_formType"] = menu.AppUPD.formType;  //設定此form的beanName
    window.localStorage["AppUPD_frameModel"] = menu.AppUPD.frameModel;  //設定此page的對應功能頁面
    window.localStorage["AppUPD_frameModel_INIT"] = menu.AppUPD.frameModel_INIT;  //設定此page的對應功能頁面程式
    //WebLIST
    window.localStorage["WebLIST_headerTitle"] = menu.WebLIST.headerTitle;  //設定Title
    window.localStorage["WebLIST_formType"] = menu.WebLIST.formType;  //設定此form的beanName
    window.localStorage["WebLIST_frameModel"] = menu.WebLIST.frameModel;  //設定此page的對應功能頁面
    window.localStorage["WebLIST_frameModel_INIT"] = menu.WebLIST.frameModel_INIT;  //設定此page的對應功能頁面程式
    //WebADD
    window.localStorage["WebADD_headerTitle"] = menu.WebADD.headerTitle;  //設定Title
    window.localStorage["WebADD_formType"] = menu.WebADD.formType;  //設定此form的beanName
    window.localStorage["WebADD_frameModel"] = menu.WebADD.frameModel;  //設定此page的對應功能頁面
    window.localStorage["WebADD_frameModel_INIT"] = menu.WebADD.frameModel_INIT;  //設定此page的對應功能頁面程式
    //WebUPD
    window.localStorage["WebUPD_headerTitle"] = menu.WebUPD.headerTitle;  //設定Title
    window.localStorage["WebUPD_formType"] = menu.WebUPD.formType;  //設定此form的beanName
    window.localStorage["WebUPD_frameModel"] = menu.WebUPD.frameModel;  //設定此page的對應功能頁面
    window.localStorage["WebUPD_frameModel_INIT"] = menu.WebUPD.frameModel_INIT;  //設定此page的對應功能頁面程式
    if (formType=="formTemplate"||formType=="formItemTemplate"){
        //formTemplateLIST
        window.localStorage["formTemplateLIST_headerTitle"] = menu.formTemplateLIST.headerTitle;
        window.localStorage["formTemplateLIST_formType"] = menu.formTemplateLIST.formType;
        window.localStorage["formTemplateLIST_frameModel"] = menu.formTemplateLIST.frameModel;
        window.localStorage["formTemplateLIST_frameModel_INIT"] = menu.formTemplateLIST.frameModel_INIT;
        window.localStorage["formTemplateLIST_sourceId"] = menu.formTemplateLIST.sourceId;
        //formTemplateADD
        window.localStorage["formTemplateADD_headerTitle"] = menu.formTemplateADD.headerTitle;
        window.localStorage["formTemplateADD_formType"] = menu.formTemplateADD.formType;
        window.localStorage["formTemplateADD_frameModel"] = menu.formTemplateADD.frameModel;
        window.localStorage["formTemplateADD_frameModel_INIT"] = menu.formTemplateADD.frameModel_INIT;
        window.localStorage["formTemplateADD_sourceId"] = menu.formTemplateADD.sourceId;
        //formTemplateUPD
        window.localStorage["formTemplateUPD_headerTitle"] = menu.formTemplateUPD.headerTitle;
        window.localStorage["formTemplateUPD_formType"] = menu.formTemplateUPD.formType;
        window.localStorage["formTemplateUPD_frameModel"] = menu.formTemplateUPD.frameModel;
        window.localStorage["formTemplateUPD_frameModel_INIT"] = menu.formTemplateUPD.frameModel_INIT;
        window.localStorage["formTemplateUPD_sourceId"] = menu.formTemplateUPD.sourceId;
        //formItemTemplateLIST
        window.localStorage["formItemTemplateLIST_headerTitle"] = menu.formItemTemplateLIST.headerTitle;
        window.localStorage["formItemTemplateLIST_formType"] = menu.formItemTemplateLIST.formType;
        window.localStorage["formItemTemplateLIST_frameModel"] = menu.formItemTemplateLIST.frameModel;
        window.localStorage["formItemTemplateLIST_frameModel_INIT"] = menu.formItemTemplateLIST.frameModel_INIT;
        //formItemTemplateADD
        window.localStorage["formItemTemplateADD_headerTitle"] = menu.formItemTemplateADD.headerTitle;
        window.localStorage["formItemTemplateADD_formType"] = menu.formItemTemplateADD.formType;
        window.localStorage["formItemTemplateADD_frameModel"] = menu.formItemTemplateADD.frameModel;
        window.localStorage["formItemTemplateADD_frameModel_INIT"] = menu.formItemTemplateADD.frameModel_INIT;
        //formItemTemplateUPD
        window.localStorage["formItemTemplateUPD_headerTitle"] = menu.formItemTemplateUPD.headerTitle;
        window.localStorage["formItemTemplateUPD_formType"] = menu.formItemTemplateUPD.formType;
        window.localStorage["formItemTemplateUPD_frameModel"] = menu.formItemTemplateUPD.frameModel;
        window.localStorage["formItemTemplateUPD_frameModel_INIT"] = menu.formItemTemplateUPD.frameModel_INIT;
    }
    else{
        //gFormLIST
        window.localStorage["gFormWebLIST_headerTitle"] = menu.gFormWebLIST.headerTitle;
        window.localStorage["gFormWebLIST_formType"] = menu.gFormWebLIST.formType;
        window.localStorage["gFormWebLIST_frameModel"] = menu.gFormWebLIST.frameModel;
        window.localStorage["gFormWebLIST_frameModel_INIT"] = menu.gFormWebLIST.frameModel_INIT;
        if (menu.gFormWebLIST.sourceId)
            window.localStorage["gFormWebLIST_sourceId"] = menu.gFormWebLIST.sourceId;
        //gFormWebADD
        window.localStorage["gFormWebADD_headerTitle"] = menu.gFormWebADD.headerTitle;
        window.localStorage["gFormWebADD_formType"] = menu.gFormWebADD.formType;
        window.localStorage["gFormWebADD_frameModel"] = menu.gFormWebADD.frameModel;
        window.localStorage["gFormWebADD_frameModel_INIT"] = menu.gFormWebADD.frameModel_INIT;
        if (menu.gFormWebLIST.sourceId)
            window.localStorage["gFormWebADD_sourceId"] = menu.gFormWebLIST.sourceId;
        //gFormWebUPD
        window.localStorage["gFormWebUPD_headerTitle"] = menu.gFormWebUPD.headerTitle;
        window.localStorage["gFormWebUPD_formType"] = menu.gFormWebUPD.formType;
        window.localStorage["gFormWebUPD_frameModel"] = menu.gFormWebUPD.frameModel;
        window.localStorage["gFormWebUPD_frameModel_INIT"] = menu.gFormWebUPD.frameModel_INIT;
        if (menu.gFormWebLIST.sourceId)
            window.localStorage["gFormWebUPD_sourceId"] = menu.gFormWebLIST.sourceId;
        //gFormWebPRINT
        window.localStorage["gFormWebPRINT_headerTitle"] = menu.gFormWebPRINT.headerTitle;
        window.localStorage["gFormWebPRINT_formType"] = menu.gFormWebPRINT.formType;
        window.localStorage["gFormWebPRINT_frameModel"] = menu.gFormWebPRINT.frameModel;
        window.localStorage["gFormWebPRINT_frameModel_INIT"] = menu.gFormWebPRINT.frameModel_INIT;
        if (menu.gFormWebLIST.sourceId)
            window.localStorage["gFormWebPRINT_sourceId"] = menu.gFormWebLIST.sourceId;
    }

    return menu;
}
//----------------------------------------------------
function LogFile(){
    $N.sendMsg("logfile","","","",function (data) {
        console.log(data);
    },function (e) {
        console.error(e);
    })
}

function setTitle(){
    var currentPatient=nursing.getPatient().getCurrent();
    if(currentPatient){
        document.getElementById("USER").innerHTML = nursing.getUser().getCurrent().fullName;
        $.get('./template/patientHeader.html',function (result) {
            var patHeader=$(result);
            var render = template.compile(patHeader.html());
            var html = render(currentPatient);
            $('#p_age').closest('header').html(html);
        })
    }
}