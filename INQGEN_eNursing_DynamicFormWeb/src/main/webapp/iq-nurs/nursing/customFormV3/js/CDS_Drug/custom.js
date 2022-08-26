(function ($) {
    $(document).ready(function () {
        /*Iframe*/
        $('.nav a').on('click',function(e){
            e.preventDefault();
            var srcLink = $(this).attr("href");
            $('#myIframe').attr("src", srcLink);
        });

    });
})(this.jQuery);


/**
 *  判斷字符串是否為數字
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}


/**
 *  點班覆核藥品數量
 * @param num
 * @param type
 * @returns {string}
 */
function checkDrugNum(num,type) {
    var drug = '';
    for(var s=0;s<num;s++){
        //药名
        var DrugName = $("#"+type+"-"+s.toString()+"-ORDPROCED").text();
        if(DrugName !=null && DrugName !=''){
            //上次結存量
            var InventoryQty = $("#"+type+"-"+s.toString()+"-BALANCESTOCK").text();
            //本次結存量
            var jieNum = $($("#"+type+"-"+s.toString()+"-BALANCESTOCK")[0].parentNode.parentNode).find($("input")).val();
            //基本量
            var ControlBasicQty = $("#"+type+"-"+s.toString()+"-BASICQUANTITY").text();
            //短期借入量
            var ShortDrugsQty = $("#"+type+"-"+s.toString()+"-STBORR").text();
            //暫缺量
            var TemporaryQty = $("#"+type+"-"+s.toString()+"-VACANCY").text();
            //破損量
            var DamagedQty = $("#"+type+"-"+s.toString()+"-DAMAGEAMOUNT").text();
            //使用量
            var UsageQty = $("#"+type+"-"+s.toString()+"-UsageQty").text();
            if(type == 'self'){
                //存入量
                var destock = $("#"+type+"-"+s.toString()+"-DESTOCK").text();
                //自備藥
                if(InventoryQty!=null && InventoryQty!=''){
                    //如果有上次結存量 ：結存量=上次結存量-使用量;
                    if(isNumber(InventoryQty) && isNumber(jieNum) && isNumber(UsageQty)){
                        if(!(parseInt(jieNum) == (parseInt(InventoryQty) - parseInt(UsageQty)))){
                            drug = DrugName;break;
                        }
                    }else{
                        drug = DrugName;break;
                    }
                }else {
                    //如果沒有上次結存量 ：結存量= 存入量-使用量;
                    if(isNumber(jieNum) && isNumber(UsageQty) && isNumber(destock)){
                        if(!(parseInt(jieNum) == (parseInt(destock) - parseInt(UsageQty)))){
                            drug = DrugName;break;
                        }
                    }else{
                        drug = DrugName;break;
                    }
                }
            }else{
                //管制藥
                if(InventoryQty!=null && InventoryQty!=''){
                    //如果有上次結存量 ：結存量=上次結存量-暫缺量-破損量-使用量;
                    if(isNumber(InventoryQty) && isNumber(jieNum) && isNumber(TemporaryQty) && isNumber(DamagedQty) && isNumber(UsageQty)) {
                        if(!(parseInt(jieNum) == (parseInt(InventoryQty) - parseInt(TemporaryQty) - parseInt(DamagedQty) - parseInt(UsageQty)))){
                            drug = DrugName;break;
                        }
                    }else{
                        drug = DrugName;break;
                    }
                }else {
                    //如果沒有上次結存量 ：結存量= 基本量+短期借入量-暫缺量-破損量-使用量;
                    if(isNumber(jieNum) && isNumber(ControlBasicQty) && isNumber(ShortDrugsQty) && isNumber(TemporaryQty) && isNumber(DamagedQty) && isNumber(UsageQty)) {
                        if(!(parseInt(jieNum) == (parseInt(ControlBasicQty) + parseInt(ShortDrugsQty) - parseInt(TemporaryQty) - parseInt(DamagedQty) - parseInt(UsageQty)))){
                            drug = DrugName;break;
                        }
                    }else{
                        drug = DrugName;break;
                    }
                }
            }
        }
    }
    return drug;
}


/**
 *  處理xml文件中查詢sql結果集
 * @param gForm
 * @returns {{gformItemMap}}
 */
function setGFormDataByCheck(gForm) {
    if(gForm!=null && gForm.gformItemMap!=null && gForm.gformItems!=null && gForm.gformItems.length>0){

        if(gForm.gformItemMap.userNum!=null){
            var useNum = gForm.gformItemMap.userNum.itemValue;
            var patArr = new Array();
            var map = eval("(" + useNum + ")");
            for (var key in map) {
                var a = map[key];
                for (var k in a) {
                    patArr.push(a[k]);
                }
            }

            if(patArr!=null && patArr.length>0){
                for(var s=0;s<patArr.length;s++){
                    if(patArr[s].UDCODE!=null && patArr[s].UsageQty!=null){

                        var udCode = patArr[s].UDCODE.itemValue;
                        var isSelf = patArr[s].ISSELF.itemValue;
                        var udLevel = patArr[s].UDLEVEL.itemValue;
                        var usageQty = patArr[s].UsageQty.itemValue;

                        if(udLevel == null || udLevel == '' || udLevel == " "){
                            udLevel = '0';
                        }
                        var weiId = udCode+isSelf+udLevel;

                        var labObj = $("p[data-bean='UDCODE']").find($('label'));
                        if(labObj!=null && labObj.length>0){
                            for(var z=0;z<labObj.length;z++){
                                if($(labObj[z]).text() == udCode){

                                    var self = $(labObj[z].parentNode.parentNode.parentNode).find($("p[data-bean='ISSELF']")).find($("label")).text();
                                    var level = $(labObj[z].parentNode.parentNode.parentNode).find($("p[data-bean='UDLEVEL']")).find($("label")).text();

                                    if(level == null || level == '' || level == " "){
                                        level = '0';
                                    }else if(level == "一級" || level == "一级"){
                                        level = '1';
                                    }else if(level == "二級" || level == "二级"){
                                        level = '2';
                                    }else if(level == "三級" || level == "三级"){
                                        level = '3';
                                    }

                                    var weiId1 = $(labObj[z]).text()+self+level;

                                    if(weiId == weiId1){
                                        var num = $(labObj[z].parentNode.parentNode.parentNode).find($("p[data-bean='UsageQty']")).find($("label")).text();
                                        if(num!=null && num!='' && num!='0'){
                                            $(labObj[z].parentNode.parentNode.parentNode).find($("p[data-bean='UsageQty']")).find($("label")).text((parseInt(num)+usageQty));
                                        }else{
                                            $(labObj[z].parentNode.parentNode.parentNode).find($("p[data-bean='UsageQty']")).find($("label")).text(usageQty)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if(gForm.gformItemMap.LevelOne!=null){
            var one = gForm.gformItemMap.LevelOne.itemValue;
            if(one!=null && one!=''){
                var oneVal = getLeveJson(JSON.parse(one),'LevelOne');
                gForm.gformItemMap.LevelOne.itemValue = oneVal;
                for(var s=0;s<gForm.gformItems.length;s++){
                    if(gForm.gformItems[s].itemKey == 'LevelOne'){
                        gForm.gformItems[s].itemValue = oneVal;break;
                    }
                }
            }
        }
        if(gForm.gformItemMap.LevelTwo!=null){
            var two = gForm.gformItemMap.LevelTwo.itemValue;
            if(two!=null && two!=''){
                var twoVal = getLeveJson(JSON.parse(two),'LevelTwo');
                gForm.gformItemMap.LevelTwo.itemValue = twoVal;
                for(var s=0;s<gForm.gformItems.length;s++){
                    if(gForm.gformItems[s].itemKey == 'LevelTwo'){
                        gForm.gformItems[s].itemValue = twoVal;break;
                    }
                }
            }
        }
        if(gForm.gformItemMap.LevelThree!=null){
            var three = gForm.gformItemMap.LevelThree.itemValue;
            if(three!=null && three!=''){
                var threeVal = getLeveJson(JSON.parse(three),'LevelThree');
                gForm.gformItemMap.LevelThree.itemValue = threeVal;
                for(var s=0;s<gForm.gformItems.length;s++){
                    if(gForm.gformItems[s].itemKey == 'LevelThree'){
                        gForm.gformItems[s].itemValue = threeVal;break;
                    }
                }
            }
        }
        if(gForm.gformItemMap.self!=null){
            var selfVal = gForm.gformItemMap.self.itemValue;
            if(selfVal!=null && selfVal!=''){
                var selfValue = getLeveJson(JSON.parse(selfVal),'self');
                gForm.gformItemMap.self.itemValue = selfValue;
                for(var s=0;s<gForm.gformItems.length;s++){
                    if(gForm.gformItems[s].itemKey == 'self'){
                        gForm.gformItems[s].itemValue = selfValue;break;
                    }
                }
            }
        }
    }
    return gForm;
}


/**
 *  合并同級藥品藥嗎相同的數據
 * @param jsonValue
 * @param title
 * @returns {string}
 */
function getLeveJson(jsonValue,title) {
    var jsonVal = '';
    if(jsonValue!=null){
        var patArr = new Array();
        var str = JSON.stringify(jsonValue);
        var map = eval("(" + str + ")");
        for (var key in map) {
            var a = map[key];
            for (var k in a) {
                patArr.push(a[k]);
            }
        }
        var drugArr = new Array();
        if(patArr.length>0){
            for(var s=0;s<patArr.length;s++){
                if(drugArr.length>0){
                    var falg = true;
                    for(var z=0;z<drugArr.length;z++){
                        if(drugArr[z].UDCODE!=null && patArr[s].UDCODE!=null){
                            if(drugArr[z].UDCODE.itemValue == patArr[s].UDCODE.itemValue){
                                falg = false;
                                if(patArr[s].BALANCESTOCK!=null){
                                    if(drugArr[z].BALANCESTOCK!=null){
                                        if(patArr[s].BALANCESTOCK.itemValue!=null && patArr[s].BALANCESTOCK.itemValue!=''){
                                            if(drugArr[z].BALANCESTOCK.itemValue!=null){
                                                drugArr[z].BALANCESTOCK.itemValue = parseInt(patArr[s].BALANCESTOCK.itemValue)+parseInt(drugArr[z].BALANCESTOCK.itemValue);
                                            }else{
                                                drugArr[z].BALANCESTOCK.itemValue = patArr[s].BALANCESTOCK.itemValue;
                                            }
                                        }
                                    }else{
                                        drugArr[z].BALANCESTOCK = patArr[s].BALANCESTOCK;
                                    }
                                }
                            }
                        }
                    }
                    if(falg){
                        drugArr.push(patArr[s]);
                    }
                }else{
                    drugArr.push(patArr[s]);
                }
            }
        }
        if(drugArr.length>0){
            var json = '';
            for(var i=0;i<drugArr.length;i++){
                json += "\""+i.toString()+"\":"+JSON.stringify(drugArr[i]);
                if(i != drugArr.length-1){
                    json+=",";
                }
            }
            if(json!=''){
                jsonVal = "{ \""+title+"\":{" +json + "}}";
            }
        }
    }
    return jsonVal;
}


/**
 *  獲取最後一次點班時間
 * @param gForms
 */
function getLastCheckTime(gForms) {
    var time = '';
    if(gForms!=null && gForms.length>0){
        for(var i=0;i<gForms.length;i++){
            if(gForms[i].gForm.createTime!=null){
                if(time == ''){
                    time = gForms[i].gForm.createTime;
                }else{
                    var stdt=new Date(time.replace("-","/"));
                    var etdt=new Date(gForms[i].gForm.createTime.replace("-","/"));
                    if(stdt<etdt){
                        time = gForms[i].gForm.createTime;
                    }
                }
            }
        }
    }
    if(time!=''){
        window.localStorage["LastCheckTime"]=new Date((new Date(time)).getTime()).format("yyyy-MM-dd HH:mm");
    }else{
        window.localStorage["LastCheckTime"]='';
    }
}


function changeFrameModelToUrl(frameModel,url) {
    var page = "ADD";
    window.localStorage["gFormWeb"+page+"_frameModel"]=frameModel+page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"]=frameModel+page+"_INIT";
    page = "LIST";
    window.localStorage["gFormWeb"+page+"_frameModel"]=frameModel+page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"]=frameModel+page+"_INIT";
    page = "UPD";
    window.localStorage["gFormWeb"+page+"_frameModel"]=frameModel+page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"]=frameModel+page+"_INIT";
    doURL(url);
}


function changeFrameTypeToUrl(url,formType,frameModel,sourceId) {
    if(sourceId!=null && sourceId!=''){
        var sourceIds=$.makeArray(sourceId);
        console.log(sourceIds);
    }
    var page = "ADD";
    window.localStorage["gFormWeb"+page+"_formType"]=formType;
    if(sourceId!=null && sourceId!=''){
        window.localStorage["gFormWeb"+page+"_sourceId"]=sourceId;
    }
    page = "LIST";
    window.localStorage["gFormWeb"+page+"_formType"]=formType;
    if(sourceId!=null && sourceId!=''){
        window.localStorage["gFormWeb"+page+"_sourceId"]=sourceId;
        window.localStorage["gFormWeb"+page+"_sourceIds"]=sourceIds;
    }
    page = "UPD";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"]=formType;
    if(sourceId!=null && sourceId!=''){
        window.localStorage["gFormWeb"+page+"_sourceId"]=sourceId;
    }
    changeFrameModelToUrl(frameModel,url);
}