
//導入資料工具包
var gForm_Title=null; //app--title离线缓存使用
try{
    if (FileReader && FileReader.prototype.readAsBinaryString === undefined) {
        FileReader.prototype.readAsBinaryString = function (fileData) { //解决ie11 大文件堆栈溢出的问题（for arrayBufferToString）
            var binary = "";
            var pt = this;
            var reader = new FileReader();
            reader.onload = function (e) {
                var bytes = new Uint8Array(reader.result);
                var length = bytes.byteLength;
                for (var i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                pt.content = binary;
                pt.target={};
                pt.target.result = binary;
                //console.log("binary length:" + binary.length);
                pt.onload(pt); //页面内data取pt.content文件内容
            };
            reader.readAsArrayBuffer(fileData);
        };
    }
}catch(e){}

//資料導入工具
var impTool={};
// 读取本地excel文件
impTool.readWorkbookFromLocalFile = function(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});
        workbook.fileName=file.files[0].name;
        console.log(workbook);
        if(callback) callback(workbook);
    };
    reader.readAsBinaryString(file.files[0]);
};
//返回行列的參數
impTool.readRowColParam = function(ref){
    ref = ref.split(":"); //ex. A1:C3
    return {"l" : ref[0].match(/[A-Z]+/g).toString(), //left 第一行col名 A
        "r" : ref[1].match(/[A-Z]+/g).toString(), //right 最後一行col名 C
        "t" : parseInt(ref[0].match(/[\d]+/g)), //top 第一列row數 1
        "b" : parseInt(ref[1].match(/[\d]+/g)) //bottom 最後一列row數 3
    };
};
//解析col名
impTool.readColIndexs = function(workbook, extFmt){
    var sheet = workbook.Sheets[extFmt.sheetName];
    var rc = impTool.readRowColParam(sheet["!ref"]); //返回行列的參數
    var rowN = extFmt.colNameRowNum;
    var arr = impTool.rowNameArr;
    var l = arr.indexOf(rc.l), r= arr.indexOf(rc.r);
    var colIdxs = [];
    for (var i=l; i<=r; ++i){
        var rs = sheet[arr[i]+rowN];
        if (rs){
            colIdxs.push({"idx" : i, "idxName" : arr[i], "name" : rs.w});
        }
    }
    return colIdxs;
};

//顯示被剔除的資料
impTool.showRejectRows = function ($ele, data, workbook, continueUpload){
    var btn;
    if (languageMode=="Traditional Chinese") {
        $ele.html("<h3>#檢查到不符格式的資料<br/>");
        $ele.append("目前有<font color='#6B58F8'>"+data.newGforms.length+"</font>筆在等待區，是否忽略並繼續導入？</h3>");
        btn = $("<input type='button' value='是，繼續導入'/>");
    } else if (languageMode=="Simplified Chinese") {
        $ele.html("<h3>#检查到不符格式的数据<br/>");
        $ele.append("目前有<font color='#6B58F8'>"+data.newGforms.length+"</font>笔在等待区，是否忽略并继续导入？</h3>");
        btn = $("<input type='button' value='是，继续导入'/>");
    }
    btn.click(function(){continueUpload($ele, data.newGforms, data.newGforms.length-1);});
    $ele.append(btn);
    if (languageMode=="Traditional Chinese") {
        $ele.append("<h3>不符格式，已遭剔除的資料(<font color='#FD3939'>"+data.rejectItem.length+"</font>)</h3><br/>");
    } else if (languageMode=="Simplified Chinese") {
        $ele.append("<h3>不符格式，已遭剔除的数据(<font color='#FD3939'>"+data.rejectItem.length+"</font>)</h3><br/>");
    }
    impTool.showRows($ele, data.rejectItem, workbook);
};

//顯示導入失敗的資料
impTool.showImpErrorRows = function ($ele, rows, workbook){
    if (languageMode=="Traditional Chinese") {
        $ele.html("<h3>#導入失敗的資料(<font color='#FD3939'>"+rows.length+"</font>)<br/>");
    } else if (languageMode=="Simplified Chinese") {
        $ele.html("<h3>#导入失败的数据(<font color='#FD3939'>"+rows.length+"</font>)<br/>");
    }
    impTool.showRows($ele, rows, workbook);
};
//顯示資料
impTool.showRows = function ($ele, rows, workbook){
    var table = $("<table class='imp-rejectTable'></table>");
    var extFmt = impTool.tpl.extFormat(workbook);
    var sheet = workbook.Sheets[extFmt.sheetName];
    var rc = impTool.readRowColParam(sheet["!ref"]); //返回行列的參數
    var rowN = extFmt.startRowNum;
    var arr = impTool.rowNameArr;
    var l = arr.indexOf(rc.l), r= arr.indexOf(rc.r);
    //建立表頭
    var thead = $("<thead class='imp-thead'></thead>");
    var tr = $("<tr></tr>");
    tr.append("<th>剔除原因</th>");
    tr.append("<th>行號</th>");
    for (var i=l; i<r; ++i){
        tr.append("<th>"+arr[i]+"</th>");
    }
    thead.append(tr);
    for (var i=1; i<rowN; ++i){
        tr = $("<tr></tr>");
        tr.append("<th></th>");
        tr.append("<th>"+i+"</th>");
        for (var i2=l; i2<r; ++i2){
            var w = (sheet[arr[i2]+i]) ? sheet[arr[i2]+i].w : "";
            tr.append("<th>"+w+"</th>");
        }
        thead.append(tr);
    }
    table.append(thead);
    //建立表身
    var rjItems = rows;
    var tbody = $("<tbody class='imp-tbody'></tbody>");
    for (var i=0, len=rjItems.length; i<len; ++i){
        var impRowNum = rjItems[i].impRowNum;
        tr = $("<tr></tr>");
        tr.append("<td class='imp-tbody-reason'>"+rjItems[i].rejectReason+"</td>");
        tr.append("<td>"+impRowNum+"</td>");
        for (var i2=l; i2<=r; ++i2){
            var w = (sheet[arr[i2]+impRowNum]) ? sheet[arr[i2]+impRowNum].w : "";
            tr.append("<td>"+w+"</td>");
        }
        tbody.append(tr);
    }
    table.append(tbody);
    $ele.append(table);
};
//row名的陣列
impTool.rowNameArr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC","BD","BE","BF","BG","BH","BI","BJ","BK","BL","BM","BN","BO","BP","BQ","BR","BS","BT","BU","BV","BW","BX","BY","BZ"];
//填充gForm
impTool.fillGForm = function(workbook, extFmt, colIdxs, successCall){
    //取得最大版號的template和versionNo
    dynamicForm.searchParamDF.formType = extFmt.formType;
    basicParam.getCurrDynamicFormTemplateV3(dynamicForm, function(result){
        var dftpl = result[0].basicParam.dynamicFormTemplate;
        var gForms = [], info = {};
        //基本資訊
        info.status = "Y";
        info.formVersionId = dftpl.formVersionId;
        info.versionNo = dftpl.newVersionNo;
        info.creatorId=userId;
        info.creatorName=userName;
        info.formType=extFmt.formType;
        info.searchParamGF={};
        info.searchParamGF.sourceId=sourceId;
        info.searchParamGF.userId=userId;
        info.searchParamGF.userName=userName;
        //開始解析
        var sheet = workbook.Sheets[extFmt.sheetName];
        var rc = impTool.readRowColParam(sheet["!ref"]); //返回行列的參數
        var rowN = extFmt.startRowNum;
        var arr = impTool.rowNameArr;
        var l = arr.indexOf(rc.l), r= arr.indexOf(rc.r);
        //formId
        var hasFormId = (sheet.A1 && sheet.A1.w=="sourceId") && (sheet.B1 && sheet.B1.w=="formId");
        // rc.b=10;
        for (var i=rowN; i<=rc.b; ++i){ //資料開始列~最後一列
            var gForm = $.extend(true, {}, info);
            //遍歷所有col名
            var items = [];
            for (var i2=0, len2=colIdxs.length; i2<len2; ++i2){
                var colIdx = colIdxs[i2];
                var rs = sheet[colIdx.idxName+i];
                if (rs){
                    items.push({
                        "itemKey": colIdx.name,
                        "itemValue": rs.w
                    });
                }
            }
            if (hasFormId && sheet["B"+i]) gForm.formId=sheet["B"+i].w;
            gForm.gformItems = items;
            gForm.impRowNum = i;
            gForms.push(gForm);
            var percent = Math.floor((i / rc.b) * 10);
	    	$('.progress-bar').attr('aria-valuenow', percent + 30).css('width', percent + 30 + '%').text(percent + 30 + '%');
        }
        // gFormJS.gformItems = items;
        if (successCall) successCall(gForms, dftpl);
    }, function() {});
};
//為sheet頁籤填上識別項 sourceId, formId
impTool.fillSheetGformKeys = function(sheet, extFmt, newGform){
    console.log("=========sheet");
    console.log(sheet);
    console.log(extFmt);
    newGform.sortJson({key:'impRowNum',orderby:'asc'});
    console.log(newGform);
    var rc = impTool.readRowColParam(sheet["!ref"]); //返回行列的參數
    var rowN = extFmt.startRowNum;
    var arr = impTool.rowNameArr;
    var l = arr.indexOf(rc.l), r= arr.indexOf(rc.r);
    var newGform_count=0;
    //如果A1和B1不是sourceId和formId
    if ((sheet["A1"] && sheet["A1"].w!="sourceId") || (sheet["B1"] && sheet["B1"].w!="formId")){
        //將所有欄位向右挪兩行
        for (var i=1; i<=rc.b; ++i){ //資料第1列~最後一列
            for (var i2=r; i2>=l; --i2){
                sheet[arr[i2+2]+i] = sheet[arr[i2]+i];
                delete sheet[arr[i2]+i];
            }
        }
        sheet["A1"]={"t":"s", "v":"sourceId"};
        sheet["B1"]={"t":"s", "v":"formId"};
        sheet["!ref"] = "A1:"+arr[r+2]+rc.b;
    }
    //在A(n)和B(n)分別加上 sourceId 和 formId
    for (var i=1; i<=rc.b; ++i){ //資料第1列~最後一列
        if (newGform[newGform_count] && i==newGform[newGform_count].impRowNum){
            sheet["A"+i]={"t":"s", "v":newGform[newGform_count].sourceId};
            sheet["B"+i]={"t":"s", "v":newGform[newGform_count].formId};
            ++newGform_count;
        }
    }
    return sheet;
};

// 将一个workbook转成最终的excel文件的base64編碼
impTool.sheet2blob = function (workbook) {
    // 生成excel的配置项
    var name = workbook.fileName.split(".");
    var wopts = {
        bookType: name[name.length-1], // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    // var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    // ArrayBuffer转base64
    function transformArrayBufferToBase64 (buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        for (var len = bytes.byteLength, i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    return transformArrayBufferToBase64(s2ab(wbout));
};

//導入formItemTemplate工具包
impTool.tpl={};
impTool.tpl.importData_formVersionOK=function(){};
impTool.tpl.importData_frameLIST=function(){};
impTool.tpl.importData_frameUPD=function(){};
impTool.tpl.importData_frameADD=function(){};
var windowOpener=null, addOrUpdateGFormError_counts=0;
impTool.tpl.importData = function(that){
    this.workbook=null;
    this.extFmt=null;
    this.errGforms=[];
    $('.progress').addClass('in active');
    $('.progress-bar').attr('aria-valuenow', 0).css('width', '0%').text('0%');
    $("#importStatus").html("開始導入...");

    $("#impTool_tpl_msg").empty(); //清空

    //查詢該sourceId和formType下的所有數據
    gFormJS.searchParamGF.sourceId = sourceId;
    gFormJS.searchParamGF.formType = formType;
    gFormJS.searchParamGF.hasContent = true;
    
    var isPass = $('#onlyPrint').prop('checked');
    if (isPass) {
        var formTypes=$("#impFormType").html().split(',');
        for (var i = 0; i < formTypes.length; i++){
            var dynamicForm = nursing.createDynamicForm();
            dynamicForm.searchParamDF.formType = formTypes[i];
            basicParam.getCurrDynamicFormTemplateV3(dynamicForm, function (result) {
                var dynamicTemplates = impTool.tpl.processDFData(result[0].basicParam.dynamicFormTemplate);
                factoryFrameInit(dynamicTemplates);
            }, function () {
            });
        }
        return;
    }
    gFormJS.getGFormList(gFormJS, deleteGFormList, function() {});

    //刪除動態表單
    var call2 = false, delCount=0, delLength=-1;
    function deleteGFormList (result) {
        if (call2) return; else call2=true;
        $('.progress-bar').addClass('progress-bar-striped active');
        $("#importStatus").html("正在刪除舊資料...");
        delCount=0;
        delLength=result.length;
        if (delLength===0){
            deleteGFormListComplete();
        }
        for (var i=0; i<delLength; ++i){
            var delGForm = $.extend(true, {}, result[i].gForm);
            gFormJS.leftJoin(delGForm);
            gFormJS.searchParamGF.sourceId=formType;

            var param = {
                /**不同数据*/
                node: "GForm."+gFormJS.formType+"."+gFormJS.formId,
                /**动作*/
                action: "delete"
            };

            eNursing.sendMsg("gFormService.deleteGForm", [{"gForm":gFormJS}], param, "", function (result) {
                if (result.resultMsg.success) {
                    deleteGFormListComplete();
                } else {
                    if (window.console) console.log(result.resultMsg);
                    $('.progress-bar').removeClass('progress-bar-striped active');
                }
            }, function() {
            	$('.progress-bar').removeClass('progress-bar-striped active');
                $("#importStatus").html("正在刪除舊資料... error");
                console.log("刪除失敗");
            });
        }
    }

    //刪除完成後，解析 "導入格式"
    function deleteGFormListComplete(){
    	if (delLength > 0){
    		var percent = Math.floor((delCount / delLength) * 20);
	    	$('.progress-bar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
    	}
        $("#importStatus").html("正在刪除舊資料... ("+delCount+"/"+delLength+")");
        if (++delCount>=delLength){
        	$('.progress-bar').attr('aria-valuenow', 20).css('width', '20%').text('20%');
            $("#importStatus").html("正在解析excel...");
            //解析 "導入格式"
            impTool.readWorkbookFromLocalFile(that, readWorkbookFromLocalFileSuccess);
        }
    }

    //解析 "導入格式" 完成
    function readWorkbookFromLocalFileSuccess(workbook){
        this.workbook = workbook;
        this.extFmt = impTool.tpl.extFormat(workbook);
        this.errGforms=[];
        $("#importStatus").html("正在解析excel...");

        console.log("=======導入格式");
        console.log(this.extFmt);
        if (this.extFmt===false) return;
        //解析col名
        var colIdxs = impTool.readColIndexs(this.workbook, this.extFmt);
        for (var i=0, len=colIdxs.length; i<len; ++i){ //轉換為 fit+首字大寫+name
            var w = colIdxs[i].name;
            colIdxs[i].name = "fit"+w.substring(0, 1).toUpperCase() + w.substring(1);
            var percent = Math.floor((i / len) * 10);
	    	$('.progress-bar').attr('aria-valuenow', percent + 20).css('width', percent + 20 + '%').text(percent + 20 + '%');
        }
        console.log("=====解析col名");
        console.log(colIdxs);
        //填充gForm
        impTool.fillGForm(this.workbook, this.extFmt, colIdxs, fillSuccess);
    }
    //填充完成
    function fillSuccess(gForms, dftpl){
        $("#importStatus").html("正在檢查不合格的資料...");
        console.log("=======填充完成");
        console.log(gForms);
        console.log(dftpl);
        //剔除/補足 不合格的資料
        var data = impTool.tpl.completeData(gForms,dftpl);
        console.log("=====剔除/補足 不合格的資料");
        console.log(data);
        //沒有被剃除的資料就直接上傳
        var $ele = $("#impTool_tpl_msg");
        if (data.rejectItem.length===0){
            $("#importStatus").html("正在匯入資料...");
            continueUpload($ele, data.newGforms, data.newGforms.length-1);
        }else{
            $("#importStatus").html("發現不合格的資料，請點擊繼續導入或修正後重新導入！");
            $('.progress-bar').removeClass('progress-bar-striped active');
            impTool.showRejectRows($ele, data, this.workbook, continueUpload);
        }
    }
    //忽略並繼續上傳
    function continueUpload($ele, newGforms, upl_idx){
        if (upl_idx>=0){
        	$('.progress-bar').addClass('progress-bar-striped active');
        	var percent = Math.floor(((newGforms.length-upl_idx) / newGforms.length) * 20);
	    	$('.progress-bar').attr('aria-valuenow', percent + 40).css('width', percent + 40 + '%').text(percent + 40 + '%');
            $("#importStatus").html("正在導入資料... ("+(newGforms.length-upl_idx)+"/"+newGforms.length+")");
            gFormJS.addOrUpdateGForm(newGforms[upl_idx],
                function (rsGForms) {
                    newGforms[upl_idx].sourceId=rsGForms[0].gForm.sourceId;
                    newGforms[upl_idx].formId=rsGForms[0].gForm.formId;
                    continueUpload($ele, newGforms, --upl_idx);
                },
                function () {
                    console.log("===error!!!");
                    this.errGforms.push(newGforms[upl_idx]);
                    newGforms.splice(upl_idx,1);
                    if (languageMode=="Traditional Chinese") {
                        this.errGforms[this.errGforms.length-1].rejectReason="導入失敗";
                    } else if (languageMode=="Simplified Chinese") {
                        this.errGforms[this.errGforms.length-1].rejectReason="导入失败";
                    }
                    continueUpload($ele, newGforms, --upl_idx);
                }
            );
        }else{
            if (this.errGforms.length===0){
                if (languageMode=="Traditional Chinese") {
                    $("#importStatus").html("元件導入完成! ("+newGforms.length+"/"+newGforms.length+")");
                    // alert("導入完成!");
                } else if (languageMode=="Simplified Chinese") {
                    $("#importStatus").html("元件导入完成! ("+newGforms.length+"/"+newGforms.length+")");
                    // alert("导入完成!");
                }
                $('.progress-bar').attr('aria-valuenow', 60).css('width', '60%').text('60%');
                uploadSuccess(newGforms);
            }else{
                if (languageMode=="Traditional Chinese") {
                    $("#importStatus").html("元件導入完成，但有部分內容導入失敗!");
                    alert("元件導入完成，但有部分內容導入失敗!");
                } else if (languageMode=="Simplified Chinese") {
                    $("#importStatus").html("元件导入完成，但有部分内容导入失败!");
                    alert("元件导入完成，但有部分内容导入失败!");
                }
                //顯示失敗內容
                impTool.showImpErrorRows($ele, errGforms, this.workbook);
            }
            console.log(newGforms);
            //為sheet頁籤填上識別項 sourceId, formId
            this.workbook.Sheets[this.extFmt.sheetName] = impTool.fillSheetGformKeys(this.workbook.Sheets[this.extFmt.sheetName], this.extFmt, newGforms);
            console.log(this.workbook.Sheets[this.extFmt.sheetName]);
            //将一个workbook转成最终的excel文件的base64編碼
            base64File = impTool.sheet2blob(this.workbook);
            //更新並儲存上傳檔案
            var fileStore = nursing.getFileStore();
            var fileInfo = {
                fileName: "("+new Date().format("yyyy-MM-dd")+") "+this.workbook.fileName,
                content: base64File,
                states: "Y",
                sysModel: "impTpl",
                storeType: "1"
            };
            fileStore.uploadFile(fileInfo, function(file){
                console.log("=========file");
                console.log(file);
                var beanName = "impFileEle";
                var fileInfos = $("#"+beanName).val();
                if (fileInfos==""){
                    fileInfos = [];
                }else{
                    fileInfos = JSON.parse(fileInfos);
                }
                var fileStore = file[0].fileStore;
                var info = {
                    fileName: fileStore.fileName,
                    fileStoreSetId: fileStore.fileStoreSetId,
                    id: fileStore.id,
                    states: fileStore.states
                };
                fileInfos.push(info);
                $("#"+beanName).val(JSON.stringify(fileInfos));
                fileTool.fileDefaultMultiple_show(beanName);
            }, function(){});
        }
    }
    //導入完成
    function uploadSuccess(newGforms){
        console.log("=====newGforms");
        console.log(newGforms);
        //產生formVersion(XML)→產生frame(LIST)→產生frame(UPD)→產生frame(ADD)→完成

        //產生formVersion(XML)
        $("#importStatus").html("開始產生formVersion(XML)...");
        
        gFormJS.searchParamGF.formType = "formTemplate";
        gFormJS.searchParamGF.formId = sourceId;
        gFormJS.searchParamGF.hasContent = true;
        gFormJS.getSingleGForm(gFormJS, function (result){
            console.log("==========result");
            console.log(result);
            var lastGform = result[0].gForm;
            var ftItems="";
            for (var i=0, len=newGforms.length; i<len; ++i){
                ftItems+=","+gFormJS.setGFormItemMap(newGforms[i]).gformItemMap.fitName.itemValue;
            }
            if (ftItems.length>0){
                ftItems=ftItems.substring(1);
            }
            console.log("=====ftItems");
            console.log(ftItems);
            lastGform.gformItemMap=gFormJS.setGFormItemMap(lastGform).gformItemMap;
            lastGform.gformItemMap.ftItems={};
            lastGform.gformItemMap.ftItems.itemKey="ftItems";
            lastGform.gformItemMap.ftItems.itemValue=ftItems;
            lastGform.gformItems=gFormJS.setGFormItems(lastGform).gformItems;
            lastGform.searchParamGF={};
            lastGform.searchParamGF.sourceId=sourceId;
            lastGform.searchParamGF.userId=userId;
            lastGform.searchParamGF.userName=userName;
            lastGform.modifyUserId=userId;
            lastGform.modifyUserName=userName;
            console.log("========lastGform");
            console.log(lastGform);
            gFormJS.addOrUpdateGForm(lastGform,
                function (rsGForms) {
                    //打開產生formVersion的頁面，等待產生完畢後，該頁面會觸發 childclose();
                    windowOpener = window.open(location.href.split("iq-nurs")[0]+"/m2/complexForm/publishFormTemplate?formType="+"formTemplate"+"&formId="+sourceId+"&isImport="+"true"+"");
                },
                function () {
                }
            );
        }, function() {});

        //產生formVersion(XML)... OK
        impTool.tpl.importData_formVersionOK=function(formVersion){
            windowOpener.close();
	    	$('.progress-bar').attr('aria-valuenow', 65).css('width', '65%').text('65%');
            $("#importStatus").html("產生formVersion(XML)... OK");
            console.log("產生formVersion(XML) success!");
            console.log(formVersion);
            //傳送 formVersion 去後台解析並取得 dynamicFormTemplate 物件
            impTool.tpl.getDynamicFormTemplate(formVersion, function(dFTemplate){
                dFTemplate = impTool.tpl.processDFData(dFTemplate); //formVersion 物件前處理
                factoryFrameInit(dFTemplate);
            },function(){
                $("#importStatus").html("產生formVersion(XML)... error!");
            });
        };
    }
    // Frame工廠(處理全部 Frame 與 Init)
    function factoryFrameInit(template) {
    	console.log(template);
        var factoryCallback = 0;
        var n               = 0;
        var bl = bActivity.length;
        if (bl < 7) {
        	for (var i = 7; i > bl; i--) {
        		bActivity = '0' + bActivity;
        	}
        }
        if (bActivity[6] === '1') {
        	n += 2;
        	impTool.tpl.importData_frameLIST(template, allComplete, errorCall);
            impTool.tpl.importData_frameLIST_INIT(template, allComplete, errorCall);
        }
        if (bActivity[5] === '1') {
        	n += 2;
        	impTool.tpl.importData_frameUPD(template, allComplete, errorCall);
        	impTool.tpl.importData_frameUPD_INIT(template, allComplete, errorCall);
        }
        if (bActivity[4] === '1') {
        	n += 2;
	        impTool.tpl.importData_frameADD(template, allComplete, errorCall);
	        impTool.tpl.importData_frameADD_INIT(template, allComplete, errorCall);
        }
        if (bActivity[3] === '1') {
        	n += 2;
	        impTool.tpl.importData_framePRINT(template, allComplete, errorCall);
	        impTool.tpl.importData_framePRINT_INIT(template, allComplete, errorCall);
        }
        if (bActivity[2] === '1') {
        	n += 2;
	        impTool.tpl.importData_frameAPPADD(template, allComplete, errorCall);
	        impTool.tpl.importData_frameAPPADD_INIT(template, allComplete, errorCall);
        }
        if (bActivity[1] === '1') {
        	n += 2;
	        impTool.tpl.importData_frameAPPUPD(template, allComplete, errorCall);
	        impTool.tpl.importData_frameAPPUPD_INIT(template, allComplete, errorCall);
        }
        if (bActivity[0] === '1') {
        	n += 2;
	        impTool.tpl.importData_frameAPPLIST(template, allComplete, errorCall);
	        impTool.tpl.importData_frameAPPLIST_INIT(template, allComplete, errorCall);
        }
        n += 1;
        allComplete();
        function allComplete() {
        	var percent = Math.floor((factoryCallback / n) * 35);
	    	$('.progress-bar').attr('aria-valuenow', percent + 65).css('width', percent + 65 + '%').text(percent + 65 + '%');
            if (++factoryCallback < n) {
                return;
            }
            $('.progress-bar').attr('aria-valuenow', 100).css('width', '100%').text('100%');
            $('.progress-bar').removeClass('progress-bar-striped active');
            $("#importStatus").html("導入作業全部完成！");
        }

        function errorCall(error_msg) {
            console.log(error_msg);
            return;
        }
    }
};

//打開產生formVersion的頁面，等待產生完畢後，該頁面會觸發 childclose();
function childclose(formVersion){
    impTool.tpl.importData_formVersionOK(formVersion);
}




//傳送 formVersion 去後台解析並取得 dynamicFormTemplate 物件
impTool.tpl.getDynamicFormTemplate = function(version_Content, successCall, errorCall){
    dynamicForm.searchParamDF.content = version_Content;
    // console.log(dynamicForm);
    basicParam.getDynamicFormTemplateByContent(dynamicForm, getDynamicFormTemplateCall, function(e) {console.log(e)});
    function getDynamicFormTemplateCall(dFTemplate, msg){
        if (dFTemplate!=null){
            successCall(dFTemplate);
        }else{
            errorCall(msg);
        }
    }
};

/**
 * <p>Checks if a String is empty ("") or null.</p>
 *
 * <pre>
 * isEmpty(null)      = true
 * isEmpty("")        = true
 * isEmpty(" ")       = false
 * isEmpty("bob")     = false
 * isEmpty("  bob  ") = false
 * </pre>
 * @param str
 * @returns {boolean}
 */
function isEmpty(str){
    return str===undefined||str===null||str==='';
}
//formVersion 物件前處理
impTool.tpl.processDFData = function(dFTemplate){
    //tab 底色
    var tabColors=["F2F2F2","FFFF99","CCFFCC","CCFFFF","FFCC66","B9B9FF","#ffc0cb","FF00FF","00ff7f","cd5c5c","40e0d0","a9a9a9","ff7f50"], tabCount=-1;
    //排序 sortNo
    try{
        var items=dFTemplate.items, wid=items.length.toString().length;
        for(var i=0, len=items.length; i<len; ++i){
            if (items[i].sortNo!=undefined){
                for (var i2=items[i].sortNo.length; i2<wid; ++i2){
                    items[i].sortNo="0"+items[i].sortNo;
                }
                if (items[i].controlType=="tab"){
                    items[i].sortNo="001"+items[i].sortNo+"_"+items[i].name;
                }else if (items[i].tab){
                    items[i].sortNo="002"+items[i].tab+"_"+items[i].sortNo;
                }else{
                    items[i].sortNo="003"+"hasNoTab"+"_"+items[i].sortNo;
                }
            }
        }
        dFTemplate.items=items.sortJson({key:'sortNo',orderby:'asc'});
    }catch(e){
        console.log("沒有sortNo");
    }
    var rowLevelIdxs={}, //level 索引
        rowLevelCounts={}, //level 子層個數
        colTotal=2, //col總數
        colCount=2; //計算col數量 (基礎就是2 col起跳)
    for(var i=0, len=dFTemplate.items.length; i<len; ++i){
        var item = dFTemplate.items[i];
        //tab 判斷是否有tab標籤
        if(dFTemplate.items[i].controlType=="tab"){
            dFTemplate.hasTab=true;
            dFTemplate.items[i].tabColor=tabColors[++tabCount];
        }else{
            //level 計算rowspan
            if (item.controlType=="level"){
                rowLevelIdxs[item.name]=i;
                dFTemplate.items[i].rowspan=0;
            }
            //標記tr開始及tr結束
            if (item.controlType!="level" && isEmpty(item.rowLevel)){
                item.trStart=true;
                item.trEnd=true;
            }else if (item.controlType=="level" && isEmpty(item.rowLevel)){
                item.trStart=true;
            }else if (item.controlType=="level"){
                rowLevelCounts[item.rowLevel] = (rowLevelCounts[item.rowLevel]==undefined) ? 1 : rowLevelCounts[item.rowLevel]+1; //level 子層個數
                if (rowLevelCounts[item.rowLevel]!==1){
                    item.trStart=true;
                }
            }else if (item.controlType!="level"){
                rowLevelCounts[item.rowLevel] = (rowLevelCounts[item.rowLevel]==undefined) ? 1 : rowLevelCounts[item.rowLevel]+1; //level 子層個數
                if (rowLevelCounts[item.rowLevel]!==1){
                    item.trStart=true;
                }
                item.trEnd=true;
                //累計並設定rowspan
                var rowLevelItem = dFTemplate.items[rowLevelIdxs[item.rowLevel]];
                colCount = 1; //重置col數量
                while (rowLevelItem){
                    ++rowLevelItem.rowspan; //累計rowspan
                    rowLevelItem = dFTemplate.items[rowLevelIdxs[rowLevelItem.rowLevel]];
                    ++colCount; //計算col數量
                }
                colTotal = (colCount > colTotal) ? colCount : colTotal;//記錄col總數
            }
        }
    }
    //設定colspan
    for(var i=0, len=dFTemplate.items.length; i<len; ++i){
        var item = dFTemplate.items[i];
        if (item.controlType!="tab" && item.controlType!="level" && item.controlType!="group"){
            //累計level數
            colCount = 0;
            var rowLevelItem = dFTemplate.items[rowLevelIdxs[item.rowLevel]];
            console.log(item.name);
            while (rowLevelItem){
                ++colCount;
                rowLevelItem = dFTemplate.items[rowLevelIdxs[rowLevelItem.rowLevel]];
            }
            colCount = (colCount===0) ? 1 : colCount; //如果沒有rowLevel代表元件左邊只有一層td
            dFTemplate.items[i].colspan = colTotal-colCount;
        }
    }
    //tab 如果有tab標籤，替所有沒有tab屬性的元件加上tab="none"
    if (dFTemplate.hasTab===true){
        var hasNoneTag = false;
        for(var i=0, len=dFTemplate.items.length; i<len; ++i){
            var item = dFTemplate.items[i];
            if (item.controlType!="tab" && item.controlType!="group"){
                if (item.tab==undefined){
                    hasNoneTag = true;
                    dFTemplate.items[i].tab="none";
                }
            }
        }
        if (hasNoneTag){
            var itLen=dFTemplate.items.length;
            dFTemplate.items[itLen]={};
            dFTemplate.items[itLen].name="none";
            dFTemplate.items[itLen].title="未設置tab屬性!!";
            dFTemplate.items[itLen].controlType="tab";
            dFTemplate.items[itLen].tabColor=tabColors[++tabCount];
        }
    }
    //為所有 horizontalFormItem 和 verticalFormItem 的受屬物件加上屬性 isHorFormItem 和 isVerFormItem
    for(var i=0, len=dFTemplate.items.length; i<len; ++i){
        var item = dFTemplate.items[i];
        //isHorFormItem
        if (item.horizontalFormItem){
            var horArr=item.horizontalFormItem.split("|,|");
            for(var i2=0, len2=dFTemplate.items.length; i2<len2; ++i2){
                var item2 = dFTemplate.items[i2];
                for (var i3=0, len3=horArr.length; i3<len3; ++i3){
                    if ((","+horArr[i3]+",").indexOf(","+item2.name+",")>-1){
                        item2.isHorFormItem=true;
                    }
                }
            }
        }
        //isVerFormItem
        if (item.verticalFormItem){
            var verArr=item.verticalFormItem.split("|,|");
            for(var i2=0, len2=dFTemplate.items.length; i2<len2; ++i2){
                var item2 = dFTemplate.items[i2];
                for (var i3=0, len3=verArr.length; i3<len3; ++i3){
                    if ((","+verArr[i3]+",").indexOf(","+item2.name+",")>-1){
                        item2.isVerFormItem=true;
                    }
                }
            }
        }
    }
    console.log(dFTemplate);
    return dFTemplate;
};

//提取html模板
impTool.tpl.getHTMLTemplate = function(fileName, gT_successCall, gT_errorCall){
    var url = "../customFormV3/template/dynamicTools/"+fileName;
    $.ajax({url: url, cache: false, async: true}).done(function( context ) {
        gT_successCall(context);
    }).fail(function(err){gT_errorCall(err)});
};

//渲染HTML
impTool.tpl.cxtHTML = function(context, dFTemplate){
    var cxt = template.compile(context);
    var html="", temp=cxt(dFTemplate).split("\n");
    //去除空白行
    for (var i=0, len=temp.length; i<len; ++i){
        if (temp[i].replace(/\s+/, "").length!==0){
            html+=temp[i];
        }
    }
    return html;
};

//新增frame
impTool.tpl.addFormFrame = function(html,formType, frameModel, addOrUpdSuccess, addOrUpdError){
    var frame=eNursing.extend({},nursing.getFormFrame());
    frame.formType=formType;
    frame.frameModel=frameModel;
    frame.content=html;
    frame.note=new Date().format("yyyy/MM/dd HH:mm by Import Page");
    frame.creatorId=userId;
    frame.creatorName=userName;
    frame.modifyUserId=userId;
    frame.modifyUserName=userName;
    basicParam.addFormFrame(frame, addOrUpdSuccess, addOrUpdError);
};

//解析 "導入格式"
impTool.tpl.extFormat = function(workbook){
    var sheet = workbook.Sheets["導入格式"] || workbook.Sheets["导入格式"];
    var rc = impTool.readRowColParam(sheet["!ref"]); //返回行列的參數
    var colNameRowNum = "元件屬性名稱列";
    var startRowNum = "資料開始列";
    // var sourceId = "sourceId";
    var sheetName = "頁籤名稱";
    var formType = "formItemTemplate";
    var rows = {};
    for (var i=rc.t; i<=rc.b; ++i){
        if (sheet["A"+i]) rows[sheet["A"+i].w] = sheet["B"+i].w;
    }
    colNameRowNum = parseInt(rows[colNameRowNum]) || parseInt(rows["组件属性名称列"]);
    startRowNum = parseInt(rows[startRowNum]) || parseInt(rows["数据开始列"]);
    // sourceId = rows[sourceId];
    sheetName = rows[sheetName] || rows["页签名称"];
    return {
        "colNameRowNum" : colNameRowNum,
        "startRowNum" : startRowNum,
        // "sourceId" : sourceId,
        "sheetName" : sheetName,
        "formType" : formType
    };
};
//剔除/補足 不合格的資料
impTool.tpl.completeData = function(gForms,dftpl){
    var rejectItem=[], newGforms=[];
    //準備要檢查的 beanName
    var beanArr=["name","title","controlMode","fileMode","dontDitto","uiClass","horizontalFormItem","verticalFormItem","backTitle","showTitle","printShowTitle","uiScore","uiDesc","uiValue","displayMode","hasOther","otherTitle","otherBackTitle","otherWidth","checked","show","required","promptTips","width","defaultValue","typeFormat","minLimit","maxLimit","parent","children","click","onkeydown","blur","tab","sortNo","rowLevel","objAttr","objAttrCon","recordItems"];
    var beanArrFit=[];
    for (var i=0, len=beanArr.length; i<len; ++i){
        beanArrFit.push("fit"+beanArr[i].substring(0, 1).toUpperCase() + beanArr[i].substring(1));
    }

    var dftpl_controltype = dftpl.hashItems.fitControlType.uiValue;
    for (var i=0, len=gForms.length; i<len; ++i){
        var itemMap = gFormJS.setGFormItemMap(gForms[i]).gformItemMap;
        var type = (itemMap.fitControlType) ? itemMap.fitControlType.itemValue : "";
        var d={};
        for (var i2=0, len2=beanArr.length; i2<len2; ++i2){
            d[beanArr[i2]] = (itemMap[beanArrFit[i2]]) ? itemMap[beanArrFit[i2]].itemValue : "";
        }
        if (type==""){
            if (languageMode=="Traditional Chinese") {
                gForms[i].rejectReason="controlType 不得為空";
            } else if (languageMode=="Simplified Chinese") {
                gForms[i].rejectReason="controlType 不得为空";
            }
            rejectItem.push(gForms[i]);
            continue;
        }else if (dftpl_controltype.indexOf(type)===-1){
            if (languageMode=="Traditional Chinese") {
                gForms[i].rejectReason="查無此 controlType";
            } else if (languageMode=="Simplified Chinese") {
                gForms[i].rejectReason="查无此 controlType";
            }
            rejectItem.push(gForms[i]);
            continue;
        }else if (d.name==""){
            if (languageMode=="Traditional Chinese") {
                gForms[i].rejectReason="name 不得為空";
            } else if (languageMode=="Simplified Chinese") {
                gForms[i].rejectReason="name 不得为空";
            }
            rejectItem.push(gForms[i]);
            continue;
        }else if (d.title==""){
            if (languageMode=="Traditional Chinese") {
                gForms[i].rejectReason="title 不得為空";
            } else if (languageMode=="Simplified Chinese") {
                gForms[i].rejectReason="title 不得为空";
            }
            rejectItem.push(gForms[i]);
            continue;
        }else if (type=="radio"||type=="checkbox"||type=="select"){
            var uiDescLen=-1;
            if (d.uiDesc==""){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="uiDesc 不得為空";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="uiDesc 不得为空";
                }
                rejectItem.push(gForms[i]);
                continue;
            }else{
                uiDescLen = d.uiDesc.split(",").length;
            }
            if (d.uiScore==""){
                var uiDesc = d.uiDesc.split(",");
                itemMap.fitUiScore = {"itemValue" : ""};
                for (var i2=0, len2=uiDesc.length; i2<len2; ++i2){
                    itemMap.fitUiScore.itemValue += ","+"0";
                }
                itemMap.fitUiScore.itemValue = itemMap.fitUiScore.itemValue.substring(1);
            }else if (d.uiScore.split(",").length !== uiDescLen){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="uiScore 與 uiDesc 數量不一致";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="uiScore 与 uiDesc 数量不一致";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
            if (d.uiValue==""){
                itemMap.fitUiValue = {"itemValue" : d.uiDesc};
            }else if (d.uiValue.split(",").length !== uiDescLen){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="uiValue 與 uiDesc 數量不一致";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="uiValue 与 uiDesc 数量不一致";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
            if (d.hasOther==""){
                var uiDesc = d.uiDesc.split(",");
                itemMap.fitHasOther = {"itemValue" : ""};
                for (var i2=0, len2=uiDesc.length; i2<len2; ++i2){
                    itemMap.fitHasOther.itemValue += ","+"false";
                }
                itemMap.fitHasOther.itemValue = itemMap.fitHasOther.itemValue.substring(1);
            }else if (d.hasOther.split(",").length !== uiDescLen){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="hasOther 與 uiDesc 數量不一致";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="hasOther 与 uiDesc 数量不一致";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
            if (d.otherTitle!="" && d.otherTitle.split(",").length !== uiDescLen){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="otherTitle 與 uiDesc 數量不一致";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="otherTitle 与 uiDesc 数量不一致";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
            if (d.otherBackTitle!="" && d.otherBackTitle.split(",").length !== uiDescLen){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="otherBackTitle 與 uiDesc 數量不一致";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="otherBackTitle 与 uiDesc 数量不一致";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
            if (d.otherWidth!="" && d.otherWidth.split(",").length !== uiDescLen){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="otherWidth 與 uiDesc 數量不一致";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="otherWidth 与 uiDesc 数量不一致";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
            if (d.checked!="" && d.checked.split(",").length !== uiDescLen){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="checked 與 uiDesc 數量不一致";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="checked 与 uiDesc 数量不一致";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
            if (d.horizontalFormItem!="" && d.horizontalFormItem.split("|,|").length !== uiDescLen){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="horizontalFormItem 與 uiDesc 數量不一致";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="horizontalFormItem 与 uiDesc 数量不一致";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
            if (d.verticalFormItem!="" && d.verticalFormItem.split("|,|").length !== uiDescLen){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="verticalFormItem 與 uiDesc 數量不一致";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="verticalFormItem 与 uiDesc 数量不一致";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
        }else if (type=="level"){
            if (d.rowLevel==d.name){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="level 的 rowLevel 不可以是自己的 name";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="level 的 rowLevel 不可以是自己的 name";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
        }else if (type=="group"){
            if (d.children=="" || !d.children){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="group 的 children 不得為空";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="group 的 children 不得为空";
                }
                rejectItem.push(gForms[i]);
                continue;
            }else{
                var childrens = d.children.split(",");
                var checkItemParent=false;
                //檢查每一個children是否都有設置parent
                for (var i3=0, len3=childrens.length; i3<len3; ++i3){
                    for (var i4=0, len4=gForms.length; i4<len4; ++i4){
                        var itemMap2 = gFormJS.setGFormItemMap(gForms[i4]).gformItemMap;
                        var type2 = (itemMap2.fitControlType) ? itemMap2.fitControlType.itemValue : "";
                        var d2={};
                        for (var i5=0, len5=beanArr.length; i5<len5; ++i5){
                            d2[beanArr[i5]] = (itemMap2[beanArrFit[i5]]) ? itemMap2[beanArrFit[i5]].itemValue : "";
                        }
                        if (childrens.indexOf(d2.name)>-1){
                            try{
                                if (d2.parent.split(",").indexOf(d.name)==-1){
                                    if (languageMode=="Traditional Chinese") {
                                        gForms[i].rejectReason="children 裡的 "+d2.name+" 應設置 parent 為 "+d.name;
                                    } else if (languageMode=="Simplified Chinese") {
                                        gForms[i].rejectReason="children 里的 "+d2.name+" 应设置 parent 为 "+d.name;
                                    }
                                    rejectItem.push(gForms[i]);
                                    checkItemParent=true;
                                    len3=len4=-1;
                                }
                            }catch(e){
                                console.log(e);
                                if (languageMode=="Traditional Chinese") {
                                    gForms[i].rejectReason="children 裡的 "+d2.name+" 應設置 parent 為 "+d.name;
                                } else if (languageMode=="Simplified Chinese") {
                                    gForms[i].rejectReason="children 里的 "+d2.name+" 应设置 parent 为 "+d.name;
                                }
                                rejectItem.push(gForms[i]);
                                checkItemParent=true;
                                len3=len4=-1;
                            }
                        }
                    }
                }
                if (checkItemParent){
                    continue;
                }
            }
        }
        //檢查 horizontalFormItem 及 verticalFormItem 的受屬item
        if (d.horizontalFormItem || d.verticalFormItem){
            var hvArr = "";
            if (d.horizontalFormItem){
                hvArr += ","+d.horizontalFormItem.replace(/\|,\|/g, ",")+",";
            }
            if (d.verticalFormItem){
                hvArr += ","+d.verticalFormItem.replace(/\|,\|/g, ",")+",";
            }
            var rejectItemName="";
            for (var i2=0, len2=gForms.length; i2<len2; ++i2){
                var itemMap2 = gFormJS.setGFormItemMap(gForms[i2]).gformItemMap;
                console.log(itemMap2);
                if (itemMap2.fitName && hvArr.indexOf(","+itemMap2.fitName.itemValue+",")>-1){
                    if (itemMap2.fitRowLevel){
                        rejectItemName = itemMap2.fitName.itemValue;
                        i2=len2;
                    }
                }
            }
            if (rejectItemName!=""){
                if (languageMode=="Traditional Chinese") {
                    gForms[i].rejectReason="元件 "+rejectItemName+" 不得設定 rowLevel ，因為有設定 horizontalFormItem 及 verticalFormItem";
                } else if (languageMode=="Simplified Chinese") {
                    gForms[i].rejectReason="元件 "+rejectItemName+" 不得设定 rowLevel ，因为有设定 horizo​​ntalFormItem 及 verticalFormItem";
                }
                rejectItem.push(gForms[i]);
                continue;
            }
        }
        //沒有值就代入預設值
        //controlMode
        if (itemMap.fitControlMode)
            itemMap.fitControlMode.itemValue = (d.controlMode=="") ? "normal" : d.controlMode;
        else
            itemMap.fitControlMode={"itemValue":"normal"};
        //showTitle
        if (itemMap.fitShowTitle)
            itemMap.fitShowTitle.itemValue = (d.showTitle=="") ? "0" : d.showTitle; //0=不顯示 1=顯示
        else
            itemMap.fitShowTitle={"itemValue":"0"};
        //printShowTitle
        if (itemMap.fitPrintShowTitle)
            itemMap.fitPrintShowTitle.itemValue = (d.printShowTitle=="") ? "0" : d.printShowTitle; //0=不顯示 1=顯示
        else
            itemMap.fitPrintShowTitle={"itemValue":"0"};
        //show
        if (itemMap.fitShow)
            itemMap.fitShow.itemValue = (d.show=="") ? "1" : d.show; //0=不顯示 1=顯示
        else
            itemMap.fitShow={"itemValue":"1"};
        //required
        if (itemMap.fitRequired)
            itemMap.fitRequired.itemValue = (d.required==""||d.required=="Y") ? "1" : d.required; //0=非必填 1=必填
        else
            itemMap.fitRequired={"itemValue":"0"};
        if (type=="date"||type=="time"||type=="datetime"){
            if (d.typeFormat==""){
                if (type=="date") itemMap.fitTypeFormat = {"itemValue" : JSON.stringify({"date":{"format":"yyyy-mm-dd","weekStart":1,"todayBtn":1,"autoclose":1,"todayHighlight":1,"startView":4,"minView":2,"forceParse":0,"language":"zh-TW"}})};
                if (type=="time") itemMap.fitTypeFormat = {"itemValue" : JSON.stringify({"time":{"format":"hh:ii","startDate":"new Date(new Date().getFullYear()+\"/\"+new Date().getMonth()+\"/\"+new Date().getDate()+\" 00:00:00\")","datepicker":false,"todayBtn":1,"autoclose":1,"todayHighlight":1,"startView":1,"minView":0,"maxView":1,"forceParse":0,"minuteStep":1,"language":"zh-TW"}})};
                if (type=="datetime") itemMap.fitTypeFormat = {"itemValue" : JSON.stringify({"date":{"format":"yyyy-mm-dd","weekStart":1,"todayBtn":1,"autoclose":1,"todayHighlight":1,"startView":4,"minView":2,"forceParse":0,"language":"zh-TW"},"time":{"format":"hh:ii","startDate":"new Date(new Date().getFullYear()+\"/\"+new Date().getMonth()+\"/\"+new Date().getDate()+\" 00:00:00\")","datepicker":false,"todayBtn":1,"autoclose":1,"todayHighlight":1,"startView":1,"minView":0,"maxView":1,"forceParse":0,"minuteStep":1,"language":"zh-TW"}})};
            }

            // if (!d.defaultValue){
            //     if (type=="date"){
            //         itemMap.fitDefaultValue = {"itemValue" : '{"date":"-0y-0m-0d"}'};
            //     }else if (type=="time"){
            //         itemMap.fitDefaultValue = {"itemValue" : '{"time":"-0h-0m"}'};
            //     }else if (type=="datetime"){
            //         itemMap.fitDefaultValue = {"itemValue" : '{"date":"-0y-0m-0d", "time":"-0h-0m"}'};
            //     }
            // }
        }
        gForms[i].gformItemMap=itemMap;
        gForms[i] = gFormJS.setGFormItems(gForms[i]);
        gForms[i].nodeId = gFormJS.nodeId;
        newGforms.push(gForms[i]);
    }
    return {
        "rejectItem" : rejectItem,
        "newGforms" : newGforms
    };
};
//產生frame(LIST)
impTool.tpl.importData_frameLIST = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(LIST)...");
    impTool.tpl.getHTMLTemplate($("#list_frameName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormWebLIST", function(){
            $("#importStatus").html("產生frame(LIST)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(LIST)... error!");
            console.error("產生frame(LIST)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(LIST)... error!");
        console.error(err);
        errorCall(err);
    });
};

//產生frame(LIST)(INIT)
impTool.tpl.importData_frameLIST_INIT = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(LIST)(INIT)...");
    impTool.tpl.getHTMLTemplate($("#list_initName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormWebLIST_INIT", function(){
            $("#importStatus").html("產生frame(LIST)(INIT)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(LIST)(INIT)... error!");
            console.error("產生frame(LIST)(INIT)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(LIST)(INIT)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(UPD)
impTool.tpl.importData_frameUPD = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(UPD)...");
    impTool.tpl.getHTMLTemplate($("#upd_frameName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormWebUPD", function(){
            $("#importStatus").html("產生frame(UPD)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(UPD)... error!");
            console.error("產生frame(UPD)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(UPD)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(UPD)
impTool.tpl.importData_frameUPD_INIT = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(UPD)(INIT)...");
    impTool.tpl.getHTMLTemplate($("#upd_initName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormWebUPD_INIT", function(){
            $("#importStatus").html("產生frame(UPD)(INIT)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(UPD)(INIT)... error!");
            console.error("產生frame(UPD)(INIT)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(UPD)(INIT)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(ADD)
impTool.tpl.importData_frameADD = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(ADD)...");
    impTool.tpl.getHTMLTemplate($("#add_frameName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormWebADD", function(){
            $("#importStatus").html("產生frame(ADD)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(ADD)... error!");
            console.error("產生frame(ADD)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(ADD)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(ADD)(INIT)
impTool.tpl.importData_frameADD_INIT = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(ADD)(INIT)...");
    impTool.tpl.getHTMLTemplate($("#add_initName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormWebADD_INIT", function(){
            $("#importStatus").html("產生frame(ADD)(INIT)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(ADD)(INIT)... error!");
            console.error("產生frame(ADD)(INIT)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(ADD)(INIT)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(PRINT)
impTool.tpl.importData_framePRINT = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(PRINT)...");
    impTool.tpl.getHTMLTemplate($("#print_frameName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormWebPRINT", function(){
            $("#importStatus").html("產生frame(PRINT)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(PRINT)... error!");
            console.error("產生frame(PRINT)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(PRINT)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(PRINT)(INIT)
impTool.tpl.importData_framePRINT_INIT = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(PRINT)(INIT)...");
    impTool.tpl.getHTMLTemplate($("#print_initName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormWebPRINT_INIT", function(){
            $("#importStatus").html("產生frame(PRINT)(INIT)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(PRINT)(INIT)... error!");
            console.error("產生frame(PRINT)(INIT)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(PRINT)(INIT)... error!");
        console.error(err);
        errorCall(err);
    });
};

//產生frame(APPADD)
impTool.tpl.importData_frameAPPADD = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(APPADD)...");
    impTool.tpl.getHTMLTemplate($("#appAdd_frameName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormAppADD", function(){
            $("#importStatus").html("產生frame(APPADD)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(APPADD)... error!");
            console.error("產生frame(APPADD)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(APPADD)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(APPADD)(INIT)
impTool.tpl.importData_frameAPPADD_INIT = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(APPADD)(INIT)...");
    impTool.tpl.getHTMLTemplate($("#appAdd_initName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormAppADD_INIT", function(){
            $("#importStatus").html("產生frame(APPADD)(INIT)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(APPADD)(INIT)... error!");
            console.error("產生frame(APPADD)(INIT)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(APPADD)(INIT)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(APPUPD)
impTool.tpl.importData_frameAPPUPD = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(APPUPD)...");
    impTool.tpl.getHTMLTemplate($("#appUpd_frameName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormAppUPD", function(){
            $("#importStatus").html("產生frame(APPUPD)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(APPUPD)... error!");
            console.error("產生frame(APPUPD)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(APPUPD)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(APPUPD)(INIT)
impTool.tpl.importData_frameAPPUPD_INIT = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(APPUPD)(INIT)...");
    impTool.tpl.getHTMLTemplate($("#appUpd_initName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormAppUPD_INIT", function(){
            $("#importStatus").html("產生frame(APPUPD)(INIT)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(APPUPD)(INIT)... error!");
            console.error("產生frame(APPUPD)(INIT)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(APPUPD)(INIT)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(appList)
impTool.tpl.importData_frameAPPLIST = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(APPLIST)...");
    impTool.tpl.getHTMLTemplate($("#appList_frameName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormAppLIST", function(){
            $("#importStatus").html("產生frame(AppLIST)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(AppLIST)... error!");
            console.error("產生frame(AppLIST)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(AppLIST)... error!");
        console.error(err);
        errorCall(err);
    });
};
//產生frame(APPLIST)(INIT)
impTool.tpl.importData_frameAPPLIST_INIT = function(dFTemplate, successCall, errorCall) {
    $("#importStatus").html("產生frame(APPLIST)(INIT)...");
    impTool.tpl.getHTMLTemplate($("#appList_initName").val(), function(context){
        var html = impTool.tpl.cxtHTML(context, dFTemplate);
        impTool.tpl.addFormFrame(html,dFTemplate.formType, "gFormAppLIST_INIT", function(){
            $("#importStatus").html("產生frame(APPLIST)(INIT)... OK!");
            successCall();
        }, function(){
            $("#importStatus").html("產生frame(APPLIST)(INIT)... error!");
            console.error("產生frame(APPLIST)(INIT)... error!");
            errorCall(err);
        });
    }, function(err){
        $("#importStatus").html("產生frame(APPLIST)(INIT)... error!");
        console.error(err);
        errorCall(err);
    });
};

