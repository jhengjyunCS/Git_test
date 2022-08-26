var printModule = new fn_printModule();

//兼容非動態表單
try{
	formType = formType
}catch (e) {
	var formType = "null"
}
try{
	frameModel = frameModel
}catch (e) {
	var frameModel = "null"
}
/**
 * (一般非gForm表單) 頁面格式要求
    *開F12查看那些缺少js該引用
    *必須指定 #pageResult (可以設於<body>)
 * (gFormWebLIST) 頁面格式要求
	*設定localStorage
		"gFormWebPRINT2_sourceId"+multiLevel
		"gFormWebPRINT2_formType"+multiLevel
	*可指定查詢條件
		"gFormWebPRINT2_searchParamGF"+multiLevel -> {同GForm().searchParamGF}
	*跳轉頁面
		"gFormWebPRINT2.html?multiLevel="+multiLevel

 * (gFormWebPRINT2)頁面格式要求
	<div class="resultGroup">
 		<!-- 頁首、頁尾、表頭 可用標籤${method.text}來替代資料
 			 見 fn_printModule.setPageHeaderFooterAndTitle
			 * 日期時間 now.格式 -> 可自由搭配 yyyyMMdd HHmm
			 * 頁面相關 page.格式 -> 頁碼 count / 總頁數 total
			 * 取得系統參數 systemValue.方法:參數 -> 請參考 DynamicForm().getSystemValue()
 		-->
		<!-- 頁首 -->
		<div class="pageHeader model">
			<div class="left">定磐科技</div>
			<div class="middle">XXX評估表</div>
			<div class="right">${now.yyyy/MM/dd HH:mm}</div>
		</div>
 		<!-- 表頭 子層結構不限-->
		<div class="pageTitle model">
 			<!-- 以下可自行設定，有支援以下方法...-->

 			<!-- 支援取得api並填值的方法
				 * data-api-structure -> (必填)設定要取的api設定 (取gForm)
 				 * data-api-send-param -> (可選)要替換的sendParam內容，請參考apiModule.js -> apiModule.sendParam
 			-->
			<table class="apiResultTable" data-api-structure='{"apiName":"CTHgetNoteApplyInfo","runMode":"F","sourceId":"xindian"}' data-api-send-param='{"encId":{"source":"local:gFormWebPRINT2_encId"},"patientId":{"source":"local:gFormWebPRINT2_patientId"}}'>
				<tbody>
					<tr class="">
						<td><label>床號</label></td>
						<td class="pFormItem" data-bean="bedno"></td>
					</tr>
 				</tbody>
 			</table>
		</div>
 		<!-- 頁尾 -->
 		<div class="pageFooter model">
			<div class="left">病歷號:${systemValue.local:encId}</div>
			<div class="middle">簽章人員:${systemValue.form.signNurs}</div>
			<div class="right">第${page.count}頁，共${page.total}頁</div>
 		</div>

 		<!-- 表身A 僅顯示，不取值不斷行
			 data-is-only-show 設為true
 		-->
		<table class="resultTable" data-is-only-show="true">
			<thead>
				<tr class="trWordCountSetting">
					<td data-word-count="">&nbsp;</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td style="border: none;">＊收案原因</td>
				</tr>
			</tbody>
		</table>

		<!-- 表身B 取得表單資料並根據art-template繪製 (通常用於單一表單)
			 [data-search-param-g-f] 查詢條件 {searchParamGF: {同GForm().searchParamGF}}
 				*支援DynamicForm().getSystemValue()
		-->
		<table class="resultTable" data-search-param-g-f='{"formType":"CTHNoteReplySocialWorker", "sourceId":"eval:sourceId"}'>
			<thead>
				<!-- thead的第一個tr必須設定.trWordCountSetting
					 *設定每個tbody>td可容納幾個中文字(僅允許一格為空)
 				-->
				<tr class="trWordCountSetting">
					<td data-word-count="5">&nbsp;</td>
					<td data-word-count="12">&nbsp;</td>
					<td data-word-count="6">&nbsp;</td>
	 				<td data-word-count="">&nbsp;</td>
					<td data-word-count="4">&nbsp;</td>
				</tr>
			</thead>
			<tbody class="tbody">
			</tbody>
		</table>
		<script class="resultTableTemplate" type="text/html">
			<!-- art-template模板
 				 *.pFormItem節點 建議設定在td上，否則建議加上 .dontCut阻止計算斷行
 				 *禁止rowspan，會造成換頁計算有問題
 				 *可用參數
				 	.dontCut			阻止計算斷行
 					.rowspanBottom		與下一行合併，搭配下一行使用.rowspanTop (僅將格線隱藏，非真正合併)
 					.rowspanTop			與上一行合併 (僅將格線隱藏，非真正合併)
 					.middleBorderHide	當自動斷行時，隱藏中間格線
			-->
			{{if $data.length==0}}
				<tr>
					<td class="text-center" colspan="10">查無資料...</td>
				</tr>
			{{else}}
			{{each $data gForms idx}}
			{{set gForm=gForms.gForm}}
				<tr class="">
					<td class="">回覆時間</td>
					<td class="pFormItem" colspan="2" data-bean="replyTime" data-index="{{gForm.idx}}" data-formversionid="{{gForm.formVersionId}}"></td>
					<td class="">是否收案</td>
					<td class="pFormItem" data-bean="RECLIST" data-index="{{gForm.idx}}" data-formversionid="{{gForm.formVersionId}}"></td>
				</tr>
				<tr class="">
					<td class="rowspanBottom"></td>
					<td class="rowspanBottom"></td>
					<td class="middleBorderHide">社會資源諮詢</td>
					<td class="pFormItem" colspan="7" data-bean="SocietyP" data-index="{{gForm.idx}}" data-formversionid="{{gForm.formVersionId}}"></td>
				</tr>
				<tr class="">
					<td class="rowspanTop rowspanBottom"></td>
					<td class="rowspanTop rowspanBottom"></td>
					<td class="middleBorderHide">經濟問題</td>
					<td class="pFormItem" colspan="7" data-bean="EconomyP" data-index="{{gForm.idx}}" data-formversionid="{{gForm.formVersionId}}"></td>
				</tr>
			{{/each}}
			{{/if}}
		</script>

		<!-- 表身C (用於合併表單) 引用表單
 			 [data-merge-param]		 指定表單(取得該表單的表身B .resultTable, .resultTableTemplate) {formType: "", frameModel: ""}
			 [data-search-param-g-f] 額外查詢條件(合併至"指定表單"的searchParamGF) {searchParamGF: {同GForm().searchParamGF}}
		-->
		<table class="resultTable" data-merge-param='{"formType":"CTHDPSecondScreen", "frameModel":"gFormWebPRINT2"}' data-search-param-g-f='{"counts":"1"}'>
		</table>
 */
/**
 * 打印控件
 */
function fn_printModule(){
	let print = this
	this.config = {
		$page: $(`<div class="page"></div>`),
		$pageBody: $(`<div class="pageBody"></div>`),
		$pageHeaderFooterAndTitleLabel: $(`<label class="pageHeaderFooterAndTitle"></label>`),
		words: '王ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890()%$℃./, !@#^&*_-+=\\[]{}\'":;?<>~`|',
		// words: ' '
		btnGroup: `	<div class="btnGroup">
						<button class="printViewBtn" onclick="window.print();">預覽列印</button>
						<button class="goBackBtn" onclick="history.go(-1);">返回</button>
						<button class="windowCloseBtn" onclick="window.open('about:blank','_top').close()">關閉</button>
					</div>`
	}
	let module = {}
	let settings = {}
	let $page
	let $tbody
	let pageCounts = 0
	this.start=function(){
		//檢查是否有同步執行的元件，有則等到全部完成再執行打印
		let $csCanvasFormItem = $('.csCanvasFormItem[type="csCanvas"]')
		for (let i=0, len=$csCanvasFormItem.length; i<len; ++i) {
			if (!$csCanvasFormItem[i].csCanvas || !$($csCanvasFormItem[i]).hasClass('setValueComplete')) {
				setTimeout(function(){
					console.log('等待同步執行的元件執行完畢...')
					print.start()
				}, 100);
				return;
			}
		}
		//阻止csCanvas的script再次執行
		$('.csCanvasScriptTag').attr('type', 'text/html')
		//開始打印
		$('.resultGroup').each(function(resultGroupIdx){
			module = {
				pageHeader:	$(this).find('.pageHeader.model'),
				pageTitle:	$(this).find('.pageTitle.model'),
				pageFooter:	$(this).find('.pageFooter.model'),
				table: $(this).find('.resultTable:first'),
				thead: $(this).find('.resultTable:first').find('>thead:first'),
				tbody: $(this).find('.resultTable:first').find('>tbody:first'),
				resultGroupIdx: resultGroupIdx,
				resultTableIdx: -1
			}
			module = print.setPageHeaderFooterAndTitle(module)
			//基礎設定
			settings = {
				pageHeight: 0, //頁高
				//由 getTdWordCountArr() 獲取
				eachWordsWid: [], //每一個字佔幾個 "|" 字寬
				tdWordCountArr: [] //每一個td佔幾個 "|" 字寬
			}
			++pageCounts
			$page = print.creatEmptyPage(module)
			settings.pageHeight = $page[0].clientHeight+4 //+4偏差值
			$(this).find('.resultTable').each(function(resultTableIdx){
				//取得表單基礎設定
				module.table = $(this)
				module.thead = $(this).find('>thead:first')
				module.tbody = $(this).find('>tbody:first')
				module.resultTableIdx = resultTableIdx
				//取得欄位字元寬度設定
				let frameId = module.table.attr('data-frame-id'), frameTs = module.table.attr('data-frame-ts')
				if (frameId && frameTs && localStorage[frameId] === frameTs && localStorage[`${frameId}_settings`]) {
					//如果formFrame沒有更改的話，直接取用暫存區的settings
					settings = JSON.parse(localStorage[`${frameId}_settings`])
				}else{
					settings = $.extend(false, settings, print.fn.getTdWordCountArr(module))
					if (frameId && frameTs) {
						localStorage[`${frameId}`] = frameTs
						localStorage[`${frameId}_settings`] = JSON.stringify(settings)
					}
				}
				console.log(settings)
				//檢查td欄位空間
				for (let i=0, len=settings.tdWordCountArr.length; i<len; ++i){
					if (settings.tdWordCountArr[i]<=3) {
						alert(`.resultGroup[${resultGroupIdx}].resultTable[${resultTableIdx}]>td[${i}]欄位空間不夠，請重新調整.trWordCountSetting`)
						return
					}
				}
				//開始繪製打印頁
				let $table = print.creatEmptyTable($page.find('.pageBody'), module)
				$tbody = $table.find('>tbody')
				//換頁
				if ($page[0].clientHeight>settings.pageHeight) {
					++pageCounts
					$page = print.creatEmptyPage(module)
					$page.find('>.pageBody').append($table)
				}

				$(this).find('>tbody>tr').each(function(){
					let $tr, $mainTr, $otherTr = $(this)
					//是否繼續新建tr, 同一個tr換行次數, 同一個tr換頁次數
					let isCreateNewTr = true, wrapCount = 0, wrapPageCount = 0
					//處理調用方法 data-fns-*
					$(this).find('>td').each(function(){
						print.doFns(this)
					})
					//處理換行換頁
					while (isCreateNewTr) {
						isCreateNewTr = false
						$tr = $otherTr
						$mainTr = $tr.clone().empty()
						$otherTr = $mainTr.clone()
						$tr.find('>td:not(.hide)').each(function(tdIdx){
							//檢查是否要隱藏border (rowspan)
							if ($(this).hasClass('rowspanBottom')) {
								$(this).addClass('bottomBorderHide')
							}
							if ($(this).hasClass('rowspanTop')) {
								$(this).addClass('topBorderHide')
							}
							//換行時要隱藏中間的格線
							if ($(this).hasClass('middleBorderHide')) {
								$(this).addClass('bottomBorderHide')
							}
							//不執行斷行的話
							if ($(this).hasClass('dontCut')) {
								$mainTr.append($(this).clone())
								$otherTr.append($(this).clone().empty())
								return true //continue
							}
							let html
							//處理換行符號  \n -> 消失   <br> -> \n
							if ($tr.hasClass('trWrap') === false) {
								//首個tr須處理換行及空白
								let st = this.innerHTML
								//空白
								st = st.trim().replace(/>(\s)+/g, '>').replace(/(\s)+</g, '<')
								//換行
								st = st.replace(/(<br>)|(<br\/>)/g, '\n')
								html = $('<div>'+st+'</div>')[0].textContent
							}else{
								//換行後的tr免處理換行
								html = this.textContent
							}
							// $(this).attr("wordCount", print.fn.getTdWordCount(this, tdIdx, settings.tdWordCountArr))
							let json = print.fn.getSentenceByWidth(html, print.fn.getTdWordCount(this, tdIdx, settings.tdWordCountArr))
							$mainTr.append($(this).clone().empty().append(json.leftSentence))
							$otherTr.append($(this).clone().empty().append(json.rightSentence))
							if (json.rightSentence!=="") {
								isCreateNewTr = true
								$otherTr.addClass('trWrap').attr('data-wrap-count', ++wrapCount)
							}
						})
						if (isCreateNewTr) {
							//檢查是否要隱藏border (rowspan+中間的格線)
							$otherTr.find('td.rowspanBottom, td.middleBorderHide').addClass('topBorderHide')
							$mainTr.find('td.rowspanTop').addClass('bottomBorderHide')
						}else{
							//檢查是否要"解除"隱藏border (rowspan+中間的格線)
							$mainTr.find('td.rowspanTop:not(.rowspanBottom), td.middleBorderHide').removeClass('bottomBorderHide')
						}
						$tbody.append($mainTr)
						//換頁
						if ($page[0].clientHeight>settings.pageHeight) {
							++pageCounts
							$page = print.creatEmptyPage(module)
							let $table = print.creatEmptyTable($page.find('.pageBody'), module)
							$tbody = $table.find('>tbody')
							if ($mainTr.hasClass('trWrap')) {
								$mainTr.addClass('trWrapPage').attr('data-wrap-page-count', ++wrapPageCount)
							}
							//"解除"上一層tr的隱藏border (rowspan)
							$mainTr.prev().find('td.bottomBorderHide').removeClass('bottomBorderHide')
							//"解除"這一層tr的隱藏border (rowspan)
							$mainTr.find('td.topBorderHide').removeClass('topBorderHide')
							$tbody.append($mainTr)
						}
					}
				})
			})

		})
		//檢查是否canvas元件，有則把原始resultGroup的canvas繪製到page內的canvas
		if ($csCanvasFormItem.length>0) {
			for (let i=0, len=$csCanvasFormItem.length; i<len; ++i) {
				let oldCanvas = $csCanvasFormItem[i]
				let $newCanvas = $('.page>.pageBody .tbody').find(`#${ $csCanvasFormItem[i].id}`)
				$newCanvas.parent().html('<img width="'+$(oldCanvas).width()+'" src="'+oldCanvas.toDataURL()+'" />')
			}
		}
		//寫上總頁數
		$('.page-total').html(pageCounts)
		//顯示預覽列印/取消按鈕
		$('#targetForm').prepend(print.config.btnGroup)
		if (history.length===1) {
			$('#targetForm').find('>.btnGroup>.goBackBtn:first').hide()
		}else {
			$('#targetForm').find('>.btnGroup>.windowCloseBtn:first').hide()
		}
	}

	/**
	 * 顯示gForm上的打印結果(each tbody)
	 * =
	 * 循環div.resultGroup > 循環table.resultTable
	 *
	 * 找到table.resultTable[data-search-param-g-f]
	 *
	 * 轉換searchParamGF，例如sourceId:"eval:sourceId" -> sourceId:"1101210057"
	 *
	 * 查詢gForm並渲染 (按照table.resultTable:eq(idx)的順序讀取對應的script.resultTableTemplate:eq(idx))
	 * @param successCall
	 * @param errorCall
	 */
	this.listGformPrintResult_eachTbody = function(successCall, errorCall){
		let dynamicFormObj = nursing.createDynamicForm();
		let gFormObj = nursing.createGForm()
		let returnCounts = 0 //計算查詢的counts，用於最後要執行successCall
		//div 循環div.resultGroup > 循環table.resultTable
		$('.resultGroup').each(function(resultGroupIdx){
			$(this).find('.resultTable').each(function(resultTableIdx){
				//是否為僅顯示
				let isOnlyShow = $(this).attr('data-is-only-show')
				if (isOnlyShow==="true") {
					return //continue
				}

				$(this).attr('resultTableTemplateIdx', returnCounts)
				++returnCounts
				let thisTable = this

				//取得查詢條件
				let searchParamGF = $(this).attr('data-search-param-g-f')
				if (!searchParamGF) {
					searchParamGF = {
						formType : formType,
						sourceId : sourceId
					}
				}else{
					try{
						searchParamGF = JSON.parse(searchParamGF)
					}catch (e) {
						console.error(e, searchParamGF)
						if (errorCall) errorCall(e, searchParamGF)
						return
					}
				}
				searchParamGF.formType = (searchParamGF.formType) ? searchParamGF.formType : formType
				//取得額外的查詢條件 (可能由list頁面傳入formId or 查詢頁面傳入查詢區間 or 合併列印頁面傳入counts)
				searchParamGF = $.extend(true, searchParamGF, print2_searchParamGF)
				//轉換searchParamGF
				for (let key in searchParamGF) {
					let v = searchParamGF[key]
					if (typeof v === "string"){
						searchParamGF[key] = dynamicFormObj.getSystemValue(v, null)
					}
				}
				console.log(searchParamGF)
				//查詢gForm
				gFormObj.getGFormListWithConditionPlus({"searchParamGF":searchParamGF}, function(rs){
					$(thisTable).find("tbody").empty();
					// gForms = gForms.concat(rs) //合併至gForms，用於
					for (let i=0, len=rs.length; i<len; ++i) {
						rs[i].gForm.idx = `${resultGroupIdx}-${resultTableIdx}-${i}`
						gForms[rs[i].gForm.idx] = rs[i]
					}
					gFormJson[`resultGroup${resultGroupIdx}-resultTable${resultTableIdx}`] = rs
					var cxt = template.compile($(`.resultTableTemplate:eq(${$(thisTable).attr('resultTableTemplateIdx')})`).html())
					var html = cxt(rs)
					$(thisTable).find("tbody").html(html || html)
					if (--returnCounts>0) return
					if (successCall) successCall()
				}, function(e){
					console.error(e)
					if (errorCall) errorCall(e)
				})
			})
		})
	}

	/**
	 * 設定須取得api資料之table
	 * =
	 * 循環table.apiResultTable
	 *
	 * 取得api設定table.apiResultTable[data-api-structure]
	 *
	 * 調用api
	 *
	 * 查找table.apiResultTable > .gFormItem並設定值
	 * @param successCall
	 * @param errorCall
	 */
	this.setApiResultTable = function(successCall, errorCall){
		let $apiResultTable = $('.apiResultTable')
		if ($apiResultTable.length===0) {
			if (successCall) successCall()
			return
		}
		let dynamicFormObj = nursing.createDynamicForm();
		let gFormObj = nursing.createGForm()
		let returnCounts = 0 //計算查詢的counts，用於最後要執行successCall
		let module = nursing.createApiModule();
		//循環table.apiResultTable
		$apiResultTable.each(function(apiResultTableIdx){
			let thisApiResultTable = this
			//取得api設定
			let apiStructure = $(this).attr('data-api-structure')
			try {
				apiStructure = JSON.parse(apiStructure)
				apiStructure = apiStructure || null
			} catch (e) {
				console.error(e)
				apiStructure = null
			}
			if (!apiStructure) {
				errorCall('.apiResultTable的data-api-structure參數設定有誤')
				return
			}
			//取得api-sendParam設定
			let apiSendParam = $(this).attr('data-api-send-param')
			if (apiSendParam){
				try {
					apiSendParam = JSON.parse(apiSendParam)
					apiSendParam = apiSendParam || null
				} catch (e) {
					console.error(e)
					apiSendParam = null
				}
			}
			++returnCounts
			//init API
			module.fn.init(apiStructure, function(apiModule){
				//合併api-sendParam設定
				if (apiSendParam) {
					apiModule = $.extend(true, apiModule, {"sendParam": apiSendParam});
				}
				//儲存api設定
				apis.push(apiModule);
				try{
					apis[apiModule.apiName] = apis[apis.length - 1];
				}catch(e){
					console.error(e);
				}
				//設定api調用完成時的回調
				apis[apis.length - 1].complete = function(apiModule) {
					if (apiModule.resultMsg && apiModule.resultMsg.error) {
						console.error(apiModule.resultMsg)
						errorCall("call api error! -> "+apiModule.apiDescription + "\n\n"+apiModule.resultMsg.msg)
						return
					}
					//取得資料
					let dataMap = apiModule.fn.getData()
					//設定
					$(thisApiResultTable).find('.pFormItem').each(function(){
						let bean = $(this).attr('data-bean')
						//若無資料則不處理 (防止不該被setting的欄位被覆蓋)
						if (dataMap[bean]) {
							this.innerHTML = dataMap[bean]
						}
					})
					//回調
					if (--returnCounts>0) return
					if (successCall) successCall()
				}
				//開始調用
				apis[apis.length - 1].start()
			}, function(error){
				errorCall(error)
				if (--returnCounts>0) return
				if (successCall) successCall()
			});
		})
	}

	/**
	 * 合併其他gForm列印頁到此頁面(each Table)
	 * =
	 * *循環(原table)div.resultGroup > 循環table.resultTable
	 *
	 * *取得引用gForm列印頁的參數table.resultTable[data-merge-param]
	 *
	 * *取得合併列印時的額外查詢條件table.resultTable[data-search-param-g-f]
	 *
	 * *取得gForm列印頁
	 *
	 * *循環(gForm列印頁)的table.resultTable
	 *
	 * *合併原table的額外查詢條件至gForm列印頁的查詢條件 $.extend(false, gForm列印頁[data-search-param-g-f], 原table[data-search-param-g-f])
	 *
	 * 貼上新table、貼上新art-template、刪除原table
	 * @param successCall
	 * @param errorCall
	 */
	this.mergePrint_eachTable = function(successCall, errorCall){
		let dynamicFormObj = nursing.createDynamicForm();
		let gFormObj = nursing.createGForm()
		let basicParamObj = nursing.createBasicParam();
		let returnCounts = 0 //計算查詢的counts，用於最後要執行successCall
		//div 循環div.resultGroup > 循環table.resultTable
		$('.resultGroup').each(function(resultGroupIdx){
			$(this).find('.resultTable').each(function(resultTableIdx){
				//是否為僅顯示
				let isOnlyShow = $(this).attr('data-is-only-show')
				if (isOnlyShow==="true") {
					return //continue
				}
				//取得引用gForm列印頁的參數
				let mergeParam = $(this).attr('data-merge-param')
				if (!mergeParam) {
					if (errorCall) errorCall(".resultTable缺少參數data-merge-param", $(this)[0])
					return
				}
				try{
					mergeParam = JSON.parse(mergeParam)
				}catch (e) {
					console.error(e, mergeParam)
					if (errorCall) errorCall(e, mergeParam)
					return
				}
				//取得合併列印時的額外查詢條件
				let searchParamGF = $(this).attr('data-search-param-g-f')
				if (!searchParamGF) {
					searchParamGF = {}
				}else{
					try{
						searchParamGF = JSON.parse(searchParamGF)
					}catch (e) {
						console.error(e, searchParamGF)
						if (errorCall) errorCall(e, searchParamGF)
						return
					}
				}

				$(this).attr('mergePrintTableIdx', returnCounts)
				++returnCounts
				let thisTable = this

				//取得formFrame
				dynamicFormObj.searchParamDF.formType = mergeParam.formType;
				dynamicFormObj.searchParamDF.frameModel = mergeParam.frameModel;
				basicParamObj.getCurrDynamicFormFrameByformTypeFrameModel(dynamicFormObj, function(formFrame) {
					//沒有模板資料
					if (formFrame==null){
						if (errorCall) errorCall("缺少模板資料", formFrame)
						return
					}
					$(thisTable).find('tbody').empty();
					let $originalTable = $(thisTable).clone()
					let $targetFormFrame = $("<div></div>").append(formFrame.content)
					$targetFormFrame.find('.resultTable').each(function(targetResultTableIdx){
						let $cloneTable = $originalTable.clone()
						//合併查詢條件
						let targetSearchParamGF = $(this).attr('data-search-param-g-f')
						if (!targetSearchParamGF) {
							targetSearchParamGF = {}
						}else{
							try{
								targetSearchParamGF = JSON.parse(targetSearchParamGF)
							}catch (e) {
								console.error(e, targetSearchParamGF)
								if (errorCall) errorCall(e, targetSearchParamGF)
								return
							}
						}
						$cloneTable.attr("data-search-param-g-f", JSON.stringify($.extend(false, targetSearchParamGF, searchParamGF)))
						//貼上resultTable
						let $targetResultTable = $(this).children()
						$cloneTable.append($targetResultTable)
						$(thisTable).after($cloneTable)
						//將formFrame時戳記錄於table及localStroage(用於加快效能)
						$cloneTable.attr('data-frame-id', `gFormWebPRINT2_${formFrame.id}`).attr('data-frame-ts', formFrame.ts)
						//貼上art-template
						let $targetTemplate = $targetFormFrame.find(`.resultTableTemplate:eq(${targetResultTableIdx})`)
						$(thisTable).after($targetTemplate)
						//刪除原table
						$(thisTable).remove()
					})
					if (--returnCounts>0) return
					if (successCall) successCall()
				}, function(e) {
					console.error(e)
					if (errorCall) errorCall(e)
				})
			})
		})
	}

	/**
	 * 創建空的一頁
	 * @param {module} module
	 * @returns {*}
	 */
	this.creatEmptyPage = function(module){
		let $page = print.config.$page.clone()
		$page.append(module.pageHeader.clone())
		$page.append(module.pageTitle.clone())
		$page.append(print.config.$pageBody.clone())
		$page.append(module.pageFooter.clone())
		$page.find('.page-count').html(pageCounts)
		$('#pageResult').append($page)
		return $page
	}

	/**
	 * 創建空的table
	 * @param {jQuerySelector} $pageBody
	 * @param {module} module
	 * @returns {*}
	 */
	this.creatEmptyTable = function($pageBody, module){
		let $table = module.table.clone()
		$table.removeAttr('id')
		$table.removeClass('resultTable')
		$table.find('thead:first').replaceWith(module.thead.clone())
		$table.find('tbody:first').empty()
		$pageBody.append($table)
		return $table
	}
	/**
	 * 設定每頁重複頁首、頁尾、表頭
	 * =
	 * 取代所有被innerHTML中的標記 ${method.text} || $.{method.text}  (後者為jsp時使用)
	 *
	 * method->
	 *
	 * 日期時間 now.格式 -> 可自由搭配 yyyyMMdd HHmm
	 *
	 * 頁面相關 page.格式 -> 頁碼 count / 總頁數 total
	 *
	 * 取得系統參數 systemValue.方法:參數 -> 請參考 DynamicForm().getSystemValue()
	 * @param module
	 * @returns {*}
	 */
	this.setPageHeaderFooterAndTitle = function(module){
		let htmlArr = [module.pageHeader.html(), module.pageFooter.html(), module.pageTitle.html()]
		let getSystemValue = nursing.createDynamicForm().getSystemValue
		htmlArr.forEach(function(html, i){
			//jsp 使用$.{method.text}
			let matchArr = html.match(/(\$\{[A-Za-z0-9_.\/\-\:\s]+\})/g) || html.match(/(\$\.\{[A-Za-z0-9_.\/\-\:\s]+\})/g)
			if (matchArr===null) return //continue
			matchArr.forEach(function(match){
				//jsp 使用$.{method.text}
				let fnName = match.substring((match.indexOf('$.{')>-1) ? 3 : 2, match.length-1)
				let $label = print.config.$pageHeaderFooterAndTitleLabel.clone()
				$label.attr('data-match', fnName)
				switch (fnName.split('.')[0]) {
					case 'now':
						$label.append(new Date().format(fnName.split('.')[1]))
						break
					case 'page':
						$label.addClass(fnName.replace(".", "-"))
						break
					case 'systemValue':
						$label.append(getSystemValue(fnName.split('.')[1]))
						break
					default:
						break
				}
				html = html.replace(match, $('<div/>').append($label).html())
			})
			htmlArr[i] = html
		})
		module.pageHeader.html(htmlArr[0])
		module.pageFooter.html(htmlArr[1])
		module.pageTitle.html(htmlArr[2])
		return module
	}
	/**
	 * 設定formFrame資訊
	 * =
	 * 目前用於加快效能，將frameId、frameTs設定於table[data-*]
	 * @param {{}} formFrame
	 */
	this.setFormFrameInfo = function(formFrame) {
		$('.resultTable:not([data-frame-id])').each(function(tableIdx){
			$(this).attr('data-frame-id', `gFormWebPRINT2_${formFrame.id}_tableIdx${tableIdx}`).attr('data-frame-ts', formFrame.ts)
		})
	}
	/**
	 * 處理調用方法 data-fns-*
	 * @param {ele} td
	 */
	this.doFns = function(td){
		for (let key in td.dataset) {
			switch (key) {
				/**
				 *  {regex, string} {'aaa', 'bbb'} 取代
				 *  ex. <td>2022-06-07 10:00</td>
				 *  data-fns-replace="'/\s/g', '<br>'" -> 2022-06-07<br/>10:00
				 */
				case 'fnsReplace':
					let param = this.getParams(td.dataset[key])
					let strOrRegex = ''
					//如果是正則表達式，檢查是否含非法字段 /*  */ 防止XSS攻擊，如 eval(/**/alert()/**/)
					if (/^\/[\w\W]+\/[gimuy]*$/.test(param[0]) && /\/\*|\*\//.test(param[0]) === false) {
						param[0] = eval(param[0])
					}
					td.innerHTML = td.innerHTML.replace(param[0], param[1])
					break
				/**
				 *	{string} 遇到該字段就換行 (非取代)
				 *  ex. <td>2022-06-07 10:00</td>
				 *	data-fns-wrap-by-word=" " -> 2022-06-07<br/> 10:00
				 */
				case 'fnsWrapByWord':
					td.innerHTML = td.innerHTML.replace(td.dataset[key], '<br>'+td.dataset[key])
					break
				default:
					break
			}
		}
		this.getParams = function (st) {
			let arr = st.split(/'\s*,\s*'/g)
			//去除頭尾單引號
			if (arr.length>0) {
				arr[0]=arr[0].substring(1, arr[0].length)
				arr[arr.length-1]=arr[arr.length-1].substring(0, arr[arr.length-1].length-1)
			}
			return arr
		}
	}

	this.fn = {
		/**
		 * 取得每個td最大可容納的 "|" 數量
		 * @param {module} module
		 * @returns {{}}
		 */
		getTdWordCountArr: function(module){
			let json = {
				eachWordsWid: [],
				tdWordCountArr: []
			}
			let tdWordCountArr = [], arr = [], emptyWordCount=0
			module.thead.find('.trWordCountSetting:first>td').each(function(){
				let v = $(this).data('word-count')
				if (v && v!=="") {
					arr.push(parseFloat(v))
				} else {
					++emptyWordCount
					arr.push(-1)
				}
			})
			if (arr.length===0){
				throw '發生錯誤 [每個tbody>td可容納幾個中文字] \n 尚未設定 -> thear>tr.trWordCountSetting'
			}
			if (emptyWordCount>1) {
				throw '發生錯誤 [每個tbody>td可容納幾個中文字] \n 僅允許一格為空 -> thear>tr.trWordCountSetting>td[data-word-count]'
			}
			json.tdWordCountArr = arr
			json.eachWordsWid = print.fn.getEachWordsWidth(module, json)
			//轉換"中文字"數量 -> "|"的數量
			arr.forEach(function(v){
				v = (v!==-1)? parseFloat((v*json.eachWordsWid[0]).toFixed(2)) : v
				tdWordCountArr.push(v)
			})

			//在thead.trWordCountSetting補上對應的"王"和"|"量
			module.thead.find('.trWordCountSetting:first>td').each(function(i){
				if (tdWordCountArr[i]!==-1) {
					let i2 = 0, w = "", wordCount = $(this).attr('data-word-count')
					let chCounts = (wordCount) ? parseInt(wordCount, 10) : 0
					let counts   = (wordCount) ? 0 : tdWordCountArr[i]
					while(++i2<=chCounts || i2<=counts){
						w += (chCounts!==0) ? '王' : '|'
					}
					this.textContent = w
				}
			})

			//計算"沒設定data-word-count"的 "|"的數量
			if (tdWordCountArr.indexOf(-1)>-1) {
				let $pageTemp = print.creatEmptyPage(module)
				let $tableTemp = print.creatEmptyTable($pageTemp.find('.pageBody'), module)
				$tableTemp.find('tbody:first').append(module.tbody.find('tr:first').clone().empty())
				let $tr = $tableTemp.find('tbody:first>tr:first'), tds=""
				for (let i=0; i<tdWordCountArr.length; ++i){
					tds += '<td style="word-break: break-word !important;height: min-content !important;"></td>'
				}
				$tr.append(tds)
				//計算"沒設定data-word-count"的格子的"|"量
				let targetTdIdx = tdWordCountArr.indexOf(-1)
				let targetTd = $tr.find('>td')[targetTdIdx]
				if (targetTd) {
					tdWordCountArr[targetTdIdx] = print.fn.getWordWidth(targetTd, "|", 30)-2 //防止意外，修正值
					//在thead.trWordCountSetting補上對應的"|"量
					let i2 = 0, w = ""
					while(++i2<=tdWordCountArr[targetTdIdx]){
						w += '|'
					}
					module.thead.find('.trWordCountSetting:first>td')[targetTdIdx].textContent = w
				}
				$pageTemp.remove()
			}
			json.tdWordCountArr = tdWordCountArr

			return json
		},
		/**
		 * 取得該td的佔用字數(含colspan)
		 * @param thisTd
		 * @param thisTdIdx
		 * @param tdWordCountArr
		 * @returns {number}
		 */
		getTdWordCount: function(thisTd, thisTdIdx, tdWordCountArr){
			let colIdx = -1, wordCount = 0
			$(thisTd).parent().find('>td, >th').each(function(i){
				let colspan = $(this).attr('colspan')
				colspan = (colspan!=null) ? parseInt(colspan, 10) : 1
				if (i===thisTdIdx) {
					for (let i2 = colIdx+1; i2<=colIdx+colspan; ++i2) {
						wordCount += (tdWordCountArr[i2]) ? tdWordCountArr[i2] : 0
					}
					return false
				}else{
					colIdx += colspan
				}
			})
			return wordCount
		},
		/**
		 * 算出每個字元[A,B,C,...]在"|"中佔了多少比例
		 * 假設 格子最大可容納"|"*20
		 * 該格子可以容納 "王"*4  + "|"*4
		 * 則 "王"在"|"佔的比例為 (20-4) / 4 = 4
		 * 得 1個"王"=4個"|"
		 * @param {module} module
		 * @param {{eachWordsWid: *[], tdWordCountArr: *[]}} settingsJson
		 * @returns {[]}
		 */
		getEachWordsWidth: function(module, settingsJson){
			let eachWordsWid = []
			let $pageTemp = print.creatEmptyPage(module)
			$pageTemp.css({'position': 'fixed', 'top': '0'})
			let $tableTemp = print.creatEmptyTable($pageTemp.find('.pageBody'), module)
			$tableTemp.find('tbody:first').append(module.tbody.find('tr:first').clone().empty())
			let $tr = $tableTemp.find('tbody:first>tr:first')
			//將所有格子塞滿對應數量的中文字，沒有設定[data-word-count]的格子塞滿"|"
			let thisTd=null, maxWid=0, tds=""
			for (let i=0; i<settingsJson.tdWordCountArr.length; ++i){
				tds += '<td style="word-break: break-word !important;height: min-content !important;"></td>'
			}
			$tr.append(tds)
			$tr.find('>td').each(function(idx) {
				let w = ""
				for (let i=0; i<settingsJson.tdWordCountArr[idx]; ++i){
					w+="王"
				}
				this.textContent = w
				if (settingsJson.tdWordCountArr[idx]===-1) {
					print.fn.getWordWidth(this, "|", 30)
				}
			})
			//找到最大的格子
			$tr.find('>td').each(function() {
				let wid = this.clientWidth;
				if (wid>maxWid){
					maxWid = wid
					thisTd = this
				}
			})
			//以 "|" 為基礎去算這欄需要幾個
			thisTd.innerHTML = ""
			let basicWordCounts = print.fn.getWordWidth(thisTd, "|", 30)
			//計算
			for (var i2=0, len2=print.config.words.length; i2<len2; i2++){
				var word = print.config.words.substr(i2,1);
				let thisWordCounts = 0; //A,B,C的字元數
				let thatWordCounts = 0; // "|"的字元數
				//找到A,B,C的最大字數
				thisTd.innerHTML = ""
				thisWordCounts = print.fn.getWordWidth(thisTd, word, 30)
				//找到"|"的最大字數
				thatWordCounts = print.fn.getWordWidth(thisTd, "|", 1)

				eachWordsWid.push(parseFloat(((basicWordCounts-thatWordCounts)/thisWordCounts).toFixed(2)))
			}
			$pageTemp.remove()

			return eachWordsWid
		},
		/**
		 * 算出該字元在td中最多可容納幾個字
		 * @param targetTd
		 * @param {string} word
		 * @param {number} i_start 為加速效能，改變一開始塞入的文字量
		 * @returns {number}
		 */
		getWordWidth: function(targetTd, word, i_start){
			//加速程式效能
			if (i_start!==1) {
				let i_temp = localStorage[`${formType}.${frameModel}.getWordWidth.${word}`]
				i_temp = (i_temp) ? parseInt(i_temp) : i_start
				i_start = i_temp
			}
			// word = (word===" ") ? "&nbsp;" :
			// 	   (word==="<") ? "&lt;" :
			// 	   (word===">") ? "&gt;" :
			// 	   (word==="&") ? "&amp;" : word; //轉換為html保留字
			// let wlen = (word===" ") ? 6 :
			// 		   (word==="<") ? 4 :
			// 		   (word===">") ? 4 :
			// 		   (word==="&") ? 5 : 1; //html保留字佔多少字元
			word = (word===" ") ? "&nbsp;" : word;
			let wordCount = 0
			if (targetTd.innerHTML=="") {
				if (word===" ") {
					targetTd.innerHTML += word
				} else {
					targetTd.textContent += word
				}
				++wordCount
			}
			let orgHei = targetTd.clientHeight
			for (let i=i_start; i>=-999; i-=(i>30) ? 20 : (i>10) ? 10 : 5) {
				i = (i<=0) ? 1 : i
				let w = ""
				for (let i2=0; i2<i; ++i2) {
					w += word
				}
				//clientHeight的效能較差，但目前找不到方式可替代，resizeObserver對TD好像沒用
				do {
					if (word==="&nbsp;") {
						targetTd.innerHTML += w
					} else {
						targetTd.textContent += w
					}
					wordCount += i
				}while(orgHei === targetTd.clientHeight)
				wordCount -= i
				let html = targetTd.textContent

				targetTd.textContent=html.substr(0,html.length-(word.length * i));
				i = (i===1) ? -1000 : i
			}
			if (i_start!==1) {
				localStorage[`${formType}.${frameModel}.getWordWidth.${word}`] = wordCount
			}
			return wordCount
		},
		/**
		 * 依據文字長度將句子切成兩段
		 * @param {string} sentence
		 * @param {float} wordWidth
		 * @returns {{leftSentence: string, rightSentence: string}}
		 */
		getSentenceByWidth: function(sentence, wordWidth) {
			let json = {
				leftSentence : "",
				rightSentence : ""
			}
			let w = "", width = 0
			while (sentence!=="" && width+(settings.eachWordsWid[print.config.words.indexOf(sentence.substr(0,1))] || settings.eachWordsWid[0])<=wordWidth) {
				w += sentence.substr(0,1)
				if (w.match(/\n/)!==null){
					width += 9999
				}else{
					width += settings.eachWordsWid[print.config.words.indexOf(sentence.substr(0,1))] || settings.eachWordsWid[0]
				}
				sentence = sentence.substr(1)
			}
			json.leftSentence = w
			json.rightSentence = sentence
			return json
		}
	}
}