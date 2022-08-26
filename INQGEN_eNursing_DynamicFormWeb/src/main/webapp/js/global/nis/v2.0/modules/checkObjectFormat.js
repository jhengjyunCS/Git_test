!function () {
    function CheckObjectFormat() {
        this.nodeId = eNursing.getFnName(CheckObjectFormat);
        /**
         * 必填     = 有宣告就是必填
         * 型態     = "number"、"string"、"boolean"、"object"、"function"、"undefined"
         * 值域     = "string=>a|,|b|,|c" (type+值 (|,|分隔))
         * 值域(包含undefined) = "string=>a|,|b|,|c|,|undefined" (type+值 (|,|分隔))
         * 陣列值域 = "string=>arr=>a|,|b|,|c" (type+arr=>+值 (|,|分隔))
         */

        //依據 sourceId、formType 取得所有Gform表單
        // this["GForm.getGFormList"] = {
        //     "formType" : "string",
        //     "sourceId" : "number"
        // };
        // this["GForm.getGFormList"] = {
        //     "formType" : "string=>133|,|144",
        //     "sourceId" : "string"
        // };
        // this["GForm.getGFormList"] = {
        //     "formType" : "string=>133|,|144|,|undefined"
        // };
        // this["GForm.getGFormList"] = {
        //     "formType" : "arr=>string=>133|,|144",
        //     "sourceId" : "string"
        // };
        // this["GForm.getGFormList"] = {
        //     "sourceId" : "number"
        // };
        // this["GForm.getGFormList"] = {
        //     "sourceId" : "number=>111|,|222"
        // };
        // this["GForm.getGFormList"] = {
        //     "sourceId" : "arr=>number=>111|,|222"
        // };
        // this["GForm.getGFormList"] = {
        //     "formType" : "string",
        //     "sourceId" : "number",
        //     "oherCheck": function (arg){
        //         if (true){
        //             return {"checkResult":false, "msg":"自由發揮"};
        //         }else{
        //             return {"checkResult":true};
        //         }
        //     }
        // };
        // this["GForm.getGFormList"] = {
        //     "formType" : "object"
        // };
        // this["GForm.getGFormList"] = {
        //     "formType" : "undefined"
        // };

        this.key = "";
        this.arg = "";

        /**
         * [檢核物件格式]
         * @param  {[string]} key [被註冊的key]
         * @param  {[everything]} arg [要被檢核的參數]
         * @return {[boolean]}     [通過=true, 沒通過=false]
         */
        this.check = function (key, arg){
            this.key = key;
            this.arg = arg;
            //防止 const_checkObjectFormat 未宣告
            try{
                //是否啟用物件格式檢查
                if (const_checkObjectFormat){
                    const_checkObjectFormat = const_checkObjectFormat;
                }else{ //未啟用，直接跳過檢查
                    const_checkObjectFormat = false;
                    return true;
                }
            }catch(e){
                const_checkObjectFormat = false;
            }
            //開始檢查
            if (this[key]){
                //如果arg沒給就取他的第一個參數
                arg = (arg===undefined) ? arguments.callee.caller.arguments[0] : arg;
                //檢查型態
                try{
                    console.log("====this.init(this[key], arg)");
                    console.log(key);
                    console.log(arg);
                    var checkResult = this.init(this[key], arg, "");
                    console.log(checkResult);
                    return false;
                }catch(e){
                    eNursing.F2ReportErrorMsg({"msg":"檢核物件格式or參數格式有誤!", "key":this.key, "format":this[this.key], "arg":this.arg, "e":e});
                    console.error(e);
                    console.log(arg);
                    return false;
                }
            }
            return true;
        };

        //值域
        this.init = function(format, arg, node){
            if (eNursing.isObject(format)){
                node = (node==="") ? "{}" : node;
                if (!eNursing.isObject(arg)){
                    eNursing.F2ReportErrorMsg({"msg":node + " 格式應該為 --> "+JSON.stringify(format), "key":this.key, "format":this[this.key], "arg":this.arg});
                    return false;
                }
                for (var key in format) {
                    if (this.init(format[key], arg[key], node+"."+key)===false){
                        return false;
                    }
                }
            }else{
                return this[this.getFormatType(format)](format, arg, node);
            }
            return true;
        };

        this.getFormatType = function(formatStr){
            if (eNursing.isFunction(formatStr)){
                return "functionCall";
            }else if (formatStr.indexOf("number")===0 || formatStr.indexOf("arr=>number")===0){
                return "number";
            }else if (formatStr.indexOf("string")===0 || formatStr.indexOf("arr=>string")===0){
                return "string";
            }else if (formatStr.indexOf("boolean")===0 || formatStr.indexOf("arr=>boolean")===0){
                return "boolean";
            }else if (formatStr.indexOf("object")===0 || formatStr.indexOf("arr=>object")===0){
                return "object";
            }else if (formatStr.indexOf("undefined")===0 || formatStr.indexOf("arr=>undefined")===0){
                return "undefined";
            }
        };

        this.getFormatArr = function(formatStr, checkType){
            var result = formatStr.split(checkType)[1].split("|,|");
            if (this.getFormatType(formatStr)==="number"){
                for (var i=0, len=result.length; i<len; ++i){
                    result[i] = parseFloat(result[i]);
                }
            }else if (this.getFormatType(formatStr)==="boolean"){
                for (var i=0, len=result.length; i<len; ++i){
                    result[i] = result[i]==="true";
                }
            }
            return result;
        };

        this.ReportErrorMsg = function(node, msg){
            eNursing.F2ReportErrorMsg({"msg":msg, "node":node, "key":this.key, "format":this[this.key], "arg":this.arg});
        };

        this.number = function(formatStr, arg, node){
            var checkType = "number";
            checkType = "number";
            if (formatStr===checkType){
                if (eNursing.isUndefined(arg)){
                    this.ReportErrorMsg(node, "缺少參數 --> "+node);
                    return false;
                }else if (!eNursing.isNumber(arg)){
                    this.ReportErrorMsg(node, node+" 參數格式應該為number --> "+JSON.stringify(arg));
                    return false;
                }
            }
            checkType += "=>";
            if (formatStr.indexOf(checkType)===0){
                var arr = this.getFormatArr(formatStr, checkType);
                if (eNursing.isUndefined(arg) && arr.indexOf("undefined")!==-1){
                    return true;
                }else if (eNursing.isUndefined(arg)){
                    this.ReportErrorMsg(node, "缺少參數 --> "+node);
                    return false;
                }else if (!eNursing.isNumber(arg)){
                    this.ReportErrorMsg(node, node+" 參數格式應該為number --> "+JSON.stringify(arg));
                    return false;
                }else if (arr.indexOf(arg)===-1){
                    this.ReportErrorMsg(node, node+"="+JSON.stringify(arg)+" 參數值域應該為 --> "+JSON.stringify(arr));
                    return false;
                }
            }
            checkType = "arr=>"+checkType;
            if (formatStr.indexOf(checkType)===0){
                var arr = this.getFormatArr(formatStr, checkType);
                if (eNursing.isUndefined(arg)){
                    this.ReportErrorMsg(node, "缺少參數 --> "+node);
                    return false;
                }else if (!eNursing.isArray(arg)){
                    this.ReportErrorMsg(node, node+" 參數格式應該為array --> "+JSON.stringify(arg));
                    return false;
                }
                for (var i=0, len=arg.length; i<len; ++i){
                    if (!eNursing.isNumber(arg[i])){
                        this.ReportErrorMsg(node, node+"["+i+"]"+" 參數格式應該為number --> "+JSON.stringify(arg[i]));
                        return false;
                    }else if (arr.indexOf(arg[i])===-1){
                        this.ReportErrorMsg(node, node+"["+i+"]"+"="+JSON.stringify(arg[i])+" 參數值域應該為 --> "+JSON.stringify(arr));
                        return false;
                    }
                }
            }

            return true;
        };
        this.string = function(formatStr, arg, node){
            var checkType = "string";
            checkType = "string";
            if (formatStr===checkType){
                if (eNursing.isUndefined(arg)){
                    this.ReportErrorMsg(node, "缺少參數 --> "+node);
                    return false;
                }else if (!eNursing.isString(arg)){
                    this.ReportErrorMsg(node, node+" 參數格式應該為string --> "+JSON.stringify(arg));
                    return false;
                }
            }
            checkType += "=>";
            if (formatStr.indexOf(checkType)===0){
                var arr = this.getFormatArr(formatStr, checkType);
                if (eNursing.isUndefined(arg) && arr.indexOf("undefined")!==-1){
                    return true;
                }else if (eNursing.isUndefined(arg)){
                    this.ReportErrorMsg(node, "缺少參數 --> "+node);
                    return false;
                }else if (!eNursing.isString(arg)){
                    this.ReportErrorMsg(node, node+" 參數格式應該為string --> "+JSON.stringify(arg));
                    return false;
                }else if (arr.indexOf(arg)===-1){
                    this.ReportErrorMsg(node, node+"="+JSON.stringify(arg)+" 參數值域應該為 --> "+JSON.stringify(arr));
                    return false;
                }
            }
            checkType = "arr=>"+checkType;
            if (formatStr.indexOf(checkType)===0){
                var arr = this.getFormatArr(formatStr, checkType);
                if (eNursing.isUndefined(arg)){
                    this.ReportErrorMsg(node, "缺少參數 --> "+node);
                    return false;
                }else if (!eNursing.isArray(arg)){
                    this.ReportErrorMsg(node, node+" 參數格式應該為array --> "+JSON.stringify(arg));
                    return false;
                }
                for (var i=0, len=arg.length; i<len; ++i){
                    if (!eNursing.isString(arg[i])){
                        this.ReportErrorMsg(node, node+"["+i+"]"+" 參數格式應該為string --> "+JSON.stringify(arg[i]));
                        return false;
                    }else if (arr.indexOf(arg[i])===-1){
                        this.ReportErrorMsg(node, node+"["+i+"]"+"="+JSON.stringify(arg[i])+" 參數值域應該為 --> "+JSON.stringify(arr));
                        return false;
                    }
                }
            }

            return true;
        };
        this.boolean = function(formatStr, arg, node){
            var checkType = "boolean";
            checkType = "boolean";
            if (formatStr===checkType){
                if (eNursing.isUndefined(arg)){
                    this.ReportErrorMsg(node, "缺少參數 --> "+node);
                    return false;
                }else if (!eNursing.isBoolean(arg)){
                    this.ReportErrorMsg(node, node+" 參數格式應該為boolean --> "+JSON.stringify(arg));
                    return false;
                }
            }
            checkType += "=>";
            if (formatStr.indexOf(checkType)===0){
                var arr = this.getFormatArr(formatStr, checkType);
                if (eNursing.isUndefined(arg) && arr.indexOf("undefined")!==-1){
                    return true;
                }else if (eNursing.isUndefined(arg)){
                    this.ReportErrorMsg(node, "缺少參數 --> "+node);
                    return false;
                }else if (!eNursing.isBoolean(arg)){
                    this.ReportErrorMsg(node, node+" 參數格式應該為boolean --> "+JSON.stringify(arg));
                    return false;
                }else if (arr.indexOf(arg)===-1){
                    this.ReportErrorMsg(node, node+"="+JSON.stringify(arg)+" 參數值域應該為 --> "+JSON.stringify(arr));
                    return false;
                }
            }
            checkType = "arr=>"+checkType;
            if (formatStr.indexOf(checkType)===0){
                var arr = this.getFormatArr(formatStr, checkType);
                if (eNursing.isUndefined(arg)){
                    this.ReportErrorMsg(node, "缺少參數 --> "+node);
                    return false;
                }else if (!eNursing.isArray(arg)){
                    this.ReportErrorMsg(node, node+" 參數格式應該為array --> "+JSON.stringify(arg));
                    return false;
                }
                for (var i=0, len=arg.length; i<len; ++i){
                    if (!eNursing.isBoolean(arg[i])){
                        this.ReportErrorMsg(node, node+"["+i+"]"+" 參數格式應該為boolean --> "+JSON.stringify(arg[i]));
                        return false;
                    }else if (arr.indexOf(arg[i])===-1){
                        this.ReportErrorMsg(node, node+"["+i+"]"+"="+JSON.stringify(arg[i])+" 參數值域應該為 --> "+JSON.stringify(arr));
                        return false;
                    }
                }
            }

            return true;
        };
        this.object = function(formatStr, arg, node){
            if (!eNursing.isObject(arg)){
                this.ReportErrorMsg(node, node+" 參數格式應該為object --> "+JSON.stringify(arg));
                return false;
            }
            return true;
        };
        this.functionCall = function(funcCall, arg, node){
            var result = funcCall(this.arg);
            if (result.checkResult === false){
                this.ReportErrorMsg(node, result.msg);
                return false;
            }
            return true;
        };
        this.undefined = function(formatStr, arg, node){
            if (!eNursing.isUndefined(arg)){
                this.ReportErrorMsg(node, node+" 參數不該被設置 --> "+JSON.stringify(arg));
                return false;
            }
            return true;
        };
    }
    eNursing.addModule(CheckObjectFormat);
}(eNursing);
