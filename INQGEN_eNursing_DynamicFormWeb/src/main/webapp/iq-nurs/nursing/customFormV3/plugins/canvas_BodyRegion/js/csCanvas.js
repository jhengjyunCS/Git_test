var d_objCvs = [],  d_csTypeFormatArr = [];
/**
 * canvas元件  by jhengjyun
 * @param  {string} id      [canvas的ElementID]
 * @param  {int} width   [顯示寬 (建議與height相等)]
 * @param  {int} height  [顯示高 (建議與width相等)]
 * @param  {json} data  [基礎參數]
 * {
 * 		@param  {src} data.imgSrc  [背景圖src]
 * 		@param  {[jsonArr]} data.areas   [顯示用 / 可被選取的區域物件]
 *   	@param  {color} data.clickFill    [(可選)點擊後變顏色，可至data.areas個別設定，(default)rgba(155, 155, 254, 0.65)]
 * 		@param  {json} data.templateDiv   [(可選)要連動的div模板]
 * 		{
 * 			@param  {[stringArr]} data.templateDiv.otherOptionsValue   	[(可選)額外選項value，當圖的區域未能滿足選項需求時，可手動新增選項]
 * 			@param  {[stringArr]} data.templateDiv.otherOptionsDesc   	[(可選)額外選項desc，當圖的區域未能滿足選項需求時，可手動新增選項]
 * 			@param  {[stringArr]} data.templateDiv.otherOptionsHasOther [(可選)額外選項是否展出輸入框]
 * 		}
 *   	格式如：
 		"templateDiv": {
				"otherOptionsValue":	["other1","other2","other3"],
				"otherOptionsDesc": 	["大腿肌","三角肌","其他"],
				"otherOptionsHasOther": [true,false,true]
		}
 * 		@param  {int} data.editWidth  [(預設1280)編輯模式寬度，目前鋼筆工具設定1280以外會有問題，單位px]
 * 		@param  {int} data.editHeight [(預設1280)編輯模式高度，目前鋼筆工具設定1280以外會有問題，單位px]
 * }
 * 格式如：
 * [
 {
	        "areaType": "Text",
	        "left": 176.6939547800879,
	        "top": 166.71344810619692,
	        "points": [],
	        "text": "右",
	        "angleValue": 0,
	        "opacity": 1,
	        "orignalFill": "#777777",
	        "stroke": "rgba(0,0,0,0)",
	        "width": 40,
	        "height": 45,
	        "hoverCursor": "default",
	        "type": "rightText",
	        "desc": ""
	    }
 ]
 * @param  {json} options [客製化參數]
 * {
 *   	@param  {boolean} options.mouseupEnable    [(可選)是否開放滑鼠點擊事件，(default)開放/禁止 true|false]
 *   	@param  {string} options.selectMode    [(可選)選取模式，(default)單選/複選 radio|checkbox]
 * 	 	@param  {function} options.onLoad    [(可選)canvas設定前呼叫，順位1]
 * 	 	@param  {function} options.onReady    [(可選)canvas設定完成後呼叫，順位2]
 * 	 	@param  {function} options.complete    [(可選)canvas全部完成後呼叫，順位3]
 * 	 	@param  {function} options.click       [(可選)區域物件被點選 「時」 呼叫]
 * 	 	@param  {function} options.change      [(可選)區域物件被點選 「後」 呼叫]
 *   	@param  {json} options.templateDiv  [(可選)要連動的div模板]
 *   	{
 * 			@param  {eleID} options.templateDiv.id   	[(可選)要被連動的div模板ID，參考index.html，不填則自動產生模板]
 * 			@param  {string} options.templateDiv.displayMode   	[(可選)當id未填，selectMode為radio或checkbox時，橫/直向排列 (horizontal/vertical)]
 * 			@param  {string} options.templateDiv.position   	[(可選)當id未填，預設產生模板於上/右/下/左 (top/right/bottom/left)]
 * 			@param  {boolean} options.templateDiv.isShowDiv   	[(可選)是否顯示連動元件, 預設true (true/false)
 *   	}
 *   	格式如：
			"templateDiv": {
				"id": 					"mycanvas_targetDiv_template",
				"displayMode": 			"horizontal",
				"position": 			"right",
				"isShowDiv":			true
			},
 *
 *   **點擊時調用順序
 *   1. 變顏色(clickFill + selectMode)
 *   2. 觸發click(v, desc, obj)
 *   3. 觸發change(v, desc, obj)
 * }
 * @return {[type]} ele.csCanvas [會將csCanvas物件註冊在canvas節點上]
 * @return {[type]} ele.fabric   [會將fabric物件註冊在canvas節點上]
 *
 * ex: var objCvs = new csCanvas("mycanvas", 1280, 1280, data, {"click":function(){}});
 *
 *****關於操作canvas的工具包請參考   *****控制區*****
 */
function csCanvas(id, width, height, data, options){
	if (csCanvas.isIE5to8()){
		alert("人形圖僅支援IE9以上的版本");
		csCanvas = function(){ return false; };
		return false;
	}
	var that = this;
	var original = this.original={
		//畫布原址寬高比都以1280*1280設定，再由setZoom來改變比例(以width為比例)
		"width" : 1280,
		"height" : 1280,
		"areaTypeArr" : ["Rect", "Polyline", "Text", "Circle"],  //合法的areaType，矩形、多邊形、文字、圓形
		// "canSelectArr" : ["Rect", "Polyline"],  //可被選擇的areaType，矩形、多邊形
		"custom" : {
			"width" : width,
			"height" : height
		},
		"edit" : {
			"width" : data.editWidth || 1280,
			"height" : data.editHeight || 1280
		},
		"onLoad" : (options.onLoad) ? ((typeof options.onLoad === "string") ? csCanvas.evalByReturn(options.onLoad) : options.onLoad) : function(){},
		"onReady" : (options.onReady) ? ((typeof options.onReady === "string") ? csCanvas.evalByReturn(options.onReady) : options.onReady) : function(){},
		"complete" : (options.complete) ? ((typeof options.complete === "string") ? csCanvas.evalByReturn(options.complete) : options.complete) : function(objs){console.log("請new csCanvas(... options{complete:function} 以監聽complete事件，將會return objs");},
		/**
		 * 顏色邏輯
		 * A.原始色(orignalFill) B.滑鼠移入變色(mouseOverFill) C.點擊變色(clickFill)
		 * 優先級:  C > B > A
		 */
		"mouseOverFill" : "#AAECAA" //滑鼠移入時的變色
	};
	//設定是否開放滑鼠點擊事件
	this.mouseupEnable = (options.mouseupEnable===false) ? false : true;
	//設定clickFill 點擊後變色
	this.clickFill = (data.clickFill) ? data.clickFill : "rgba(155, 155, 254, 0.65)";
	//設定selectMode 選取模式
	this.selectMode = (options.selectMode) ? options.selectMode : "radio";
	//設定templateDiv 要連動的div模板
	this.templateDiv = (data.templateDiv) ? data.templateDiv : null;
	if (this.templateDiv){
		var td = this.templateDiv;
		var opTd = options.templateDiv || {}
		td.id 			= (opTd.id) ? opTd.id : null;
		td.displayMode 	= (opTd.displayMode) ? opTd.displayMode : "horizontal";
		td.position 	= (opTd.position) ? opTd.position : "right";
		td.isShowDiv 	= (opTd.isShowDiv===false) ? opTd.isShowDiv : true;
		td.otherOptionsValue 	= (td.otherOptionsValue) ? td.otherOptionsValue : [];
		td.otherOptionsDesc 	= (td.otherOptionsDesc) ? td.otherOptionsDesc : [];
		td.otherOptionsHasOther = (td.otherOptionsHasOther) ? td.otherOptionsHasOther : [];
		this.templateDiv = td;
	}
	//註冊change事件
	if (options.change && typeof(options.change)=="function"){
		this.change = options.change;
	}
	//註冊click事件
	if (options.click && typeof(options.click)=="function"){
		this.click = options.click;
	}
	//初始化
	var e = this.e = document.getElementById(id);
	var cvs = this.canvas = this.cvs = (e.fabric) ? e.fabric : new fabric.Canvas(id);//創建一個canvas畫板
	var e2 = this.e2 = e.nextSibling;
	this.completeCall_count = 0;
	this.e.setAttribute("other-option", "");
	this.e.setAttribute("other-option-desc", "");
	this.e.csCanvas = this;
	this.e.fabric=this.cvs;


	//縮放至原始大小
	this.setZoomOrignal = function(){
		this.cvs.setWidth(original.width);
		this.cvs.setHeight(original.height);
		this.cvs.setZoom(original.width/this.original.width);
	};
	this.setZoomOrignal();
	//縮放至指定大小
	this.setZoomCustom = function(){
		this.cvs.setWidth(original.custom.width);
		this.cvs.setHeight(original.custom.height);
		this.cvs.setZoom(original.custom.width/this.original.width);
	};
	//縮放至編輯模式大小
	this.setZoomEdit = function(){
		this.cvs.setWidth(original.edit.width);
		this.cvs.setHeight(original.edit.height);
		this.cvs.setZoom(original.edit.width/this.original.width);
	};
	//載入刪除icon
	var delIconSrc="", scripts = document.getElementsByTagName("script");
	for (var i=0, len=scripts.length; i<len; ++i){
		var src = scripts[i].getAttribute("src");
		if (src && src.indexOf("csCanvas.js")>-1){
			delIconSrc = src.replace("csCanvas.js", "../img/delete-icon.png");
			break;
		}
	}
	this.delIcon = document.createElement("img");
	this.delIcon.src = delIconSrc;
	this.delIcon.style.display = "none";


	//監聽鍵盤事件
	if (!document.hasCanvasKeyDown){
		document.hasCanvasKeyDown = true;
		document.addEventListener("keydown", function(e) {
			var evtobj = window.event? event : e;
			var eles = document.getElementsByClassName("csCanvas");
			for (var i=0, len=eles.length; i<len; ++i){
				if (!eles[i].id) continue;
				var that = eles[i].csCanvas;
				//非操作模式
				if (!that.isNowMode("normal")){
					//開啟畫筆
					if (evtobj.keyCode == 66 && evtobj.ctrlKey){ //ctrl+b
						that.drawPain.drawStartAndEnd();
						continue;
					}
					//drawPain
					if (that.drawPain.drawingObject.type == "roof") {
						var pain = that.drawPain;
						//移除上一個點
						if (evtobj.keyCode == 90 && evtobj.ctrlKey){ //ctrl+z
							console.log("ctrl+z");
							if (pain.lineCounter>0){
								--pain.lineCounter;
								pain.lines.splice(pain.lineCounter, 1);
								pain.roofPoints.splice(pain.lineCounter, 1);
								pain.canvas.remove(pain.canvas.getObjects("drawPenTempPot"+pain.lineCounter)[0]);
							}
						}
					}else{ //非使用鋼筆、非排序模式
						//復原上一動
						if (evtobj.keyCode == 90 && evtobj.ctrlKey){ //ctrl+z
							console.log("ctrl+z");
							if (that.isNowMode("sort")){
								console.log("排序模式尚不支援 復原上一動");
							}else{
								that.log.recover();
							}
						}
						//重做下一動
						if (evtobj.keyCode == 89 && evtobj.ctrlKey){ //ctrl+y
							console.log("ctrl+y");
							if (that.isNowMode("sort")){
								console.log("排序模式尚不支援 重做下一動");
							}else{
								that.log.redo();
							}
						}
					}
				}
				//切換操作模式
				if (evtobj.keyCode == 66 && evtobj.altKey){ //alt+b
					that.switchMode();
					continue;
				}
			}
		});
	}
	//設定點擊事件
	this.cvs.off('mouse:up:before');
	this.cvs.on('mouse:up:before', function (e) {
		var active = e.target;
		if (active) {
			console.log(active);
			if (active.visible===false){
				return;
			}
			if (active.type=="showType"){  //點中type，重新命名
				cvs.setActiveObject(active.target);
				that.renameAreaObj();
				that.log.add();
			}else if (active.type=="showDesc"){  //點中desc, 重新賦值
				cvs.setActiveObject(active.target);
				that.setDescAreaObj();
				that.log.add();
			}else if (active.type=="showText"){  //點中text, 重新賦值
				cvs.setActiveObject(active.target);
				that.setTextAreaObj();
				that.log.add();
			}else if (active.type=="showFill"){  //點中fill, 重新賦值
				cvs.setActiveObject(active.target);
				that.setFillAreaObj();
				that.log.add();
			}else if (active.type=="delIcon"){  //點中delIcon, 刪除
				cvs.setActiveObject(active.target);
				cvs.remove(cvs.getActiveObject());
				that.editAllAreaObjMode(that.isNowMode("edit"));
				that.log.add();
			}else if (active.areaType=="mouseMoveShowDesc"){ //點中object的desc
				cvs.fire('mouse:up:before', {target: active.target}); //觸發object的點中效果
			}else if (active.type=="text-other-option"){
				return;
			}else if (active.areaType=="Text"){
				return;
			}else if (active.canSelected!==true){//"不"可被選擇的areaType
				return;
			}else{
				//操作模式才要觸發事件
				if (that.isNowMode("normal")){
					//禁止點擊
					if (that.mouseupEnable===false){
						return;
					}
					//變顏色(clickFill + selectMode)
					that.doClickFill(active);
					//同步勾選連動元件
					if (that.targetDiv){
						that.doSyncBeanSelected();
					}
					//觸發click事件
					if (typeof(active.click)=="function"){
						active.click(active.type, active.desc, active);
					}
					//觸發change事件
					if (typeof(that.change)=="function"){
						that.change(active.type, active.desc, active);
					}
					//觸發mouse:over事件
					cvs.fire('mouse:over', {target: active});
				}
			}
		}
	});
	//設定 mouseOver 事件
	this.cvs.off('mouse:over');
	this.cvs.on('mouse:over', function (e) {
		var active = e.target;
		if (active) {
			console.log(active);
			if (active.visible===false){
				return;
			}
			if (active.type=="showType"){
				return;
			}else if (active.type=="showDesc"){
				return;
			}else if (active.type=="showText"){
				return;
			}else if (active.type=="showFill"){
				return;
			}else if (active.type=="delIcon"){
				return;
			}else if (active.areaType=="Text"){
				return;
			}else if (active.type=="text-other-option"){
				return;
			}else if (active.canSelected!==true){//"不"可被選擇的areaType
				return;
			}else{
				//滑鼠移入顏色變更
				active.set("fill", original.mouseOverFill);
				//顯示Desc
				var center = active.getCenterPoint();
				var desc = (that.isNowMode("normal")) ? active.desc : active.desc+"("+active.type+")";
				var t2 = new fabric.Text(desc, {
			        "target": active,
			        "areaType": "mouseMoveShowDesc",
			        "fontFamily": 'Calibri',
			        "fontSize": 60,
			        "textAlign": 'left',
			        "left": center.x,
			        "top": center.y,
			        "originX": "center",
			        "originY": "center",
					"hoverCursor": "pointer",
			        "type": "mouseMoveShowDesc-"+active.type
			    });
				t2.hasControls = false; //禁止縮放及轉動
				t2.lockMovementX=true; //不可水平拖動
				t2.lockMovementY=true; //不可垂直拖動
				cvs.add(t2);
				t2.sendToBack(); //置底
				//觸發 mouseOver 事件
				if (typeof(active.mouseOver)=="function"){
					active.mouseOver(active);
				}
			}
		}
	});
	//設定 mouseOut 事件
	this.cvs.off('mouse:out');
	this.cvs.on('mouse:out', function (e) {
		var active = e.target;
		if (active) {
			// console.log(active);
			if (active.visible===false){
				return;
			}
			if (active.type=="showType"){
				return;
			}else if (active.type=="showDesc"){
				return;
			}else if (active.type=="showText"){
				return;
			}else if (active.type=="showFill"){
				return;
			}else if (active.type=="delIcon"){
				return;
			}else if (active.areaType=="Text"){
				return;
			}else if (active.type=="text-other-option"){
				return;
			}else if (active.canSelected!==true){//"不"可被選擇的areaType
				return;
			}else{
				//滑鼠移開顏色復原
				active.set("fill", (active.clickFill) ? active.clickFill : active.orignalFill);//顏色復原
				//移除Desc
				var objs = cvs.getObjects("mouseMoveShowDesc-"+active.type);
				for (var i=0, len=objs.length; i<len; ++i){
					cvs.remove(objs[i]);
				}
				//觸發 mouseOut 事件
				if (typeof(active.mouseOut)=="function"){
					active.mouseOut(active);
				}
			}
		}
	});
	//設定物件拖動結束事件
	this.cvs.off('object:moved');
	this.cvs.on('object:moved', function (e) {
		var active = e.target;
		if (active.visible===false){
			return;
		}
		if (active) {
			if (that.isNowMode("edit")){
				that.editAllAreaObjMode(true);
			}
		}
		console.log("moved")
		that.log.add();
	});
	//設定變形結束事件
	this.cvs.off('object:modified');
	this.cvs.on('object:modified', function (e) {
		that.log.add();
	});


	//新增區域物件(矩形)
	this.addTempAreaRect = function(canSelected){
		cvs.add(new fabric.Rect({
			"areaType": "Rect",
			"left": 20,
			"top": 20,
			"orignalFill": '#E6E6E6',
			"fill": '#E6E6E6',
			"stroke": 'rgba(0,0,0,0)',
			"opacity": 0.5,
			"width": 50,
			"height": 50,
			"hoverCursor": (this.isNowMode("normal")) ? (canSelected===false) ? "default" : "pointer" : "all-scroll",
			"type": this.UUID(10),
			"desc": "",
			"canSelected": (canSelected===false) ? false : true,
			"click": "" //type=function
		}));
		this.log.add();
	};

	//新增區域物件(圓形)
	this.addTempAreaCircle = function(canSelected){
		cvs.add(new fabric.Circle({
			"areaType": "Circle",
			"left": 20,
			"top": 20,
			"radius": 80,
			"orignalFill": '#E6E6E6',
			"fill": '#E6E6E6',
			"stroke": 'rgba(0,0,0,0)',
			"opacity": 0.5,
			"hoverCursor": (this.isNowMode("normal")) ? (canSelected===false) ? "default" : "pointer" : "all-scroll",
			"type": this.UUID(10),
			"desc": "",
			"canSelected": (canSelected===false) ? false : true,
			"click": "" //type=function
		}));
		this.log.add();
	};
	//新增文字
	this.addTextObj = function(){
		var t = new fabric.Text("文字", {
			"areaType": "Text",
	        "fontFamily": 'Calibri',
	        "fontSize": 30,
	        "textAlign": 'left',
			"left": 20,
			"top": 20,
	        "type": this.UUID(10),
			"orignalFill": 'black',
	        "fill": "black",
			"canSelected": false
	    });
		cvs.add(t);
		this.log.add();
	};
	//建立圖形(矩形)
	this.createAreaRect = function(obj){
		var o = new fabric.Rect(obj);
		o.rotate((o.angleValue) ? o.angleValue : 0); //旋轉
		o.hasControls = !this.isNowMode("normal"); //禁止縮放及轉動
		o.lockMovementX = this.isNowMode("normal"); //不可水平拖動
		o.lockMovementY = this.isNowMode("normal"); //不可垂直拖動
		o.hoverCursor = (this.isNowMode("normal")) ? (o.canSelected && this.mouseupEnable) ? "pointer" : "default" : "all-scroll";
		this.canvas.add(o);
	};
	//建立圖形(圓形)
	this.createAreaCircle = function(obj){
		var o = new fabric.Circle(obj);
		o.rotate((o.angleValue) ? o.angleValue : 0); //旋轉
		o.hasControls = !this.isNowMode("normal"); //禁止縮放及轉動
		o.lockMovementX = this.isNowMode("normal"); //不可水平拖動
		o.lockMovementY = this.isNowMode("normal"); //不可垂直拖動
		o.hoverCursor = (this.isNowMode("normal")) ? (o.canSelected && this.mouseupEnable) ? "pointer" : "default" : "all-scroll";
		this.canvas.add(o);
	};
	//建立圖形(多邊形)
	this.createAreaPolyline = function(obj){
        var o = new fabric.Polyline(obj.points, obj);
		o.rotate((o.angleValue) ? o.angleValue : 0); //旋轉
		o.hasControls = !this.isNowMode("normal"); //禁止縮放及轉動
		o.lockMovementX = this.isNowMode("normal"); //不可水平拖動
		o.lockMovementY = this.isNowMode("normal"); //不可垂直拖動
		o.hoverCursor = (this.isNowMode("normal")) ? (o.canSelected && this.mouseupEnable) ? "pointer" : "default" : "all-scroll";
		this.canvas.add(o);
	};
	//建立圖形(文字)
	this.createAreaText = function(obj){
		var o = new fabric.Text(obj.desc, obj);
		o.rotate((o.angleValue) ? o.angleValue : 0); //旋轉
		o.hasControls = !this.isNowMode("normal"); //禁止縮放及轉動
		o.lockMovementX = this.isNowMode("normal"); //不可水平拖動
		o.lockMovementY = this.isNowMode("normal"); //不可垂直拖動
		o.hoverCursor = (this.isNowMode("normal")) ? (o.canSelected && this.mouseupEnable) ? "pointer" : "default" : "all-scroll";
		this.canvas.add(o);
	};
	//建立區域物件
	this.createAreaObj = function(objs){
		//建立區域物件
		for (var i=0, len=objs.length; i<len; ++i){
			var obj = objs[i];
			var areaType = obj.areaType;
			if (!areaType){
				console.error("areaType不得為空", obj);
				continue;
			}
			if (original.areaTypeArr.indexOf(areaType)==-1){
				if (areaType!=="mouseMoveShowDesc"){
					console.error("出現不合法的areaType", obj);
				}
				continue;
			}
			//沒有個別設定onclick事件的話
			if (typeof(obj.click)!="function"){
				obj.click = this.click;
			}
			this["createArea"+areaType.replace("mouseMoveShowDesc", "Text")](obj);
		}
	};


	//設定顏色
	this.setShowColor = function(objs){
		for (var i=0, len=objs.length; i<len; ++i){
			var obj = objs[i];
			obj.fill =(obj.clickFill) ? obj.clickFill : (obj.orignalFill) ? obj.orignalFill : "#E6E6E6";
			obj.stroke = (obj.stroke) ? obj.stroke : "rgba(0,0,0,0)";
		}
		return objs;
	};
	//refresh
	this.refresh = function(allAreaObj){
		var arr = allAreaObj || this.getAllAreaObj();
		//設定顏色
		arr = this.setShowColor(arr);
		//清空畫布
		this.clearAreaObj();
		//建立區域物件
		this.createAreaObj(arr);
		//建立連動元件
		this.doCreateAllBean();
	};
	//清空區域物件
	this.clearAreaObj = function(){
		var objs = this.cvs.getObjects();
		for (i=0, len=objs.length; i<len; ++i){
			var obj = objs[i];
			this.cvs.remove(obj);
		}
	};
	//取得所有區域物件資訊
	this.getAllAreaObj = function(){
		this.setZoomOrignal(); //縮放至原始大小
		var canvas = this.canvas;
		var objs = canvas.getObjects();
		var arr = [];
		for (var i=0, len=objs.length; i<len; ++i){
			var obj = objs[i];
			if (this.original.areaTypeArr.indexOf(obj.areaType)==-1){
				continue;
			}
			//排除額外選項的文字及方塊
			if (obj.type=="text-other-option"){
				continue;
			}
			var angle = obj.angle;
			obj.rotate(0);
			// canvas.renderAll();
			var json = {
				"areaType": obj.areaType,
				"left": obj.left,
				"top": obj.top,
				"radius": (obj.radius) ? obj.radius : 1, //圓的半徑
				"scaleY": (obj.scaleY) ? obj.scaleY : 1, //圓的高
				"scaleX": (obj.scaleX) ? obj.scaleX : 1, //圓的寬
				"points": (obj.points) ? obj.points : [],
				"text": (obj.text) ? obj.text : "",
				"angleValue": (angle) ? angle : 0,
	  			"opacity": (obj.opacity) ? obj.opacity : 0.5,
				"orignalFill": obj.orignalFill,
				"stroke": obj.orignalStroke ? obj.orignalStroke : obj.stroke ? obj.stroke : "rgba(0,0,0,0)",
				"width": obj.width,
				"height": obj.height,
				// "width": parseInt(obj.getScaledWidth(), 10)-1,
				// "height": parseInt(obj.getScaledHeight(), 10)-1,
				// "hoverCursor": (obj.hoverCursor) ? obj.hoverCursor : "pointer",
				"type": (obj.type) ? obj.type : "",
				"desc": (obj.desc) ? obj.desc : "",
				"canSelected": (obj.canSelected==false) ? false : true,
				"click": (obj.click) ? obj.click : "" //type=function
			};
			arr.push(json);
			obj.rotate(angle);
			// canvas.renderAll();
		}
		this.setZoomCustom(); //縮放至指定大小
		return arr;
	};
	//UUID
    this.UUID = function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };


	//mode = normal / edit / changeShap / sort (操作/編輯/變形/排序)
	this.modeArray = ["normal", "edit", "changeShap", "sort"];
	this.nowMode = (e.csCanvas && e.csCanvas.nowMode) ? e.csCanvas.nowMode : "normal";
	/**
	 * 當前模式 操作/編輯/變形/排序
	 * @param mode [normal / edit / changeShap / sort (操作/編輯/變形/排序)]
	 * @returns {boolean}
	 */
	this.isNowMode = function(mode){
		return this.nowMode==mode;
	};
	/**
	 * switch 操作/編輯/變形/排序 模式
	 * @param mode [normal / edit / changeShap / sort (操作/編輯/變形/排序)]
	 */
	this.switchMode = function(mode){
		//如果原本是排序模式，要觸發排序完成事件
		if (this.nowMode=="sort"){
			this.sortMode.done();
		}
		//有代入mode就以代入值為主，否則指定下一個模式
		mode = (mode) ? mode : this.modeArray[this.modeArray.indexOf(this.nowMode)+1];
		mode = (mode) ? mode : this.modeArray[0];
		this.nowMode = mode;
		//切換模式
		if (mode=="normal"){ //操作模式
			this.editAllAreaObjMode(false);
			this.setZoomCustom();
		}else if (mode=="edit"){ //編輯模式
			this.editAllAreaObjMode(true);
			this.setZoomEdit();
		}else if (mode=="changeShap"){ //變形模式
			this.changeShapMode.run();
			this.setZoomEdit();
		}else if (mode=="sort"){ //排序模式
			this.sortMode.run();
			this.setZoomEdit();
		}
		if (csCanvas.switchModeComplete){
			csCanvas.switchModeComplete();
		}
	};


	//操作/編輯 模式
	this.editAllAreaObjMode = function(isEdit){
		var i, len;
		var canvas = this.canvas;
		var arr = this.getAllAreaObj();
		//設定顏色
		arr = this.setShowColor(arr);
		console.log(arr);
		//清空畫布
		this.clearAreaObj();
		//繪圖
		for (i=0, len=arr.length; i<len; ++i){
			//不顯示資訊
			if (isEdit==false){
				this.createAreaObj([arr[i]]);
			}
			//文字物件，點擊改變文字及顏色
			else if (arr[i].areaType=="Text"){
				//文字物件
				this.createAreaObj([arr[i]]);
				var c = canvas.getObjects(arr[i].type)[0];
				//desc資訊
				var t3 = new fabric.Text("text:"+arr[i].text, {
			        "target": c,
			        "fontFamily": 'Calibri',
			        "fontSize": 30,
			        "textAlign": 'left',
			        "left": arr[i].left,
			        "top": arr[i].top+10,
					"hoverCursor": "pointer",
			        "type": "showText"
			    });
				t3.hasControls = false; //禁止縮放及轉動
				t3.lockMovementX=true; //不可水平拖動
				t3.lockMovementY=true; //不可垂直拖動
				canvas.add(t3);
				//desc資訊
				var t4 = new fabric.Text("fill:"+arr[i].fill, {
			        "target": c,
			        "fontFamily": 'Calibri',
			        "fontSize": 30,
			        "textAlign": 'left',
			        "left": arr[i].left,
			        "top": arr[i].top+40,
					"hoverCursor": "pointer",
			        "type": "showFill"
			    });
				t4.hasControls = false; //禁止縮放及轉動
				t4.lockMovementX=true; //不可水平拖動
				t4.lockMovementY=true; //不可垂直拖動
				canvas.add(t4);
				//設定刪除事件
				var d=new fabric.Image(this.delIcon, {
			        "target": c,
					"left": arr[i].left+arr[i].width-15,
					"top": arr[i].top-15,
					"hoverCursor": "pointer",
					"type": "delIcon"
				});
				d.hasControls = false; //禁止縮放及轉動
				d.lockMovementX=true; //不可水平拖動
				d.lockMovementY=true; //不可垂直拖動
				canvas.add(d);
			}
			//顯示資訊
			else{
				//區域物件
				this.createAreaObj([arr[i]]);
				var c = canvas.getObjects(arr[i].type)[0];
				//type資訊
				var t = new fabric.Text("type:"+arr[i].type, {
			        "target": c,
			        "fontFamily": 'Calibri',
			        "fontSize": 30,
			        "textAlign": 'left',
			        "left": arr[i].left,
			        "top": arr[i].top+10,
					"hoverCursor": "pointer",
			        "type": "showType"
			    });
				t.hasControls = false; //禁止縮放及轉動
				t.lockMovementX=true; //不可水平拖動
				t.lockMovementY=true; //不可垂直拖動
				canvas.add(t);
				//desc資訊
				var t2 = new fabric.Text("desc:"+arr[i].desc, {
			        "target": c,
			        "fontFamily": 'Calibri',
			        "fontSize": 30,
			        "textAlign": 'left',
			        "left": arr[i].left,
			        "top": arr[i].top+40,
					"hoverCursor": "pointer",
			        "type": "showDesc"
			    });
				t2.hasControls = false; //禁止縮放及轉動
				t2.lockMovementX=true; //不可水平拖動
				t2.lockMovementY=true; //不可垂直拖動
				canvas.add(t2);
				//設定刪除事件
				var d=new fabric.Image(this.delIcon, {
			        "target": c,
					"left": arr[i].left+arr[i].width-15,
					"top": arr[i].top-15,
					"hoverCursor": "pointer",
					"type": "delIcon"
				});
				d.hasControls = false; //禁止縮放及轉動
				d.lockMovementX=true; //不可水平拖動
				d.lockMovementY=true; //不可垂直拖動
				canvas.add(d);
			}
		}
		if (isEdit){
			this.setZoomOrignal();
		}
		//建立連動元件
		this.doCreateAllBean();
	};
	//變形 模式
	this.changeShapMode = new changeShapMode();
	function changeShapMode(){
		this.run = function() {
			that.refresh();
		    // clone what are you copying since you
		    // may want copy and paste on different moment.
		    // and you do not want the changes happened
		    // later to reflect on the copy.
		    var polys = that.canvas.getObjects();
		    for (var i=0, len=polys.length; i<len; ++i){
		    	var poly = polys[i];
		    	if (poly.areaType!="Polyline"){
		    		continue;
		    	}
			    poly.edit = !poly.edit;
			    if (poly.edit) {
			        var lastControl = poly.points.length - 1;
			        poly.cornerStyle = 'circle';
			        poly.cornerSize = 10;
			        poly.cornerColor = 'rgba(0,0,255,0.5)';
			        poly.controls = poly.points.reduce(function(acc, point, index) {
			            acc[poly.type + "_" + index] = new fabric.Control({
			                positionHandler: polygonPositionHandler,
			                actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
			                actionName: 'modifyPolygon',
			                pointIndex: index
			            });
			            return acc;
			        }, {});
			    } else {
			        poly.cornerColor = 'blue';
			        poly.cornerStyle = 'rect';
			        poly.controls = fabric.Object.prototype.controls;
			    }
			    poly.hasBorders = !poly.edit;
			    // that.canvas.requestRenderAll();
		    }
		};

		// define a function that can locate the controls.
		// this function will be used both for drawing and for interaction.
		function polygonPositionHandler(dim, finalMatrix, fabricObject) {
		    var x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
		        y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
		    return fabric.util.transformPoint({ x: x, y: y },
		        fabric.util.multiplyTransformMatrices(
		            fabricObject.canvas.viewportTransform,
		            fabricObject.calcTransformMatrix()
		        )
		    );
		}

		// define a function that will define what the control does
		// this function will be called on every mouse move after a control has been
		// clicked and is being dragged.
		// The function receive as argument the mouse event, the current trasnform object
		// and the current position in canvas coordinate
		// transform.target is a reference to the current object being transformed,
		function actionHandler(eventData, transform, x, y) {
		    var polygon = transform.target,
		        currentControl = polygon.controls[polygon.__corner],
		        mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
		        polygonBaseSize = polygon._getNonTransformedDimensions(),
		        size = polygon._getTransformedDimensions(0, 0),
		        finalPointPosition = {
		            x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
		            y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
		        };
		    polygon.points[currentControl.pointIndex] = finalPointPosition;
		    return true;
		}

		// define a function that can keep the polygon in the same position when we change its
		// width/height/top/left.
		function anchorWrapper(anchorIndex, fn) {
		    return function(eventData, transform, x, y) {
		        var fabricObject = transform.target,
		            absolutePoint = fabric.util.transformPoint({
		                x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
		                y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y)
		            }, fabricObject.calcTransformMatrix()),
		            actionPerformed = fn(eventData, transform, x, y),
		            newDim = fabricObject._setPositionDimensions({}),
		            polygonBaseSize = fabricObject._getNonTransformedDimensions(),
		            newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
		            newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
		        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
		        return actionPerformed;
		    };
		}
	}
	//排序 模式
	this.sortMode = new sortMode();
    this.sortMode.pThat = this;
	function sortMode(){
		var that = this;
	    var canvas = this.canvas = cvs;
		this.objs = null;
		this.sortObjs = [];
		this.isSortTypes = [];
		this.isSortIndexs = [];
		this.isStart = false;
		this.run = function(){
			//reset變數
			this.objs = null;
			this.sortObjs = [];
			this.isSortTypes = [];
			this.isSortIndexs = [];
			this.isStart = false; //防止switchMode自動執行done事件
			//初始化
			this.pThat.switchMode("normal"); //操作模式就不會有點擊選中效果
			this.pThat.nowMode = "sort"; //改回sort(排序)模式
			this.isStart = true;
			//取得objs
			this.objs = this.pThat.canvas.getObjects();
			//寫上目前的順序
			var i2=0;
			for (var i=0, len=this.objs.length; i<len; ++i){
				var obj = this.objs[i];
				//只可以排序可被選擇的obj
				if (obj.canSelected!==true){
					continue;
				}
				var t1 = new fabric.Text(++i2+"", {
			        "fontFamily": 'Calibri',
			        "fontSize": 30,
			        "textAlign": 'left',
			        "left": obj.left,
			        "top": obj.top+10,
					"hoverCursor": "default",
			        "type": "showSort."+obj.type,
			        "fill": "#22FF22"
			    });
				t1.hasControls = false; //禁止縮放及轉動
				t1.lockMovementX=true; //不可水平拖動
				t1.lockMovementY=true; //不可垂直拖動
				canvas.add(t1);
			}
		};
		//排序設定完成
		this.done = function(){
			if (this.isStart===false){
				return;
			}
			var i, len;
			//設定新的排序
	    	this.pThat.clearAreaObj(); //清空畫布
	    	//有排序的內容修先畫上去
	    	for (i=0, len=this.sortObjs.length; i<len; ++i){
	    		this.pThat.createAreaObj([this.sortObjs[i]]);
	    	}
	    	//再畫上沒有排序的內容
	    	for (i=0, len=this.objs.length; i<len; ++i){
	    		var obj = this.objs[i];
	    		if (this.isSortIndexs.indexOf(i)===-1){
	    			this.pThat.createAreaObj([this.objs[i]]);
	    		}
	    	}
	    	// this.pThat.cvs.renderAll();
			//reset變數
			this.objs = null;
			this.sortObjs = [];
			this.isSortTypes = [];
			this.isSortIndexs = [];
			this.isStart = false;
			//新增log
			this.pThat.log.add();
			//建立連動元件
			this.pThat.doCreateAllBean();
		};

	    canvas.on('mouse:up', function(e) {
	        if (that.pThat.nowMode !== "sort") {
	        	return;
	        }
	        if (that.isStart === false) {
	        	return;
	        }
			var active = e.target;
			//不是obj直接跳過
			if (!active) {
				return;
			}
			//只可以排序可被選擇的obj
			if (active.canSelected!==true){
				return;
			}
			//排除已排序的obj
			if(that.isSortTypes.indexOf(active.type)>-1){
				return;
			}
			//開始排序
			//找到index
			var index = -1;
			var obj;
			for (var i=0, len=that.objs.length; i<len; ++i){
				obj = that.objs[i];
				if (obj.type == active.type){
					index = i;
					len = -1;
				}
			}
			if (index===-1){
				console.error("排序發生錯誤！找不到對應的object.type！");
				return;
			}
			//排序
			that.sortObjs.push(obj);
			that.isSortTypes.push(obj.type);
			that.isSortIndexs.push(index);
			//清除原排序
			canvas.remove(canvas.getObjects("showSort."+obj.type)[0]);
			//寫上排序文字
			var t1 = new fabric.Text(that.sortObjs.length+"", {
		        "fontFamily": 'Calibri',
		        "fontSize": 30,
		        "textAlign": 'left',
		        "left": obj.left,
		        "top": obj.top+10,
				"hoverCursor": "default",
		        "type": "newSort."+obj.type,
		        "fill": "#2222FF"
		    });
			t1.hasControls = false; //禁止縮放及轉動
			t1.lockMovementX=true; //不可水平拖動
			t1.lockMovementY=true; //不可垂直拖動
			canvas.add(t1);
			canvas.setActiveObject(t1);
	    });
	}


	//為區域物件命名
	this.renameAreaObj = function(){
		var active = this.canvas.getActiveObject();
		if (!active){
			alert("請選擇區域物件");
			return;
		}
		var text = window.prompt("為區域物件命名", active.get("type"));
		if (text){
			//檢查type是否重複
			if (this.getObj(text)){
				alert("type不得重複")
				return false;
			}
			active.set("type", text);
		}
		if (this.isNowMode("edit")){
			this.editAllAreaObjMode(true);
		}
	};
	//為區域物件賦值
	this.setDescAreaObj = function(){
		var active = this.canvas.getActiveObject();
		if (!active){
			alert("請選擇區域物件");
			return;
		}
		var text = window.prompt("為區域物件賦值", active.get("desc"));
		if (text){
			active.set("desc", text);
		}
		if (this.isNowMode("edit")){
			this.editAllAreaObjMode(true);
		}
	};
	//為文字物件賦值
	this.setTextAreaObj = function(){
		var active = this.canvas.getActiveObject();
		if (!active){
			alert("請選擇區域物件");
			return;
		}
		var text = window.prompt("為區域物件賦值", active.get("text"));
		if (text){
			active.set("text", text);
		}
		if (this.isNowMode("edit")){
			this.editAllAreaObjMode(true);
		}
	};
	//為區域物件換顏色
	this.setFillAreaObj = function(){
		var active = this.canvas.getActiveObject();
		if (!active){
			alert("請選擇區域物件");
			return;
		}
		var fill = window.prompt("為區域物件換顏色", active.get("fill"));
		if (fill){
			active.set("fill", fill);
			active.set("orignalFill", fill);
		}
		if (this.isNowMode("edit")){
			this.editAllAreaObjMode(true);
		}
	};


	//鋼筆
	this.drawPain = new drawPain();
    this.drawPain.pThat = that;
	function drawPain(){
		var that = this;
	    var canvas = this.canvas = cvs;
	    this.roof = null;
	    this.roofPoints = [];
	    this.lines = [];
	    this.lineCounter = 0;
	    this.drawingObject = {
		    "type" : "",
		    "background" : "",
		    "border" : ""
	    };
	    this.canSelected = true; //true=區域物件, false=底圖物件
	    this.x = 0;
	    this.y = 0;

	    function Point(x, y) {
	        this.x = x;
	        this.y = y;
	    }

	    this.drawStartAndEnd = function(canSelected){
	        if (this.drawingObject.type == "roof") {
	            this.drawingObject.type = "";
	            this.lines.forEach(function(value, index, ar) {
	                canvas.remove(value);
	            });
	            //canvas.remove(lines[lineCounter - 1]);
	            this.roof = makeRoof(this.roofPoints);
	            this.canvas.add(this.roof);
	            // this.canvas.renderAll();
		        //clear arrays
		        this.roofPoints = [];
		        this.lines = [];
		        this.lineCounter = 0;
		        //重整畫布
		        this.pThat.switchMode(this.pThat.nowMode);
	        } else {
	            this.drawingObject.type = "roof"; // roof type
				this.canSelected = (canSelected===false) ? canSelected : this.canSelected;
	        }
	    };

	    fabric.util.addListener(window, 'dblclick', function() {
	        if (that.drawingObject.type != "roof"){
	        	return;
	        }
	        that.drawingObject.type = "";
	        that.lines.forEach(function(value, index, ar) {
	            canvas.remove(value);
	        });
	        that.roofPoints.splice(that.roofPoints.length-1, 1); //最後一個點會重複兩個，拿掉其中一個
	        --that.lineCounter;
	        //canvas.remove(lines[lineCounter - 1]);
	        that.roof = makeRoof(that.roofPoints);
	        canvas.add(that.roof);
	        // canvas.renderAll();

	        //clear arrays
	        that.roofPoints = [];
	        that.lines = [];
	        that.lineCounter = 0;
	        //重整畫布
	        that.pThat.switchMode(that.pThat.nowMode);
	        //新增log
			that.pThat.log.add();
	    });

	    canvas.on('mouse:down', function(options) {
	        if (that.drawingObject.type == "roof") {
	            canvas.selection = false;
	            setStartingPoint(options); // set x,y
	            that.roofPoints.push(new Point(that.x, that.y));
	            var points = [that.x, that.y, that.x, that.y];
	            that.lines.push(new fabric.Line(points, {
	                "strokeWidth": 3,
	                "selectable": false,
					"stroke": 'red',
	                "type": 'drawPenTempPot'+that.lineCounter
	            }).set({"OriginX":that.x, "OriginY":that.y}));
	            canvas.add(that.lines[that.lineCounter]);
	            that.lineCounter++;
	            canvas.on('mouse:up', function(options) {
	                canvas.selection = true;
	            });
	        }
	    });

	    canvas.on('mouse:move', function(options) {
	        if (that.lines[0] !== null && that.lines[0] !== undefined && that.drawingObject.type == "roof") {
	            setStartingPoint(options);
	            that.lines[that.lineCounter - 1].set({
	                "x2": that.x,
	                "y2": that.y
	            });
	            canvas.renderAll();
	        }
	    });

	    function setStartingPoint(options) {
    		var offset = e2.getBoundingClientRect();
	        that.x = options.pointer.x;
	        that.y = options.pointer.y;
	    }

	    function makeRoof(roofPoints) {
	        var left = findLeftPaddingForRoof(roofPoints);
	        var top = findTopPaddingForRoof(roofPoints);
	        roofPoints.push(new Point(roofPoints[0].x, roofPoints[0].y));
	        var roof = new fabric.Polyline(roofPoints, {
	            "areaType": "Polyline",
	            "orignalFill": '#E6E6E6',
	            "fill": '#E6E6E6',
	            "opacity": 0.5,
				"canSelected": that.canSelected,
	            "type": that.pThat.UUID(10)
	            // stroke: '#58c'
	        });
	        roof.set({

	            "left": left,
	            "top": top

	        });


	        return roof;
	    }

	    function findTopPaddingForRoof(roofPoints) {
	        var result = 999999;
	        for (var f = 0; f < that.lineCounter; f++) {
	            if (roofPoints[f].y < result) {
	                result = roofPoints[f].y;
	            }
	        }
	        return Math.abs(result);
	    }

	    function findLeftPaddingForRoof(roofPoints) {
	        var result = 999999;
	        for (var i = 0; i < that.lineCounter; i++) {
	            if (roofPoints[i].x < result) {
	                result = roofPoints[i].x;
	            }
	        }
	        return Math.abs(result);
	    }
	}

	//===========log start===========
	this.log = new log();
	function log(){
		this.idx = 0;
		this.arr = [];
		//初始化log
		this.reset = function(){
			//清除log
			this.idx = 0;
			this.arr = [];
			this.arr.push(JSON.stringify(that.getAllAreaObj()));
		};
		//新增log
		this.add = function(){
			var newLog = JSON.stringify(that.getAllAreaObj());
			//重整畫布
			that.switchMode(that.nowMode);
			if (!newLog){
				console.error("新增log->無法取得區域物件");
				return;
			}
			if (newLog == this.arr[this.idx]){
				console.log("新增log->區域物件沒有變化");
			}else{
				++this.idx;
				console.log("新增log->index="+this.idx);
				this.arr[this.idx] = newLog;
			}
			//清空後面的log
			this.arr.splice(this.idx+1);
		};
		/**
		 * [確認是否有上一動]
		 * @return {boolean}   true=還有上一動, false=已經到頭了
		 */
		this.hasRecover = function(){
			return this.idx!==0;
		};
		/**
		 * [復原上一動]
		 * @return {boolean}   true=還有上一動, false=已經到頭了
		 */
		this.recover = function(){
			if (this.idx==0){
				console.log("復原上一動->已經到頭了");
				return false;
			}
			--this.idx;
			console.log("復原上一動->index="+this.idx);
			that.refresh(JSON.parse(this.arr[this.idx]));
			//重整畫布
			that.switchMode(that.nowMode);
			return this.idx!==0;
		};
		/**
		 * [重做下一動]
		 * @return {boolean}   true=還有下一動, false=已經到底了
		 */
		this.redo = function(){
			if (this.arr.length-1 === this.idx){
				console.log("重做下一動->已經到底了");
				return false;
			}
			++this.idx;
			console.log("重做下一動->index="+this.idx);
			that.refresh(JSON.parse(this.arr[this.idx]));
			//重整畫布
			that.switchMode(that.nowMode);
			return this.arr.length-1 > this.idx;
		};
		/**
		 * [確認是否有下一動]
		 * @return {boolean}   true=還有下一動, false=已經到底了
		 */
		this.hasRedo = function(){
			return this.arr.length-1 > this.idx;
		};
	};
	//===========log end===========


    //===========控制區 start==========

    //取得object
    this.getObj = function(type){
    	var obj = this.cvs.getObjects(type)[0];
    	return obj;
    };
    //取得所有object
    this.getObjs = function(){
    	return this.cvs.getObjects();
    };
    //取得目前被選中的objcet (clickFill != undefined)
    this.getActive = function(){
    	var actives = [];
    	var objs = this.getObjs();
    	for (var i=0, len=objs.length; i<len; ++i){
    		if (objs[i].clickFill){
    			actives.push(objs[i]);
    		}
    	}
    	return actives;
    };
    //取得清單 {typeList, descList, objList}
    this.getList = function(){
    	var json = {"typeList":[], "descList":[], "objList":[]};
    	var objs = this.getObjs();
    	for (var i=0, len=objs.length; i<len; ++i){
			if (objs[i].canSelected!==true){ //不可被選擇的areaType
    			continue;
    		}
    		json.typeList.push(objs[i].type);
    		json.descList.push(objs[i].desc);
    		json.objList.push(objs[i]);
    	}
    	return json;
    };
    //取得value (by desc / obj / null)
    this.getValue = function(p){
    	var objs, i, len;
    	if (!p){ //沒給值代表找到當前被選中的obj
    		objs = this.getActive();
    		var types = [];
    		for (i=0, len=objs.length; i<len; ++i){
    			types.push(objs[i].type);
    		}
    		return types.join(",");
    	}else if (typeof(p) == "object"){
    		return p.type;
    	}else{
	    	objs = this.getObjs();
	    	for (i=0, len=objs.length; i<len; ++i){
	    		if (objs[i].desc==p){
	    			return objs[i].type;
	    		}
	    	}
	    	return null;
    	}
    };
    //取得desc (by type / obj / null)
    this.getDesc = function(p){
    	if (!p){ //沒給值代表找到當前被選中的obj
    		objs = this.getActive();
    		var types = [];
    		for (i=0, len=objs.length; i<len; ++i){
    			types.push(objs[i].desc);
    		}
    		return types.join(",");
    	}else if (typeof(p) == "object"){
    		return p.desc;
    	}else{
    		var obj = this.getObj(p);
			if (obj){
		    	return obj.desc;
		    }else{
		    	return obj;
		    }
	    }
    };
    //取得other額外選項
    this.getOtherValue = function(){
    	var other = this.e.getAttribute("other-option");
    	return (other) ? other : "";
    };
    //取得other額外選項desc
    this.getOtherDesc = function(){
    	var otherDesc = this.e.getAttribute("other-option-desc");
    	return (otherDesc) ? otherDesc : "";
    };
    //新增部位
    this.putObj = function(obj){
    	this.createAreaObj(this.setShowColor([obj]));
    };
    //新增部位 by jsonArr中的obj (by type)
    this.putObjByType = function(data, type){
    	for (var i=0, len=data.length; i<len; ++i){
    		if (data[i].type==type){
    			this.putObj(data[i]);
    		}
    	}
    };
    //隱藏所有可選的object
    this.hideAll = function(){
    	var objs = this.getObjs();
    	for (var i=0, len=objs.length; i<len; ++i){
			if (objs[i].canSelected!==true){ //不可被選擇的areaType
    			continue;
    		}
    		this.hide(objs[i]);
    	}
    };
    //隱藏object (by type / obj)
    this.hide = function(p){
    	var type = "";
    	if (typeof(p) == "object"){
    		type = p.type;
    	}else{
	    	type = p;
	    }
		var obj = this.getObj(type);
		if (obj){
			obj.set("visible", false);
		}
		this.cvs.renderAll();
		return obj;
    };
    //顯示所有可選的object
    this.showAll = function(){
    	var objs = this.getObjs();
    	for (var i=0, len=objs.length; i<len; ++i){
			if (objs[i].canSelected!==true){ //不可被選擇的areaType
    			continue;
    		}
    		this.show(objs[i]);
    	}
    };
    //顯示object (by type / obj)
    this.show = function(p){
    	var type = "";
    	if (typeof(p) == "object"){
    		type = p.type;
    	}else{
	    	type = p;
	    }
		var obj = this.getObj(type);
		if (obj){
			obj.set("visible", true);
		}
		this.cvs.renderAll();
		return obj;
    };
    //判斷是否已被選中 (by type / obj)
    this.isSelected = function(p){
    	var objs, i, len;
    	if (!p){ //沒給值
    		console.error("缺少參數 (type / obj)");
    		return false;
    	}
		objs = this.getActive();
		var types = [];
		for (i=0, len=objs.length; i<len; ++i){
			types.push(objs[i].type);
		}
    	if (typeof(p) == "object"){
    		return types.indexOf(p.type)!==-1;
    	}else{
    		return types.indexOf(p)!==-1;
    	}
    };
    //還原所有顏色
    this.resetAllFill = function (){
    	var objs = this.getObjs();
    	for (var i=0, len=objs.length; i<len; ++i){
    		delete objs[i].clickFill;
    		objs[i].fill = objs[i].orignalFill;
    	}
    	this.clearAreaObj();
    	this.createAreaObj(objs);
    	// this.cvs.renderAll();
    	return objs;
    };
    //還原顏色 (by type / obj)
    this.resetFill = function (p){
    	var type = "";
    	if (typeof(p) == "object"){
    		type = p.type;
    	}else{
	    	type = p;
	    }
		var obj = this.getObj(type);
		if (obj){
			obj.set("clickFill", null);
			obj.set("fill", obj.orignalFill);
		}
		this.cvs.renderAll();
		return obj;
    };
    //設定顏色 (by type / obj)
    this.setFill = function (p, color){
    	var type = "";
    	if (typeof(p) == "object"){
    		type = p.type;
    	}else{
	    	type = p;
	    }
		var obj = this.getObj(type);
		if (obj){
			obj.set("clickFill", color);
			obj.set("fill", color);
		}
		this.cvs.renderAll();
		return obj;
    };
    /**
     * [點擊後變色 (clickFill + selectMode)]
     * @param  {[type|obj]} p [type / obj]
     */
    this.doClickFill = function(p){
		if (this.selectMode=="radio" || this.selectMode=="select"){//單選
			if (!this.isSelected(p)){
            	this.resetAllFill();
            	this.setFill(p, this.clickFill);
			}else{
            	this.resetAllFill();
			}
		}else if (this.selectMode=="checkbox"){//複選
			if (this.isSelected(p)){
				this.resetFill(p);
			}else{
				this.setFill(p, this.clickFill);
			}
		}else{
			console.error("尚未實作selectMode選取模式->"+this.selectMode);
		}
    };
    //顯示其他選項的字樣
    this.doShowOtherOption = function(){
    	//清除原本的字樣
    	var objs = this.cvs.getObjects("text-other-option");
    	for (var i=0, len=objs.length; i<len; ++i){
	    	cvs.remove(objs[i]);
    	}
    	//取得已勾選的額外選項
    	var otherOpt = this.e.getAttribute("other-option");
    	var otherOptDesc = this.e.getAttribute("other-option-desc");
    	otherOpt = (otherOpt) ? otherOpt.split(",") : [];
    	otherOptDesc = (otherOptDesc) ? otherOptDesc.split(",") : [];

    	//沒有已勾選的選項
    	if (otherOpt.length==0){
    		this.cvs.setWidth(this.original.custom.width);
    		return;
    	}

    	//向右推出顯示額外選項的空間
    	var divWidth = 250; //額外選項的寬(按比例 1280->200  800->125)
    	var zoomWidth = this.original.custom.width*(divWidth / this.original.width);
    	this.cvs.setWidth(this.original.custom.width + zoomWidth);

    	//方框框
		var rect = new fabric.Rect({
			"areaType": "Rect",
			"left": this.original.width,
			"top": 0,
			"fill": 'rgb(255, 255, 255)',
			"stroke": 'rgb(206, 212, 218)',
			"strokeWidth": 5,
			"opacity": 0.5,
			"width": divWidth,
			"height": this.original.height,
			"hoverCursor": "default",
			"type": "text-other-option",
			"desc": "",
			"click": "" //type=function
		});
		rect.hasControls = false; //禁止縮放及轉動
		rect.lockMovementX = true; //不可水平拖動
		rect.lockMovementY = true; //不可垂直拖動
		this.cvs.add(rect);
		//額外選項文字(自動換行)
		var newOtherOpt = [];
    	for (var i=0, len=otherOpt.length; i<len; ++i){
    		var otherValue = (otherOpt[i].indexOf("|:|")>-1) ? ":"+otherOpt[i].split("|:|")[1] : "";
    		otherValue = otherOptDesc[i]+otherValue;
    		var strGroupArr = getWordGroupArr(otherValue, 15, "　");
    		newOtherOpt = newOtherOpt.concat(strGroupArr);
    	}
    	//額外選項文字(顯示)
    	for (var i=0, len=newOtherOpt.length; i<len; ++i){
    		var strGroupArr = getWordGroupArr(otherValue, 15, "　");
			var t = new fabric.Textbox(newOtherOpt[i], {
				"areaType": "Text",
		        "fontFamily": 'DFKai-sb', //標楷體
		        "fontSize": 30,
		        "textAlign": 'left',
				"left": this.original.width + 10,
				"top": 10+35*i,
		        "type": "text-other-option",
				"orignalFill": 'black',
		        "fill": "black"
		    });
			t.hasControls = false; //禁止縮放及轉動
			t.lockMovementX = true; //不可水平拖動
			t.lockMovementY = true; //不可垂直拖動
			t.hoverCursor = "default";
			this.cvs.add(t);
    	}

    	//計算文字的寬度
    	function getWordWidth(w){
	    	var words="王ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890()%$℃./, !@#^&*_-+=\\[]{}'\":;?<>~`|";
			var wordsWid=[2.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,2.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00];
    		return (words.indexOf(w)>-1) ? wordsWid[words.indexOf(w)] : wordsWid[0];
    	}
    	/**
    	 * [取得指定寬度的文字換行陣列]
    	 * @param  {string} data          [要換行的資料]
    	 * @param  {int} width            [超過寬度要換行]
    	 * @param  {string} breakLineWord [換行的前置字元，如全形空白]
    	 * @return {[stringArr]}          [字串陣列]
    	 */
    	function getWordGroupArr(data, width, breakLineWord){
    		var strArr=[], idx=0, len=data.length;
    		do{
    			var widCount=0, st="";
    			while(idx<len && (widCount + getWordWidth(data[idx])<=width)){
    				st += data[idx];
    				widCount += getWordWidth(data[idx]);
    				++idx;
    			}
    			if (strArr.length>0){
    				st = breakLineWord + st;
    			}
    			strArr.push(st);
    		}while(idx<len);
    		return strArr;
    	}
    };
    /**
     * [設定預設值]
     * @param  {string}  itemValue [區塊物件，即csCanvas.getValue()的值]
     * @param  {string}  itemOther [額外選項，即csCanvas.getOtherValue()的值，ex. "other1|:|asasf,other2,other3|:|"]
     * @param  {Boolean} isRefresh [是否刷新畫布及連動元件]
     */
    this.doSetDefaultValue = function(itemValue, itemOther){
    	//刷新畫布和連動元件
    	this.refresh();
    	//點選區域物件
    	var vArr = (itemValue) ? itemValue.split(",") : [];
    	for (var i=0, len=vArr.length; i<len; ++i){
    		this.doClickFill(vArr[i]);
    	}
    	//同步csCanvas與連動元件
    	this.doSyncBeanSelected();
    	//設定額外選項值
    	if (itemOther){
	    	var others = itemOther.split(",");
	    	for (var i=0, len=others.length; i<len; ++i){
	    		var otherArr = others[i].split("|:|");
	    		var v = otherArr[0];
	    		var txt = (otherArr[1]) ? otherArr[1] : "";
	    		//change事件
	    		var changeEvent = document.createEvent("HTMLEvents");
			    changeEvent.initEvent("change",true,false);
	    		//選取連動元件
	    		if (this.selectMode=="select"){
	    			var ele = document.getElementById(this.e.id+"_"+this.selectMode);
	    			ele.value = v;
			    	ele.dispatchEvent(changeEvent);
	    		}else{ //radio | checkbox
	    			var ele = document.getElementById(this.e.id+"_"+this.selectMode+"_"+v);
	    			ele.click();
	    		}
	    		//填寫otherValue
	    		if (txt){
	    			var ele = document.getElementById(this.e.id+"_"+this.selectMode+"_"+v+"_other");
	    			ele.value = txt;
			    	ele.dispatchEvent(changeEvent);
	    		}
	    	}
    	}

    };
    //設定onclick事件
    this.click = (this.click) ? this.click : function(v, desc, obj){
    	console.log("請new csCanvas(... options{click:function} 以監聽click事件，將會return value, desc, obj", "\nvalue="+v, "\ndesc="+desc, obj);
    };
    //設定onchange事件
    this.change = (this.change) ? this.change : function(v, desc, obj){
    	console.log("請new csCanvas(... options{change:function} 以監聽change事件，將會return value, desc, obj", "\nvalue="+v, "\ndesc="+desc, obj);
    };

    //===========控制區 end==========


    //===========控制區(連動元件) start==========
    this.targetDiv = null;
    //取得/創建 連動元件的父層div至模板div的上方
    this.getTargetDiv = function(){
    	if (this.targetDiv){
    		return this.targetDiv;
    	}
    	var templateDiv;
    	if (this.templateDiv.id){
    		templateDiv = document.getElementById(this.templateDiv.id);
    	}else{//沒有設id的話要幫他預設產一個
    		//移除原本的連動元件模板
    		templateDiv = document.getElementById(this.e.id+"_targetDiv_template");
	    	if (templateDiv){
	    		templateDiv.parentNode.removeChild(templateDiv);
	    	}
	    	//創建連動元件模板
    		var div = document.createElement("div");
    		div.id = this.e.id+"_targetDiv_template";
    		div.className = "csCanvasBeanDiv_template";
    		div.className += (this.templateDiv.isShowDiv===false) ? " csCanvas-hide" : "";
    		if (this.selectMode=="checkbox"||this.selectMode=="radio"){
    			var div2 = document.createElement("div");
    			var input = document.createElement("input");
    			var label = document.createElement("label");
    			var dm = this.templateDiv.displayMode;
    			div2.className = "csCanvasBeanDiv2";
    			div2.className += " csCanvas"+dm[0].toUpperCase() + dm.slice(1); //附上displayMode標記
    			input.type = this.selectMode;
    			input.className = "csCanvasBean_template";
    			label.className = "csCanvasBeanLabel_template";
				div2.appendChild(input);
				div2.appendChild(label);
				div.appendChild(div2);
    		}else{ //select
    			var select = document.createElement("select");
    			var option = document.createElement("option");
    			select.className = "csCanvasBean_template";
    			option.value = "";
    			option.innerHTML = "請選擇";
    			select.appendChild(option);
				div.appendChild(select);
    		}
    		//如果要放在上或左，要把div插入canvas上方
    		if (["top", "left"].indexOf(this.templateDiv.position)>-1){
    			this.e.parentNode.insertAdjacentElement("beforebegin", div);
    		}else{ //如果要放在右或下，要把div插入canvas下方
    			if ("right"==this.templateDiv.position){//設定寬度
    				var width = this.e.parentNode.parentNode.offsetWidth - this.e.parentNode.offsetWidth - 5;
    				div.style.maxWidth = (width>200) ? width+"px" : "200px";
    			}
    			this.e.parentNode.insertAdjacentElement("afterend", div);
    		}
    		//附上position標記
    		var pst = this.templateDiv.position;
    		div.className += " csCanvas"+pst[0].toUpperCase() + pst.slice(1);

    		templateDiv = div;
    	}
		this.targetDiv = templateDiv.cloneNode();
		this.targetDiv.id = this.e.id+"_targetDiv";
		this.targetDiv.className = this.targetDiv.className.replace("csCanvasBeanDiv_template", "csCanvasBeanDiv");
		//附上selectMode標記
		var sm = this.selectMode;
		this.targetDiv.className += " csCanvas"+sm[0].toUpperCase() + sm.slice(1);
		//beforebegin ：在 element 元素的前面
		// afterbegin ：在 element 元素的第一個子節點前面
		// beforeend ：在 element 元素的最後一個子節點後面
		// afterend ：在 element 元素的後面
		templateDiv.insertAdjacentElement("beforebegin", this.targetDiv);
    };
    /**
     * [創建連動元件]
     * @param  {string}  v             [值，input的value，等同人形圖的type]
     * @param  {string}  desc          [顯示的選項，label，等同人形圖的desc]
     * @param  {Boolean} isOtherOption [額外選項]
     * @param  {Boolean} hasOther      [額外選項是否展出輸入框]
     */
    this.doCreateBean = function(v, desc, isOtherOption, hasOther){
    	//深拷貝模板div
    	var cloneDiv;
    	if (this.templateDiv.id){
    		cloneDiv = document.getElementById(this.templateDiv.id).cloneNode(true);
    	}else{
    		cloneDiv = document.getElementById(this.e.id+"_targetDiv_template").cloneNode(true);
    	}
    	//有創件過targetDiv的話要跳過(適用select)
    	var isHasCreated = false;
		//有hasOther的話，要新增文本框
		var other;
		if (hasOther){
			other = document.createElement("input");
			other.type = "text";
			other.id = this.e.id+"_"+this.selectMode+"_"+v.replace(/\s/g, "_")+"_other";
			other.className = "csCanvasBeanOther";
			other.setAttribute("data-target-value", v);
			other.setAttribute("onchange", "document.getElementById('"+this.e.id+"').csCanvas.doBeanOtherTextChange(this);");
		}
    	//開始創建
		if (this.selectMode=="radio" || this.selectMode=="checkbox"){
			//設定單選/複選
			var input = cloneDiv.getElementsByClassName("csCanvasBean_template")[0];
			input.className = input.className.replace("csCanvasBean_template", "csCanvasBean");
			//id名避免空白
			input.id = this.e.id+"_"+this.selectMode+"_"+v.replace(/\s/g, "_");
			input.name = this.e.id+"_"+this.selectMode;
			input.value = v;
			input.setAttribute("data-is-other-option", (isOtherOption) ? isOtherOption : false);
			input.setAttribute("data-has-other", (hasOther) ? hasOther : false);
			//onclick事件為選中csCanvas
			input.setAttribute("onclick", "document.getElementById('"+this.e.id+"').csCanvas.doBeanSelected(this);");
			var label = cloneDiv.getElementsByClassName("csCanvasBeanLabel_template")[0];
			label.className = label.className.replace("csCanvasBeanLabel_template", "csCanvasBeanLabel");
			label.setAttribute("for", input.id);
			label.innerHTML = desc;
			//有hasOther的話，要新增文本框
			if (hasOther){
    			label.insertAdjacentElement("afterend", other);
			}
		}else if (this.selectMode=="select"){
			//有創件過targetDiv的話要跳過
			if (this.targetDiv.getElementsByClassName("csCanvasBean").length>0){
				isHasCreated = true;
			}else{
				//設定下拉框
				var select = cloneDiv.getElementsByClassName("csCanvasBean_template")[0];
				select.id = this.e.id+"_"+this.selectMode;
				select.className = select.className.replace("csCanvasBean_template", "csCanvasBean");
				//onchange事件為選中csCanvas
				select.setAttribute("onchange", "document.getElementById('"+this.e.id+"').csCanvas.doBeanSelected(this);");
			}
		}

		//select如果已經create過了就不再create
		if (!isHasCreated){
			//append連動元件
	    	for (var i=0, len=cloneDiv.children.length; i<len; ++i){
	    		if (!cloneDiv.children[i]) continue;
				this.targetDiv.appendChild(cloneDiv.children[i]);
	    	}
		}

		//select要新增option選項
		if (this.selectMode=="select"){
			var option = document.createElement("option");
			option.value = v;
			option.innerHTML = desc;
			option.setAttribute("data-is-other-option", (isOtherOption) ? isOtherOption : false);
			option.setAttribute("data-has-other", (hasOther) ? hasOther : false);
			this.targetDiv.getElementsByClassName("csCanvasBean")[0].insertAdjacentElement("beforeend", option);
			//有hasOther的話，要新增文本框
			if (hasOther){
    			this.targetDiv.getElementsByClassName("csCanvasBean")[0].insertAdjacentElement("afterend", other);
			}
		}
    };
    //創建連動元件 (讀取csCanvas的list)
    this.doCreateAllBean = function(){
    	this.e.setAttribute("other-option", "");
    	this.e.setAttribute("other-option-desc", "");
		//移除原本的連動元件
		var targetDiv = document.getElementById(this.e.id+"_targetDiv");
		if (targetDiv){
			targetDiv.parentNode.removeChild(targetDiv);
		}
    	if (this.templateDiv){
	    	//初始化連動元件
	    	this.targetDiv = null;
	    	this.getTargetDiv();
	    	//讀取csCanvas的list
	    	var list = this.getList();
	    	for (var i=0, len=list.typeList.length; i<len; ++i){
	    		//創建連動元件
	    		this.doCreateBean(list.typeList[i], list.descList[i]);
	    	}
	    	//新增otherOptionsValue
	    	var otherValues = this.templateDiv.otherOptionsValue;
	    	var otherDescs = this.templateDiv.otherOptionsDesc;
	    	var hasOthers = this.templateDiv.otherOptionsHasOther;
	    	for (var i=0, len=otherValues.length; i<len; ++i){
	    		//創建連動元件
	    		this.doCreateBean(otherValues[i], (otherDescs[i]) ? otherDescs[i] : otherValues[i], true, (hasOthers[i]) ? hasOthers[i] : false);
	    	}
    	}else{
    		console.log("csCanvas -> 尚未設置連動元件");
    	}
    };
    //元件的選擇事件 (radio / checkbox / select)
    this.doBeanSelected = function(that){
    	//填色
    	this.doClickFill(that.value);

    	//處理其他選項
    	var otherOpt, otherOptDesc;
    	if (["radio", "select"].indexOf(this.selectMode)>-1){//單選
	    	//取得1.是否為額外選項 2.是否有hasOther 3.desc
	    	var isOtherOption, hasOther, otherEle, desc;
	    	if (this.selectMode=="select"){
	    		isOtherOption = that.options[that.selectedIndex].getAttribute("data-is-other-option")=="true" || false;
	    		hasOther = that.options[that.selectedIndex].getAttribute("data-has-other")=="true" || false;
	    		desc = that.options[that.selectedIndex].innerHTML;
	    	}else{
	    		isOtherOption = that.getAttribute("data-is-other-option")=="true" || false;
	    		hasOther = that.getAttribute("data-has-other")=="true" || false;
	    		desc = that.parentNode.getElementsByClassName("csCanvasBeanLabel")[0].innerHTML;
	    	}
			var otherEle = document.getElementById(this.e.id+"_"+this.selectMode+"_"+that.value.replace(/\s/g, "_")+"_other");
			//取值
    		otherOpt = (isOtherOption) ? that.value : "";
    		if (hasOther && otherEle){
    			otherOpt += "|:|" + otherEle.value;
    		}
    		otherOptDesc = (otherOpt) ? desc : "";
    	}else{//複選
			//照順序抓進otherOpt
			otherOpt = [];
			otherOptDesc = [];
			var beans = this.targetDiv.getElementsByClassName("csCanvasBean");
			for (var i=0, len=beans.length; i<len; ++i){
				var bean = beans[i];
				if (bean.checked){
					//有額外選項
					var isOtherOption = bean.getAttribute("data-is-other-option")=="true" || false;
					if (isOtherOption){
						var hasOther = bean.getAttribute("data-has-other")=="true" || false;
						var otherEle = document.getElementById(this.e.id+"_"+this.selectMode+"_"+bean.value.replace(/\s/g, "bean")+"_other");
						var desc = bean.parentNode.getElementsByClassName("csCanvasBeanLabel")[0].innerHTML;
						if (hasOther && otherEle){
			    			otherOpt.push(bean.value+"|:|" + otherEle.value);
			    		}else{
			    			otherOpt.push(bean.value);
			    		}
			    		otherOptDesc.push(desc);
					}

				}
			}
			otherOpt = otherOpt.join(",");
			otherOptDesc = otherOptDesc.join(",");
    	}
    	this.e.setAttribute("other-option", otherOpt);
    	this.e.setAttribute("other-option-desc", otherOptDesc);

    	//隱藏所有hasOther
    	var others = document.getElementsByClassName("csCanvasBeanOther");
    	for (var i=0, len=others.length; i<len; ++i){
    		others[i].className = others[i].className.replace("csCanvasShow", "");
    	}
    	//有hasOther的話要顯示
    	others = (otherOpt) ? otherOpt.split(",") : [];
    	for (var i=0, len=others.length; i<len; ++i){
    		var v = others[i].split("|:|")[0];
    		var otherEle = document.getElementById(this.e.id+"_"+this.selectMode+"_"+v.replace(/\s/g, "_")+"_other");
    		if (otherEle){
    			otherEle.className += " csCanvasShow";
    		}
    	}
    	//顯示其他選項
    	this.doShowOtherOption();
    };
    //其他輸入框，把值填入csCanvas的屬性other-option
    this.doBeanOtherTextChange = function(that){
    	var targetValue = that.getAttribute("data-target-value");
    	var otherOpt = this.e.getAttribute("other-option");
    	otherOpt = (otherOpt) ? otherOpt.split(",") : []; //ex. ["大腿肌|:|左腿", "三角肌"]
    	for (var i=0, len=otherOpt.length; i<len; ++i){
    		var v = otherOpt[i].split("|:|")[0];
    		if (v==targetValue){
    			otherOpt.splice(i, 1, targetValue+"|:|"+that.value);
    			break;
    		}
    	}
    	this.e.setAttribute("other-option", otherOpt.join(","));
    	this.doShowOtherOption();
    };
    //同步csCanvas與連動元件
    this.doSyncBeanSelected = function(){
    	if (!this.targetDiv){
    		console.error("請設定csCanvas.options.templateDiv以同步連動元件的勾選");
    		return;
    	}
		if (this.selectMode=="radio" || this.selectMode=="checkbox"){
			//單選/複選框
			var beans = this.targetDiv.getElementsByClassName("csCanvasBean");
			//csCanvas已勾選的types
			var vArr = this.getValue().split(",");
			var otherArr = this.getOtherValue().split(",");
			//開始同步
			for (var i=0, len=beans.length; i<len; ++i){
				//取消勾選
				beans[i].checked = false;
				//勾選
				if (vArr.indexOf(beans[i].value)>-1){
					beans[i].checked = true;

					//單選的時候要清空"其他"連動元件
					if (this.selectMode=="radio"){
						$(that.e).attr("other-option", "");
						$(that.e).attr("other-option-desc", "");
						//顯示其他選項
						that.doShowOtherOption();
						return;
					}
				}
				//其他選項
				for (var i2=0, len2=otherArr.length; i2<len2; ++i2){
					if (otherArr[i2].split("|:|").indexOf(beans[i].value)===0){
						beans[i].checked = true;
						var eleOther = document.getElementById(beans[i].id+"_other");
						if (eleOther){
							eleOther.value = otherArr[i2].split("|:|")[1];
						}
						break;
					}
				}
			}
		}else if (this.selectMode=="select"){
			//下拉框
			var bean = this.targetDiv.getElementsByClassName("csCanvasBean")[0];
			//勾選
			bean.value = this.getValue();
		}
    };
    //===========控制區(連動元件) end==========

    //綁定變數至元件
    this.e.csCanvas = this;
	this.e.fabric=this.cvs;


	//初始化
	this.run = function (){
		console.log("csCanvas -> 初始化")
		original.onLoad();
		this.canvas.clear();
		this.completeCall = completeCall;
			//讀取背景圖
		++this.completeCall_count;
		fabric.Image.fromURL(data.imgSrc, function(img) {
			// add background image
			cvs.setBackgroundImage(img, cvs.renderAll.bind(cvs), {
				scaleX: original.width / img.width,
				scaleY: original.height / img.width,
				preserveObjectStacking: true
			});
			that.completeCall();
		});
		//圖片及canvas準備完成
		function completeCall (){
			if (--this.completeCall_count>0) return;
			if (data.areas && data.areas.length>0){
				//設定顏色
				data.areas = this.setShowColor(data.areas);
				//要被填入的區域(矩形)
				this.createAreaObj(data.areas);
			}
			//縮放至指定大小
			this.setZoomCustom();
			//設置連動元件
			this.doCreateAllBean();
	    	//初始化log
			this.log.reset();
			//onReady
			original.onReady();
			//complete
			original.complete(data.areas);
	        // //重整畫布
	        // this.switchMode(this.nowMode);
		};
	};
	this.run();
}



//判斷ie版本5~8, fabric.min.js 不支援IE低版本
csCanvas.isIE5to8 = function(){
	try{
		var isIELow = false;
		var b = [];
		for (var i=5; i<=8; ++i) {
			b[i] = document.createElement('b');
			b[i].innerHTML = '<!--[if IE ' + i + ']><i></i><![endif]-->';
			console.log("isIE-"+i+"? "+(b[i].getElementsByTagName('i').length === 1));
			isIELow = (isIELow) ? isIELow : b[i].getElementsByTagName('i').length === 1;
		}
		return isIELow;
	}catch(e){
		console.error(e);
		return false;
	}
};

//安全版eval - 回傳參數 (不能夾帶分號";")
csCanvas.evalByReturn = function(scriptStr){
	return Function('"use strict";return ('+scriptStr+')')();
}