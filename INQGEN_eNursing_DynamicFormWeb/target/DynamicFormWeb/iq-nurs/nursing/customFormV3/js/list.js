
//List特有區段

//轉譯所有formItemValue為FormItemDesc
var versionNos = [];
var formIDsMap = {};
var formIDs = [];
var formIDs2 = [];
var formTypes = [];
var versionNosCounts = 0;
var dFTemplates = {};
//動態表單模板
var dynamicFormTemplate = null;
// 存取參數模板
var fullyQlParam = {}
//動態表單 第三版 dynamicForm
function list_dynamicFormTransefer(completeCall, errorCall){
    //找到所有有用到的formVersionId
    versionNos = [];
    formIDsMap = {};
    formIDs = [];
    formTypes = [];
    versionNosCounts = 0;
    dFTemplates = {};
    if (dForms.length==0){
        goPageReady(completeCall);
    }
    for (var i = 0, len = dForms.length; i < len; i++) {
        dForm = dForms[i].dynamicForm;
        if (!versionMap[dForm.formType+"-"+dForm.versionNo] && gForm.versionNo!=undefined) {
            versionMap[dForm.formType+"-"+dForm.versionNo] = true;
            versionNos.push(dForm.versionNo);
            formTypes.push(dForm.formType);
        }
        formIDsMap[gForm.formId]=gForm.formType;
        formIDs[dForm.formId]=parseInt(dForm.versionNo);
        formIDs2[dForm.formId]=0;
    }
    transeferItemValueToItemDesc(doShowElementUiDesc, completeCall, errorCall);

    //轉譯所有formItemValue為FormItemDesc
    function doShowElementUiDesc(completeCall){
        $(".pFormItem").each(function() {
            var bean = getDataset(this).bean;
            var index = getDataset(this).index;
            // var formVersionId = getDataset(this).formversionid;
            var formId = dForms[index].dynamicForm.formId;
            var itemMaps = dForms[index].dynamicForm.formItems;
            var dFTemplate = dFTemplates[formId];
            dynamicFormTemplate = dFTemplate;
            if (dFTemplate) {
                dynamicForm.showElementUiDesc(this, itemMaps[bean], dFTemplate.hashItems?dFTemplate.hashItems[bean]:undefined, itemMaps);
            }
        });
        goPageReady(completeCall);
    }
}
//動態表單 第四版 gForm
function list_gFormTransefer(completeCall, errorCall, $selector, isDontLoadPageReadyFiles){
    versionMap = {};
    versionNos = [];
    formIDs = [];
    formIDs2 = [];
    formTypes = [];
    versionNosCounts = 0;

    //建立iframe元件
    var iframeBasicParam = nursing.createBasicParam();
    var iframeDynamicForm = nursing.createDynamicForm();
    iframeDynamicForm.searchParamDF.formType = formType;
    iframeBasicParam.getCurrDynamicFormTemplateV3(iframeDynamicForm, function(dFTemplate){
        var iframeHashItems = dFTemplate[0].basicParam.dynamicFormTemplate.hashItems;
        for (var key in iframeHashItems) {
            //找到iframem元件
            if (iframeHashItems[key].controlType=="iframe") {
                var $ele = $(".pFormItem[data-bean='"+key+"']");
                //若畫面上有iframe元件，建立之
                if ($ele.length!==0){
                    iframeDynamicForm.createElement($ele[0], iframeHashItems[key], iframeHashItems);
                }
            }
        }
    }, function(e) {
        console.error("發生錯誤-> 取得 最新的formVersion 資訊", e);
    });

    //找到所有有用到的formVersionId
    if (gForms.length==0){
        goPageReady(completeCall, isDontLoadPageReadyFiles);
        return;
    }
    for (var i in gForms) {
        gForm = gForms[i].gForm;
        if (gForm){
            if (!versionMap[gForm.formType+"-"+gForm.versionNo] && gForm.versionNo!=undefined) {
                versionMap[gForm.formType+"-"+gForm.versionNo] = true;
                versionNos.push(gForm.versionNo);
                formTypes.push(gForm.formType);
            }
            formIDsMap[gForm.formId]=gForm.formType;
            formIDs[gForm.formId]=parseInt(gForm.versionNo);
            formIDs2[gForm.formId]=0;
        }
    }


    transeferItemValueToItemDesc(doShowElementUiDesc, completeCall, errorCall);

    //轉譯所有formItemValue為FormItemDesc
    function doShowElementUiDesc(completeCall){
        $selector = ($selector) ? $selector : $(".pFormItem");
        $selector.each(function() {
            var bean = getDataset(this).bean;
            var index = getDataset(this).index;
            //排除一些不是資料的元件，如iFrame元件
            if (index===undefined) {
                return;
            }
            // var formVersionId = getDataset(this).formversionid;
            var formId = gForms[index].gForm.formId;
            var itemMaps = gForms[index].gForm.gformItemMap;
            var dFTemplate = dFTemplates[formId];
            dynamicFormTemplate = dFTemplate;
            if (dFTemplate) {
                if(bean=='evaluationTime'){
                    // 評估日期(evaluationTime)元件
                    itemMaps[bean] = {
                        "itemKey": 'evaluationTime',
                        "itemValue": new Date(gForms[index].gForm.evaluationTime).format("yyyy-MM-dd HH:mm"),
                        "nodeId": ""
                    }
                }
                dynamicForm.showElementUiDesc(this, itemMaps[bean], dFTemplate.hashItems?dFTemplate.hashItems[bean]:undefined, itemMaps);
            }
        });
        //取得 apiModule 資訊
        var apiBasicParam = nursing.createBasicParam();
        var apiDynamicForm = nursing.createDynamicForm();
        apiDynamicForm.searchParamDF.formType = formType;
        apiBasicParam.getCurrDynamicFormTemplateV3(apiDynamicForm, function(dFTemplate){
            var apiDynamicFormTemplate = dFTemplate[0].basicParam.dynamicFormTemplate;
            setApiSetting(apiDynamicFormTemplate, completeCall, isDontLoadPageReadyFiles);
        }, function(e) {
            console.error("發生錯誤-> 取得 apiModule 資訊", e);
            goPageReady(completeCall, isDontLoadPageReadyFiles);
        });
    }
}
function transeferItemValueToItemDesc(doShowElementUiDesc, completeCall, errorCall){
    if (versionNos.length===0){
        doShowElementUiDesc(completeCall);
        return;
    }
    //查詢所有form的XML模板 (以formType及versionNo為key)
    for (var i2 = 0, len2=versionNos.length; i2<len2; i2++) {
        dynamicForm.searchParamDF.versionNo = versionNos[i2];
        dynamicForm.searchParamDF.formType = formTypes[i2];
        basicParam.getDynamicFormTemplateByFormModelVersionNo(dynamicForm, function(dFTemplate) {
            dFTemplate = dFTemplate[0].basicParam.dynamicFormTemplate;
            // dFTemplates[dFTemplate.formVersionId] = dFTemplate;
            for(var fID in formIDs){
                if (formIDsMap[fID]===dFTemplate.formType && formIDs[fID]>=dFTemplate.version && formIDs2[fID]<=dFTemplate.version){
                    formIDs2[fID]=dFTemplate.version;
                    dFTemplates[fID] = dFTemplate;
                }
            }
            //查完之後就轉譯所有formItemValue為FormItemDesc
            if (++versionNosCounts==versionNos.length){
                doShowElementUiDesc(completeCall);
            }
        }, function(err) {++versionNosCounts;errorCall(err);});
    }
}
//处理gform相关数据
function autoProcessGFormDataForList(dynamicForm, paramMap,successCall,errorCall){
    paramMap = paramMap || {};
    basicParam.getCurrDynamicFormTemplateV3(dynamicForm, function(dFTemplate) {
        paramMap.versionParamMap = paramMap.versionParamMap||{formType: dFTemplate[0].basicParam.dynamicFormTemplate.formType,formModel:dFTemplate[0].basicParam.dynamicFormTemplate.formType,versionNo:dFTemplate[0].basicParam.dynamicFormTemplate.version};
        gFormJS.autoProcessGFormData(paramMap, function (result) {
            var gformData = result;
            successCall(gformData);
        }, function(e) {eNursing.error(e);errorCall(e)});
    }, function(err) {++versionNosCounts;errorCall(err);});
}

/**
 * queryList 製作 art-template html 結構
 * ==
 * 依照 element(tr) 傳入的欄位依序轉換為 art-template 結構
 * @param element
 * @returns {string}
 */
function buildScript(element) {
    var tdsArray = $(element).find('td');
    var scriptResult = '';
    scriptResult += '{{if $data.length==0}}';
    scriptResult += '<tr class="text-center">';
    scriptResult += '<td colspan="'+ $(element).find('td').length +'">查無資料..</td>';
    scriptResult += '</tr>';
    scriptResult += '{{else}}';
    scriptResult += '{{each $data tableForm idx}}';
    scriptResult += '<tr class="text-center">';
    for (var i = 0, len = tdsArray.length; i < len; ++i) {
        var elements = $(tdsArray[i]).children();
        scriptResult += '<td>';
        for (var j = 0, len2 = elements.length; j < len2; ++j) {
            switch (elements[j].tagName.toLowerCase()) {
                case 'label':
                    if ($(elements[j]).data('paramComparison') !== undefined) fullyQlParam[$(elements[j]).data('table').trim() + '.' + $(elements[j]).text().trim()] = $(elements[j]).data('paramComparison')
                    scriptResult += $(elements[j]).data('template');
                    break
                default:
                    scriptResult += elements[j].outerHTML;
                    break
            }
        }
        scriptResult += '</td>';
    }
    scriptResult += '</tr>';
    scriptResult += '{{/each}}';
    scriptResult += '{{/if}}';
    settingSearchingParam();
    if (dataResultSet) paramComparisonEvent(dataResultSet);
    $(element).remove();
    $('#search-button').click();
    return scriptResult;
}

/**
 * queryList 設定查詢預設參數
 */
function settingSearchingParam() {
    $('#search-bar').find('div[data-search-bean="true"]').each(function(e) {
        var defaultValue    = $(this).data('defaultValue');
        var dataShow        = $(this).data('show');
        if (defaultValue) {
            defaultValue = dynamicForm.getSystemValue(defaultValue, null);
            switch ($(this).data('controlType')) {
                case 'text':
                    $(this).find('input[type="text"]').val(defaultValue);
                    $(this).find('input[type="text"]')[0].defaultValue = defaultValue;
                    break;
                case 'checkbox':
                case 'radio':
                    // 暫時先不支援
                    // $(this).find('input[type="text"]').val(defaultValue);
                    break;
                case 'select':
                    $(this).find('select').val(defaultValue);
                    break;
            }
        }
        if (dataShow === 'hide') {
            $(this).addClass('hide');
            if (this.previousElementSibling.tagName.toLowerCase() === 'label') {
                this.previousElementSibling.classList.add('hide');
            }
        }
    })
}

/**
 * queryList 查詢重置事件
 * ==
 * @param e
 */
function queryListResetEvent (e) {
    var formElement = $(e.target).parents('#search-bar');
    formElement.trigger('reset');
    queryListSearchEvent(e);
    // databaseModule.getResultSetList(queryListStructure,
    // function(result) {
    //     dataResultSet = result;
    //     paramComparisonEvent(dataResultSet);
    //     var cxt = template.compile(scriptHtml);
    //     var html = cxt(dataResultSet);
    //     $('#tableData tbody').html(html);
    // },
    // function(e) {console.error(e)});
}

/**
 * queryList 查詢按鈕事件
 * ==
 * 將查詢區塊 (form) 輸入資料 serializeArray
 * 重新呼叫 databaseModule.js 查詢 getResultSetList()
 * @param e {Event}
 * @param successCall {function}
 * @param errorCall {function}
 */
function queryListSearchEvent(e, successCall, errorCall) {
    var formElement = $(e.target).parents('#search-bar');
    var searchObject = formElement.serializeArray();
    var intervalGate = true;
    var lastName = '';
    var finalObject = {};
    var structure = $.extend(true, {}, queryListStructure);
    for (var i = 0, len = searchObject.length; i < len; ++i) {
        var elementName = searchObject[i].name;
        var elementValue = searchObject[i].value;
        if (elementValue === '') continue;
        var searchBeanNode = formElement.find('[name="' + elementName + '"]').parents('[data-search-bean="true"]');
        var templateName = searchBeanNode.data('template');
        var templateArray = templateName.split('.');
        var table = templateArray[0];
        var controlType = searchBeanNode.data('controlType');
        var parentElement = searchBeanNode[0];
        var childrenElement = searchBeanNode.children();
        if (controlType === 'datetime') {
            var dateType = searchBeanNode.data('dateFormat');
            if (dateType === 'datetime') {
                var timeValue = searchObject[i + 1].value;
                elementValue += ' ' + timeValue + ':00';
                i++;
            }
        }
        if (finalObject[table] === undefined) finalObject[table] = []
        finalObject[table].push({
            controlType: controlType,
            elementName: elementName,
            elementValue: elementValue,
            parentElement: parentElement,
            childrenElement: childrenElement
        })
    }
    for (var node in finalObject) {
        var whereString = '';
        var breakGate = false;
        for (var i = 0, len = finalObject[node].length; i < len; ++i) {
            var controlType = finalObject[node][i].controlType;
            var elementName = finalObject[node][i].elementName;
            var elementValue = finalObject[node][i].elementValue;
            var parentElement = finalObject[node][i].parentElement;
            var childrenElement = finalObject[node][i].childrenElement;
            switch (controlType) {
                case 'text':
                case 'radio':
                    if (whereString.length > 0) whereString += ' AND ';
                    whereString += node + "." + elementName + " = '" + elementValue + "'";
                    break;
                case 'select':
                    if (whereString.length > 0) whereString += ' AND ';
                    if (elementValue === 'all-options-selected') {
                        if (childrenElement && childrenElement.children().length > 0) {
                            whereString += node + "." + elementName + " in (";
                            for (var j = 0, len2 = childrenElement.children().length; j < len2; ++j) {
                                if (j === 0) continue;
                                if (j > 1) whereString += ',';
                                whereString += "'" + childrenElement.children()[j].value + "'";
                            }
                            whereString += ")";
                        }
                    } else
                        whereString += node + "." + elementName + " = '" + elementValue + "'";
                    break;
                case 'datetime':
                    var dateType = $(parentElement).data('dateType');
                    if (dateType === 'single') {
                        if (whereString.length > 0) whereString += ' AND ';
                        whereString += node + "." + elementName + " = '" + elementValue + "'";
                    } else if (dateType === 'interval') {
                        if (intervalGate) {
                            if (finalObject[node][i + 1] === undefined || (finalObject[node][i + 1].elementValue === elementValue) || finalObject[node][i + 1].elementName !== elementName) continue;
                            if (whereString.length > 0) whereString += ' AND ';
                            if (elementValue && elementValue.indexOf(":")===-1) {
                                elementValue += " 00:00:00.000";
                            }
                            whereString += node + "." + elementName + " >= " + (elementValue.length === 10 ? 'DATE' : 'TIMESTAMP') + " '" + elementValue + "'";
                            intervalGate = false;
                        } else {
                            if (whereString.length > 0) whereString += ' AND ';
                            if (elementValue && elementValue.indexOf(":")===-1) {
                                elementValue += " 23:59:59.999";
                            }
                            whereString += node + "." + elementName + " < " + (elementValue.length === 10 ? 'DATE' : 'TIMESTAMP') + " '" + elementValue + "'";
                            intervalGate = true;
                        }
                    }
                    break
                case 'checkbox':
                    if (lastName === elementName) {
                        whereString += " OR " + node + "." + elementName + " = '" + elementValue + "'";
                    } else {
                        if (whereString.length > 0) whereString += " AND ";
                        whereString += "(" + node + "." + elementName + " = '" + elementValue + "'";
                        lastName = elementName;
                    }
                    if (finalObject[node][i + 1] === undefined ||
                        (finalObject[node][i + 1] !== undefined && finalObject[node][i + 1].elementName !== lastName)) {
                        whereString += ")";
                        lastName = '';
                    }
                    break
            }
        }
        for (var i = 0, len = structure.database.length; i < len; ++i) {
            for (var j = 0, len2 = structure.database[i].tables.length; j < len2; ++j) {
                if (structure.database[i].tables[j].table === node) {
                    if (structure.database[i].tables[j].where === undefined) structure.database[i].tables[j].where = '';
                    if (structure.database[i].tables[j].where.length > 0) structure.database[i].tables[j].where += ' AND ';
                    structure.database[i].tables[j].where += whereString;
                    breakGate = true;
                    break;
                }
            }
            if (breakGate) break;
        }
    }
    console.log(structure)
    databaseModule.getResultSetList(structure,
    function(result) {
        dataResultSet = result;
        paramComparisonEvent(dataResultSet);
        var cxt = template.compile(scriptHtml);
        var html = cxt(dataResultSet);
        $('#tableData tbody').html(html);
        // $('#tableData').tablesorter();
        if(successCall) successCall(dataResultSet);
    },
    function(e) {
        console.error(e);
        if(errorCall) errorCall(e);
    });
}

/**
 * queryList按鈕事件監聽
 * @param {Event} e
 */
function queryListButtonEvent(e) {
    var functions = e.target.dataset.functions;
    var position = $(e.target).parents('tr').index()
    var originDataObject = window.originResultDataObject;
    if (functions) {
        try {
            functions = JSON.parse(functions);
        } catch (e) { }
        console.log(functions)
        var scriptType = functions.scriptType;
        switch (scriptType) {
            case 'guide':
                var guideRule = functions.guideRule;
                var ruleList = functions.ruleList;
                if (guideRule !== 'none') {
                    var ruleValue = originDataObject[position][guideRule]
                    for (var i = 0, len = ruleList.length; i < len; ++i) {
                        if (ruleValue === ruleList[i].ruleParam) {
                            var guideTarget = ruleList[i].guideTarget;
                            var formType = ruleList[i].formType
                            var targetUrl = ''
                            settingDynamicFormSession(ruleList[i], position)
                            switch (formType) {
                                case 'add':
                                    targetUrl = "gFormWebADD.html";
                                    break;
                                case 'upd':
                                    targetUrl = "gFormWebADD.html";
                                    break;
                                case 'list':
                                    targetUrl = "gFormWebLIST.html";
                                    break;
                                case 'print':
                                    targetUrl = "gFormWebPRINT.html";
                                    break;
                                case 'print2':
                                    targetUrl = "gFormWebPRINT2.html";
                                    break;
                            }
                            switch (guideTarget) {
                                case '_blank':
                                case '_top':
                                    var w = window.open('', guideTarget);
                                    w.location.href = location.href;
                                    w.location.href = targetUrl
                                    break
                                case 'default':
                                default:
                                    location.href = targetUrl
                                    break
                            }
                            break
                        }
                    }
                } else {
                    var guideType = ruleList[0].guideType;
                    var guideTarget = ruleList[0].guideTarget;
                    switch (guideType) {
                        case 'system':
                        case 'url':
                            var url = ruleList[0].url;
                            var urlParam = ruleList[0].urlParam;
                            var targetData = originDataObject[position];
                            var paramString = "";
                            if (urlParam) {
                                for (var i = 0, len = urlParam.length; i < len; ++i) {
                                    if (paramString.length > 0 && i % 2 == 0) paramString += '&';
                                    if (i % 2 === 0)
                                        paramString += urlParam[i] + '=';
                                    else {
                                        if (targetData[urlParam[i]])
                                            paramString += targetData[urlParam[i]];
                                        else
                                            paramString += urlParam[i];
                                    }

                                }
                            }
                            if (paramString !== "") url += "?" + paramString;
                            switch (guideTarget) {
                                case '_blank':
                                case '_top':
                                    var w = window.open(url, guideTarget);
                                    if (guideType === 'system') {
                                        var host = location.origin
                                        var system = location.pathname.split('\/')[1]
                                        w.location.href = host + '/' + system + url
                                    }
                                    break
                                case 'default':
                                default:
                                    location.href = url
                                    break
                            }
                            break;
                        case 'form':
                            var formType = ruleList[0].formType
                            var targetUrl = ''
                            settingDynamicFormSession(ruleList[0], position)
                            switch (formType) {
                                case 'add':
                                    targetUrl = "gFormWebADD.html";
                                    break;
                                case 'upd':
                                    targetUrl = "gFormWebADD.html";
                                    break;
                                case 'list':
                                    targetUrl = "gFormWebLIST.html";
                                    break;
                                case 'print':
                                    targetUrl = "gFormWebPRINT.html";
                                    break;
                                case 'print2':
                                    targetUrl = "gFormWebPRINT2.html";
                                    break;
                            }
                            switch (guideTarget) {
                                case '_blank':
                                case '_top':
                                    var w = window.open('', guideTarget);
                                    w.location.href = location.href;
                                    w.location.href = targetUrl
                                    break
                                case 'default':
                                default:
                                    location.href = targetUrl
                                    break
                            }
                            break;
                    }
                }
                break;
        }
    }
}

function settingDynamicFormSession(formObject, index) {
    var source = formObject.source;
    var formType = formObject.formName;
    var sourceId = dataResultSet[index][source];
    var frameModel = "gFormWeb";
    var page = "ADD";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"]			= formType;
    //設定此page的對應功能頁面
    window.localStorage["gFormWeb"+page+"_frameModel"]		    = frameModel + page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"]	    = frameModel + page + "_INIT";
    window.localStorage["gFormWeb"+page+"_sourceId"]			= sourceId;
    page = "LIST";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"]			= formType;
    //設定此page的對應功能頁面
    window.localStorage["gFormWeb"+page+"_frameModel"]		    = frameModel + page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"]	    = frameModel + page + "_INIT";
    window.localStorage["gFormWeb"+page+"_sourceId"]			= sourceId;
    page = "UPD";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"]			= formType;
    //設定此page的對應功能頁面
    window.localStorage["gFormWeb"+page+"_frameModel"]		    = frameModel + page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"]	    = frameModel + page + "_INIT";
    window.localStorage["gFormWeb"+page+"_sourceId"]			= sourceId;
    page = "PRINT";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"] 		    = formType;
    //設定此page的對應功能頁面
    window.localStorage["gFormWeb"+page+"_frameModel"] 		    = frameModel+page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"] 	= frameModel+page+"_INIT";
    window.localStorage["gFormWeb"+page+"_sourceId"] 		    = sourceId;
    page = "PRINT2";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"] 		    = formType;
    //設定此page的對應功能頁面
    window.localStorage["gFormWeb"+page+"_frameModel"] 		    = frameModel+page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"] 	= frameModel+page+"_INIT";
    window.localStorage["gFormWeb"+page+"_sourceId"] 		    = sourceId;

    var repplyCaseNo = "CICCASE.PCASENO";
    window.localStorage["repplyCaseNo"]= dataResultSet[index][repplyCaseNo];
    var repplyHistnum = "CICCASE.PHISTNUM";
    window.localStorage["repplyHistnum"]= dataResultSet[index][repplyHistnum];
}

/**
 * 替換對照參數值
 * ==
 * @param originData
 */
function paramComparisonEvent(originData) {
    for (var i = 0, len = originData.length; i < len; ++i) {
        for (var node in fullyQlParam) {
            if (originData[i][node] !== undefined) {
                var paramValue = fullyQlParam[node];
                var dataValue = originData[i][node];
                if (!dataValue) continue
                if (typeof dataValue !== 'string') dataValue = dataValue.toString()
                try {
                    paramValue = JSON.parse(paramValue)
                } catch (e) { }
                for (var j = 0, len2 = paramValue.length; j < len2; ++j) {
                    dataValue = dataValue.replace(paramValue[j], paramValue[j + 1]);
                    j++;
                }
                originData[i][node] = dataValue;
            }
        }
    }
}

/**
 * queryList 日期控件綁定
 * @param element
 */
function datetimeToolRefresh(element) {
	var value = $(element).val() || '';
	var block = $(element).parents('[data-control-type="datetime"]')
    var type = $(block).data('dateType')
    var format = $(block).data('dateFormat')
    var defaultDate = $(block).data('defaultDate') || '-0y-0M-0d';
    var defaultDate2 = $(block).data('defaultDate2') || '-0y-0M-0d';
    var d1 = new Date().setDefaultDate('{' + defaultDate + '}', "yyyy-MM-dd")
    var t1 = new Date().setDefaultDate('{' + defaultDate + '}', "HH-mm")
    var d2 = new Date().setDefaultDate('{' + defaultDate2 + '}', "yyyy-MM-dd")
    var t2 = new Date().setDefaultDate('{' + defaultDate2 + '}', "HH-mm")
    var typeObject = {
        minView: 3,
        maxView: 4
    }
	$(element).data('date-autoclose', true);
	$(element).datetimepicker('remove');
	if (type === 'single') {
        if (format === 'date') {
            $(element).datetimepicker(typeObject);
            $(element).val(d1);
        } else if (format === 'datetime') {
            if ($(element).hasClass('dateInput')) {
                $(element).datetimepicker(typeObject);
                $(element).val(d1);
            } else if ($(element).hasClass('timeInput')) {
                typeObject.startView = 1
                typeObject.minView = 1
                typeObject.maxView = 2
                $(element).datetimepicker(typeObject);
                $(element).val(t1);
            }
        }
    } else if (type === 'interval') {
	    if (format === 'date') {
	        $(element).datetimepicker(typeObject);
            if ($(element).index() === 0) $(element).val(d1);
            else if ($(element).index() === 2) $(element).val(d2);
        } else if (format === 'datetime') {
            if ($(element).hasClass('dateInput') && $(element).index() === 0) {
                $(element).datetimepicker(typeObject);
                $(element).val(d1);
            } else if ($(element).hasClass('timeInput') && $(element).index() === 1) {
                typeObject.startView = 1
                typeObject.minView = 0
                typeObject.maxView = 1
                $(element).datetimepicker(typeObject);
                $(element).val(t1);
            } else if ($(element).hasClass('dateInput') && $(element).index() === 3) {
                $(element).datetimepicker(typeObject);
                $(element).val(d2);
            } else if ($(element).hasClass('timeInput') && $(element).index() === 4) {
                typeObject.startView = 1
                typeObject.minView = 0
                typeObject.maxView = 1
                $(element).datetimepicker(typeObject);
                $(element).val(t2);
            }
        }
    }

	$(element).datetimepicker('show');
	$(element).datetimepicker('hide');
}

/**
 * 從url獲取查詢條件
 * @param queryListStructure {Object}
 */
function addUrlParameters(queryListStructure){

    // 避免修改原有參數
    var newQueryListStructure = queryListStructure
    // 獲取localStorage中儲存的url參數
    var urlParameters = JSON.parse(window.localStorage['gForm.jsp_url_parameters'+multiLevel])
    // 是否有獲取到參數
    if (urlParameters != undefined && urlParameters['queryParams'] != undefined &&urlParameters['queryParams'] != '') {
        // 將參數解碼
        queryParams = JSON.parse(decodeURIComponent(urlParameters.queryParams))
        // 準備拼湊sql字段
        newSqlStatement = ""

        // 將參數轉換為sql語法
        queryParams.forEach(function(queryParam) {
            // 參數名
            var queryKey = Object.keys(queryParam);
            //參數值
            var queryValue = queryParam[queryKey]

            // 如果參數不為空
            if (queryValue !== "") {
                // 如果已經有搜尋條件 + AND
                if (newSqlStatement != "") {
                    newSqlStatement += " AND "
                }
                // 將拼成sql語法的參數放入字段
                newSqlStatement += queryKey + queryValue
            }
        })

        // 如果有拼出sql語法
        if (newSqlStatement !== "" || newSqlStatement !== undefined){
            // 避免queryListStructure有undefined
            if (newQueryListStructure && newQueryListStructure.database[0] && newQueryListStructure.database[0] && newQueryListStructure.database[0].tables[0]) {
                newQueryListStructure.database[0].tables[0].where = newSqlStatement
            }
        }
    }
    return newQueryListStructure
}