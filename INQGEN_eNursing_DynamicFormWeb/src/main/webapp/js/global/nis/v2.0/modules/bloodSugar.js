!function () {
    function BloodSugar() {
        this.nodeId = eNursing.getFnName(BloodSugar);
        this.parentConstructor = eNursing.getModules("BSIInfo");

        //String 床号
        this.bedNo = null;
        //String 药品名称
        this.medName = null;
        //int 药品代码
        this.medCode = null;
        //String 药品其它说明
        this.medDesc = null;
        //float 药品剂量
        this.amount = null;
        //float 血糖值(数值)
        this.bsValue1 = null;
        //String 血糖单位
        this.unit = null;
        //String 血糖值(High 或 Low)
        this.bsValue2 = null;
        //String 注记
        this.notation = null;
        //String 症状
        this.symptom = null;
        //String 护理处置
        this.treatment = null;
        //String 用药途径
        this.useWay = null;
        //String 药品单位
        this.medUnit = null;
        //String 餐别
        this.eatType = null;
        //String 尿糖
        this.urineSugar = null;
        //String 尿糖备注
        this.urineSugarNote = null;
        //String 尿糖無法測量原因
        this.urineSugarReason = null;
        //String 尿糖無法測量原因備註
        this.urineSugarReasonDesc = null;

        //新增
        this.add={"process":"bloodSugarService.addBloodSugar", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){

            console.log(this.argument);
            this.argument.parent.status="Y";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argument.parent.createDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argument.parent.creatorId=this.argument.parent.parent.nurseId;
            this.argument.parent.creatorName=this.argument.parent.parent.nurseName;
            this.argument.bedNo=this.argument.parent.parent.bed;
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[this.argumentSend.cloneProperty(this.argumentSend)],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }

    eNursing.addModule(BloodSugar);
}(eNursing);
