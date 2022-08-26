!function () {
    function BSIInfo() {
        this.nodeId = eNursing.getFnName(BSIInfo);
        this.parentConstructor = eNursing.getModules("Patient");

        //SearchParamBS 查询条件
        this.searchParamBS = null;
        //String 事件序号
        this.id = null;
        //String 护理记录序号
        this.record_poid = null;
        //Date 评估(注射)日期
        this.evalDate = null;
        //String 住院号
        this.encounterId = null;
        //String 病历号
        this.patientId = null;
        //String 住院型态 I、O、E
        this.encType = null;
        //String 资料型态
        this.recordType = null;
        //int 无法测量原因
        this.reason = null;
        //String 无法测量原因其它说明
        this.reasonDesc = null;
        //boolean 加入护理记录
        this.mark = null;
        //String 资料状态
        this.status = null;
        //String 建立者帐号
        this.creatorId = null;
        //String 建立者姓名
        this.creatorName = null;
        //Date 建立日期
        this.createDate = null;
        //String 修改者帐号
        this.modifierId = null;
        //String 修改者姓名
        this.modifierName = null;
        //Date 修改日期
        this.modifyDate = null;
        //boolean 允许更新资料权限
        this.allowEdit = null;
        //boolean 允许删除资料权限
        this.allowDelete = null;
        //String 护理站代码
        this.stationId = null;
        //String 院区
        this.zoneId = null;

        this.setDefault = function(){
            this.encType = "I";
            this.encounterId = this.parent.caseno;
            this.zoneId = this.parent.parent.parent.nodeValue;
            this.patientId = this.parent.hisNum;
            this.modifierId = this.parent.nurseId;
            this.modifierName = this.parent.nurseName;
            this.stationId = this.parent.parent.nodeValue;
        }
    }

    eNursing.addModule(BSIInfo);
}(eNursing);
