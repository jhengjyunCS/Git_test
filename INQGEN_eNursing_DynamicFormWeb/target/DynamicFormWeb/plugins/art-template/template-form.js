/**
 * 验证 处理
 * @type {{addItem: checkHandler.addItem, checkSelf: checkHandler.checkSelf, deleteItem: checkHandler.deleteItem, checkItems: (function(): boolean), items: {}}}
 */
var checkHandler = {
    items: {},
    addItem: function (k, v) {
        this.items[k] = v;
    },
    deleteItem: function (k) {
        delete this.items[k];
    },
    checkSelf: function (target) {
        var $target = $(target);
        var flag;
        var name = $target.attr("name");
        if ($target.data('required') + '' === 'true') {
            var val = $target.val();
            var type = $target.attr("type");
            var hasV;
            if (type === 'radio' || type === 'checkbox') {
                hasV = $("input[name='" + name + "']:checked").size() > 0;
            } else {
                hasV = val.length > 0;
            }
            flag = !hasV;
        } else {
            flag = false;
        }
        if (flag) {
            this.addItem(name, {type: type, promptTips: $target.data("promptTips")});
        } else {
            this.deleteItem(name);
        }
    },
    checkItems: function () {
        var items = this.items,
            flag = true;
        for (var k in items) {
            if (items.hasOwnProperty(k)) {
                alert(items[k].promptTips);
                var ind = '';
                if (items[k].type === "radio" || items[k].type === "checkbox") {
                    ind = '0';
                }
                var regExp = /other(\d+)/g;
                if (regExp.test(k)) {
                    k = k.replace(regExp, '_' + RegExp.$1 + '_otherText')
                }
                var item = $("#" + k + ind);
                item.focus();
                flag = false;
                break;
            }
        }
        return flag;
    }
};

/**
 *
 * @param target
 */
function checkExists(target) {
    var $target = $(target);
    var key = $target.attr("name");
    var value = $target.val();
    if (value && value !== $target.attr("prevV") && value !== $target.attr("origV")) {
        $target.attr("prevV", value);
        var checkParams = {itemKey: key, itemValue: value, formType: formTemplate.formType}
        var param = {
            /**不同数据*/
            node: checkParams.formType + "." + checkParams.itemKey + "." + checkParams.itemValue + ".checkExists",
            /**动作*/
            action: "select"
        };
        eNursing.sendMsg("gFormService.checkExistsGFormItem", checkParams, param, "", function (result) {
            if (result.resultMsg.success) {
                //--设置用户
                if (result.resultMsg.message === "true") {
                    alert("该项已存在，请重新填写！");
                    $target.val("");
                    $target.focus();
                }
            } else {
                errorCall(result.resultMsg);
            }

        }, errorCall);
    }
}

function errorCall(error) {
    if (console) console.error(error)
}

/**
 * 单选框支持取消选择
 * @param tar 当前点击的控件
 */
function toggleCheck(tar) {
    var checkStr = "check";
    if ($(tar).attr(checkStr) === "true") {
        tar.checked = false;
        $(tar).attr(checkStr, "false");
    } else {
        $("input[name='" + tar.name + "'][" + checkStr + "='true']").attr(checkStr, "false");
        $(tar).attr(checkStr, "true");
    }
}

function hideOther($tar) {
    $tar.hide();
    $tar.attr('data-required', false);
    checkHandler.checkSelf($tar);
    $tar.attr('data-disabled', true);
    $tar.attr('disabled', true);
}

/**
 * 设置上次选中的项
 * @param tar
 */
function setPrevCheck(tar) {
    var checkStr = "prevCheck";
    if (tar.checked) {
        var $prev = $("input[name='" + tar.name + "'][" + checkStr + "='true']");
        if ($prev.length) {
            var hasOther = $prev.attr("data-hasother");
            if (hasOther && !$prev[0].checked) {
                hideOther($("#" + hasOther));
            }
            $prev.attr(checkStr, "false");
        }
        $(tar).attr(checkStr, "true");
    } else {
        $(tar).attr(checkStr, "false");
    }
}

var formTemplate;
var gforms;

function resetForm($tar) {
    $tar.find(".formItem").each(function () {
        var $this = $(this);
        if (/textarea|select/i.test(this.tagName)) $this.val("");
        else if (/input/i.test(this.tagName)) {
            if (/radio|checkbox/i.test($this.attr("type"))) {
                $this.prop("checked", false);
                $this.removeAttr("check");
                $this.removeAttr("prevCheck");
            } else {
                $this.removeAttr("prevV");
                $this.removeAttr("origV");
                $this.val("");
            }
        }
    })
}

var gformCurr;

function addGform() {
    var $form = $("#div_form_" + formTemplate.formType);
    resetForm($form);
    $("#form-close").attr("href", "#");
    location.href = '#form-details';
}

function updateGform(tar, formId, i) {
    var gform = gforms[i].gForm;
    if (formId === gform.formId) {
        gformCurr = gform;
        var $form = $("#div_form_" + formTemplate.formType);
        resetForm($form);
        for (var j = 0; j < gform.gformItems.length; j++) {
            var gformItem = gform.gformItems[j];
            var itemKey = gformItem.itemKey;
            var itemValue = gformItem.itemValue;
            var type = formTemplate.itemMap[itemKey].controlType;
            var $item = $("[name='" + itemKey + "']", $form);
            if (/text|textarea/.test(type)) {
                $item.attr("origV", itemValue).val(itemValue).blur();
            } else if (/radio|checkbox/.test(type)) {
                $("[name='" + itemKey + "'][value='" + itemValue + "']", $form).click().blur();
            } else if (/select/.test(type)) {
                $item.val(itemValue).change().blur();
            }
        }
        $("#form-close").attr("href", "#tools_" + i + "_" + formTemplate.formType);
        location.href = '#form-details';
    }
}

function deleteGform(tar, formId, i) {
    if (formId == gforms[i].gForm.formId) {
        if (confirm("确定要删除吗?")) {
            var gFormParam = {formType: formTemplate.formType, formId: formId, searchParamGF: {sourceId: sourceId}};
            var param = {
                /**不同数据*/
                node: "GForm." + gFormParam.formType + "." + gFormParam.formId,
                /**动作*/
                action: "delete"
            };

            eNursing.sendMsg("gFormService.deleteGForm", [{"gForm": gFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    delete gforms[i];
                    $(tar).closest(".tr").remove();
                } else {
                    errorCall(result.resultMsg);
                }
            }, errorCall);
        }
    }
}

function addOrUpdGform() {
    this.addOrUpdateGForm = function (gFormParam, successCall, errorCall) {
        gFormParam.gformItemMap = {};
        var param = {
            /**不同数据*/
            node: "GForm." + gFormParam.formType + "." + gFormParam.formId,
            /**动作*/
            action: "add"
        };

        eNursing.sendMsg("gFormService.addOrUpdateGForm", [{"gForm": gFormParam}], param, "", function (result) {
            if (result.resultMsg.success) {
                var gForms = result.data;
                if (gForms) {
                    for (i = 0, len = gForms.length; i < len; i++) {
                        var gForm = gForms[i].gForm;
                        var items = gForm.gformItems;
                        var formItems = {};
                        if (items) {
                            for (i2 = 0, len2 = items.length; i2 < len2; i2++) {
                                formItems[items[i2].itemKey] = {
                                    "itemValue": items[i2].itemValue,
                                    "otherValue": items[i2].otherValue
                                };
                            }
                        }
                        gForm.gformItemMap = formItems;
                    }
                    if (window.console) console.log(gForms);
                }
                successCall(gForms);
            } else {
                if (window.console) console.log(result.resultMsg);
            }

        }, errorCall);
    };
    var $form = $("#div_form_" + formTemplate.formType);
    var formItems = [], formItemMap = {};
    $form.find(".formItem").each(function () {
        var $this = $(this);

        var value;
        var temp = formItemMap[this.name];

        if (/textarea|select/i.test(this.tagName)) value = $this.val();
        else if (/input/i.test(this.tagName)) {
            if (/radio|checkbox/i.test($this.attr("type"))) {
                if (this.checked) {
                    value = $this.val();
                    if (temp) {
                        value = temp.itemValue + "," + value;
                    }
                }
            } else {
                value = $this.val()
            }
        }
        if (value) {
            if (!temp) {
                var formItem = {itemKey: this.name, itemValue: value}
                formItems[formItems.length] = formItem;
                formItemMap[formItem.itemKey] = formItem;
            }
        }
    });
    if (formItems) {
        var userId = "mbnis", userName = "mbnis";
        gformCurr = gformCurr || {
            formType: formTemplate.formType,
            formVersionId: formTemplate.formVersionId,
            status: "Y",
            evaluationTime: new Date(),
            createTime: new Date()
        };
        gformCurr.versionNo = formTemplate.version;
        gformCurr.searchParamGF = {sourceId: sourceId, userId: userId, userName: userName};
        gformCurr.gformItems = formItems;
        if (gformCurr.formId == undefined || gformCurr.formId == "") {
            gformCurr.creatorId = userId;
            gformCurr.creatorName = userName;
        } else {
            gformCurr.modifyUserId = userId;
            gformCurr.modifyUserName = userName;
        }
        this.addOrUpdateGForm(gformCurr, function () {
            location.href = "#";
            location.reload();
        }, errorCall)
    }
}

function closeGform() {
    $("#form-close>span").click();
}

function arrayToMap(items) {
    var itemMap = {};
    for (var i = 0; i < items.length; i++) {
        itemMap[items[i].name] = items[i];
    }
    return itemMap;
}