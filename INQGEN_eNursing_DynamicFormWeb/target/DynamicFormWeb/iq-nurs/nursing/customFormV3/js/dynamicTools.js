
//(顯示或隱藏div) 切換 選擇模板/編輯器
function showModel(that){
    var buttonSelected=$(that).hasClass("buttonSelected");
    var modelShow=$(that).attr("id")=="selectModel";
    if ((modelShow && buttonSelected)||(!modelShow && !buttonSelected)){ //即將要顯示editor
        $("#selectModel").removeClass("buttonSelected").addClass("buttonNotSelect");
        $("#selectEditor").removeClass("buttonNotSelect").addClass("buttonSelected");
        $("#modelGroup").hide();
        $("#editorGroup").show();
        showDiv();
    }else{ //即將要隱藏editor
        $("#selectEditor").removeClass("buttonSelected").addClass("buttonNotSelect");
        $("#selectModel").removeClass("buttonNotSelect").addClass("buttonSelected");
        $("#modelGroup").show();
        $("#editorGroup").hide();
        showDiv();
        return;
    }
}

//(顯示或隱藏div) 選擇模板 -> 4個頁籤 (formType/formVersion/formFrame/frameInit)
function showModel2(that){
    var buttonShow=$(that).hasClass("buttonShow");
    if (buttonShow){ //即將要顯示Frame
        $(that).removeClass("buttonShow").addClass("buttonHidden");
    }else{ //即將要隱藏Frame
        $(that).removeClass("buttonHidden").addClass("buttonShow");
    }
    showDiv();
}

//(顯示或隱藏div) 編輯器 -> 3個頁籤 (formVersion/frame/frameInit)
function showEditor(that){
    var buttonShow=$(that).hasClass("buttonShow");
    if (buttonShow){ //即將要顯示Frame
        $(that).removeClass("buttonShow").addClass("buttonHidden");
    }else{ //即將要隱藏Frame
        $(that).removeClass("buttonHidden").addClass("buttonShow");
    }
    showDiv();
}

//(顯示或隱藏div) 預覽
function showPreview(that){
    var buttonShow=$(that).hasClass("buttonShow");
    console.log(buttonShow);
    if (buttonShow){ //即將要顯示Frame
        $(that).removeClass("buttonShow").addClass("buttonHidden");
        showDiv();
        return;
    }else{ //即將要隱藏Frame
        $(that).removeClass("buttonHidden").addClass("buttonShow");
        showDiv();
    }
}

//(顯示或隱藏div) 全部隱藏再根據選擇去顯示
function showDiv(){
    //隱藏 選擇模板
    $("#modelDiv").removeClass("width_100").removeClass("width_50").removeClass("width_0").addClass("width_0");
    $("#editorDiv").removeClass("width_100").removeClass("width_50").removeClass("width_0").addClass("width_0");
    $("#list_formType").removeClass("height_100").removeClass("height_50").removeClass("height_33").removeClass("height_25").removeClass("height_0").addClass("height_0");
    $("#list_formVersion").removeClass("height_100").removeClass("height_50").removeClass("height_33").removeClass("height_25").removeClass("height_0").addClass("height_0");
    $("#list_formFrame").removeClass("height_100").removeClass("height_50").removeClass("height_33").removeClass("height_25").removeClass("height_0").addClass("height_0");
    $("#list_frameInit").removeClass("height_100").removeClass("height_50").removeClass("height_33").removeClass("height_25").removeClass("height_0").addClass("height_0");

    //隱藏 編輯器
    $("#formVersionDiv").removeClass("height_100").removeClass("height_50").removeClass("height_33").removeClass("height_0").addClass("height_0");
    $("#formFrameDiv").removeClass("height_100").removeClass("height_50").removeClass("height_33").removeClass("height_0").addClass("height_0");
    $("#frameInitDiv").removeClass("height_100").removeClass("height_50").removeClass("height_33").removeClass("height_0").addClass("height_0");
    $("#previewDiv").removeClass("width_100").removeClass("width_50").removeClass("width_0").addClass("width_0");

    //計算選擇模板 的 css參數
    var count_model=$(".buttonHidden[group='model2']").length;
    var height_model="height_";
    height_model+=(count_model==0)?"0":"";
    height_model+=(count_model==1)?"100":"";
    height_model+=(count_model==2)?"50":"";
    height_model+=(count_model==3)?"33":"";
    height_model+=(count_model==4)?"25":"";

    //找到編輯器 的 css參數
    var count_editor=$(".buttonHidden[group='editor']").length;
    var height_editor="height_";
    height_editor+=(count_editor==0)?"0":"";
    height_editor+=(count_editor==1)?"100":"";
    height_editor+=(count_editor==2)?"50":"";
    height_editor+=(count_editor==3)?"33":"";

    //找到選擇模板 的 選擇狀態
    var selectModel=$("#selectModel").hasClass("buttonSelected"); //選擇模板
    var selectEditor=$("#selectEditor").hasClass("buttonSelected");
    var btn_formType_m=$("#btn_formType_m").hasClass("buttonHidden");
    var btn_formVersion_m=$("#btn_formVersion_m").hasClass("buttonHidden");
    var btn_formFrame_m=$("#btn_formFrame_m").hasClass("buttonHidden");
    var btn_frameInit_m=$("#btn_frameInit_m").hasClass("buttonHidden");

    //找到編輯器 的 選擇狀態
    var btn_formVersion=$("#btn_formVersion").hasClass("buttonHidden");
    var btn_frame=$("#btn_frame").hasClass("buttonHidden");
    var btn_frameInit=$("#btn_frameInit").hasClass("buttonHidden");
    var btn_preview=$("#btn_preview").hasClass("buttonHidden");

    //選擇模板 和 預覽 被選中
    if (selectModel && btn_preview){
        if (count_model>0){
            $("#modelDiv").removeClass("width_0").addClass("width_50");
            $("#previewDiv").removeClass("width_0").addClass("width_50");
            if (btn_formType_m) $("#list_formType").removeClass("height_0").addClass(height_model);
            if (btn_formVersion_m) $("#list_formVersion").removeClass("height_0").addClass(height_model);
            if (btn_formFrame_m) $("#list_formFrame").removeClass("height_0").addClass(height_model);
            if (btn_frameInit_m) $("#list_frameInit").removeClass("height_0").addClass(height_model);
        }else{
            $("#previewDiv").removeClass("width_0").addClass("width_100");
        }
    //選擇模板 和 !預覽 被選中
    }else if (selectModel && !btn_preview){
        if (count_model>0){
            $("#modelDiv").removeClass("width_0").addClass("width_100");
            if (btn_formType_m) $("#list_formType").removeClass("height_0").addClass(height_model);
            if (btn_formVersion_m) $("#list_formVersion").removeClass("height_0").addClass(height_model);
            if (btn_formFrame_m) $("#list_formFrame").removeClass("height_0").addClass(height_model);
            if (btn_frameInit_m) $("#list_frameInit").removeClass("height_0").addClass(height_model);
        }
    //編輯器 和 預覽 被選中
    }else if (count_editor>0 && btn_preview){
        $("#editorDiv").removeClass("width_0").addClass("width_50");
        $("#previewDiv").removeClass("width_0").addClass("width_50");
        if (btn_formVersion) $("#formVersionDiv").removeClass("height_0").addClass(height_editor);
        if (btn_frame) $("#formFrameDiv").removeClass("height_0").addClass(height_editor);
        if (btn_frameInit) $("#frameInitDiv").removeClass("height_0").addClass(height_editor);
    //編輯器 和 !預覽 被選中
    }else if (count_editor>0 && !btn_preview){
        $("#editorDiv").removeClass("width_0").addClass("width_100");
        if (btn_formVersion) $("#formVersionDiv").removeClass("height_0").addClass(height_editor);
        if (btn_frame) $("#formFrameDiv").removeClass("height_0").addClass(height_editor);
        if (btn_frameInit) $("#frameInitDiv").removeClass("height_0").addClass(height_editor);
    //只有 預覽 被選中
    }else if (count_editor==0 && btn_preview){
        $("#previewDiv").removeClass("width_0").addClass("width_100");
    }

}