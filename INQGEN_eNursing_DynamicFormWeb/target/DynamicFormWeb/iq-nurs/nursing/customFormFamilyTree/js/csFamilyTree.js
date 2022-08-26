function CsFamilyTree(id, data){
	let that = this
	//初始化參數
	this.data = data
	this.e = document.getElementById(id)
	//創建一個canvas畫板
	this.canvas = this.cvs = (this.e.fabric) ? this.e.fabric : new fabric.Canvas(id, {
		selection: false, //禁止框選
		fireRightClick: true,  // 啟用右鍵，button的數字為3
		stopContextMenu: true, // 禁止默認右鍵選單
	})
	this.e2 = this.e.nextSibling
	this.e.csFamilyTree = this.e.cft = this
	this.e.fabric=this.cvs
	this.root = {
		left: that.data.left,
		top: that.data.top
	}
	this.config = new CsFamilyTreeConfig(that)
	this.root = new CsFamilyTreeRoot(that)
	this.wife = new CsFamilyTreeWife(that)
	this.son = new CsFamilyTreeSon(that)

	//建立人物物件
	this.createPersonObj = function(obj){
		for (let nodeKey in obj.node) {
			//檢查
			/**
			 * nodeType
			 * {} - 代表此為引用，由另一個節點創建即可
			 * [] - 代表沒有下一個節點
			 */
			if (!Array.isArray(obj.node[nodeKey]) || obj.node[nodeKey].length===0) continue
			if (!that[nodeKey]) {
				console.error(nodeKey, `缺少節點${nodeKey}，請創建js/node${nodeKey[0].toUpperCase()+nodeKey.slice(1)}.js並於csFamilyTree.js引用`)
				continue
			}
			//移除物件

			//創建物件
			obj.node[nodeKey].forEach(obj2 => {
				//初始化
				obj2.nodeFunction = that[nodeKey]
				obj2.parent = obj
				//移除物件、關係線
				that.removeObj(obj, obj2)
				//建立物件、關係線
				that[nodeKey].createObj(obj2)
				that[nodeKey].createRelation(obj, obj2)
				//deep create
				that.createPersonObj(obj2)
			})
		}
	}

	//建立人物物件(矩形)
	this.createPersonRect = function(obj, options){
		let o = new fabric.Rect(obj)
		o = $.extend(true, o, {
			hasRotatingPoint:   false,//選中時是否可以旋轉
			hasBorders:         true,//選中時是否有邊框
			transparentCorners: true,
			perPixelTargetFind: false,//默認false。當設置為true，對象的檢測會以像互點為基礎，而不是以邊界的盒模型為基礎。
			selectable:         true,//是否可被選中
			hasControls:        false, //是否開放縮放及轉動
			lockMovementX:      false, //是否禁止水平拖動
			lockMovementY:      true, //是否禁止垂直拖動
			hoverCursor:        "pointer" // "pointer" : "default" : "all-scroll"
		})
		o.left = that.root.left + obj.left
		o.top = that.root.top + obj.top
		o = $.extend(true, o, options)
		o.data = obj

		this.cvs.add(o)
	}

	//取得定位點資訊
	this.getPositionInfo = function(obj){
		let cvsObj = that.getObj(obj)
		//尚未創建的節點
		if (!cvsObj) {
			cvsObj = $.extend(false, {}, obj)
			cvsObj.left = that.root.left + cvsObj.left
			cvsObj.right = that.root.right + cvsObj.right
		}
		return {
			center:       {x: cvsObj.left + (cvsObj.width / 2),	y: cvsObj.top + (cvsObj.height / 2)},
			middleLeft:   {x: cvsObj.left, 						y: cvsObj.top + (cvsObj.height / 2)},
			middleTop:    {x: cvsObj.left + (cvsObj.width / 2), y: cvsObj.top},
			middleRight:  {x: cvsObj.left + cvsObj.width, 		y: cvsObj.top + (cvsObj.height / 2)},
			middleBottom: {x: cvsObj.left + (cvsObj.width / 2), y: cvsObj.top + cvsObj.height}
		}
	}

	//建立人物關係線
	this.createPersonLine = function(type, polyline, options){
		options = $.extend(false, {
			type:               type,
			fill:               'transparent',//填充顏色
			stroke:             '#000000',//筆觸顏色
			strokeWidth:        2,//筆觸寬度
			hasRotatingPoint:   false,//選中時是否可以旋轉
			hasBorders:         false,//選中時是否有邊框
			transparentCorners: true,
			perPixelTargetFind: true,//默認false。當設置為true，對象的檢測會以像互點為基礎，而不是以邊界的盒模型為基礎。
			selectable:         false,//是否可被選中
			hasControls:        false, //是否開放縮放及轉動
			lockMovementX:      true, //是否禁止水平拖動
			lockMovementY:      true, //是否禁止垂直拖動
			hoverCursor:        "default" // "pointer" : "default" : "all-scroll"
		}, options)
		let o = new fabric.Polyline(polyline, options)

		this.cvs.add(o)
	}

	/**
	 * 取得分支
	 * #### [] -> 沒有 -> 回傳null
	 * #### [{}] -> 有 -> 回傳第一個節點
	 * #### {} -> 有 -> 回傳該節點
	 */
	this.getNode = function (node) {
		if (Array.isArray(node) && node.length>0) {
			return node[0]
		} else if (!Array.isArray(node)) {
			return node
		}
		return null
	}

	//輸出成png
	this.outputPng = function(){
		let minX=999999, maxX=0, minY=999999, maxY=0
		that.cvs.getObjects().forEach(obj => {
			minX = (obj.left<minX) ? obj.left : minX
			maxX = (obj.left+obj.width>maxX) ? obj.left+obj.width : maxX
			minY = (obj.top<minY) ? obj.top : minY
			maxY = (obj.top+obj.height>maxY) ? obj.top+obj.height : maxY
		})
		minX-=50
		minY-=50
		maxX+=50
		maxY+=50
		return that.cvs.toDataURL({
			format: 'png', // jpeg或png
			quality: 0.8, // 圖片品質，僅jpeg時可用
			// 截取指定位置和大小
			left: minX,
			top: minY,
			width: maxX - minX,
			height: maxY - minY
		})
	}

	//取得object
	this.getObj = function(personObj){
		return that.cvs.getObjects(personObj.type)[0]
	}

	//移除物件、關係線
	this.removeObj = function(parentObj, targetObj){
		//物件
		that.cvs.remove(that.getObj(targetObj))
		//關係線
		that.cvs.getObjects().forEach(obj => {
			if (obj.type.indexOf(`_${parentObj.type}_${targetObj.type}`)>-1) {
				that.cvs.remove(obj)
			}
		})
	}

	//設定物件拖動結束事件
	this.cvs.off('object:moved')
	this.cvs.on('object:moved', function (e) {
		let active = e.target
		if (!active.data.parent) {
			//root
			//變更定位點 - 絕對定位點
			that.root.left = active.data.left = active.left
			that.root.top = active.data.top = active.top
			//重新建立人物物件(根節點)
			that.root.createObj()
		} else {
			//下層節點
			//變更定位點 - 絕對定位點
			active.data.left = active.left - that.root.left
			active.data.top = active.top - that.root.top
			//重新建立人物物件
			that.createPersonObj(active.data.parent)
		}
	})

	//強調選中效果
	let activeObject
	let lastActiveObject
	this.cvs.off('selection:created')
	this.cvs.off('selection:cleared')
	this.cvs.off('selection:updated')
	this.cvs.on('selection:created', onObjectSelection)
	this.cvs.on('selection:cleared', onObjectClear)
	this.cvs.on('selection:updated', onselectionUpdate)
	function onObjectSelection() {
		activeObject = that.cvs.getActiveObject()
		lastActiveObject = activeObject
		activeObject.set({
			stroke: 'red',
			strokeWidth: 3,
			dirty: true
		})
		that.cvs.requestRenderAll()
	}
	function onObjectClear() {
		lastActiveObject.set({
			stroke: 'black',
			strokeWidth: 0,
			dirty: true
		})
		that.cvs.requestRenderAll()
	}
	function onselectionUpdate() {
		activeObject = that.cvs.getActiveObject()
		activeObject.set({
			stroke: 'red',
			strokeWidth: 4,
			dirty: true
		})

		lastActiveObject.set({
			stroke: 'black',
			strokeWidth: 0,
			dirty: true
		})
		that.cvs.requestRenderAll()
		lastActiveObject = activeObject
	}

	this.cvs.on('mouse:down', canvasOnMouseDown)


	function canvasOnMouseDown(opt) {

		console.log(opt)
		// 判断：右键，且在元素上右键
		// opt.button: 1-左键；2-中键；3-右键
		// 在画布上点击：opt.target 为 null
		if (opt.button === 3 && opt.target) {
			// 获取当前元素
			activeEl = opt.target

			if (activeEl.selectable===false) return
			that.cvs.setActiveObject(activeEl)
			that.cvs.fire('selection:created', {target: activeEl})

			menu.domReady = function () {
				console.log(123)
			}

			// 显示菜单，设置右键菜单位置
			// 获取菜单组件的宽高
			const menuWidth = menu.offsetWidth
			const menuHeight = menu.offsetHeight

			// 当前鼠标位置
			let pointX = opt.pointer.x
			let pointY = opt.pointer.y

			// 将菜单展示出来
			menu.style = `
			  visibility: visible;
			  left: ${pointX}px;
			  top: ${pointY}px;
			  z-index: 100;
			`
		} else {
			hiddenMenu()
		}
	}

	// 隐藏菜单
	function hiddenMenu() {
		menu.style = `
			visibility: hidden;
			left: 0;
			top: 0;
			z-index: -100;
		`
		activeEl = null
	}

	// 删除元素
	function delEl() {
		canvas.remove(activeEl)
		hiddenMenu()
	}

	//初始化
	this.run = function (){
		console.log("csFamilyTree -> 初始化")
		that.cvs.setHeight(2000)
		that.cvs.setWidth(2000)
		that.cvs.clear()
		if (!data) {
			that.data = $.extend(true, {}, data_basic)
		}

		//網格線
		const grid = 30
		const lineStroke = '#e7eded'
		for (let i = 0; i < (this.cvs.width / grid); i++) {
			const lineX = new fabric.Line([ 0, i * grid, this.cvs.width, i * grid], {
				stroke: lineStroke,
				selectable: false,
				hoverCursor: 'default',
				type: 'line'
			})
			const lineY = new fabric.Line([ i * grid, 0, i * grid, this.cvs.width], {
				stroke: lineStroke,
				selectable: false,
				hoverCursor: 'default',
				type: 'line'
			})
			this.cvs.add(lineX)
			this.cvs.add(lineY)
		}

		//建立人物物件(根節點)
		that.root.createObj()
	}
	this.run()
}
