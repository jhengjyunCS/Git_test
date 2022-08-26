<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.net.URLDecoder"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%
    String formType = (String) request.getParameter("formType");
    String sourceId = (String) request.getParameter("sourceId");
    String frameModel = (String) request.getParameter("frameModel");
    String hrefUrl = (String) request.getParameter("hrefUrl");
    String userName = URLDecoder.decode(((String) request.getParameter("userName")).replaceAll("\\|A\\|","%"), "utf-8");
    String userId = (String) request.getParameter("userId");
    String formId = (String) request.getParameter("formId");
    String stationId = (String) request.getParameter("stationId");
    String encId = (String) request.getParameter("encId");
    String patientId = (String) request.getParameter("patientId");
    String otherPrem = (String) request.getParameter("otherPrem");
    String realPath = (String) request.getParameter("realPath");
    String path = request.getContextPath();
    String position = "";
    String possessive = "";
    try{
        position = URLDecoder.decode(((String) request.getParameter("position")).replaceAll("\\|A\\|","%"), "utf-8");
        possessive = URLDecoder.decode(((String) request.getParameter("possessive")).replaceAll("\\|A\\|","%"), "utf-8");
    } catch (Exception e) {
    }
%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <META http-equiv="Expires" content="Mon, 26 Jul 1997 05:00:00 GMT">
    <META http-equiv="Last-Modified" content="Sat, 10 Nov 1997 09:08:07 GMT">
    <META http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
    <META http-equiv="Pragma" content="no-cache">
    <script type="text/javascript" src="<c:url value="/META-JS/properties.js?csSvnVersion="/>"></script>
    <script type="text/javascript" src="<c:url value="/iq-nurs/nursing/customFormV3/js2/jquery.js?csSvnVersion="/>"></script>
    <script type="text/javascript" src="<c:url value="/iq-nurs/nursing/customFormV3/js/json2.js?csSvnVersion="/>"></script>
    <script type="text/javascript" src="<c:url value="/iq-nurs/nursing/customFormV3/js/common.js?csSvnVersion="/>"></script>
    <script type="text/javascript" src="<c:url value="/iq-nurs/nursing/customFormV3/js/includeHeadFileWeb.js?csSvnVersion="/>"></script>
    <style>
        .showFrame{
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <iframe class="showFrame" frameborder="0" src=""></iframe>
</body>
</html>
<script type="text/javascript" src="<c:url value="/js/global/nis/v2.0/modules/eNursing.js?csSvnVersion="/>"></script>
<script>

var formType="<c:out value='<%=formType %>'/>";
var frameModel="<c:out value='<%=frameModel %>'/>";
var hrefUrl="<c:out value='<%=hrefUrl %>'/>";
var userName="<c:out value='<%=userName %>'/>";
var userId="<c:out value='<%=userId %>'/>";
var encId="<c:out value='<%=encId %>'/>";
var path = "<c:out value='<%=path%>'/>";
var menu={
    gFormWebLIST:{
        url: "gFormWebLIST.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "gFormWebLIST"
        ,frameModel_INIT: "gFormWebLIST_INIT"
    }
    ,gFormWebADD:{
        url: "gFormWebADD.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "gFormWebADD"
        ,frameModel_INIT: "gFormWebADD_INIT"
    }
    ,gFormWebUPD:{
        url: "gFormWebUPD.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "gFormWebUPD"
        ,frameModel_INIT: "gFormWebUPD_INIT"
    }
    ,gFormWebPRINT:{
        url: "gFormWebPRINT.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "gFormWebPRINT"
        ,frameModel_INIT: "gFormWebPRINT_INIT"
    }
    ,gFormWebPRINT2:{
        url: "gFormWebPRINT2.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "gFormWebPRINT2"
        ,frameModel_INIT: "gFormWebPRINT2_INIT"
    }
    ,formItemTemplateLIST:{
        url: "formItemTemplateLIST.html"
        ,headerTitle: "web目前未設定"
        ,formType: "formItemTemplate"
        ,frameModel: "formItemTemplateLIST"
        ,frameModel_INIT: "formItemTemplateLIST_INIT"
    }
    ,formItemTemplateADD:{
        url: "formItemTemplateADD.html"
        ,headerTitle: "web目前未設定"
        ,formType: "formItemTemplate"
        ,frameModel: "formItemTemplateADD"
        ,frameModel_INIT: "formItemTemplateADD_INIT"
    }
    ,formItemTemplateUPD:{
        url: "formItemTemplateUPD.html"
        ,headerTitle: "web目前未設定"
        ,formType: "formItemTemplate"
        ,frameModel: "formItemTemplateUPD"
        ,frameModel_INIT: "formItemTemplateUPD_INIT"
    }
};
//在gform.jsp的下一個跳轉的頁面：只有當defaultUrl為gform.jsp且frameModel不是預設add/upd/list時才會用到
if (menu[frameModel]==undefined){ //預設沒有就是載入gform的 hrefUrl 頁，hrefUrl沒設定就導入gFormWebLIST.html
    menu[frameModel] = {
        url: (hrefUrl==null || hrefUrl=="null") ? "gFormWebLIST.html" : hrefUrl
        ,headerTitle: "defult"
        ,formType: formType
        ,frameModel: frameModel
        ,frameModel_INIT: frameModel+"_INIT"
    }
    window.localStorage[frameModel+"_headerTitle"] = menu[frameModel].headerTitle;  //設定Title
    window.localStorage[frameModel+"_formType"] = menu[frameModel].formType;  //設定此form的beanName
    window.localStorage[frameModel+"_frameModel"] = menu[frameModel].frameModel;  //設定此page的對應功能頁面
    window.localStorage[frameModel+"_frameModel_INIT"] = menu[frameModel].frameModel_INIT;  //設定此page的對應功能頁面程式
    window.localStorage[frameModel+"_sourceId"] = "<c:out value='<%=sourceId%>'/>";
    //讓預設頁可以讀到正確的frameModel
    if (hrefUrl==menu.gFormWebLIST.url){
    	menu.gFormWebLIST.frameModel=menu[frameModel].frameModel;
    	menu.gFormWebLIST.frameModel_INIT=menu[frameModel].frameModel_INIT;
    }
    if (hrefUrl==menu.gFormWebADD.url){
    	menu.gFormWebADD.frameModel=menu[frameModel].frameModel;
    	menu.gFormWebADD.frameModel_INIT=menu[frameModel].frameModel_INIT;
    }
    if (hrefUrl==menu.gFormWebUPD.url){
    	menu.gFormWebUPD.frameModel=menu[frameModel].frameModel;
    	menu.gFormWebUPD.frameModel_INIT=menu[frameModel].frameModel_INIT;
    }
}
//occupier
window.localStorage["gForm_stationBed"]="${occupier.stationBed}";
window.localStorage["gForm_stationId"]="${occupier.station}";
window.localStorage["gForm_patientName"]="${occupier.chinName}";
window.localStorage["gForm_section"]="${occupier.section}";
window.localStorage["gForm_sex"]="${occupier.sexc}";
window.localStorage["gForm_birthday"]="<fmt:formatDate value="${patient.birthday}" pattern="yyyy/MM/dd"/>";
window.localStorage["gForm_patientId"]="${occupier.hisNum}";
window.localStorage["gForm_encId"]="${occupier.caseno}";

//user
window.localStorage["gForm_userId"] = userId;
window.localStorage["gForm_userName"] = userName;

var multiLevel = eNursing.UUID(20);
//gFormWebLIST
window.localStorage["gFormWebLIST_headerTitle" + multiLevel] = menu.gFormWebLIST.headerTitle;  //設定Title
window.localStorage["gFormWebLIST_formType" + multiLevel] = menu.gFormWebLIST.formType;  //設定此form的beanName
window.localStorage["gFormWebLIST_frameModel" + multiLevel] = menu.gFormWebLIST.frameModel;  //設定此page的對應功能頁面
window.localStorage["gFormWebLIST_frameModel_INIT" + multiLevel] = menu.gFormWebLIST.frameModel_INIT;  //設定此page的對應功能頁面程式
window.localStorage["gFormWebLIST_sourceId" + multiLevel] = "<c:out value='<%=sourceId%>'/>";
//gFormWebADD
window.localStorage["gFormWebADD_headerTitle" + multiLevel] = menu.gFormWebADD.headerTitle;  //設定Title
window.localStorage["gFormWebADD_formType" + multiLevel] = menu.gFormWebADD.formType;  //設定此form的beanName
window.localStorage["gFormWebADD_frameModel" + multiLevel] = menu.gFormWebADD.frameModel;  //設定此page的對應功能頁面
window.localStorage["gFormWebADD_frameModel_INIT" + multiLevel] = menu.gFormWebADD.frameModel_INIT;  //設定此page的對應功能頁面程式
window.localStorage["gFormWebADD_sourceId" + multiLevel] = "<c:out value='<%=sourceId%>'/>";
window.localStorage["gFormWebADD_stationId" + multiLevel] = "<c:out value='<%=stationId%>'/>";
window.localStorage["gFormWebADD_formId" + multiLevel] = "<c:out value='<%=formId%>'/>";
//gFormWebUPD
window.localStorage["gFormWebUPD_headerTitle" + multiLevel] = menu.gFormWebUPD.headerTitle;  //設定Title
window.localStorage["gFormWebUPD_formType" + multiLevel] = menu.gFormWebUPD.formType;  //設定此form的beanName
window.localStorage["gFormWebUPD_frameModel" + multiLevel] = menu.gFormWebUPD.frameModel;  //設定此page的對應功能頁面
window.localStorage["gFormWebUPD_frameModel_INIT" + multiLevel] = menu.gFormWebUPD.frameModel_INIT;  //設定此page的對應功能頁面程式
window.localStorage["gFormWebUPD_sourceId" + multiLevel] = "<c:out value='<%=sourceId%>'/>";
window.localStorage["gFormWebUPD_formId" + multiLevel] = "<c:out value='<%=formId%>'/>";
window.localStorage["gFormWebUPD_stationId" + multiLevel] = "<c:out value='<%=stationId%>'/>";
window.localStorage["gFormWebUPD_path" + multiLevel] = "<c:out value='<%=path%>'/>";
window.localStorage["gFormWebUPD_encId"] = "<c:out value='<%=encId%>'/>";
window.localStorage["gFormWebUPD_patientId"] = "<c:out value='<%=patientId%>'/>";
//gFormWebPRINT
window.localStorage["gFormWebPRINT_headerTitle" + multiLevel] = menu.gFormWebPRINT.headerTitle;  //設定Title
window.localStorage["gFormWebPRINT_formType" + multiLevel] = menu.gFormWebPRINT.formType;  //設定此form的beanName
window.localStorage["gFormWebPRINT_frameModel" + multiLevel] = menu.gFormWebPRINT.frameModel;  //設定此page的對應功能頁面
window.localStorage["gFormWebPRINT_frameModel_INIT" + multiLevel] = menu.gFormWebPRINT.frameModel_INIT;  //設定此page的對應功能頁面程式
window.localStorage["gFormWebPRINT_sourceId" + multiLevel] = "<c:out value='<%=sourceId%>'/>";
window.localStorage["gFormWebPRINT_formId" + multiLevel] = "<c:out value='<%=formId%>'/>";
window.localStorage["gFormWebPRINT_stationId" + multiLevel] = "<c:out value='<%=stationId%>'/>";
window.localStorage["gFormWebPRINT_path" + multiLevel] = "<c:out value='<%=path%>'/>";
window.localStorage["gFormWebPRINT_encId"] = "<c:out value='<%=encId%>'/>";
window.localStorage["gFormWebPRINT_patientId"] = "<c:out value='<%=patientId%>'/>";
//gFormWebPRINT2
window.localStorage["gFormWebPRINT2_headerTitle" + multiLevel] = menu.gFormWebPRINT2.headerTitle;  //設定Title
window.localStorage["gFormWebPRINT2_formType" + multiLevel] = menu.gFormWebPRINT2.formType;  //設定此form的beanName
window.localStorage["gFormWebPRINT2_frameModel" + multiLevel] = menu.gFormWebPRINT2.frameModel;  //設定此page的對應功能頁面
window.localStorage["gFormWebPRINT2_frameModel_INIT" + multiLevel] = menu.gFormWebPRINT2.frameModel_INIT;  //設定此page的對應功能頁面程式
window.localStorage["gFormWebPRINT2_sourceId" + multiLevel] = "<c:out value='<%=sourceId%>'/>";
window.localStorage["gFormWebPRINT2_formId" + multiLevel] = "<c:out value='<%=formId%>'/>";
window.localStorage["gFormWebPRINT2_stationId" + multiLevel] = "<c:out value='<%=stationId%>'/>";
window.localStorage["gFormWebPRINT2_path" + multiLevel] = "<c:out value='<%=path%>'/>";
window.localStorage["gFormWebPRINT2_encId"] = "<c:out value='<%=encId%>'/>";
window.localStorage["gFormWebPRINT2_patientId"] = "<c:out value='<%=patientId%>'/>";

window.localStorage["userPosition"] = "<c:out value='<%=position%>'/>";
window.localStorage["userPossessive"] = "<c:out value='<%=possessive%>'/>";

window.localStorage["gFormWeb_otherPrem"] = '<c:out value='<%=otherPrem%>'/>';

window.localStorage["gFormWebADD_formId"] = "<c:out value='<%=formId%>'/>";

var paramJson = getParamJson()
window.localStorage['gForm.jsp_url_parameters'+multiLevel] = JSON.stringify(paramJson)
function getParamJson(){
    var params=location.href.split("?")[1];
    if (params){
        params=params.split(/[&=]/g);
        var json={};
        for (var i=0, len=params.length; i<len; i+=2){
            json[params[i]]=decodeURI(params[i+1]);
        }
        json.multiLevel=json.multiLevel?json.multiLevel:"";
        return json;
    }else{
        return {multiLevel:""};
    }
}

//防止iframe的localStorage干擾
function setMultiLevel(url){
    if (url.indexOf('multiLevel') === -1){
        return url+"&multiLevel="+multiLevel;
    }
}

var thisUrl = '<c:url value="/iq-nurs/nursing/customFormV4/"/>';
// 外部鏈接訪問，需要使用全路徑
if(thisUrl.indexOf('jsessionid') != -1){
    $(".showFrame")[0].contentWindow.location.href = "<c:out value='<%=realPath %>'/>/iq-nurs/nursing/customFormV4/"+setMultiLevel(stopIframeCache(menu[frameModel].url));
}else{
    $(".showFrame")[0].contentWindow.location.href = "<c:url value="/iq-nurs/nursing/customFormV4/"/>"+setMultiLevel(stopIframeCache(menu[frameModel].url));
}
</script>