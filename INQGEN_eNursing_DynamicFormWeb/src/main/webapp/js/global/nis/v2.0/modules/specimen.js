!function () {
	/**@namespace  nursing.getSpecimenObj*/
    function SpecimenObj() {
        this.nodeId = eNursing.getFnName(SpecimenObj);
        this.parentConstructor = eNursing.getModules("Station");
        /**条码*/
        this.barCode = null;
        /**住院号*/
        this.encId = null;
        /**病历号*/
        this.patientId = null;
        /**病人姓名*/
        this.patName = null;
        /**病人病区*/
        this.stationId = null;
        /**病人床号*/
        this.bedNo = null; 
        /**采集人员账号*/
        this.userId = null; 
        /**采集项目*/
        this.itemDesc = null;
        /**申请日期*/
        this.applyTime = null;
        this.selectDataByStationId = function (patient, successCall, errorCall, action) {
            var param = {
                /**不同数据*/
                node:  patient.getNode()+this.nodeId,
                /**动作*/
                action: action || "select"
            };
            this.sendMsg("specimenService.selectDataByStationId", patient, param, "", function (result) {
                if (result.resultMsg.success) {
                    if ($N.preload === action) {
                        successCall();
                    } else {
                        var specimenObj = nursing.getSpecimenObj();
                        specimenObj.setCache(result.data, "barCode");
                        successCall(specimenObj.data);
                    }
                } else {
                    errorCall(result);
                }
            }, function (error) {
                errorCall(error);
            });
        };
        this.spUpdateSampLingTime = function (tmp, successCall, errorCall) {
            var param = {
                node:  tmp[0].getItem().getNode(),
                action: "update"
            };
            this.sendMsg("specimenService.spUpdateSampLingTime", tmp, param, "", function (result) {
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

    eNursing.addModule(SpecimenObj);

}(eNursing);
