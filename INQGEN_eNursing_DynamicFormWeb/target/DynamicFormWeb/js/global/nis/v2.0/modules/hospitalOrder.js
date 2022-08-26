!function () {
    function HospitalOrder() {
        this.nodeId = eNursing.getFnName(HospitalOrder);
        this.EFFECT_DATE = null;
        this.ORDER_CODE = null;
        this.GOV_ORDER_CODE = null;
        this.CH_TRADE_NAME = null;
        this.EN_TRADE_NAME = null;
        this.CH_SCIENTIFIC_NAME = null;
        this.EN_SCIENTIFIC_NAME = null;
        this.CH_ABBREVIATION = null;
        this.EN_ABBREVIATION = null;
        this.PY_CODE = null;
        this.ORDER_TYPE_ID = null;
        this.EXPENSE_CATRY_ID = null;
        this.DRUG_TYPE_ID = null;
        this.PHARMACOLOGY_TYPE_ID = null;
        this.DRUG_LIMIT_ID = null;
        this.DRUG_FORM_ID = null;
        this.SPECIAL_EXPLAIN = null;
        this.DECOCTION_METHOD_ID = null;
        this.HIGHPRICE_DRUG = null;
        this.IS_CURE = null;
        this.OPD_FREQ_CODE = null;
        this.IPD_FREQ_CODE = null;
        this.USAGE_ID = null;
        this.DOSAGE = null;
        this.DAYS = null;
        this.PRODUCING_AREA_ID = null;
        this.MANUFACTURE = null;
        this.DRUG_SPEC = null;
        this.PACKAGE_UNIT_ID = null;
        this.OPD_CHARGE_UNIT_ID = null;
        this.IPD_CHARGE_UNIT_ID = null;
        this.DOSAGE_UNIT_ID = null;
        this.OPD_TRANSRATE = null;
        this.IPD_TRANSRATE = null;
        this.SUBSTITUTE_ORDER_CODE = null;
        this.INV_CODE = null;
        this.IS_CONFIRM = null;
        this.STOPDRUG = null;
        this.STOPDRUG_REASON_ID = null;
        this.END_DATE = null;
        this.DC = null;
        this.CREATE_USER = null;
        this.CREATE_TIME = null;
        this.MODIFIED_USER = null;
        this.MODIFIED_TIME = null;
        this.SEND_DRUG = null;
        this.IS_ORDER_CONTROL = null;
        this.ORDER_MEMO = null;
        this.STANDING_ORDER_TRANS_ID = null;
        this.UTILITY_TIME_ID = null;
        this.ORDER_VALUE = null;
        this.DOSAGE_TRANSRATE = null;
        this.DRUG_MAINFORM_ID = null;
        this.IS_RETURNDRUG = null;
        this.IS_IV_HOME = null;
        this.IS_NURSE_ORDER = null;
        this.IS_OPR_INFORM = null;
        this.OPR_VERIFY_ID = null;
        this.IS_CHE_DRUG = null;
        this.IS_ORDERENTRY = null;
        this.IS_ATF = null;
        this.ANTIBIOTIC_LEVEL_ID = null;
        this.OPD_UTILITY_UNIT_ID = null;
        this.OPD_UTILITY_TRANSRATE = null;
        this.TQTY_TRANSRATE = null;
        this.IS_HIGH_ALERTDRUG = null;
        this.IPD_CARRY_OVER = null;
        this.OPD_CARRY_OVER = null;
        this.IS_OUT_HOSPITAL = null;
        this.GENDER_ID = null;
        this.TUMOUR_LEVEL = null;
        this.OTHER_SPECIAL_DRUGS_TYPE = null;
        this.TEMP = null;
        this.LUCIFUGAL_DRAGS = null;
        this.EXPENSIVE_DRAGS = null;
        this.PO_TYPE = null;
        this.DRUG_REMARKS = null;
        this.IS_ORDERENTRY_TYPE = null;
        this.ORDER_USER = null;
        this.ORDER_TIME = null;
        this.PATIENTSN = null;
        this.INPATIENT_NO = null;
        this.ERROR_MSG = null;
        this.listOrder = function (hospitalOrder, successCall, errorCall,action) {
            var param = {
                /**不同数据*/
                node: hospitalOrder.getNode(),
                /**动作*/
                action: "preload"||action
            };
            this.sendMsg("hospitalOrderService.listOrder", hospitalOrder, param, "", function (result) {
                if (result.resultMsg.success) {
                    
                    var hospitalOrders = result.data;
                    var newHospitalOrder = {};
                    var hospital = nursing.getHospitalOrder();
                    for (var i = 0; i < hospitalOrders.length; i++) {
                        var element = hospitalOrders[i];
                        var order_code = element.title.pk;
                        newHospitalOrder[order_code] = element.hospitalOrder;
                    }
                    window.localStorage["HospitalOrderDesc"] = JSON.stringify(newHospitalOrder);
                    hospital.setCache(hospitalOrders, "ORDER_CODE");
                    successCall(hospital.getData(true));
                } else {
                    errorCall(result.resultMsg);
                }
            }, errorCall);
        };
        this.postOrderData = function (hospitalOrder, successCall, errorCall) {
            var param = {
                node: eNursing.UUID(),
                action: "preload"
            };
            this.sendMsg("hospitalOrderService.postOrderData", hospitalOrder, param, "", function (result) {
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
    eNursing.addModule(HospitalOrder);
}(eNursing);
