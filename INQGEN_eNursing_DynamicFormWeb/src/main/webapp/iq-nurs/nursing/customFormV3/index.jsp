//生理監測修改-1
<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="../setCheckUpdateFunction.jsp"%>
<%@ page import="com.fto.m2.service.org.User"%>
<%@page import="com.fto.m2.service.security.MemberConnection"%>
<%@ page import="com.fto.m2.servlet.RequestAttributeKeys"%>
<%@ page import="com.fto.m2.servlet.RunData"%>
<%@ page import="com.inqgen.ehis.baseinfo.careinfo.Occupier"%>
<%@ page import="com.inqgen.ehis.baseinfo.hisorg.Station"%>
<%@ taglib prefix="nis" uri="http://www.inqgen.com/taglibs/nis"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%@ page import="com.inqgen.ehis.baseinfo.patient.Patient"%>

<%
	RunData rundata = (RunData) request.getAttribute(RequestAttributeKeys.RUNDATA);
	//取得使用者
	MemberConnection mc = rundata.getMemberConnection();
	User user = (User) rundata.getAttribute("user");
	String zoneId = (String) rundata.getAttribute("zoneId");
	Station station = (Station) rundata.getAttribute("station");
	Patient pat = (Patient) rundata.getAttribute("pat");
	Occupier occ = (Occupier) rundata.getAttribute("occ");

	String encid = (String) rundata.getAttribute("encid");
	String formType = (String) rundata.getAttribute("formType");
	String frameModel = (String) rundata.getAttribute("frameModel");
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
var user = {
    "nodeId": "User",
    "loginId": "<%=user.getName() %>",
    "fullName": "<%=user.getFullName() %>",
    "password": null,
    "stationIds": "<%=station.getId() %>",
    "data": {}
};

var zone = {
    "nodeId": "Zone",
    "zone": "<%=zoneId %>",
    "name": "<%=zoneId %>",
    "parent": {},
    "data": {}
};


var station = {
    "nodeId": "Station",
    "stationId": "<%=station.getId() %>",
    "stationName": "<%=station.getComment() %>",
    "parent": {},
    "data": {}
};

var patient = {
    "nodeId": "Patient",
    "hisNum": "<%=pat.getHisNum() %>",
    "caseno": "<%=encid %>",
    "chinName": "<%=pat.getName() %>",
    "engName": "<%=pat.getEnglishName() %>",
    "bed": "<%=occ.getBed() %>",
    
    <c:if test="${occ.inDate !=null}">
    "inDate": "<fmt:formatDate value="${occ.inDate }" pattern="yyyy/MM/dd HH:mm:ss"/>",
    </c:if>
    <c:if test="${occ.inStationDate !=null}">
    "inStationDate": "<fmt:formatDate value="${occ.inStationDate }" pattern="yyyy/MM/dd HH:mm:ss"/>",
    </c:if>
    <c:if test="${occ.birthday !=null}">
    "birthday": "<fmt:formatDate value="${occ.birthday }" pattern="yyyy/MM/dd HH:mm:ss"/>",
    </c:if>
    
    "sex": "<%=occ.getSex() %>",
    "section": "<%=occ.getSection() %>",
    "status": "<%=occ.getStatus() %>",
    
   
    
    "diagnosis": "<%=occ.getDiagnosis() %>",
   
    "patAge": "<%=pat.getAge() %>",
   
   
    
   
    "insuranceType": "null",
    "parent": {},
    "nodeValue": "<%=encid %>"
};
for (key in patient){
	patient[key] = (patient[key]=="null") ? null : patient[key];
}
for (key in station){
	station[key] = (station[key]=="null") ? null : station[key];
}
for (key in zone){
	zone[key] = (zone[key]=="null") ? null : zone[key];
}
for (key in user){
	user[key] = (user[key]=="null") ? null : user[key];
}

window.localStorage["getSelectedPatient"] = JSON.stringify(patient);
window.localStorage["getSelectedStation"] = JSON.stringify(station);
window.localStorage["getSelectedZone"] = JSON.stringify(zone);
window.localStorage["getSelectedUser"] = JSON.stringify(user);

var formType="<%=formType %>";
var frameModel="<%=frameModel %>";
var menu={
    WebLIST:{
        url: "WebLIST.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "WebLIST"
        ,frameModel_INIT: "WebLIST_INIT"
    }
    ,WebADD:{
        url: "WebADD.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "WebADD"
        ,frameModel_INIT: "WebADD_INIT"
    }
    ,WebUPD:{
        url: "WebUPD.html"
        ,headerTitle: "web目前未設定"
        ,formType: formType
        ,frameModel: "WebUPD"
        ,frameModel_INIT: "WebUPD_INIT"
    }
};

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
$(".showFrame")[0].contentWindow.location.href = "<c:url value="/iq-nurs/nursing/customFormV3/"/>"+stopIframeCache(menu[frameModel].url);


</script>