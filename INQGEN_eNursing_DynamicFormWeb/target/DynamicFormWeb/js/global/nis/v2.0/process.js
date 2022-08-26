//进度条显示

function showProcessModal(msg) {
    $("#processing").modal("show");
    if (msg) {
        $("#loadMsg").html(msg);
    }
    // setTimeout(hiddenProcessModal, 500);
}

//隐藏进度条
function hiddenProcessModal() {
    var $processing = $("#processing");
    $processing.on("hidden.bs.modal", function () {
        $(this).removeData("bs.modal");
    });
    $processing.modal("hide");
}

function showProcess(){
    if (arguments) {
        for (var i=0;i<arguments.length;i++){
         $(arguments[i]).show();
        }
        var processIds = arguments;
        setTimeout(function () {
            for (var i=0;i<processIds.length;i++){
                var processTmp = $(processIds[i]);
                if (i === 0) {
                    if (processTmp.css("display") !== "none") {
                        console.log("获取数据超时！");
                        processTmp.hide();
                    }else{
                        break;
                    }
                }else{
                    processTmp.hide();
                }
            }
        },6000);
    }
}
function hideProcess(){
    if (arguments) {
        for (var i=0;i<arguments.length;i++){
            $(arguments[i]).hide();
        }
    }
}