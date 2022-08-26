function addTemplate(formType) {
    window.location.href = '../complexForm/addFormTemplate?formType=' + formType;
}

function addForm(formType, parentId) {
    window.location.href = 'addFormPrompt?formType=' + formType + getParentId(parentId);
}

function doDelete(formType, formId, parentId) {
    if (window.confirm("确定要删除吗？"))
        window.location.href = 'deleteForm?formType=' + formType + '&formId=' + formId + getParentId(parentId);
}

function doUpdate(formType, formId, parentId) {
    window.location.href = 'updateFormPrompt?formType=' + formType + '&formId=' + formId + getParentId(parentId);
}

function doMain(formType, formId, parentId) {
    window.location.href = '../staffMain/updateFormPrompt?formType=' + formType + '&formId=' + formId + getParentId(parentId);
}

function doPrint(formType, formId) {
    window.location.href = 'printFormPrompt?formType=' + formType + '&formId=' + formId;
}

function printForm(formType) {
    window.location.href = 'printFormPrompt?formType=' + formType;
}

function getParentId(parentId) {
    return (parentId ? ('&parentId=' + encodeURI(parentId)) : '');
}