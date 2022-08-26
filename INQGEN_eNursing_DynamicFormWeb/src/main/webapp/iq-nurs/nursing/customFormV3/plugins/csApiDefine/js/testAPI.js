var testApi = new Fn_testApi()
$(function() {
    formFile.nowMode='testConnect'
    $('.codeMirror').each(function(){
        let mode = 'json'
        mode = (this.id==='tx_connectUrl') ? 'text' : mode
        this.codeMirror = CodeMirror.fromTextArea(this, {
            mode:           `application/ld+${mode}`,
            lineNumbers:    true,
            lineWrapping:   true,
            theme:          "monokai",
            viewportMargin: Infinity
        });
    })
    console.log(parent.formFile.apiModule)
});

function Fn_testApi(){
    this.apiModule = null;

    //重新設定
    this.resetAll = function () {
        let msg = '', resolve = '', $div
        if (!parent.formFile.apiModule) return testApi.alertMsg('讀取不到api設定，請先「開新表單」 or 「開啟舊檔」')
        try{
            msg = '取得apiModule物件'
            testApi.setCodeMirror('txt_apiModule', parent.formFile.apiModule)
        }catch(e){
            console.error(e)
            return testApi.alertMsg('[step01] '+msg+'發生錯誤')
        }

        testApi.testAll('step01')

        try{
            msg = '清空所有參數'
            $('.codeMirror:not("#txt_apiModule")').each(function(){
                testApi.setCodeMirror(this.id, '')
            })

            msg = '設定step02參數'
            let apiDomain = 'cs';
            try {
                apiDomain = const_apiDomainSetting;
            } catch (e) {}
            $('#domain').html(testApi.apiModule.domain[apiDomain] || '')
            $('#url').html(testApi.apiModule.url[apiDomain] || '')
            //若為一般的傳輸方式 (非gForm) 則必須指明url
            $('#sendMethod').html(testApi.apiModule.sendMethod)
            if (testApi.apiModule.sendMethod==='httpJson') {
                $('#domain').parents('.listParam:first').show()
                $('#step02').find('.divCodeMirror, .divRun').show()
            }else{
                $('#domain').parents('.listParam:first').hide()
                $('#step02').find('.divCodeMirror, .divRun').hide()
            }

            msg = '設定step03-1參數'
            $div = $('#divSendParam')
            $div.empty()
            for(let key in testApi.apiModule.sendParam) {
                let sendParam = testApi.apiModule.sendParam[key]
                let paramBtn = (sendParam.source && sendParam.source.indexOf('local')>-1) ? `<button class="paramBtn" title="${sendParam.source}" onclick="$(this).next().html(localStorage['${sendParam.source.split(':')[1] || ''}'])">local</button>` : ''
                let v = sendParam.value
                //是取固定值的話
                if (sendParam.source && sendParam.source.indexOf('fixed')>-1) {
                    paramBtn = `<button class="paramBtn" title="${sendParam.source}" onclick="$(this).next().html('${sendParam.source.split(':')[1].replace(/"/g, "&quot;").replace(/'/g, "&apos;") || ''}')">fixed</button>`
                    v = sendParam.source.split(':')[1]
                }
                //如果是arrayJson的話
                if (Array.isArray(v) && typeof v === 'object') {
                    v = JSON.stringify(deepChangeArrayJson(v))
                    function deepChangeArrayJson(arrayJson){
                        let arr = []
                        arrayJson.forEach(json => {
                            let newJson = {}
                            for (let key in json) {
                                if (Array.isArray(json[key]) && typeof json[key] === 'object') {
                                    newJson[key] = deepChangeArrayJson(json[key])
                                } else {
                                    newJson[key] = json[key].source
                                }
                                newJson[key] = (typeof newJson[key] === 'string' && newJson[key].indexOf('fixed:')===0) ? newJson[key].split('fixed:')[1] : newJson[key]
                            }
                            arr.push(newJson)
                        })
                        return arr
                    }
                }
                //如果是json的話
                if (v instanceof Object && typeof v === 'object') {
                    v = JSON.stringify(deepChangeJson(v))
                    function deepChangeJson(json){
                        let newJson = {};
                        for(const key in json){
                            if (json[key].value instanceof Object && typeof json[key].value === 'object' && !Array.isArray(json[key].value) ) {
                                newJson[key] = deepChangeJson(json[key].value)
                            } else {
                                newJson[key] = json[key].value
                            }
                            newJson[key] = (typeof newJson[key] === 'string' && newJson[key].indexOf('fixed:')===0) ? newJson[key].split('fixed:')[1] : newJson[key]
                        }
                        return newJson
                    }
                }

                function isJson(str) {
                    // 驗證字串是否為json格式
                    try {
                        JSON.parse(str);
                    } catch (e) {
                        return false;
                    }
                    return true;
                }

                if(isJson(v)){
                    // 如果是json格式 則顯示json編輯器
                    let divParam = `
                        <div class="divParam" style="width: 100%">
                            <label class="h5 paramTitle" ${sendParam.desc ? 'title="'+sendParam.desc+'"' : ''}>${key}</label>
                            ${paramBtn}
                            <div class="paramValue" style="padding: 8px 30px" id="${key}" ${sendParam.desc ? 'title="'+sendParam.desc+'"' : ''}></div>
                        </div>
                    `
                    $div.append(divParam)
                    var editor = new JsonEditor($("#" + key), JSON.parse(v), {defaultCollapsed : true})
                    editor.load(JSON.parse(v))
                    $("#" + key)[0].editor = editor

                }else{
                    let divParam = `
                        <div class="divParam">
                            <label class="h5 paramTitle" ${sendParam.desc ? 'title="'+sendParam.desc+'"' : ''}>${key}</label>
                            ${paramBtn}
                            <div class="paramValue" id="${key}" ${sendParam.desc ? 'title="'+sendParam.desc+'"' : ''}>${v}</div>
                        </div>
                    `
                    $div.append(divParam)
                }
            }

            msg = '設定step03-3參數'
            formFile.showPreProcessing(testApi.apiModule.sendPreProcessing || [], 'drawPagePreProcessing_send')

            msg = '設定step05參數'
            formFile.showPreProcessing(testApi.apiModule.receivePreProcessing || [], 'drawPagePreProcessing_receive')

            msg = '設定step06, 取得檢核位置資訊', resolve = '請檢查是否已設定 輸出資料->註冊為狀態查核點\n請檢查是否已設定 輸出資料->註冊為狀態查核提示說明點'
            testApi.setCodeMirror('tx_targetCheck', testApi.apiModule.fn.getTargetCheck())

            msg = '清空step07-檢核結果', resolve= ''
            $('#resultMsgAnswer').html('')

            msg = '設定step08, 取得bean註冊資訊', resolve= ''
            testApi.setCodeMirror('tx_dataMapping', testApi.apiModule.fn.getDataMapping())



        }catch(e){
            console.error(e)
            return testApi.alertMsg(msg+'發生錯誤'+(resolve ? '\n'+resolve : '')+'\n\n[System Message]： '+e.toString())
        }
    }
    /**
     * 全部執行
     * @param {string || null} untilStep 執行直到某個步驟，null代表全執行
     */
    this.testAll = function (untilStep) {
        let stepArr = ['step01', 'step02', 'step03-1', 'step03-2', 'step03-3', 'step04', 'step05', 'step07', 'step09']
        let untilIndex = stepArr.length-1
        untilIndex = (untilStep) ? stepArr.indexOf(untilStep) : untilIndex
        if (untilIndex===-1)  return testApi.alertMsg('找不到此step number')

        try{
            //step01~step03-3
            for (let i=0; i<=untilIndex && i<=stepArr.indexOf('step03-3'); ++i) {
                //有錯誤就停止
                if (testApi[stepArr[i]]()===false){
                    testApi.scrollTo(stepArr[i])
                    return false
                }
            }
            //step04 為同步執行
            if (stepArr.indexOf('step04')<=untilIndex){
                testApi.step04(function(isSuccess){
                    if (isSuccess) {
                        try{
                            //step05~step09
                            for (let i=stepArr.indexOf('step05'); i<=untilIndex && i<stepArr.length; ++i) {
                                //有錯誤就停止
                                if (testApi[stepArr[i]]()===false){
                                    testApi.scrollTo(stepArr[i])
                                    return false
                                }
                            }
                        }catch (e) {
                            console.error(e)
                            return testApi.alertMsg('發生錯誤!')
                        }
                    }else{
                        testApi.scrollTo('step04')
                        return false
                    }
                })
            }
        }catch (e) {
            console.error(e)
            return testApi.alertMsg('發生錯誤!')
        }
    }
    /**
     * 單元測試
     * @param {button} that 單元測試按鈕
     */
    this.testUnit = function (that) {
        let $stepDiv = $(that).parent().parent()
        let step = $stepDiv.attr('id')
        //執行
        testApi[step]()
    }
    /**
     * 直行至此
     * @param {button} that 直行至此按鈕
     */
    this.testUntil = function (that) {
        let $stepDiv = $(that).parent().parent()
        let step = $stepDiv.attr('id')
        testApi.testAll(step)
    }
    /**
     * 捲動至目標step位置
     * @param stepId
     */
    this.scrollTo = function (stepId) {
        $(`#${stepId}`)[0].scrollIntoView()
        $('#showPage').scrollTop($('#showPage').scrollTop()-50)
        //醒目提示
        $(`#${stepId}`).addClass('error')
        setTimeout(function(){
            $(`#${stepId}`).removeClass('error')
        }, 500)
        setTimeout(function(){
            $(`#${stepId}`).addClass('error')
        }, 1000)
        setTimeout(function(){
            $(`#${stepId}`).removeClass('error')
        }, 1500)
    }

    //設定api物件
    this.step01 = function () {
        let msg = ''
        try{
            msg = '轉換json'
            let apiModule = testApi.getCodeMirror('txt_apiModule', 'json')
            testApi.apiModule = nursing.createApiModule()
            testApi.apiModule = $.extend(true, testApi.apiModule, apiModule)
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('txt_apiModule', '[step01] '+msg+'發生錯誤')
            return false
        }
        return true
    }
    //設定網址
    this.step02 = function () {
        let msg = ''
        try{
            msg = '設定網址'
            let apiDomain = 'cs';
            try {
                apiDomain = const_apiDomainSetting;
            } catch (e) {}
            testApi.apiModule.domain[apiDomain] = $('#domain').html()
            testApi.apiModule.url[apiDomain] = $('#url').html()
            testApi.apiModule.fn.setUrl()
            testApi.setCodeMirror('tx_connectUrl', testApi.apiModule.connectUrl)
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('tx_connectUrl', '[step02] '+msg+'發生錯誤')
            return false
        }
        return true
    }
    //設定傳入參數
    this['step03-1'] = function () {
        let msg = ''
        try{
            msg = '設定傳入參數'
            let $paramValueList = $('#divSendParam').find('.paramValue')
            testApi.apiModule.sendData3_1 = {}
            $paramValueList.each(function(){
                try {
                    if(this.editor !== undefined){
                        // 如有有使用json編輯器
                        // 則由編輯器取回json的值
                        testApi.apiModule.sendData3_1[this.id] = this.editor.get()
                    }else{
                        // 一般情況則讀取html內字串
                        testApi.apiModule.sendData3_1[this.id] = JSON.parse(this.innerHTML)
                    }
                } catch(e) {
                    testApi.apiModule.sendData3_1[this.id] = this.innerHTML
                }
            })
            testApi.setCodeMirror('tx_sendData1', testApi.apiModule.sendData3_1)
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('tx_sendData1', '[step03-1] '+msg+'發生錯誤')
            return false
        }
        return true
    }
    //轉換傳入參數值
    this['step03-2'] = function () {
        let msg = ''
        try{
            msg = '轉換傳入參數值'
            testApi.apiModule.sendData3_2 = testApi.apiModule.fn.paramReplace(testApi.getCodeMirror('tx_sendData1', 'json'), testApi.apiModule.sendReplacing);
            testApi.setCodeMirror('tx_sendData2', testApi.apiModule.sendData3_2)
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('tx_sendData2', '[step03-2] '+msg+'發生錯誤')
            return false
        }
        return true
    }
    //傳入參數前處理
    this['step03-3'] = function () {
        let msg = ''
        try{
            msg = '取得前處理的方法'
            testApi.apiModule.sendPreProcessing = formFile.getValuePreProcessing('drawPagePreProcessing_send')

            msg = '轉換傳入參數'
            testApi.apiModule.sendData = testApi.getCodeMirror('tx_sendData2', 'json')
            testApi.apiModule.fn.setSendPreProcessing();
            testApi.apiModule.sendData3 = $.extend(true, {}, testApi.apiModule.sendData)
            testApi.setCodeMirror('tx_sendData3', testApi.apiModule.sendData)
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('tx_sendData3', '[step03-3] '+msg+'發生錯誤')
            return false
        }
        return true
    }
    //connect執行api
    this['step04'] = function (completeCall) {
        let msg = ''
        try{
            msg = '取得api位址'
            testApi.apiModule.connectUrl = testApi.getCodeMirror('tx_connectUrl', 'string')
            //若為一般的傳輸方式 (非gForm) 則必須指明url
            if (testApi.apiModule.sendMethod==='httpJson' && (!testApi.apiModule.connectUrl || !testApi.apiModule.connectUrl.trim())) {
                testApi.setCodeMirror('tx_result1', '[step04] api位址不得為空')
                if (completeCall) completeCall(false)
                return false
            }

            msg = '取得ajax-data 傳入參數 (前處理)'
            testApi.apiModule.sendData = testApi.getCodeMirror('tx_sendData3', 'json')
            if (testApi.getCodeMirror('tx_sendData3', 'string')==="") {
                testApi.setCodeMirror('tx_result1', '[step04] ajax-data 傳入參數 (前處理)不得為空')
                if (completeCall) completeCall(false)
                return false
            }

            msg = '執行api'
            testApi.apiModule.fn.openConnection(testApi.apiModule, function(result) {
                //設定來源資料原始格式
                let orgResultType = ((typeof result)==='object') ? 'json' : 'string'
                $('#orgResultType').val(orgResultType)
                //設定值
                testApi.apiModule.result1 = result
                testApi.setCodeMirror('tx_result1', result)
                if (completeCall) completeCall(true)
            }, function(e){
                console.error(e)
                testApi.setCodeMirror('tx_result1', e.toString())
                if (completeCall) completeCall(false)
            })
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('tx_result1', '[step04] '+msg+'發生錯誤')
            if (completeCall) completeCall(false)
            return false
        }
        return true
    }
    //轉出資料前處理
    this['step05'] = function () {
        let msg = ''
        try{
            msg = '取得前處理的方法'
            testApi.apiModule.receivePreProcessing = formFile.getValuePreProcessing('drawPagePreProcessing_receive')

            msg = '轉換傳入參數'
            //保持原始資料的型態
            testApi.apiModule.result = testApi.getCodeMirror('tx_result1', $('#orgResultType').val())
            testApi.apiModule.fn.setReceivePreProcessing();
            testApi.apiModule.result2 = $('#orgResultType').val()==='json' ? $.extend(true, {}, testApi.apiModule.result) : testApi.apiModule.result;
            testApi.setCodeMirror('tx_result2', testApi.apiModule.result2)
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('tx_result2', '[step05] '+msg+'發生錯誤')
            return false
        }
        return true
    }
    //檢核api成功與否
    this['step07'] = function () {
        let msg = ''
        try{
            msg = '取得step05處理後結果'
            testApi.apiModule.result = testApi.getCodeMirror('tx_result2', 'json')

            msg = '取得step06檢核位置資訊'
            let targetCheck = testApi.getCodeMirror('tx_targetCheck', 'json')

            msg = '檢查此api的狀態'
            testApi.apiModule.resultMsg = testApi.apiModule.fn.doTargetCheck(targetCheck)
            testApi.setCodeMirror('tx_resultMsg', testApi.apiModule.resultMsg)

            msg = '顯示結果於label"檢核結果"'
            $('#resultMsgAnswer').removeClass('success').removeClass('error')
            if (testApi.apiModule.resultMsg.success) {
                $('#resultMsgAnswer').addClass('success').html('成功')
            }else if (testApi.apiModule.resultMsg.error) {
                $('#resultMsgAnswer').addClass('error').html('失敗')
            }else{
                $('#resultMsgAnswer').html('其他 -> ' + testApi.apiModule.resultMsg.msg)
            }
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('tx_resultMsg', '[step07] '+msg+'發生錯誤')
            return false
        }
        return true
    }
    //取得資料
    this['step09'] = function () {
        let msg = '', dataMapping = {}
        try{
            msg = '取得step05處理後結果'
            testApi.apiModule.result = testApi.getCodeMirror('tx_result2', 'json')

            msg = '取得step08 bean & mapping 資訊'
            dataMapping = testApi.getCodeMirror('tx_dataMapping', 'json')

            msg = '取得執行beanMapping後的資料'
            testApi.setCodeMirror('tx_rs', testApi.apiModule.fn.getData(dataMapping))
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('tx_rs', '[step07] '+msg+'發生錯誤')
            return false
        }
        try{
            msg = '轉gForm結構'
            //gForm的api本身回傳的result就是gForm結構
            if (testApi.apiModule.sendMethod==='httpJson') {
                testApi.setCodeMirror('tx_rsGform', testApi.apiModule.fn.getDataGformItemMap(dataMapping))
            }else{
                testApi.setCodeMirror('tx_rsGform', testApi.apiModule.fn.getData(dataMapping))
            }
        }catch(e){
            console.error(e)
            testApi.setCodeMirror('tx_rsGform', '[step07] '+msg+'發生錯誤')
            return false
        }
        return true
    }

    //顯示警告訊息
    this.alertMsg = function (msg) {
        parent.$('#modal_alert_msg').html(msg)
        parent.$('#modal_alert').modal('show')
        return false;
    }

    /**
     * 設定編輯器的value
     * @param {string} id textarea的id
     * @param {string || {}} v 值
     */
    this.setCodeMirror = function (id, v) {
        if ((typeof v) ==='object') {
            v = syntaxHighlight(v)
        }
        $(`#${id}`)[0].codeMirror.setValue(v)

        //格式化json
        function syntaxHighlight(json) {
            if ((typeof json) != 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                return match;
            });
        }
    }

    /**
     * 取得編輯器的value
     * @param {string} id textarea的id
     * @param {string || null} type 預設轉string | json
     */
    this.getCodeMirror = function (id, type) {
        let v = $(`#${id}`)[0].codeMirror.getValue()
        if (type==='json') {
            v = JSON.parse(v || "{}")
        }
        return v;
    }
}