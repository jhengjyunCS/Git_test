!function ($N) {
    eNursing.Nursing.commonCRUD = function (process, argument, node, action, successCall, errorCall, completeCall, rewrite) {
        console.log("process: "+process);
        console.log("argument: "+argument);
        console.log(argument);
        console.log("node: "+node);
        console.log("action: "+action);

        var param = {
            node: node,
            action: action
        };
        this.sendMsg(process, argument, param, "", function (_data) {
            var result=_data;
            if (!eNursing.isObject(_data))
                result=JSON.parse(_data);
            if (result.resultMsg.success) {
                if(eNursing.isFunction(successCall))
                    successCall(result);
            } else {
                if(eNursing.isFunction(errorCall))
                    errorCall(result);
            }
            if(eNursing.isFunction(completeCall))
                completeCall();

        }, function (error) {
            if(eNursing.isFunction(errorCall))
                errorCall(error);
        },action, rewrite);
    };

    /**基础事件**/
    function Test(){
        this.nodeId = eNursing.getFnName(Test);
        //string 回傳String
        this.rs = null;
        //string 查詢參數
        this.param = null;



        //測試-回傳固定字串
        this.returnString={"process":"testService.returnString", "argument":this, "action":"select"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.returnString.send = function(){
            this.argument.commonCRUD(this.process,{"test":this.argument},this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
        //測試-讀取測試用表單字串
        this.returnSqlString={"process":"testService.returnSqlString", "argument":this, "action":"select", "node":this.getNode()
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.returnSqlString.send = function(){
            this.argument.commonCRUD(this.process,{"test":this.argument},this.node,this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(Test);

}(eNursing);
