!function () {

    /** @namespace result.resultMsg */
    function ApiSet() {
        this.nodeId =eNursing.getFnName(ApiSet);
        /*方法名*/
        this.apiName = null;
        /*方法类型*/
        this.apiType = null;
        /*请求方式*/
        this.requestMethod = null;
        /*请求地址*/
        this.requestUrl = null;
        /*输入参数*/
        this.input = null;
        /*返回结果*/
        this.output = null;
        /*是否接通后台数据*/
        this.linkLine = null;
        /*是否记录日志*/
        this.hasLog = null;
        /*boolean*/
        this.webService = null;
        /*boolean*/
        this.webSocket = null;
        /*boolean*/
        this.httpJson = null;
        this.getApiSetList = function (apiParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: apiParam.getNode()+".getApiSetList",
                /**动作*/
                action: "select"
            };
            this.sendMsg("apiSetService.getApiSetList", apiParam, param, "", function (result) {
                if (result.resultMsg.success) {
                    //--设置用户
                    var apiSetDb = result.data;
                    var apiSet = nursing.getApiSet();
                    apiSet.setCache(apiSetDb, "apiType", 0);
                    successCall(apiSet.getData(true));
                } else {
                    errorCall(result.resultMsg);
                }

            }, errorCall);
        };
        this.getLastApiSetFormTemplate = function (apiParam,successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: apiParam.getNode()+".getLastApiSetFormTemplate",
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF: {formType: "apiSet"}};
            eNursing.sendMsg("dynamicFormService.getCurrDynamicFormTemplateV3", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var dFTemplate = result.data[0].basicParam.dynamicFormTemplate;
                    var items=dFTemplate.items;
                    var itemMap = {};
                    if (items){
                        for (i=0, len=items.length; i<len; i++){
                            itemMap[items[i].name]=items[i];
                        }
                    }else{
                        dFTemplate.items={};
                    }
                    dFTemplate.itemMap=itemMap;
                    successCall(dFTemplate);
                }
            }, errorCall);
        };
        this.getApiSets = function (successCall, errorCall) {
            var gFormParam={searchParamGF:{formType:"apiSet",sourceId:"apiSetData",hasContent:true}}
            var param = {
                /**不同数据*/
                node: "GFormList."+gFormParam.searchParamGF.formType+"."+gFormParam.searchParamGF.sourceId,
                /**动作*/
                action: "select"
            };

            eNursing.sendMsg("gFormService.getGFormList", [{"gForm":gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var gForms = result.data;
                    successCall(gForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }
            }, errorCall);
        };
    }
    eNursing.addModule(ApiSet);

}(eNursing);