
//顯示清單
function showResultList(){
    //取得resultMap
    getResultMap(function(resultMap){
        console.log("==========getResultMap")
        console.log(resultMap)
        //開始渲染
        let cxt = template.compile($("#showResult_Template").html())
        let html = cxt(resultMap.list)
        $(".showResult").html(html)

        let subRowDataCxt = template.compile($("#subRowData_Template").html())
        $(".subRowData").each(function(){
            let id = $(this).data('id')
            html = subRowDataCxt(resultMap.idMap[id])
            $(this).replaceWith(html)
        })
    }, function(){
        alert("取得清單資料發生錯誤")
    })
}

//顯示更多
function showMore(that){
    $(that).hide()
    let formType = $(that).parents('.formTypeGroup:first').data('formType')
    let $formGroup = $(that).parents('.formGroup:first')
    let formGroup = $formGroup.data('formGroup')
    let frameModel = $formGroup.data('frameModel')

    //取得資料
    if (formGroup=='formVersion') {
        getFormVersionListByFormType(formType, function(result){
            console.log(result)
            showRowData(result.formVersion)
        }, function(){
            alert("'顯示更多'發生錯誤")
            $(that).show()
        })
    }else if (formGroup=='formFrame') {
        getDynamicFormFrameListByformTypeFrameModel(formType, frameModel, function(result){
            console.log(result)
            showRowData(result.dynamicFormFrame)
        }, function(){
            alert("'顯示更多'發生錯誤")
            $(that).show()
        })
    }

    //顯示資料
    function showRowData(rowDataList){
        //移除重複資料
        $formGroup.find('.row').each(function(){
            if (rowDataList.find(row => row.id==$(this).data('id'))) {
                rowDataList.splice(rowDataList.findIndex(row => row.id==$(this).data('id')), 1)
            }
        })

        //顯示資料
        let subRowDataCxt = template.compile($("#subRowData_Template").html())
        rowDataList.forEach(function(data){
            data.ts = data.ts ? new Date(data.ts).format("yyyy/MM/dd HH:mm") : ""
            data.enableTime = data.enableTime ? new Date(data.enableTime).format("yyyy/MM/dd HH:mm") : ""
            data.disableTime = data.disableTime ? new Date(data.disableTime).format("yyyy/MM/dd HH:mm") : ""
            let html = subRowDataCxt(data)
            $formGroup.append(html)
        })

        $(that).remove()
    }
}

//執行篩選條件
function doFilter(){
    //把formTypeGroup隱藏、子層hide放開
    $('.formTypeGroup').addClass('hide')
    $('.formTypeGroup .hide').removeClass('hide')

    //search文字
    let searchTxt = $('#search').val()
    //未啟用是否勾選
    let isOnlyStatusN = $('#chkOnlyStatusN')[0].checked

    //都沒填，全部顯示
    if (!searchTxt && !isOnlyStatusN) {
        $('.hide').removeClass('hide')
        return
    }

    //篩選未啟用
    if (isOnlyStatusN) {
        //顯示原本未啟用且後勾選啟用的、隱藏已啟用的
        $('.row:not(.hasChange) .chkStatus:checked').each(function(){
            $(this).parents('.row:first').addClass('hide')
        })

        //如果整個formGroup的row都被隱藏，則隱藏整個formGroup
        $('.formGroup').each(function(){
            if ($(this).find('.row').length === $(this).find('.row.hide').length) {
                $(this).addClass('hide')
            }
        })
    }

    //篩選search文字
    if (!searchTxt) {
        $('.formTypeGroup.hide').removeClass('hide')
    } else {
        searchTxt = searchTxt.toLowerCase()
        //formType
        $('.formTypeName').each(function(){
            if (this.textContent.toLowerCase().indexOf(searchTxt)>-1) {
                $(this).parent().removeClass('hide')
            }
        })
        //title
        $('.formTypeTitle').each(function(){
            if (this.textContent.toLowerCase().indexOf(searchTxt)>-1) {
                $(this).parent().removeClass('hide')
            }
        })
    }
}

//全選
function doAllChecked(that){
    let isChecked = that.checked
    if (isChecked) {
        //全選 - 所有未隱藏的要全選
        $('.formTypeGroup:not(.hide)').find('.row:not(.hide)').find('.chkStatus:not(:checked)').click()
    } else {
        //取消全選 - 所有未隱藏的要取消
        $('.formTypeGroup:not(.hide)').find('.row:not(.hide)').find('.chkStatus:checked').click()
    }
}

//確認修改
function doCheckUpdate(that){
    let isChecked = that.checked
    if (!isChecked) {
        $('#search').removeAttr('disabled')
        $('#chkOnlyStatusN').removeAttr('disabled')
        doFilter()
        return
    }

    //禁止點選篩選
    $('#search').attr('disabled', 'disabled')
    $('#chkOnlyStatusN').attr('disabled', 'disabled')
    chkAllChecked
    //把formTypeGroup、formGroup、row隱藏
    $('.formTypeGroup, .formGroup, .row').addClass('hide')

    //找到所有被異動過的顯示
    $('.hasChange').each(function(){
        $(this).removeClass('hide')
        $(this).parents('.formGroup:first').removeClass('hide')
        $(this).parents('.formTypeGroup:first').removeClass('hide')
    })
}

//儲存
function save(){
    let isChecked = $('#chkCheckUpdate')[0].checked
    if (!isChecked) {
        alert('請先勾選"確認修改"後再保存')
        return
    }

    let $hasChange = $('.hasChange')
    if ($hasChange.length===0) {
        alert('請至少勾選一項再保存')
    }

    //組合待上傳的資料
    let formVersionArr = [], formFrameArr = []
    $hasChange.each(function(){
        let formGroup = $(this).parents('.formGroup').data('formGroup')
        if (formGroup === 'formVersion') {
            let formVersion = nursing.createFormFrame()
            formVersion.id = $(this).data('id')
            formVersion.status = $(this).find('.chkStatus')[0].checked ? 'Y' : 'N'
            formVersionArr.push(formVersion)
        } else if (formGroup === 'formFrame') {
            let formFrame = nursing.createFormFrame()
            formFrame.id = $(this).data('id')
            formFrame.status = $(this).find('.chkStatus')[0].checked ? 'Y' : 'N'
            formFrameArr.push(formFrame)
        }
    })

    //上傳
    let saveCount = 0
    if (formVersionArr.length>0) {
        ++saveCount
        setFormVersionStatus(formVersionArr, function(){
            completeCall()
        }, function(){
            alert('保存formVersion發生錯誤')
        })
    }
    if (formFrameArr.length>0) {
        ++saveCount
        setDynamicFormFrameStatus(formFrameArr, function(){
            completeCall()
        }, function(){
            alert('保存formFrame發生錯誤')
        })
    }
    function completeCall(){
        if (--saveCount>0) return
        $('#chkCheckUpdate')[0].checked = false
        showResultList()
    }
}

/**
 * 取得resultMap (json+list)
 * @param successCall
 * @return resultMap
 * {
 *     json: {
 *         formType: {
 *             formVersion: [{}],
 *             formFrame: {
 *                 frameModel: [{}]
 *             }
 *         }
 *     },
 *     list: [
 *         {
 *             formType: "",
 *             title: "",
 *             rows: [
 *                 {
 *                     formGroup: "formVersion | formFrame",
 *                     frameModel: "formFrame才有",
 *                     data: {}
 *                 }
 *             ]
 *         }
 *     ],
 *     idMap: {
 *         id: {}
 *     }
 * }
 */
function getResultMap(successCall, errorCall){
    let resultMap = {json:{}, list:[], idMap:{}}, formTypeRs, formVersionRs, formFrameRs
    let successCount = 0, errorCount = 0
    //取得所有formTrype+title
    ++successCount
    getAllFormTypeTitle(function(result){
        formTypeRs = result
        completeCall();
    }, function(){
        ++errorCount
        completeCall();
    })
    //取得所有formVersion最大號 (啟用中+未啟用)
    ++successCount
    getFormVersionMaxVersionList(function(result){
        formVersionRs = result
        completeCall();
    }, function(){
        ++errorCount
        completeCall();
    })
    //取得所有formFrame最大號 (啟用中+未啟用)
    ++successCount
    getDynamicFormFrameMaxVersionList(function(result){
        formFrameRs = result
        completeCall();
    }, function(){
        ++errorCount
        completeCall();
    })
    function completeCall(){
        if (errorCount===1) errorCall()
        if (--successCount>0) return
        //整理formType
        formTypeRs.formVersion.forEach(function(formVersion){
            resultMap.json[formVersion.formType] = {title: formVersion.title, formVersion:[], formFrame:{}}
        })
        //整理formVersion
        formVersionRs.formVersion.forEach(function(formVersion){
            formVersion.ts = formVersion.ts ? new Date(formVersion.ts).format("yyyy/MM/dd HH:mm") : ""
            formVersion.enableTime = formVersion.enableTime ? new Date(formVersion.enableTime).format("yyyy/MM/dd HH:mm") : ""
            formVersion.disableTime = formVersion.disableTime ? new Date(formVersion.disableTime).format("yyyy/MM/dd HH:mm") : ""
            resultMap.json[formVersion.formType].formVersion.push(formVersion)
            resultMap.idMap[formVersion.id] = formVersion
        })
        //整理formFrame
        formFrameRs.dynamicFormFrame.forEach(function(formFrame){
            //處理formVersion沒有，但formFrame有的情形
            if (!resultMap.json[formFrame.formType]) {
                resultMap.json[formFrame.formType] = {title: 'hasNoTitle', formVersion:[], formFrame:{}}
            }

            formFrame.ts = formFrame.ts ? new Date(formFrame.ts).format("yyyy/MM/dd HH:mm") : ""
            formFrame.enableTime = formFrame.enableTime ? new Date(formFrame.enableTime).format("yyyy/MM/dd HH:mm") : ""
            formFrame.disableTime = formFrame.disableTime ? new Date(formFrame.disableTime).format("yyyy/MM/dd HH:mm") : ""
            let formFrameNode = resultMap.json[formFrame.formType].formFrame
            formFrameNode[formFrame.frameModel] = formFrameNode[formFrame.frameModel] ? formFrameNode[formFrame.frameModel] : []
            formFrameNode[formFrame.frameModel].push(formFrame)
            resultMap.idMap[formFrame.id] = formFrame
        })

        //整理成list
        for (let formType in resultMap.json){
            let formTypeJson = {
                formType: formType,
                title: resultMap.json[formType].title,
                rows: []
            }
            let rowsJson = {
                formGroup: "formVersion",
                data: resultMap.json[formType].formVersion
            }
            formTypeJson.rows.push(rowsJson)

            for (let modelKey in resultMap.json[formType].formFrame) {
                let rowsJson = {
                    formGroup: "formFrame",
                    frameModel: modelKey,
                    data: resultMap.json[formType].formFrame[modelKey]
                }
                formTypeJson.rows.push(rowsJson)
            }
            resultMap.list.push(formTypeJson)
        }

        successCall(resultMap)
    }
}

//取得所有formTrype+title
function getAllFormTypeTitle(successCall, errorCall){
    let funcName = "getAllFormTypeTitle"
    //基础参数
    basicParam = nursing.createBasicParam()
    //動態表單
    let dynamicForm = nursing.createDynamicForm()
    basicParam.getAllFormTypeTitle(dynamicForm, function(result){
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(result, undefined, 4))
            return
        }
        successCall(result);
    }, function(e) {
        console.error(e)
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(e, undefined, 4))
            return
        }
        errorCall(e);
    })
}

function clickStatus(that) {
    $(that).parents('.row:first').toggleClass('hasChange')
}

//取得所有formVersion最大號 (啟用中+未啟用)
function getFormVersionMaxVersionList(successCall, errorCall){
    let funcName = "getFormVersionMaxVersionList"
    //基础参数
    let basicParam = nursing.createBasicParam()
    //動態表單
    let dynamicForm = nursing.createDynamicForm()
    basicParam.getFormVersionMaxVersionList(dynamicForm, function(result){
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(result, undefined, 4))
            return
        }
        successCall(result);
    }, function(e) {
        console.error(e)
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(e, undefined, 4))
            return
        }
        errorCall(e);
    })
}

//取得所有formFrame最大號 (啟用中+未啟用)
function getDynamicFormFrameMaxVersionList(successCall, errorCall){
    let funcName = "getDynamicFormFrameMaxVersionList"
    //基础参数
    let basicParam = nursing.createBasicParam()
    //動態表單
    let dynamicForm = nursing.createDynamicForm()
    basicParam.getDynamicFormFrameMaxVersionList(dynamicForm, function(result){
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(result, undefined, 4))
            return
        }
        successCall(result);
    }, function(e) {
        console.error(e)
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(e, undefined, 4))
            return
        }
        errorCall(e);
    })
}

//啟用/禁用 formVersion
function setFormVersionStatus(formVersionArr, successCall, errorCall){
    let funcName = "setFormVersionStatus"
    //基础参数
    let basicParam = nursing.createBasicParam()
    //動態表單
    formVersionArr = formVersionArr ? formVersionArr : []
    if (isTestPage) {
        let formVersion
        formVersion = nursing.createFormFrame()
        formVersion.id = 'a0c376f942cb4035969c0cf6a1ec6dc1'
        formVersion.status = 'N'
        formVersionArr.push(formVersion)
        formVersion = nursing.createFormVersion()
        formVersion.id = 'a0c376f942cb4035969c0cf6a1ec6dc2'
        formVersion.status = 'Y'
        formVersionArr.push(formVersion)
    }
    console.log(formVersionArr)

    basicParam.setFormVersionStatus(formVersionArr, function(result){
        if (isTestPage) {
            $(`#textarea_${funcName}`).val("success")
            return
        }
        successCall(result);
    }, function(e) {
        console.error(e)
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(e, undefined, 4))
            return
        }
        errorCall(e);
    })
}

//啟用/禁用 formFrame
function setDynamicFormFrameStatus(formFrameArr, successCall, errorCall){
    let funcName = "setDynamicFormFrameStatus"
    //基础参数
    let basicParam = nursing.createBasicParam()
    //動態表單
    formFrameArr = formFrameArr ? formFrameArr : []
    if (isTestPage) {
        let formFrame
        formFrame = nursing.createFormFrame()
        formFrame.id = '3459076d-5a43-4e6f-a770-1eeefa9bf56a'
        formFrame.status = 'N'
        formFrameArr.push(formFrame)
        formFrame = nursing.createFormVersion()
        formFrame.id = 'c06d93ff-62e1-4b5d-9c8d-d49c53ca1ac3'
        formFrame.status = 'Y'
        formFrameArr.push(formFrame)
    }
    console.log(formFrameArr)

    basicParam.setDynamicFormFrameStatus(formFrameArr, function(result){
        if (isTestPage) {
            $(`#textarea_${funcName}`).val("success")
            return
        }
        successCall(result);
    }, function(e) {
        console.error(e)
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(e, undefined, 4))
            return
        }
        errorCall(e);
    })
}

//根据 FormType,获取該模版的清單
function getFormVersionListByFormType(formType, successCall, errorCall){
    let funcName = "getFormVersionListByFormType"
    //基础参数
    let basicParam = nursing.createBasicParam()
    //動態表單
    let dynamicForm = nursing.createDynamicForm()
    if (isTestPage) {
        dynamicForm.searchParamDF.formType = "NCQPDCA"
    } else {
        dynamicForm.searchParamDF.formType = formType
    }

    basicParam.getFormVersionListByFormType(dynamicForm, function(result){
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(result, undefined, 4))
            return
        }
        successCall(result)
    }, function(e) {
        console.error(e)
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(e, undefined, 4))
            return
        }
        errorCall(e)
    })
}

//依據formType(表單名)、frameModel(對應頁面) 取得其對應的表單外框frame的清單
function getDynamicFormFrameListByformTypeFrameModel(formType, frameModel, successCall, errorCall){
    let funcName = "getDynamicFormFrameListByformTypeFrameModel"
    //基础参数
    let basicParam = nursing.createBasicParam()
    //動態表單
    let dynamicForm = nursing.createDynamicForm()
    if (isTestPage) {
        dynamicForm.searchParamDF.formType = "NCQPDCA"
        dynamicForm.searchParamDF.frameModel = "gFormWebADD"
    } else {
        dynamicForm.searchParamDF.formType = formType
        dynamicForm.searchParamDF.frameModel = frameModel
    }

    basicParam.getDynamicFormFrameListByformTypeFrameModel(dynamicForm, function(result){
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(result, undefined, 4))
            return
        }
        successCall(result)
    }, function(e) {
        console.error(e)
        if (isTestPage) {
            $(`#textarea_${funcName}`).val(JSON.stringify(e, undefined, 4))
            return
        }
        errorCall(e)
    })
}



//ajax直接調用nis的dynaicform API

//取得result的json
// function getResult(xmlString){
//     let json = {}
//     try{
//         let objson = xml2json.fromStr(xmlString)
//         console.log("objson=", JSON.parse(JSON.stringify(objson)))
//         let outJson = objson["soap:Envelope"]["soap:Body"]
//         outJson = outJson[Object.keys(outJson)[0]]["ns1:out"]
//         console.log("outJson=", JSON.parse(JSON.stringify(outJson)))
//
//         json[Object.keys(outJson)[0].replace("ns2:", "")] = outJson[Object.keys(outJson)[0]]
//         console.log("json=", json)
//
//         deepJson("", json, null)
//         function deepJson(dKey, dJson, paranNode){
//             delete dJson["@attributes"]
//             if (dJson["#text"]!==undefined){
//                 paranNode[dKey] = dJson["#text"]
//                 switch (dKey) {
//                     case "ts":
//                         //"ts": "2021/06/22 09:22:06.226"
//                         paranNode[dKey] = new Date(paranNode[dKey]).format("yyyy/MM/dd HH:mm:ss.S")
//                         break
//                     case "version":
//                         //"ts": "2021/06/22 09:22:06.226"
//                         paranNode[dKey] = parseInt(paranNode[dKey], 10)
//                         break
//                 }
//                 return
//             }
//             if (Object.keys(dJson).length===0){
//                 delete paranNode[dKey]
//                 return
//             }
//             for(let key in dJson){
//                 deepJson(key, dJson[key], dJson)
//             }
//         }
//         return json
//     }catch (e) {
//         return e
//     }
//     return json
// }
// function getFormVersionAllList(){
//     let funcName = "getFormVersionAllList"
//     $.ajax({
//         type: "POST",
//         url: const_gformServiceUrl + "",
//         dataType: "text",
//         data: `
//             <soapenv:Envelope
//                 xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
//                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//                 <soapenv:Body>
//                     <${funcName}>
//                         <isTestServer>false</isTestServer>
//                     </${funcName}>
//                 </soapenv:Body>
//             </soapenv:Envelope>
//         `, success: function(result) {
//             if (isTestPage) {
//                 var json = getResult(result)
//                 console.log(json)
//                 $(`#textarea_${funcName}`).val(JSON.stringify(json, undefined, 4))
//                 return
//             }
//         }, error: function(e){
//             console.error(e)
//             if (isTestPage) {
//                 $(`#textarea_${funcName}`).val(JSON.stringify(e, undefined, 4))
//                 return
//             }
//         }
//     })
// }
//取得所有formVersion
// function getFormVersionListMaxTsByFormType(){
//     let funcName = "getFormVersionListMaxTsByFormType"
//     $.ajax({
//         type: "POST",
//         url: const_gformServiceUrl + "",
//         dataType: "text",
//         data: `
//             <soapenv:Envelope
//                 xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
//                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//                 <soapenv:Body>
//                     <getFormVersionListMaxTsByFormType>
//                         <formTypeArr><item>NCQIauditreply</item></formTypeArr>
//                     </getFormVersionListMaxTsByFormType>
//                 </soapenv:Body>
//             </soapenv:Envelope>
//         `,
//         success: function(result) {
//             if (isTestPage) {
//                 var json = getResult(result)
//                 console.log(json)
//                 $(`#textarea_${funcName}`).val(JSON.stringify(json, undefined, 4))
//                 return
//             }
//         }, error: function(e){
//             console.error(e)
//             if (isTestPage) {
//                 $(`#textarea_${funcName}`).val(JSON.stringify(e, undefined, 4))
//                 return
//             }
//         }
//     })
// }