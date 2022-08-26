
//不走加快效能設定
for (key in _pfm){
    console.log(_pfm[key]);
    _pfm[key] = false;
}

//依照路徑上的檔案同步資料
function getAjaxSyncData(){
    setTargetUrl("Local", function(){
        $("#syncMsg").html("");
        //資料來源為textarea
        if ($("#chkPasteToTextarea")[0].checked){
            evalByRunScript($("#tareaSyncData_Upload").val());
        }else{//資料來源為檔案
            var files = document.getElementById("fileSyncData");
            if (files.files.length==0){
                alert("請選擇檔案");
                return false;
            }
            for (var i=0, len=files.files.length; i<len; ++i){
                var file = files.files[i];
                var reader = new FileReader();
                reader.onload = function() { //完成后this.result为二进制流
                    evalByRunScript(this.result);
                    // $("body").append('<script src="'+$("#urlSyncData").val()+'?version='+Math.random()+'"></script>');
                };
                reader.readAsText(file);
            }
        }
    });
}

//不使用檔案上傳 被勾選
function showPasteToTextarea(that){
    if (that.checked){
        $("#fileSyncData").hide();
        $("#tareaSyncData_Server").show();
        $("#tareaSyncData_Upload").show();
    }else{
        $("#fileSyncData").show();
        $("#tareaSyncData_Server").hide();
        $("#tareaSyncData_Upload").hide();
    }
}

function setTargetUrl(mode, successCall){
    if (mode=="Local"){
        //檢查 gformServiceUrl
        var urlLocal_gform=$("#urlLocal_gform").val();
        if (urlLocal_gform.indexOf("http://")>-1||urlLocal_gform.indexOf("https://")>-1){
            const_gformServiceUrl = urlLocal_gform;
        }else{
            alert("Local端的gformServiceUrl輸入有誤");
            return false;
        }
        window.localStorage["sync_urlLocal_gform"]=urlLocal_gform;

        //檢查 serviceUrl
        var urlLocal=$("#urlLocal").val();
        if (urlLocal.indexOf("ws://")>-1){
            if (!const_socketEnable){
                alert("尚無啟用webSocket接口！");
                return false;
            }
            const_socketUrl=urlLocal;
            eNursing.createWebSocket(successCall,function(){
                alert("無法連上Local端的webSocket接口！");
            });
        }else if (urlLocal.indexOf("http://")>-1||urlLocal.indexOf("https://")>-1){
            if (!const_webserviceEnable){
                alert("尚無啟用webService接口！");
                return false;
            }
            eNursing.serviceUrl=urlLocal;
            successCall();
        }else{
            alert("Local端的serviceUrl輸入有誤");
            return false;
        }
        window.localStorage["sync_urlLocal"]=urlLocal;
    }else if (mode=="Server"){
        //檢查 gformServiceUrl
        var urlServer_gform=$("#urlServer_gform").val();
        if (urlServer_gform.indexOf("http://")>-1||urlServer_gform.indexOf("https://")>-1){
            const_gformServiceUrl = urlServer_gform;
        }else{
            alert("Server端的gformServiceUrl輸入有誤");
            return false;
        }
        window.localStorage["sync_urlServer_gform"]=urlServer_gform;

        //檢查 serviceUrl
        var urlServer=$("#urlServer").val();
        if (urlServer.indexOf("ws://")>-1){
            if (!const_socketEnable){
                alert("尚無啟用webSocket接口！");
                return false;
            }
            const_socketUrl=urlServer;
            eNursing.createWebSocket(successCall,function(){
                alert("無法連上Server端的webSocket接口！");
            });
        }else if (urlServer.indexOf("http://")>-1||urlServer.indexOf("https://")>-1){
            if (!const_webserviceEnable){
                alert("尚無啟用webService接口！");
                return false;
            }
            eNursing.serviceUrl=urlServer;
            successCall();
        }else{
            alert("Server端的serviceUrl輸入有誤");
            return;
        }
        window.localStorage["sync_urlServer"]=urlServer;
    }else{
        alert("error!");
        return false;
    }
    return true;
}

//檢核ts格式
function checkTs(v){
    // 2019/6/29 下午 11:10:41
    var regex2 = /^([1-9]\d{3})\/(0[1-9]|1[0-2]|[1-9])\/(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])\s(上午|下午)\s(20|21|22|23|[0-1]\d):([0-5]\d):([0-5]\d)$/;
    $("#syncSetTs_Msg").html(regex2.test(v).toString());
    console.log(v.match(regex2));
    //1990/01/01 00:00:00
    var regex = /^[1-9]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\s(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
    var regex2 = /^([1-9]\d{3})\/(0[1-9]|1[0-2]|[1-9])\/(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])\s(上午|下午)\s(20|21|22|23|[0-1]\d):([0-5]\d):([0-5]\d)$/;
    if (regex.test(v)){
        $("#syncSetTs_Msg").html("");
        return true;
    }else if (regex2.test(v)){
        var arr = v.match(regex2);
        var i = 1;
        arr[++i] = (arr[i].length==1) ? "0"+arr[i] : arr[i];
        arr[++i] = (arr[i].length==1) ? "0"+arr[i] : arr[i];
        i = 5;
        arr[i] = (arr[i-1]=="上午" && arr[i]=="12") ? "00" : (arr[i-1]=="下午" && arr[i]=="12") ? "12" : (arr[i-1]=="上午") ? (12+(parseInt(arr[i]))).toString() : arr[i];
        $("#syncSetTs").val(arr[1]+"/"+arr[2]+"/"+arr[3]+" "+arr[5]+":"+arr[6]+":"+arr[7]);
        $("#syncSetTs_Msg").html("");
        return true;
    }else{
        $("#syncSetTs_Msg").html("格式錯誤 (ex: 1990/01/01 00:00:00<br/> ex2: 2019/6/1 上午 12:00:49)");
        return false;
    }
}
//彈出框顯示formType
function showFormType(mode) {
    var syncSetTs = $("#syncSetTs").val();
    if (!checkTs(syncSetTs || syncSetTs)){
        alert("ts格式設定錯誤 (ex: 1990/01/01 00:00:00)");
        return false;
    }
    setTargetUrl(mode, function(){
        var cxtJson = {urlMode: mode, list:[], prop:[]};
        var dform = nursing.createDynamicForm();
        basicParam.getFormVersionAllList(dform, formVersionAllCall, function(e) {console.error(e)});
        for (var i=0, len=propFormTypeArr.length; i<len; ++i){
            var gFormJS = nursing.createGForm();
            gFormJS.searchParamGF.formType=propFormTypeArr[i];
            gFormJS.searchParamGF.status="Y";
            gFormJS.searchParamGF.itemCondition="";
            gFormJS.getGFormListWithConditionPlus(gFormJS, propAllCall, function(e) {console.error(e)});
        }

        function formVersionAllCall(list) {
            // console.log(list);
            list = list.formVersion;
            //根據版本號(formType)排序
            function sortprice(a, b) {
                return (a.formType - b.formType) * (-1);
            }
            //利用js中的sort方法
            list.sort(sortprice);
            //顯示table
            cxtJson.list = list;
            showListTable(cxtJson);
        }

        function propAllCall(gFormList) {
            console.log(gFormList);
            if (!gFormList || gFormList.length===0) showListTable(cxtJson);
            //根據版本號(formType)排序
            function sortprice(a, b) {
                return (getJsonNodeValue(a.gForm, propNameNode[a.gForm.formType].name1) - getJsonNodeValue(b.gForm, propNameNode[b.gForm.formType].name1)) * (-1);
            }
            //利用js中的sort方法
            gFormList.sort(sortprice);
            //插入顯示用的節點
            for (var i=0, len=gFormList.length; i<len; ++i){
                var gForm = gFormList[i].gForm;
                gForm.showMessage={};
                gForm.showMessage.name1 = getJsonNodeValue(gForm, propNameNode[gForm.formType].name1);
                gForm.showMessage.name2 = getJsonNodeValue(gForm, propNameNode[gForm.formType].name2);
                gForm.showMessage.searchParamGF = {
                    "formType": gForm.formType,
                    "sourceId": gForm.sourceId,
                    "status": "Y",
                    "counts": 1,
                    "itemCondition": ""
                };
                //設定item查詢參數
                for (var i2=0, len2=propSearchItemName[gForm.formType].length; i2<len2; ++i2){
                    if (gForm.showMessage.searchParamGF.itemCondition!=="") {
                        gForm.showMessage.searchParamGF.itemCondition += " || ";
                    }
                    var itemName = propSearchItemName[gForm.formType][i2];
                    gForm.showMessage.searchParamGF.itemCondition += "{"+itemName+"}='"+gForm.gformItemMap[itemName].itemValue+"'";
                }
                //設定勾選用參數
                gForm.showMessage.autoClickParam = JSON.stringify(gForm.showMessage.searchParamGF);
                //設定ts
                var ts;
                if (gForm.modifyTime) {
                    ts = gForm.modifyTime.split('.');
                } else if (gForm.createTime) {
                    ts = gForm.createTime.split('.');
                }
                gForm.showMessage.searchParamGF.beginModifyTime = ts[0] + '.999';
                gForm.showMessage.searchParamGF.endModifyTime = '9999/12/31 23:59:59.99';
                gForm.showMessage.searchParamGF = JSON.stringify(gForm.showMessage.searchParamGF);
            }
            //顯示table
            cxtJson.prop = cxtJson.prop.concat(gFormList);
            showListTable(cxtJson);
        }

        //顯示table
        var showListTable_count = 1 + propFormTypeArr.length;
        function showListTable(cxtJson){
            //全部調用完成才執行
            if (--showListTable_count>0) return;

            var cxt = template.compile($("#list_formType_Template").html());
            var html = cxt(cxtJson);
            $("#showAddUpdModelDiv").show();
            $("#showAddUpdModel").show();
            $("#showAddUpdModel").html(html);

            //自動勾選-formType
            var chkedFormType = window.localStorage["chkedFormType"];
            if (chkedFormType != undefined) {
                chkedFormType = "," + chkedFormType + ",";
                $("#dynamicFormTable>tbody").find(".w3-check").each(function(i) {
                    if (chkedFormType.indexOf("," + this.value + ",") > -1) {
                        $(this).prop('checked', true);
                        $(this).parent().parent().addClass('active');
                    }
                });
                checkisAll(document.getElementById('clickAll'));
            }

            //自動勾選-prop
            var chkedProp = window.localStorage["chkedProp"];
            if (chkedProp != undefined && chkedProp != "") {
                chkedProp = JSON.parse(chkedProp);
                $("#propTable>tbody").find(".w3-check").each(function(i) {
                    if (chkedProp.indexOf($(this).attr("data-auto-click-param")) > -1) {
                        $(this).prop('checked', true);
                        $(this).parent().parent().addClass('active');
                    }
                });
                checkisAll(document.getElementById('clickAllProp'));
            }
        }
    });
}
//尋找formtype
function search(that) {
    var v = that.value.toLowerCase();
    if (v == "") {
        $("#dynamicFormTable>tbody>tr, #propTable>tbody>tr").show();
    } else {
        $("#dynamicFormTable>tbody>tr").each(function(i) {
            if (getDataset(this).formtype.toLowerCase().indexOf(v) > -1 || getDataset(this).title.toLowerCase().indexOf(v) > -1)
                $(this).show();
            else
                $(this).hide();
        });
        $("#propTable>tbody>tr").each(function(i) {
            if (getDataset(this).formtype.toLowerCase().indexOf(v) > -1 || getDataset(this).name1.toLowerCase().indexOf(v) > -1)
                $(this).show();
            else
                $(this).hide();
        });
    }
    checkisAll();
}
//全選/取消全選-formType
function clickAllFormType(that) {
    if (that.checked) {
        $("#dynamicFormTable>tbody").find(".w3-check").each(function() {
            if (!$(this).is(':hidden')) {
                if (!this.checked) {
                    $(this).prop('checked', 'true');
                    $(this).parent().parent().toggleClass('active');
                }
            }
        });
    } else {
        $("#dynamicFormTable>tbody").find(".w3-check").each(function() {
            if (!$(this).is(':hidden')) {
                if (this.checked){
                    $(this).attr('checked', false);
                    $(this).parent().parent().toggleClass('active');
                }
            }
        });
    }
    checkisAll(that);
}
//全選/取消全選-prop
function clickAllProp(that) {
    if (that.checked) {
        $("#propTable>tbody").find(".w3-check").each(function() {
            if (!$(this).is(':hidden')) {
                if (!this.checked) {
                    $(this).prop('checked', 'true');
                    $(this).parent().parent().toggleClass('active');
                }
            }
        });
    } else {
        $("#propTable>tbody").find(".w3-check").each(function() {
            if (!$(this).is(':hidden')) {
                if (this.checked){
                    $(this).attr('checked', false);
                    $(this).parent().parent().toggleClass('active');
                }
            }
        });
    }
    checkisAll(that);
}
//勾選checkbox
function checkThis(that) {
    var tag = that.tagName;
    if (tag != 'INPUT') {
        if ($(that).parent().find(":checkbox").is(':checked')) {
            $(that).parent().find(":checkbox").attr('checked', false);
        } else {
            $(that).parent().find(":checkbox").prop('checked', 'true');
        }
        $(that).parent().toggleClass('active');
    } else {
        $(that).parent().parent().toggleClass('active');
    }
    checkisAll(that);
}

function checkisAll(that) {
    var tmpCount = 0;
    var tepClick = 0;
    var totalClick = 0;
    $(that).parents(".dynamicFormTable:first").find("tbody .w3-check").each(function(i) {
        if (!$(this).is(':hidden')) {
            tmpCount++;
            if (this.checked) {
                tepClick++;
            }
        }
        if (this.checked) {
            totalClick++;
        }
    });
    if (tepClick === tmpCount) {
        $(that).parents(".dynamicFormTable:first").find('#clickAll, #clickAllProp').prop('checked', 'true');
    } else {
        $(that).parents(".dynamicFormTable:first").find('#clickAll, #clickAllProp').attr('checked', false);
    }

    $('#totalCheck').html('顯示內的勾選 <strong style="color:yellow">' + tepClick + '</strong> 項，總共勾選 <strong style="color:yellow">' + totalClick + '</strong> 項');
}
/**
 * 关闭弹出框的功能
 */
function closeModel() {
    $("#showAddUpdModel").hide();
    $("#showAddUpdModelDiv").hide();
}
//取得同步參數
function getSyncParam(mode) {
    var syncParam = {"formType": "", "prop": ""};
    var getSyncParamCounts = 0;
    var chkedFormType = "";
    var chkedProp = [];
    var $chked_formType = $("#dynamicFormTable>tbody").find(".w3-check:checked");
    var $chked_prop = $("#propTable>tbody").find(".w3-check:checked");
    if ($chked_formType.length == 0 && $chked_prop.length == 0) {
        alert("請至少勾選一項");
        return;
    }
    delete window.localStorage["chkedFormType"];
    delete window.localStorage["chkedProp"];

    //取得同步參數-formType
    if ($chked_formType.length > 0) {
        ++getSyncParamCounts;
        //儲存勾選狀態
        $chked_formType.each(function() {
            chkedFormType += "," + this.value;
        });
        window.localStorage["chkedFormType"] = chkedFormType.substring(1);

        //查詢
        var dform = eNursing.extend({}, nursing.getDynamicForm());
        dform.searchParamDF.formType = chkedFormType;
        basicParam.getFormVersionListMaxTsByFormType(dform, function(result) {
            if (result.resultMsg.success) {
                if (mode=="Server"){
                    var syncSetTs = $("#syncSetTs").val();
                    for (var i=0, len=result.data[0].basicParam.formVersionList.formVersion.length; i<len; i++){
                        result.data[0].basicParam.formVersionList.formVersion[i].ts = syncSetTs
                    }
                }
                //拿掉version
                for (var i=0, len=result.data[0].basicParam.formVersionList.formVersion.length; i<len; i++){
                    delete result.data[0].basicParam.formVersionList.formVersion[i].version;
                }
                syncParam.formType = result.data[0].basicParam.formVersionList.formVersion;
            } else {
                syncParam.formType = result.resultMsg.message;
            }
            getSyncParamSuccess(syncParam);
        }, function() {});
    }

    //取得同步參數-prop
    if ($chked_prop.length > 0) {
        ++getSyncParamCounts;
        var syncParamProp = [];
        var syncSetTs = $("#syncSetTs").val();
        $chked_prop.each(function() {
            //取得勾選狀態
            chkedProp.push(JSON.stringify($(this).data("autoClickParam")));

            //取得設定參數
            var param = JSON.parse(this.value);
            if (mode=="Server"){
                param.beginModifyTime = syncSetTs;
            }
            syncParamProp.push(param);
        });
        //儲存勾選狀態
        window.localStorage["chkedProp"] = JSON.stringify(chkedProp);

        //設定參數
        syncParam.prop = syncParamProp;
        getSyncParamSuccess(syncParam);
    }

    //顯示同步參數
    function getSyncParamSuccess(syncParam){
        if (--getSyncParamCounts>0) return;
        $("#getTareaSyncParam"+mode).val(JSON.stringify(syncParam, undefined, 4));
        closeModel();
    }
}

//取得同步資料
var getSyncData_Count,getSyncData_EmptyCount,syncDataResults;
function getSyncData() {
    $('#downloadDataHref').hide();
    $("#differenceItem_formVersion").html("");
    $("#differenceItem_formFrame").html("");
    getSyncData_EmptyCount=0;
    getSyncData_Count=0;
    syncDataResults={versionList:[], frameList:[], propList:[]};
    setTargetUrl("Server", function(){
        // var syncParam = '[{ "formType": "aaa", "version": 0, "ts": "2019/06/01 00:00:00" }]';
        // var syncParam = [{ "formType": "aaa", "version": 0, "ts": "2019/06/01 00:00:00" }, { "formType": "adminssionChildForm", "version": 0, "ts": "2019/06/01 00:00:00" }];
        var syncParam = $("#tareaSyncParam_Server").val();
        if (syncParam=="") {
            alert("請貼上同步參數");
            return;
        } else if (syncParam.formType === "" && syncParam.prop === "") {
            alert("同步參數輸入有誤");
            return;
        } else {
            try {
                syncParam = JSON.parse(syncParam);
                syncParam.formType = {
                    "isLastFormVersion": false,
                    "isLastFormFrame": false,
                    "syncParam": syncParam.formType
                };
            } catch (e) {
                alert("同步參數格式有誤");
                return;
            }
        }

        var gate1           = syncParam.formType.syncParam!=="";     // 只取 formVersion
        var gate2           = syncParam.formType.syncParam!=="";     // 只取 formFrame
        var gate3           = syncParam.prop!=="";     // 只取 prop設定檔
        var callbackCount   = (gate1 ? 2 : 0) + syncParam.prop.length;
        var emptybackCount  = (gate1 ? 2 : 0) + syncParam.prop.length;

        if (optionalObject.open) {
            if (!optionalObject.formversion) {
                if(gate1){
                    callbackCount--;
                    emptybackCount--;
                }
                gate1 = false;
            }
            if (!optionalObject.formframe) {
                if(gate2){
                    callbackCount--;
                    emptybackCount--;
                }
                gate2 = false;
            }
            if (!optionalObject.prop) {
                if(gate3){
                    //每一個prop都要調用一次gForm API
                    callbackCount -= syncParam.prop.length;
                    emptybackCount -= syncParam.prop.length;
                }
                gate3 = false;
            }
            if (optionalObject.lastone) { // 只取最後一筆
                syncParam.formType.isLastFormVersion = true;
                syncParam.formType.isLastFormFrame = true;
            }
        }

        //取formversion
        if (gate1) {
            basicParam.getFormVersionListByFormTypeTs(syncParam.formType, function(result) {
                if (window.console) console.log(result);
                if (result.resultMsg.message == "暫無新版資料") {
                    getSyncDataSuccess(result.resultMsg.message);
                } else {
                    var $diff=$("#differenceItem_formVersion");
                    $diff.empty();
                    // $diff.append("====formVersion====<br/>");
                    var version = result.data[0].basicParam.formVersionList.formVersion;
                    if (window.console) console.log(version);
                    for (var i = 0, len = version.length; i < len; i++) {
                        var stringify = JSON.stringify(version[i].content);
                        stringify = stringify.substring(1,stringify.length-1);
                        version[i].content = stringify;

                        //顯示差異項目
                        var tr = $("<tr/>");
                        tr.append("<td>"+version[i].formType+"</td>");
                        tr.append("<td>"+version[i].version+"</td>");
                        tr.append("<td>"+new Date(version[i].ts).format("yyyy/MM/dd HH:mm")+"</td>");
                        $diff.append(tr);
                    }
                    getSyncDataSuccess(version, "version");
                }
            }, function(e) {console.error(e)});
        }

        //取formFrame
        if (gate2) {
            basicParam.getDynamicFormFrameListByformTypeTs(syncParam.formType, function(result) {
                if (window.console) console.log(result);
                if (result.resultMsg.message == "暫無新版資料") {
                    getSyncDataSuccess(result.resultMsg.message);
                } else {
                    var $diff=$("#differenceItem_formFrame");
                    $diff.empty();
                    // $diff.append("====formFrame====<br/>");
                    var frame = result.data[0].basicParam.formFormFrameList.dynamicFormFrame;
                    if (window.console) console.log(frame);
                    for (var i = 0, len = frame.length; i < len; i++) {
                        var stringify = JSON.stringify(frame[i].content);
                        stringify = stringify.substring(1,stringify.length-1);
                        frame[i].content = stringify;
                        var note = JSON.stringify(frame[i].note);
                        note = (note) ? note.substring(1,note.length-1) : "";
                        frame[i].note = note;

                        //顯示差異項目
                        var tr = $("<tr/>");
                        tr.append("<td>"+frame[i].formType+"</td>");
                        tr.append("<td>"+frame[i].frameModel+"</td>");
                        tr.append("<td>"+frame[i].version+"</td>");
                        tr.append("<td>"+new Date(frame[i].ts).format("yyyy/MM/dd HH:mm")+"</td>");
                        $diff.append(tr);
                    }
                    getSyncDataSuccess(frame, "frame");
                }
            }, function(e) {console.error(e)});
        }

        //取prop
        if (gate3) {
            var $diff=$("#differenceItem_prop");
            $diff.empty();
            for (var i=0, len=syncParam.prop.length; i<len; ++i){
                var gFormJS = nursing.createGForm();
                gFormJS.searchParamGF = $.extend(gFormJS.searchParamGF, syncParam.prop[i]);
                gFormJS.getGFormListWithConditionPlus(gFormJS, function(result){
                    if (window.console) console.log(result);
                    if (result.length===0) { //暫無新版資料
                        getSyncDataSuccess("暫無新版資料");
                    } else {
                        var $diff=$("#differenceItem_prop");
                        var gForm = result[0].gForm;
                        if (window.console) console.log(gForm);

                        //顯示差異項目
                        var tr = $("<tr/>");
                        tr.append("<td>"+gForm.formType+"</td>");
                        tr.append("<td>"+gForm.sourceId+"</td>");
                        tr.append("<td>"+getJsonNodeValue(gForm, propNameNode[gForm.formType].name1)+"</td>");
                        tr.append("<td>"+getJsonNodeValue(gForm, propNameNode[gForm.formType].name2)+"</td>");
                        tr.append("<td>"+new Date(result[0].title.ts).format("yyyy/MM/dd HH:mm")+"</td>");
                        $diff.append(tr);
                        getSyncDataSuccess(gForm, "prop");
                    }
                }, function(e) {console.error(e)});
            }
        }

        function getSyncDataSuccess(result, dataMode){
            if (result == "暫無新版資料") {
                ++getSyncData_EmptyCount;
            }else{
                if (dataMode=="version") {
                    syncDataResults.versionList = result;
                }else if (dataMode=="frame") {
                    //替換引用js、css的版號 -> ?csVersionTS= -> ?csVersionTS={frame.ts}
                    for (var i=0, len=result.length; i<len; ++i) {
                        //ts = 2022/03/02 09:56:27.997 -> 20220302095627997
                        result[i].content = result[i].content.replace(/\?csVersionTS=(\d)*/g, "?csVersionTS="+result[i].ts.replace(/[\/ :.]/g, ''));
                    }

                    syncDataResults.frameList = result;
                }else if (dataMode=="prop") {
                    for(var i=result.gformItems.length-1; i>=0; --i){
                        if (result.gformItems[i].itemValue === undefined) {
                            result.gformItems.splice(i,1);
                        }
                    }
                    syncDataResults.propList.push(JSON.stringify(result));
                }
            }
            if (++getSyncData_Count >= callbackCount){
                if (getSyncData_EmptyCount >= emptybackCount) {
                    alert("暫無新版資料");
                }
                var cxt = template.compile($("#template_SyncData").html());
                var html = cxt(syncDataResults);
                // if (window.console) console.log(html);

                //輸出到textarea
                if ($("#chkPasteToTextarea")[0].checked){
                    $("#tareaSyncData_Server").val(html);
                }else{
                    //輸出成檔案下載
                    var MIME_TYPE = 'text/html';
                    var blob = new Blob([html], {
                        type: MIME_TYPE
                    });
                    var blobUrl = window.URL.createObjectURL(blob);
                    var fileName = "syncData.js";

                    var $downloadDataHref = $('#downloadDataHref');
                    $downloadDataHref.show();
                    $downloadDataHref.attr({
                        href: blobUrl,
                        download: fileName
                    });
                }
            }
        }
    });
}

var optionalObject = {
    "open": false,
    "lastone": false,
    "formversion": false,
    "formframe": false,
    "prop": false
};

function optionChange(that) {
    var chk = $(that).prop('checked');
    var type = $(that).val();
    switch(type) {
        case "1":
            optionalObject.lastone = chk;
            break;
        case "2":
            optionalObject.formversion = chk;
            break;
        case "3":
            optionalObject.formframe = chk;
            break;
        case "4":
            optionalObject.prop = chk;
            break;
    }

    if (optionalObject.lastone || optionalObject.formframe || optionalObject.formversion || optionalObject.prop)
        optionalObject.open = true;
    else
        optionalObject.open = false;
}