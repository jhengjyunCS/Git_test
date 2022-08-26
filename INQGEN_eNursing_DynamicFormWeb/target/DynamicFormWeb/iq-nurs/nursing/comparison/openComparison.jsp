<%@ page import="com.inqgen.nursing.dynamic.form.bean.comparison.GFormComparison" %>
<%@ page import="com.inqgen.nursing.dynamic.form.bean.comparison.GFormComparisonItem" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%
    boolean open = GFormComparison.openStatus();
    request.setAttribute("open", open);

    Map<String, Map<String, GFormComparisonItem>> comparisonDataMap = GFormComparison.getComparisonData();
    request.setAttribute("comparisonDataMap", comparisonDataMap);
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Insert title here</title>
    <style type="text/css">
        table {
            width: 100%;
            text-align: left;
            border: 1px solid black;
            border-collapse: collapse;
        }

        td {
            border: 1px solid black;
            padding: 2px;
        }
    </style>
    <script type="text/javascript">

        function compOpen() {
            location.href = 'gFormComparison1.jsp'
        }

        function compClose() {
            location.href = 'gFormComparison2.jsp'
        }

        function compRefresh() {
            location.href = 'gFormComparison3.jsp'
        }

    </script>
</head>
<body>
<div style="text-align: center;width: 98%;padding: 5px;margin: 1%;">
    <button onclick="compOpen()">开启</button>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button onclick="compClose()">关闭</button>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button onclick="compRefresh()">刷新</button>
    <br><br>
    <div>
        <div style="width: 100%;text-align: left;">当前状态：<font color="red"><c:choose><c:when test="${open}">已开启</c:when><c:otherwise>已关闭</c:otherwise></c:choose></font></div>
        <c:if test="${not empty comparisonDataMap}">
            <table cellpadding="0" cellspacing="0" border="1" style="border-bottom: 0;">
                <tr>
                    <th style="width: 30%;text-align: center;">formItem</th>
                    <th style="width: 30%;text-align: center;">itemKey</th>
                    <th style="width: 20%;text-align: center;">uiValue</th>
                    <th style="width: 20%;text-align: center;">vKey</th>
                </tr>
            </table>
            <table cellpadding="0" cellspacing="0">
                <c:forEach items="${comparisonDataMap}" var="map">
                    <c:set var="key" value="${map.key}"/>
                    <c:set var="comparisonItemMap" value="${map.value}"/>
                    <c:forEach var="comparisonItem" items="${comparisonItemMap }" varStatus="index">
                        <tr>
                            <c:if test="${index.index == 0}">
                                <td style="width: 30%;" rowspan="${fn:length(comparisonItemMap)}">${key}</td>
                            </c:if>
                            <td style="width: 30%;">${comparisonItem.key}</td>
                            <td style="width: 40%;">
                                <c:if test="${not empty comparisonItem.value && not empty comparisonItem.value.comparisonValues && fn:length(comparisonItem.value.comparisonValues) > 0}">
                                    <table cellpadding="0" cellspacing="0" style="border-style: hidden;">
                                        <c:forEach var="comparisonValue" items="${comparisonItem.value.comparisonValues }">
                                            <tr>
                                                <td style="width: 50%;">${comparisonValue.uiValue}</td>
                                                <td style="width: 50%;">${comparisonValue.vKey}</td>
                                            </tr>
                                        </c:forEach>
                                    </table>
                                </c:if>
                            </td>
                        </tr>
                    </c:forEach>
                </c:forEach>
            </table>
        </c:if>
        <c:if test="${empty comparisonDataMap}">
            获取对照表数据失败！
        </c:if>
    </div>
</div>
</body>
</html>