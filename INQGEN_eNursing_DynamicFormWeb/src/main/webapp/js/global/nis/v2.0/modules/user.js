!function () {

    /** @namespace result.resultMsg */
    function User() {
        this.nodeId = eNursing.getFnName(User);
        this.loginId = null;
        this.fullName = null;
        this.password = null;
        this.stationIds = null;
        this.login = function (userParam, successCall, errorCall) {
            userParam.nodeValue = userParam.loginId;
            var param = {
                /**不同数据*/
                node: userParam.getNode()+userParam.password,
                /**动作*/
                action: $N.preload
            };
            this.sendMsg("userService.login", userParam, param, "", function (result) {
                if (result.resultMsg.success) {
                    //--设置用户
                    var userDb = result.data;
                    var user = nursing.getUser();
                    user.setCache(userDb, "loginId", 0);
                    if (user.getCurrent().password === userParam.password) {
                        //--设置院区
                        var zone = nursing.getZone();
                        zone.setCache([{nodeId: "Zone", name: "HIS", zone: "HIS"}], "zone", 0);
                        //--调用成功函数
                        successCall();
                    }else{
                        //--密码错误
                        errorCall({message:"密码错误！"});
                    }
                } else {
                    errorCall(result.resultMsg);
                }

            }, errorCall);
        };
    }
    eNursing.addModule(User);

    function Zone() {
        this.nodeId = eNursing.getFnName(Zone);
        this.parentConstructor=eNursing.getModules("User");
        this.zone = null;
        this.name = null;
    }
    eNursing.addModule(Zone);
}(eNursing);