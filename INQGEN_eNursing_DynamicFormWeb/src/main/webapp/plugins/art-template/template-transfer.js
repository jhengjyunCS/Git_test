!function() {
    var currentUrl = document.currentScript ? document.currentScript.src : function(){
        var js = document.scripts
            ,last = js.length - 1
            ,src;
        for(var i = last; i > 0; i--){
            if(js[i].readyState === 'interactive'){
                src = js[i].src;
                break;
            }
        }
        return src || js[last].src;
    }();
    template.currentUrl = currentUrl.replace(/[\w-]+\.js(\?[^?]+)?$/g, '');
}();
template.defaults.imports.jsonFormat =  function (json,pre) {
    var str = "";
    if(json){
        try{
            str = JSON.stringify(JSON.parse(json), null, 4);
            if(pre)str = "<pre>" + str + "</pre>";
        }catch (e) {
            str = json;
        }
    }
    return str;
};
template.defaults.imports.trimAll =  function (str) {
    return str?str.replace(/(^[\u3000\s]+)|([\u3000\s]+$)/,""):str;
};
/**
 * 需要引入jquery ajax
 * @param temp 控件类型
 * @param data 模板数据集
 * @returns {*}
 */
template.defaults.imports.ajaxInclude = function (temp,data) {
    template.ajaxRender = template.ajaxRender || {};
    if (!template.ajaxRender[temp]) {
        $.ajax({
            url: template.currentUrl+temp+".html",
            cache: true,
            ifModified: true,
            async: false,
            type: "post",
            success: function (context) {
                template.ajaxRender[temp]=template.compile(context);
            }
        });

    }
    var render = template.ajaxRender[temp];
    if (render) {
        template.itemTemplateMap = template.itemTemplateMap || {};
        template.itemTemplateMap[data.name||data.formType]=data;
        return render(data);
    }else{
        return "";
    }
};
