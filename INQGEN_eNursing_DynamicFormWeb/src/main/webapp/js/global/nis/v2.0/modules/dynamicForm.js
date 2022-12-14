!function () {
    eNursing.Nursing.extend = function (){
        var target=eNursing.extend({},arguments[0]);
        for (var i=1, len=arguments.length; i<len; i++){
            target=eNursing.extend(target, arguments[i]);
        }
        return target;
    };
    eNursing.Nursing.leftJoin = function (){
        var target = {};
        for (var i=0, len=arguments.length; i<len; i++){
            target=arguments[i];
            if (eNursing.isObject(target)) {
                for (key in this) {
                    if (target.hasOwnProperty(key)){
                        if (!eNursing.isObject(target[key])||(eNursing.isObject(target[key])&&eNursing.getModules()[key.replace(/^\S/,function(s){return s.toUpperCase();})]))
                            this[key]=target[key];
                    }
                }
            }
        }
    };
    eNursing.Nursing.clearObj = function(){
        this.leftJoin(new eNursing.getModules()[this.nodeId]());
    };

    eNursing.Nursing.commonCRUD = function (process, argument, node, action, successCall, errorCall, completeCall, rewrite) {
        eNursing.info("process: "+process);
        eNursing.info("argument: "+argument);
        var arg = this.extend(argument);
        for (i in arg){
            clearJson(arg[i]);
        }
        function clearJson(obj){
            for (key in obj){
                if (key=="add"){
                    obj[key]="clear by commonCRUD.clearJson ...";
                }else if(eNursing.isFunction(obj[key])){
                    delete obj[key];
                }else if (eNursing.isObject(obj[key])){
                    clearJson(obj[key]);
                }
            }
        }
        eNursing.info(JSON.stringify(arg));
        eNursing.info("node: "+node);
        eNursing.info("action: "+action);

        var param = {
            node: node,
            action: action
        };
        eNursing.sendMsg(process, argument, param, "", function (_data) {
            var result=_data;
            if (!eNursing.isObject(_data))
                result=JSON.parse(_data);
            if (result.resultMsg.success) {
                eNursing.info("success: "+JSON.stringify(result));
                if(eNursing.isFunction(successCall))
                    successCall(result);
            } else {
                eNursing.error("commonCRUD: "+JSON.stringify(result));
                if(eNursing.isFunction(errorCall))
                    errorCall(result);
            }
            if(eNursing.isFunction(completeCall))
                completeCall();

        }, function (error) {
            eNursing.error("commonCRUD: "+error);
            if(eNursing.isFunction(errorCall))
                errorCall(error);
        },action, rewrite);
    };
    /** @function nursing.createDynamicForm*/
    /** @function nursing.getDynamicForm*/
    function DynamicForm() {
        this.nodeId = eNursing.getFnName(DynamicForm);
        this.parentConstructor = eNursing.getModules("Patient");
        //SearchParamDF ????????????
        this.searchParamDF = new SearchParamDF();
        //String ??????
        this.formId = null;
        //String ????????????ID
        this.formVersionId = null;
        //String ????????????
        this.formType = null;
        //String ????????????
        this.formModel = null;
        //String ?????????
        this.versionNo = null;
        //String ?????????
        this.stationId = null;
        //String ??????
        this.totalScore = null;
        //Date ????????????
        this.evaluationTime = null;
        //Date ????????????
        this.createTime = null;
        //String ??????
        this.bedId = null;
        //String ?????????ID
        this.createUserId = null;
        //String ???????????????
        this.createUserName = null;
        // ArrayList<DynamicFormItem> ?????????
        this.items = [];
        //HashMap<String(itemKey), DynamicFormItem> ?????????
        this.formItems = {};
        //String ??????????????????
        this.recordPoid = null;
        //String ????????????XML??????
        this.content = null;
        //String ???????????????itemKey
        this.itemstring = null;
        //String ???????????????
        this.receiveUserId = null;
        //String ??????????????????
        this.receiveUserName = null;
        //Date ??????????????????
        this.receiveTime = null;
        //String ???????????????
        this.ofFormId = null;
        //String ???????????????CALM?????????id
        this.calmId = null;
        //String ????????????id
        this.eventIds = null;
        //String ??????ID
        this.signatureId = null;
        //String ????????????
        this.signatureName = null;
        //Date ????????????
        this.signatureDate = null;
        //String ????????????
        this.states = "Y";




        //??????dataset???template???????????????????????????
        this.datasetType={
            title             : { value:"title",             type:"string" },
            showtitle         : { value:"showTitle",         type:"boolean" },
            printshowtitle    : { value:"printShowTitle",    type:"boolean" },
            controltype       : { value:"controlType",       type:"string" },
            controlmode       : { value:"controlMode",       type:"string" },
            width             : { value:"width",             type:"string" },
            defaultvalue      : { value:"defaultValue",      type:"string" },
            backtitle         : { value:"backTitle",         type:"string" },
            typeformat        : { value:"typeFormat",        type:"string" },
            minlimit          : { value:"minLimit",          type:"string" },
            maxlimit          : { value:"maxLimit",          type:"string" },
            uidesc            : { value:"uiDesc",            type:"array[string]" },
            uiscore           : { value:"uiScore",           type:"array[float]" },
            uidescsimple      : { value:"uiDescSimple",      type:"array[string]" },
            uivalue           : { value:"uiValue",           type:"array[string]" },
            show              : { value:"show",              type:"boolean" },
            required          : { value:"required",          type:"boolean" },
            prompttips        : { value:"promptTips",        type:"string" },
            textsize          : { value:"textSize",          type:"integer" },
            maxlength         : { value:"maxlength",         type:"integer" },
            placeholder       : { value:"placeholder",       type:"string" },
            placeholderdate   : { value:"placeholderDate",   type:"string" },
            placeholdertime   : { value:"placeholderTime",   type:"string" },
            totalscoretype    : { value:"totalScoreType",    type:"string" },
            maxtotalscore     : { value:"maxTotalScore",     type:"float" },
            maxitemtotalscore : { value:"maxItemTotalScore", type:"float" },
            displaymode       : { value:"displayMode",       type:"string" },
            hasother          : { value:"hasOther",          type:"array[boolean]" },
            othertitle        : { value:"otherTitle",        type:"array[string]" },
            otherbackTitle    : { value:"otherBackTitle",    type:"array[string]" },
            otherwidth        : { value:"otherWidth",        type:"array[string]" },
            name              : { value:"name",              type:"string" },
            upload            : { value:"upload",            type:"string" },
            checked           : { value:"checked",           type:"array[boolean]"},
            toomoretext       : { value:"tooMoreText",       type:"integer" }, //??????????????????????????????
            uivalueitem       : { value:"uiValueItem",       type:"array[string]"}, //????????????????????????????????????uiDesc
            uidescitem        : { value:"uiDescItem",        type:"array[string]"},  //????????????????????????????????????uiValue

            //csCanvas
            templatediv       : { value:"templateDiv",       type:"string"},
            selectmode        : { value:"selectMode",        type:"string"},
            mouseupenable     : { value:"mouseupEnable",     type:"boolean"},

            //evaluationTime
            crashminlimit     : { value:"crashMinLimit",     type:"string" },
            crashmaxlimit     : { value:"crashMaxLimit",     type:"string" },

            //fns
            dateformat        : { value:"dateFormat",        type:"string"},
            timeformat        : { value:"dateFormat",        type:"string"},
            formtoolattribute : { value:"formToolAttribute", type:"string"}
        };

        this.datasetChange = function (key, value){
            var datasetType = this.datasetType[key];
            if (datasetType == undefined){
                return {key: key, value: value};
            }else{
                if (datasetType.type=="string"){
                    value = value.toString();
                }else if (datasetType.type=="boolean"){
                    value = (value==true||value=="true");
                }else if (datasetType.type=="integer"){
                    value = parseInt(value);
                }else if (datasetType.type=="float"){
                    value = parseFloat(value);
                }else if (datasetType.type=="array[string]"){
                    value = value.split(",");
                    for(var i=0; i<value.length; i++){
                        value[i]= value[i].toString();
                    }
                }else if (datasetType.type=="array[boolean]"){
                    value = value.split(",");
                    for(var i=0; i<value.length; i++){
                        value[i]= (value[i]==true||value[i]=="true");
                    }
                }else if (datasetType.type=="array[float]"){
                    value = value.split(",");
                    for(var i=0; i<value.length; i++){
                        value[i]= parseFloat(value[i]);
                    }
                }
                return {key: datasetType.value, value: value};
            }
        };

        // <div class="pFormItem" fns-XXX="xxx">
        // ???????????????fns???????????????itemValue
        this.doFns = function(ele, itemValue){
            var fns = this.getFns(ele);
            for ( var i=0, len=fns.length; i<len; ++i){
                var fnsName = (this.datasetType[fns[i].fnsName]) ? this.datasetType[fns[i].fnsName].value : fns[i].fnsName;
                itemValue = this.fns[fnsName](itemValue, fns[i].arguments);
            }
            return itemValue;
        };

        // <div class="pFormItem" fns-XXX="xxx">
        // ???????????????fns
        this.getFns = function(ele){
            var fns = [];
            var attrs = ele.attributes,//?????????????????????
                name,
                matchStr,
                hasSort = false;

            for(var i = 0;i<attrs.length;i++){
                //?????????fns- ?????? (ex. fns-xxx or fns-xxx-123)
                matchStr = attrs[i].name.match(/^fns-([a-z|A-Z|0-9]+)-?(.+)?/);;
                if(matchStr){
                    //fns-auto-play ?????????????????? autoPlay
                    name = matchStr[1].replace(/-([\da-z])/gi,function(all,letter){
                        return letter.toLowerCase();
                    });
                    matchStr[2] = parseFloat(matchStr[2]);
                    if (!hasSort && !isNaN(matchStr[2])){
                        hasSort = true;
                    }
                    fns.push({fnsName: name, arguments: attrs[i].value, sort: matchStr[2]});
                }
            }
            //??????
            if (fns.length>0 && hasSort){
                fns.sortJson({key:'sort',orderby:'asc'});
            }
            return fns;
        };

        this.fns={};
        //arg = (regexp/substr,replacement)
        this.fns.replace = function(v, arg){
            var args=arg.split(","), regexp=evalByReturn(args[0]), replacement=evalByReturn(args[1]);
            return v.replace(regexp, replacement);
        };
        //arg = (start,length)
        this.fns.substr = function(v, arg){
            var args=arg.split(","), start=parseInt(args[0]), length=parseInt(args[1]);
            return (v && v!="") ? v.substr(start, length) : "";
        };
        //??????????????????
        //arg = (text)
        this.fns.backTitle = function(v, arg){
            return v+arg;
        };
        //arg = (format, type[string(default), timestamp(int)])
        //type = string(ex1. 2019/10/17, ex2. 2019-10-17) / timestamp(ex1. 1280977330748)
        this.fns.dateFormat = function(v, arg){
            var args=arg.split(","), format=evalByReturn(args[0]), type=(args.length==1) ? "string" : evalByReturn(args[1]);
            // timestamp??????????????????v??????int
            v = (type=="timestamp") ? (typeof(v)=="string" && v!="") ? parseInt(v) : v : v;
            // string??????????????????v???"-"??????"/"?????????IE???????????????????????????"."????????????
            v = (typeof(v)=="string") ? v.replace(/\-/g, "/").split(".")[0] : v;

            return new Date(v).format(format);
        };

        //???items(arr)??????FormItems(json)
        this.setFormItems = function (dForm){
            var items = dForm.items;
            var formItems = {};
            for (i2=0, len2=items.length; i2<len2; i2++){
                formItems[items[i2].itemKey]={
                    "itemValue" : items[i2].itemValue,
                    "otherValue" : items[i2].otherValue
                };
            }
            dForm.formItems=formItems;
            return dForm;
        };

        /**
         * ??????????????????
         * @param {string} methodColonValue ??????+??????+?????? ex.fixed:F | F | local:sex
         * @param {json | null} itemMap ?????? form:beanName????????????null????????????????????????????????????itemMap???????????????
         * @returns {*}
         */
        this.getSystemValue = function(methodColonValue, itemMap){
            var v = methodColonValue;
            if (methodColonValue && methodColonValue.indexOf(':') > -1) {
                var vArr = methodColonValue.split(':');
                switch (vArr[0]) {
                    case 'local':
                        // ???????????? localStorage ?????????????????????
                        if (localStorage[vArr[1]] === undefined) console.error('localStorage undefined: ' + vArr[1]);
                        v = localStorage[vArr[1]];
                        break;
                    case 'form':
                        //?????????itemMap????????????????????????
                        if (!itemMap) {
                            itemMap = nursing.createGForm().setGFormItemMap({"gformItems": dynamicFormSave_getItems($("<div/>")[0], false).items}).gformItemMap;
                        }
                        // ????????????????????????bean???value
                        if (!itemMap[vArr[1]]) {
                            v = '';
                        } else {
                            v = itemMap[vArr[1]].itemValue || '';
                        }
                        break;
                    case 'eleId':
                        // ??????????????????element
                        v = $('#'+vArr[1]).val();
                        break;
                    case 'gFormData':
                        // ??????gForm??????????????????????????????????????????"???"
                        if (!gForm || !gForm.gformItemMap || !gForm.gformItemMap[vArr[1]]) {
                            if (gForm[vArr[1]]) {
                                v = gForm[vArr[1]];
                            } else {
                                v = '';
                            }
                        } else {
                            v = gForm.gformItemMap[vArr[1]].itemValue || '';
                        }
                        break;
                    case 'fixed':
                        // ????????????????????????status
                        v = vArr[1];
                        break;
                    case 'eval':
                        v = evalByReturn(vArr[1])
                        break
                    default:
                        break
                }
            }
            return v;
        };

        //??????????????????formType ????????????????????????
        this.getDynamicFormByEncIdV3 = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: dynamicFormParam.getNode(),
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.encounterId=dynamicFormParam.parent.caseno;
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.hasContent=dynamicFormParam.searchParamDF.hasContent;

            eNursing.sendMsg("dynamicFormService.getDynamicFormByEncIdV3", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var dForms = result.data;
                    if (window.console) console.log(dForms);
                    successCall(dForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);
        };

        //??????????????????formType ??????????????????????????????
        this.getLastDynamicFormByEncIdV3 = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: dynamicFormParam.getNode(),
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.encounterId=dynamicFormParam.parent.caseno;
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.hasContent=dynamicFormParam.searchParamDF.hasContent;

            eNursing.sendMsg("dynamicFormService.getLastDynamicFormByEncIdV3", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var dForms = result.data;
                    if (window.console) console.log(dForms);
                    successCall(dForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);
        };

        //???????????????????????????
        this.addOrUpdateDynamicForm = function (dynamicFormParam, successCall, errorCall) {
            dynamicFormParam.formItems={};
            var param = {
                /**????????????*/
                node: dynamicFormParam.getNode(),
                /**??????*/
                action: "add"
            };

            eNursing.sendMsg("dynamicFormService.addOrUpdateDynamicForm", [{"dynamicForm":dynamicFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    var dForms = result.data;
                    if (window.console) console.log(dForms);
                    if(dForms){
                        for (var i = 0, len = dForms.length; i < len; i++){
                            var dForm = dForms[i].dynamicForm;
                            var items = dForm.items;
                            var formItems = {};
                            for (i2=0, len2=items.length; i2<len2; i2++){
                                formItems[items[i2].itemKey]={
                                    "itemValue" : items[i2].itemValue,
                                    "otherValue" : items[i2].otherValue
                                };
                            }
                            dForm.formItems=formItems;
                        }
                        if (window.console) console.log(dForms);
                    }
                    successCall(dForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);
        };


        //??????????????????
        this.deleteDynamicForm = function (dynamicFormParam, successCall, errorCall) {
            if (confirm("???????????????????")){
                var param = {
                    /**????????????*/
                    node: dynamicFormParam.getNode(),
                    /**??????*/
                    action: "delete"
                };

                eNursing.sendMsg("dynamicFormService.deleteDynamicForm", [{"dynamicForm":dynamicFormParam}], param, "", function (result) {
                    if (result.resultMsg.success) {
                        successCall();
                    } else {
                        eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                    }
                }, errorCall);
            }
        };


        //????????????????????????UI?????????HTML???????????????
        this.getCustomFormJsp = function (formType, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "getCustomFormJsp",
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{"formType":formType}};

            eNursing.sendMsg("dynamicFormService.getCustomFormJsp", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var list = result.data[0].customFormUi;
                    if (window.console) console.log(list);
                    successCall(list);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall, false, false, "formVersion");
        };

        //??????????????????JSP??????????????????
        this.updateCustomFormJsp = function (customFormUi, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "updateCustomFormJsp",
                /**??????*/
                action: "upd"
            };

            eNursing.sendMsg("dynamicFormService.updateCustomFormJsp", [{"customFormUi":customFormUi}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var resultMsg = result.resultMsg;
                    if (window.console) console.log(resultMsg);
                    successCall(resultMsg);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall, false, false, "formVersion");
        };


        /**
         *  callBackendApi
         *  ???????????? api function ??? ??????????????????
         *
         *  @param dynamicForm      formVersion??????
         *  @param apisObjectArray  Apis????????????
         *  @param gformObject
         *  @param async            ??????true / ?????????false (?????????=??????api???????????????api???ditto??????)
         *  @param successCall      ????????????(??????)
         *  @param errorCall        ????????????(??????)
         */
        this.callBackendApi = function (dynamicForm, apisObjectArray, gformObject, async, successCall, errorCall) {
            var dy = this;
            if (gformObject === null) {
                gformObject = {};
            }
            // ?????? Apis ????????????
            for (var i = 0, len = apisObjectArray.length; i < len; ++i) {
                // ?????????????????? ditto (???????????????)
                if (apisObjectArray[i].act === 'ditto') {
                    // ????????????
                    // if (apiRecall !== undefined) {
                    //     ++apiRecall;
                    // }
                    // ????????????????????????????????? (?????????????????????????????????) (????????????)
                    if (apisObjectArray[i].paramsDynamicForm.length > 0) {
                        // ????????????????????????
                        for (var j = 0, len2 = apisObjectArray[i].paramsDynamicForm.length; j < len2; j++) {
                            // ?????????????????????
                            var formParams = apisObjectArray[i].paramsDynamicForm[j];
                            // ????????????????????????????????????
                            if (formParams.source === 'form') {

                            } else if (formParams.source === 'formItem') {

                            } else if (formParams.source === 'patBasic') {
                                gFormJS.searchParamGF[formParams.key] = GlobalClasses.patInfo["get" + formParams.value]();
                            } else if (formParams.source === 'fixed') {
                                gFormJS.searchParamGF[formParams.key] = formParams.value;
                            } else if (formParams.source === 'dateFamily') {
                                var d = new Date();
                                gFormJS.searchParamGF[formParams.key] = d.setDefaultDate(formParams.value);
                            } else if (formParams.source === 'customize') {
                                gFormJS.searchParamGF[formParams.key] = formParams.value;
                            }
                        }
                        // ??????????????????????????????
                        var keyArray = Object.keys(gFormJS.searchParamGF);
                        if (keyArray.indexOf("formType") === -1 || (keyArray.indexOf("sourceId") === -1 && keyArray.indexOf("sourceIds") === -1)) {
                            // ???????????????????????????????????????????????????
                            var errorMsg = {"success": false, "errorMsg": "??????????????????????????????formType ??? sourceId"};
                            gFormJS.searchParamGF = {};
                            errorCall(errorMsg);
                            return;
                        }
                        // ????????????????????????????????? function ????????? gForm.js => getGFormListWithCondition()
                        gFormJS.getGFormListWithCondition(gFormJS,
                            function(result) {
                                console.log(result);
                                // ??????????????????????????????
                                if (result.length > 0) {
                                    // ?????? Apis ditto ??????
                                    var hashItems = Object.keys(dynamicForm.hashItems);
                                    var dittos = apisObjectArray[i].dittos;
                                    for (var j = 0, len3 = dittos.length; j < len3; j++) {
                                        if (hashItems.indexOf(dittos[j].beanName) > -1) {
                                            if (dynamicForm.hashItems[hashItems[hashItems.indexOf(dittos[j].beanName)]].objAttr !== undefined)
                                                dittos[j].value = dynamicForm.hashItems[hashItems[hashItems.indexOf(dittos[j].beanName)]].objAttr;
                                        }
                                    }
                                    // ?????? function ????????? gForm ??????
                                    dy.settingAllBean(gformObject, result[0].gForm, dittos);
                                    // ???????????? api ??????????????????
                                    if (apiObj !== undefined) {
                                        // ?????? gForm.js => setGFormItems ??? gformItemMap????????? gformItems
                                        // ???????????? api ????????????
                                        gFormJS.setGFormItems(gformObject);
                                        apiObj.apiResults.push(result);
                                        apiObj.localTime            = new Date();
                                        apiObj.dittoGformItems      = gformObject.gformItem;
                                        apiObj.dittoGformItemMap    = gformObject.gformItemMap;
                                    }
                                    var apiObj_new = {localTime:"", apiResults: [], dittoGformItems:[], dittoGformItemMap:{}};
                                    apiObj_new.apiResults.push(result);
                                    apiObj_new.localTime            = new Date();
                                    apiObj_new.dittoGformItems      = gformObject.gformItem;
                                    apiObj_new.dittoGformItemMap    = gformObject.gformItemMap;
                                    successCall(async, apiObj_new);
                                } else {
                                    // ??????????????????????????????????????????????????????
                                    var errorMsg = {"success": false, "errorMsg": "????????????????????????"};
                                    gFormJS.searchParamGF = {};
                                    errorCall(errorMsg);
                                    return;
                                }
                            },
                            function(error) {
                                errorCall(error);
                            }
                        );
                    } else {
                        // ??????????????????
                        var dataObject  = {};
                        var hashItems   = Object.keys(dynamicForm.hashItems);
                        var dittos      = apisObjectArray[i].dittos;
                        for (var j = 0, len3 = dittos.length; j < len3; j++) {
                            if (hashItems.indexOf(dittos[j].beanName) > -1) {
                                if (dynamicForm.hashItems[hashItems[hashItems.indexOf(dittos[j].beanName)]].objAttr !== undefined){
                                    dittos[j].value = dynamicForm.hashItems[hashItems[hashItems.indexOf(dittos[j].beanName)]].objAttr;
                                }

                            }
                        }
                        // ??????????????????????????????
                        if (apisObjectArray[i].params.length > 0) {
                            // ??????????????????
                            for (var j = 0, len2 = apisObjectArray[i].params.length; j < len2; j++) {
                                // ?????????????????????
                                var params = apisObjectArray[i].params[j];
                                // ????????????????????????????????????
                                if (params.source === 'form') {

                                } else if (params.source === 'formItem') {

                                } else if (params.source === 'patBasic') {
                                    dataObject[params.key] = GlobalClasses.patInfo["get" + formParams.value]();
                                } else if (params.source === 'fixed') {
                                    dataObject[params.key] = evalByReturn(params.value);
                                } else if (params.source === 'dateFamily') {
                                    var d = new Date();
                                    dataObject[params.key] = d.setDefaultDate(params.value);
                                } else if (params.source === 'customize') {
                                    dataObject[params.key] = params.value;
                                }
                            }
                        }
                        // ajax call Api
                        $.ajax({
                            url: apisObjectArray[i].url,
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(dataObject),
                            async: true,
                            type: "post",
                            success: function(result) {
                                console.log(result);
                                // ?????? string result to json
                                if(typeof result === "string")
                                    var json = JSON.parse(result);
                                else
                                    var json = result;
                                console.log(json);
                                // ?????? function ????????? gForm ??????
                                dy.settingAllBean(gformObject, json, dittos);
                                // ???????????? api ??????????????????
                                if (apiObj !== undefined) {
                                    // ?????? gForm.js => setGFormItems ??? gformItemMap????????? gformItems
                                    // ???????????? api ????????????
                                    gFormJS.setGFormItems(gformObject);
                                    apiObj.apiResults.push(result);
                                    apiObj.localTime            = new Date();
                                    apiObj.dittoGformItems      = gformObject.gformItem;
                                    apiObj.dittoGformItemMap    = gformObject.gformItemMap;
                                }
                                var apiObj_new = {localTime:"", apiResults: [], dittoGformItems:[], dittoGformItemMap:{}};
                                apiObj_new.apiResults.push(result);
                                apiObj_new.localTime            = new Date();
                                apiObj_new.dittoGformItems      = gformObject.gformItem;
                                apiObj_new.dittoGformItemMap    = gformObject.gformItemMap;
                                successCall(async,apiObj_new);
                            },
                            error: function(error) {
                                errorCall(error);
                            }
                        });
                    }
                }
            }
        };

        /**
         *  settingAllBean
         *  ?????? objectTreeGetValue ??? objectTreeSetValue
         *  ???????????????????????????
         *
         *  @param gformObject gForm?????? (??????????????????)
         *  @param jsonObject  ???????????? (????????? api ???????????????)
         *  @param ditto       ?????????????????????????????????
         */
        this.settingAllBean = function (gformObject, jsonObject, ditto) {
            // ?????? ditto ????????????
            for (var i = 0; i < ditto.length; i++) {
                // ??????????????????
                var bean = "gformItemMap." + ditto[i].beanName + ".itemValue";
                var tree = ditto[i].value;
                // call objectTreeGetValue ?????? jsonObject ??????????????? (??????)
                var targetValue = this.objectTreeGetValue(jsonObject, tree);
                // ?????? gForm ????????????
                this.objectTreeSetValue(gformObject, bean, targetValue);
            }
        }

        /**
         *  objectTreeGetValue
         *  ??????????????? obj ???????????? tree ??????
         *
         *  @param  obj    ???????????? (????????? api ???????????????)
         *  @param  tree   ????????????
         *  @return value  ?????????
         */
        this.objectTreeGetValue = function (obj, tree) {
            // ?????????????????????
            var end;
            // console.log(obj, tree);
            // ??????????????????????????? tree ?????????????????????
            if (tree.indexOf('.') === -1) {
                // ???????????????????????????
                if (tree.indexOf('[') > -1) {
                    // ???????????? ex: a[5] >>> clsName = a, clsNum = 5
                    var clsName = tree.substring(0, tree.indexOf('['));
                    var clsNum  = tree.substring(tree.indexOf('[') + 1, tree.indexOf(']'));
                    if (obj[clsName][clsNum] === undefined) {
                        return false;
                    }
                    return obj[clsName][clsNum];
                } else {
                    return obj[tree];
                }
            }
            // ?????? tree ??????????????????
            var tpr = tree.split('.');
            var boa = false;
            // ?????????????????????????????????
            if (tpr[0].indexOf('[') > -1) {
                // ???????????? ex: a[5] >>> clsName = a, clsNum = 5??????????????????
                var clsName = tpr[0].substring(0, tpr[0].indexOf('['));
                var clsNum  = tpr[0].substring(tpr[0].indexOf('[') + 1, tpr[0].indexOf(']'));
                boa         = true;
            }
            // ?????????????????????
            if (!Array.isArray(obj)) {
                if (boa) {
                    // ????????????????????? false
                    if (obj[clsName][clsNum] === undefined) {
                        return false;
                    } else {
                        // ???????????????????????????
                        tpr.splice(0, 1);
                        tpr = tpr.join('.');
                        end = this.objectTreeGetValue(obj[clsName][clsNum], tpr);
                    }
                } else {
                    // ??????
                    var clsName = tpr[0];
                    if (obj[clsName] === undefined) {
                        return false;
                    } else {
                        tpr.splice(0, 1);
                        tpr = tpr.join('.');
                        end = this.objectTreeGetValue(obj[clsName], tpr);
                    }
                }
            } else {
                // ???????????????????????????????????????
                for (var i = 0; i < obj.length; i++) {
                    if (boa) {
                        if (obj[i][clsName][clsNum] !== undefined) {
                            tpr.splice(0, 1);
                            tpr = tpr.join('.');
                            end = this.objectTreeGetValue(obj[i][clsName][clsNum], tpr);
                            break;
                        }
                    } else {
                        var clsName = tpr[0];
                        if (obj[i][clsName] !== undefined) {
                            tpr.splice(0, 1);
                            tpr = tpr.join('.');
                            end = this.objectTreeGetValue(obj[i][clsName], tpr);
                            break;
                        }
                    }
                }
            }
            // ?????????
            return end;
        }

        /**
         *  objectTreeSetValue
         *  ????????????????????? tree ????????????(param)
         *
         *  @param obj    gForm??????(??????)
         *  @param tree   gFrom??????(??????)
         *  @param param  ????????????
         */
        this.objectTreeSetValue = function (obj, tree, param) {
            console.log(obj, tree);
            // ??????????????????????????? tree ?????????????????????
            if (tree.indexOf('.') === -1) {
                // ???????????????????????????
                if (tree.indexOf('[') > -1) {
                    // ???????????? ex: a[5] >>> clsName = a, clsNum = 5
                    var clsName = tree.substring(0, tree.indexOf('['));
                    var clsNum  = tree.substring(tree.indexOf('[') + 1, tree.indexOf(']'));
                    // ?????????????????????????????????
                    if (obj[clsName] === undefined) {
                        obj[clsName] = [];
                        for (var i = 0; i < clsNum; i++) {
                            obj[clsName].push({});
                        }
                    } else if (obj[clsName][clsNum] === undefined) {
                        var len = obj[clsName].length;
                        for (var i = 0; i < clsNum - len + 1; i++) {
                            obj[clsName].push({});
                        }
                    }
                    obj[clsName][clsNum] = param;
                } else {
                    obj[tree] = param;
                }
                return false;
            }
            // ?????? tree ??????????????????
            var tpr = tree.split('.');
            var boa = false;
            // ?????????????????????????????????
            if (tpr[0].indexOf('[') > -1) {
                // ???????????? ex: a[5] >>> clsName = a, clsNum = 5??????????????????
                var clsName = tpr[0].substring(0, tpr[0].indexOf('['));
                var clsNum  = tpr[0].substring(tpr[0].indexOf('[') + 1, tpr[0].indexOf(']'));
                boa         = true;
            }
            // ?????????????????????
            if (!Array.isArray(obj)) {
                if (boa) {
                    // ??????????????????????????????
                    if (obj[clsName] === undefined) {
                        obj[clsName] = [];
                        for (var i = 0; i < clsNum; i++) {
                            obj[clsName].push({});
                        }
                    } else if (obj[clsName][clsNum] === undefined) {
                        var len = obj[clsName].length;
                        for (var i = 0; i < clsNum - len + 1; i++) {
                            obj[clsName].push({});
                        }
                    }
                    // ????????????
                    tpr.splice(0, 1);
                    tpr = tpr.join('.');
                    this.objectTreeSetValue(obj[clsName][clsNum], tpr, param);
                } else {
                    // ??????
                    var clsName = tpr[0];
                    if (obj[clsName] === undefined) {
                        obj[clsName] = {};
                    }
                    tpr.splice(0, 1);
                    tpr = tpr.join('.');
                    this.objectTreeSetValue(obj[clsName], tpr, param);
                }
            } else {
                // ???????????????????????????????????????
                for (var i = 0; i < obj.length; i++) {
                    if (boa) {
                        if (obj[i][clsName] === undefined) {
                            obj[i][clsName] = [];
                            for (var i = 0; i < clsNum; i++) {
                                obj[i][clsName].push({});
                            }
                        }
                        tpr.splice(0, 1);
                        tpr = tpr.join('.');
                        this.objectTreeSetValue(obj[clsName][clsNum], tpr, param);
                    } else {
                        var clsName = tpr[0];
                        if (obj[i][clsName] === undefined) {
                            obj[i][clsName] = {};
                        }
                        tpr.splice(0, 1);
                        tpr = tpr.join('.');
                        this.objectTreeSetValue(obj[i][clsName], tpr, param);
                    }
                }
            }
        }

        /**
         * ??????formTool??????????????????checkbox???radio??????????????????
         * @param {Object} formToolAttribute ???????????????
         * @param {String} html ?????????????????????
         * @returns {Selector} ???????????????(jQuery Selector)
         */
        function settingFormToolAttribute(formToolAttribute, html) {
            var $html = $(html);
            // ?????????????????????????????????????????? (???????????????????????????????????????)
            if (formToolAttribute && formToolAttribute.structure) {
                var id = $html.attr('id')
                var inputType = formToolAttribute.inputType;
                // ?????????????????????FormTool??????????????????(????????????????????????Label)
                var ftStructure = JSON.parse(formToolAttribute.structure);
                var structureEle = eNursing.createElemental(ftStructure);
                var dataSet=getDataset(structureEle[0]);
                // update 2021/07/06
                // ????????????????????????????????????
                // ???????????????????????????label ?????????label??????????????????
                // ???label.h6??????????????????(???????????????array????????????)
                $html.find('.formItem').each(function (index) {
                    if (inputType) {
                        $(this).attr('type', inputType);
                    }
                    var type = $(this).attr('type');
                    var beanStructure = JSON.parse(dataSet.structure);
                    var dataStructure = beanStructure;
                    var isBefore = true;
                    var afterArr = [];
                    // radio ??? checkbox ????????????????????????????????????????????????
                    if ((type === 'radio' || type === 'checkbox') && (beanStructure[index] && beanStructure[index].div)) {
                        dataStructure = beanStructure[index].div.children;
                    }
                    for (var i = 0, len = dataStructure.length; i < len; i++) {
                        var beanElement = eNursing.createElemental(dataStructure[i])[0];
                        var beanTag = beanElement.tagName.toLowerCase();
                        switch (beanTag) {
                            case 'label':
                                if ($(beanElement).hasClass('h6')) {
                                    if (isBefore)
                                        $(this).before(beanElement);
                                    else
                                        afterArr.push(beanElement);
                                }
                                break;
                            default:
                                isBefore = false;
                                break;
                        }
                    }

                    if (afterArr.length > 0)
                        $(this).after(afterArr);

                });
                //?????????????????????accept
                $html.find('.fileFormItem').each(function (index) {
                    var type = $(this).attr('type');
                    if (type === 'file') {
                        var filetype = dataSet.filetype;
                        if(filetype) filetype = filetype.replace(/|@@|/g, ',');
                        $(this).attr("accept", filetype);
                    }
                });
                // ??????????????????????????????formTool button??????
                if ($html.attr('type') === 'button') {
                    var iconTag = '<i class="' + formToolAttribute.information + '"></i>';
                    if (formToolAttribute.style) $html.addClass(formToolAttribute.style);
                    if (formToolAttribute.iconPosition === 'before')
                        $html.prepend(iconTag);
                    else
                        $html.append(iconTag);
                }
                // ?????????????????? script ???????????? bmi
                if (formToolAttribute.script) {
                    var scripts = formToolAttribute.script;
                    var veiwId   = dataSet.bean
                    try {
                        scripts = JSON.parse(scripts);
                    } catch(e) { }
                    for (var i = 0, len = scripts.length; i < len; ++i) {
                        var type = scripts[i].type;
                        switch (type) {
                            case 'bmi':
                                // ?????? BMI kg/m^2
                                var weightBean = scripts[i].weightBean
                                var heightBean = scripts[i].heightBean
                                if (weightBean && heightBean) {
                                    $('.pFormItem[data-name="' + weightBean +'"]').find('input').blur(function() {
                                        var weight = $(this).val()
                                        window.weightTempNumber = weight
                                        if (window.heightTempNumber && window.heightTempNumber !== '') {
                                            var height = window.heightTempNumber
                                            var bmi = (weight - 0) / (((height - 0) / 100) * ((height - 0) / 100))
                                            bmi = Math.round(bmi * 100) / 100
                                            var tagName = $('.textFormItem#'+ veiwId)[0].tagName.toLowerCase()
                                            if (tagName === 'input') {
                                                $('.textFormItem#'+ veiwId).val(bmi)
                                            } else if (tagName === 'label') {
                                                $('.textFormItem#'+ veiwId).html(bmi)
                                            }
                                        }
                                    })
                                    $('.pFormItem[data-name="' + heightBean +'"]').find('input').blur(function() {
                                        var height = $(this).val()
                                        window.heightTempNumber = height
                                        if (window.weightTempNumber && window.weightTempNumber !== '') {
                                            var weight = window.weightTempNumber
                                            var bmi = (weight - 0) / (((height - 0) / 100) * ((height - 0) / 100))
                                            bmi = Math.round(bmi * 10) / 10
                                            var tagName = $('.textFormItem#'+ veiwId)[0].tagName.toLowerCase()
                                            if (tagName === 'input') {
                                                $('.textFormItem#'+ veiwId).val(bmi)
                                            } else if (tagName === 'label') {
                                                $('.textFormItem#'+ veiwId).html(bmi)
                                            }
                                        }
                                    })
                                }
                                break;
                            case 'ibw':
                                // ?????? IBW ????????????(??????)*22
                                var heightBean = scripts[i].heightBean
                                if (heightBean) {
                                    $('.pFormItem[data-name="' + heightBean +'"]').find('input').blur(function() {
                                        var height = $(this).val() - 0;
                                        var sqHeight = (height / 100) * (height / 100);
                                        var ibw = Math.round((sqHeight * 22) * 10) / 10
                                        var tagName = $('.textFormItem#'+ veiwId)[0].tagName.toLowerCase()
                                        if (tagName === 'input') {
                                            $('.textFormItem#'+ veiwId).val(ibw)
                                        } else if (tagName === 'label') {
                                            $('.textFormItem#'+ veiwId).html(ibw)
                                        }
                                    })
                                }
                                break
                            default:
                                break;
                        }
                    }
                }
            }
            return $html;
        }

        /**
         * ?????? formToolAttribute ??????
         * @param {Element} ele
         * @param {Object} tpl
         * @returns
         */
        function getFormToolAttribute(ele, tpl) {
            var tplFormToolAttribute = tpl.formToolAttribute;
            if (tplFormToolAttribute) {
                try {
                    setDataset(ele, {'formToolAttribute': tplFormToolAttribute});
                    return JSON.parse(tplFormToolAttribute);
                } catch (e) {}
            }
        }

        /**
         *
         * @param {*} formItemsTemplate
         * @param {*} $groupItems
         */
        this.setElementGroup = function (formItemsTemplate, $groupItems) {
            if (!$groupItems) {
                $groupItems = $(".group-default");
            }
            if ($groupItems && $groupItems.length > 0) {
                $groupItems.each(function () {
                    if (this.children.length > 0) return
                    var bean = getDataset(this).bean;
                    var formItemTemplate = formItemsTemplate[bean];
                    if (formItemTemplate.formToolAttribute) {
                        if (formItemTemplate.controlType === 'group') {
                            var tpl = $.extend(true, {}, formItemTemplate);
                            var formToolAttribute = getFormToolAttribute(this, tpl);
                            if (formToolAttribute && formToolAttribute.structure) {
                                var ftStructure = JSON.parse(formToolAttribute.structure);
                                var ftStructureEl = eNursing.createElemental(ftStructure);
                                var ftStructureElStr = getDataset(ftStructureEl[0]).structure;
                                var groupDivs = JSON.parse(ftStructureElStr);
                                if (groupDivs) {
                                    for (var i = 0; i < groupDivs.length; i++) {
                                        var divEl = eNursing.createElemental(groupDivs[i]);
                                        for (var i2=0, len2=divEl.length; i2<len2; ++i2){
                                            $(divEl[i2]).removeAttr("data-name");
                                        }
                                        $(this).append(divEl);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        //???template-web???????????????????????????
        //ele               ?????? $(ele).html(template-web)
        //formItemTemplate  ?????? ?????????????????????
        //formItemsTemplate ?????? ??????formVersion??????
        this.createElement = function(ele, formItemTemplate, formItemsTemplate){
            var cxt = null;
            var domain=location.origin;
            if(location.origin==undefined){
                domain=location.protocol+"//"+location.host;
            }
            domain = location.href.match((new RegExp(domain+"/[\\w-]+/")))[0];
            if (!this.checkboxCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/checkbox.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.checkboxCxt = cxt;
            }
            if (!this.radioCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/radio.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.radioCxt = cxt;
            }
            if (!this.selectCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/select.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.selectCxt = cxt;
            }
            if (!this.textCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/text.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.textCxt = cxt;
            }
            if (!this.hiddenCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/hidden.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.hiddenCxt = cxt;
            }
            if (!this.dateCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/date.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.dateCxt = cxt;
            }
            if (!this.timeCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/time.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.timeCxt = cxt;
            }
            if (!this.datetimeCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/datetime.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.datetimeCxt = cxt;
            }
            if (!this.textareaCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/textarea.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.textareaCxt = cxt;
            }
            if (!this.textareaEditorCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/textareaEditor.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.textareaEditorCxt = cxt;
            }
            if (!this.labelCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/label.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.labelCxt = cxt;
            }
            if (!this.buttonCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/button.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.buttonCxt = cxt;
            }
            if (!this.fileCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/file.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.fileCxt = cxt;
            }
            if (!this.addressTWCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/addressTW.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.addressTWCxt = cxt;
            }
            if (!this.totalScoreCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/totalScore.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.totalScoreCxt = cxt;
            }
            if (!this.signatureCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/signature.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.signatureCxt = cxt;
            }
            if (!this.echartsCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/echarts.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.echartsCxt = cxt;
            }
            if (!this.csCanvasCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/csCanvas.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.csCanvasCxt = cxt;
            }
            if (!this.evaluationTimeCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/evaluationTime.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.evaluationTimeCxt = cxt;
            }
            if (!this.externalDataCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/externalData.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.externalDataCxt = cxt;
            }
            if (!this.superLinkCxt){//??????
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/superLink.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.superLinkCxt = cxt;
            }
            if (!this.iframeCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/iframe.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.iframeCxt = cxt;
            }
            try{
                var tpl = $.extend(true, {}, formItemTemplate);
                var formToolAttribute = getFormToolAttribute(ele, tpl);
                if(tpl.controlType == 'datetime' && formToolAttribute) {
                    tpl.controlType = formToolAttribute.datetimeType;
                }
                //???data-xxx?????????template???????????????????????????????????????
                var dataset = getDataset(ele);
                for (var key in dataset){
                    if (key == "formtoolattribute") continue;
                    if (dataset.parent !== undefined) {
                        if (key == "typeformat" || key == "maxlimit" || key == "minlimit" || key == "defaultvalue") continue;
                    }
                    var datasetChange = this.datasetChange(key, dataset[key]);
                    tpl[datasetChange.key] = datasetChange.value;
                }
                //??????????????????
                for (var key in tpl){
                    if (tpl[key] != null && typeof tpl[key] === "string") {
                        tpl[key] = tpl[key].trim();
                    }
                }
                tpl.languageMode = languageMode;
                if(typeof fileSizeDesc != "undefined") {
                    tpl.fileSizeDesc = fileSizeDesc;
                }
                //????????? defaultValue ??????
                tpl.defaultValue = this.getSystemValue(tpl.defaultValue, null);
                var html = this[tpl.controlType+"Ct"](ele, tpl);
                var that = this;

                if (html!==false && html!==undefined){
                    html = html.replace(/\s+\</g, "<");
                    var $html = settingFormToolAttribute(formToolAttribute, html);
                    while ($html.find(".replaceHorFormItem").length > 0 || $html.find(".replaceVerFormItem").length > 0){
                        //????????????????????? horizontalFormItem
                        $html.find(".replaceHorFormItem").each(function(){
                            try{
                                var bean = getDataset(this).bean.trim();
                                //??????????????????????????????????????????????????????(????????????bean?????????????????????????????????)
                                if ($html.find("#div_"+bean).length>0 || $("#div_"+bean).length>0){
                                    $(this).removeClass("replaceHorFormItem").addClass("replaceHorFormItemRepeat");
                                }else{
                                    tpl = (formItemsTemplate[bean]) ? $.extend(true, {}, formItemsTemplate[bean]) : undefined;
                                    var formToolAttribute = getFormToolAttribute($html[0],tpl);
                                    if (formToolAttribute) setDataset(this, {'formToolAttribute': JSON.stringify(formToolAttribute)});
                                    //???formToolAttribute?????????template???????????????????????????????????????
                                    if (formToolAttribute) {
                                        for (var key in formToolAttribute){
                                            var datasetChange = dynamicForm.datasetChange(key, formToolAttribute[key]);
                                            tpl[datasetChange.key] = datasetChange.value;
                                        }
                                    }
                                    tpl.isHorFormItem = true;
                                    tpl.languageMode = languageMode;
                                    if(typeof fileSizeDesc!="undefined"){
                                        tpl.fileSizeDesc = fileSizeDesc;
                                    }
                                    // ???????????????group????????????structure??????html (dingTool??????)
                                    if (tpl.controlType=="group"){
                                        html = eNursing.createElemental(JSON.parse(formToolAttribute.structure))[0];
                                        var $div = $("<div/>").append(html);
                                        that.setElementGroup(formItemsTemplate, $div.find(".group-default"));
                                        that.groupCt($div.find(".pFormItemGroup")[0], tpl); //group?????????
                                        html = $div.children();
                                    }else{ //????????????
                                        if (tpl.controlType == 'datetime' && formToolAttribute)
                                            tpl.controlType = formToolAttribute.datetimeType;
                                        //replace : ?????????????????????+?????? ?????????????????????
                                        html = that[tpl.controlType+"Ct"](this, tpl);
                                        if (html!==false && html!==undefined){
                                            html = html.replace(/\s+\</g, "<");
                                            html = settingFormToolAttribute(formToolAttribute, html);
                                        }
                                    }
                                    $(this).html(html || html);
                                    $(this).removeClass("replaceHorFormItem").addClass("replaceHorFormItemOk");
                                }
                            }catch(e){
                                console.error(e);
                                that.createElementOnError({ele: this, formItemTemplate: tpl, errMsg: e});
                                $(this).removeClass("replaceHorFormItem").addClass("replaceHorFormItemError");
                                $html.replaceWith(this);
                            }
                        });
                        //????????????????????? verticalFormItem
                        $html.find(".replaceVerFormItem").each(function(){
                            try{
                                var bean = getDataset(this).bean.trim();
                                //??????????????????????????????????????????????????????(????????????bean?????????????????????????????????)
                                if ($html.find("#div_"+bean).length>0 || $("#div_"+bean).length>0){
                                    $(this).removeClass("replaceVerFormItem").addClass("replaceVerFormItemRepeat");
                                }else{
                                    tpl = (formItemsTemplate[bean]) ? $.extend(true, {}, formItemsTemplate[bean]) : undefined;
                                    var formToolAttribute = getFormToolAttribute($html[0],tpl);
                                    if (formToolAttribute) setDataset(this, {'formToolAttribute': JSON.stringify(formToolAttribute)});
                                    //???formToolAttribute?????????template???????????????????????????????????????
                                    if (formToolAttribute) {
                                        for (var key in formToolAttribute){
                                            var datasetChange = dynamicForm.datasetChange(key, formToolAttribute[key]);
                                            tpl[datasetChange.key] = datasetChange.value;
                                        }
                                    }
                                    tpl.isVerFormItem = true;
                                    tpl.languageMode = languageMode;
                                    if(typeof fileSizeDesc!="undefined"){
                                        tpl.fileSizeDesc = fileSizeDesc;
                                    }
                                    // ???????????????group????????????structure??????html (dingTool??????)
                                    if (tpl.controlType=="group"){
                                        html = eNursing.createElemental(JSON.parse(formToolAttribute.structure))[0];
                                        var $div = $("<div/>").append(html);
                                        that.setElementGroup(formItemsTemplate, $div.find(".group-default"));
                                        that.groupCt($div.find(".pFormItemGroup")[0], tpl); //group?????????
                                        html = $div.children();
                                    }else { //????????????
                                        //replace : ?????????????????????+?????? ?????????????????????
                                        html = that[tpl.controlType + "Ct"](this, tpl);
                                        if (html !== false && html !== undefined) {
                                            html = html.replace(/\s+\</g, "<");
                                            html = settingFormToolAttribute(formToolAttribute, html);
                                        }
                                    }
                                    $(this).html(html || html);
                                    $(this).removeClass("replaceVerFormItem").addClass("replaceVerFormItemOk");
                                }
                            }catch(e){
                                console.error(e);
                                that.createElementOnError({ele: this, formItemTemplate: tpl, errMsg: e});
                                $(this).removeClass("replaceHorFormItem").addClass("replaceHorFormItemError");
                                $html.replaceWith(this);
                            }
                        });
                    }
                    //ele.innerHTML = $("<div/>").append($html).html(); //??????????????????$(ele).html($html)????????????
                    $(ele).html($html || $html); // //?????????????????????<script>
                }
            }catch(e){
                console.error(e);
                this.createElementOnError({ele: ele, formItemTemplate: formItemTemplate, errMsg: e});
            }
        };

        this.createElementOnError = function(msg){
            var st="<font color='red'>";
            var template=msg.formItemTemplate;
            st+=(msg.errMsg.name=="TemplateError") ? "????????????<br/>" : "";
            st+=(msg.errMsg.message.indexOf("this.controllerType[formItemTemplate.controlType]")>-1) ? "??????????????????controlType("+((template)?template.controlType:"??????????????????:"+getDataset(msg.ele).bean)+")<br/>" : "";
            st+="</font>";
            st+="<b> beanName: </b>"+((template)?template.name+" (controlType="+template.controlType+")":"?????????????????? "+getDataset(msg.ele).bean)+"<br/>";
            st+="<b> ????????????: </b><br/>"+msg.errMsg.message.replace(/\r\n/g, "<br/>");
            $(msg.ele).html(st);
            console.log(st);
            console.log(msg);
        };
        this.checkboxCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.checkboxCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.radioCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.radioCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.selectCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.selectCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.textCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.textCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.hiddenCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.hiddenCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.dateCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                formItemTemplate.dateFormat = JSON.parse(formItemTemplate.typeFormat).date.format.replace("mm", "MM");
                if (!formItemTemplate.placeholder){
                    formItemTemplate.placeholder = formItemTemplate.dateFormat;
                }
                var html=this.dateCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.timeCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                formItemTemplate.timeFormat = JSON.parse(formItemTemplate.typeFormat).time.format.replace("hh", "HH").replace("ii", "mm");
                if (!formItemTemplate.placeholder){
                    formItemTemplate.placeholder = formItemTemplate.timeFormat;
                }
                var html=this.timeCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.datetimeCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var formTemplateTypeFormat = JSON.parse(formItemTemplate.typeFormat)
                if (formTemplateTypeFormat.date && formTemplateTypeFormat.date.format)
                    formItemTemplate.dateFormat = formTemplateTypeFormat.date.format.replace("mm", "MM");
                if (formTemplateTypeFormat.time && formTemplateTypeFormat.time.format)
                    formItemTemplate.timeFormat = formTemplateTypeFormat.time.format.replace("hh", "HH").replace("ii", "mm");
                if (!formItemTemplate.placeholderDate){
                    formItemTemplate.placeholderDate = formItemTemplate.dateFormat;
                }
                if (!formItemTemplate.placeholderTime){
                    formItemTemplate.placeholderTime = formItemTemplate.timeFormat;
                }
                var html=this.datetimeCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.textareaCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.textareaCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.textareaEditorCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.textareaEditorCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.labelCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.labelCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.buttonCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.buttonCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.fileCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.fileCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.addressTWCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var tfmt = JSON.parse(formItemTemplate.typeFormat);
                formItemTemplate.hasZipcode = tfmt.hasZipcode;
                formItemTemplate.hasCounty = tfmt.hasCounty;
                formItemTemplate.hasDistrict = tfmt.hasDistrict;
                formItemTemplate.hasStreet = tfmt.hasStreet;
                var html=this.addressTWCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }
        };

        this.totalScoreCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.totalScoreCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }else{
                return false;
            }
        };
        this.signatureCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.signatureCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }else{
                return false;
            }
        };
        this.echartsCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.echartsCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //????????????IE????????????<div>???<p>
            }else{
                return false;
            }
        };

        this.csCanvasCt = function(ele, formItemTemplate){
            formItemTemplate.options = {
                "mouseupEnable": (formItemTemplate.mouseupEnable===false) ? false : null,
                "selectMode": formItemTemplate.selectMode || null,
                "templateDiv": (formItemTemplate.templateDiv) ? JSON.parse(formItemTemplate.templateDiv) : null,
                "click": formItemTemplate.click || null,
                "change": formItemTemplate.change || null,
                "onLoad": formItemTemplate.onLoad || null,
                "onReady": formItemTemplate.onReady || null,
                "complete": formItemTemplate.complete || null
            };
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.csCanvasCxt(formItemTemplate);
                return html.replace(/\&\#34;/g, "\"");
            }
        };

        this.superLinkCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.superLinkCxt(formItemTemplate);
                return html;
            }else{
                return false;
            }
        };

        this.evaluationTimeCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var formToolAttribute = JSON.parse(formItemTemplate.formToolAttribute);

                // ?????? ex: formToolAttribute.crashMinLimit: -999y-0M-0d-0h-0m
                // minLimit = {
                //  "date": -999y-0M-0d
                //  "time": -0h-0m
                // }

                var minLimit = {
                    "date": formToolAttribute.crashMinLimit.split("d")[0]+"d",
                    "time": formToolAttribute.crashMinLimit.split("d")[1]
                };

                var maxLimit = {
                    "date": formToolAttribute.crashMaxLimit.split("d")[0]+"d",
                    "time": formToolAttribute.crashMaxLimit.split("d")[1]
                }

                formItemTemplate.crashMinLimit = JSON.stringify(minLimit);
                formItemTemplate.crashMaxLimit = JSON.stringify(maxLimit);

                var checkboxHtml = this.evaluationTimeCxt(formItemTemplate);
                $("#pageResult .title-bar").after(checkboxHtml);

                var datetimeHtml = this.datetimeCt(ele, formItemTemplate);
                return datetimeHtml;
            }else {
                return false
            }
        };

        this.externalDataCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.externalDataCxt(formItemTemplate);
                return html;
            }
        };

        /**
         * ##iframe????????????
         *
         * {
                "iframeType" : "gForm",
                "formType" : "CTHNoteApply",
                "frameModel" : "gFormWebLIST",
                "sourceId" : "local:sourceId",
                "url" : "gFormWebLIST.html",
                "aaa" : "aaa",
                "bbb" : "local:zxc"
            }
         * ####formItemTemplate.typeFormat.iframeType= gForm | normal
         * ####gForm?????????localStorage
         * ####normal?????????GET??????
         *
         */
        /**
         * ##iframe????????????
         * ####formItemTemplate.typeFormat =
         * ####gForm -> {
         *       //????????????
         *       "iframeType" : "gForm", //gForm | normal
         *       "formType" : "CTHNoteApply",
         *       "frameModel" : "gFormWebLIST",
         *       "viewModel" : "gFormWebLIST", //?????????html??????????????????url?????? gFormWebLIST | gFormWebADD | gFormWebUPD | gFormWebPRINT
         *       "sourceId" : "local:gFormWebLIST_sourceId",
         *       "url" : "gFormWebLIST.html",
         *       //???????????????????????????????????????iframe???data-attr???localStorage.key_multiLevel
         *       "aaa" : "aaa",
         *       "bbb" : "local:zxc"
         * ####}
         * ####normal -> {
         *       //????????????
         *       "iframeType" : "normal", //gForm | normal
         *       "sourceId" : "local:gFormWebADD_sourceId",
         *       "url" : "m2/pain/list",
         *       //???????????????????????????????????????iframe???data-attr???url?xxx=yyy
         *       "patientid" : "local:patientId",
         *       "encid" : "local:caseNo",
         *       "encType" : "fixed:I"
         * ####}
         * @returns {*}
         */
        this.iframeCt = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (!this.groupCheck(ele, formItemTemplate)){
                var datasetJson = {}, typeFormat = formItemTemplate.typeFormat;
                //??????json????????????1~2???
                typeFormat = ((typeof typeFormat)!=='object') ? JSON.parse(typeFormat) : typeFormat;
                typeFormat = ((typeof typeFormat)!=='object') ? JSON.parse(typeFormat) : typeFormat;
                // iframe????????????
                var newMultiLevel = "_" + eNursing.UUID(4);
                //????????????????????????
                var passParamArr = ["iframeType", "formType", "frameModel", "url", "frameModelSetting"];
                //???????????????????????????
                var failMsg = '??????????????????????????? ???????????? -> ';
                for (var key in typeFormat) {
                    if (!eNursing.isString(typeFormat[key])) continue;
                    typeFormat[key] = this.getSystemValue(typeFormat[key], null); // local:phistnum | fixed:123
                }
                //??????dataset???localStorage
                for (var key in typeFormat) {
                    var v = typeFormat[key];
                    if ((typeof v)==='object'){
                        v = JSON.stringify(v);
                    }
                    localStorage[key + newMultiLevel] = v;
                    //key????????????"-"+??????
                    datasetJson[key.replace(/([A-Z])/g, "-$1").toLowerCase()] = v.replaceToHtml();
                }
                formItemTemplate.datasetJson = datasetJson;
                if (typeFormat.url.indexOf("?")===-1) typeFormat.url+="?1=1";
                //normal??????url???GET??????
                if (typeFormat.iframeType=="normal") {
                    for (var key in typeFormat) {
                        if (!eNursing.isString(typeFormat[key])) continue;
                        typeFormat.url += "&" + key + "=" + encodeURIComponent(typeFormat[key]);
                    }
                }
                //??????gForm???url
                typeFormat.url += "&multiLevel=" + newMultiLevel;
                formItemTemplate.typeFormat = typeFormat;
                //gForm??????localStorage
                if (typeFormat.iframeType=="gForm") {
                    var gFormWebArr = ["gFormWebLIST", "gFormWebADD", "gFormWebUPD", "gFormWebPRINT"];
                    for (var i = 0, len = gFormWebArr.length; i < len; ++i) {
                        var frameModel = gFormWebArr[i];
                        //????????????????????????frameModel?????????????????????????????? localStorage.gFormWebLIST_frameModel_azxc = gFormWebLIST234
                        frameModel = (typeFormat.viewModel === frameModel) ? typeFormat.frameModel : frameModel;

                        localStorage[gFormWebArr[i] + "_formType" + newMultiLevel] = typeFormat.formType;
                        localStorage[gFormWebArr[i] + "_frameModel" + newMultiLevel] = frameModel;
                        localStorage[gFormWebArr[i] + "_frameModel_INIT" + newMultiLevel] = frameModel + "_INIT";
                        localStorage[gFormWebArr[i] + "_sourceId" + newMultiLevel] = typeFormat.sourceId;
                    }
                }
                var html=this.iframeCxt(formItemTemplate);
                return html;
            }
        };

        this.groupCt = function(ele, formItemTemplate){
            ele.style.display="none";
            $(ele).attr("data-grouptemplate", "true");
            if (formItemTemplate.parent!=undefined){
                $(ele).attr("data-parent", formItemTemplate.parent);
            }else{
                $(ele).attr("data-parent", "");
            }
            if (formItemTemplate.children!=undefined){
                $(ele).attr("data-children", formItemTemplate.children);
            }else{
                $(ele).attr("data-children", "");
            }
            //?????????grouptemplate??????????????????create
            $(ele).find(".pFormItem").each(function(){
                $(this).attr("data-grouptemplate", "true");
            });
            return false;
        };

        this.groupCheck = function(ele, formItemTemplate){
            //?????????grouptemplate??????????????????create
            if (getDataset(ele).grouptemplate=="true"){ //?????????create
                return true;
            }else{ //?????????create
                return false;
            }
        };
        this.groupIndexJSON = {};
        this.groupCreate = function(idx, groupBean, $groupEle, formItemsTemplate){
            if (thisTimeIsDittoTime && formItemsTemplate[groupBean] && formItemsTemplate[groupBean].dontDitto===true){
                return false;
            }
            var index; //group????????????
            var that=getDataset($groupEle[0]); //??????group???????????????????????????parentNode?????????????????????
            //???????????????index???
            if (that.parent==""){ //??????????????????????????????
                index = this.groupIndexJSON[groupBean];
                index = this.groupIndexJSON[groupBean] = (index==undefined) ? -1 : index;
                if (idx!=-1){ //????????? index ??????
                    this.groupIndexJSON[groupBean] = (idx>index) ? idx : index; //?????????????????????
                    index = idx;
                }else{
                    this.groupIndexJSON[groupBean] = ++index;
                }
            }else{ //?????????
                index = this.groupIndexJSON[that.parentnode+"-"+that.bean];
                index = this.groupIndexJSON[that.parentnode+"-"+that.bean] = (index==undefined) ? -1 : index;
                if (idx!=-1){ //????????? index ??????
                    this.groupIndexJSON[that.parentnode+"-"+that.bean] = (idx>index) ? idx : index; //?????????????????????
                    index = idx;
                }else{
                    this.groupIndexJSON[that.parentnode+"-"+that.bean] = ++index;
                }
            }
            //?????????????????????group[groupBean]?????????????????????
            $groupEle.each(function(){
                var that=getDataset(this);
                var beanName=that.bean.split("-")[that.bean.split("-").length-1]; //??????????????????????????????
                /**
                 * nodeId
                 * that.parent==""  ->  ???????????? nodeId ??? groupBean+"-"+index
                 * ?????????????????????????????? beanName ????????????
                 *   -> ?????? -> nodeId ??? that.nodeid
                 *   -> ?????? -> nodeId ??? that.nodeid+"-"+beanName+"-"+index
                 **/
                var nodeId = (that.parent=="") ? groupBean+"-"+index : ("-"+that.nodeid+"--".indexOf("-"+beanName+"--")>-1)? that.nodeid : that.nodeid+"-"+beanName+"-"+index; //?????????
                var parentNode = (that.parent=="") ? beanName : that.parentnode;
                //(group) ??????????????? nodeid parentnode ??? ?????? grouptemplate ????????????create
                var $groupClone = $(this).clone()
                    .css("display","")
                    .attr("data-nodeid", nodeId)
                    .attr("data-parentnode", parentNode)
                    .removeAttr("data-grouptemplate");
                dynamicForm.setElementGroup(formItemsTemplate, $groupClone);
                //????????????????????? pFormItem
                $groupClone.find(".pFormItem").each(function(){
                    var that=getDataset(this);
                    var beanName=that.bean.split("-")[that.bean.split("-").length-1]; //(pFormItem) ??????????????????????????????
                    if (formItemsTemplate[that.bean]==undefined){
                        eNursing.F2ReportErrorMsg("??????formVersion -> beanName="+that.bean+"");
                        return;
                    }
                    var parentName=formItemsTemplate[that.bean].parent;
                    if (parentName!=undefined){
                        parentName=parentName.split("-")[parentName.split("-").length-1]; //(pFormItem) ????????????????????????????????????
                        /**
                         * ?????? ?????????????????????????????? ??? ?????????(pFormItem)?????????????????????
                         *   -> ?????? -> ????????????group??????group??????????????????????????????create -> return (?????????continue)
                         *   -> ?????? -> ????????????group?????????????????????create -> ????????????
                         **/
                        if ((","+parentName+",").indexOf(","+nodeId.split("-")[nodeId.split("-").length-2]+",")==-1)
                            return;
                    }
                    //(pFormItem) ?????? nodeid parentnode ??? ?????? grouptemplate ????????????create
                    $(this).attr("data-nodeid", nodeId+"-"+beanName)
                        .attr("data-parentnode", nodeId)
                        .removeAttr("data-grouptemplate");
                    //??????beanName??????id???name??????????????? = nodeId+"-"+beanName
                    var formItemTemplate = $.extend(true, {}, formItemsTemplate[that.bean]);
                    formItemTemplate.name=nodeId+"-"+beanName;
                    //create??????
                    dynamicForm.createElement(this, formItemTemplate,formItemsTemplate);
                    //(formItem) ?????? nodeid parentnode???readOnly??????????????????divFormItem
                    $(this).find(">.divFormItem>.formItem, >.formItem.roLabelFormItem")
                        .attr("data-nodeid", nodeId+"-"+beanName)
                        .attr("data-parentnode", nodeId);
                    //??????????????????????????????????????????????????????
                    $(this).find(">.divFormItem>.divHorFormItem>.pFormItem").each(function(){
                        $(this).removeClass("replaceHorFormItemOk");
                        var that2=getDataset(this);
                        var beanName2=that2.bean.split("-")[that2.bean.split("-").length-1]; //(pFormItem) ??????????????????????????????
                        //??????beanName??????id???name??????????????? = nodeId+"-"+beanName
                        var formItemTemplate2 = $.extend(true, {}, formItemsTemplate[that2.bean]);
                        formItemTemplate2.name=nodeId+"-"+beanName2;
                        formItemTemplate2.isHorFormItem = true;
                        formItemTemplate2.languageMode = languageMode;
                        if(typeof fileSizeDesc!="undefined"){
                            formItemTemplate2.fileSizeDesc = fileSizeDesc;
                        }
                        //create??????
                        dynamicForm.createElement(this, formItemTemplate2,formItemsTemplate);
                        //(pFormItem) ?????? nodeid parentnode ??? ?????? grouptemplate ????????????create
                        $(this).attr("data-nodeid", nodeId+"-"+beanName2)
                            .attr("data-parentnode", nodeId)
                            .removeClass("replaceHorFormItem")
                            .addClass("replaceHorFormItemOk");
                        $(this).find(">.divFormItem>.formItem")
                            .attr("data-nodeid", nodeId+"-"+beanName2)
                            .attr("data-parentnode", nodeId);
                    });
                    //??????????????????????????????????????????????????????
                    $(this).find(">.divFormItem>.divVerFormItem>.pFormItem").each(function(){
                        $(this).removeClass("replaceVerFormItemOk");
                        var that2=getDataset(this);
                        var beanName2=that2.bean.split("-")[that2.bean.split("-").length-1]; //(pFormItem) ??????????????????????????????
                        //??????beanName??????id???name??????????????? = nodeId+"-"+beanName
                        var formItemTemplate2 = $.extend(true, {}, formItemsTemplate[that2.bean]);
                        formItemTemplate2.name=nodeId+"-"+beanName2;
                        formItemTemplate2.isVerFormItem = true;
                        formItemTemplate2.languageMode = languageMode;
                        if(typeof fileSizeDesc!="undefined"){
                            formItemTemplate2.fileSizeDesc = fileSizeDesc;
                        }
                        //create??????
                        dynamicForm.createElement(this, formItemTemplate2,formItemsTemplate);
                        //(pFormItem) ?????? nodeid parentnode ??? ?????? grouptemplate ????????????create
                        $(this).attr("data-nodeid", nodeId+"-"+beanName2)
                            .attr("data-parentnode", nodeId)
                            .removeClass("replaceVerFormItem")
                            .addClass("replaceVerFormItemOk");
                        $(this).find(">.divFormItem>.formItem")
                            .attr("data-nodeid", nodeId+"-"+beanName2)
                            .attr("data-parentnode", nodeId);
                    });
                });
                //????????????????????? gorup ????????? nodeid parentnode ????????????nodeid??????????????????group??????????????????
                $groupClone.find(".pFormItemGroup").each(function(){
                    var that=getDataset(this);
                    $(this).attr("data-nodeid", nodeId)
                        .attr("data-parentnode", nodeId);
                });
                $groupClone.find(".createGroupBtn").attr("data-parentnode", nodeId);
                //???group?????????????????????
                // this.parentNode.insertBefore($groupClone[0],this); //??????ie????????????$(this).before($groupClone);??????
                // this.before($groupClone[0]); //?????????ie
                $(this).before($groupClone || $groupClone); //?????????????????????<script>
            });
        };
        this.groupRemove = function($groupEle){
            $groupEle.remove();
        };

        this.setElementValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            if (formItem!=undefined && (!!formItem.itemValue || formItem!=undefined&&!!formItem.otherValue)){
                var dataset=getDataset(ele);
                var tpl = $.extend(true, {}, formItemTemplate);
                for (var key in dataset){
                    if(key==="formtoolattribute")continue;
                    var datasetChange = this.datasetChange(key, dataset[key]);
                    tpl[datasetChange.key] = datasetChange.value;
                }
                if (thisTimeIsDittoTime && tpl.dontDitto===true){ //???ditto????????????????????????????????????ditto?????????
                    return false;
                }
                var formItem2 = $.extend(true, {}, formItem);
                formItem2.itemValue = this.doFns(ele, formItem2.itemValue);
                this[tpl.controlType+"SetValue"](ele, formItem2, tpl, formItemMap, formItemTemplateMap);
            }
        };

        this.checkboxSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue.split(",");
            var otherValue = (fi.otherValue==undefined)?["&nbsp;"]:fi.otherValue.split("|");
            var html = "";
            for (var i=0, len=itemValue.length; i<len; i++){
                var eleIndex = tp.uiValue.indexOf(itemValue[i]);
                var eleId = tp.name+"_"+eleIndex;
                if (tp.controlMode=="readOnly"){
                    html+="|,|"+tp.uiDesc[eleIndex];
                    html+=(otherValue[i]=="&nbsp;" || otherValue[i]=="") ? "" : ":"+otherValue[i];
                }else{
                    var eleOtherText = $(ele).find("#"+eleId+"_otherText");
                    var $eleTarget = $(ele).find("#"+eleId);
                    if ($eleTarget.length>0 && !$eleTarget[0].checked){
                        $eleTarget.click();
                    }
                    if (eleOtherText.length!=0)
                        eleOtherText.val(otherValue[i]).change();
                }
            }
            if (tp.controlMode=="readOnly"){
                if (html!=""){
                    if (tp.displayMode=="vertical"){
                        html=html.substring(3).replace(/\|\,\|/g, "<br/>");
                    }else{
                        html=html.substring(3).replace(/\|\,\|/g, ",");
                    }
                }
                $(ele).find("#"+tp.name).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", (fi.otherValue==undefined)?"":fi.otherValue)
                    .html(html).change();
            }
        };

        this.radioSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var eleIndex = tp.uiValue.indexOf(itemValue);
            var eleId = tp.name+"_"+eleIndex;
            if (tp.controlMode=="readOnly"){
                var html = (otherValue=="") ? tp.uiDesc[eleIndex] : tp.uiDesc[eleIndex]+":"+otherValue;
                $(ele).find("#"+tp.name).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", (fi.otherValue==undefined)?"":fi.otherValue)
                    .html(html).change();
            }else{
                var eleOtherText = $(ele).find("#"+eleId+"_otherText");
                var $eleTarget = $(ele).find("#"+eleId);
                var $eleTargetLabel = $(ele).find("#label_"+eleId);
                if ($eleTarget.length>0 && !$eleTarget[0].checked){
                    $eleTargetLabel.click();
                    //ie ????????????????????????????????????????????????label??????????????????
                    if (!$eleTarget[0].checked) {
                        $eleTarget.prop('checked', true).click();
                    }
                }
                if (eleOtherText.length!=0)
                    eleOtherText.val(otherValue).change();
            }
        };

        this.selectSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var eleIndex = tp.uiValue.indexOf(itemValue);
            var eleId = tp.name+"_"+eleIndex;
            if (tp.controlMode=="readOnly"){
                var html = (otherValue=="") ? tp.uiDesc[eleIndex] : tp.uiDesc[eleIndex]+":"+otherValue;
                $(ele).find("#"+tp.name).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", (fi.otherValue==undefined)?"":fi.otherValue)
                    .html(html).change();
            }else{
                var eleOtherText = $(ele).find("#"+eleId+"_otherText");
                $(ele).find("#"+eleId).attr("selected",true).change();
                if (eleOtherText.length!=0)
                    eleOtherText.val(otherValue).change();
            }
        };

        this.textSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;

            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else
                $(ele).find("#"+eleId).val(itemValue).change().keyup().blur();
        };

        this.totalScoreSetValue = function (ele, formItem, formItemTemplate) {
            var fi = formItem;
            var tp = formItemTemplate;
            var score = fi.itemValue;
            var formToolAttribute = tp.formToolAttribute;
            var scoreLabel = $("#label_" + tp.name);
            var desc=score;
            if (formToolAttribute) {
                formToolAttribute=JSON.parse(formToolAttribute);
                var scoreRule = formToolAttribute.scoreRule;
                scoreRule = (scoreRule && ((typeof scoreRule)==='string')) ? JSON.parse(scoreRule) : scoreRule;
                if (scoreRule.length > 0) {
                    for (var i = 0; i < scoreRule.length; i++) {
                        var max = $(scoreRule[i]).attr("max-limit");
                        var min = $(scoreRule[i]).attr("min-limit");
                        var color = $(scoreRule[i]).attr("rule-color") || $(scoreRule[i]).attr("ruleColor");
                        var warn = $(scoreRule[i]).attr("warning-text");
                        if (parseInt(score) >= parseInt(min) && parseInt(score) <= parseInt(max)) {
                            desc = score + " " + warn;
                            scoreLabel.css("color", color);
                            break;
                        }
                    }
                }
            }
            scoreLabel.html(desc || desc);
        };

        this.hiddenSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else
                $(ele).find("#"+eleId).val(itemValue).change();
        };

        this.dateSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            var $e = $(ele).find("#"+eleId);

            if (tp.controlMode=="readOnly")
                $e.attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else{
                //?????????upd??????????????????????????????????????????????????????????????????????????? (?????????????????????)
                var isChangeLimit = false;
                if ((!tp.minLimit && !tp.maxLimit) && itemValue){ //?????????????????????????????????????????????itemValue???????????????
                    if (thisTimeIsGform){ //gForm
                        if (gForm && gForm.status==="Y") isChangeLimit = true;
                    }else{
                        try {
                            if (dForm && dForm.states==="Y") isChangeLimit = true;
                        }catch (err) {
                            console.error(err);
                        }
                    }
                    if (isChangeLimit){
                        var limit = {};
                        var typeFormat = JSON.parse(tp.typeFormat).date;
                        typeFormat.format = typeFormat.format.replace("mm", "MM");
                        var value = (typeFormat.format+"").replace(/(yyyy)*[\-]*(MM)*[\-]*(dd)*/, function(st,y,m,d){
                            var arr=itemValue.split("-");
                            var i=0;
                            var st = "";
                            var yyyy = new Date().format("yyyy");
                            var MM = new Date().format("MM");
                            var dd = new Date().format("dd");
                            st += (y==undefined) ? yyyy+"/" : arr[i++]+"/";
                            st += (m==undefined) ? MM+"/" : arr[i++]+"/";
                            st += (d==undefined) ? dd : arr[i++];
                            return st;
                        });
                        limit = {"default":true,"date":value.replace(/\//g, "-")};
                        $e.attr({
                            "data-minlimit" : JSON.stringify(limit),
                            "data-maxlimit" : JSON.stringify(limit)
                        });
                    }
                }

                $e.val(itemValue).change().blur();
            }

        };

        this.timeSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            var $e = $(ele).find("#"+eleId);
            if (tp.controlMode=="readOnly")
                $e.attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else
                $e.val(itemValue).change().blur();
        };

        this.datetimeSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            var $e = $(ele).find("#"+eleId);
            var $date=$(ele).find("#"+eleId+"_date");
            var $time=$(ele).find("#"+eleId+"_time");
            if (tp.controlMode=="readOnly")
                $e.attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else{
                //?????????upd??????????????????????????????????????????????????????????????????????????? (?????????????????????)
                var isChangeLimit = false;
                if (!tp.minLimit) {
                    tp.minLimit=$date.data("minlimit");
                }
                if (!tp.maxLimit) {
                    tp.maxLimit = $date.data("maxlimit");
                }
                if ((!tp.minLimit && !tp.maxLimit)
                    && itemValue && itemValue!==" "
                    && itemValue.split(" ")[0]!==""
                ){ //?????????????????????????????????????????????itemValue???????????????
                    if (thisTimeIsGform){ //gForm
                        if (gForm && gForm.status==="Y") isChangeLimit = true;
                    }else{
                        if (dForm && dForm.states==="Y") isChangeLimit = true;
                    }
                    if (isChangeLimit){
                        var limit;
                        var typeFormat = JSON.parse(tp.typeFormat).date;
                        typeFormat.format = typeFormat.format.replace("mm", "MM");
                        var value = (typeFormat.format+"").replace(/(yyyy)*[\-]*(MM)*[\-]*(dd)*/, function(st,y,m,d){
                            var arr=itemValue.split(" ")[0].split("-");
                            var i=0;
                            var st = "";
                            var yyyy = new Date().format("yyyy");
                            var MM = new Date().format("MM");
                            var dd = new Date().format("dd");
                            st += (y===undefined) ? yyyy+"/" : arr[i++]+"/";
                            st += (m===undefined) ? MM+"/" : arr[i++]+"/";
                            st += (d===undefined) ? dd : arr[i++];
                            return st;
                        });
                        limit = {"default":true,"date":value.replace(/\//g, "-")};
                        limit.time = "00:00";
                        $date.attr("data-minlimit", JSON.stringify(limit));
                        $time.attr("data-minlimit", JSON.stringify(limit));
                        limit.time = "23:59";
                        $date.attr("data-maxlimit", JSON.stringify(limit));
                        $time.attr("data-maxlimit", JSON.stringify(limit));
                    }
                }

                $e.val(itemValue).change();
            }

            $date.change();
            $time.change();
        };

        this.textareaSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else
                $(ele).find("#"+eleId).val(itemValue).change();
        };

        this.textareaEditorSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId)[0].src = "data:text/html;charset=utf-8," + itemValue;
            else{
                //?????????iframe?????????????????? contentWindow ??????ready
                try {
                    $(ele).find("#"+eleId)[0].contentWindow.$('#file_content').val(fi.itemValue).change();
                }catch(e){
                    window["textareaEditor_setDefaultValue_textareaEditor"] = function(){
                        $(ele).find("#"+eleId)[0].contentWindow.$("#file_content").val(itemValue).change();
                    }
                }
            }
        };

        this.labelSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            $(ele).find("#label_"+eleId).attr("data-itemvalue", fi.itemValue)
                .attr("data-othervalue", "")
                .html(itemValue).change();
        };

        this.buttonSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
        };

        this.fileSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                .attr("data-othervalue", "")
                .val(itemValue).change();
            if($("#uiBtn_"+eleId).length==1){
                var fileInfos;
                if (itemValue=="") {
                    fileInfos = [];
                } else {
                    fileInfos = JSON.parse(itemValue);
                }
                $("#uiBtn_"+eleId).append("   <a>("+fileInfos.length+")</a>")
            }
        };

        this.addressTWSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else{
                try{
                    $(ele).find("#"+eleId).val(itemValue).change(); //?????? this.addressTWOnChange
                    this.addressTWOnChange($(ele).find("#"+eleId)[0]);
                    // nursing.getDynamicForm().addressTWOnChange($(ele).find("#"+eleId)[0]);
                }catch(e){
                    console.error(e);
                }

            }
        };
        this.signatureSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            if (itemValue) {
                var eleId = tp.name;
                $(ele).find("#"+eleId)
                    .attr("data-itemvalue", itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
                var showArea=$(ele).find("#label_"+eleId)
                var imageData=itemValue.split("@")
                for (var i = 0; i < imageData.length; i++) {
                    var image = new Image()
                    image.style.width='200px'
                    image.src = imageData[i];
                    $(image).appendTo(showArea)
                }
            }
        };
        this.echartsSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = fi.otherValue;
            $(ele).find("#"+tp.name).attr("data-option",itemValue);
            $(ele).find("#"+tp.name).attr("data-echarttype",otherValue);
            if($.editEchartsTools){
                $.editEchartsTools.init( $(ele).find("#"+tp.name));
            }
        };

        this.csCanvasSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var eleId = tp.name;
            if (tp.controlMode=="text") {
                var showValue = fi.itemValue + ((fi.otherValue) ? ((fi.itemValue) ? "," : "")+fi.otherValue.replace(/\|:\|/g, ":") : "");
                $(ele).find("#" + eleId).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", otherValue)
                    .html(showValue).change();
            }else{
                try{
                    var param = formItemMap[eleId+"_csCanvasParam"].itemValue;
                    //?????? ???????????????????????? or ?????????????????????????????????????????????????????????
                    if ($(ele).find("#"+eleId).attr("data-cs-canvas-param") !== param){
                        $(ele).find("#"+eleId)[0].changeCsCanvasProp(param, itemValue, otherValue);
                    }else{//??????
                        $(ele).find("#"+eleId)[0].csCanvas.doSetDefaultValue(itemValue, otherValue);
                    }
                }catch(e){
                    console.error(e);
                }
            }
        };

        this.evaluationTimeSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            formItem.itemValue = formItem.itemValue.replace(/\//g, '-');
            // ????????????????????????
            this.datetimeSetValue(ele, formItem, formItemTemplate);

            // ??????????????????????????????
            var tpName=formItemTemplate.name;
            var checkboxItem = formItemMap.evaluationTimeMendCheck;
            var $eleTarget = $('#' + tpName + 'Checkbox');
            $eleTarget.prop("checked", checkboxItem && checkboxItem.itemValue === 'Y').change();
        };

        this.externalDataSetValue = function(ele, formItem, formItemTemplate, formItemMap, formItemTemplateMap){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var eleId = tp.name;
            var $e = $(ele).find("#"+eleId);
            if (tp.controlMode=="readOnly")
                $e.attr("data-itemvalue", itemValue)
                    .attr("data-othervalue", otherValue)
                    .html(itemValue).change();
            else {
                $(ele).find("#"+eleId+"_otherText").val(otherValue);
                $e.val(itemValue).change();
            }
        };

        this.addressTWOnChange = function(ele){
            var eleId = ele.id;
            var itemValue = ele.value;
            var $targetEle = $(ele).parent();
            try{
                var addrJson = this.addressTWGetOption(itemValue);
                $targetEle.find("#"+eleId+"_Zipcode").val(addrJson.zipcode).change();
                $targetEle.find("#"+eleId+"_County").val(addrJson.county).change();
                if (addrJson.county!==""){
                    $targetEle.find("#"+eleId+"_District").val(addrJson.district).change();
                }
                $targetEle.find("#"+eleId+"_Street").val(addrJson.street).change();
            }catch(e){
                console.error(e);
            }
        };
        // return ?????? json {zipcode, county, district, street}
        // ??????"zipcode"????????????3???????????????5?????????????????????????????????????????????????????????3??????????????????
        this.addressTWGetOption = function(address){
            var addrSet = twzipcode32_defaults,
                addrCode = twzipcode32_data,
                zipcode = "",county = "",district = "",street = "",
                cty = "",
                addrJson = {"zipcode" : "---", "county" : "", "district" : "", "street" : ""};
            if (address && address!=""){
                address = address.trim();
                address = address.replace("??????", "??????").replace("??????", "??????");
                address = address.replace("??????", "??????").replace("??????", "??????");
                address = address.replace("???", "???");
                //??????????????????
                zipcode = address.match(/^[0-9\-]+/);
                if (zipcode){
                    addrJson.zipcode = zipcode[0];
                    address = address.substr(addrJson.zipcode.length);
                }
                //????????????
                for (cty in addrCode){
                    var idx = address.indexOf(cty);
                    if (idx!=-1){
                        addrJson.county = cty;
                        address = address.substr(0, idx) + address.substr(idx+cty.length, address.length);
                        break;
                    }
                }
                //??????????????????
                if (addrJson.county!==""){
                    //??????????????????????????????+????????????
                    $.ajax({
                        url: (addrSet.root + addrSet.data + addrCode[addrJson.county].CODE + '.js?' + (new Date().getTime())),
                        type: 'GET',
                        async: false,
                        global: false,
                        cache: true,
                        dataType: 'JSON'
                    }).done(function (resp) {
                        //??????????????????
                        if (undefined !== resp[0]) {
                            //??????????????????
                            for (district in resp[0]) {
                                if (resp[0].hasOwnProperty(district)) {
                                    var idx = address.indexOf(district);
                                    if (idx!=-1){
                                        addrJson.district = district;
                                        address = address.substr(0, idx) + address.substr(idx+district.length, address.length);
                                        break;
                                    }
                                }
                            }
                            //??????????????????
                            addrJson.street = address;
                            //(??????3??????5???????????????)
                            //?????? district ??????????????????
                            //?????? zipcode ??????"---"????????????
                            if (addrJson.district !=="" && addrJson.zipcode==="---"){
                                var fiveZipcode = "";
                                //?????????????????????5???????????????
                                for (street in resp[0][addrJson.district]){
                                    if (resp[0][addrJson.district].hasOwnProperty(street)) {
                                        var idx = address.indexOf(street);
                                        if (idx!=-1){
                                            //????????????????????????????????????????????????????????????
                                            fiveZipcode = resp[0][addrJson.district][street][0][1];
                                            break;
                                        }
                                    }
                                }
                                if (fiveZipcode!==""){
                                    addrJson.zipcode = fiveZipcode;
                                }else{
                                    //???????????????3???????????????
                                    var code_district_arr = [];
                                    for (street in resp[0][addrJson.district]){
                                        var code_arr = resp[0][district][street];
                                        for (var i=0, len=code_arr.length; i<len; ++i){
                                            var code = code_arr[i][1].substr(0,3);
                                            if (code_district_arr.indexOf(code)==-1){
                                                code_district_arr.push(code);
                                            }
                                        }
                                    }
                                    //????????????????????????3???????????????????????????????????????"---"
                                    addrJson.zipcode = (code_district_arr.length===1) ? code_district_arr[0] : "---";
                                }
                            }
                        }
                    });
                }else{
                    console.error("?????????county!");
                    console.error("address="+address);
                    addrJson.street = address;
                }
            }
            return addrJson;
        };

        //?????????????????? (??????)
        this.showElementUiDesc_Print = function($pFormItem, $pFormItemGroup, dfTemplate, itemMaps){
            var dfItems = dfTemplate.items;
            var dfHashItems = dfTemplate.hashItems;
            //??????group
            if ($pFormItemGroup && $pFormItemGroup.length>0){
                $pFormItemGroup.each(function() {
                    var bean = getDataset(this).bean;
                    dynamicForm.createElement(this, dfHashItems[bean]);
                });
                //??????Gorup???Items
                var groupItems = setElementValue_GetGroupItems(dfItems, itemMaps);
                //??????Gorup?????????
                setElementValue_CreateGroupElement($pFormItemGroup.selector, dfHashItems, groupItems);
                $pFormItem = $($pFormItem.selector);
            }

            //??????
            $pFormItem.each(function() {
                var that=getDataset(this);
                var bean=that.bean;
                var nodeId=that.nodeid;
                if (nodeId){ //group
                    dynamicForm.showElementUiDesc(this, itemMaps[nodeId], dfHashItems[bean], itemMaps);
                }else{ //????????????
                    dynamicForm.showElementUiDesc(this, itemMaps[bean], dfHashItems[bean], itemMaps);
                }
            });

        };

        //??????????????????
        this.showElementUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tpl = undefined;
            if (formItemTemplate!=undefined){
                tpl = $.extend(true, {}, formItemTemplate);
                //???data-xxx?????????template???????????????????????????????????????
                var dataset=getDataset(ele);
                for (var key in dataset){
                    var datasetChange = this.datasetChange(key, dataset[key]);
                    tpl[datasetChange.key] = datasetChange.value;
                }
            }

            //file??????ele.innerHTML???????????????
            if (tpl!=undefined && tpl.controlType=="file") {
                this.elementUiDescFormat(ele, formItem, tpl, itemMaps);
            }else if (tpl!=undefined && tpl.controlType=="echarts"){
                this.elementUiDescFormat(ele, formItem, tpl, itemMaps);
            }else if (tpl!=undefined && tpl.controlType=="iframe"){
                this.createElement(ele, tpl, null);
            }else if (tpl!=undefined && tpl.controlType=="externalData"){
                this.elementUiDescFormat(ele, formItem, tpl, itemMaps);
            }else{
                ele.innerHTML=this.elementUiDescFormat(ele, formItem, tpl, itemMaps);
            }
        };

        //format????????????
        this.elementUiDescFormat = function(ele, formItem, formItemTemplate, itemMaps){
            var tempFormItem = {
                "itemKey": "???",
                "itemValue": ""
            };
            if (formItemTemplate==undefined) {
                return "";
            }else{
                if (formItem === undefined) {
                    formItem = tempFormItem;
                    formItem.itemKey = formItemTemplate.name;
                }
                var dataset=getDataset(ele);
                var tpl = $.extend(true, {}, formItemTemplate);
                //??????data-name????????????name?????????????????????tpl?????????  ex.??????????????????ele??????????????????????????????????????????????????????????????????????????????????????????????????????
                if (!dataset.name || (dataset.name && dataset.name===tpl.name)) {
                    for (var key in dataset) {
                        var datasetChange = this.datasetChange(key, dataset[key]);
                        tpl[datasetChange.key] = datasetChange.value;
                    }
                }
                tpl.languageMode = languageMode;
                var formItem2 = $.extend(true, {}, formItem);
                formItem2.itemValue = this.doFns(ele, formItem2.itemValue);
                return this[tpl.controlType+"ShowUiDesc"](ele, formItem2, tpl, itemMaps);
            }
        };

        this.checkboxShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue.split(",");
            var otherValue = (fi.otherValue==undefined)?[""]:fi.otherValue.split("|");
            var otherItemsHor = [];
            var otherItemsVer = [];
            var otherItemsVer_idx = [];
            var formTemplateMaps = dynamicFormTemplate.hashItems;
            var uiDesc="";
            if(formItemTemplate.horizontalFormItem!=null){
                otherItemsHor = formItemTemplate.horizontalFormItem.split("|,|");
            }
            if(formItemTemplate.verticalFormItem!=null){
                otherItemsVer = formItemTemplate.verticalFormItem.split("|,|");
            }
            for (var i=0, len=itemValue.length; i<len; ++i){
                otherValue[i] = (otherValue[i]==undefined)?"":otherValue[i];
                var eleIndex = tp.uiValue.indexOf(itemValue[i]);
                if (eleIndex!=-1){
                    uiDesc+=(tp.displayMode=="vertical" ? "<br/>" : ",")+tp.uiDesc[eleIndex];
                }
                if (otherValue[i]!=""){uiDesc+=":"+(tp.otherTitle && tp.otherTitle[eleIndex]?tp.otherTitle[eleIndex]:'')+otherValue[i]+(tp.otherBackTitle && tp.otherBackTitle[eleIndex]?tp.otherBackTitle[eleIndex]:'');}
                if (eleIndex!=-1 && itemMaps){
                    //????????????
                    if(otherItemsHor.length>0 && otherItemsHor[eleIndex]){
                        var otherItemsArr = otherItemsHor[eleIndex].split(",");
                        var oUiDesc = "";
                        for (var i2=0, len2=otherItemsArr.length; i2<len2; ++i2){
                            if(itemMaps[otherItemsArr[i2]]!=null && formTemplateMaps[otherItemsArr[i2]]!=null){
                                var oFormItem = itemMaps[otherItemsArr[i2]];
                                var oTpl = formTemplateMaps[otherItemsArr[i2]];
                                oTpl.isHorizontal = true;
                                var oUiDesc2 = this.elementUiDescFormat(ele, oFormItem, oTpl, itemMaps);
                                oUiDesc += (oUiDesc2!="") ? ","+oUiDesc2 : "";
                            }
                        }
                        uiDesc+=(oUiDesc!="") ? "("+oUiDesc.substr(1)+")" : "";
                    }
                    //????????????
                    otherItemsVer_idx[otherItemsVer_idx.length]=eleIndex;
                }
            }
            //????????????
            if(otherItemsVer.length>0 && itemMaps){
                for (var i2=0, len2=otherItemsVer_idx.length; i2<len2; ++i2){
                    var otherItemsArr = otherItemsVer[otherItemsVer_idx[i2]].split(",");
                    var oUiDesc = "";
                    for (var i2=0, len2=otherItemsArr.length; i2<len2; ++i2){
                        if(itemMaps[otherItemsArr[i2]]!=null && formTemplateMaps[otherItemsArr[i2]]!=null){
                            var oFormItem = itemMaps[otherItemsArr[i2]];
                            var oTpl = formTemplateMaps[otherItemsArr[i2]];
                            oTpl.isVertical = true;
                            var oUiDesc2 = this.elementUiDescFormat(ele, oFormItem, oTpl, itemMaps);
                            oUiDesc += (oUiDesc2!="") ? "<br/>"+oUiDesc2 : "";
                        }
                    }
                    uiDesc+=(oUiDesc!="") ? oUiDesc : "";
                }
            }
            if (uiDesc!="" && tp.displayMode=="vertical"){
                uiDesc = uiDesc.substr(5); //<br/>
            }else if (uiDesc != ""){ //horizontal
                uiDesc = uiDesc.substr(1); //,
            }
            tempFormToolAttributeSetting()
            return (uiDesc!="") ? ((tp.showTitle ? (tp.title + ':') : '') + uiDesc + (tp.backTitle || '')) : "";

            /**
             * ????????????????????????????????????
             * ??????????????????
             * @returns {boolean}
             */
            function tempFormToolAttributeSetting() {
                if (!formItemTemplate.formToolAttribute) return false;
                var formToolAttribute   = JSON.parse(formItemTemplate.formToolAttribute);
                if (!formToolAttribute.structure) return false;
                var structure           = JSON.parse(formToolAttribute.structure);
                var beanElement         = eNursing.createElemental(structure)[0];
                var beanStructure;
                if(beanElement && beanElement.dataset && beanElement.dataset.structure){
                    beanStructure       = beanElement.dataset.structure;
                }
                if (!beanStructure) return false;
                var insideStructure     = JSON.parse(beanStructure);
                var insideElements      = eNursing.createElemental(insideStructure)
                var isBackTitle         = false;
                for (var i = 0, len = insideElements.length; i < len; ++i) {
                    if (!insideElements[i]) continue;
                    var childInsideElement = insideElements[i].children
                    for (var j = 0, len2 = childInsideElement.length; j < len2; ++j) {
                        if (childInsideElement[j].tagName.toLowerCase() === 'input')
                            isBackTitle = true;
                        if (childInsideElement[j].tagName.toLowerCase() === 'label' && $(childInsideElement[j]).hasClass('h6') && childInsideElement[j].textContent.trim()) {
                            if (isBackTitle === false)
                                uiDesc = childInsideElement[j].textContent + uiDesc;
                            else
                                uiDesc += childInsideElement[j].textContent;
                        }
                    }
                }
            }
        };

        this.radioShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var otherItemsHor = [];
            var otherItemsVer = [];
            var formTemplateMaps = dynamicFormTemplate.hashItems;
            var uiDesc="";
            var eleIndex = tp.uiValue.indexOf(itemValue);
            if (eleIndex!=-1) {
                uiDesc = tp.uiDesc[eleIndex];
                if (otherValue != "")
                    uiDesc += ":"+ (tp.otherTitle && tp.otherTitle[eleIndex] ? tp.otherTitle[eleIndex] : '') + otherValue + (tp.otherBackTitle && tp.otherBackTitle[eleIndex] ? tp.otherBackTitle[eleIndex] : '');
                if (formItemTemplate.horizontalFormItem != null) {
                    otherItemsHor = formItemTemplate.horizontalFormItem.split("|,|");
                }
                if (formItemTemplate.verticalFormItem != null) {
                    otherItemsVer = formItemTemplate.verticalFormItem.split("|,|");
                }
                //????????????
                if (otherItemsHor.length > 0 && otherItemsHor[eleIndex] && itemMaps) {
                    var otherItemsArr = otherItemsHor[eleIndex].split(",");
                    var oUiDesc = "";
                    for (var i2 = 0, len2 = otherItemsArr.length; i2 < len2; ++i2) {
                        if (itemMaps[otherItemsArr[i2]] != null && formTemplateMaps[otherItemsArr[i2]] != null) {
                            var oFormItem = itemMaps[otherItemsArr[i2]];
                            var oTpl = formTemplateMaps[otherItemsArr[i2]];
                            var oUiDesc2 = "";
                            //???????????????itemValue?????????????????????
                            if (oFormItem.itemValue==="") {
                                console.log("?????? "+tp.title+"-"+fi.itemValue+"("+fi.itemKey+") ???????????? "+oTpl.title+"("+oTpl.name+") ???????????????????????????", "\nformItem:", fi, "\nformItemTemplate:", tp, "\notherFormItem:", oFormItem, "\notherFormItemTemplate:", oTpl);
                            }else{
                                oUiDesc2 = this.elementUiDescFormat(ele, oFormItem, oTpl, itemMaps);
                            }
                            oUiDesc += (oUiDesc2 != "") ? "," + oUiDesc2 : "";
                        }
                    }
                    uiDesc += (oUiDesc != "") ? "(" + oUiDesc.substr(1) + ")" : "";
                }
                //????????????
                if (otherItemsVer.length > 0 && itemMaps) {
                    var otherItemsArr = otherItemsVer[eleIndex].split(",");
                    var oUiDesc = "";
                    for (var i2 = 0, len2 = otherItemsArr.length; i2 < len2; ++i2) {
                        if (itemMaps[otherItemsArr[i2]] != null && formTemplateMaps[otherItemsArr[i2]] != null) {
                            var oFormItem = itemMaps[otherItemsArr[i2]];
                            var oTpl = formTemplateMaps[otherItemsArr[i2]];
                            var oUiDesc2 = this.elementUiDescFormat(ele, oFormItem, oTpl, itemMaps);
                            oUiDesc += (oUiDesc2 != "") ? "<br/>" + oUiDesc2 : "";
                        }
                    }
                    uiDesc += (oUiDesc != "") ? oUiDesc : "";
                }
            }
            tempFormToolAttributeSetting()
            return (uiDesc!="") ? ((tp.showTitle ? (tp.title + ':') : '') + uiDesc + (tp.backTitle || '')) : "";

            /**
             * ????????????????????????????????????
             * ??????????????????
             * @returns {boolean}
             */
            function tempFormToolAttributeSetting() {
                if (!formItemTemplate.formToolAttribute) return false;
                var formToolAttribute   = JSON.parse(formItemTemplate.formToolAttribute);
                if (!formToolAttribute.structure) return false;
                var structure           = JSON.parse(formToolAttribute.structure);
                var beanElement         = eNursing.createElemental(structure)[0];
                var beanStructure;
                if(beanElement && beanElement.dataset && beanElement.dataset.structure){
                    beanStructure       = beanElement.dataset.structure;
                }
                if (!beanStructure) return false;
                var insideStructure     = JSON.parse(beanStructure);
                var insideElements      = eNursing.createElemental(insideStructure)
                var isBackTitle         = false;
                for (var i = 0, len = insideElements.length; i < len; ++i) {
                    if (!insideElements[i]) continue;
                    var childInsideElement = insideElements[i].children
                    for (var j = 0, len2 = childInsideElement.length; j < len2; ++j) {
                        if (childInsideElement[j].tagName.toLowerCase() === 'input')
                            isBackTitle = true;
                        if (childInsideElement[j].tagName.toLowerCase() === 'label' && $(childInsideElement[j]).hasClass('h6') && childInsideElement[j].textContent.trim()) {
                            if (isBackTitle === false)
                                uiDesc = childInsideElement[j].textContent + uiDesc;
                            else
                                uiDesc += childInsideElement[j].textContent;
                        }
                    }
                }
            }
        };

        this.selectShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var uiDesc="";
            var eleIndex = tp.uiValue.indexOf(itemValue);
            if (eleIndex!=-1) {
                uiDesc = tp.uiDesc[eleIndex];
                if (otherValue != "")
                    uiDesc += ((tp.backTitle && tp.backTitle[eleIndex]) ? tp.backTitle[eleIndex] : '') + otherValue + ((tp.otherBackTitle && tp.otherBackTitle[eleIndex]) ? tp.otherBackTitle[eleIndex] : '');
            }
            return (uiDesc!="") ? uiDesc : "";
        };

        this.textShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            tempFormToolAttributeSetting();
            if (formItem.itemValue != undefined && formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else {
                return "";
            }

            /**
             * ????????????????????????????????????
             * ??????????????????
             * @returns {boolean}
             */
            function tempFormToolAttributeSetting() {
                if (!formItemTemplate.formToolAttribute) return false;
                var formToolAttribute   = JSON.parse(formItemTemplate.formToolAttribute);
                if (!formToolAttribute.structure) return false;
                var structure           = JSON.parse(formToolAttribute.structure);
                var beanElement         = eNursing.createElemental(structure)[0];
                var beanStructure;
                if(beanElement && beanElement.dataset && beanElement.dataset.structure){
                    beanStructure       = beanElement.dataset.structure;
                }
                if (!beanStructure) return false;
                var insideStructure     = JSON.parse(beanStructure);
                var insideElements      = eNursing.createElemental(insideStructure)
                var isBackTitle         = false;
                for (var i = 0, len = insideElements.length; i < len; ++i) {
                    if (!insideElements[i]) continue;
                    if (insideElements[i].tagName.toLowerCase() === 'input')
                        isBackTitle = true;
                    if (insideElements[i].tagName.toLowerCase() === 'label' && $(insideElements[i]).hasClass('h6') && insideElements[i].textContent.trim()){
                        if (isBackTitle===false){
                            if (tp.printShowTitle) {
                                formItem.itemValue = insideElements[i].textContent + formItem.itemValue;
                            }
                        }else {
                            formItem.itemValue += insideElements[i].textContent
                        }
                    }
                }
            }
        };

        this.totalScoreShowUiDesc = function (ele, formItem, formItemTemplate, itemMaps) {
            var fi = formItem;
            var tp = formItemTemplate;
            var score = fi.itemValue;
            var formToolAttribute = tp.formToolAttribute;
            var desc = score;
            if (formToolAttribute) {
                formToolAttribute = JSON.parse(formToolAttribute);
                var scoreRule = formToolAttribute.scoreRule;
                if (scoreRule.length > 0) {
                    for (var i = 0, len = scoreRule.length; i < len; i++) {
                        var max = $(scoreRule[i]).attr("max-limit");
                        var min = $(scoreRule[i]).attr("min-limit");
                        var color = $(scoreRule[i]).attr("rule-color") || $(scoreRule[i]).attr("ruleColor");
                        var warn = $(scoreRule[i]).attr("warning-text");
                        if (parseInt(score) >= parseInt(min) && parseInt(score) <= parseInt(max)) {
                            desc = "<span style='color: "+color+"'>"+score + " " + warn+"</span>";
                            break;
                        }
                    }
                }
            }
            return desc;
        };

        this.hiddenShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if (formItem.itemValue != undefined && formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else {
                return "";
            }
        };

        this.dateShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if (formItem.itemValue != undefined && formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else {
                return "";
            }
        };

        this.timeShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if (formItem.itemValue != undefined && formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else {
                return "";
            }
        };

        this.datetimeShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if (formItem.itemValue != undefined && formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else {
                return "";
            }
        };

        this.textareaShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if(formItem.itemValue != null) {
                if (formItemTemplate.tooMoreText != null && formItem.itemValue.length > formItemTemplate.tooMoreText) {
                    var html = formItem.itemValue.substr(0, formItemTemplate.tooMoreText) + "...";
                    html += "<a href='#' onclick='$(this).parent().html(\"" + formItem.itemValue.replaceToHtml().replace(/\&/g, "&amp;") + "\");return false;'>";
                    if (formItemTemplate.languageMode == "Traditional Chinese") {
                        html += "(????????????)";
                    } else if (formItemTemplate.languageMode == "Simplified Chinese") {
                        html += "(????????????)";
                    }
                    html += "</a>";
                    return (tp.showTitle ? (tp.title + ':') : '') + html + (tp.backTitle || '');
                } else {
                    return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue.replaceToHtml() + (tp.backTitle || '');
                }
            }else{
                return "";
            }
        };

        this.textareaEditorShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var iframe = $('<div><iframe id="'+formItemTemplate.name+'" frameborder="0" src="" class="textareaEditorShowUidesc" style="width: 100%; height: 100%;"></iframe></div>');
            iframe.find("iframe")[0].src = "data:text/html;charset=utf-8," + formItem.itemValue.replace(/\'/g, "\\'");
            return iframe.html();
        };

        this.labelShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if (formItem.itemValue != undefined && formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else {
                return "";
            }
        };
        this.buttonShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
        };
        this.fileShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            $(ele).empty();
            var html = "";
            var fileInfos = formItem.itemValue;
            var imgInfos = [];
            var brCounts = -1;
            if (fileInfos && fileInfos!=""){
                fileInfos = JSON.parse(fileInfos);
                for (var i =0, len=fileInfos.length; i<len; ++i){
                    html += (i!=0) ? "<br/>" : "";
                    var fileInfo = fileInfos[i];
                    //???????????????
                    if (fileTool.getFileExType(fileInfo.fileName)=="img"){
                        imgInfos.push(fileInfo);
                    }else{ //?????????
                        if (++brCounts===0) html += "<br/>";
                        var a = "";
                        a += "<a href='#' onclick='";
                        a += "fileTool.downloadFile_FileOutputStream(\""+fileInfo.id+"\");";
                        a += "return false;";
                        a += "'>"+fileInfo.fileName.replaceToHtml()+"</a>";
                        $(ele).append(a);
                        // html += a;
                    }
                }
                //???????????????
                if (imgInfos.length>0){
                    if (brCounts!==0) html += "<br/>";
                    var id = "fileShowUiDesc_"+getDataset(ele).bean;
                    var $hidden = $("<input type='hidden' id='"+id+"' />");
                    $hidden.val(formItem.itemValue);
                    var $div = $("<div class='fileDivFormItem' id='fileDiv_"+id+"' />");
                    var $div_temp = $("<div id='fileShowUiDesc_divTemp_"+getDataset(ele).bean+"' style='display:none;'/>").append($hidden).append($div);
                    $("body").append($div_temp);
                    fileTool.fileDefaultMultiple_show(id);
                    $div_temp.find(".fileDelBtnFormItem").remove(); //??????"????????????"

                    $(ele).append($hidden).append($div);
                    // html += $div_temp.html();
                    $div_temp.remove(); //??????????????????div
                }
            }
            return "";
        };

        this.addressTWShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if (formItem.itemValue != undefined && formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else {
                return "";
            }
        };
        this.signatureShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tp = formItemTemplate;
            var itemValue = fi.itemValue;
            var html = '';
            if (itemValue) {
                var imageData=itemValue.split("@")
                for (var i = 0; i < imageData.length; i++) {
                    html+='<img style="width:200px;" src="'
                        +imageData[i]
                        +'">';
                }
                return (tp.showTitle ? (tp.title + ':') : '') + html + (tp.backTitle || '');
            }else
                return html;
        };
        this.echartsShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tp = formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = fi.otherValue;
            var html = '';
            if (itemValue&&echarts) {
                var mchar= echarts.init(ele);
                mchar.setOption(JSON.parse(itemValue));
                mchar.on("click",function(params){
                    alert(params.name+params.seriesName+params.value)
                })
            }else
                return html;
        };
        this.csCanvasShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tpl = $.extend(true, {}, formItemTemplate);
            if (tpl.controlMode=="canvas") { //??????csCanvas?????????
                var that = this;
                //????????????csCanvas
                setTimeout(function(){
                    // ????????????/??????????????????????????????ele??????????????????div
                    if (tpl.isHorizontal || tpl.isVertical){
                        $(ele).find('.csCanvasShowUiDescDiv[id="divShowUiDesc_'+tpl.name+'"]').remove();
                        var $csCanvasShowUiDescDiv = $('<div class="csCanvasShowUiDescDiv" id="divShowUiDesc_'+tpl.name+'"></div>');
                        $(ele).append($csCanvasShowUiDescDiv);
                        ele = $csCanvasShowUiDescDiv[0];
                    }
                    //ele???data-name?????????csCanvas???create????????????id????????????
                    tpl.name = tpl.name + "_" + getDataset(ele).index;
                    $(ele).attr('data-name', tpl.name).attr('data-bean', tpl.name)
                    //??????csCanvas
                    that.createElement(ele, tpl);
                    try{
                        var csCanvasParamMap = itemMaps[getDataset(ele).bean+"_csCanvasParam"] || itemMaps[formItemTemplate.name+"_csCanvasParam"];
                        //??????????????????????????????
                        if (!csCanvasParamMap){
                            setValueComplete();
                            return;
                        }
                        var param = csCanvasParamMap.itemValue;
                        //?????? ???????????????????????? or ?????????????????????????????????????????????????????????
                        if ($(ele).find("#"+tpl.name).attr("data-cs-canvas-param") !== param){
                            $(ele).find("#"+tpl.name)[0].changeCsCanvasProp(param, fi.itemValue, fi.otherValue, setValueComplete);
                        }else{//??????
                            $(ele).find("#"+tpl.name)[0].csCanvas.doSetDefaultValue(fi.itemValue, fi.otherValue);
                            setValueComplete();
                        }
                        function setValueComplete(){
                            $(ele).find("#"+tpl.name).addClass('setValueComplete')
                        }
                    }catch(e){
                        console.error(e);
                    }
                }, 10);
                //????????????????????????
                return '';
            }else{//??????
                var st = (tpl.displayMode=="vertical") ? "<br/>" : ",";
                var showValue = (fi.itemValue) ? fi.itemValue.replace(/\,/g, st) : "";
                showValue += (fi.otherValue) ? ((fi.itemValue) ? st : "")+fi.otherValue.replace(/\|:\|/g, ":").replace(/\,/g, st) : "";

                if (showValue != undefined && showValue != "") {
                    //???gForm?????????uiDesc?????????
                    var csTypeFormat = JSON.parse(tpl.typeFormat.replace(/\\/g, ""));
                    csTypeFormat = csTypeFormat[0] ? csTypeFormat[0] : csTypeFormat;
                    var csGFormJS = nursing.createGForm()
                    csGFormJS.searchParamGF.status = 'Y'
                    csGFormJS.searchParamGF.formType = 'propCsCanvas'
                    csGFormJS.searchParamGF.itemCondition = "{searchParam}='"+csTypeFormat.csName+"-"+csTypeFormat.typeA+"-"+csTypeFormat.typeB+"'"
                    csGFormJS.searchParamGF.sourceId = csTypeFormat.sourceId

                    //????????????
                    csGFormJS.getGFormListWithConditionPlus(csGFormJS, function(result){
                        if (result.length==0){
                            console.error("??????csCanvas????????????!", result);
                            return;
                        }
                        var map = result[0].gForm.gformItemMap;
                        map.getValue = function(key) { return (this[key]) ? this[key].itemValue : ''};
                        var areas = (map.getValue('areas')) ? JSON.parse(map.getValue('areas')) : [];
                        var templateDiv = (map.getValue('templateDiv')) ? JSON.parse(map.getValue('templateDiv')) : {
                            "otherOptionsValue" : [],
                            "otherOptionsDesc" : []
                        };
                        var otherValue = templateDiv.otherOptionsValue;
                        var otherDesc = templateDiv.otherOptionsDesc;
                        var vArr = (fi.itemValue) ? fi.itemValue.split(",") : [];
                        var otherArr = (fi.otherValue) ? fi.otherValue.split(",") : [];
                        //??????itemValue
                        for (var i=0, len=vArr.length; i<len; ++i){
                            for (var i2=0, len2=areas.length; i2<len2; ++i2){
                                if (vArr[i]==areas[i2].type){
                                    vArr[i]=areas[i2].desc;
                                    break;
                                }
                            }
                        }
                        //??????otherValue
                        for (var i=0, len=otherArr.length; i<len; ++i){
                            for (var i2=0, len2=otherValue.length; i2<len2; ++i2){
                                if (otherArr[i]==otherValue[i2]){
                                    otherArr[i]=otherDesc[i2];
                                    break;
                                }
                            }
                        }

                        showValue = (vArr.join(st)) ? vArr.join(st) : "";
                        showValue += (otherArr.join(st)) ? ((vArr.join(st)) ? st : "")+otherArr.join(st).replace(/\|:\|/g, ":") : "";

                        //??????uiDesc?????????
                        // ????????????/????????????????????????????????????????????????label
                        if (tpl.isHorizontal || tpl.isVertical){
                            $(ele).find('.csCanvasShowUiDescLabel[id="labelShowUiDesc_'+tpl.name+'"]').text(showValue);
                        }else{
                            ele.innerHTML = showValue;
                        }
                    }, function(e){
                        alert("?????????{{$data.title}}???????????????!");
                        console.error(e)
                    })

                    //????????????uiValue?????????
                    // ????????????/????????????????????????????????????????????????label
                    if (tpl.isHorizontal || tpl.isVertical){
                        $(ele).find('.csCanvasShowUiDescLabel[id="labelShowUiDesc_'+tpl.name+'"]').remove();
                        showValue = '<label class="csCanvasShowUiDescLabel" id="labelShowUiDesc_'+tpl.name+'">'+showValue+'</label>'
                    }
                    return showValue;
                } else {
                    return "";
                }
            }
        };

        this.evaluationTimeShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if (formItem.itemValue != undefined && formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else if(gForm){
                return new Date(gForm.evaluationTime).format("yyyy-MM-dd HH:mm");
            }else {
                return "";
            }
        };

        this.externalDataShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            //????????????
            dynamicForm.createElement(ele, tp);
            //???????????????
            $('#'+tp.name).val(formItem.itemValue);
            $('#'+tp.name+'_otherText').val(formItem.otherValue);
            //????????????
            $('#'+tp.name+'_button').hide();
            if (formItem.itemValue) {
                externalDataFn.showData($('#' + tp.name)[0]);
            } else {
                console.error('?????????externalData???????????? - ??????'+tp.name+'???itemValue??????');
            }
            return "";
        };
    }
    eNursing.addModule(DynamicForm);

    /**????????????**/
    function SearchParamDF() {
        this.nodeId = eNursing.getFnName(SearchParamDF);
        //String ???????????????
        this.patientId = null;
        //String ???????????????
        this.encounterId = null;
        //Date ??????????????????
        this.beginDate = null;
        //Date ??????????????????
        this.endDate = null;
        //String ??????????????????
        this.formType = null;
        //String ????????????????????????
        this.frameModel = null;
        //String ????????????ID
        this.formId = null;
        //String ?????????????????????
        this.versionNo = null;
        //String ??????????????????xml??????
        this.content = null;
        //Boolean ????????????content??????
        this.hasContent = null;
    }
    eNursing.addModule(SearchParamDF);

    /**????????????formItem**/
    /** @function nursing.createDynamicFormItem*/
    /** @function nursing.getDynamicFormItem*/
    function DynamicFormItem() {
        this.nodeId = eNursing.getFnName(DynamicFormItem);
        //String ??????
        this.ID = null;
        //String ??????
        this.itemKey = null;
        //String ?????????
        this.itemValue = null;
        //String ?????????
        this.otherValue = null;
    }
    eNursing.addModule(DynamicFormItem);

    /**formVersion??????**/
    function FormVersion() {
        this.nodeId = eNursing.getFnName(FormVersion);
        //String ????????????ID
        this.id = null;
        //String ????????????
        this.formType = null;
        //String ??????????????????
        this.title = null;
        //String XML??????
        this.content = null;
        //int ??????
        this.version = null;
        //Timestamp ??????
        this.ts = null;
        //String ??????
        this.creatorId = null;
        //String ??????
        this.creatorName = null;
        //Date ??????
        this.createTime = null;
        //String ??????
        this.modifyUserId = null;
        //String ??????
        this.modifyUserName = null;
        //Date ??????
        this.modifyTime = null;
    }
    eNursing.addModule(FormVersion);

    /**formFrame??????**/
    function FormFrame() {
        this.nodeId = eNursing.getFnName(FormFrame);
        //String ?????????
        this.id = null;
        //String ????????????
        this.formType = null;
        //String ????????????
        this.frameModel = null;
        //String ????????????
        this.content = null;
        //int ??????
        this.version = null;
        //String ??????
        this.note = null;
        //String ??????
        this.creatorId = null;
        //String ??????
        this.creatorName = null;
        //Date ??????
        this.createTime = null;
        //String ??????
        this.modifyUserId = null;
        //String ??????
        this.modifyUserName = null;
        //Date ??????
        this.modifyTime = null;
    }
    eNursing.addModule(FormFrame);


    /**????????????**/
    /** @function nursing.createBasicParam*/
    /** @function nursing.getBasicParam*/
    function BasicParam() {
        this.nodeId = eNursing.getFnName(BasicParam);
        this.dynamicFormTemplate = null;
        this.dynamicFormFrame = null;

        //??????????????????????????? formVersion
        this.getFormVersionAllList = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "FormVersionAllList",
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};

            eNursing.sendMsg("dynamicFormService.getFormVersionAllList", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var list = result.data[0].basicParam;
                    if (window.console) console.log(list);
                    successCall(list.formVersionList);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall, false, false, "formVersion");
        };

        //???????????????????????? (??????formTypeArr)
        this.getFormVersionListMaxTsByFormType = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "formVersionListMax_."+dynamicFormParam.searchParamDF.formType,
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;

            eNursing.sendMsg("dynamicFormService.getFormVersionListMaxTsByFormType", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var list = result.data[0].basicParam;
                    if (window.console) console.log(list);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(result);
                }

            }, errorCall);
        };

        //???????????????????????? (??????formType,ts)
        this.getFormVersionListByFormTypeTs = function (syncParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "formVersionListSync",
                /**??????*/
                action: "select"
            };
            var isLastFormVersion, formVersionArr;
            if (syncParam.isLastFormVersion != undefined){
                isLastFormVersion = syncParam.isLastFormVersion, //???????????????????????????formVersion
                    formVersionArr    = syncParam.syncParam;         //??????formVersion?????????
            }else{
                isLastFormVersion = false,                       //???????????????????????????formVersion
                    formVersionArr    = syncParam;                   //??????formVersion?????????
            }


            eNursing.sendMsg("dynamicFormService.getFormVersionListByFormTypeTs", {"isLastFormVersion":isLastFormVersion, "syncParam":[{"basicParam":{"formVersionList":{"formVersion":formVersionArr}}}]}, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall);
        };

        //?????? FormType,???????????????????????? formVersionList
        this.getFormVersionListByFormType = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "FormVersionList."+dynamicFormParam.searchParamDF.formType,
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;

            eNursing.sendMsg("dynamicFormService.getFormVersionListByFormType", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var list = result.data[0].basicParam;
                    if (window.console) console.log(list);
                    successCall(list.formVersionList);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall);
        };

        //??????FormType,versionNo ???????????? FormVersion
        this.getFormVersionByFormTypeVersionNo = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormFrame."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.frameModel+"."+dynamicFormParam.searchParamDF.versionNo,
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.versionNo=dynamicFormParam.searchParamDF.versionNo;
            argumentParam.searchParamDF.encounterId="getFormVersionByFormTypeVersionNo";

            eNursing.sendMsg("dynamicFormService.getFormVersionByFormTypeVersionNo", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var list = result.data[0].basicParam.formVersionList.formVersion[0];
                    if (window.console) console.log(result);
                    successCall(list);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall, false, false, "formVersion");
        };

        //??????content ????????????xml????????? DynamicFormTemplate
        this.getDynamicFormTemplateByContent = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormTemplateByContent",
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.content=dynamicFormParam.searchParamDF.content;
            argumentParam.searchParamDF.encounterId="getDynamicFormTemplateByContent";

            eNursing.sendMsg("dynamicFormService.getDynamicFormTemplateByContent", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var dFTemplate = result.data[0].basicParam.dynamicFormTemplate;
                    if (window.console) console.log(dFTemplate);
                    successCall(dFTemplate);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall);
        };

        //??????formType(?????????)???frameModel(????????????) ??????????????????formFrame(????????????)
        this.getCurrDynamicFormFrameByformTypeFrameModel = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormFrame.Curr."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.frameModel,
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.frameModel=dynamicFormParam.searchParamDF.frameModel;
            argumentParam.searchParamDF.encounterId="getCurrDynamicFormFrameByformTypeFrameModel";

            eNursing.sendMsg("dynamicFormService.getCurrDynamicFormFrameByformTypeFrameModel", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var formFrame = result.data[0].basicParam;
                    if (window.console) console.log(formFrame);
                    successCall(formFrame.dynamicFormFrame);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall, false, false, "formFrame");
        };
        //??????formType(?????????)???frameModel(????????????)???versionNo(?????????) ??????????????????formFrame(????????????)
        this.getDynamicFormFrameByformTypeFrameModelVersionNo = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormFrame."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.frameModel+"."+dynamicFormParam.searchParamDF.versionNo,
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.frameModel=dynamicFormParam.searchParamDF.frameModel;
            argumentParam.searchParamDF.versionNo=dynamicFormParam.searchParamDF.versionNo;
            argumentParam.searchParamDF.encounterId="getDynamicFormFrameByformTypeFrameModelVersionNo";
            eNursing.sendMsg("dynamicFormService.getDynamicFormFrameByformTypeFrameModelVersionNo", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var formFrame = result.data[0].basicParam;
                    if (window.console) console.log(formFrame);
                    successCall(formFrame.dynamicFormFrame);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall, false, false, "formFrame");
        };
        //??????formType(?????????) ??????????????????????????????frameModel?????????
        this.getDynamicFormFrameModelListByformType = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormFrame.FrameModelList."+dynamicFormParam.searchParamDF.formType,
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.encounterId="getDynamicFormFrameModelListByformType";

            eNursing.sendMsg("dynamicFormService.getDynamicFormFrameModelListByformType", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var formFrameList = result.data[0].basicParam;
                    if (window.console) console.log(formFrameList);
                    successCall(formFrameList.formFormFrameList);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall);
        };
        //??????formType(?????????)???frameModel(????????????) ??????????????????????????????frame?????????
        this.getDynamicFormFrameListByformTypeFrameModel = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormFrame.FrameList."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.frameModel,
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.frameModel=dynamicFormParam.searchParamDF.frameModel;
            argumentParam.searchParamDF.encounterId="getDynamicFormFrameListByformTypeFrameModel";

            eNursing.sendMsg("dynamicFormService.getDynamicFormFrameListByformTypeFrameModel", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var formFrameList = result.data[0].basicParam;
                    if (window.console) console.log(formFrameList);
                    successCall(formFrameList.formFormFrameList);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall);
        };

        //?????????????????? frame??????????????? (??????List(FormVersion) -- formType,ts)
        this.getDynamicFormFrameListByformTypeTs = function (syncParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "formFrameListSync",
                /**??????*/
                action: "select"
            };
            var isLastFormFrame, formFrameArr;
            if (syncParam.isLastFormFrame != undefined){
                isLastFormFrame = syncParam.isLastFormFrame, //???????????????????????????formFrame
                    formFrameArr    = syncParam.syncParam;         //??????formFrame?????????
            }else{
                isLastFormFrame = false,                       //???????????????????????????formFrame
                    formFrameArr    = syncParam;                   //??????formFrame?????????
            }

            eNursing.sendMsg("dynamicFormService.getDynamicFormFrameListByformTypeTs", {"isLastFormFrame":isLastFormFrame, "syncParam":[{"basicParam":{"formVersionList":{"formVersion":formFrameArr}}}]}, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall);
        };

        //??????????????????,?????????????????????????????? (formType)
        this.getCurrDynamicFormTemplateV3 = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: dynamicFormParam.getNode()+".CurrDynamicFormTemplate."+dynamicFormParam.searchParamDF.formType,
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.encounterId="getCurrDynamicFormTemplateV3";

            eNursing.sendMsg("dynamicFormService.getCurrDynamicFormTemplateV3", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result.data);
                    var dFTemplate = result.data[0].basicParam.dynamicFormTemplate;
                    var items=dFTemplate.items;
                    var hashItems = {};
                    if (items){
                        for (i=0, len=items.length; i<len; i++){
                            hashItems[items[i].name]=items[i];
                        }
                    }else{
                        dFTemplate.items={};
                    }
                    dFTemplate.hashItems=hashItems;
                    successCall(result.data);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result);
                }

            }, errorCall, false, false, "formVersion");
        };
        //??????formType???versionNo????????????????????? (formType,versionNo)
        this.getDynamicFormTemplateByFormModelVersionNo = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormTemplate."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.versionNo,
                /**??????*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.versionNo=dynamicFormParam.searchParamDF.versionNo;
            argumentParam.searchParamDF.encounterId="getDynamicFormTemplateByFormModelVersionNo";
            eNursing.sendMsg("dynamicFormService.getDynamicFormTemplateByFormModelVersionNo", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result.data);
                    successCall(result.data);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall, false, false, "formVersion");
        };
        //??????formVersion?????? (formType,title,content)
        this.addFormVersion = function (formVersion, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormTemplate.Add."+formVersion.formType,
                /**??????*/
                action: "add"
            };
            eNursing.sendMsg("dynamicFormService.addFormVersion", [{"basicParam":{"formVersionList":{"formVersion":[formVersion]}}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result.data);
                    successCall(result.data);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //??????formVersion?????? (formType,content,version)
        this.updateFormVersionByFormTypeFormModelVersion = function (formVersion, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormTemplate."+formVersion.formType+"."+formVersion.version,
                /**??????*/
                action: "upd"
            };
            eNursing.sendMsg("dynamicFormService.updateFormVersionByFormTypeFormModelVersion", [{"basicParam":{"formVersionList":{"formVersion":[formVersion]}}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //??????formVersion?????? (????????????FormVersion??????)
        this.syncFormVersion = function (formVersion, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "SyncFormFrame."+formVersion.formType+"."+formVersion.version,
                /**??????*/
                action: "sync"
            };
            eNursing.sendMsg("dynamicFormService.syncFormVersion", [{"basicParam":{"formVersionList":{"formVersion":[formVersion]}}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //??????formFrame?????? (formType,frameModel,content,note)
        this.addFormFrame = function (formFrame, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormFrame.Add."+formFrame.formType+"."+formFrame.frameModel,
                /**??????*/
                action: "add"
            };
            eNursing.sendMsg("dynamicFormService.addFormFrame", [{"basicParam":{"dynamicFormFrame":formFrame}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //??????formFrame?????? (formType,frameModel,content,version,note)
        this.updateFormFrameByFormTypeFrameModelVesion = function (formFrame, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "DynamicFormFrame."+formFrame.formType+"."+formFrame.frameModel+"."+formFrame.version,
                /**??????*/
                action: "upd"
            };
            eNursing.sendMsg("dynamicFormService.updateFormFrameByFormTypeFrameModelVesion", [{"basicParam":{"dynamicFormFrame":formFrame}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //??????formFrame?????? (formType,frameModel,content,version,note)
        this.syncFormFrame = function (formFrame, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "SyncFormFrame."+formFrame.formType+"."+formFrame.frameModel+"."+formFrame.version,
                /**??????*/
                action: "sync"
            };
            eNursing.sendMsg("dynamicFormService.syncFormFrame", [{"basicParam":{"dynamicFormFrame":formFrame}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
    }
    eNursing.addModule(BasicParam);

}(eNursing);