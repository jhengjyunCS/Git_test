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
        this.leftJoin(new (eNursing.getModules()[this.nodeId]));
    };
    eNursing.Nursing.commonCRUD = function (process, argument, node, action, successCall, errorCall, completeCall, rewrite) {
        console.log("process: "+process);
        console.log("argument: "+argument);
        console.log(argument);
        console.log("node: "+node);
        console.log("action: "+action);
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
        console.log(arg);
        eNursing.info(JSON.stringify(arg));
        eNursing.info("node: "+node);
        eNursing.info("action: "+action);

        var param = {
            node: node,
            action: action
        };
        this.sendMsg(process, argument, param, "", function (_data) {
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
    /**????????????**/
    function BaseEvent(){
        this.nodeId = eNursing.getFnName(BaseEvent);
        this.parentConstructor=eNursing.getModules("Patient");
        //String    ????????????
        this.id = null;
        //String    ?????????
        this.encounterId = null;
        //String    ??????
        this.zoneId = null;
        //String    ?????????
        this.patientId = null;
        //char  ????????????
        this.encounterType = "I";
        //Date  ????????????????????????
        this.occurDate = null;
        //boolean   ???????????????????????????????????????
        this.marked = null;
        //boolean   ????????????????????????????????????
        this.mended = null;
        //Date  ????????????
        this.modifyDate = null;
        //String    ?????????
        this.modifier = null;
        //String    ???????????????
        this.modifierName = null;
        //char  ???????????? Y : ????????????????????? , M : ??????????????? , D : ?????????????????????
        this.status = null;
        //String    ?????????id
        this.stationId = null;
        //String    ??????
        this.bedId = null;
        //String    ??????????????????
        this.reason = null;
        //char  ?????????????????????
        this.recordType = null;
        //String    ???????????? poid
        this.recordPoid = null;
        //boolean   ????????????????????????
        this.deleteRecord = null;

        this.setDefault = function(){
            this.encounterId = this.parent.caseno;
            this.zoneId = this.parent.parent.parent.nodeValue;
            this.patientId = this.parent.hisNum;
            this.modifier = this.parent.nurseId;
            this.modifierName = this.parent.nurseName;
            this.stationId = this.parent.parent.nodeValue;
            this.bedId = this.parent.bed;
        }
    }
    eNursing.addModule(BaseEvent);

    /**????????????**/
    function Medicine(){
        this.nodeId = eNursing.getFnName(Medicine);
        //int ??????
        this.medicine = null;
        //String ??????????????????
        this.medicineOther = null;
        //int ??????
        this.route = null;
        //double ????????????
        this.numberValue = null;
        //String ????????????
        this.unit = null;
    }
    eNursing.addModule(Medicine);

    /**????????????**/
    function Traits(){
        this.nodeId = eNursing.getFnName(Traits);
        //int ??????
        this.color = null;
        //String ????????????
        this.colorOther = null;
        //int ??????
        this.flavor = null;
        //String ????????????
        this.flavorOther = null;
        //int ??????
        this.nature = null;
        //String ????????????
        this.natureOther = null;
    }
    eNursing.addModule(Traits);


    /**VitalSign ??????**/
    function BtEvent(){
        this.nodeId = eNursing.getFnName(BtEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String  ???????????? ?????????BT.AXILLARY????????????BT.EAR????????????BT.ORCL;?????????BT.RECTAL
        this.type = null;
        //String  ????????????
        this.typeName = null;
        //double  ???????????????
        this.numberValue = null;
        //String  value = "??????????????????",content = "C"
        this.unit1 = "C";
        //boolean  ?????????????????????????????????
        this.afterTreatment = null;
        //String  ??????????????????
        this.notation = null;
        //String  ????????????
        this.treatment = null;
        //int  ??????????????????
        this.specialTreatment = null;
        //String  ??????????????????????????????
        this.spNotation = null;
        //Medicine  ????????????
        this.medicine = new Medicine();
        //boolean  value = "?????????TPR?????????, ????????? TRUE",content = "true"
        this.tpr = true;
        //String  ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addBt", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(BtEvent);

    /**VitalSign ??????**/
    function PulseEvent(){
        this.nodeId = eNursing.getFnName(PulseEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String ???????????? ?????????PULSE.USUAL????????????PULSE.HEART.BEAT?????????????????????PULSE.PACEMAKER
        this.type = null;
        //String ????????????
        this.typeName = null;
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????
        this.unit ="/min";
        //String ??????????????????
        this.notation = null;
        //String ????????????
        this.treatment = null;
        //int ??????????????????
        this.specialTreatment = null;
        //String ??????????????????????????????
        this.spNotation = null;
        //Medicine ????????????
        this.medicine = new Medicine();
        //boolean ?????????TPR?????????, ????????? TRUE
        this.tpr= true;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addPulse", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(PulseEvent);


    /**VitalSign ??????**/
    function RespEvent(){
        this.nodeId = eNursing.getFnName(RespEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String ????????????,content = "RESPIRATORY"
        this.type = "RESPIRATORY";
        //String ????????????,content = "??????"
        this.typeName = "??????";
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????,content = "/min"
        this.unit = "/min";
        //String ??????????????????
        this.notation = null;
        //String ????????????
        this.treatment = null;
        //int ??????????????????
        this.specialTreatment = null;
        //String ??????????????????????????????
        this.spNotation = null;
        //int ???????????????????????? 0:????????? 1:????????? 2:????????????
        this.breathingMethod = null;
        //boolean ?????????TPR?????????, ????????? TRUE
        this.tpr = true;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addResp", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(RespEvent);

    /**VitalSign ??????**/
    function BpEvent(){
        this.nodeId = eNursing.getFnName(BpEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String ???????????? ??????_ABP???BP.ABP?????????_NBP???BP.NBP
        this.type = null;
        //String ????????????
        this.typeName = null;
        //double ??????????????????
        this.numberValue1 = null;
        //String ???????????????,content = "mmHg"
        this.unit1 = "mmHg";
        //double ??????????????????
        this.numberValue2 = null;
        //String ???????????????,content = "mmHg"
        this.unit2 = "mmHg";
        //int ????????????
        this.pose = null;
        //int ????????????
        this.region = null;
        //String ??????????????????
        this.notation = null;
        //String ????????????
        this.treatment = null;
        //int ??????????????????
        this.specialTreatment = null;
        //String ??????????????????????????????
        this.spNotation = null;
        //Medicine ????????????
        this.medicine = new Medicine();
        //boolean ?????????TPR?????????, ????????? TRUE,content = "true"
        this.tpr = true;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addBp", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argument.medicine.unit=this.argument.medicine.unit==null?"0":this.argument.medicine.unit;
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(BpEvent);

    /**VitalSign ??????**/
    function StoolEvent(){
        this.nodeId = eNursing.getFnName(StoolEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String ???????????? ????????????:STOOL.COLOSTOMY;??????:STOOL.DIGITAL;??????:STOOL.DULCOLAX;??????:STOOL.ENEMA;??????:STOOL.INCONTINENCE;??????:STOOL.NORMAL
        this.type = null;
        //String ????????????
        this.typeName = null;
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????,content = "???"
        this.unit = "???";
        //Traits ??????
        this.traits = new Traits();
        //String ??????????????????
        this.notation = null;
        //String ????????????
        this.treatment = null;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addStool", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(StoolEvent);

    /**VitalSign ??????**/
    function UrinationEvent(){
        this.nodeId = eNursing.getFnName(UrinationEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String ???????????? ????????????:URINATION.CYSTOSTOMY;??????:URINATION.INCONTINENCE;??????:URINATION.SELF;??????:URINATION.TUBE;?????????????????????:URINATION.UCST;
        this.type = null;
        //String ????????????
        this.typeName = null;
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????
        this.unit = null;
        //Traits ??????
        this.traits = new Traits();
        //String ??????????????????
        this.notation = null;
        //String ????????????
        this.treatment = null;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addUrination", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(UrinationEvent);

    /**VitalSign ??????**/
    function PainEvent(){
        this.nodeId = eNursing.getFnName(PainEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String ????????????,content="PAIN"
        this.type = "PAIN";
        //String ????????????,content="??????"
        this.typeName = "??????";
        //double ???????????????
        this.numberValue = null;
        //int ????????????
        this.evalMethod = null;
        //String ??????????????????,content="???"
        this.unit = "???";
        //Map<String,String> ????????????
        this.evalOptions = {};
        //boolean ?????????TPR?????????, ????????? TRUE",content = "true"
        this.tpr = true;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addPain", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(PainEvent);

    /**VitalSign ???????????????**/
    function SpO2Event(){
        this.nodeId = eNursing.getFnName(SpO2Event);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content="SPO2"
        this.type = "SPO2";
        //String ????????????,content="Spo2"
        this.typeName = "Spo2";
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????,content="%"
        this.unit = "%";
        //String ????????????
        this.treatment = null;
        //boolean ?????????TPR?????????, ????????? TRUE",content = "true"
        this.tpr= true;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addSpO2", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(SpO2Event);

    /**VitalSign ???????????????**/
    function CvpEvent(){
        this.nodeId = eNursing.getFnName(CvpEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content="CVP"
        this.type = "CVP";
        //String ????????????,content="???????????????"
        this.typeName = "???????????????";
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????
        this.unit = null;
        //String ????????????
        this.treatment = null;
        //boolean ?????????TPR?????????, ????????? TRUE",content = "true"
        this.tpr= true;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addCVP", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(CvpEvent);

    /**VitalSign ????????????**/
    function ComaIndexEvent(){
        this.nodeId = eNursing.getFnName(ComaIndexEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        // ????????????
        this.comaEye = new ComaEye();
        // ????????????????????????
        this.comaMotion = new ComaMotion();
        // ????????????
        this.comaTongue = new ComaTongue();

        //??????
        this.add={"process":"vitalSignService.addComaIndexEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument);
            this.argumentSend.comaEye=this.argument.extend(this.argument.parent,this.argumentSend.comaEye);
            this.argumentSend.comaMotion=this.argument.extend(this.argument.parent,this.argumentSend.comaMotion);
            this.argumentSend.comaTongue=this.argument.extend(this.argument.parent,this.argumentSend.comaTongue);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(ComaIndexEvent);

    /**VitalSign ????????????**/
    function ComaEye(){
        this.nodeId = eNursing.getFnName(ComaEye);

        //String ????????????,content = "COMASCALE.COMA.EYE"
        this.type = "COMASCALE.COMA.EYE";
        //String ????????????,content = "????????????"
        this.typeName = "????????????";
        //String ??????????????????,content = "ADULT"
        this.unit1 = "ADULT";
        //double ???????????????
        this.numberValue1 = null;
    }
    eNursing.addModule(ComaEye);

    /**VitalSign ????????????????????????**/
    function ComaMotion(){
        this.nodeId = eNursing.getFnName(ComaMotion);

        //String ????????????,content = "COMASCALE.COMA.MOTION"
        this.type = "COMASCALE.COMA.MOTION";
        //String ????????????,content = "????????????????????????"
        this.typeName = "????????????????????????";
        //String ??????????????????,content = "ADULT"
        this.unit1 = "ADULT";
        //double ???????????????
        this.numberValue1 = null;
    }
    eNursing.addModule(ComaMotion);

    /**VitalSign ????????????**/
    function ComaTongue(){
        this.nodeId = eNursing.getFnName(ComaTongue);

        //String ????????????,content = "COMASCALE.COMA.TONGUE"
        this.type = "COMASCALE.COMA.TONGUE";
        //String ????????????,content = "???????????? "
        this.typeName = "???????????? ";
        //String ??????????????????,content = "ADULT"
        this.unit1 = "ADULT";
        //double ???????????????
        this.numberValue1 = null;
    }
    eNursing.addModule(ComaTongue);

    /**VitalSign ??????**/
    function ConsciousnessEvent(){
        this.nodeId = eNursing.getFnName(ConsciousnessEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "COMASCALE.CONSCIOUSNESS"
        this.type = "COMASCALE.CONSCIOUSNESS";
        //String ????????????,content = "??????"
        this.typeName = "??????";
        //String ????????????
        this.abnormalType = null;

        //??????
        this.add={"process":"vitalSignService.addConsciousness", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(ConsciousnessEvent);

    /**VitalSign ????????????**/
    function MuscleEvent(){
        this.nodeId = eNursing.getFnName(MuscleEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //MuscleLeftArm ????????????
        this.comaScaleMuscleLeftArm = new MuscleLeftArm();
        //MuscleLeftLeg ????????????
        this.comaScaleMuscleLeftLeg = new MuscleLeftLeg();
        //MuscleRightArm ????????????
        this.comaScaleMuscleRightArm = new MuscleRightArm();
        //MuscleRightLeg ????????????
        this.comaScaleMuscleRightLeg = new MuscleRightLeg();

        //??????
        this.add={"process":"vitalSignService.addMuscleEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument);
            this.argumentSend.comaScaleMuscleLeftArm=this.argument.extend(this.argument.parent,this.argumentSend.comaScaleMuscleLeftArm.muscle,this.argumentSend.comaScaleMuscleLeftArm);
            this.argumentSend.comaScaleMuscleLeftLeg=this.argument.extend(this.argument.parent,this.argumentSend.comaScaleMuscleLeftLeg.muscle,this.argumentSend.comaScaleMuscleLeftLeg);
            this.argumentSend.comaScaleMuscleRightArm=this.argument.extend(this.argument.parent,this.argumentSend.comaScaleMuscleRightArm.muscle,this.argumentSend.comaScaleMuscleRightArm);
            this.argumentSend.comaScaleMuscleRightLeg=this.argument.extend(this.argument.parent,this.argumentSend.comaScaleMuscleRightLeg.muscle,this.argumentSend.comaScaleMuscleRightLeg);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(MuscleEvent);

    /**VitalSign ???????????????**/
    function Muscle(){
        this.nodeId = eNursing.getFnName(Muscle);

        //double ???????????????1
        this.numberValue1 = null;
        //double ???????????????2
        this.numberValue2 = null;
        //String ??????????????????,content = "ADULT")
        this.unit1 = "ADULT";
    }
    eNursing.addModule(Muscle);

    /**VitalSign ????????????**/
    function MuscleLeftArm(){
        this.nodeId = eNursing.getFnName(MuscleLeftArm);
        
        //String ????????????,content = "COMASCALE.MUSCLE.LEFT.ARM"
        this.type = "COMASCALE.MUSCLE.LEFT.ARM";
        //String ????????????,content = "????????????"
        this.typeName = "????????????";
        //Muscle ???????????????
        this.muscle = new Muscle();
    }
    eNursing.addModule(MuscleLeftArm);

    /**VitalSign ????????????**/
    function MuscleLeftLeg(){
        this.nodeId = eNursing.getFnName(MuscleLeftLeg);
        
        //String ????????????,content = "COMASCALE.MUSCLE.LEFT.LEG"
        this.type = "COMASCALE.MUSCLE.LEFT.LEG";
        //String ????????????,content = "????????????"
        this.typeName = "????????????";
        //Muscle ???????????????
        this.muscle = new Muscle();
    }
    eNursing.addModule(MuscleLeftLeg);

    /**VitalSign ????????????**/
    function MuscleRightArm(){
        this.nodeId = eNursing.getFnName(MuscleRightArm);
        
        //String ????????????,content = "COMASCALE.MUSCLE.RIGHT.ARM"
        this.type = "COMASCALE.MUSCLE.RIGHT.ARM";
        //String ????????????,content = "????????????"
        this.typeName = "????????????";
        //Muscle ???????????????
        this.muscle = new Muscle();
    }
    eNursing.addModule(MuscleRightArm);

    /**VitalSign ????????????**/
    function MuscleRightLeg(){
        this.nodeId = eNursing.getFnName(MuscleRightLeg);
        
        //String ????????????,content = "COMASCALE.MUSCLE.RIGHT.LEG"
        this.type = "COMASCALE.MUSCLE.RIGHT.LEG";
        //String ????????????,content = "????????????"
        this.typeName = "????????????";
        //Muscle ???????????????
        this.muscle = new Muscle();
    }
    eNursing.addModule(MuscleRightLeg);

    /**VitalSign ????????????**/
    function PhysicalActivity(){
        this.nodeId = eNursing.getFnName(PhysicalActivity);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "COMASCALE.PHYSICALACTIVITY"
        this.type = "COMASCALE.PHYSICALACTIVITY";
        //String ????????????,content = "????????????"
        this.typeName = "????????????";
        //String ??????
        this.abnormalType = null;
        //String ????????????
        this.reasonOther = null;

        //??????
        this.add={"process":"vitalSignService.addPhysicalActivity", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(PhysicalActivity);

    /**VitalSign ????????????**/
    function PupilIndexEvent(){
        this.nodeId = eNursing.getFnName(PupilIndexEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //PupilLeft ????????????-??????
        this.comaScalePupilLeft = new PupilLeft();
        //PupilRight ????????????-??????
        this.comaScalePupilRight = new PupilRight();

        //??????
        this.add={"process":"vitalSignService.addPupilIndexEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument);
            this.argumentSend.comaScalePupilLeft=this.argument.extend(this.argument.parent,this.argumentSend.comaScalePupilLeft.pupil,this.argumentSend.comaScalePupilLeft);
            this.argumentSend.comaScalePupilRight=this.argument.extend(this.argument.parent,this.argumentSend.comaScalePupilRight.pupil,this.argumentSend.comaScalePupilRight);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(PupilIndexEvent);

    /**VitalSign ????????????-?????????**/
    function Pupil(){
        this.nodeId = eNursing.getFnName(Pupil);

        //String ?????????
        this.reaction = null;
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????
        this.reasonPupil = null;
        //String ??????????????????-??????
        this.reasonPupilOther = null;
        //String ??????????????????,content = "ADULT")
        this.unit1 = "ADULT";
    }
    eNursing.addModule(Pupil);


    /**VitalSign ????????????-??????**/
    function PupilLeft(){
        this.nodeId = eNursing.getFnName(PupilLeft);
        
        //String ????????????,content = "COMASCALE.PUPIL.LEFT"
        this.type = "COMASCALE.PUPIL.LEFT";
        //String ????????????,content = "????????????-?????? "
        this.typeName = "????????????-?????? ";
        //Pupil ????????????-??????
        this.pupil = new Pupil();
    }
    eNursing.addModule(PupilLeft);

    /**VitalSign ????????????-??????**/
    function PupilRight(){
        this.nodeId = eNursing.getFnName(PupilRight);
        
        //String ????????????,content = "COMASCALE.PUPIL.RIGHT"
        this.type = "COMASCALE.PUPIL.RIGHT";
        //String ????????????,content = "????????????-?????? "
        this.typeName = "????????????-?????? ";
        //Pupil ????????????-??????
        this.pupil = new Pupil();
    }
    eNursing.addModule(PupilRight);

    /**VitalSign BodyRound?????????**/
    function BodyRoundEvent(){
        this.nodeId = eNursing.getFnName(BodyRoundEvent);

        //String ??????????????????
        this.unit ="cm";
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????
        this.notation = null;
    }
    eNursing.addModule(BodyRoundEvent);

    /**VitalSign ???????????????**/
    function ForeArmLeftEvent(){
        this.nodeId = eNursing.getFnName(ForeArmLeftEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "FOREARM.LEFT"
        this.type = "FOREARM.LEFT";
        //String ????????????,content = "???????????????"
        this.typeName = "???????????????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addForeArmLeftEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(ForeArmLeftEvent);

    /**VitalSign ???????????????**/
    function ForeArmRightEvent(){
        this.nodeId = eNursing.getFnName(ForeArmRightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "FOREARM.RIGHT"
        this.type="FOREARM.RIGHT";
        //String ????????????,content = "???????????????"
        this.typeName="???????????????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addForeArmRightEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(ForeArmRightEvent);

    /**VitalSign ??????**/
    function GirthEvent(){
        this.nodeId = eNursing.getFnName(GirthEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "GIRTH"
        this.type="GIRTH";
        //String ????????????,content = "??????"
        this.typeName="??????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addGirthEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(GirthEvent);

    /**VitalSign ??????**/
    function HeadEvent(){
        this.nodeId = eNursing.getFnName(HeadEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "HEAD"
        this.type="HEAD";
        //String ????????????,content = "??????"
        this.typeName="??????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addHeadEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(HeadEvent);

    /**VitalSign ???????????????**/
    function LegLeftEvent(){
        this.nodeId = eNursing.getFnName(LegLeftEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "LEG.LEFT"
        this.type="LEG.LEFT";
        //String ????????????,content = "???????????????"
        this.typeName="???????????????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addLegLeftEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(LegLeftEvent);

    /**VitalSign ???????????????**/
    function LegRightEvent(){
        this.nodeId = eNursing.getFnName(LegRightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "LEG.RIGHT"
        this.type="LEG.RIGHT";
        //String ????????????,content = "???????????????"
        this.typeName="???????????????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addLegRightEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(LegRightEvent);

    /**VitalSign ???????????????**/
    function ThighLeftEvent(){
        this.nodeId = eNursing.getFnName(ThighLeftEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "THIGH.LEFT"
        this.type="THIGH.LEFT";
        //String ????????????,content = "???????????????"
        this.typeName="???????????????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addThighLeftEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(ThighLeftEvent);

    /**VitalSign ???????????????**/
    function ThighRightEvent(){
        this.nodeId = eNursing.getFnName(ThighRightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "THIGH.RIGHT"
        this.type="THIGH.RIGHT";
        //String ????????????,content = "???????????????"
        this.typeName="???????????????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addThighRightEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(ThighRightEvent);

    /**VitalSign ???????????????**/
    function UpperArmLeftEvent(){
        this.nodeId = eNursing.getFnName(UpperArmLeftEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "UPPER.ARM.LEFT"
        this.type = "UPPER.ARM.LEFT";
        //String ????????????,content = "???????????????"
        this.typeName = "???????????????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addUpperArmLeftEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(UpperArmLeftEvent);

    /**VitalSign ???????????????**/
    function UpperArmRightEvent(){
        this.nodeId = eNursing.getFnName(UpperArmRightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content = "UPPER.ARM.RIGHT"
        this.type="UPPER.ARM.RIGHT";
        //String ????????????,content = "???????????????"
        this.typeName="???????????????";
        //BodyRound????????? ???????????????
        this.bodyRoundEvent = new BodyRoundEvent();

        //??????
        this.add={"process":"vitalSignService.addUpperArmRightEvent", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument.bodyRoundEvent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(UpperArmRightEvent);

    /**VitalSign ??????**/
    function HeightEvent(){
        this.nodeId = eNursing.getFnName(HeightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content="HEIGHT"
        this.type="HEIGHT";
        //String ????????????,content="??????"
        this.typeName="??????";
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????,content="cm"
        this.unit="cm";
        //String ??????????????????
        this.notation = null;
        //boolean ?????????TPR?????????, ????????? TRUE",content = "true"
        this.tpr= true;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addHeight", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(HeightEvent);

    /**VitalSign ??????**/
    function WeightEvent(){
        this.nodeId = eNursing.getFnName(WeightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????,content="WEIGHT"
        this.type="WEIGHT";
        //String ????????????,content="??????"
        this.typeName="??????";
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????,content="Kg"
        this.unit="Kg";
        //String ??????????????????
        this.notation = null;
        //boolean ?????????TPR?????????, ????????? TRUE",content = "true"
        this.tpr= true;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addWeight", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(WeightEvent);

    /**VitalSign ??????**/
    function Inject(){
        this.nodeId = eNursing.getFnName(Inject);

        //String ??????
        this.region = null;
        //String ??????
        this.medOrder = null;
        //double ??????
        this.dripSpeed = null;
        //String ????????????
        this.dripSpeedUnit = null;
        //String ????????????
        this.skinCondition = null;
        //String ????????????_??????
        this.skinConditionOther = null;

    }
    eNursing.addModule(Inject);

    /**VitalSign ?????????**/
    function InputEvent(){
        this.nodeId = eNursing.getFnName(InputEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????
        this.type = null;
        //String ????????????
        this.typeName = null;
        //String ??????????????????
        this.notation = null;
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????",content = "ML"
        this.unit="ML";
        //Inject ??????
        this.inject = new Inject();
        //String ??????????????????
        this.projectType = null;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addInput", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(InputEvent);


        // this.nodeId = eNursing.getFnName(Traits);
        // //int ??????
        // this.color = null;
        // //String ????????????
        // this.colorOther = null;
        // //int ??????
        // this.flavor = null;
        // //String ????????????
        // this.flavorOther = null;
        // //int ??????
        // this.nature = null;
        // //String ????????????
        // this.natureOther = null;
    /**VitalSign ?????????**/
    function OutputEvent(){
        this.nodeId = eNursing.getFnName(OutputEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String ????????????
        this.type = null;
        //String ????????????
        this.typeName = null;
        //double ???????????????
        this.numberValue = null;
        //String ??????????????????
        this.unit = null;
        //String ??????-??????
        this.species = null;
        //String ??????-??????
        this.speciesContext = null;
        //String ??????-??????
        this.speciesOther = null;
        //Traits ??????
        this.traits = new Traits();
        //String ???????????????
        this.abnormalType = null;
        //String ??????
        this.notation = null;
        //String ????????????
        this.stringValue = null;

        //??????
        this.add={"process":"vitalSignService.addOutput", "argument":this, "action":"add"
            , "onSuccess":null, "onError":null, "onComplete":null, "rewrite":true
        };
        this.add.send = function(){
            this.argument.parent.status="Y";
            this.argument.parent.mended="false";
            this.argument.parent.modifyDate=new Date().format('yyyy/MM/dd HH:mm:ss');
            this.argumentSend=this.argument.extend(this.argument.parent,this.argument);
            this.argument.commonCRUD(this.process,[{"vitalSign":this.argumentSend.cloneProperty(this.argumentSend)}],this.argument.getNode(),this.action,this.onSuccess,this.onError,this.onComplete,this.rewrite);
        };
    }
    eNursing.addModule(OutputEvent);


    /**????????????**/
    /** @namespace nursing.createBasicParam*/
    /** @namespace nursing.getBasicParam*/
    function BasicParam() {
        this.nodeId = eNursing.getFnName(BasicParam);
        this.basicVitalSignParam = null;
        this.vitalSign = {
            "funcNames":[
                "listBTData"
                ,"listPulseData"
                ,"listRespiratoryData"
                ,"listBPData"
                ,"listSpo2Data"
                ,"listUrinationData"
                ,"listStoolData"
                ,"listHeightData"
                ,"listWeightData"
                ,"listArmData"
                ,"listGirthData"
                ,"listHeadData"
                ,"listLegData"
                ,"listCVPData"
                ,"listRecordData"
            ]
        };
        //????????????????????????????????????
        this.getAllVitalSignParam = function (successCall, errorCall) {
            var that=this;
            var funcNames=this.vitalSign.funcNames;
            getVitalSignParamRun(0);
            function getVitalSignParamRun(ind){
                if (ind>=funcNames.length){
                    successCall(nursing.getBasicParam().getData(true));
                }
                else{
                    that.getVitalSignParam(funcNames[ind], function (_data) {
                        // console.log("=="+funcNames[ind]+"==");
                        getVitalSignParamRun(++ind);
                    }, errorCall, false);
                }
            }
        }
        this.defaultAllVitalSignParam = function(fnCall){
            //????????????????????????????????????
            var BP = nursing.getBasicParam();
            var newBasicParamDb = BP.getData(true);
            if (newBasicParamDb[0]==undefined){
                newBasicParamDb = [];
                newBasicParamDb[0] = {"basicParam":{"basicVitalSignParam":{}}};
                BP.setCache(newBasicParamDb);
            }
            var funcNames=this.vitalSign.funcNames;
           /* for (i in funcNames){
                if (typeof(funcNames[i])==="string"){
                    this.getVitalSignParam(funcNames[i], function (_data) {fnCall(funcNames.length)}, function (error) {fnCall(funcNames.length)}, false);
                }
            }*/
            var that=this;
            var getParam=function(index,funcNames,callback){
                if(index>=0&&index< funcNames.length){
                    if (typeof(funcNames[index])==="string"){

                        that.getVitalSignParam(funcNames[index], function (_data) {
                            index++;
                            callback(funcNames.length);
                            getParam(index,funcNames,callback);
                        }, function (error) {
                            callback(funcNames.length)
                        }, false);
                    }
                }


            };
            getParam(0,funcNames,function(len){
                fnCall(len);
            });


        }
        //????????????????????????????????????
        this.getVitalSignParam = function (funcName, successCall, errorCall, rewrite) {
            var param = {
                    /**????????????*/
                    node: this.getNode()+"[0].basicParam.basicVitalSignParam."+funcName,
                    /**??????*/
                    action: eNursing.preload
            };
            var BP = nursing.getBasicParam();
            var newBasicParamDb = BP.getData(true);
            if (newBasicParamDb[0]==undefined){
                newBasicParamDb = [];
                newBasicParamDb[0] = {"basicParam":{"basicVitalSignParam":{}}};
            }else if (newBasicParamDb[0]["basicParam"]["basicVitalSignParam"][funcName]!=undefined){
                successCall(newBasicParamDb[0]["basicParam"]["basicVitalSignParam"][funcName]);
                return ;
            }
            this.sendMsg("vitalSignParamService."+funcName, "basicParam", param, "", function (_data){
                var result = _data;
                if (result.resultMsg.success) {
                    var basicParamDb = result.data;
                    newBasicParamDb[0]["basicParam"]["basicVitalSignParam"][funcName]=basicParamDb[0]["basicParam"]["basicVitalSignParam"];
                    newBasicParamDb[0]["basicParam"]["basicVitalSignParam"][funcName].title=basicParamDb[0].title;
                    BP.setCache(newBasicParamDb);
                    successCall(newBasicParamDb[0]["basicParam"]["basicVitalSignParam"][funcName]);
                } else {
                    errorCall(result.resultMsg);
                }

            }, function(e){
                console.log(e);
            }, rewrite);
        }
        //?????????????????????????????? ?????? color ?????????<option>
        this.getVitOptColor = function (jsonData){
            var opt = "";
            for (i in jsonData.color)
                opt += "<option value='"+jsonData.color[i].colorId+"'>"+jsonData.color[i].colorName+"</option>";
            return opt;
        }
        //?????????????????????????????? ?????? look ?????????<option>
        this.getVitOptLook = function (jsonData){
            var opt = "";
            for (i in jsonData.look)
                opt += "<option value='"+jsonData.look[i].lookId+"'>"+jsonData.look[i].lookName+"</option>";
            return opt;
        }
        //?????????????????????????????? ?????? look ?????????<option>
        this.getVitOptLook = function (jsonData){
            var opt = "";
            for (i in jsonData.look)
                opt += "<option value='"+jsonData.look[i].lookId+"'>"+jsonData.look[i].lookName+"</option>";
            return opt;
        }
        //?????????????????????????????? ?????????????????? reason ?????????<option>
        this.getVitOptReason = function (jsonData){
            var opt = "";
            for (i in jsonData.reason)
                opt += "<option value='"+jsonData.reason[i].reasonId+"'>"+jsonData.reason[i].reasonName+"</option>";
            return opt;
        }
        //?????????????????????????????? ?????? type ?????????<option>
        this.getVitOptType = function (jsonData){
            var opt = "";
            for (i in jsonData.type)
                opt += "<option value='"+jsonData.type[i].typeValue+"'>"+jsonData.type[i].typeDesc+"</option>";
            return opt;
        }
        //?????????????????????????????? ?????? unit ?????????<option>
        this.getVitOptUnit = function (jsonData){
            var opt = "";
            for (i in jsonData.unit)
                opt += "<option value='"+jsonData.unit[i]["value"]+"'>"+jsonData.unit[i]["content"]+"</option>";
            return opt;
        }
        //?????????????????????????????? ???????????? abnormal ?????????<p><checkbox/></p>
        this.getVitCkbAbnormal = function (jsonData,name){
            var opt = "";
            for (i in jsonData.abnormalinfo){
                var info=jsonData.abnormalinfo[i];
                opt += "<p>";
                opt += "<input name='"+name+"' id='"+(name+i)+"' type='checkbox' value='"+info.interventionName+"'/>";
                opt += "<label for='"+(name+i)+"'>"+info.interventionName+"</label>";
                opt += "</p>";
            }
            return opt;
        }
        //????????????????????????????????????????????????????????????????????? standardValue ????????? onHighCall() inRangeCall() onLowCall()
        //(json)??????????????????,(String) birthday ??????(??????),(String) typeid ??????id(?????????), (double) checkVal ??????????????????,(fn) onHighCall,(fn) inRangeCall,(fn) onLowCall
        this.checkVitStandardValue = function (jsonData,birthday,typeid,checkVal,onHighCall,inRangeCall,onLowCall){
            birthday = new Date(birthday);
            processDate(birthday,0,0,0,0,0,0);
            for (i in jsonData.standardValue){
                var stdv=jsonData.standardValue[i];
                var minDate=new Date();
                var maxDate=new Date();
                processDate(maxDate,-stdv.maxyear*1,-stdv.maxmonth*1,-stdv.maxday*1,0,0,0);
                processDate(minDate,-stdv.minyear*1,-stdv.minmonth*1,-stdv.minday*1,0,0,0);
                if ((typeid==""||typeid==stdv.typeid) && (birthday<minDate&&birthday>maxDate)){
                    if (checkVal>stdv.maxvalue)
                        onHighCall();
                    else if (checkVal<stdv.minvalue)
                        onLowCall();
                    else
                        inRangeCall();
                    return;
                }
            }
            inRangeCall();
        }
    }

    eNursing.addModule(BasicParam);
}(eNursing);
