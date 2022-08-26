const csApiConfig = {
    'nodeAttrArr': ['key', 'value', 'type', 'desc', 'ui-value', 'ui-desc', 'is-check', 'check-type', 'is-check-message', 'is-bean', 'bean-mapping', 'source', 'function'],
    //各種模式的屬性設定
    'showTab': {
        //完整檢視
        'view_full': {
            //要顯示的屬性範圍
            'attrArr': ['key', 'value', 'type', 'desc', 'ui-value', 'ui-desc', 'is-check', 'check-type', 'is-check-message', 'is-bean', 'bean-mapping', 'source', 'function']
        },
        //檢視key-value
        'view': {
            //要顯示的屬性範圍
            'attrArr': ['key', 'value']
        },
        //完整代碼
        'code_full': {
            //目前不必設定
        },
        //代碼key-value
        'code': {
            //目前不必設定
        }
    },
    //狀態查核狀態的預設值，參考 ApiMethod.java -> getErrorResult()
    'checkTypeList': [
        {'uiValue': '000000', 'uiDesc': '查詢成功', 'checkType': 'success'},
        {'uiValue': 'E00001', 'uiDesc': '傳參問題', 'checkType': 'error'},
        {'uiValue': 'E00002', 'uiDesc': '連線問題', 'checkType': 'error'},
        {'uiValue': 'E00003', 'uiDesc': '查詢資料問題', 'checkType': 'error'},
        {'uiValue': 'E00004', 'uiDesc': '新增資料問題', 'checkType': 'error'},
        {'uiValue': 'E00005', 'uiDesc': '更新資料問題', 'checkType': 'error'},
        {'uiValue': 'E00006', 'uiDesc': '刪除資料問題', 'checkType': 'error'},
        {'uiValue': 'E00007', 'uiDesc': '權限問題', 'checkType': 'error'},
        {'uiValue': 'E00008', 'uiDesc': '資料邏輯不符規則', 'checkType': 'error'},
        {'uiValue': 'E00999', 'uiDesc': '其他錯誤', 'checkType': 'error'},
        {'uiValue': 'S00001', 'uiDesc': '(可繼續執行之狀況) 傳參問題', 'checkType': 'success'}
    ],
    'csApiDefineEle': {
        //節點- node內如有子結點，'value'將被remove並替換為新的'node'
        'node': `
                <div class="node">
<!--                    <div class="btnBar" onclick="csApi.tool.showHideNode(this)"></div>-->
                    <div class="key"></div>
                    <div class="type" data-value="" onclick="document.getElementById('#targetId#').csApi.editType.modal.show(this)"></div>
                    <div class="desc"></div>
                    <div class="value"></div>
                    <div class="source" data-method="" data-value="" onclick="document.getElementById('#targetId#').csApi.editSource.modal.show(this)"></div>
                    <div class="setting" onclick="document.getElementById('#targetId#').csApi.clickSetting.modal.show(this)"></div>
                </div>
        `,
        //主架構
        'main':`
            <div class="bg-dark text-white" id="divToolBar">
                <button class="btn btn-default text active" id="btnToolBarVF" title="完整檢視json" onclick="document.getElementById('#targetId#').csApi.switchTab('view_full'); return false;">
                    view<label>&nbsp;-full</label>
                </button>
                <button class="btn btn-default text" id="btnToolBarV" title="檢視json(key-value)" onclick="document.getElementById('#targetId#').csApi.switchTab('view'); return false;">
                    view
                </button>
                <button class="btn btn-default text" id="btnToolBarCF" title="完整代碼" onclick="document.getElementById('#targetId#').csApi.switchTab('code_full'); return false;">
                    code<label>&nbsp;-full</label>
                </button>
                <button class="btn btn-default text" id="btnToolBarC" title="代碼(key-value)" onclick="document.getElementById('#targetId#').csApi.switchTab('code'); return false;">
                    code
                </button>
                <button class="btn btn-default" title="檔案" onclick="return false;">
                    <i class="bi bi-folder text-white"></i>
                </button>
            </div>
            <div class="bg-secondary text-white" id="divNodeStr">Select a node..</div>
            <div class="scrollbar-black square" id="divJsonViewer" data-type="object">
            </div>
            <div class="" id="divJsonEditor" style="display: none;">
                <textarea id="jsonEditor" class="editor" style="display: none"></textarea>
            </div>
        `
    },
    'modal':       {
        'editUiValue': `
			<!--modal 編輯值域-->
			<div class="modal fade show" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" id="modal_editUiValue" aria-modal="true" style="display: none;">
				<div class="modal-dialog modal-xl" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" style="color:black" id="modal_editUiValue_title">編輯值域-</h5>
							<h5 class="modal-title" style="color:black" id="modal_editUiValue_subTitle"></h5>
							<button class="btn btn-success hide" type="button" style="margin-left: 15px;" id="modal_editUiValue_autoSetCheckType" onclick="document.getElementById('#targetId#').csApi.editUiValue.modal.autoSetCheckType()">自動填入</button>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
						</div>
						<div class="modal-body" id="modal_editUiValue_body">
							<div class="form-group row">
								<label class="col-form-label">值</label>
								<label class="col-form-label">中文描述</label>
								<label class="col-form-label hide" id="modal_checkType_title">查核點狀態類型</label>
							</div>
							<div class="form-group row">
								<div class="modal_uiValue" contenteditable="true"></div>
								<div class="modal_uiDesc" contenteditable="true" onkeyup="document.getElementById('#targetId#').csApi.editUiValue.modal.addOrRemoveDiv(this)"></div>
								<select class="modal_checkType hide">
								    <option value="success">成功</option>
								    <option value="error">失敗</option>
								    <option value="other">其他</option>
                                </select>
							</div>
						</div>
						<div class="modal-footer" id="modal_editUiValue_footer">
							<button class="btn btn-secondary" type="button" data-dismiss="modal" onclick="$('.modal-backdrop').hide()">取消</button>
							<button class="btn btn-success" type="button" onclick="document.getElementById('#targetId#').csApi.editUiValue.modal.addUiValue()">確定</button>
						</div>
					</div>
				</div>
			</div>
		`,
        'editType': `
            <div id="modal_editType" style="display: none">
                <div id="divDropdownMenu" class="dropdown-menu">
                    <a class="dropdown-item" href="#" onclick="document.getElementById('#targetId#').csApi.editType.modal.setTypeValue(this)">string</a>
                    <a class="dropdown-item" href="#" onclick="document.getElementById('#targetId#').csApi.editType.modal.setTypeValue(this)">int</a>
                    <a class="dropdown-item" href="#" onclick="document.getElementById('#targetId#').csApi.editType.modal.setTypeValue(this)">float</a>
                    <a class="dropdown-item" href="#" onclick="document.getElementById('#targetId#').csApi.editType.modal.setTypeValue(this)">boolean</a>
                    <a class="dropdown-item" href="#" onclick="document.getElementById('#targetId#').csApi.editType.modal.setTypeValue(this)">array</a>
                    <a class="dropdown-item" href="#" onclick="document.getElementById('#targetId#').csApi.editType.modal.setTypeValue(this)">object</a>
                </div>
            </div>
        `,
        'editSource': `
			<!--modal 設定參數來源-->
			<div class="modal fade show" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" id="modal_editSource" aria-modal="true" style="display: none;">
				<div class="modal-dialog modal-xl" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" style="color:black" id="modal_editSource_title">設定參數來源-</h5><h5 class="modal-title" style="color:black" id="modal_editSource_subTitle"></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
						</div>
						<div class="modal-body" id="modal_editSource_body">
							<div class="form-group row">
								<label class="col-form-label">方法</label>
								<label class="col-form-label">值</label>
							</div>
							<div class="form-group row">
								<select class="modal_sourceMethod custom-select custom-select-lg mb-3" onchange="document.getElementById('#targetId#').csApi.editSource.modal.changeMethod()">
								    <option value="">請選擇</option>
								    <option value="local">網頁暫存 (localStorage)</option>
								    <option value="form">表單元件 (beanName)</option>
								    <option value="eleId">元素名稱 (element ID)</option>
								    <option value="fixed">固定值</option>
								    <option value="gFormData">其他 (進階用法)</option>
								    <option value="externalData">彈出外部資料傳參(externalData)</option>
								    <option value="urlParameters">url傳參</option>
								    <option value="gFormJspUrlParameters">gForm.jsp傳參</option>
                                </select>
								<select class="modal_sourceValue_localStorage custom-select custom-select-lg mb-3" onchange="document.getElementById('#targetId#').csApi.editSource.modal.changeValue(this)">
								    <option class="default" value="">請選擇</option>
								    <option class="default" value="gForm_userId">登入者ID</option>
								    <option class="default" value="gForm_userName">登入者姓名</option>
                                </select>
								<select class="modal_sourceValue_gFormData custom-select custom-select-lg mb-3" onchange="document.getElementById('#targetId#').csApi.editSource.modal.changeValue(this)">
								    <option value="">請選擇</option>
								    <option value="sourceId">sourceId</option>
								    <option value="formId">formId</option>
								    <option value="formType">formType</option>
								    <option value="status">表單狀態status(Y:正式,N:暫存,D:刪除,...)</option>
								    <option value="evaluationTime">評估日期evaluationTime</option>
								    <option value="formVersionId">formVersionId</option>
								    <option value="creatorId">創建者creatorId</option>
								    <option value="creatorName">創建者creatorName</option>
								    <option value="createTime">創建者createTime</option>
								    <option value="modifyUserId">最後修改者modifyUserId</option>
								    <option value="modifyUserName">最後修改者modifyUserName</option>
								    <option value="modifyTime">最後修改者modifyTime</option>
								    <option value="totalScore">totalScore</option>
                                </select>
								<div class="modal_sourceValue" contenteditable="true"></div>
							</div>
							<label id="modal_editSource_remark" style="">※</label>
						</div>
						<div class="modal-footer" id="modal_editSource_footer">
							<button class="btn btn-secondary" type="button" data-dismiss="modal" onclick="$('.modal-backdrop').hide()">取消</button>
							<button class="btn btn-success" type="button" onclick="document.getElementById('#targetId#').csApi.editSource.modal.addSource()">確定</button>
						</div>
					</div>
				</div>
			</div>
		`,
        'clickSetting_configFiles': `
			<!--modal 設定 configFiles-->
			<div class="modal fade show" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" id="modal_clickSetting_configFiles" aria-modal="true" style="display: none;">
				<div class="modal-dialog modal-xl" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" style="color:black" id="modal_clickSetting_configFiles_title">設定-configFiles</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
						</div>
						<div class="modal-body" id="modal_clickSetting_configFiles_body">
							<div class="form-group row">
								<label class="col-form-label">方法method</label>
								<label class="col-form-label">副檔名</label>
							</div>
							<div class="form-group row">
								<div class="modal_value" contenteditable="true" onkeyup="document.getElementById('#targetId#').csApi.clickSetting.modal.addOrRemoveDiv(this)"></div>
								<div class="modal_file_extension" contenteditable="false">.xml</div>
							</div>
						</div>
						<div class="modal-footer" id="modal_clickSetting_configFiles_footer">
							<button class="btn btn-secondary" type="button" data-dismiss="modal" onclick="$('.modal-backdrop').hide()">取消</button>
							<button class="btn btn-success" type="button" onclick="document.getElementById('#targetId#').csApi.clickSetting.modal.okBtn()">確定</button>
						</div>
					</div>
				</div>
			</div>
		`,
        'clickSetting_params': `
			<!--modal 設定 params-->
			<div class="modal fade show" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" id="modal_clickSetting_params" aria-modal="true" style="display: none;">
				<div class="modal-dialog modal-xl" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" style="color:black" id="modal_clickSetting_params_title">設定-params</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
						</div>
						<div class="modal-body" id="modal_clickSetting_params_body">
							<div class="form-group row">
								<label class="col-form-label">key</label>
								<label class="col-form-label">value(建議在"參數來源"設置)</label>
								<label class="col-form-label">type</label>
								<label class="col-form-label">format</label>
							</div>
							<div class="form-group row">
								<div class="modal_key" contenteditable="true" onkeyup="document.getElementById('#targetId#').csApi.clickSetting.modal.addOrRemoveDiv(this)"></div>
								<div class="modal_value" contenteditable="true"></div>
								<select class="modal_type">
								    <option value="string">string</option>
								    <option value="int">int</option>
								    <option value="float">float</option>
								    <option value="boolean">boolean</option>
								    <option value="stringArray">stringArray</option>
								    <option value="intArray">intArray</option>
								    <option value="floatArray">floatArray</option>
                                </select>
								<div class="modal_format" contenteditable="true"></div>
							</div>
						</div>
						<div class="modal-footer" id="modal_clickSetting_params_footer">
							<button class="btn btn-secondary" type="button" data-dismiss="modal" onclick="$('.modal-backdrop').hide()">取消</button>
							<button class="btn btn-success" type="button" onclick="document.getElementById('#targetId#').csApi.clickSetting.modal.okBtn()">確定</button>
						</div>
					</div>
				</div>
			</div>
		`,
        'alert': `
        <div class="modal fade show" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" id="modal_csApi_alert" aria-hidden="true" style="padding-right: 17px; display: none;">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">提示</h5><button type="button" class="close text-white" data-dismiss="modal" aria-label="Close" onclick="$('.modal-backdrop').hide()"><span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body">
                        <p class="modal-body-paragraph" style="color:black" id="modal_csApi_alert_msg">施工中</p>
                    </div>
                    <div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal" onclick="$('.modal-backdrop').hide()">確定</button></div>
                </div>
            </div>
        </div>
        `
    }
}