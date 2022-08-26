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
    function Ltcs(){
        this.nodeId = eNursing.getFnName(Ltcs);
        //Json    台東回傳的物件
        this.rs = null;

        //新增
        this.login={"process":"ltcsService.api", "argument":this, "action":"select"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.login.send = function(argument){
            this.argument.commonCRUD(this.process,argument,this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(Ltcs);

}(eNursing);
