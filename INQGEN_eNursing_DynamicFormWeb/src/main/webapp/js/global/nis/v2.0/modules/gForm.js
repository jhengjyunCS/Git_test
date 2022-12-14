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
        return this;
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

    function GForm() {
        this.nodeId = eNursing.getFnName(GForm);
        //searchParamGF ????????????
        this.searchParamGF = new SearchParamGF();
        //String ??????
        this.sourceId = null;
        //String ??????
        this.formId = null;
        //String ??????
        this.formType = null;
        //Date ??????
        this.evaluationTime = null;
        //String ??????
        this.totalScore = null;
        //String ??????
        this.formVersionId = null;
        //String ??????
        this.status = "Y";
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
        //String ??????
        this.versionNo = null;
        //String ??????
        this.content = null;
        //GFormItem[] ??????
        this.gformItems=[];
        //Map<String, GFormItem> ??????
        this.gformItemMap={};

        //??? gformItems(arr)?????? gformItemMap(json)
        this.setGFormItemMap = function (gForm){
            var gformItemMap = {};
            if (gForm && gForm.gformItems){
                var items = gForm.gformItems;
                for (i2=0, len2=items.length; i2<len2; i2++){
                    if (items[i2] && items[i2].itemKey){
                        gformItemMap[items[i2].itemKey]={
                            "itemValue" : (items[i2].itemValue) ? items[i2].itemValue.trim() : items[i2].itemValue,
                            "otherValue" : items[i2].otherValue
                        };
                    }
                }
            }
            gForm.gformItemMap=gformItemMap;
            return gForm;
        };

        //??? gformItemMap(json)?????? gformItems(arr)
        this.setGFormItems = function (gForm){
            var items = [];
            if (gForm && gForm.gformItemMap){
                var gformItemMap = gForm.gformItemMap;
                for (key in gformItemMap){
                    var json = gformItemMap[key];
                    json.itemKey = key;
                    items.push(json);
                }
            }
            gForm.gformItems=items;
            return gForm;
        };

        //?????? sourceId???formType ????????????Gform??????
        this.getGFormList = function (gFormParam, successCall, errorCall) {
            // if (!checkObjectFormat.check(this.nodeId+".getGFormList", arguments[0])) return false;
            var param = {
                /**????????????*/
                node: "GFormList."+gFormParam.searchParamGF.formType+"."+gFormParam.searchParamGF.sourceId,
                /**??????*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.getGFormList", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);
        };

        //?????? sourceId???formType ??????????????????Gform??????
        this.getLastGFormList = function (gFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "getLastGFormList."+gFormParam.searchParamGF.formType+"."+gFormParam.searchParamGF.sourceId,
                /**??????*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.getLastGFormList", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);
        };

        //??????GForm?????? (??????????????????)
        /**
         *
         * String formType (??????)
         * String sourceId (????????????sourceIds??????)
         * String[] sourceIds (????????????sourceId??????)
         * String formId
         * Date beginDate (evaluationTime)
         * Date endDate (evaluationTime)
         * String beginTotalScore (totalScore)
         * String endTotalScore (totalScore)
         * Date beginCreateTime (createTime)
         * Date endCreateTime (createTime)
         * String status (Y N D)
         * String[] statusArr (Y,N,D)
         * String modifyUserId
         * String modifyUserName
         * Date beginModifyTime (modifyTime)
         * Date endModifyTime (modifyTime)
         * int beginVersionNo (versionNo)
         * int endVersionNo (versionNo)
         *
         * String itemCondition
         * (ex. ({AssessmentDate}>='2018-01-01'AND {AssessmentDate}<='2019-12-31') )
         *    ???????????????
         * (ex. (gfi2.itemkey='AssessmentDate' AND gfi2.itemvalue >= '2019-06-29')AND (gfi2.itemkey='AssessmentDate' AND gfi2.itemvalue <= '2019-06-29 24') )
         *
         * int itemConditionHitCounts (??????????????????)
         *
         * Boolean hasContent (????????????Gform???content??????)
         *
         * @param map(String,Object)
         * @author JhengJyun
         * @date 2019/7/3 15:23
         */
        this.getGFormListWithCondition = function (gFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "getGFormListWithCondition."+eNursing.UUID(),
                /**??????*/
                action: "select"
            };

            var itemCondition = gFormParam.searchParamGF.itemCondition;

            //????????????????????????
            gFormParam.searchParamGF.itemConditionHitCounts = this.calItemConditionHitCounts(gFormParam.searchParamGF.itemConditionHitCounts, itemCondition);

            //?????? itemCondition
            gFormParam.searchParamGF.itemCondition=this.convertToItemCondition(itemCondition);

            eNursing.sendMsg("gFormService.getGFormListWithCondition", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }
                gFormParam.searchParamGF.itemConditionHitCounts=0;
            }, errorCall);
        };

        //??????GForm?????? (?????????) (??????????????????)
        /**
         * ??? getGFormListWithCondition
         * hasContent ?????? (???????????????????????????content???????????????true)
         *
         * ##????????????
         * ??????sql???n???~???m???
         * ??? beginIndex ????????? counts???
         * ?????? getGFormListWithConditionPlus()
         * String counts; //??????c???
         * String beginIndex; //??????n????????????
         *
         * @param map(String,Object)
         * @author JhengJyun
         * @date 2020/4/19 17:47
         */
        this.getGFormListWithConditionPlus = function (gFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "getGFormListWithConditionPlus."+eNursing.UUID(),
                /**??????*/
                action: "select"
            };

            var itemCondition = gFormParam.searchParamGF.itemCondition || "";

            //????????????????????????
            gFormParam.searchParamGF.itemConditionHitCounts = this.calItemConditionHitCounts(gFormParam.searchParamGF.itemConditionHitCounts, itemCondition);

            //?????? itemCondition
            gFormParam.searchParamGF.itemCondition=this.convertToItemCondition(itemCondition);

            eNursing.sendMsg("gFormService.getGFormListWithConditionPlus", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }
                gFormParam.searchParamGF.itemConditionHitCounts=0;
            }, errorCall);
        };

        //????????????????????????
        this.calItemConditionHitCounts = function (itemConditionHitCounts, itemCondition) {
            if (itemConditionHitCounts){
                return itemConditionHitCounts;
            }else{
                var hitCounts = itemCondition.toLowerCase().match(/\{\w+\}/gi);
                hitCounts = (hitCounts!=null) ? hitCounts.filter(function(element, index, arr){
                    return arr.indexOf(element) === index;
                }) : [""];
               return hitCounts.length; //??????????????????
            }
        };

        //?????? itemCondition
        this.convertToItemCondition = function (st) {

            var regex;
            console.log(st);

            //between
            regex = /\{(\w+)\}\s*between\s*\'([^\']*)\'\s+and\s+\'([^\']*)\'/gi;  //["{tr_date} between '2019-06-29' and '2019-06-29 24'"]
            st = st.replace(regex, "(gfi2.itemkey='$1' AND gfi2.itemvalue BETWEEN '$2' AND '$3')");

            //=,>=,<=,<>,>,<,like
            //{rep_nurse} like '%T31371%'
            //{site}>='700'
            regex = /\{(\w+)\}\s*([>|=|<|like]+)\s*\'([^\']*)\'/gi;
            st = st.replace(regex, "(gfi2.itemkey='$1' AND gfi2.itemvalue $2 '$3')");

            //in
            regex = /\{(\w+)\}\s*in\s*\(([^\)]*)\)/gi;  //{formcode} in ('FRC','LDC','DFC','HPI','DPA','DFA','VAC')
            st = st.replace(regex, "(gfi2.itemkey='$1' AND gfi2.itemvalue in ($2))");

            //||
            regex = /\|\|/gi;
            st = st.replace(regex, " OR ");
            console.log(st);
            return st;
        };

        //?????? formId???formType ????????????Gform
        this.getSingleGForm = function (gFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "SingleGForm."+gFormParam.searchParamGF.formType+"."+gFormParam.searchParamGF.formId,
                /**??????*/
                action: "select"
            };
            gFormParam.searchParamGF.encounterId="getSingleGForm";

            eNursing.sendMsg("gFormService.getSingleGForm", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);
        };


        //??????GForm  (???????????? oldFormId, sourceId, ????????????????????????)
        this.deleteGForm = function (gFormParam, successCall, errorCall, isDontConfirm) {
            var msg = (languageMode=="Traditional Chinese") ? "???????????????????" : (languageMode=="Simplified Chinese") ? "???????????????????" : "???????????????????";

            if (isDontConfirm || confirm(msg)){
                var param = {
                    /**????????????*/
                    node: "deleteGForm."+gFormParam.formType+"."+gFormParam.formId,
                    /**??????*/
                    action: "delete"
                };
                var data=[];
                var gFormData={"gForm":gFormParam};
                if(gForm_Title){
                    gFormData.title=gForm_Title; //app--title??????????????????
                }
                data.push(gFormData);
                eNursing.sendMsg("gFormService.deleteGForm", data, param, "", function (result) {
                    if (result.resultMsg.success) {
                        //???????????????api?????? (???????????????)
                        var backApisCounts = 0;
                        for (var i = 0, len = apis.length; i < len; ++i) {
                            if (apis[i].runMode.indexOf('D') > -1) {
                                ++backApisCounts;
                            }
                        }
                        //??????api
                        if (backApisCounts > 0) {
                            try {
                                console.log("????????????api???????????????????????? count="+backApisCounts);
                                if (languageMode=="Traditional Chinese"){
                                    eNursing.processStatus.show("?????????????????????", 5000);
                                }else{
                                    eNursing.processStatus.show("?????????????????????", 5000);
                                }
                                gForm = gFormParam;
                                for (var i = 0, len = apis.length; i < len; ++i) {
                                    if (apis[i].runMode.indexOf('D') > -1 || (apis[i].runMode.indexOf('DY') > -1 && gForm.status==='Y')) {
                                        apis[i].complete = function(apiModule) {
                                            if (apiModule.resultMsg && apiModule.resultMsg.error) {
                                                console.error("call api error! -> "+apiModule.apiDescription + "\n\n"+apiModule.resultMsg.msg);
                                                throw apiModule.resultMsg;
                                            }
                                            if (--backApisCounts <= 0) {
                                                eNursing.processStatus.hide();
                                                successCall();
                                            }
                                        }
                                        apis[i].start();
                                    }
                                }
                            } catch(e) {
                                console.error(e);
                                if (languageMode=="Traditional Chinese"){
                                    alert("??????api????????????????????????");
                                }else{
                                    alert("??????api??????????????????");
                                }
                            }
                        } else {
                            //????????????api
                            successCall();
                        }
                    } else {
                        eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                    }
                }, errorCall);
            }
        };

        this.autoProcessGFormData = function (paramMap, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "autoProcessGFormData."+paramMap.action+"."+paramMap.formType+"."+paramMap.formVersionId,
                /**??????*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.autoProcessGFormData", paramMap, param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);
        };

        this.getExtendGFormData = function (paramMap, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "getExtendGFormData."+paramMap.action+"."+paramMap.formType+"."+paramMap.formVersionId,
                /**??????*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.getExtendGFormData", paramMap, param, "", function (result) {
                if (window.console)console.log('gForm.getExtendGFormData',paramMap,result);
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);
        };


        //??????????????? GForm
        this.addOrUpdateGForm = function (gFormParam, successCall, errorCall) {
            gFormParam.gformItemMap={};
            var param = {
                /**????????????*/
                node: "addOrUpdateGForm."+gFormParam.formType+"."+(gFormParam.formId||""),
                /**??????*/
                action: (gForm_Title||thisPageStatus==="UPD")?"update":"add"
            };
            var data=[];
            var gFormData={"gForm":gFormParam};
            if(gForm_Title){
                gFormData.title=gForm_Title; //app--title??????????????????
            }
            data.push(gFormData);
            eNursing.sendMsg("gFormService.addOrUpdateGForm", data, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    var gForms = result.data;
                    if (window.console) console.log(gForms);
                    if(gForms){
                        for (i=0, len=gForms.length; i<len; i++){
                            var gForm = gForms[i].gForm;
                            var items = gForm.gformItems;
                            var formItems = {};
                            if (items){
                                for (i2=0, len2=items.length; i2<len2; i2++){
                                    formItems[items[i2].itemKey]={
                                        "itemValue" : items[i2].itemValue,
                                        "otherValue" : items[i2].otherValue
                                    };
                                }
                            }
                            gForm.gformItemMap=formItems;
                        }
                        if (window.console) console.log(gForms);
                    }
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                    if (errorCall) errorCall(result.resultMsg);
                }

            }, errorCall);
        };

        //???url??????get?????????????????????json (?????????multiLevel???????????????)
        this.getUrlSessionToJson = function(){
            var params=location.href.split("?")[1];
            if (params){
                params=params.split(/[&=]/g);
                var json={};
                for (var i=0, len=params.length; i<len; i+=2){
                    json[params[i]]=params[i+1];
                }
                json.multiLevel=json.multiLevel?json.multiLevel:"";
                return json;
            }else{
                return {multiLevel:""};
            }
        }

        //??????GForm???formId
        this.getGFormId = function (gFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "GForm.getGFormId."+UUID(),
                /**??????*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.getGFormId", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result.data[0].gForm.searchParamGF.formId);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);

            function UUID(len, radix) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                var uuid = [], i;
                radix = radix || chars.length;

                if (len) {
                    // Compact form
                    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
                } else {
                    // rfc4122, version 4 form
                    var r;

                    // rfc4122 requires these characters
                    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                    uuid[14] = '4';

                    // Fill in random data. At i==19 set the high bits of clock sequence as
                    // per rfc4122, sec. 4.1.5
                    for (i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                            r = 0 | Math.random() * 16;
                            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                }
                return uuid.join('');
            }
        };

        //api-?????? ??????/??????gForm
        this.apiTransAddOrUpdateGForm = function (gFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "apiTransAddOrUpdateGForm."+gFormParam["api-formType"]+"."+gFormParam.parentFormId,
                /**??????*/
                action: (gForm_Title||thisPageStatus==="UPD")?"update":"add"
            };
            var data=[];
            var gFormData=nursing.createGForm();
            for (var key in gFormParam) {
                var v = gFormParam[key];
                switch (key) {
                    case 'api-formType':
                        gFormData.formType =v || "";
                        break;
                    case 'api-sourceId':
                        gFormData.sourceId = v || "";
                        gFormData.searchParamGF.sourceId = v || "";
                        break;
                    case 'api-status':
                        gFormData.status =v || "";
                        break;
                    default:
                        gFormData.gformItemMap[key] = {"itemKey":key, "itemValue":v || ""};
                        break;
                }
            }

            //????????????
            gFormData.gformItemMap.parentFormId = gFormData.gformItemMap.parentFormId || {"itemKey":"parentFormId", "itemValue": ""};
            gFormData.searchParamGF.userId = window.localStorage["gForm_userId"] || "apiTrans";
            gFormData.searchParamGF.userName = window.localStorage["gForm_userName"] || "apiTrans";
            gFormData.setGFormItems(gFormData);
            gFormData={"gForm":gFormData};
            if(gForm_Title){
                gFormData.title=gForm_Title; //app--title??????????????????
            }
            data.push(gFormData);
            console.log(data)
            eNursing.sendMsg("gFormService.apiTransAddOrUpdateGForm", data, param, "", function (result) {
                successCall(result);
            }, errorCall);
        };

        //api-?????? ??????gForm
        this.apiTransDeleteGForm = function (gFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "apiTransDeleteGForm."+gFormParam["api-formType"]+"."+gFormParam.parentFormId,
                /**??????*/
                action: "delete"
            };
            var data=[];
            var gFormData=nursing.createGForm();
            for (var key in gFormParam) {
                var v = gFormParam[key];
                switch (key) {
                    case 'api-formType':
                        gFormData.formType =v || "";
                        break;
                    case 'api-sourceId':
                        gFormData.sourceId = v || "";
                        gFormData.searchParamGF.sourceId = v || "";
                        break;
                    default:
                        gFormData.gformItemMap[key] = {"itemKey":key, "itemValue":v || ""};
                        break;
                }
            }
            gFormData.gformItemMap.parentFormId = gFormData.gformItemMap.parentFormId || {"itemKey":"parentFormId", "itemValue": ""};
            gFormData.searchParamGF.userId = window.localStorage["gForm_userId"] || "apiTrans";
            gFormData.searchParamGF.userName = window.localStorage["gForm_userName"] || "apiTrans";
            gFormData.setGFormItems(gFormData);
            gFormData={"gForm":gFormData};
            if(gForm_Title){
                gFormData.title=gForm_Title; //app--title??????????????????
            }
            data.push(gFormData);
            console.log(data)
            eNursing.sendMsg("gFormService.apiTransDeleteGForm", data, param, "", function (result) {
                successCall(result);
            }, errorCall);
        };

        this.uploadToMergerGform=function (eleFileId, fileInfo, successCall, errorCall) {
            var fileStore = nursing.getFileStore();
            fileStore.doUploadFile(eleFileId, fileInfo, successCall, errorCall); //??????????????????

            //????????????????????? by jhengjyun 20201026
            /*
            var files = document.getElementById(eleFileId);

            var emptyMsg = (languageMode=="Traditional Chinese") ? "???????????????" : (languageMode=="Simplified Chinese") ? "???????????????" : "???????????????";
            //2019.10.04 ?????? ???????????????????????????????????????????????????????????????????????????
            { //???FileReader????????????form??????????????? (???????????????)
                try{
                    if (files.value===""){
                        alert(emptyMsg);
                        return false;
                    }
                    var form = $('<form method="POST" enctype="multipart/form-data" style="display:none" target="_blank"></form>');
                    form.attr("action", eNursing.serviceUrl.replace(/send\.do/, "fileUpload.do"));
                    $(files).before($(files).clone());
                    form.append($(files));
                    form.append($("input[name='statusIfError']:checked").clone());
                    form.append('<input type="text" name="states" value="'+fileInfo.states+'"/>');
                    form.append('<input type="text" name="sysModel" value="'+fileInfo.sysModel+'"/>');
                    form.append('<input type="text" name="storeType" value="'+fileInfo.storeType+'"/>');
                    form.append('<input type="text" name="gformServiceUrl" value="'+const_gformServiceUrl+'"/>');

                    $("body").append(form);
                    form.submit();
                    form.remove();
                    if (successCall) successCall();
                }catch(e){
                    if (errorCall) errorCall(e);
                }
            }
            */
        };
        this.downloadGformToFile=function (gFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "downloadGformToFile."+eNursing.UUID(),
                /**??????*/
                action: "select"
            };

            /*********?????? itemCondition ??????********/
            var itemCondition = gFormParam.searchParamGF.itemCondition;
            var regex;


            //????????????????????????
            gFormParam.searchParamGF.itemConditionHitCounts = this.calItemConditionHitCounts(gFormParam.searchParamGF.itemConditionHitCounts, itemCondition);

            //?????? itemCondition
            gFormParam.searchParamGF.itemCondition=this.convertToItemCondition(itemCondition);
            /*********?????? itemCondition ??????********/

            try{
                var form = $('<form method="POST" enctype="multipart/form-data" style="display:none" target="_blank"></form>');
                form.attr("action", eNursing.serviceUrl.replace(/send\.do/, "fileDownload.do"));
                form.append('<textarea name="gFormParam">'+eNursing.toJson(gFormParam)+'</textarea>');
                form.append('<input type="text" name="gformServiceUrl" value="'+const_gformServiceUrl+'"/>');
                $("body").append(form);
                form.submit();
                form.remove();
                if (successCall) successCall();
            }catch(e){
                if (errorCall) errorCall(e);
            }
        };
        /**
         * [??? getExtendGFormList ??????????????????excel]
         * @type {JSON}
         * gFormParam = {
                fileName : ??????,
                formType : gForm??????formType,
                action : ??????????????? [formType].[action] -> /WEB-INF/formTemplate/formConfig.properties,
                [param] : (??????N???)????????????XML???????????????????????????
            }
         * Ex:
            gFormParam = {
                fileName : "TSR_????????????",
                formType : "TSR-Form",
                action : "exportExcel",
                encId : "aa",
                docId : "bb"
            }
         */
        this.downLoadGformToFile_byGetExtendGFormList=function (gFormParam, successCall, errorCall) {
            var param = {
                /**????????????*/
                node: "downLoadGformToFile_byGetExtendGFormList."+eNursing.UUID(),
                /**??????*/
                action: "select"
            };

            try{
                var form = $('<form method="POST" enctype="multipart/form-data" style="display:none" target="_blank"></form>');
                form.attr("action", eNursing.serviceUrl.replace(/send\.do/, "fileDownload.do"));
                form.append('<textarea name="gFormParam">'+eNursing.toJson(gFormParam)+'</textarea>');
                form.append('<input type="text" name="gformServiceUrl" value="'+const_gformServiceUrl+'"/>');
                form.append('<input type="text" name="method" value="downLoadGformToFile_byGetExtendGFormList"/>');
                $("body").append(form);
                form.submit();
                form.remove();
                if (successCall) successCall();
            }catch(e){
                if (errorCall) errorCall(e);
            }
        };
        this.checkPermissions=function (userPermInfo, successCall, errorCall) {
            userPermInfo.userId = window.localStorage["gForm_userId"];
            var param = {
                /**????????????*/
                node: "checkPermissions."+userPermInfo.userId+"."+userPermInfo.permApp+"."+userPermInfo.permRes,
                /**??????*/
                action: "select"
            };
            eNursing.sendMsg("gFormService.checkPermissions", userPermInfo, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (successCall) successCall(result.data[0].userPermInfo);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg, errorCall);
                }

            }, errorCall);

        };
    }
    eNursing.addModule(GForm);

    /**????????????**/
    function SearchParamGF() {
        this.nodeId = eNursing.getFnName(SearchParamGF);
        //String ??????sourceId
        this.sourceId = null;
        //String[] ??????sourceIds
        this.sourceIds = [];
        //String ??????????????????
        this.formType = null;
        //Date ??????????????????
        this.beginDate = null;
        //Date ??????????????????
        this.endDate = null;
        //String ????????????????????????
        this.frameModel = null;
        //String ????????????ID
        this.formId = null;
        //String ?????????????????????
        this.versionNo = null;
        //String ?????????ID
        this.userId = null;
        //String ???????????????
        this.userName = null;
        //?????????
        this.encounterId = null;
        //????????????content--true,false
        this.hasContent = null;
        //String ?????????????????? (???)
        this.beginTotalScore = null;
        //String ?????????????????? (???)
        this.endTotalScore = null;
        //Date ???????????????????????? (??????)
        this.beginCreateTime = null;
        //Date ???????????????????????? (??????)
        this.endCreateTime = null;
        //String ?????????????????? Y N D
        this.status = null;
        //String[] ?????????????????? Y,N,D
        this.statusArr = null;
        //String ?????????????????????ID
        this.modifyUserId = null;
        //String ???????????????????????????
        this.modifyUserName = null;
        //Date ???????????????????????? (??????)
        this.beginModifyTime = null;
        //Date ???????????????????????? (??????)
        this.endModifyTime = null;
        //int ???????????????????????????(???)
        this.beginVersionNo = -1;
        //int ???????????????????????????(???)
        this.endVersionNo = -1;
        //????????????formItem(???????????? ex. (itemkey='pt_code' AND itemvalue = '') OR (itemkey='site' AND itemvalue = '7String 00')
        this.itemCondition = null;
        //int ????????????formItem(??????????????????)
        this.itemConditionHitCounts = 0;
    }
    eNursing.addModule(SearchParamGF);

    /**GFormItem**/
    function GFormItem() {
        this.nodeId = eNursing.getFnName(GFormItem);
        //String ??????
        this.formItemId = null;
        //String ??????
        this.formId = null;
        //String ??????
        this.itemKey = null;
        //String ??????
        this.itemValue = null;
        //String ??????
        this.otherValue = null;
        //Date ??????
        this.modifyTime = null;
    }
    eNursing.addModule(GFormItem);
}(eNursing);
