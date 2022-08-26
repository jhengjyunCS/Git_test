!function () {
    function Udorder() {
        this.nodeId = eNursing.getFnName(Udorder);
        this.parentConstructor = eNursing.getModules("Patient");
        /**医嘱序号*/
        this.ordseq = null;
        /**住院号*/
        this.encounterId = null;
        /* String */
        /**病历号*/
        this.patientId = null;
        /* String */
        /**医嘱名称*/
        this.name = null;
        /* String */
        /**学名*/
        this.materialName = null;
        /* String */
        /**药码*/
        this.drugCode = null;
        /* String */
        /**药品类别*/
        this.stock = null;
        /* String */
        /**药理分类*/
        this.drugType = null;
        /* String */
        /**剂量*/
        this.givDose = 0;
        /* float */
        /**规格含量*/
        this.unitDose = null;
        /* String */
        /**用药途径*/
        this.route = null;
        /* String */
        /**剂量单位*/
        this.givUnit = null;
        /* String */
        /**频次*/
        this.freqCode = null;
        /* String */
        /**频次类别*/
        this.freqType = null;
        /* String */
        /**医嘱生效日期时间*/
        this.beginTime = null;
        /* String */
        /**医嘱结束日期时间*/
        this.endTime = null;
        /* String */
        /**医嘱状态*/
        this.status = null;
        /* String */
        /**备注*/
        this.instruction = null;
        /* String */
        /**组别*/
        this.udGroup = null;
        /* String */
        /**是否为主要  1=是  0=不是  */
        this.isMainDrug = null;
        /* String */
        /**医嘱类别*/
        this.orderType = null;
        /* String */
        /**条码*/
        this.barCode = null;
        /* String */
        /**发药单位*/
        this.dispenseUnit = null;
        /* String */
        /**发药量*/
        this.dispenseQty = null;
        /* String */
        /**开单医生姓名*/
        this.orderDrName = null;
        /* String */
        /**开单医生ID*/
        this.orderDrCode = null;
        /* String */
        /**停用医生姓名*/
        this.dcOrderDrName = null;
        /* String */
        /**停用医生ID*/
        this.dcOrderDrCode = null;
        /* String */
        /**检验检查申请号*/
        this.medApplyNo = null;
        /* String */
        /**集合医嘱组号*/
        this.orderSetGroupNo = null;
        /* String */
        /**集合医嘱代码*/
        this.orderSetCode = null;
        /* String */
        /**集合医嘱主项*/
        this.setMainFlg = null;
        /* String */
        /**是否显示注记（集合医嘱细项不显示）*/
        this.hideFlg = null;
        /* String */
        /**检体*/
        this.specimen = null;
        /* String */
        /**备注*/
        this.infectionMemo = null;
        /* String */
        /**A) 當PACSUNDO=Y，要繼續顯示該醫囑並在確認時間欄位直接顯示執行時間及執行者。 * B) 若PACSUNDO=N且未執行，則仍需要顯示。* C) 若PACSUNDO=N且已執行，則不需要顯示。*/
        this.pacsUndo = null;
        /* String */
        /**PRN的用藥，判斷 UDORDERINFO.PREORDER=Y，只顯示醫囑資料不要顯示執行時間。當護理師在HIS中執行後（藥局發藥回來），再到【臨時用藥】中執行給藥。*/
        this.preOrder = null;
        /* String */
        /**签名日期*/
        this.signDate = null;
        /* Timestamp */
        /**签名姓名*/
        this.signName = null;
        /* String */
        /**医嘱分类*/
        this.ordType = null;
        /* String */
        /**检验编号*/
        this.labApplyNo = null;
        /* String */
        /**检验项目*/
        this.labItemNo = null;
        /* String */
        /**高警讯药品*/
        this.ordSubType = null;
        /* String */
        /**最后异动时间*/
        this.modifyDate = null;
        /* Date 格式为:yyyy/MM/dd HH:mm:ss */
        /**是否需要巡视*/
        this.isVisits = null;
        /* String */
        /**护理站*/
        this.stationId = null;
        /* String */
        /**PRN 最后一次执行时间*/
        this.prnLastSignTime = null;
        /* Timestamp */
        /**PRN 今天执行次数*/
        this.prnTodaySignTimes = 0;
        /* int */
        /**签用纪录*/
        this.drugSign = new DrugSign();
        this.listUnsignedOrders = function (patient, successCall, errorCall, action) {

            var param = {
                /**不同数据*/
                node: patient.getNode() + "." + this.nodeId,
                /**动作*/
                action: action || "select"
            };
            this.sendMsg("udorderService.listUnsignedOrders", patient, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (eNursing.preload === action) {
                        successCall();
                    } else {
                        var udorderDb = result.data;
                        var udorder = nursing.getUdorder();
                        udorder.setCache(udorderDb);
                        successCall(udorder.data);
                    }
                } else {
                    errorCall(result);
                }
            }, function (error) {
                errorCall(error);
            });
        };
        this.signOrders = function (udorderTmp, successCall, errorCall) {

            var param = {
                node: udorderTmp[0].getItem().getNode(),
                action: "update"
            };
            this.sendMsg("udorderService.signOrders", udorderTmp, param, "", function (result) {
                if (result.resultMsg.success) {
                    successCall(result);
                } else {
                    errorCall(result);
                }

            }, function (error) {
                errorCall(error);
            });
        };
    }

    eNursing.addModule(Udorder);

    function DrugSign() {
        this.nodeId = eNursing.getFnName(DrugSign);
        /**住院号*/
        this.encounterId = null;
        /* String */
        /**操作方式*/
        this.operation = null;
        /* String */
        /**签用序号*/
        this.uncrcppk = null;
        /* String */
        /**应执行日期时间*/
        this.rightTime = null;
        /* Timestamp */
        /**实际使用剂量*/
        this.givDose = 0;
        /* int */
        /**实际执行日期时间*/
        this.signTime = null;
        /* Timestamp */
        /**未执行原因代码*/
        this.unSignReasonCode = null;
        /* String */
        /**其他未执行原因*/
        this.unSignReasonNote = null;
        /* String */
        /**签收者ID*/
        this.signerId = null;
        /* String */
        /**签收者姓名*/
        this.signerName = null;
        /* String */
        /**应执行护理站*/
        this.executeStation = null;
        /* String */
        /**延迟原因代码*/
        this.delayReasonCode = null;
        /* String */
        /**其他延迟原因*/
        this.delayReasonNote = null;
        /* String */
        /**注记延迟原因的日期时间*/
        this.delayMarkerTime = null;
        /* Timestamp */
        /**注记延迟原因的注记者ID*/
        this.delayMarkerId = null;
        /* String */
        /**注记延迟原因的注记者姓名*/
        this.delayMarkerName = null;
        /* String */
        /**建立日期*/
        this.createTime = null;
        /* Timestamp */
        /**无效时间*/
        this.invalidTime = null;
        /* Timestamp */
        /**可否取消执行*/
        this.revokeAble = false;
        /* boolean */
        /**执行 '签用存档' 或 '取消执行存档' 时的 PRN 医嘱序号*/
        this.prnOrdSeq = null;
        /* String */
        /**错误讯息*/
        this.errorMsg = null;
        /* String */
        /**本次更新资料库的动作*/
        this.operations = null;
        /* String */
        /**执行 取消签用 或 取消 '未执行注记' 的时间*/
        this.revokeTime = null;
        /* Timestamp */
        /**医嘱的频次类别是否为为 PRN*/
        this.isPrn = false;
        /* boolean */
        /**当机补输*/
        this.signMode = null;
        /* String */
        /**执行模式*/
        this.logStatus = null;
        /* String */
        /**条码*/
        this.barCode = null;
        /* String */
        /**耗材编码*/
        this.invCode = null;
        /* String */
        /**修改时间*/
        this.modifyDate = null;
        /* Timestamp */
        /**30分钟后*/
        this.isAfter30Min = false;
        /* boolean */
        /**30分钟前*/
        this.isBefore30Min = false;
        /* boolean */
        /**双签帐号*/
        this.dbSignId = null;
        /* String */
        /**双签名字*/
        this.dbSignName = null;
        /* String */
        /**双签记注*/
        this.dbSignReason = null;
        /* String */
        /**超时执行原因代码*/
        this.overranReasonCode = null;
        /* String */
        /**其他超时原因*/
        this.overranReasonNote = null;
        /* String */
        /**提早执行原因代码*/
        this.earlyReasonCode = null;
        /* String */
        /**其他提早原因*/
        this.earlyReasonNote = null;
        /* String */
        /**是否取消过*/
        this.canceled = null;
        /* String */
        /**「電子簽章」有效性*/
        this.validity = null;
        /* 组号 */
        this.group_no = null;

    }

    eNursing.addModule(DrugSign);

    /**条码**/
    function Barcode() {
        this.nodeId = eNursing.getFnName(Barcode);
        this.parentConstructor = eNursing.getModules("Patient");
        //条码
        this.code = null;
        this.codeInfo = [];
        /**查一个人所有条码，传入Barcode对象**/
        this.queryAllBarcode = function (patient, successCall, errorCall, action) {

            var param = {
                node: patient.getNode() + "." + this.nodeId,
                action: action || "select"
            };
            this.sendMsg("barcodeService.queryAllBarcode", patient, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (eNursing.preload === action) {
                        successCall();
                    } else {
                        var barcodeDb = result.data;
                        var barcode = nursing.getBarcode();
                        barcode.setCache(barcodeDb);
                        successCall(barcode.data);
                    }
                } else {
                    errorCall(result);
                }
            }, function (error) {
                errorCall(error);
            });
        };

    }

    eNursing.addModule(Barcode);

    /**条码信息**/
    function CodeInfo() {
        this.nodeId = eNursing.getFnName(CodeInfo);
        //病例号
        this.patientId = null;
        //包药机是药码,
        this.drugCode = null;
        //pivas是医嘱序号
        this.ordseq = null;
        //应执行时间
        this.rightTime = null;
    }

    eNursing.addModule(CodeInfo);
}(eNursing);
