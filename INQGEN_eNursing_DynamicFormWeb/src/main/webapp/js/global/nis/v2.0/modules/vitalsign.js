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
    /**基础事件**/
    function BaseEvent(){
        this.nodeId = eNursing.getFnName(BaseEvent);
        this.parentConstructor=eNursing.getModules("Patient");
        //String    事件序号
        this.id = null;
        //String    就诊号
        this.encounterId = null;
        //String    院区
        this.zoneId = null;
        //String    病历号
        this.patientId = null;
        //char  就诊类型
        this.encounterType = "I";
        //Date  事件发生日期时间
        this.occurDate = null;
        //boolean   事件是否被注记为转护理记录
        this.marked = null;
        //boolean   事件是否被注记为补充资料
        this.mended = null;
        //Date  修改日期
        this.modifyDate = null;
        //String    修改者
        this.modifier = null;
        //String    修改者姓名
        this.modifierName = null;
        //char  事件状态 Y : 目前作用中资料 , M : 更改的记录 , D : 已被删除的记录
        this.status = null;
        //String    护理站id
        this.stationId = null;
        //String    床号
        this.bedId = null;
        //String    无法测量原因
        this.reason = null;
        //char  转护理记录类型
        this.recordType = null;
        //String    护理记录 poid
        this.recordPoid = null;
        //boolean   是否删除护理记录
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

    /**药物信息**/
    function Medicine(){
        this.nodeId = eNursing.getFnName(Medicine);
        //int 药物
        this.medicine = null;
        //String 药物其它文字
        this.medicineOther = null;
        //int 途径
        this.route = null;
        //double 给药剂量
        this.numberValue = null;
        //String 给药单位
        this.unit = null;
    }
    eNursing.addModule(Medicine);

    /**性狀信息**/
    function Traits(){
        this.nodeId = eNursing.getFnName(Traits);
        //int 颜色
        this.color = null;
        //String 颜色其他
        this.colorOther = null;
        //int 味道
        this.flavor = null;
        //String 味道其他
        this.flavorOther = null;
        //int 性状
        this.nature = null;
        //String 性质其他
        this.natureOther = null;
    }
    eNursing.addModule(Traits);


    /**VitalSign 体温**/
    function BtEvent(){
        this.nodeId = eNursing.getFnName(BtEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String  事件类型 腋温：BT.AXILLARY；耳温：BT.EAR；口温：BT.ORCL;额温：BT.RECTAL
        this.type = null;
        //String  事件说明
        this.typeName = null;
        //double  事件资料值
        this.numberValue = null;
        //String  value = "事件资料单位",content = "C"
        this.unit1 = "C";
        //boolean  是否因前次处置产生事件
        this.afterTreatment = null;
        //String  事件备注说明
        this.notation = null;
        //String  护理处置
        this.treatment = null;
        //int  密切观察项目
        this.specialTreatment = null;
        //String  密切观察项目其他说明
        this.spNotation = null;
        //Medicine  药物信息
        this.medicine = new Medicine();
        //boolean  value = "是否在TPR已打印, 预设为 TRUE",content = "true"
        this.tpr = true;
        //String  事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 脉搏**/
    function PulseEvent(){
        this.nodeId = eNursing.getFnName(PulseEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String 事件类型 脉搏：PULSE.USUAL；心率：PULSE.HEART.BEAT；使用起搏器：PULSE.PACEMAKER
        this.type = null;
        //String 事件说明
        this.typeName = null;
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位
        this.unit ="/min";
        //String 事件备注说明
        this.notation = null;
        //String 护理处置
        this.treatment = null;
        //int 密切观察项目
        this.specialTreatment = null;
        //String 密切观察项目其他说明
        this.spNotation = null;
        //Medicine 药物信息
        this.medicine = new Medicine();
        //boolean 是否在TPR已打印, 预设为 TRUE
        this.tpr= true;
        //String 事件说明
        this.stringValue = null;

        //新增
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


    /**VitalSign 呼吸**/
    function RespEvent(){
        this.nodeId = eNursing.getFnName(RespEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String 事件类型,content = "RESPIRATORY"
        this.type = "RESPIRATORY";
        //String 事件说明,content = "呼吸"
        this.typeName = "呼吸";
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位,content = "/min"
        this.unit = "/min";
        //String 事件备注说明
        this.notation = null;
        //String 护理处置
        this.treatment = null;
        //int 密切观察项目
        this.specialTreatment = null;
        //String 密切观察项目其他说明
        this.spNotation = null;
        //int 呼吸器与氧气疗法 0:未使用 1:呼吸器 2:氧气疗法
        this.breathingMethod = null;
        //boolean 是否在TPR已打印, 预设为 TRUE
        this.tpr = true;
        //String 事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 血压**/
    function BpEvent(){
        this.nodeId = eNursing.getFnName(BpEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String 事件类型 血压_ABP：BP.ABP；血压_NBP：BP.NBP
        this.type = null;
        //String 事件说明
        this.typeName = null;
        //double 收缩压测量值
        this.numberValue1 = null;
        //String 收缩压单位,content = "mmHg"
        this.unit1 = "mmHg";
        //double 舒张压测量值
        this.numberValue2 = null;
        //String 舒张压单位,content = "mmHg"
        this.unit2 = "mmHg";
        //int 测量姿势
        this.pose = null;
        //int 测量部位
        this.region = null;
        //String 事件备注说明
        this.notation = null;
        //String 护理处置
        this.treatment = null;
        //int 密切观察项目
        this.specialTreatment = null;
        //String 密切观察项目其他说明
        this.spNotation = null;
        //Medicine 药物信息
        this.medicine = new Medicine();
        //boolean 是否在TPR已打印, 预设为 TRUE,content = "true"
        this.tpr = true;
        //String 事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 排便**/
    function StoolEvent(){
        this.nodeId = eNursing.getFnName(StoolEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String 事件类型 人工肛门:STOOL.COLOSTOMY;指挖:STOOL.DIGITAL;塞剂:STOOL.DULCOLAX;灌肠:STOOL.ENEMA;失禁:STOOL.INCONTINENCE;自解:STOOL.NORMAL
        this.type = null;
        //String 事件说明
        this.typeName = null;
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位,content = "次"
        this.unit = "次";
        //Traits 性状
        this.traits = new Traits();
        //String 事件备注说明
        this.notation = null;
        //String 护理处置
        this.treatment = null;
        //String 事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 排尿**/
    function UrinationEvent(){
        this.nodeId = eNursing.getFnName(UrinationEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String 事件类型 膀胱造瘘:URINATION.CYSTOSTOMY;失禁:URINATION.INCONTINENCE;自解:URINATION.SELF;导尿:URINATION.TUBE;输尿管皮肤造口:URINATION.UCST;
        this.type = null;
        //String 事件说明
        this.typeName = null;
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位
        this.unit = null;
        //Traits 性状
        this.traits = new Traits();
        //String 事件备注说明
        this.notation = null;
        //String 护理处置
        this.treatment = null;
        //String 事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 疼痛**/
    function PainEvent(){
        this.nodeId = eNursing.getFnName(PainEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");
        //String 事件类型,content="PAIN"
        this.type = "PAIN";
        //String 事件说明,content="疼痛"
        this.typeName = "疼痛";
        //double 事件资料值
        this.numberValue = null;
        //int 评估方式
        this.evalMethod = null;
        //String 事件资料单位,content="分"
        this.unit = "分";
        //Map<String,String> 评估选项
        this.evalOptions = {};
        //boolean 是否在TPR已打印, 预设为 TRUE",content = "true"
        this.tpr = true;
        //String 事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 血氧饱和度**/
    function SpO2Event(){
        this.nodeId = eNursing.getFnName(SpO2Event);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content="SPO2"
        this.type = "SPO2";
        //String 事件说明,content="Spo2"
        this.typeName = "Spo2";
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位,content="%"
        this.unit = "%";
        //String 护理处置
        this.treatment = null;
        //boolean 是否在TPR已打印, 预设为 TRUE",content = "true"
        this.tpr= true;
        //String 事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 血流动力学**/
    function CvpEvent(){
        this.nodeId = eNursing.getFnName(CvpEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content="CVP"
        this.type = "CVP";
        //String 事件说明,content="血流动力学"
        this.typeName = "血流动力学";
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位
        this.unit = null;
        //String 护理处置
        this.treatment = null;
        //boolean 是否在TPR已打印, 预设为 TRUE",content = "true"
        this.tpr= true;
        //String 事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 昏迷指标**/
    function ComaIndexEvent(){
        this.nodeId = eNursing.getFnName(ComaIndexEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        // 睁眼反射
        this.comaEye = new ComaEye();
        // 非偏瘫侧运动反应
        this.comaMotion = new ComaMotion();
        // 语言反应
        this.comaTongue = new ComaTongue();

        //新增
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

    /**VitalSign 睁眼反射**/
    function ComaEye(){
        this.nodeId = eNursing.getFnName(ComaEye);

        //String 事件类型,content = "COMASCALE.COMA.EYE"
        this.type = "COMASCALE.COMA.EYE";
        //String 事件说明,content = "睁眼反射"
        this.typeName = "睁眼反射";
        //String 事件资料单位,content = "ADULT"
        this.unit1 = "ADULT";
        //double 事件资料值
        this.numberValue1 = null;
    }
    eNursing.addModule(ComaEye);

    /**VitalSign 非偏瘫侧运动反应**/
    function ComaMotion(){
        this.nodeId = eNursing.getFnName(ComaMotion);

        //String 事件类型,content = "COMASCALE.COMA.MOTION"
        this.type = "COMASCALE.COMA.MOTION";
        //String 事件说明,content = "非偏瘫侧运动反应"
        this.typeName = "非偏瘫侧运动反应";
        //String 事件资料单位,content = "ADULT"
        this.unit1 = "ADULT";
        //double 事件资料值
        this.numberValue1 = null;
    }
    eNursing.addModule(ComaMotion);

    /**VitalSign 语言反应**/
    function ComaTongue(){
        this.nodeId = eNursing.getFnName(ComaTongue);

        //String 事件类型,content = "COMASCALE.COMA.TONGUE"
        this.type = "COMASCALE.COMA.TONGUE";
        //String 事件说明,content = "语言反射 "
        this.typeName = "语言反射 ";
        //String 事件资料单位,content = "ADULT"
        this.unit1 = "ADULT";
        //double 事件资料值
        this.numberValue1 = null;
    }
    eNursing.addModule(ComaTongue);

    /**VitalSign 神志**/
    function ConsciousnessEvent(){
        this.nodeId = eNursing.getFnName(ConsciousnessEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "COMASCALE.CONSCIOUSNESS"
        this.type = "COMASCALE.CONSCIOUSNESS";
        //String 事件说明,content = "神志"
        this.typeName = "神志";
        //String 意识状态
        this.abnormalType = null;

        //新增
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

    /**VitalSign 肌力测量**/
    function MuscleEvent(){
        this.nodeId = eNursing.getFnName(MuscleEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //MuscleLeftArm 左臂肌力
        this.comaScaleMuscleLeftArm = new MuscleLeftArm();
        //MuscleLeftLeg 左腿肌力
        this.comaScaleMuscleLeftLeg = new MuscleLeftLeg();
        //MuscleRightArm 右臂肌力
        this.comaScaleMuscleRightArm = new MuscleRightArm();
        //MuscleRightLeg 右腿肌力
        this.comaScaleMuscleRightLeg = new MuscleRightLeg();

        //新增
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

    /**VitalSign 肌力測量值**/
    function Muscle(){
        this.nodeId = eNursing.getFnName(Muscle);

        //double 事件资料值1
        this.numberValue1 = null;
        //double 事件资料值2
        this.numberValue2 = null;
        //String 事件资料单位,content = "ADULT")
        this.unit1 = "ADULT";
    }
    eNursing.addModule(Muscle);

    /**VitalSign 左臂肌力**/
    function MuscleLeftArm(){
        this.nodeId = eNursing.getFnName(MuscleLeftArm);
        
        //String 事件类型,content = "COMASCALE.MUSCLE.LEFT.ARM"
        this.type = "COMASCALE.MUSCLE.LEFT.ARM";
        //String 事件说明,content = "左臂肌力"
        this.typeName = "左臂肌力";
        //Muscle 肌力測量值
        this.muscle = new Muscle();
    }
    eNursing.addModule(MuscleLeftArm);

    /**VitalSign 左腿肌力**/
    function MuscleLeftLeg(){
        this.nodeId = eNursing.getFnName(MuscleLeftLeg);
        
        //String 事件类型,content = "COMASCALE.MUSCLE.LEFT.LEG"
        this.type = "COMASCALE.MUSCLE.LEFT.LEG";
        //String 事件说明,content = "左腿肌力"
        this.typeName = "左腿肌力";
        //Muscle 肌力測量值
        this.muscle = new Muscle();
    }
    eNursing.addModule(MuscleLeftLeg);

    /**VitalSign 右臂肌力**/
    function MuscleRightArm(){
        this.nodeId = eNursing.getFnName(MuscleRightArm);
        
        //String 事件类型,content = "COMASCALE.MUSCLE.RIGHT.ARM"
        this.type = "COMASCALE.MUSCLE.RIGHT.ARM";
        //String 事件说明,content = "右臂肌力"
        this.typeName = "右臂肌力";
        //Muscle 肌力測量值
        this.muscle = new Muscle();
    }
    eNursing.addModule(MuscleRightArm);

    /**VitalSign 右腿肌力**/
    function MuscleRightLeg(){
        this.nodeId = eNursing.getFnName(MuscleRightLeg);
        
        //String 事件类型,content = "COMASCALE.MUSCLE.RIGHT.LEG"
        this.type = "COMASCALE.MUSCLE.RIGHT.LEG";
        //String 事件说明,content = "右腿肌力"
        this.typeName = "右腿肌力";
        //Muscle 肌力測量值
        this.muscle = new Muscle();
    }
    eNursing.addModule(MuscleRightLeg);

    /**VitalSign 肢体活动**/
    function PhysicalActivity(){
        this.nodeId = eNursing.getFnName(PhysicalActivity);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "COMASCALE.PHYSICALACTIVITY"
        this.type = "COMASCALE.PHYSICALACTIVITY";
        //String 事件说明,content = "肢体活动"
        this.typeName = "肢体活动";
        //String 状态
        this.abnormalType = null;
        //String 异常部位
        this.reasonOther = null;

        //新增
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

    /**VitalSign 瞳孔指标**/
    function PupilIndexEvent(){
        this.nodeId = eNursing.getFnName(PupilIndexEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //PupilLeft 瞳孔指标-左眼
        this.comaScalePupilLeft = new PupilLeft();
        //PupilRight 瞳孔指标-右眼
        this.comaScalePupilRight = new PupilRight();

        //新增
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

    /**VitalSign 瞳孔指标-測量值**/
    function Pupil(){
        this.nodeId = eNursing.getFnName(Pupil);

        //String 光反射
        this.reaction = null;
        //double 事件资料值
        this.numberValue = null;
        //String 無法測量原因
        this.reasonPupil = null;
        //String 無法測量原因-其他
        this.reasonPupilOther = null;
        //String 事件资料单位,content = "ADULT")
        this.unit1 = "ADULT";
    }
    eNursing.addModule(Pupil);


    /**VitalSign 瞳孔指标-左眼**/
    function PupilLeft(){
        this.nodeId = eNursing.getFnName(PupilLeft);
        
        //String 事件类型,content = "COMASCALE.PUPIL.LEFT"
        this.type = "COMASCALE.PUPIL.LEFT";
        //String 事件说明,content = "瞳孔指标-左眼 "
        this.typeName = "瞳孔指标-左眼 ";
        //Pupil 瞳孔指标-驗光
        this.pupil = new Pupil();
    }
    eNursing.addModule(PupilLeft);

    /**VitalSign 瞳孔指标-右眼**/
    function PupilRight(){
        this.nodeId = eNursing.getFnName(PupilRight);
        
        //String 事件类型,content = "COMASCALE.PUPIL.RIGHT"
        this.type = "COMASCALE.PUPIL.RIGHT";
        //String 事件说明,content = "瞳孔指标-右眼 "
        this.typeName = "瞳孔指标-右眼 ";
        //Pupil 瞳孔指标-驗光
        this.pupil = new Pupil();
    }
    eNursing.addModule(PupilRight);

    /**VitalSign BodyRound測量值**/
    function BodyRoundEvent(){
        this.nodeId = eNursing.getFnName(BodyRoundEvent);

        //String 事件资料单位
        this.unit ="cm";
        //double 事件资料值
        this.numberValue = null;
        //String 事件备注说明
        this.notation = null;
    }
    eNursing.addModule(BodyRoundEvent);

    /**VitalSign 左前臂臂围**/
    function ForeArmLeftEvent(){
        this.nodeId = eNursing.getFnName(ForeArmLeftEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "FOREARM.LEFT"
        this.type = "FOREARM.LEFT";
        //String 事件说明,content = "左前臂臂围"
        this.typeName = "左前臂臂围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 右前臂臂围**/
    function ForeArmRightEvent(){
        this.nodeId = eNursing.getFnName(ForeArmRightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "FOREARM.RIGHT"
        this.type="FOREARM.RIGHT";
        //String 事件说明,content = "右前臂臂围"
        this.typeName="右前臂臂围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 腹围**/
    function GirthEvent(){
        this.nodeId = eNursing.getFnName(GirthEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "GIRTH"
        this.type="GIRTH";
        //String 事件说明,content = "腹围"
        this.typeName="腹围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 头围**/
    function HeadEvent(){
        this.nodeId = eNursing.getFnName(HeadEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "HEAD"
        this.type="HEAD";
        //String 事件说明,content = "头围"
        this.typeName="头围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 左小腿腿围**/
    function LegLeftEvent(){
        this.nodeId = eNursing.getFnName(LegLeftEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "LEG.LEFT"
        this.type="LEG.LEFT";
        //String 事件说明,content = "左小腿腿围"
        this.typeName="左小腿腿围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 右小腿腿围**/
    function LegRightEvent(){
        this.nodeId = eNursing.getFnName(LegRightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "LEG.RIGHT"
        this.type="LEG.RIGHT";
        //String 事件说明,content = "右小腿腿围"
        this.typeName="右小腿腿围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 左大腿腿围**/
    function ThighLeftEvent(){
        this.nodeId = eNursing.getFnName(ThighLeftEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "THIGH.LEFT"
        this.type="THIGH.LEFT";
        //String 事件说明,content = "左大腿腿围"
        this.typeName="左大腿腿围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 右大腿腿围**/
    function ThighRightEvent(){
        this.nodeId = eNursing.getFnName(ThighRightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "THIGH.RIGHT"
        this.type="THIGH.RIGHT";
        //String 事件说明,content = "右大腿腿围"
        this.typeName="右大腿腿围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 左上臂臂围**/
    function UpperArmLeftEvent(){
        this.nodeId = eNursing.getFnName(UpperArmLeftEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "UPPER.ARM.LEFT"
        this.type = "UPPER.ARM.LEFT";
        //String 事件说明,content = "左上臂臂围"
        this.typeName = "左上臂臂围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 右上臂臂围**/
    function UpperArmRightEvent(){
        this.nodeId = eNursing.getFnName(UpperArmRightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content = "UPPER.ARM.RIGHT"
        this.type="UPPER.ARM.RIGHT";
        //String 事件说明,content = "右上臂臂围"
        this.typeName="右上臂臂围";
        //BodyRound測量值 臂围測量值
        this.bodyRoundEvent = new BodyRoundEvent();

        //新增
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

    /**VitalSign 身高**/
    function HeightEvent(){
        this.nodeId = eNursing.getFnName(HeightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content="HEIGHT"
        this.type="HEIGHT";
        //String 事件说明,content="身高"
        this.typeName="身高";
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位,content="cm"
        this.unit="cm";
        //String 事件备注说明
        this.notation = null;
        //boolean 是否在TPR已打印, 预设为 TRUE",content = "true"
        this.tpr= true;
        //String 事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 体重**/
    function WeightEvent(){
        this.nodeId = eNursing.getFnName(WeightEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型,content="WEIGHT"
        this.type="WEIGHT";
        //String 事件说明,content="体重"
        this.typeName="体重";
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位,content="Kg"
        this.unit="Kg";
        //String 事件备注说明
        this.notation = null;
        //boolean 是否在TPR已打印, 预设为 TRUE",content = "true"
        this.tpr= true;
        //String 事件说明
        this.stringValue = null;

        //新增
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

    /**VitalSign 注射**/
    function Inject(){
        this.nodeId = eNursing.getFnName(Inject);

        //String 部位
        this.region = null;
        //String 药嘱
        this.medOrder = null;
        //double 滴速
        this.dripSpeed = null;
        //String 滴速单位
        this.dripSpeedUnit = null;
        //String 皮肤状态
        this.skinCondition = null;
        //String 皮肤状态_其他
        this.skinConditionOther = null;

    }
    eNursing.addModule(Inject);

    /**VitalSign 输入量**/
    function InputEvent(){
        this.nodeId = eNursing.getFnName(InputEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型
        this.type = null;
        //String 事件说明
        this.typeName = null;
        //String 事件备注说明
        this.notation = null;
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位",content = "ML"
        this.unit="ML";
        //Inject 注射
        this.inject = new Inject();
        //String 事件项目类型
        this.projectType = null;
        //String 事件说明
        this.stringValue = null;

        //新增
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
        // //int 颜色
        // this.color = null;
        // //String 颜色其他
        // this.colorOther = null;
        // //int 味道
        // this.flavor = null;
        // //String 味道其他
        // this.flavorOther = null;
        // //int 性状
        // this.nature = null;
        // //String 性质其他
        // this.natureOther = null;
    /**VitalSign 输出量**/
    function OutputEvent(){
        this.nodeId = eNursing.getFnName(OutputEvent);
        this.parentConstructor=eNursing.getModules("BaseEvent");

        //String 事件类型
        this.type = null;
        //String 事件说明
        this.typeName = null;
        //double 事件资料值
        this.numberValue = null;
        //String 事件资料单位
        this.unit = null;
        //String 种类-代码
        this.species = null;
        //String 种类-内容
        this.speciesContext = null;
        //String 种类-其他
        this.speciesOther = null;
        //Traits 性状
        this.traits = new Traits();
        //String 引流通畅度
        this.abnormalType = null;
        //String 备注
        this.notation = null;
        //String 事件说明
        this.stringValue = null;

        //新增
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


    /**基础参数**/
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
        //取得所有生命體徵相關參數
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
            //預載所有生命體徵相關參數
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
        //取得某個生命體徵相關參數
        this.getVitalSignParam = function (funcName, successCall, errorCall, rewrite) {
            var param = {
                    /**不同数据*/
                    node: this.getNode()+"[0].basicParam.basicVitalSignParam."+funcName,
                    /**动作*/
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
        //從生命體徵參數中取出 顏色 color 並組成<option>
        this.getVitOptColor = function (jsonData){
            var opt = "";
            for (i in jsonData.color)
                opt += "<option value='"+jsonData.color[i].colorId+"'>"+jsonData.color[i].colorName+"</option>";
            return opt;
        }
        //從生命體徵參數中取出 性狀 look 並組成<option>
        this.getVitOptLook = function (jsonData){
            var opt = "";
            for (i in jsonData.look)
                opt += "<option value='"+jsonData.look[i].lookId+"'>"+jsonData.look[i].lookName+"</option>";
            return opt;
        }
        //從生命體徵參數中取出 性狀 look 並組成<option>
        this.getVitOptLook = function (jsonData){
            var opt = "";
            for (i in jsonData.look)
                opt += "<option value='"+jsonData.look[i].lookId+"'>"+jsonData.look[i].lookName+"</option>";
            return opt;
        }
        //從生命體徵參數中取出 無法計量原因 reason 並組成<option>
        this.getVitOptReason = function (jsonData){
            var opt = "";
            for (i in jsonData.reason)
                opt += "<option value='"+jsonData.reason[i].reasonId+"'>"+jsonData.reason[i].reasonName+"</option>";
            return opt;
        }
        //從生命體徵參數中取出 類別 type 並組成<option>
        this.getVitOptType = function (jsonData){
            var opt = "";
            for (i in jsonData.type)
                opt += "<option value='"+jsonData.type[i].typeValue+"'>"+jsonData.type[i].typeDesc+"</option>";
            return opt;
        }
        //從生命體徵參數中取出 單位 unit 並組成<option>
        this.getVitOptUnit = function (jsonData){
            var opt = "";
            for (i in jsonData.unit)
                opt += "<option value='"+jsonData.unit[i]["value"]+"'>"+jsonData.unit[i]["content"]+"</option>";
            return opt;
        }
        //從生命體徵參數中取出 異常處置 abnormal 並組成<p><checkbox/></p>
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
        //從生命體徵參數中比較是否大於最大值或小於最小值 standardValue 並返回 onHighCall() inRangeCall() onLowCall()
        //(json)生命體徵參數,(String) birthday 年齡(必填),(String) typeid 類型id(可為空), (double) checkVal 被比較的數字,(fn) onHighCall,(fn) inRangeCall,(fn) onLowCall
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
