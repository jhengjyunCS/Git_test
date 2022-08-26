!function () {
    function Patient() {
        this.nodeId = eNursing.getFnName(Patient);
        this.parentConstructor = eNursing.getModules("Station");
        this.hisNum = null;
        this.caseno = null;
        this.chinName = null;
        this.engName = null;
        this.bed = null;
        this.doctorIds = [];
        this.doctors = [];
        this.nurseId = null;
        this.nurseName = null;
        this.inDate = null;
        this.inStationDate = null;
        this.sex = null;
        this.section = null;
        this.status = null;
        this.nursingClass = null;
        this.patientStatus = null;
        this.nursingClassDesc = null;
        this.patientStatusDesc = null;
        this.endDate = null;
        this.birthday = null;
        this.diagnosis = null;
        this.allergy = null;
        this.patAge = null;
        this.ageDesc = null;
        this.pathWay = null;
        this.identityCheck = null;
        this.shortName = null;
        this.computerNo = null;
        this.foodType = null;
        this.insuranceType = null;
        this.newOrder = null;

        this.listPatient = function (station, successCall, errorCall, action, rewrite,toCoveredAction) {
            var param = {
                /**不同数据*/
                node: station.getNode() + "." + this.nodeId,
                /**动作 preload*/
                action: action || "select"
            };
            if (toCoveredAction) {
                toCoveredAction = "patientService.listMyPatients";
            }
            this.sendMsg("patientService.list", station, param, "", function (result) {
                if (result.resultMsg.success) {
                    if ($N.preload === action) {
                        successCall();
                    } else {
                        var patientsDb = result.data;
                        var patient = nursing.getPatient();
                        patient.setCache(patientsDb, "caseno");
                        successCall(patient.getData(true));
                    }
                } else {
                    errorCall(result.resultMsg || "");
                }
            }, errorCall, rewrite,toCoveredAction);
        };

        this.listMyPatients = function (station, successCall, errorCall, action, rewrite,beCovered) {
            var param = {
                /**不同数据*/
                node: station.getNode() + "." + this.nodeId+".MyPatient",
                /**动作*/
                action: action || "select"
            };
            if (beCovered) {
                beCovered = "patientService.list";
            }
            this.sendMsg("patientService.listMyPatients", station, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (eNursing.preload === action) {
                        successCall();
                    } else {
                        var patientsDb = result.data;
                        var patient = nursing.getPatient();
                        patient.setCache(patientsDb, "caseno");
                        successCall(patient.getData(true));
                    }
                } else {
                    errorCall(result.resultMsg || "");
                }
            }, errorCall, rewrite,beCovered);
        }

        /*查询病人*/
        /*this.getPatient = function (patient, successCall, errorCall, action, rewrite) {
            patient.setNodeValue(patient.hisNum);
            var param = {
                /!**不同数据*!/
                node: patient.getNode() + "." + this.nodeId,
                /!**动作 preload*!/
                action: action || "select"
            };
            this.sendMsg("patientService.getPatient", patient, param, "", function (result) {
                if (result.resultMsg.success) {
                    var patientsDb = result.data,
                    patient = nursing.getPatient(),
                    station=nursing.getStation(),
                    stationsTmp=station.getData(true),
                    stationMap={};
                    var stationId=patientsDb[0].patient.parent.stationId;
                    for(var i=0;i<stationsTmp.length;i++){
                        var stationTmp=stationsTmp[i];
                        stationMap[stationTmp.stationId]=stationTmp;
                        if (stationId === stationTmp.stationId) {
                            break;
                        }
                    }
                    var index=station.getCurrentIndex(),
                    indexTmp=stationMap[stationId].index;
                    station.setCurrent(indexTmp);
                    patient.setCache(patientsDb, "caseno",0);
                    station.setCurrent(index);
                    successCall();
                } else {
                    errorCall(result.resultMsg || "");
                }
            }, errorCall, rewrite);
        };*/
        this.getPatient=function (hisNum,noTitle) {
            var patient=nursing.getPatient();
            patient.dataMap=patient.dataMap||{};
            var dataMap = patient.dataMap;
            var dataTmp = dataMap[hisNum];
            if (dataTmp) {
                return noTitle?eNursing.toData(dataTmp,Patient.name):dataTmp;
            }else{
                var dataSet=patient.getData();
                var prevIndex = dataMap.prevIndex === undefined ? 0 : dataMap.prevIndex;
                for (var i = prevIndex; i < dataSet.length; i++) {
                    var patientTmp=eNursing.toData(dataSet[i],Patient.name);
                    var hisNumT=patientTmp.hisNum;
                    dataMap[hisNumT] = dataSet[i];
                    if (hisNum === hisNumT) {
                        dataMap.prevIndex = i;
                        return noTitle?patientTmp:dataSet[i];
                    }
                }
            }
        }
    }

    eNursing.addModule(Patient);
}(eNursing);
