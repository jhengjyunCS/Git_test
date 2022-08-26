var formFile = new Fn_formFile()
var objApi
//gForm
var gForm = null, gForms = [], gFormJS = null, thisPageStatus = 'ADD', gForm_Title = null

function Fn_formFile() {
    this.apiModule = null;
    //設定值
    this.setValue = function(node, v) {
        this.apiModule[node] = (typeof v === 'string') ? v.trim() : v;
    }
    //設定執行模式 runMode
    this.setValueRunMode = function() {
        let runMode = []
        $('#div-environment-runMode').find(':checked').each(function(){
            runMode.push(this.value)
        })
        this.setValue('runMode', runMode)
    }
    //設定調用api方式 sendMethod
    this.setValueSendMethod = function(sendMethod) {
        this.setValue('sendMethod', sendMethod)
        $drawPageNormal = $('#drawPageNormal')
        $drawPageNormal.find('.btn-check[name="rdo_method"]').removeAttr('disabled')
        $drawPageNormal.find('.btn-check[name="rdo_contentType"]').removeAttr('disabled')
        $drawPageNormal.find('.btn-check[name="rdo_async"]').removeAttr('disabled')
        $drawPageNormal.find('.btn-check[name="rdo_dataType"]').removeAttr('disabled')
        $drawPageNormal.find('#div_domain_url').show()

        //拋轉gForm的話要給預設值
        if (['apiTransAddOrUpdateGForm', 'apiTransDeleteGForm'].indexOf(sendMethod)>-1) {
            $drawPageNormal.find('.btn-check[name="rdo_method"][value="POST"]').click()
            $drawPageNormal.find('.btn-check[name="rdo_method"]').attr('disabled', 'disabled')
            $drawPageNormal.find('.btn-check[name="rdo_contentType"][value="application/json; charset=utf-8"]').click()
            $drawPageNormal.find('.btn-check[name="rdo_contentType"]').attr('disabled', 'disabled')
            $drawPageNormal.find('.btn-check[name="rdo_async"][value="true"]').click()
            $drawPageNormal.find('.btn-check[name="rdo_async"]').attr('disabled', 'disabled')
            $drawPageNormal.find('.btn-check[name="rdo_dataType"][value="json"]').click()
            $drawPageNormal.find('.btn-check[name="rdo_dataType"]').attr('disabled', 'disabled')
            $drawPageNormal.find('#div_domain_url').hide()

            //設定 sendParam
            let newSendParam = {
                "parentFormId": {
                    "value": "a443129d-4a75-4a19-b9a7-986a8c8cca4b",
                    "type": "string",
                    "desc": "*父層表單ID",
                    "source": "gFormData:formId"
                },
                "api-formType": {
                    "value": "CTHNoteApply",
                    "type": "string",
                    "desc": "*表單類型",
                    "source": "fixed:yourFormType"
                },
                "api-sourceId": {
                    "value": "10905090001",
                    "type": "string",
                    "desc": "*病歷號、住院號、個案號....\n",
                    "source": "local:caseNo"
                },
                "api-status": {
                    "value": "Y",
                    "type": "string",
                    "desc": "狀態\n",
                    "ui-value": "Y|,|N",
                    "ui-desc": "正式|,|暫存",
                    "source": "fixed:Y"
                }
            }
            formFile.apiModule.sendParam = $.extend(true, newSendParam, formFile.apiModule.sendParam)
            //gForm-拋轉 (刪除)  apiTransDeleteGForm 只需要3個參數
            if (sendMethod==='apiTransDeleteGForm') {
                formFile.apiModule.sendParam = {
                    "parentFormId": formFile.apiModule.sendParam.parentFormId,
                    "api-formType": formFile.apiModule.sendParam['api-formType'],
                    "api-sourceId": formFile.apiModule.sendParam['api-sourceId']
                }
            }

            //設定 receiveParam
            let newReceiveParam = {
                "resultMsg": {
                    "value": {
                        "success": {
                            "value": true,
                            "type": "boolean",
                            "desc": "是否成功",
                            "ui-value": "true|,|false",
                            "ui-desc": "拋轉成功|,|拋轉失敗",
                            "is-check": true,
                            "check-type": "success|,|error"
                        },
                        "message": {
                            "value": "拋轉(更新)表單成功(formType=CTHNoteApply, sourceId=10905090001, parentFormId=test123, formId=125beaa4-34f4-499c-9fbe-456645ed3233)",
                            "type": "string",
                            "desc": "訊息",
                            "is-check-message": true
                        }
                    },
                    "type": "object",
                    "desc": "調用結果",
                    "is-bean": true
                }
            }
            formFile.apiModule.receiveParam = $.extend(true, newReceiveParam, formFile.apiModule.receiveParam)
        }else if (['xmlApi'].indexOf(sendMethod)>-1) {
            //調用xmlApi的話要給預設值
            $drawPageNormal.find('.btn-check[name="rdo_method"][value="POST"]').click()
            $drawPageNormal.find('.btn-check[name="rdo_method"]').attr('disabled', 'disabled')
            $drawPageNormal.find('.btn-check[name="rdo_contentType"][value="application/json; charset=utf-8"]').click()
            $drawPageNormal.find('.btn-check[name="rdo_contentType"]').attr('disabled', 'disabled')
            $drawPageNormal.find('.btn-check[name="rdo_async"][value="true"]').click()
            $drawPageNormal.find('.btn-check[name="rdo_async"]').attr('disabled', 'disabled')
            $drawPageNormal.find('.btn-check[name="rdo_dataType"][value="json"]').click()
            $drawPageNormal.find('.btn-check[name="rdo_dataType"]').attr('disabled', 'disabled')
            $drawPageNormal.find('#div_domain_url').hide()

            //設定 sendParam
            let newSendParam = {
                "configFiles": {
                    "value": [],
                    "type": "array",
                    "desc": "調用xml方法(method.xml)\n"
                },
                "params": {}
            }
            formFile.apiModule.sendParam = $.extend(true, newSendParam, formFile.apiModule.sendParam)

            //設定 receiveParam
            let newReceiveParam = {
                "resultMsg": {
                    "value": {
                        "code":    {
                            "value":      "000000",
                            "type":       "string",
                            "ui-value":   "000000|,|E00001|,|E00002|,|E00003|,|E00004|,|E00005|,|E00006|,|E00007|,|E00008|,|E00999|,|S00001",
                            "ui-desc":    "查詢成功|,|傳參問題|,|連線問題|,|查詢資料問題|,|新增資料問題|,|更新資料問題|,|刪除資料問題|,|權限問題|,|資料邏輯不符規則|,|其他錯誤|,|(可繼續執行之狀況) 傳參問題",
                            "is-check":   true,
                            "check-type": "success|,|error|,|error|,|error|,|error|,|error|,|error|,|error|,|error|,|error|,|success"
                        },
                        "message": {
                            "value":            "查詢成功",
                            "is-check-message": true
                        }
                    }
                },
                "result": {
                    "value": {},
                    "type": "object",
                    "desc": "回傳值",
                    "is-bean": true
                }
            }
            formFile.apiModule.receiveParam = $.extend(true, newReceiveParam, formFile.apiModule.receiveParam)
        }else if (formFile.apiModule.sendParam){
            //刪除多餘的節點
            delete formFile.apiModule.sendParam.parentFormId
            delete formFile.apiModule.sendParam['api-formType']
            delete formFile.apiModule.sendParam['api-sourceId']
            delete formFile.apiModule.sendParam['api-status']
        }
    }
    //設定 網域 domain / API路徑 url
    this.setValueDomainUrl = function() {
        let domainJson = {}, urlJson = {}
        $('#div_domain_url').find('.var').each(function(){
            let variable = this.innerHTML.trim()
            let domain = $(this).next().html().trim()
            let url = $(this).next().next().html().trim()
            if (variable!='' || domain!='' || url!='') {
                domainJson[variable] = domain
                urlJson[variable] = url
            }
        })
        this.setValue('domain', domainJson)
        this.setValue('url', urlJson)
    }
    //取得gForm
    this.getGform = function(){
        if (!this.apiModule) {
            $('#modal_alert_msg').html('請先「開新表單」 or 「開啟舊檔」')
            $('#modal_alert').modal('show')
            return false;
        }

        //儲存當前模式的資料
        this.setValueNowMode()

        let gFormJS = nursing.createGForm()
        gFormJS.sourceId = this.apiModule.sourceId
        gFormJS.formType = this.apiModule.formType
        gFormJS.formId = this.apiModule.formId
        gFormJS.status = 'Y'
        gFormJS.formVersionId = 'noFormVersionId'
        gFormJS.evaluationTime = new Date().format('yyyy/MM/dd HH:mm:ss')
        gFormJS.versionNo = 1
        gFormJS.creatorId = 'csApiDefineUser'
        gFormJS.creatorName = 'csApiDefineUser'
        gFormJS.modifyUserId = 'csApiDefineUser'
        gFormJS.modifyUserName = 'csApiDefineUser'
        gFormJS.searchParamGF.sourceId = gFormJS.sourceId
        gFormJS.searchParamGF.userId = gFormJS.creatorId
        gFormJS.searchParamGF.userName = gFormJS.creatorName
        gFormJS.searchParamGF.formType = gFormJS.formType

        //API名稱
        gFormJS.gformItemMap.apiName = {
            'itemKey': 'apiName',
            'itemValue': this.apiModule.apiName
        }

        //API中文敘述
        gFormJS.gformItemMap.apiDescription = {
            'itemKey': 'apiDescription',
            'itemValue': this.apiModule.apiDescription
        }

        //執行模式
        gFormJS.gformItemMap.runMode = {
            'itemKey': 'runMode',
            'itemValue': this.apiModule.runMode.join(',')
        }

        //調用api方式
        gFormJS.gformItemMap.sendMethod = {
            'itemKey': 'sendMethod',
            'itemValue': this.apiModule.sendMethod
        }

        //網域
        gFormJS.gformItemMap.domain = {
            'itemKey': 'domain',
            'itemValue': JSON.stringify(this.apiModule.domain)
        }

        //API路徑
        gFormJS.gformItemMap.url = {
            'itemKey': 'url',
            'itemValue': JSON.stringify(this.apiModule.url)
        }

        //方法
        gFormJS.gformItemMap.method = {
            'itemKey': 'method',
            'itemValue': this.apiModule.method
        }

        //傳入參數類型
        gFormJS.gformItemMap.contentType = {
            'itemKey': 'contentType',
            'itemValue': this.apiModule.contentType
        }

        //同步/非同步
        gFormJS.gformItemMap.async = {
            'itemKey': 'async',
            'itemValue': this.apiModule.async
        }

        //接收參數類型
        gFormJS.gformItemMap.dataType = {
            'itemKey': 'dataType',
            'itemValue': this.apiModule.dataType
        }

        //傳入參數(For Api)
        gFormJS.gformItemMap.sendParam = {
            'itemKey': 'sendParam',
            'itemValue': JSON.stringify(this.apiModule.sendParam)
        }

        //轉換傳入參數
        gFormJS.gformItemMap.sendReplacing = {
            'itemKey': 'sendReplacing',
            'itemValue': JSON.stringify(this.apiModule.sendReplacing)
        }

        //傳入參數前處理
        gFormJS.gformItemMap.sendPreProcessing = {
            'itemKey': 'sendPreProcessing',
            'itemValue': JSON.stringify(this.apiModule.sendPreProcessing)
        }

        //輸出資料前處理
        gFormJS.gformItemMap.receivePreProcessing = {
            'itemKey': 'receivePreProcessing',
            'itemValue': JSON.stringify(this.apiModule.receivePreProcessing)
        }

        //輸出資料
        gFormJS.gformItemMap.receiveParam = {
            'itemKey': 'receiveParam',
            'itemValue': JSON.stringify(this.apiModule.receiveParam)
        }

        //轉換輸出資料
        gFormJS.gformItemMap.receiveReplacing = {
            'itemKey': 'receiveReplacing',
            'itemValue': JSON.stringify(this.apiModule.receiveReplacing)
        }

        return gFormJS;
    }

    /**
     * 檔案 -> 開新表單
     * 新建表單功能
     */
    this.newForm = function() {
        let $tarObj = $("#modal_newForm")
        $tarObj.modal('show')
    }

    /**
     * 檔案 -> 開新表單 -> 新增
     * @returns {boolean}
     */
    this.newForm_btn = function(){
        let sourceId=   $('#modal_newForm_sourceId').val()
        let apiName=   $('#modal_newForm_apiName').val()
        let apiDescription=   $('#modal_newForm_apiDescription').val()
        if (!sourceId){
            $('#modal_alert_msg').html('請填寫 醫院(sourceID)')
            $('#modal_alert').modal('show')
            return false
        }
        if (!apiName){
            $('#modal_alert_msg').html('請填寫 API名稱(apiName)')
            $('#modal_alert').modal('show')
            return false
        }
        if (!apiDescription){
            $('#modal_alert_msg').html('請填寫 API中文敘述(apiDescription)')
            $('#modal_alert').modal('show')
            return false
        }
        $('#modal_newForm').modal('hide')

        this.apiModule = nursing.createApiModule()
        this.apiModule.sourceId = sourceId
        this.apiModule.apiName = apiName
        this.apiModule.apiDescription = apiDescription

        //切換至環境參數
        $('#materialList').find('.switchMode-div:eq(1)').click()
        //顯示api參數
        $('#li-environment').click()
    }

    /**
     * 檔案 -> 開啟舊檔
     */
    this.openForm = function(historyIdx) {
        let $thead = $('#modal_gFormList_thead')
        $thead.find('.historyRec').addClass('hide')
        let $tbody = $('#modal_gFormList_tbody')
        $tbody.empty()
        //查詢參數
        let gFormJS = nursing.createGForm()
        gFormJS.searchParamGF.status = 'Y'
        gFormJS.searchParamGF.formType = 'propAPIListForm'
        gFormJS.searchParamGF.itemCondition = ''
        //歷次紀錄
        if (historyIdx || historyIdx===0){
            $thead.find('.historyRec').removeClass('hide')
            let form = gForms[historyIdx].gForm
            delete gFormJS.searchParamGF.status
            gFormJS.searchParamGF.statusArr = ['Y', 'N', 'D']
            gFormJS.searchParamGF.sourceId = form.sourceId
            gFormJS.searchParamGF.formId = form.formId
        }

        //取得資料
        gFormJS.getGFormListWithConditionPlus(gFormJS, function(result){
            gForms = result
            console.log('=====gForms')
            console.log(gForms)
            let $modal = $('#modal_gFormList')
            $modal.modal('show')
            for (let i=0, len=gForms.length; i<len; ++i){
                let form = gForms[i].gForm
                let map = form.gformItemMap
                map.getValue = function(key) { return (this[key]) ? this[key].itemValue : ''}
                let $tr = $(`
                    <tr class="text-center">
                        <td>${i+1}</td>
                        <td>${form.sourceId}</td>
                        <td>${map.getValue('apiName')}</td>
                        <td>${map.getValue('apiDescription')}</td>
                        <td>${map.getValue('runMode').replace('F', '前').replace('M', '中').replace('BY', '後(正式)').replace('B', '後').replace('D', '後(刪除)')}</td>
                        <td class="historyRec hide">${new Date(form.evaluationTime).format('yyyy/MM/dd HH:mm')}</td>
                        <td>
                            <button class="btn btn-success" type="button" onclick="formFile.chooseThisForm(${i}); return false">選擇</button>
                            <button class="btn btn-success historyBtn" type="button" onclick="formFile.openForm(${i}); return false">歷次紀錄</button>
                            <button class="btn btn-success historyBtn" type="button" onclick="formFile.deleteForm(${i}); return false">刪除</button>
                        </td>
                    </tr>
                `)
                $tbody.append($tr)
            }
            //歷次紀錄
            if (historyIdx || historyIdx===0) {
                $tbody.find('.historyRec').removeClass('hide')
                $tbody.find('.historyBtn').hide()
            }
        }, function(e){
            $('#modal_alert_msg').html('發生錯誤')
            $('#modal_alert').modal('show')
            console.error(e)
        })
    }

    /**
     * #取得get參數直接開啟api表單
     * formId - 表單ID - 若查無id則直接新增(但不儲存)
     *
     * sourceId - 醫院名稱
     *
     * apiName - api名稱
     *
     * apiDescription - api中文描述
     */
    this.openFormByGetParam = function() {
        let getFormId = eNursing.getUrlParameter("formId")
        let getSourceId = eNursing.getUrlParameter("sourceId")
        let getApiName = eNursing.getUrlParameter("apiName")
        let getApiDescription = eNursing.getUrlParameter("apiDescription")
        console.log(`getFormId============${getFormId}`)
        console.log(`getSourceId============${getSourceId}`)
        console.log(`getApiName============${getApiName}`)
        console.log(`getApiDescription============${getApiDescription}`)

        //查詢參數
        let gFormJS = nursing.createGForm()
        gFormJS.searchParamGF.status = 'Y'
        gFormJS.searchParamGF.formType = 'propAPIListForm'
        gFormJS.searchParamGF.formId = getFormId
        gFormJS.searchParamGF.itemCondition = ''
        //取得資料
        gFormJS.getGFormListWithConditionPlus(gFormJS, function(result){
            gForms = result
            console.log('=====gForms')
            console.log(gForms)
            //開啟舊檔
            if (gForms.length>0) {
                formFile.chooseThisForm(0)
            }
            //新增
            else {
                formFile.apiModule = nursing.createApiModule()
                formFile.apiModule.formId = getFormId
                formFile.apiModule.sourceId = getSourceId
                formFile.apiModule.apiName = getApiName
                formFile.apiModule.apiDescription = getApiDescription

                //切換至環境參數
                $('#materialList').find('.switchMode-div:eq(1)').click()
                //顯示api參數
                $('#li-environment').click()
            }
        }, function(e){
            $('#modal_alert_msg').html('取得api發生錯誤')
            $('#modal_alert').modal('show')
            console.error(`formId=${getFormId}`, e)
        })
    }

    /**
     * 檔案 -> 開啟舊檔 -> 選擇
     */
    this.chooseThisForm = function(idx) {
        gForm = $.extend(true, {}, gForms[idx].gForm)
        //復原nowMode以免誤判
        this.nowMode = ''
        //設定值
        this.apiModule = nursing.createApiModule()
        this.apiModule.fn.setApiModule(gForm)
        //切換至環境參數
        $('#materialList').find('.switchMode-div:eq(1)').click()
        //顯示api參數
        $('#li-environment').click()
        $('#modal_gFormList').modal('hide')
    }


    /**
     * 檔案 -> 開啟舊檔 -> 刪除
     */
    this.deleteForm = function(idx) {
        //刪除 (表單主鍵 oldFormId)
        let delGForm = gForms[idx].gForm;
        let gFormJS = nursing.createGForm()
        gFormJS.leftJoin(delGForm);
        gFormJS.deleteGForm(gFormJS, function() {
            $('#modal_gFormList').modal('hide')
            formFile.openForm()
        }, function(e) {
            alert('發生錯誤!')
            console.error(e)
        });
    }

    /**
     * 檔案 -> 儲存表單
     * @param {Boolean} modal [如不需要彈窗則不用填參數]
     * @returns {Boolean} true
     */
    this.saveForm = function(modal) {
        //取得gForm
        let gFormJS = this.getGform()
        if (!gFormJS) {
            return;
        }
        if (gFormJS.formId) {
            thisPageStatus = 'UPD'
        } else {
            thisPageStatus = 'ADD'
        }
        gFormJS = gFormJS.setGFormItems(gFormJS)
        gFormJS.addOrUpdateGForm(gFormJS, function(gForms){
            console.log(gForms)
            gForm = gForms[0].gForm
            formFile.apiModule.formId = gForm.formId
        }, function(e){
            $('#modal_alert_msg').html('發生錯誤')
            $('#modal_alert').modal('show')
            console.error(e)
        })
        return true
    }

    /**
     * 說明 -> 程式註解
     */
    this.showCodeAnnotation = function() {
        if(!gForm) {
            $('#modal_alert_msg').html('請先「開新表單」 or 「開啟舊檔」')
            $('#modal_alert').modal('show')
        }else{
            // 縮排階層
            let level = 0;
            // 註解內容
            let annotation = ""
            let $tarObj = $("#modal_codeAnnotation")
            //codemirror 文字編輯器
            $tarObj.off('shown.bs.modal')
            $tarObj.on('shown.bs.modal', function () {

                if (!formFile.csApiDefineCodeMirror){
                    formFile.csApiDefineCodeMirror = CodeMirror.fromTextArea(document.getElementById('propCodeAnnotation_editor'), {
                        mode: "application/ld+json",
                        lineNumbers: true,
                        lineWrapping: true,
                        theme: "monokai",
                        viewportMargin: Infinity
                    });
                }
                var gformItemMap = gForm.gformItemMap
                if(gformItemMap == undefined){
                    formFile.csApiDefineCodeMirror.setValue("");
                }else{
                    createAnnotation(gformItemMap);
                    formFile.csApiDefineCodeMirror.setValue(annotation);
                }

                // 產生註解
                function createAnnotation(gformItemMap){
                    // api名稱
                    var apiName = gformItemMap.apiName.itemValue;
                    // api描述
                    var apiDesc = gformItemMap.apiDescription.itemValue;
                    // 調用api方法
                    var sendMethod = gformItemMap.sendMethod.itemValue;
                    // 方法
                    var method = gformItemMap.method.itemValue
                    // 執行模式
                    var runMode = gformItemMap.runMode.itemValue
                    // 執行模式對應名稱
                    var runModeMap = {
                        "F":"表單前帶值",
                        "M":"表單中查詢",
                        "B":"表單後拋轉",
                        "BY":"表單正式保存後拋轉",
                        "D":"表單刪除後拋轉",
                        "DY":"表單正式刪除後拋轉"
                    }
                    // 執行模式描述
                    var runModeDesc = runModeMap[runMode] !== undefined? runModeMap[runMode] : "";

                    // api url
                    var url = JSON.parse(gForm.gformItemMap.url.itemValue)
                    annotation += "/**";
                    annotation += "\n";

                    // 範例值: [httpJson/POST] transToPatientProps (入評拋轉Patient_Props): 表單正式保存後拋轉
                    annotation += ` ## [${sendMethod}/${method}] ${apiName} (${apiDesc}): ${runModeDesc}`
                    for(const key in url){
                        annotation += "\n";
                        annotation += ` ### ${key}: ${url[key]}`
                    }
                    annotation += "\n";
                    annotation += "<pre>";
                    annotation += "\n";
                    // 傳入參數
                    var sendParam = JSON.parse(gformItemMap.sendParam.itemValue)
                    createApiAnnotation(sendParam);
                    annotation += "</pre>";
                    annotation += "\n";
                    annotation += " */";
                }


                // 依照api參數產生註解
                // 產生範例: "patientid": {string} 病歷號 test1234
                function createApiAnnotation(obj){
                    // 下挖時增加縮排
                    level++
                    for(const key in obj){
                        annotation += " * "
                        // 依照階層產生縮排
                        for(var l = level; l> 1; l--){
                            annotation += `\t`
                        }
                        // 如果為object則下挖一層
                        if( obj[key].type === "object"){
                            annotation +=`"${key}": {${obj[key].type}} ${obj[key].desc!==undefined? obj[key].desc: "範例值說明"} "{`
                            annotation += `\n`
                            //下挖
                            createApiAnnotation(obj[key].value)
                            // 依照階層產生縮排
                            annotation += " * "
                            for(l = level-1; l> 1; l--){
                                annotation += `\t`
                            }
                            annotation += `}"`
                            annotation += `\n`

                            //下挖完成後退回原縮排
                            level--
                        }else {
                            annotation += `"${key}": {${obj[key].type}} ${obj[key].desc!==undefined? obj[key].desc: "範例值說明"} ${obj[key].value}`
                            annotation += `\n`
                        }
                    }
                }
            })
            $tarObj.modal('show')
        }
    }

    /**
     * 說明 -> 連線參數
     */
    this.showConnectProperties = function() {
        let modelTitle = '#modal_title_'
        let modelLabel = '#modal_label_'
        if (const_socketEnable) {
            $(modelTitle+'const_socketUrl').show()
            $(modelLabel+'const_socketUrl').html(const_socketUrl)
        }else{
            $(modelTitle+'const_socketUrl').hide()
        }
        if (const_webserviceEnable) {
            $(modelTitle+'const_webserviceUrl').show()
            $(modelLabel+'const_webserviceUrl').html(const_webserviceUrl)
        }else{
            $(modelTitle+'const_webserviceUrl').hide()
        }
        $(modelLabel+'const_gformServiceUrl').html(const_gformServiceUrl)

        let $tarObj = $("#modal_connectProperties")
        $tarObj.modal('show')
    }

    this.csApiDefineCodeMirror = null
    /**
     * 說明 -> csApiDefine物件
     */
    this.showCsApiDefineProperties = function() {
        let $tarObj = $("#modal_csApiDefineProperties")
        let gFormJS = this.getGform()
        if (!gFormJS) {
            return;
        }
        //codemirror 文字編輯器
        $tarObj.off('shown.bs.modal')
        $tarObj.on('shown.bs.modal', function () {
            if (!formFile.csApiDefineCodeMirror){
                formFile.csApiDefineCodeMirror = CodeMirror.fromTextArea(document.getElementById('propCsApiDefine_editor'), {
                    mode: "application/ld+json",
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: "monokai",
                    viewportMargin: Infinity
                });
            }
            formFile.csApiDefineCodeMirror.setValue(syntaxHighlight(gFormJS))
        })

        $tarObj.modal('show')
        //格式化json
        function syntaxHighlight(json) {
            if (typeof json != 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                return match;
            });
        }
    }
    /**
     * 說明 -> csApiDefine物件 -> 關閉
     */
    this.showCsApiDefinePropertiesOnClose = function() {
        let new_gForm
        //取得新的csApiDefine物件
        try{
            new_gForm = JSON.parse(formFile.csApiDefineCodeMirror.getValue())
            //設定值
            this.apiModule.fn.setApiModule(new_gForm);

            //切換至環境參數
            $('#materialList').find('.switchMode-div:eq(1)').click()
            //顯示api參數
            $('#li-environment').click()
        }catch(e){
            $('#modal_alert_msg').html('JSON格式有錯')
            $('#modal_alert').modal('show')
            return;
        }
    }
    /**
     * localStroeage管理
     */
    this.localStorageProp = new fn_localStorageProp()
    function fn_localStorageProp(){
        this.ConstModifyTr = `
            <tr class="text-center">
                <td><input type="text" class="form-control modal_localStorage_modify_paramName" placeholder="參數名" value="" onkeyup="formFile.localStorageProp.modifyParamOnKeyUp(this)"></td>
                <td><input type="text" class="form-control modal_localStorage_modify_example" placeholder="範例值" value=""></td>
                <td><input type="text" class="form-control modal_localStorage_modify_remark" placeholder="備註說明" value=""></td>
                <td><input type="text" class="form-control modal_localStorage_modify_whenSetting" placeholder="設定時機" value=""></td>
            </tr>
        `
        this.gFormJS = null
        this.gFormList = []
        /**
         * 說明 -> localStorage管理
         */
        this.showList = function(historyIdx) {
            let $tarObj = $("#modal_localStorage")
            let $tbody = $('#modal_localStorage_tbody')
            $tbody.empty()
            //查詢參數
            let gFormJS = nursing.createGForm()
            gFormJS.searchParamGF.status = 'Y'
            gFormJS.searchParamGF.formType = 'propLocalStorage'
            gFormJS.searchParamGF.itemCondition = ''
            //歷次紀錄
            if (historyIdx || historyIdx===0){
                let form = formFile.localStorageProp.gFormList[historyIdx].gForm
                delete gFormJS.searchParamGF.status
                gFormJS.searchParamGF.statusArr = ['Y', 'N', 'D']
                gFormJS.searchParamGF.sourceId = form.sourceId
                gFormJS.searchParamGF.formId = form.formId
            }

            //取得資料
            this.gFormList = []
            gFormJS.getGFormListWithConditionPlus(gFormJS, function(result){
                formFile.localStorageProp.gFormList = result
                let gForms = formFile.localStorageProp.gFormList
                console.log('=====gForms')
                console.log(gForms)
                for (let i=0, len=gForms.length; i<len; ++i){
                    let form = gForms[i].gForm
                    let map = form.gformItemMap
                    map.getValue = function(key) { return (this[key]) ? this[key].itemValue : ''}
                    let $tr = $(`
                        <tr class="text-center">
                            <td>${i+1}</td>
                            <td>${form.sourceId}</td>
                            <td>${new Date(form.evaluationTime).format('yyyy/MM/dd HH:mm')}</td>
                            <td>
                                <button class="btn btn-success" type="button" onclick="formFile.localStorageProp.showModify(formFile.localStorageProp.gFormList[${i}].gForm); return false">選擇</button>
                                <button class="btn btn-success historyBtn" type="button" onclick="formFile.localStorageProp.showList(${i}); return false">歷次紀錄</button>
                                <button class="btn btn-success historyBtn" type="button" onclick="formFile.localStorageProp.delete(formFile.localStorageProp.gFormList[${i}].gForm); return false">刪除</button>
                            </td>
                        </tr>
                    `)
                    $tbody.append($tr)
                }
                //歷次紀錄
                if (historyIdx || historyIdx===0) {
                    $tbody.find('.historyRec').removeClass('hide')
                    $tbody.find('.historyBtn').hide()
                }
            }, function(e){
                $('#modal_alert_msg').html('發生錯誤')
                $('#modal_alert').modal('show')
                console.error(e)
            })

            $tarObj.modal('show')
        }

        /**
         * 說明 -> localStorage管理-新增/修改
         * @param gForm - 'add' || object
         */
        this.showModify = function(gForm) {
            $("#modal_localStorage").modal('hide')
            let $tarObj = $("#modal_localStorage_modify")
            $tarObj.find('.btn').removeAttr('disabled')
            this.gFormJS = nursing.createGForm()
            //add走全新表單
            if (gForm==='add') {
                this.gFormJS.sourceId = ''
                this.gFormJS.formType = 'propLocalStorage'
                this.gFormJS.formId = null
                this.gFormJS.status = 'Y'
                this.gFormJS.formVersionId = 'noFormVersionId'
                this.gFormJS.creatorId = 'csApiDefineUser'
                this.gFormJS.creatorName = 'csApiDefineUser'
                this.gFormJS.modifyUserId = 'csApiDefineUser'
                this.gFormJS.modifyUserName = 'csApiDefineUser'
            }
            //upd走賦值
            else{
                this.gFormJS.leftJoin(gForm)
                this.gFormJS.setGFormItemMap(this.gFormJS)
            }
            this.gFormJS.versionNo = 1
            this.gFormJS.evaluationTime = new Date().format('yyyy/MM/dd HH:mm:ss')
            this.gFormJS.searchParamGF.sourceId = this.gFormJS.sourceId
            this.gFormJS.searchParamGF.userId = this.gFormJS.creatorId
            this.gFormJS.searchParamGF.userName = this.gFormJS.creatorName
            this.gFormJS.searchParamGF.formType = this.gFormJS.formType

            //取值
            let paramNameArr = [], exampleArr = [], remarkArr = [], whenSettingArr = []
            paramNameArr = this.gFormJS.gformItemMap.paramName
            paramNameArr = (paramNameArr && paramNameArr.itemValue) ? paramNameArr.itemValue.split('||,||') : []
            if (paramNameArr.length>0) {
                exampleArr = this.gFormJS.gformItemMap.example.itemValue.split('||,||')
                remarkArr = this.gFormJS.gformItemMap.remark.itemValue.split('||,||')
                whenSettingArr = this.gFormJS.gformItemMap.whenSetting.itemValue.split('||,||')
            }

            //寫上值
            $('#modal_localStorage_modify_sourceId').val(this.gFormJS.sourceId)
            let $tbody = $('#modal_localStorage_modify_tbody')
            $tbody.find('tr:not(:first)').remove()
            $tbody.find('input').val('')
            paramNameArr.forEach(function(paramName, i){
                let example = exampleArr[i]
                let remark = remarkArr[i]
                let whenSetting = whenSettingArr[i]
                $tbody.find('.modal_localStorage_modify_example:last').val(example)
                $tbody.find('.modal_localStorage_modify_remark:last').val(remark)
                $tbody.find('.modal_localStorage_modify_whenSetting:last').val(whenSetting)
                $tbody.find('.modal_localStorage_modify_paramName:last').val(paramName).keyup()
            })

            $tarObj.modal('show')
        }
        /**
         * 說明 -> localStorage管理-新增/修改 -> 參數 onKeyUp
         * @param gForm - 'add' || object
         */
        this.modifyParamOnKeyUp = function(that) {
            let $thisTr = $(that).parent().parent()
            let $nextTr = $thisTr.next()
            let hasNextTr = ($nextTr.length>0)
            if (that.value.trim()=='') {
                if (hasNextTr && $nextTr.find('.modal_localStorage_modify_paramName').val().trim()==''){
                    $nextTr.remove()
                }
            }else {
                if (!hasNextTr) {
                    $thisTr.after(this.ConstModifyTr)
                }
            }
        }
        /**
         * 說明 -> localStorage管理-新增/修改 -> 儲存
         * @param {element} that
         */
        this.save = function(that) {
            $(that).attr('disabled', 'disabled')
            let sourceId = $('#modal_localStorage_modify_sourceId').val()
            if (sourceId.trim()=='') {
                $('#modal_alert_msg').html('請填寫「醫院(sourceID)*」')
                $('#modal_alert').modal('show')
                $(that).removeAttr('disabled')
                return false
            }
            this.gFormJS.status = 'Y'
            this.gFormJS.searchParamGF.status = 'Y'
            this.gFormJS.sourceId = sourceId
            this.gFormJS.searchParamGF.sourceId = this.gFormJS.sourceId

            let $tr = $('#modal_localStorage_modify_tbody').find('tr')
            let paramNameArr = [], exampleArr = [], remarkArr = [], whenSettingArr = []

            //取得gFormItemMap
            $tr.each(function(){
                let paramName = $(this).find('.modal_localStorage_modify_paramName').val().trim()
                let example = $(this).find('.modal_localStorage_modify_example').val().trim()
                let remark = $(this).find('.modal_localStorage_modify_remark').val().trim()
                let whenSetting = $(this).find('.modal_localStorage_modify_whenSetting').val().trim()
                //next
                if (paramName=='') {
                    return true
                }
                //取值
                paramNameArr.push(paramName)
                exampleArr.push(example)
                remarkArr.push(remark)
                whenSettingArr.push(whenSetting)
            })
            this.gFormJS.gformItemMap.paramName = {
                "itemKey": "paramName",
                "itemValue": paramNameArr.join('||,||')
            }
            this.gFormJS.gformItemMap.example = {
                "itemKey": "example",
                "itemValue": exampleArr.join('||,||')
            }
            this.gFormJS.gformItemMap.remark = {
                "itemKey": "remark",
                "itemValue": remarkArr.join('||,||')
            }
            this.gFormJS.gformItemMap.whenSetting = {
                "itemKey": "whenSetting",
                "itemValue": whenSettingArr.join('||,||')
            }
            //保存
            if (this.gFormJS.formId) {
                thisPageStatus = 'UPD'
            } else {
                thisPageStatus = 'ADD'
            }
            this.gFormJS = this.gFormJS.setGFormItems(this.gFormJS)
            this.gFormJS.addOrUpdateGForm(this.gFormJS, function(gForms){
                console.log(gForms)
                $("#modal_localStorage_modify").modal('hide')


                //取得localStorage資訊，存入 csApi.editSource.localStorageInfo
                objApi.editSource.getLocalStorageInfo(formFile.apiModule.sourceId)
            }, function(e){
                $('#modal_alert_msg').html('發生錯誤')
                $('#modal_alert').modal('show')
                console.error(e)
            })
        }
        /**
         * 說明 -> localStorage管理 ->  刪除
         */
        this.delete = function(delGForm) {
            //刪除 (表單主鍵 oldFormId)
            let gFormJS = nursing.createGForm()
            gFormJS.leftJoin(delGForm);
            gFormJS.deleteGForm(gFormJS, function() {
                formFile.localStorageProp.showList()
            }, function(e) {
                alert('發生錯誤!')
                console.error(e)
            });
        }
    }

    //環境設定(click)
    this.setEnvironmentHTML = function() {
        $('#div-environment-sourceId').html(this.apiModule.sourceId)
        $('#div-environment-apiName').html(this.apiModule.apiName)
        $('#div-environment-apiDescription').html(this.apiModule.apiDescription)
        let runMode = this.apiModule.runMode.join(',').split(',') //深拷貝
        $('#div-environment-runMode').find(':checked').click()
        runMode.forEach(function(v){
            $('#ckb_runMode_'+v).click()
        })
    }

    //復原上一步
    this.btn_recover = function(that) {
        // objCvs.log.recover()
        // this.checkRecoverAndRedo()
    }
    //重作下一步
    this.btn_redo = function(that) {
        // objCvs.log.redo()
        // this.checkRecoverAndRedo()
    }
    //確認是否有上一動 / 下一動
    this.checkRecoverAndRedo = function() {
        // //上一動
        // if (objCvs.log.hasRecover()){
        //     $('#btn_recover').removeAttr('disabled')
        // }else{
        //     $('#btn_recover').attr('disabled', 'disabled')
        // }
        // //下一動
        // if (objCvs.log.hasRedo()){
        //     $('#btn_redo').removeAttr('disabled')
        // }else{
        //     $('#btn_redo').attr('disabled', 'disabled')
        // }
    }

    //儲存當前模式的值
    this.setValueNowMode = function(){
        //取得傳入參數
        if (this.nowMode == 'sendParam') {
            this.apiModule.sendParam = objApi.getJSON()
        }
        //取得輸出資料
        else if (this.nowMode == 'receiveParam') {
            this.apiModule.receiveParam = objApi.getJSON()
        }
        //取得轉換輸入參數值
        else if (this.nowMode == 'sendReplacing') {
            this.apiModule.sendReplacing = this.getValueReplace()
        }
        //取得轉換輸出資料值
        else if (this.nowMode == 'receiveReplacing') {
            this.apiModule.receiveReplacing = this.getValueReplace()
        }
        //取得傳入參數前處理的動作
        else if (this.nowMode == 'sendPreProcessing') {
            this.apiModule.sendPreProcessing = this.getValuePreProcessing(null)
        }
        //取得輸出資料前處理的動作
        else if (this.nowMode == 'receivePreProcessing') {
            this.apiModule.receivePreProcessing = this.getValuePreProcessing(null)
        }


    }

    //現在模式
    this.nowMode = ''
    //切換模式
    this.switchMode = function(that, mode) {
        //儲存當前模式的值
        this.setValueNowMode();
        //切換
        this.nowMode = mode
        $('#materialList').find('.active').removeClass('active')
        $(that).addClass('active')
        $('.drawPage').removeClass('show').addClass('hide')
        let $drawPage
        switch (mode) {
            case 'testAPI':
                $drawPage = $('#drawPageTestApi')
                $drawPage.removeClass('hide').addClass('show') //提早顯示
                window.iframeTestAPI.testApi.resetAll()
                break
            case 'normal':
                $drawPage = $('#drawPageNormal')
                //設定值
                this.clickRadioCheckbox('rdo_sendMethod', this.apiModule.sendMethod) //調用api方式(sendMethod)
                this.clickRadioCheckbox('rdo_method', this.apiModule.method) //方法(method)
                this.clickRadioCheckbox('rdo_contentType', this.apiModule.contentType) //傳入參數類型(contentType)
                this.clickRadioCheckbox('rdo_async', this.apiModule.async) //同步/非同步(async)
                this.clickRadioCheckbox('rdo_dataType', this.apiModule.dataType) //接收參數類型(dataType)
                //網域(domain) / API路徑(url)
                let domainJson = $.extend(true, {}, this.apiModule.domain)
                let urlJson = $.extend(true, {}, this.apiModule.url)
                let $div = $('#div_domain_url')
                $div.find('.var:not(:first), .domain:not(:first), .url:not(:first)').remove()
                $div.find('.var, .domain, .url').html('')
                for (let variable in domainJson){
                    $div.find('.var:last').html(variable)
                    $div.find('.domain:last').html(domainJson[variable])
                    $div.find('.url:last').html(urlJson[variable]).keyup()
                }
                break
            case 'sendParam':
                $drawPage = $('#drawPageJson')
                objApi = new csApiDefine('drawPageJson', formFile.apiModule.sendParam)
                objApi.switchJsonName('sendParam', this.apiModule.sendMethod)

                //取得localStorage資訊，存入 csApi.editSource.localStorageInfo
                objApi.editSource.getLocalStorageInfo(this.apiModule.sourceId)
                break
            case 'receiveParam':
                $drawPage = $('#drawPageJson')
                objApi = new csApiDefine('drawPageJson', formFile.apiModule.receiveParam)
                objApi.switchJsonName('receiveParam', this.apiModule.sendMethod)
                break
            case 'sendReplacing':
                $drawPage = $('#drawPageReplacing')
                //顯示所有傳入參數
                this.showReplacing(this.apiModule.sendParam)
                break
            case 'receiveReplacing':
                $drawPage = $('#drawPageReplacing')
                //顯示所有註冊為bean的輸出資料
                this.showReplacing(this.apiModule.fn.getDataMapping())
                break
            case 'sendPreProcessing':
                $drawPage = $('#drawPagePreProcessing')
                //顯示傳入參數前處理
                this.showPreProcessing(this.apiModule.sendPreProcessing)
                break
            case 'receivePreProcessing':
                $drawPage = $('#drawPagePreProcessing')
                //顯示輸出資料前處理
                this.showPreProcessing(this.apiModule.receivePreProcessing)
                break
        }
        $drawPage.removeClass('hide').addClass('show')
        // objCvs.switchMode(mode)
    }
    //點擊radio/checkbox
    this.clickRadioCheckbox = function(name, v){
        $(`.btn-check[name='${name}'][value='${v}']`).click()
    }
    //網域/api路徑 新增或移除div欄位
    this.addOrRemoveDomainUrl = function(that) {
        let v = that.innerHTML
        let $next = $(that).next()
        let hasNext = ($next.length>0 && $next.hasClass('var'))
        let hasNextUrl = (hasNext &&  $next.next().next().html()!='')
        //url被刪光的話，要清除下一個兄弟節點
        if (v === '') {
            if (!hasNextUrl) {
                $(that).next().remove()
                $(that).next().remove()
                $(that).next().remove()
            }
        } else { //url有填寫的話，若為最後一個div，則新增一個兄弟節點row
            if (!hasNext) {
                let $div = $(`
							<div class="col-2 canEdit var" onblur="formFile.setValueDomainUrl()"></div>
                            <div class="col-5 canEdit domain" onblur="formFile.setValueDomainUrl()"></div>
                            <div class="col-5 canEdit url" onkeyup="formFile.addOrRemoveDomainUrl(this)" onblur="formFile.setValueDomainUrl()"></div>
						`)
                $(that).after($div)
            }
        }
    }
    //轉換輸入/輸出的select(method)
    let htmlReplaceSelect = `
        <div class="row">
            <div class="col-3">
                <select class="method custom-select custom-select-lg mb-3" onchange="formFile.changeReplacing(this)">
                    <option value="">請選擇</option>
                    <option value="trim">清除空白</option>
                    <option value="replace">取代</option>
                </select>
            </div>
            <div class="col-9 no-padding col-setting">
            </div>
        </div>
    `
    //轉換輸入/輸出的 replace方法 配置
    let htmlReplaceRpc = `
            <div class="row">
                <div class="col-5 canEdit replaceFrom"></div>
                <div class="col-2 replaceArrow text-center align-middle"><i class="bi bi-arrow-right text-dark"></i></div>
                <div class="col-5 canEdit replaceTo" onkeyup="formFile.addOrRemoveReplace(this)"></div>
            </div>
    `
    /**
     * 顯示要被轉換的清單
     * @param {{bean:{desc:string}}} dataMapping
     */
    this.showReplacing = function(dataMapping){
        let $div = $('#drawPageReplacing')
        //清空
        $div.find('.noData').remove()
        $div.find('.rowReplacing').remove()
        //append
        let count = 0 //檢查是否沒有設定dataMapping
        for (let bean in dataMapping) {
            ++count
            let map = dataMapping[bean]
            let div = `
                <div class="row rowReplacing">
                    <div class="col-2 bean" id="replace_${bean}" data-type="${(map.type) ? map.type : '--'}">${bean}</div>
                    <div class="col-2 desc">${(map.desc) ? map.desc : '--'}</div>
                    <div class="col-8 rows no-padding rows">
                        ${htmlReplaceSelect}
                    </div>
                </div>
            `
            $div.append(div)
        }
        if (count===0) {
            let div = `
                <div class="row noData">
                    ${(this.nowMode=='sendReplacing') ? '請設定傳入參數' : '請設定輸出資料並註冊bean'}
                </div>
            `
            $div.append(div)
        }
        //取得 轉換傳入參數值 / 轉換輸出資料值
        let replacingMaps = (this.nowMode==='sendReplacing') ? formFile.apiModule.sendReplacing : formFile.apiModule.receiveReplacing
        //把已設定的值設上去
        for (let bean in replacingMaps){
            let map = replacingMaps[bean]
            let methodArr = map.method
            let $rows = $('#drawPageReplacing').find(`#replace_${bean}`)
            if ($rows.length>0) {
                $rows = $rows.parent().find('>.rows')
                methodArr.forEach(function(method, i){
                    let $row = $rows.find('>.row:last')
                    $row.find('.method').val(method).change()
                    switch (method) {
                        case 'replace':
                            let replaceArr = map[`replace${i}`]
                            for (let i2=0, len2=replaceArr.length; i2<len2; i2+=2){
                                let replaceFrom=replaceArr[i2]
                                let replaceTo=replaceArr[i2+1]
                                $row.find('.replaceFrom:last').html(replaceFrom)
                                $row.find('.replaceTo:last').html(replaceTo).keyup()
                            }
                            break
                    }
                })
            }
        }
    }
    /**
     * 改變轉換清單的 method(select) 時
     * @param {selectElement} that
     */
    this.changeReplacing = function (that) {
        let v = that.value
        let $thisRow = $(that).parent().parent()
        let $thisSetting = $thisRow.find('.col-setting')
        let $nextRow = $thisRow.next()
        //是否有兄弟節點
        let hasNextRow = ($nextRow.length>0)

        //清空
        $thisSetting.empty()
        //新增配置
        let div = ''
        switch (v) {
            case '':
            case 'trim':
                break
            case 'replace':
                $thisSetting.append(htmlReplaceRpc)
                break
        }
        //新增/刪除下一個row
        if (hasNextRow) {
            switch (v) {
                case '':
                    //刪除
                    if ($nextRow.find('.method').val()==''){
                        $nextRow.remove();
                    }
                    break
                case 'trim':
                case 'replace':
                    break
            }
        } else {
            switch (v) {
                case '':
                    break
                case 'trim':
                case 'replace':
                    //新增
                    $thisRow.after(htmlReplaceSelect)
                    break
            }
        }
    }
    /**
     * 新增或移除 轉換輸入/輸出的 replace方法 配置
     * @param {divElement} that
     */
    this.addOrRemoveReplace = function(that) {
        let v = that.innerHTML.trim()
        let $thisRow = $(that).parent()
        let $nextRow = $thisRow.next()
        //是否有兄弟節點
        let hasNextRow = ($nextRow.length>0)

        //新增/刪除下一個row
        if (hasNextRow) {
            //刪除
            if (v=='') {
                if ($nextRow.find('.replaceFrom').html()=='' && $nextRow.find('.replaceTo').html()==''){
                    $nextRow.remove();
                }
            }
        } else {
            //新增
            if (v!='') {
                $thisRow.after(htmlReplaceRpc)
            }
        }
    }
    /**
     * 轉換輸入/輸出的設定
     * @return {{}} json
     */
    this.getValueReplace = function(){
        let json = {}
        $('#drawPageReplacing').find('.rowReplacing').each(function(){
            let bean = $(this).find('.bean').html()
            $(this).find('>.rows>.row').each(function(){
                let method = $(this).find('.method').val()
                if (method=='') {
                    return true;
                }
                if (!json[bean]) {
                    json[bean] = {'method':[]}
                }
                json[bean].method.push(method)
                switch (method) {
                    case 'trim':
                        break
                    case 'replace':
                        let replaceArr = []
                        $(this).find('>.col-setting>.row').each(function(){
                            let replaceFrom = $(this).find('.replaceFrom').html()
                            let replaceTo = $(this).find('.replaceTo').html()
                            //兩個值相同就沒有replace的意義
                            if (replaceFrom!=replaceTo) {
                                replaceArr.push(replaceFrom)
                                replaceArr.push(replaceTo)
                            }
                        })
                        json[bean]['replace'+(json[bean].method.length-1)] = replaceArr
                        break
                }
            })
        })
        return json
    }

    //傳入參數前處理-select
    let htmlSendPreProcessing = `
        <div class="row">
            <div class="col-2 idx">1</div>
            <div class="col-10">
                <select class="processing custom-select custom-select-lg mb-3" onchange="formFile.changeProcessing(this)">
                    <option value="">請選擇</option>
                    <option value="base64 encode">base64編碼 - base64 encode</option>
                    <option value="url encode">url編碼 - url encode</option>
                    <option value="JSON to String">JSON to 字串 - JSON to String</option>
                </select>
            </div>
        </div>
    `
    //輸出資料前處理-select
    let htmlReceivePreProcessing = `
        <div class="row">
            <div class="col-2 idx">1</div>
            <div class="col-10">
                <select class="processing custom-select custom-select-lg mb-3" onchange="formFile.changeProcessing(this)">
                    <option value="">請選擇</option>
                    <option value="base64 decode">反解base64 - base64 decode</option>
                    <option value="url decode">反解url編碼 - url decode</option>
                    <option value="String to JSON">字串 to JSON - String to JSON</option>
                </select>
            </div>
        </div>
    `
    //傳入參數/輸出資料前處理-select (用於例外狀況 如測試連線)
    let htmlSendAndReceivePreProcessing = `
        <div class="row">
            <div class="col-2 idx">1</div>
            <div class="col-10">
                <select class="processing custom-select custom-select-lg mb-3" onchange="formFile.changeProcessing(this, '{divId}')">
                    <option value="">請選擇</option>
                    <option value="base64 encode" class="sendProcessingOption">base64編碼 - base64 encode</option>
                    <option value="url encode" class="sendProcessingOption">url編碼 - url encode</option>
                    <option value="JSON to String" class="sendProcessingOption">JSON to 字串 - JSON to String</option>
                    <option value="base64 decode" class="receiveProcessingOption">反解base64 - base64 decode</option>
                    <option value="url decode" class="receiveProcessingOption">反解url編碼 - url decode</option>
                    <option value="String to JSON" class="receiveProcessingOption">字串 to JSON - String to JSON</option>
                </select>
            </div>
        </div>
    `
    /**
     * 顯示要前處理的動作
     * @param {[]} preProcessingArr
     * @param {string || null} divId 用於testApi.html
     */
    this.showPreProcessing = function(preProcessingArr, divId){
        let $div = $('#'+(divId || 'drawPagePreProcessing'))
        //清空
        $div.find('>.row:not(.preProcessingTitle)').remove()
        //append
        $div.append((this.nowMode==='sendPreProcessing') ? htmlSendPreProcessing : (this.nowMode==='receivePreProcessing') ? htmlReceivePreProcessing : htmlSendAndReceivePreProcessing.replace('{divId}', divId))
        //把已設定的值設上去
        preProcessingArr.forEach(function(process, i){
            $div.find('.idx:last').html(i+1)
            $div.find('.processing:last').val(process).change()
        })
    }
    /**
     * 改變前處理的 processing(select) 時
     * @param {selectedElement} that 被select的物件
     * @param {string || null} divId 用於testApi.html
     */
    this.changeProcessing = function (that, divId) {
        let v = that.value
        let $thisRow = $(that).parent().parent()
        let $nextRow = $thisRow.next()
        //是否有兄弟節點
        let hasNextRow = ($nextRow.length>0)

        //新增/刪除下一個row
        if (hasNextRow) {
            //刪除
            if (v=='' && $nextRow.find('.processing').val()==''){
                $nextRow.remove();
            }
        } else {
            if (v!=''){
                //新增
                $thisRow.after((this.nowMode==='sendPreProcessing') ? htmlSendPreProcessing : (this.nowMode==='receivePreProcessing') ? htmlReceivePreProcessing : htmlSendAndReceivePreProcessing.replace('{divId}', divId))
                $thisRow.next().find('.idx:last').html($('#'+(divId || 'drawPagePreProcessing')).find('>.row:not(.preProcessingTitle)').length)
            }
        }
    }
    /**
     * 取得前處理的動作
     * @param {string || null} divId 用於testApi.html
     * @return {[string]} array
     */
    this.getValuePreProcessing = function(divId){
        let arr = []
        $('#'+(divId || 'drawPagePreProcessing')).find('.processing').each(function(){
            if (this.value!='') {
                arr.push(this.value)
            }
        })
        return arr
    }

}

$(document).click(function(){
    // if (!const_propCsApiDefine.sourceId) {
    //     return false
    // }
    // //確認是否有上一動 / 下一動
    // formFile.checkRecoverAndRedo()
})