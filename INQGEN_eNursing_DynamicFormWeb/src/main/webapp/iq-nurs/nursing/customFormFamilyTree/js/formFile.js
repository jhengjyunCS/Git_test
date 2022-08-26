const formFile = new Fn_formFile()
const const_propCsCanvas = new formFile.propCsCanvas()
//顯示csCanvas人形圖
var objCvs
//gForm
var gForm = null, gForms = [], thisPageStatus = 'ADD', gForm_Title = null

function Fn_formFile() {
    //csCanvas物件
    this.propCsCanvas = function(){
        this.sourceId =     ""  //醫院(sourceID)*
        this.csName =       ""  //人形圖名稱*
        this.typeA =        ""  //區分類型A(ex. 年齡層)
        this.typeB =        ""  //區分類型B(ex. 用途)
        this.templateDiv=   null //要連動的div模板
        this.areas =        []  //區域座標資料
        this.imgSrc =       "img/human_640.jpg"  //背景圖 相對路徑 or base64

        this.formType="propCsCanvas" //固定值

        //重置
        this.reset = function(){
            this.sourceId =     ""
            this.csName =       ""
            this.typeA =        ""
            this.typeB =        ""
            this.templateDiv =  null
            this.areas =        []
            this.imgSrc =       "img/human_640.jpg"
        }

        //儲存並重畫
        this.saveAndReDraw = function(){
            //儲存原本的log
            let logIdx = objCvs.log.idx
            let logArr = objCvs.log.arr
            //設定
            this.setAreas()
            this.setTemplateDiv()
            //重畫
            formFile.showCsCanvas()
        }

        //設定區域物件
        this.setAreas = function(){
            this.areas =   objCvs.getAllAreaObj()
        }

        //設定要連動的div模板
        this.setTemplateDiv = function(){
            let templateDiv = null
            $('#list_templateDiv').find('.otherOptions.otherOptionsDesc').each(function(){
                let desc = $(this).html()
                let v = $(this).next().html()
                let hasOther = $(this).next().next().find('.form-check-input')[0].checked
                if (!templateDiv){
                    templateDiv = {
                        'otherOptionsValue':    [],
                        'otherOptionsDesc':     [],
                        'otherOptionsHasOther': []
                    }
                }
                templateDiv.otherOptionsDesc.push(desc)
                templateDiv.otherOptionsValue.push(v)
                templateDiv.otherOptionsHasOther.push(hasOther)
            })

            this.templateDiv = templateDiv

        }

        //設定要連動的div模板 (其他物件)
        this.pushTemplateDiv = function(){
            let $list = $('#list_templateDiv')
            $list.find('>div:not(.divPlus)').remove()
            if (!this.templateDiv) {
                return
            }
            for (let i=0, len=this.templateDiv.otherOptionsDesc.length; i<len; ++i){
                let desc = this.templateDiv.otherOptionsDesc[i]
                let v = this.templateDiv.otherOptionsValue[i]
                let hasOther = this.templateDiv.otherOptionsHasOther[i]
                formFile.addOtherOptions(false)
                $list.find('.otherOptionsDesc:last').html(desc)
                $list.find('.otherOptionsValue:last').html(v)
                if (hasOther){
                    $list.find('.otherOptionsHasOther:last').find('.form-check-input').attr('checked', 'checked')
                }
            }
        }

        //設定參數
        this.setValue = function(json){
            this.sourceId =     json.sourceId || ""
            this.csName =       json.csName || ""
            this.typeA =        json.typeA || ""
            this.typeB =        json.typeB || ""
            this.templateDiv =  json.templateDiv || null
            this.areas =        json.areas || []
            this.imgSrc =       json.imgSrc || ""

            this.pushTemplateDiv()
        }

        //設定餐住 by gForm
        this.setValueByGform = function(form){
            let map = form.gformItemMap
            map.getValue = function(key) { return (this[key]) ? this[key].itemValue : ''}
            const_propCsCanvas.sourceId = form.sourceId
            const_propCsCanvas.formType = form.formType
            const_propCsCanvas.csName = map.getValue('csName')
            const_propCsCanvas.typeA = map.getValue('typeA')
            const_propCsCanvas.typeB = map.getValue('typeB')
            const_propCsCanvas.templateDiv = (map.getValue('templateDiv')) ? JSON.parse(map.getValue('templateDiv')) : null
            const_propCsCanvas.areas = (map.getValue('areas')) ? JSON.parse(map.getValue('areas')) : []
            const_propCsCanvas.imgSrc = map.getValue('imgSrc')
        }
    }

    //顯示csCanvas (讀取 const_propCsCanvas)
    this.showCsCanvas = function(isNewCsCanvas) {
        let logIdx = (objCvs) ? objCvs.log.idx : -1
        let logArr = (objCvs) ? objCvs.log.arr : []
        objCvs = new csCanvas("mycanvas", 1280, 1280, const_propCsCanvas, {
            "clickFill": "rgba(155, 155, 254, 0.65)",
            "selectMode": "checkbox",
            "templateDiv": {
                // "id": 					"mycanvas_targetDiv_template",
                // "displayMode": 			"vertical", // horizontal | vertical
                // "position": 			"right",
                "isShowDiv": 			false
            },
            "click": function(v, desc, obj){
            },
            "change": function(v, desc, obj){
            },
            "complete": function(){
                //不是新建人形圖的話要回復log
                if (isNewCsCanvas!==true && logIdx!==-1) {
                    objCvs.log.idx = logIdx
                    objCvs.log.arr = logArr
                    objCvs.log.add()
                }
                //預設勾選"其他"選項，給user看效果
                if (const_propCsCanvas.templateDiv) {
                    let vArr = const_propCsCanvas.templateDiv.otherOptionsValue
                    objCvs.doSetDefaultValue('', vArr.join(','));
                }
                //確認是否有上一動 / 下一動
                formFile.checkRecoverAndRedo()
            }
        });
        $('#materialList').find('.active').removeClass('active')
        $('#materialList').find('.switchMode-div:first').addClass('active')
    }

    /**
     * 檔案 -> 開新表單
     * 新建表單功能
     */
    this.newForm = function() {
        gForm = null
        // $('#modal_newForm_formType').val(const_propCsCanvas.formType)
        $('#modal_newForm_sourceId').val(const_propCsCanvas.sourceId || $('#modal_newForm_sourceId').val())
        $('#modal_newForm_csName').val(const_propCsCanvas.csName)
        $('#modal_newForm_typeA').val(const_propCsCanvas.typeA)
        $('#modal_newForm_typeB').val(const_propCsCanvas.typeB)

        let $tarObj = $("#modal_newForm")
        $tarObj.modal('show')
    }

    /**
     * 檔案 -> 開新表單 -> 新增
     * @returns {boolean}
     */
    this.newForm_btn = function(){
        const_propCsCanvas.reset()
        // let formType=   $('#modal_newForm_formType').val()
        let sourceId=   $('#modal_newForm_sourceId').val()
        let csName=     $('#modal_newForm_csName').val()
        let typeA=      $('#modal_newForm_typeA').val()
        let typeB=      $('#modal_newForm_typeB').val()
        if (!sourceId){
            alert('請填寫 醫院(sourceID)')
            return false
        }
        if (!csName){
            alert('請填寫 人形圖名稱')
            return false
        }

        //setting const_propCsCanvas
        // const_propCsCanvas.formType =  formType
        const_propCsCanvas.sourceId =  sourceId
        const_propCsCanvas.csName =    csName
        const_propCsCanvas.typeA =     typeA
        const_propCsCanvas.typeB =     typeB

        console.log(const_propCsCanvas)
        $('#modal_newForm').modal('hide')

        formFile.showCsCanvas(true)
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
        gFormJS.searchParamGF.formType = 'propCsCanvas'
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
                        <td>${map.getValue('csName')}</td>
                        <td>${map.getValue('typeA')}</td>
                        <td>${map.getValue('typeB')}</td>
                        <td class="historyRec hide">${new Date(form.evaluationTime).format('yyyy/MM/dd HH:mm')}</td>
                        <td>
                            <button class="btn btn-success" type="button" onclick="formFile.chooseThisForm(${i}); return false">選擇</button>
                            <button class="btn btn-success historyBtn" type="button" onclick="formFile.openForm(${i}); return false">歷次紀錄</button>
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
     * 檔案 -> 開啟舊檔 -> 選擇
     */
    this.chooseThisForm = function(idx) {
        gForm = $.extend(true, {}, gForms[idx].gForm)
        console.log('====gForm')
        console.log(gForm)
        const_propCsCanvas.setValueByGform(gForm)
        const_propCsCanvas.pushTemplateDiv()

        formFile.showCsCanvas(true)
        formFile.setEnvironmentHTML()
        $('#modal_gFormList').modal('hide')
    }

    /**
     * 檔案 -> 儲存表單
     * @param {Boolean} modal [如不需要彈窗則不用填參數]
     * @returns {Boolean} true
     */
    this.saveForm = function(modal) {
        if (!const_propCsCanvas.sourceId) {
            $('#modal_alert_msg').html('請先創建人形圖 (檔案 -> 開新檔案)')
            $('#modal_alert').modal('show')
            return false
        }
        //設定區域物件
        const_propCsCanvas.setAreas()
        //設定要連動的div模板
        const_propCsCanvas.setTemplateDiv()
        //設定gForm參數
        thisPageStatus = 'ADD'
        let gFormJS = nursing.createGForm()
        gFormJS.sourceId = const_propCsCanvas.sourceId
        gFormJS.formType = const_propCsCanvas.formType
        gFormJS.status = 'Y'
        gFormJS.formVersionId = 'noFormVersionId'
        gFormJS.evaluationTime = new Date().format('yyyy/MM/dd HH:mm:ss')
        gFormJS.versionNo = 1
        gFormJS.creatorId = 'csCanvasUser'
        gFormJS.creatorName = 'csCanvasUser'
        gFormJS.modifyUserId = 'csCanvasUser'
        gFormJS.modifyUserName = 'csCanvasUser'
        gFormJS.searchParamGF.sourceId = gFormJS.sourceId
        gFormJS.searchParamGF.userId = gFormJS.creatorId
        gFormJS.searchParamGF.userName = gFormJS.creatorName
        gFormJS.searchParamGF.formType = gFormJS.formType

        //修改人形圖的時候
        if (gForm) {
            thisPageStatus = 'UPD'
            gFormJS.formId = gForm.formId
        }

        //人形圖名稱*
        gFormJS.gformItemMap.csName = {
            'itemKey': 'csName',
            'itemValue': const_propCsCanvas.csName
        }
        //區分類型A(ex. 年齡層)
        gFormJS.gformItemMap.typeA = {
            'itemKey': 'typeA',
            'itemValue': const_propCsCanvas.typeA
        }
        //區分類型B(ex. 用途)
        gFormJS.gformItemMap.typeB = {
            'itemKey': 'typeB',
            'itemValue': const_propCsCanvas.typeB
        }
        //要連動的div模板
        gFormJS.gformItemMap.templateDiv = {
            'itemKey': 'templateDiv',
            'itemValue': (const_propCsCanvas.templateDiv) ? JSON.stringify(const_propCsCanvas.templateDiv) : null
        }
        //區域座標資料
        gFormJS.gformItemMap.areas = {
            'itemKey': 'areas',
            'itemValue': (const_propCsCanvas.areas) ? JSON.stringify(const_propCsCanvas.areas) : null
        }
        //背景圖 相對路徑 or base64
        gFormJS.gformItemMap.imgSrc = {
            'itemKey': 'imgSrc',
            'itemValue': const_propCsCanvas.imgSrc
        }
        //查詢參數 (人形圖名稱-區分類型A-區分類型B) (csName-typeA-typeB)
        gFormJS.gformItemMap.searchParam = {
            'itemKey': 'searchParam',
            'itemValue': `${const_propCsCanvas.csName}-${const_propCsCanvas.typeA}-${const_propCsCanvas.typeB}`
        }

        gFormJS = gFormJS.setGFormItems(gFormJS)
        console.log(gFormJS)

        gFormJS.addOrUpdateGForm(gFormJS, function(gForms){
            console.log(gForms)
            gForm = gForms[0]
        }, function(e){
            $('#modal_alert_msg').html('發生錯誤')
            $('#modal_alert').modal('show')
            console.error(e)
        })
        return true
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

    this.csCanvasCodeMirror = null
    /**
     * 說明 -> csCanvas物件
     */
    this.showCsCanvasProperties = function() {
        let $tarObj = $("#modal_csCanvasProperties")
        //已開新表單
        if (const_propCsCanvas.sourceId){
            //取得區域物件
            const_propCsCanvas.setAreas()
            //取得要連動的div模板
            const_propCsCanvas.setTemplateDiv()
        }
        console.log("===const_propCsCanvas")
        console.log(const_propCsCanvas)
        //codemirror 文字編輯器
        $tarObj.off('shown.bs.modal')
        $tarObj.on('shown.bs.modal', function () {
            if (!formFile.csCanvasCodeMirror){
                formFile.csCanvasCodeMirror = CodeMirror.fromTextArea(document.getElementById('propCsCanvas_editor'), {
                    mode: "application/ld+json",
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: "monokai",
                    viewportMargin: Infinity
                });
            }
            formFile.csCanvasCodeMirror.setValue(syntaxHighlight(const_propCsCanvas))
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
     * 說明 -> csCanvas物件 -> 關閉
     */
    this.showCsCanvasPropertiesOnClose = function() {
        let new_properties
        //取得新的csCanvas物件
        try{
            new_properties = JSON.parse(formFile.csCanvasCodeMirror.getValue())
        }catch(e){
            alert('JSON格式有錯')
            return;
        }
        //設定值
        const_propCsCanvas.setValue(new_properties)
        console.log("===(new) const_propCsCanvas")
        console.log(const_propCsCanvas)

        //環境設定
        formFile.setEnvironmentHTML()

        //顯示csCanvas
        formFile.showCsCanvas()

    }

    //環境設定(click)
    this.setEnvironmentHTML = function() {
        //環境設定
        $('#div-environment-sourceId').html(const_propCsCanvas.sourceId)
        $('#div-environment-csName').html(const_propCsCanvas.csName)
        $('#div-environment-typeA').html(const_propCsCanvas.typeA)
        $('#div-environment-typeB').html(const_propCsCanvas.typeB)
    }

    //環境設定 -> 選擇圖片
    this.selectImg = function() {
        document.querySelector('#input_selectImg').click();
    }

    //其他物件 -> 編輯參數
    this.editStart = function(that){
        $('.mask').removeClass('hide')
        let div = $('<div class="input-group focus-edit">')
        let input = $('<input type="text" class="form-control" onkeyup="formFile.editKeyEnter(this)">')
        input.val(that.innerHTML)
        input.attr('old-value', that.innerHTML)
        div.append(input)
        let div2 = $('<div class="input-group-append">')
        div2.append('<button class="btn btn-danger" type="button" onclick="formFile.editEnd(this, false)"><i class="bi bi-x"></i></button>')
        div2.append('<button class="btn btn-success" type="button" onclick="formFile.editEnd(this, true)"><i class="bi bi-check"></i></button>')
        div.append(div2)
        $(that).html(div)
        input.focus().select()
    }
    //其他物件 -> 編輯參數 -> 按下enter
    this.editKeyEnter = function(that) {
        let evtobj = window.event? event : that;
        if (evtobj.keyCode === 13){ //enter
            $(that).next().find('.btn-success').click()
        }
    }
    //其他物件 -> 編輯參數 -> 確定(true) / 取消(false)
    this.editEnd = function(that, isOk) {
        let $input = $(that).parents('.input-group.focus-edit:first').find('input:first')
        let newValue = $input.val()
        let oldValue = $input.attr('old-value')
        let finalValue = (isOk) ? (newValue||newValue) : (oldValue||oldValue)
        $(that).parents('.subContent:first').html(finalValue)
        $('.mask').addClass('hide')

        //儲存並重畫
        const_propCsCanvas.saveAndReDraw()
    }
    //其他物件 -> 新增 otherOptions
    this.addOtherOptions = function(isReDraw){
        let $divs = $(''+
            '<div class="col-4 subContent otherOptions otherOptionsDesc" ondblclick="formFile.editStart(this)">標題</div>' +
            '<div class="col-4 subContent otherOptions otherOptionsValue" ondblclick="formFile.editStart(this)">v1</div>' +
            '<div class="col-3 subContent otherOptions otherOptionsHasOther"><input class="form-check-input" type="checkbox" onclick="const_propCsCanvas.saveAndReDraw();"></div>'+
            '<div class="col-1 subContent">' +
            '   <button class="icon trash" onclick="formFile.removeOtherOptions(this)"><i class="bi bi-trash"></i></button>'+
            '</div>')
        $('#list_templateDiv').append($divs)

        //手動點選畫面上的"plus"要重新畫圖
        if (isReDraw){
            //儲存並重畫
            const_propCsCanvas.saveAndReDraw()
        }
    }
    //其他物件 -> 刪除 otherOptions
    this.removeOtherOptions = function(that){
        let $p = $(that).parent()
        $p.prev().remove()
        $p.prev().remove()
        $p.prev().remove()
        $p.remove()

        //儲存並重畫
        const_propCsCanvas.saveAndReDraw()
    }

    //img to base64
    this.selectImg_getBase64 = function() {
        let file = document.querySelector('#input_selectImg').files[0];
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            const_propCsCanvas.imgSrc = reader.result
            formFile.showCsCanvas();
        };
        reader.onerror = function (error) {
            alert('讀取圖檔發生錯誤')
            console.log('Error: ', error)
        };
    }

    //切換模式
    this.switchMode = function(that, mode) {
        $('#materialList').find('.active').removeClass('active')
        $(that).addClass('active')
        objCvs.switchMode(mode)
    }

    /**
     * 新增區域物件 / 底圖物件
     * @param type [Rect, Circle, Text, drawPain]
     * @param canSelected [true=區域物件, false=底圖物件]
     */
    this.addArea = function(type, canSelected) {
        //如果是在操作模式下新增物件的話，要先切換到編輯模式
        console.log(objCvs.nowMode)
        if (objCvs.isNowMode('normal')) $('#materialList').find('.switchMode-div:eq(1)').click()
        //切換
        switch (type) {
            case 'Rect': //方形
                objCvs.addTempAreaRect(canSelected)
                break
            case 'Circle': //圓形
                objCvs.addTempAreaCircle(canSelected)
                break
            case 'Text': //文字
                objCvs.addTextObj(canSelected)
                break
            case 'drawPain': //鋼筆
                objCvs.drawPain.drawStartAndEnd(canSelected)
                break
        }
        //確認是否有上一動 / 下一動
        formFile.checkRecoverAndRedo()
    }

    //復原上一步
    this.btn_recover = function(that) {
        objCvs.log.recover()
        this.checkRecoverAndRedo()
    }
    //重作下一步
    this.btn_redo = function(that) {
        objCvs.log.redo()
        this.checkRecoverAndRedo()
    }
    //確認是否有上一動 / 下一動
    this.checkRecoverAndRedo = function() {
        //上一動
        if (objCvs.log.hasRecover()){
            $('#btn_recover').removeAttr('disabled')
        }else{
            $('#btn_recover').attr('disabled', 'disabled')
        }
        //下一動
        if (objCvs.log.hasRedo()){
            $('#btn_redo').removeAttr('disabled')
        }else{
            $('#btn_redo').attr('disabled', 'disabled')
        }
    }
}

//監聽鍵盤事件
$(document).keyup(function(e){
    var evtobj = window.event? event : e;
    //切換操作模式
    if (evtobj.keyCode == 49 && evtobj.altKey){ //alt+1
        $('#materialList').find('.switchMode-div:eq(0)').click()
    }
    //切換編輯模式
    if (evtobj.keyCode == 50 && evtobj.altKey){ //alt+2
        $('#materialList').find('.switchMode-div:eq(1)').click()
    }
    //切換變形模式
    if (evtobj.keyCode == 51 && evtobj.altKey){ //alt+3
        $('#materialList').find('.switchMode-div:eq(2)').click()
    }
    //切換排序模式
    if (evtobj.keyCode == 52 && evtobj.altKey){ //alt+4
        $('#materialList').find('.switchMode-div:eq(3)').click()
    }
    //復原上一動
    if (evtobj.keyCode == 90 && evtobj.ctrlKey){ //ctrl+z
        formFile.checkRecoverAndRedo()
    }
    //重做下一動
    if (evtobj.keyCode == 89 && evtobj.ctrlKey){ //ctrl+y
        formFile.checkRecoverAndRedo()
    }
})

$(document).click(function(){
    if (!const_propCsCanvas.sourceId) {
        return false
    }
    //確認是否有上一動 / 下一動
    formFile.checkRecoverAndRedo()
})