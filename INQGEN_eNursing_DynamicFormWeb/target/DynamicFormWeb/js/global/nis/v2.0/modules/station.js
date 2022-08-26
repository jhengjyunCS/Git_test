!function () {
    function Station() {
        this.nodeId = eNursing.getFnName(Station);
        this.parentConstructor=eNursing.getModules("Zone");
        this.stationId = null;
        this.stationName = null;
        this.listStation = function (zone, successCall, errorCall, action) {
            var param = {
                /**不同数据*/
                node: zone.getNode() + "." + this.nodeId,
                /**动作*/
                action: action || "select"
            };
            this.sendMsg("stationService.list", zone, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (eNursing.preload === action) {
                        successCall();
                    } else {
                        var stationsDb = result.data;
                        var station = nursing.getStation();
                        station.setCache(stationsDb, "stationId", 0);
                        successCall(station.getData(true));
                    }
                } else {
                    errorCall(result.resultMsg);
                }
            }, errorCall);
        }
    }
    eNursing.addModule(Station);
}(eNursing);
