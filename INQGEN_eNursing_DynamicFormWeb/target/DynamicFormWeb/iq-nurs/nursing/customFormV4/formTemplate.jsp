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
    String userName = URLDecoder.decode(((String) request.getParameter("userName")).replaceAll("\\|A\\|","%"), "utf-8");
	String userId = (String) request.getParameter("userId");
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
var userName="<c:out value='<%=userName %>'/>";
var userId="<c:out value='<%=userId %>'/>";
var menu={
    formTemplateLIST:{
        url: "formTemplateLIST.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "formTemplateLIST"
        ,frameModel_INIT: "formTemplateLIST_INIT"
    }
    ,formTemplateADD:{
        url: "formTemplateADD.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "formTemplateADD"
        ,frameModel_INIT: "formTemplateADD_INIT"
    }
    ,formTemplateUPD:{
        url: "formTemplateUPD.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "formTemplateUPD"
        ,frameModel_INIT: "formTemplateUPD_INIT"
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
//user
window.localStorage["gForm_userId"] = userId;
window.localStorage["gForm_userName"] = userName;
//formTemplateLIST
window.localStorage["formTemplateLIST_headerTitle"] = menu.formTemplateLIST.headerTitle;  //設定Title
window.localStorage["formTemplateLIST_formType"] = menu.formTemplateLIST.formType;  //設定此form的beanName
window.localStorage["formTemplateLIST_frameModel"] = menu.formTemplateLIST.frameModel;  //設定此page的對應功能頁面
window.localStorage["formTemplateLIST_frameModel_INIT"] = menu.formTemplateLIST.frameModel_INIT;  //設定此page的對應功能頁面程式
window.localStorage["formTemplateLIST_sourceId"] = "<c:out value='<%=sourceId%>'/>";
//formTemplateADD
window.localStorage["formTemplateADD_headerTitle"] = menu.formTemplateADD.headerTitle;  //設定Title
window.localStorage["formTemplateADD_formType"] = menu.formTemplateADD.formType;  //設定此form的beanName
window.localStorage["formTemplateADD_frameModel"] = menu.formTemplateADD.frameModel;  //設定此page的對應功能頁面
window.localStorage["formTemplateADD_frameModel_INIT"] = menu.formTemplateADD.frameModel_INIT;  //設定此page的對應功能頁面程式
window.localStorage["formTemplateADD_sourceId"] = "<c:out value='<%=sourceId%>'/>";
//formTemplateUPD
window.localStorage["formTemplateUPD_headerTitle"] = menu.formTemplateUPD.headerTitle;  //設定Title
window.localStorage["formTemplateUPD_formType"] = menu.formTemplateUPD.formType;  //設定此form的beanName
window.localStorage["formTemplateUPD_frameModel"] = menu.formTemplateUPD.frameModel;  //設定此page的對應功能頁面
window.localStorage["formTemplateUPD_frameModel_INIT"] = menu.formTemplateUPD.frameModel_INIT;  //設定此page的對應功能頁面程式
window.localStorage["formTemplateUPD_sourceId"] = "<c:out value='<%=sourceId%>'/>";
//formItemTemplateLIST
window.localStorage["formItemTemplateLIST_headerTitle"] = menu.formItemTemplateLIST.headerTitle;  //設定Title
window.localStorage["formItemTemplateLIST_formType"] = menu.formItemTemplateLIST.formType;  //設定此form的beanName
window.localStorage["formItemTemplateLIST_frameModel"] = menu.formItemTemplateLIST.frameModel;  //設定此page的對應功能頁面
window.localStorage["formItemTemplateLIST_frameModel_INIT"] = menu.formItemTemplateLIST.frameModel_INIT;  //設定此page的對應功能頁面程式
//formItemTemplateADD
window.localStorage["formItemTemplateADD_headerTitle"] = menu.formItemTemplateADD.headerTitle;  //設定Title
window.localStorage["formItemTemplateADD_formType"] = menu.formItemTemplateADD.formType;  //設定此form的beanName
window.localStorage["formItemTemplateADD_frameModel"] = menu.formItemTemplateADD.frameModel;  //設定此page的對應功能頁面
window.localStorage["formItemTemplateADD_frameModel_INIT"] = menu.formItemTemplateADD.frameModel_INIT;  //設定此page的對應功能頁面程式
//formItemTemplateUPD
window.localStorage["formItemTemplateUPD_headerTitle"] = menu.formItemTemplateUPD.headerTitle;  //設定Title
window.localStorage["formItemTemplateUPD_formType"] = menu.formItemTemplateUPD.formType;  //設定此form的beanName
window.localStorage["formItemTemplateUPD_frameModel"] = menu.formItemTemplateUPD.frameModel;  //設定此page的對應功能頁面
window.localStorage["formItemTemplateUPD_frameModel_INIT"] = menu.formItemTemplateUPD.frameModel_INIT;  //設定此page的對應功能頁面程式
$(".showFrame")[0].contentWindow.location.href = "<c:url value="/iq-nurs/nursing/customFormV4/"/>"+stopIframeCache(menu[frameModel].url);


</script>