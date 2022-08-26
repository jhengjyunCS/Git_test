function csApiDefine(id, json) {
    let csApi = this
    let $e = this.$e = $(`#${id}`)
    let e = this.e = this.$e[0]
    let tool = this.tool = new Fn_tool(this) //工具包
    this.json = json || {}
    this.$toolBar = null
    this.$nodeStr = null
    this.$jsonViewer = null
    this.$jsonEditor = null
    this.$alert = null
    this.codeMirror = null
    //view_full 完整檢視 | view 檢視key-value | code_full 完整代碼 | code 代碼key-value
    this.nowTab = 'view_full'
    //editMode 編輯模式 | selectMode 選擇模式(未寫)
    this.nowMode = 'editMode'
    //當前的json名稱，用於區分傳入參數 sendParam、輸出資料 receiveParam
    this.nowJsonName = 'receiveParam'
    //當前的調用api方式
    this.nowSendMethod = ''
    //div id
    this.setting = {
        'divNodeStr':    'divNodeStr',
        'divJsonViewer': 'divJsonViewer'
    }
    //config，替換字串後寫入此物件
    let config = this.csApiConfig = JSON.parse(JSON.stringify(csApiConfig).replace(/\#targetId\#/g, this.e.id))


    //創建 csApiDefine
    this.create = function () {
        //設定config
        //新建defineder
        $e.empty()
        $e.append(config.csApiDefineEle.main)
        //註冊
        this.$toolBar = $e.find('#divToolBar')
        this.$nodeStr = $e.find('#divNodeStr')
        this.$jsonViewer = $e.find('#divJsonViewer')
        this.$jsonEditor = this.$e.find('#divJsonEditor')
        //設定root的type
        if (Array.isArray(this.json)) {
            this.$jsonViewer.attr('data-type', 'array')
        } else {
            this.$jsonViewer.attr('data-type', 'object')
        }
        //若為空物件，則預設新增一個結點
        if (['{}', '[]'].indexOf(JSON.stringify(this.json)) > -1) {
            this.$jsonViewer.append(config.csApiDefineEle.node)
        } else { //設定json
            this.setJSON(this.json)
        }
        //初始化工具包
        tool = this.tool = new Fn_tool(this)
    }

    /**
     * 取得json
     * @param {boolean} isOnlyKeyValue true=僅key-Value, false|null=完整資料
     * @returns {{}}
     */
    this.getJSON = function (isOnlyKeyValue) {
        let json = {}
        try {
            switch (this.nowTab) {
                case 'view_full':
                case 'view':
                    json = tool.getViewerValue()
                    break
                case 'code_full':
                    json = JSON.parse(this.codeMirror.getValue())
                    break
                case 'code':
                    let newJson = JSON.parse(this.codeMirror.getValue())
                    let oldJson = $.extend(true, {}, csApi.json)
                    json = {}
                    //比對原本的資料，將原來的節點屬性設定回來
                    deepJson(json, newJson, oldJson)

                    function deepJson(nodeJson, node, oldJson) {
                        let oJson = oldJson || {}
                        for (let key in node) {
                            nodeJson[key] = {}
                            oJson = (oldJson) ? oldJson[key] || null : null
                            config.nodeAttrArr.forEach(function (attr, i) {
                                if (attr === 'key') return
                                if (attr === 'value' && tool.isJsonOrArrayJson(node[key])) {
                                    if (Array.isArray(node[key])) {
                                        nodeJson[key].value = []
                                        node[key].forEach(function(node2, i2) {
                                            nodeJson[key].value[i2] = {}
                                            deepJson(nodeJson[key].value[i2], node2, (oJson && oJson.value) ? oJson.value[i2] : oJson)
                                        })
                                    } else {
                                        nodeJson[key].value = {}
                                        deepJson(nodeJson[key].value, node[key], (oJson) ? oJson.value : oJson)
                                    }
                                } else if (attr === 'value') {
                                    nodeJson[key].value = node[key]
                                } else {
                                    if (oJson !== null && oJson[attr]) {
                                        nodeJson[key][attr] = oJson[attr]
                                    }
                                }

                            })
                        }
                    }

                    break
            }

            //取得key-value
            if (isOnlyKeyValue) {
                return tool.getJsonKeyValue(json)
            } else { //完整資料
                return json
            }
        } catch (e) {
            console.error(e)
            return 'error'
        }
    }

    /**
     * 設定json
     * @returns {{}}
     */
    this.setJSON = function (json) {
        if (typeof json === 'string') {
            json = json.parse(json)
        }
        this.json = json
        //檢查json是否是key-value資料
        if (JSON.stringify(json).indexOf('"value"') === -1) {
            //轉為完整json
            this.json = tool.getJsonFull(json)
            //key-value頁籤
            if (csApi.nowTab === 'code') {
                tool.setEditorValue(json)
            } else {
                //轉為完整json後set value
                tool.setViewerValue(this.json)
                if (this.codeMirror) {
                    tool.setEditorValue(this.json)
                }
            }
        } else {
            //key-value頁籤
            if (csApi.nowTab === 'code') {
                //轉為key-value後set value
                tool.setEditorValue(tool.getJsonKeyValue(json))
            } else {
                tool.setViewerValue(json)
                if (this.codeMirror) {
                    tool.setEditorValue(json)
                }
            }
        }
    }


    /**
     * 切換頁籤
     * @param {string} tab view_full 完整檢視 | view 檢視key-value | code_full 完整代碼 | code 代碼key-value
     * @returns {string|*} 切換後的模式
     */
    this.switchTab = function (tab) {
        if (!tab) return this.nowTab
        let json = this.getJSON(false) //合併後的json
        if (json === 'error') {
            csApi.alert('請檢查json格式是否正確')
            return this.nowTab;
        }
        this.json = json

        this.nowTab = tab
        //切換頁籤
        this.$toolBar.find('.active').removeClass('active')
        switch (tab) {
            case 'view_full':
            case 'view':
                //切換頁籤
                this.$toolBar.find((tab === 'view_full' ? '#btnToolBarVF' : '#btnToolBarV')).addClass('active')
                this.$nodeStr.show()
                this.$jsonViewer.show()
                this.$jsonEditor.hide()
                //設定viewer
                tool.setViewerValue(this.json)
                //清空editor
                tool.setEditorValue('')

                //只顯示該顯示的
                let nowTab = this.nowTab //當前頁籤
                let $jsonViewer = this.$jsonViewer
                let hideAttrArr = [] //要隱藏的屬性
                config.nodeAttrArr.forEach(function (attr, i) {
                    if (config.showTab[nowTab].attrArr.indexOf(attr) === -1) {
                        hideAttrArr.push(attr)
                    }
                })
                //解除隱藏
                $jsonViewer.find('.hide').removeClass('hide')
                //隱藏
                hideAttrArr.forEach(function (attr, i) {
                    $jsonViewer.find(`.${attr}`).addClass('hide')
                })
                break
            case 'code_full':
                //切換頁籤
                this.$toolBar.find('#btnToolBarCF').addClass('active')
                this.$nodeStr.hide()
                this.$jsonViewer.hide()
                this.$jsonEditor.show()
                //清空viewer
                tool.setViewerValue({})
                //設定editor
                tool.setEditorValue('{\n\n\n\n\n\n\n\n\n\n\n\n\n}') //讓css能正常
                tool.setEditorValue(json)
                break
            case 'code':
                //切換頁籤
                this.$toolBar.find('#btnToolBarC').addClass('active')
                this.$nodeStr.hide()
                this.$jsonViewer.hide()
                this.$jsonEditor.show()
                //清空viewer
                tool.setViewerValue({})
                //設定editor
                tool.setEditorValue('{\n\n\n\n\n\n\n\n\n\n\n\n\n}') //讓css能正常
                tool.setEditorValue(tool.getJsonKeyValue(json))
                break
            default:
                return this.nowTab
        }
        return this.nowTab
    }

    /**
     * 判斷當前模式是否為指定模式 (不分大小寫)
     * @param {string} mode
     * @returns {boolean} true=是 | false=否
     */
    this.isNowMode = function(mode) {
        if (!mode) {
            console.error('缺少參數!')
            return false
        }
        return this.nowMode.toLowerCase() === mode.toLowerCase()
    }

    /**
     * 切換模式
     * @param {string} mode editMode 編輯模式 | selectMode 選擇模式
     * @returns {string|*}
     */
    this.switchMode = function(mode) {
        $(`.${this.nowMode}`).removeClass(this.nowMode).addClass(mode)
        this.nowMode = mode
        return this.nowMode
    }

    /**
     * 判斷當前模式是否為指定json名稱
     * @param {string} jsonName
     * @returns {boolean} true=是 | false=否
     */
    this.isNowJsonName = function(jsonName) {
        if (!jsonName) {
            console.error('缺少參數!')
            return false
        }
        return this.nowJsonName === jsonName
    }

    /**
     * 切換當前的json名稱，用於區分傳入參數、輸出資料
     * @param {string} jsonName sendParam 傳入參數 | receiveParam 輸出資料
     * @param {string} sendMethod 調用api方式
     * @returns {string|*}
     */
    this.switchJsonName = function(jsonName, sendMethod) {
        sendMethod = (sendMethod) ? sendMethod : this.nowSendMethod
        $(`.${this.nowJsonName}`).removeClass(this.nowJsonName).removeClass(this.nowSendMethod).addClass(jsonName).addClass(sendMethod)
        this.nowJsonName = jsonName
        this.nowSendMethod = sendMethod
        return this.nowJsonName
    }

    //工具包
    function Fn_tool(p) {
        this.parent = p
        /**
         * 取得節點清單
         * @param {$selector} $ele null=取得根節點下的第一級子節點, $ele=指定節點下的第一級子節點
         * @returns {*}
         */
        this.getNodeEleList = function ($ele) {
            if ($ele) {
                return $ele.find('>.node')
            } else {
                return csApi.$jsonViewer.find('>.node')
            }
        }
        /**
         * 取得節點屬性值
         * @param {$selector} $node 節點
         * @param {String} key 屬性名
         * @returns {null|string|int|float|boolean|array|object}
         */
        this.getNodeAttr = function ($node, key) {
            let attr = null
            switch (key) {
                case 'value':
                    attr = $node.find('>.value').html()
                    attr = (attr === undefined) ? {} : attr //有子層的情況就不會有 div.value
                    break;
                case 'ui-value':
                    attr = $node.find('>.desc').data('ui-value')
                    break;
                case 'ui-desc':
                    attr = $node.find('>.desc').data('ui-desc')
                    break;
                case 'is-check':
                    attr = $node.find('>.desc').data('is-check')
                    break;
                case 'check-type':
                    attr = $node.find('>.desc').data('check-type')
                    break;
                case 'is-check-message':
                    attr = $node.find('>.desc').data('is-check-message')
                    break;
                case 'is-bean':
                    attr = $node.find('>.key').data('is-bean')
                    break;
                case 'bean-mapping':
                    attr = $node.find('>.key').data('bean-mapping')
                    break;
                case 'source':
                    let method = $node.find('>.source').attr('data-method') || ''
                    let v = $node.find('>.source').attr('data-value') || ''
                    if (method || v) {
                        attr = method + ':' + v
                    }
                    break;
                default: //key, type, desc ...
                    if (config.nodeAttrArr.indexOf(key)===-1) return null
                    attr = $node.find(`>.${key}`).html()
                    break;
            }
            return attr ? attr : (key === 'value') ? "" : null
        }
        /**
         * 取得單一節點的json (不含子節點)
         * @param {$selector} $node
         * @returns {{}}
         */
        this.getNodeSingleJson = function ($node) {
            let json = {}
            config.nodeAttrArr.forEach(function (v, i) {
                if (v === 'key') return
                let v2 = tool.getNodeAttr($node, v)
                if (v2 !== null) {
                    json[v] = v2
                }
            })
            //轉換資料型態
            if (json.type && json.value) {
                try {
                    //string時的前處理
                    if (typeof json.value === 'string') {
                        json.value = json.value.trim()
                        if (json.value.indexOf('<span') === 0) {
                            json.value = $(json.value).html().trim()
                        }
                    }
                    //依型態不同做轉換
                    switch (json.type) {
                        case 'string':
                            break
                        case 'int':
                            json.value = parseInt(json.value, 10)
                            break
                        case 'float':
                            json.value = parseFloat(json.value)
                            break
                        case 'boolean':
                            if (json.value === 'true') {
                                json.value = true
                            } else if (json.value === 'false') {
                                json.value = false
                            } else {
                                throw {'message': 'boolean error', 'suggestion': '請嘗試將範例值改為 true 或 false'}
                            }
                            break
                        case 'array':
                            if (typeof json.value === 'object') { //如果是從getNodeAttr()取得的值，value預設會是{}
                                json.value = {} //array在查到子節點時才會轉為[]並push上去
                            } else if (typeof json.value === 'string') {
                                json.value = JSON.parse(json.value)
                                if (!Array.isArray(json.value)) {
                                    throw {'message': 'array error', 'suggestion': '請嘗試將範例值改為陣列格式如 ["A", "B", "C"]'}
                                }
                            } else {
                                throw {'message': 'array error'}
                            }
                            break
                        case 'object':
                            json.value = json.value
                            break
                    }
                } catch (e) {
                    console.error(e)
                    let type = `<br/>轉換型態 <label style="color: #a092ec">${json.type}</label> 時發生錯誤`
                    let desc = json.desc ? `<br/>範例說明：<label style="background-color: #fad6aa">${json.desc}</label>` : ''
                    let v = `<br/>範例值：<label style="color: #ff8c00">${json.value}</label>`
                    let suggestion = e.suggestion ? `<br/><br/>建議：<br/>${e.suggestion}` : ''
                    csApi.alert(`${this.getNodeRootByEle($node)}${type}${desc}${v}${suggestion}`)
                    throw 'value 轉換 type型態 發生錯誤'
                }
            }
            return json
        }

        /**
         * 取得viewer的json
         * @returns {{}}
         */
        this.getViewerValue = function () {
            let json = {}
            deepCatch(json, this.getNodeEleList())

            //遞迴取值
            function deepCatch(nodeJson, $nodes) {
                if ($nodes.length === 0) {
                    return null
                } else {
                    $nodes.each(function () {
                        //取得節點key值
                        let key = tool.getNodeAttr($(this), 'key')
                        if (key) {
                            //取得完整屬性
                            nodeJson[key] = tool.getNodeSingleJson($(this))
                            //取得子節點
                            if (tool.isJsonOrArrayJson(nodeJson[key]['value'])) { //有子層
                                if (nodeJson[key]['type'] && nodeJson[key]['type'] === 'array') { //ArrayJson [{}]
                                    nodeJson[key]['value'] = []
                                    $(this).find('>.node').each(function(i){
                                        nodeJson[key]['value'][i] = {}
                                        deepCatch(nodeJson[key]['value'][i], tool.getNodeEleList($(this)))
                                    })
                                } else {
                                    deepCatch(nodeJson[key]['value'], tool.getNodeEleList($(this)))
                                }
                            }
                        }
                    })
                }
            }

            return json
        }

        /**
         * 取得節點路徑
         * @param {$selector} $node 目標節點
         * @param {null} nodeRoot 不要填
         * @returns {string}
         */
        this.getNodeRootByEle = function ($node, nodeRoot) {
            nodeRoot = nodeRoot || ''
            if ($node[0] && $node.parent().hasClass('node')) {
                nodeRoot =
                    this.getNodeRootByEle($node.parent(), nodeRoot) + (nodeRoot === '' ? '.' + $node.find('>.key').html() : '')
            } else {
                nodeRoot += (nodeRoot === '' ? '' : '.') + $node.find('>.key').html()
            }
            if ($node.find('>.type').html() === 'array' && $node.find('>.value').length === 0) {
                nodeRoot += $node.find('.type:first').html() === 'array' ? '[0]' : ''
            }
            return nodeRoot
        }

        /**
         * 設定viewer
         * @param json
         * @returns {*}
         */
        this.setViewerValue = function (oldJson) {
            if (typeof oldJson === 'string') {
                oldJson = JSON.parse(oldJson);
            }
            let json = null
            //清空
            csApi.$jsonViewer.empty()
            //判斷arrayJson or json
            if (Array.isArray(json)) { //arrayJson
                json = $.extend(true, [], oldJson)
                deepSetViewer(csApi.$jsonViewer, json[0])
            } else { //json
                json = $.extend(true, {}, oldJson)
                deepSetViewer(csApi.$jsonViewer, json)
            }

            //遞迴建立viewer
            function deepSetViewer($node, nodeJson) {
                for (let key in nodeJson) {
                    //創建結點
                    let $nodeEle = $(config.csApiDefineEle.node)
                    //設定各個屬性
                    let isHasChild = true //有子節點
                    config.nodeAttrArr.forEach(function(key2, i){
                        switch (key2) {
                            case 'key':
                                $nodeEle.find('>.key:first').html(key)
                                break;
                            case 'type':
                                $nodeEle.find('>.type:first').html(nodeJson[key].type || '')
                                $nodeEle.find('>.type:first').attr('data-value', nodeJson[key].type || '')
                                break;
                            case 'value':
                                //設定value，如果有子節點，等到appedn後再處理
                                let v = nodeJson[key].value
                                if (typeof v !== 'object') {
                                    if (typeof v !== "string") {
                                        $nodeEle.find('>.value:first').html(JSON.stringify(v))
                                    } else {
                                        $nodeEle.find('>.value:first').html(v)
                                    }

                                    isHasChild = false
                                } else if (Array.isArray(v)) {
                                    $nodeEle.find('>.type:first').html('array')
                                    $nodeEle.find('>.type:first').attr('data-value', 'array')
                                    //陣列物件 [{}]
                                    if (v.length >= 1 && !Array.isArray(v[0]) && typeof v[0] === 'object') {
                                        $nodeEle.find('.value:first').remove()
                                        v.forEach(function(v2, i2){
                                            let $nodeEle2 = $(config.csApiDefineEle.node)
                                            $nodeEle2.addClass('arrayIndex')
                                            $nodeEle2.find('.key').html(i2)
                                            $nodeEle2.find('.type').html('object')
                                            deepSetViewer($nodeEle2, v2)
                                            $nodeEle.append($nodeEle2)
                                        })
                                        isHasChild = false
                                    } else { //陣列、二維陣列、非jsonArray ->直接顯示value，不做子節點的處理
                                        isHasChild = false
                                        $nodeEle.find('>.value:first').html(JSON.stringify(v))
                                    }
                                }
                                break;
                            case 'ui-value':
                                if (nodeJson[key]['ui-value'] && nodeJson[key]['ui-desc']) {
                                    //值域設定在desc的屬性
                                    $nodeEle.find('>.desc:first').attr('data-ui-value', nodeJson[key]['ui-value'])
                                    $nodeEle.find('>.desc:first').attr('data-ui-desc', nodeJson[key]['ui-desc'])

                                    let uiValueArr = (nodeJson[key]['ui-value']+'').split('|,|')
                                    let uiDescArr = (nodeJson[key]['ui-desc']+'').split('|,|')
                                    let showUiValueArr = []
                                    uiValueArr.forEach(function(v, i){
                                        let st = `${v} (${uiDescArr[i]})`
                                        showUiValueArr.push(st)
                                    })
                                    $nodeEle.find('>.desc:first').attr('data-show-ui-value', showUiValueArr.join(' | '))
                                }
                                break;
                            case 'ui-desc': //ui-value已做
                                break;
                            case 'is-check':
                                if (nodeJson[key]['is-check'] && nodeJson[key]['check-type']) {
                                    //狀態查核點設定在desc的屬性
                                    $nodeEle.find('>.desc:first').attr('data-is-check', nodeJson[key]['is-check'])
                                    $nodeEle.find('>.desc:first').attr('data-check-type', nodeJson[key]['check-type'])
                                }
                                break;
                            case 'check-type': //is-check已做
                                break;
                            case 'is-check-message':
                                if (nodeJson[key]['is-check-message']) {
                                    //狀態查核提示說明點設定在desc的屬性
                                    $nodeEle.find('>.desc:first').attr('data-is-check-message', nodeJson[key]['is-check-message'])
                                }
                                break;
                            case 'is-bean':
                                if (nodeJson[key]['is-bean']) {
                                    //bean設定在key的屬性
                                    $nodeEle.find('>.key:first').attr('data-is-bean', nodeJson[key]['is-bean'])
                                }
                                break;
                            case 'bean-mapping':
                                if (nodeJson[key]['bean-mapping']) {
                                    //bean-mapping設定在key的屬性
                                    $nodeEle.find('>.key:first').attr('data-bean-mapping', nodeJson[key]['bean-mapping'])
                                }
                                break;
                            case 'source':
                                let source = nodeJson[key][key2] || ''
                                let method = (source) ? source.split(':')[0] : ''
                                let v2 = (source) ? source.split(':')[1] : ''
                                $nodeEle.find(`.${key2}:first`).attr('data-method', method).attr('data-value', v2)
                                break;
                            default: //desc ...
                                $nodeEle.find(`.${key2}:first`).html(nodeJson[key][key2] || '')
                                break;
                        }
                    })
                    //新增
                    $node.append($nodeEle)
                    //設定子節點
                    if (isHasChild) {
                        $nodeEle.find('.value').remove()
                        deepSetViewer($nodeEle, nodeJson[key].value)
                    }
                }
            }

            //掛上nowMode、nowJsonName、nowSendMethod
            csApi.$jsonViewer.find('.node').addClass(csApi.nowMode).addClass(csApi.nowJsonName).addClass(csApi.nowSendMethod)


            //init一些節點事件
            csApi.initMenuOnViewerReady.run()

            return json
        }

        /**
         * 設定editor
         * @param json
         */
        this.setEditorValue = function (json) {
            csApi.codeMirror.setValue(syntaxHighlight(json))

            //格式化json
            function syntaxHighlight(json) {
                if (typeof json != 'string') {
                    json = JSON.stringify(json, undefined, 2);
                }
                json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    return match;
                });
            }
        }
        /**
         * 取得json的key-value
         * @param {json} originalJson 原始的完整json
         * @returns {{json}} key-value
         */
        this.getJsonKeyValue = function (originalJson) {
            let oldJson = $.extend(true, {}, originalJson)
            let json = {}
            deepJson(json, oldJson)

            function deepJson(nodeJson, node) {
                for (let key in node) {
                    //檢查是否為Json或ArrayJson
                    if (tool.isJsonOrArrayJson(node[key].value)) {
                        if (Array.isArray(node[key].value)) {
                            nodeJson[key] = []
                            node[key].value.forEach(function(node2, i2) {
                                nodeJson[key][i2] = {}
                                deepJson(nodeJson[key][i2], node2)
                            })
                        } else {
                            nodeJson[key] = $.extend(true, {}, node[key].value)
                            deepJson(nodeJson[key], node[key].value)
                        }
                    } else {
                        nodeJson[key] = node[key].value
                    }
                }
            }

            return json
        }

        /**
         * 取得json的key-value
         * @param {json} originalJson 原始的完整json
         * @returns {{json}} key-value
         */
        this.getJsonFull = function (originalJson) {
            let oldJson = $.extend(true, {}, originalJson)
            let json = {}
            deepJson(json, oldJson)

            function deepJson(nodeJson, node) {
                for (let key in node) {
                    //檢查是否為Json或ArrayJson
                    if (tool.isJsonOrArrayJson(node[key])) {
                        if (Array.isArray(node[key])) {
                            let newNode = $.extend(true, [], node[key]) //深拷貝，避免值被重設
                            nodeJson[key] = {'value': [{}], 'type': 'array'}
                            deepJson(nodeJson[key].value[0], newNode[0])
                        } else {
                            nodeJson[key] = {'value': {}, 'type': 'object'}
                            deepJson(nodeJson[key].value, node[key])
                        }
                    } else {
                        let type = typeof node[key]
                        if (type === 'number') { //判斷是否為int / float
                            type = (node[key] + '').indexOf('.') === -1 ? 'int' : 'float'
                        }
                        nodeJson[key] = {'value': node[key], 'type': type}
                    }
                }
            }

            return json
        }

        /**
         * 檢查是否為Json或ArrayJson
         * @param node 要檢查的節點
         * @returns {boolean} true=是Json或ArrayJson
         */
        this.isJsonOrArrayJson = function (node) {
            if (Array.isArray(node)) {
                if (node.length === 0) {
                    return false
                } else if (Array.isArray(node[0])) {
                    return false
                } else if (typeof node[0] === 'object') {
                    return true
                } else {
                    return false
                }
            } else if (typeof node === 'object') {
                return true
            } else {
                false
            }
        }
    }

    //編輯值域
    this.editUiValue = new Fn_editUiValue(this)

    //編輯值域
    function Fn_editUiValue(p) {
        this.name = 'editUiValue'
        this.parent = p
        //modal彈窗
        this.modal = new modal(this)

        function modal(p) {
            this.parent = p
            //createModal
            this.create = function () {
                if ($e.find(`#modal_${this.parent.name}`).length !== 0) {
                    $e.find(`[id='modal_${this.parent.name}']`).remove()
                }
                $e.append(config.modal.editUiValue)
            }
            //showModal
            this.show = function ($e_desc) {
                let isCheckPoint = csApi.registerCheck.hasPoint($e_desc)
                this.create()
                let $target = $e.find(`#modal_${this.parent.name}`)
                $target.find('#modal_editUiValue_subTitle').html($e_desc.html()+`(${$e_desc.parent().find(".key:first").html()})`)
                //把值填上
                let uiValueArr = $e_desc.attr('data-ui-value')
                uiValueArr = uiValueArr ? uiValueArr.split('|,|') : []
                let uiDescArr = $e_desc.attr('data-ui-desc')
                uiDescArr = uiDescArr ? uiDescArr.split('|,|') : []
                let checkTypeArr = $e_desc.attr('data-check-type')
                checkTypeArr = checkTypeArr ? checkTypeArr.split('|,|') : []
                uiValueArr.forEach(function (v, i) {
                    $target.find('#modal_editUiValue_body').find('.modal_uiValue:last').html(v)
                    if (isCheckPoint) {
                        $target.find('#modal_editUiValue_body').find('.modal_checkType:last').val(checkTypeArr[i])
                    }
                    $target.find('#modal_editUiValue_body').find('.modal_uiDesc:last').html(uiDescArr[i]).keyup()
                })
                //顯示狀態查核點 checkType 自動填入按鈕
                if (isCheckPoint) {
                    $target.find('#modal_checkType_title, .modal_checkType, #modal_editUiValue_autoSetCheckType').removeClass('hide')
                }else {
                    $target.find('#modal_checkType_title, .modal_checkType, #modal_editUiValue_autoSetCheckType').addClass('hide')
                }
                //把目標desc填到data裡
                $target.data('$e_desc', $e_desc)
                $target.modal('show')
            }
            //新增或移除div欄位，在uiDesc在keyup時
            this.addOrRemoveDiv = function (that) {
                let isCheckPoint = ($(that).parent().find('.modal_checkType:first').hasClass('hide')===false);
                let showHide = isCheckPoint ? '' : 'hide';
                //查看是否是
                let v = that.innerHTML
                let $next = $(that).parent().next()
                let $divs = $next.length > 0 ? $next.find('>.modal_uiValue, >.modal_uiDesc') : null
                //uiDesc被刪光的話，要清除下一個兄弟節點row
                if (v === '') {
                    if ($next.length > 0) {
                        if ($divs[0].innerHTML == '' && $divs[1].innerHTML == '') {
                            $next.remove()
                        }
                    }
                } else { //uiDesc有填寫的話，若為最後一個div，則新增一個兄弟節點row
                    if ($next.length === 0) {
                        let $div = $(`
							<div class="form-group row">
								<div class="modal_uiValue" contenteditable="true"></div>
								<div class="modal_uiDesc" contenteditable="true" onkeyup="document.getElementById('${csApi.e.id}').csApi.editUiValue.modal.addOrRemoveDiv(this)"></div>
								<select class="modal_checkType ${showHide}">
								    <option value="success">成功</option>
								    <option value="error">失敗</option>
								    <option value="other">其他</option>
                                </select>
							</div>
						`)
                        $(that).parent().after($div)
                    }
                }
            }
            //編輯值域-確定btn
            this.addUiValue = function () {
                let uiValueArr = [], uiDescArr = [], showUiValue = [], checkTypeArr = []
                let $target = $e.find(`#modal_${this.parent.name}`)
                let $uiValueSelector = $target.find('.modal_uiValue')
                let $uiDescSelector = $target.find('.modal_uiDesc')
                let $checkTypeSelector = $target.find('.modal_checkType')
                let isCheckPoint = csApi.registerCheck.hasPoint($target.data('$e_desc'))
                $uiValueSelector.each(function (i) {
                    if (this.innerHTML !== '') { //uiValue沒有值的話，不管uiDesc有無值都不新增
                        uiValueArr.push(this.innerHTML+'')
                        uiDescArr.push($uiDescSelector[i].innerHTML+'')
                        let st = uiValueArr[uiValueArr.length - 1]
                        st += ` (${uiDescArr[uiDescArr.length - 1]})`
                        showUiValue.push(st)
                        if (isCheckPoint) {
                            checkTypeArr.push($checkTypeSelector[i].value)
                        }
                    }
                })
                $target.data('$e_desc').attr('data-ui-value', uiValueArr.join('|,|'))
                    .attr('data-ui-desc', uiDescArr.join('|,|'))
                    .attr('data-show-ui-value', showUiValue.join(' | '))
                if (isCheckPoint) {
                    $target.data('$e_desc').attr('data-check-type', checkTypeArr.join('|,|'))
                }
                $target.modal('hide')
                $('.modal-backdrop').hide()
            }
            //自動填入狀態查核狀態
            this.autoSetCheckType = function () {
                let $target = $e.find(`#modal_${this.parent.name}`)
                $target.find('#modal_editUiValue_body').find('>.row:not(:first):not(:first)').remove()
                //把值填上
                csApiConfig.checkTypeList.forEach(function (json, i) {
                    $target.find('#modal_editUiValue_body').find('.modal_uiValue:last').html(json.uiValue)
                    $target.find('#modal_editUiValue_body').find('.modal_checkType:last').val(json.checkType)
                    $target.find('#modal_editUiValue_body').find('.modal_uiDesc:last').html(json.uiDesc).keyup()
                })
                //顯示狀態查核點 checkType
                $target.find('#modal_checkType_title, .modal_checkType').removeClass('hide')
            }
        }
    }

    //狀態查核
    this.registerCheck = new Fn_registerCheck(this)
    //狀態查核
    function Fn_registerCheck(p) {
        this.name = 'registerCheck'
        this.parent = p
        //設定為 狀態查核點
        this.setPoint = function($e_desc){
            //移除原檢查點並新增新的checkType
            $e.find('.desc[data-is-check]').removeAttr('data-is-check').removeAttr('data-check-type')
            //註冊
            $e_desc.attr('data-is-check', 'true')
            let checkType = []
            if ($e_desc.attr('data-ui-value')) {
                $e_desc.attr('data-ui-value').split('|,|').forEach(function (attr, i) {
                    checkType.push('success')
                })
            }
            $e_desc.attr('data-check-type', checkType.join('|,|'))
            //顯示值域
            csApi.editUiValue.modal.show($e_desc)
        }
        //檢查是否已設定 狀態查核點
        this.hasPoint = function($e_desc){
            if ($e_desc) {
                return ($e_desc.attr('data-is-check')=='true');
            }else{
                return ($e.find('.desc[data-is-check]').length>0);
            }
        }
        //設定為 狀態查核提示說明點
        this.setMessagePoint = function($e_desc){
            //移除原 狀態查核提示說明點 並新增新的
            $e.find('.desc[data-is-check-message]').removeAttr('data-is-check-message')
            //註冊
            $e_desc.attr('data-is-check-message', 'true')
        }
        //檢查是否已設定 狀態查核提示說明點
        this.hasMessagePoint = function($e_desc){
            if ($e_desc) {
                return ($e_desc.attr('data-is-check-message')=='true');
            }else{
                return ($e.find('.desc[data-is-check-message]').length>0);
            }
        }
    }

    //bean
    this.bean = new Fn_bean(this)
    //bean
    function Fn_bean(p) {
        this.name = 'bean'
        this.parent = p
        //設定為 bean
        this.setPoint = function($e_key){
            //註冊
            $e_key.attr('data-is-bean', 'true')
        }
        //移除 bean
        this.removeBeanPoint = function($e_key){
            //註冊
            $e_key.removeAttr('data-is-bean')
        }
        //檢查是否已設定狀態查核點
        this.hasPoint = function($e_key){
            return ($e_key.attr('data-is-bean')=='true');
        }
        //設定 bean-mapping
        this.setBeanMapping = function($e_key, beanMapping){
            //註冊
            $e_key.attr('data-bean-mapping', beanMapping)
        }
        //移除 bean-mapping
        this.removeBeanMapping = function($e_key){
            //註冊
            $e_key.removeAttr('data-bean-mapping')
        }
        //檢查是否已設定 bean-mapping
        this.hasBeanMapping = function($e_key){
            return ($e_key.attr('data-bean-mapping')=='true');
        }
    }

    //編輯type
    this.editType = new Fn_editType(this)

    //編輯資料型態
    function Fn_editType(p) {
        this.name = 'editType'
        this.parent = p
        //modal彈窗
        this.modal = new modal(this)

        function modal(p) {
            this.parent = p
            //createModal
            this.create = function () {
                $e.find(`#modal_${this.parent.name}`).remove()
                $e.find(`#modal_${this.parent.name}_divDropdownMenu`).remove()
                $e.append(config.modal.editType)
            }
            //showModal
            this.show = function (e) {
                if (csApi.isNowMode('editMode') === false) return;
                csApi.editType.modal.create()
                let $target = $e.find(`#divDropdownMenu`)
                $(e).after($target)
                csApi.$jsonViewer.find('.type.dropdownActive').removeClass('dropdownActive')
                $(e).addClass('dropdownActive')
                $(e).attr('data-toggle', "dropdown")
                //醒目提示當前選擇
                let type = e.innerHTML
                $target.find('.dropdown-item').each(function () {
                    $(this).removeClass('bg-secondary').removeClass('text-white')
                    if ($(this).html() === type) {
                        $(this).addClass('bg-secondary').addClass('text-white')
                    }
                })
            }
            //設定type的值
            this.setTypeValue = function (e) {
                let typeValue = $(e).html()
                csApi.$jsonViewer.find('.type.dropdownActive').attr('data-value', typeValue).html(typeValue)
            }
        }
    }

    //設定參數來源
    this.editSource = new Fn_editSource(this)

    //設定參數來源
    function Fn_editSource(p) {
        this.name = 'editSource'
        this.parent = p
        //localStorage資訊
        this.localStorageInfo = {
            "paramNameArr": [],
            "exampleArr": [],
            "remarkArr": []
        }
        /**
         * 取得localStorage資訊，存入 csApi.editSource.localStorageInfo
         * @param sourceId
         */
        this.getLocalStorageInfo = function(sourceId){
            //查詢參數
            let gFormJS = nursing.createGForm()
            gFormJS.searchParamGF.status = 'Y'
            gFormJS.searchParamGF.formType = 'propLocalStorage'
            gFormJS.searchParamGF.sourceId = sourceId
            gFormJS.searchParamGF.itemCondition = ''
            gFormJS.searchParamGF.counts = 1
            // gFormJS.searchParamGF.beginIndex = 0

            //取得資料
            gFormJS.getGFormListWithConditionPlus(gFormJS, function(gForms){
                console.log('=====gForms')
                console.log(gForms)
                let paramNameArr = [], exampleArr = [], remarkArr = []
                for (let i=0, len=gForms.length; i<len; ++i){
                    let form = gForms[i].gForm
                    let map = form.gformItemMap
                    map.getValue = function(key) { return (this[key]) ? this[key].itemValue : ''}
                    csApi.editSource.localStorageInfo.paramNameArr = map.getValue('paramName').split('||,||')
                    csApi.editSource.localStorageInfo.exampleArr = map.getValue('example').split('||,||')
                    csApi.editSource.localStorageInfo.remarkArr = map.getValue('remark').split('||,||')
                }
            }, function(e){
                $('#modal_alert_msg').html('取得發生錯誤')
                $('#modal_alert').modal('show')
                console.error(e)
            })
        }
        //modal彈窗
        this.modal = new modal(this)

        function modal(p) {
            this.parent = p
            //createModal
            this.create = function () {
                if ($e.find(`#modal_${this.parent.name}`).length !== 0) {
                    $e.find(`[id='modal_${this.parent.name}']`).remove()
                }
                $e.append(config.modal.editSource)
                //寫上localStorage參數
                let $select = $e.find(`#modal_${this.parent.name}`).find('.modal_sourceValue_localStorage')
                csApi.editSource.localStorageInfo.paramNameArr.forEach(function(paramName, i){
                    // let example = csApi.editSource.localStorageInfo.exampleArr[i]
                    let remark = csApi.editSource.localStorageInfo.remarkArr[i]
                    $select.append(`
                        <option value="${paramName}">${paramName} - ${remark}</option>
                    `)
                })
            }
            //showModal
            this.show = function ($e_source) {
                $e_source = $($e_source)
                this.create()
                let $target = $e.find(`#modal_${this.parent.name}`)
                //title
                $target.find('#modal_editSource_subTitle').html($e_source.parent().find('.key:first').html())
                //把值填上
                let method = $e_source.attr('data-method') || ''
                let v = $e_source.attr('data-value') || ''
                $target.find('#modal_editSource_body').find('.modal_sourceValue').html(v || v);
                $target.find('#modal_editSource_body').find('.modal_sourceMethod').val(method).change();
                //把目標source填到data裡
                $target.data('$e_source', $e_source)
                $target.modal('show')
            }
            //設定參數來源-確定btn
            this.addSource = function () {
                let $target = $e.find(`#modal_${this.parent.name}`)
                let method = $target.find('.modal_sourceMethod').val()
                let v = $target.find('.modal_sourceValue').html()
                $target.data('$e_source').attr('data-method', method)
                    .attr('data-value', v)
                $target.modal('hide')
                $('.modal-backdrop').hide()
            }
            //設定參數來源-method方法onchange
            this.changeMethod = function () {
                let $target = $e.find(`#modal_${this.parent.name}`)
                let method = $target.find('#modal_editSource_body').find('.modal_sourceMethod').val()
                let v = $target.find('.modal_sourceValue').html()
                let $remark = $('#modal_editSource_remark')
                let $sourceValue = $target.find('#modal_editSource_body').find('.modal_sourceValue')
                let $local = $target.find('#modal_editSource_body').find('.modal_sourceValue_localStorage')
                let $gFormData = $target.find('#modal_editSource_body').find('.modal_sourceValue_gFormData')
                $sourceValue.show()
                $local.hide()
                $gFormData.hide()
                let st = ''
                switch (method) {
                    case 'local':
                        st = '預先暫存於localStorage的資料，若查無對應的資料，請聯繫工程師處理'
                        if ($local.find(`option[value='${v}']`).length>0){
                            $local.val(v).change()
                        }else{
                            $local.val('').change()
                        }
                        $local.show()
                        $sourceValue.hide()
                        break
                    case 'form':
                        st = '指畫面上的表單元件，若表單的beanName沒有統一，建議於csForm引入API時再客製化"編輯"調整'
                        break
                    case 'eleId':
                        st = '指畫面上的element，通常用於一些查詢用、不需要存入data的html元素'
                        break
                    case 'gFormData':
                        st = '指變數"gForm"，可取得formId、creatorId等等的gForm資料，通常用於儲存表單後由後端回傳的gForm資料'
                        if ($gFormData.find(`option[value='${v}']`).length>0){
                            $gFormData.val(v).change()
                        }else{
                            $gFormData.val('').change()
                        }
                        $gFormData.show()
                        $sourceValue.hide()
                        break
                    case 'externalData':
                        st = '透過「彈出外部資料元件(externalData)」傳參'
                        break
                    case 'urlParameters':
                        st = '透過xxx.html?aaa=xxx傳參'
                        st += '</br>※可用於externalData元件取得參數'
                        break
                    case 'gFormJspUrlParameters':
                        st = '透過gForm.jsp?aaa=xxx傳參'
                        break
                    case 'fixed':
                    default:
                        break
                }
                if (st=='') {
                    $remark.hide()
                }else{
                    $remark.html('※'+st)
                    $remark.show()
                }
            }
            //設定參數來源-value  onchange
            this.changeValue = function (that) {
                let $target = $e.find(`#modal_${this.parent.name}`)
                let $sourceValue = $target.find('#modal_editSource_body').find('.modal_sourceValue')
                $sourceValue.html(that.value)
            }
        }
    }

    //點擊"setting"
    this.clickSetting = new Fn_clickSetting(this)

    //設定
    function Fn_clickSetting(p) {
        this.name = 'clickSetting'
        this.parent = p
        this.key = ''
        //modal彈窗
        this.modal = new modal(this)

        function modal(p) {
            this.parent = p
            //createModal
            this.create = function () {
                if ($e.find(`#modal_${this.parent.name}_${this.parent.key}`).length !== 0) {
                    $e.find(`[id='modal_${this.parent.name}_${this.parent.key}']`).remove()
                }
                $e.append(config.modal[`clickSetting_${this.parent.key}`])
            }
            //showModal
            this.show = function ($e_setting) {
                $e_setting = $($e_setting)
                this.parent.key = $e_setting.parent().find('.key').html()
                this.create()
                this[`show_${this.parent.key}`]($e_setting)
            }
            /**
             * xmlApi > configFiles
             * showModal
             * @param that
             */
            this.show_configFiles = function ($e_setting) {
                let $target = $e.find('#modal_clickSetting_configFiles')
                //把值填上
                let source = $e_setting.parent().find('.source:first').attr('data-value')
                let vArr = (source) ? JSON.parse(source) : []
                vArr.forEach(function (v, i) {
                    $target.find('#modal_clickSetting_configFiles_body').find('.modal_value:last').html(v.replace('.xml', '')).keyup()
                })
                //把目標setting填到data裡
                $target.data('$e_setting', $e_setting)
                $target.modal('show')
            }
            /**
             * xmlApi > params
             * showModal
             * @param that
             */
            this.show_params = function ($e_setting) {
                let $target = $e.find('#modal_clickSetting_params')
                //把值填上
                let $nodes = $e_setting.parent().find('>.node.arrayIndex')
                let keyArr = [], valueArr = [], typeArr = [], formatArr = []
                $nodes.each(function(i){
                    let $key = $(this).find('>.node:eq(0)').find('>.source')
                    let $value = $(this).find('>.node:eq(1)').find('>.source')
                    let $type = $(this).find('>.node:eq(2)').find('>.source')
                    let $format = $(this).find('>.node:eq(3)').find('>.source')
                    keyArr.push({method: $key.attr('data-method'), v: $key.attr('data-value')})
                    valueArr.push({method: $value.attr('data-method'), v: $value.attr('data-value')})
                    typeArr.push({method: $type.attr('data-method'), v: $type.attr('data-value')})
                    formatArr.push({method: $format.attr('data-method'), v: $format.attr('data-value')})
                })
                let $body = $target.find('#modal_clickSetting_params_body')
                keyArr.forEach(function(keyJson, i){
                    $body.find('.modal_value:last').html(valueArr[i].method+':'+valueArr[i].v)
                    $body.find('.modal_type:last').val(typeArr[i].v)
                    $body.find('.modal_format:last').html(formatArr[i].v)
                    $body.find('.modal_key:last').html(keyJson.v).keyup()
                })
                //把目標setting填到data裡
                $target.data('$e_setting', $e_setting)
                $target.modal('show')
            }
            //新增或移除div欄位
            this.addOrRemoveDiv = function (that) {
                this[`addOrRemoveDiv_${this.parent.key}`](that)
            }
            /**
             * xmlApi > configFiles
             * 新增或移除div欄位，在value在keyup時
             * @param that
             */
            this.addOrRemoveDiv_configFiles = function (that) {
                let v = that.innerHTML
                let $next = $(that).parent().next()
                let $divs = $next.length > 0 ? $next.find('>.modal_value') : null
                //value被刪光的話，要清除下一個兄弟節點row
                if (v === '') {
                    if ($next.length > 0) {
                        if ($divs[0].innerHTML == '' && $divs[0].innerHTML == '') {
                            $next.remove()
                        }
                    }
                } else { //value有填寫的話，若為最後一個div，則新增一個兄弟節點row
                    if ($next.length === 0) {
                        let $div = $(`
							<div class="form-group row">
								<div class="modal_value" contenteditable="true" onkeyup="document.getElementById('${csApi.e.id}').csApi.clickSetting.modal.addOrRemoveDiv(this)"></div>
								<div class="modal_file_extension" contenteditable="false">.xml</div>
							</div>
						`)
                        $(that).parent().after($div)
                    }
                }
            }
            /**
             * xmlApi > params
             * 新增或移除div欄位，在key在keyup時
             * @param that
             */
            this.addOrRemoveDiv_params = function (that) {
                let v = that.innerHTML
                let $next = $(that).parent().next()
                let $divs = $next.length > 0 ? $next.find('>.modal_key') : null
                //value被刪光的話，要清除下一個兄弟節點row
                if (v === '') {
                    if ($next.length > 0) {
                        if ($divs[0].innerHTML == '' && $divs[0].innerHTML == '') {
                            $next.remove()
                        }
                    }
                } else { //value有填寫的話，若為最後一個div，則新增一個兄弟節點row
                    if ($next.length === 0) {
                        let $div = $(`
							<div class="form-group row">
								<div class="modal_key" contenteditable="true" onkeyup="document.getElementById('${csApi.e.id}').csApi.clickSetting.modal.addOrRemoveDiv(this)"></div>
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
						`)
                        $(that).parent().after($div)
                    }
                }
            }
            //確定btn
            this.okBtn = function () {
                this[`okBtn_${this.parent.key}`]()
            }
            /**
             * xmlApi > configFiles
             * 寫入 source
             * @param that
             */
            this.okBtn_configFiles = function () {
                let vArr = []
                let $target = $e.find(`#modal_${this.parent.name}_${this.parent.key}`)
                let $source = $target.data('$e_setting').parent().find('.source:first')
                let $valueSelector = $target.find('.modal_value')
                let $fileExtensionSelector = $target.find('.modal_file_extension')
                $valueSelector.each(function (i) {
                    if (this.innerHTML !== '') { //value沒有值的話就不新增
                        vArr.push((this.innerHTML+''+$fileExtensionSelector[i].innerHTML).trim())
                    }
                })
                $source.attr('data-value', JSON.stringify(vArr))
                    .attr('data-method', 'fixed')
                $target.modal('hide')
                $('.modal-backdrop').hide()
            }
            /**
             * xmlApi > params
             * 寫入 source
             * @param that
             */
            this.okBtn_params = function () {
                let keyArr = [], valueArr = [], typeArr = [], formatArr = []
                let $target = $e.find(`#modal_${this.parent.name}_${this.parent.key}`)
                let $keySelector = $target.find('.modal_key')
                let $valueSelector = $target.find('.modal_value')
                let $typeSelector = $target.find('.modal_type')
                let $formatSelector = $target.find('.modal_format')
                $keySelector.each(function (i) {
                    if (this.innerHTML !== '') { //key沒有值的話就不新增
                        keyArr.push({method: 'fixed', v: this.innerHTML.trim()})
                        typeArr.push({method: 'fixed', v: $typeSelector[i].value})
                        formatArr.push({method: 'fixed', v: $formatSelector[i].innerHTML.trim()})
                        let v = $valueSelector[i].innerHTML.trim()
                        let vArr = (v && v.indexOf(':')) ? v.split(':') : ['', '']
                        valueArr.push({method: vArr[0], v: vArr[1]})
                    }
                })

                //重設 params 底下的節點
                let $nodeParams = $target.data('$e_setting').parent()
                $nodeParams.find('.node').remove()
                keyArr.forEach(function(keyJson, i){
                    //創建結點
                    let $nodeArrayIndex = $(config.csApiDefineEle.node)
                    let $nodeKey = $(config.csApiDefineEle.node)
                    let $nodeValue = $(config.csApiDefineEle.node)
                    let $nodeType = $(config.csApiDefineEle.node)
                    let $nodeFormat = $(config.csApiDefineEle.node)
                    let vType = '' //value的type
                    $nodeArrayIndex.append($nodeKey)
                    $nodeArrayIndex.append($nodeValue)
                    $nodeArrayIndex.append($nodeType)
                    $nodeArrayIndex.append($nodeFormat)
                    $nodeArrayIndex.addClass(csApi.nowMode).addClass(csApi.nowJsonName).addClass(csApi.nowSendMethod)
                    $nodeArrayIndex.find('.node').addClass(csApi.nowMode).addClass(csApi.nowJsonName).addClass(csApi.nowSendMethod)
                    switch (typeArr[i].v) {
                        case 'stringArray':
                        case 'intArray':
                        case 'floatArray':
                            vType = 'array'
                            break
                        case 'string':
                        case 'int':
                        case 'float':
                        case 'boolean':
                            vType = typeArr[i].v
                            break
                        default:
                            vType = 'string'
                            break
                    }

                    //設置 index
                    $nodeArrayIndex.addClass('arrayIndex')
                    $nodeArrayIndex.find('.key').html(i)
                    $nodeArrayIndex.find('.type').html('object')
                    //設置 key
                    $nodeKey.find('.key').html('key')
                    $nodeKey.find('.type').html('string')
                    $nodeKey.find('.source').attr('data-method', keyJson.method).attr('data-value', keyJson.v)
                    //設置 value
                    $nodeValue.find('.key').html('value')
                    $nodeValue.find('.type').html(vType)
                    $nodeValue.find('.source').attr('data-method', valueArr[i].method).attr('data-value', valueArr[i].v)
                    //設置 type
                    $nodeType.find('.key').html('type')
                    $nodeType.find('.type').html('string')
                    $nodeType.find('.source').attr('data-method', typeArr[i].method).attr('data-value', typeArr[i].v)
                    //設置 format
                    $nodeFormat.find('.key').html('format')
                    $nodeFormat.find('.type').html('string')
                    $nodeFormat.find('.source').attr('data-method', formatArr[i].method).attr('data-value', formatArr[i].v)

                    //append
                    $nodeParams.append($nodeArrayIndex)
                })
                $target.modal('hide')
                $('.modal-backdrop').hide()
            }
        }
    }

    this.alertCount = 0
    /**
     * 顯示alert
     * @param {string} msg 顯示的訊息
     */
    this.alert = function (msg) {
        if (this.$alert === null || this.$alert.length === 0) {
            this.$e.find('#modal_csApi_alert').remove()
            this.$e.append(config.modal.alert)
            this.$alert = this.$e.find('#modal_csApi_alert')
        }
        //假如已經顯示了就不蓋掉
        if (this.alertCount > 0) {
            return
        }
        //假如已經顯示了就不蓋掉
        if (this.$alert.attr('aria-modal') !== 'true') {
            this.$alert.find('#modal_csApi_alert_msg').html(msg)
            this.$alert.modal('show')
        }
        ++this.alertCount
        setTimeout(function () {
            csApi.alertCount = 0
        }, 1000)
    }


    //在definder準備完成時init一些動作
    this.initOnDefinederReady = new (function () {
        //當前節點顯示於top bar
        this.showNowNodeToTopBar = new (function () {
            // click時
            this.onClick = function () {
                csApi.$e.click(function () {
                    let $ele = csApi.$jsonViewer.find(':focus')
                    if ($ele[0] && $ele.parent().hasClass('node')) {
                        let $node = $ele.parent()
                        let nodeStr = csApi.tool.getNodeRootByEle($node)
                        csApi.$nodeStr.attr('data-value', nodeStr)
                        csApi.$nodeStr.html(nodeStr.replace(/\./g, ' > ').replace(/\[\0\]/g, ' [ ]'))
                    }
                })
            }
            //mouseOver顯示
            this.onMouseOver = function ($target) {
                if (!$target) {
                    $target = csApi.$e.find('.node');
                }
                $target.find('>.' + config.nodeAttrArr.join(', >.')).mouseover(function () {
                    //如果有focus，就不要mouseOver顯示
                    let $ele = csApi.$jsonViewer.find(':focus')
                    if ($ele[0]) return;
                    //顯示節點路徑
                    let $node = $(this).parent()
                    let nodeStr = csApi.tool.getNodeRootByEle($node)
                    csApi.$nodeStr.attr('data-value', nodeStr)
                    csApi.$nodeStr.html(nodeStr.replace(/\./g, ' > ').replace(/\[\0\]/g, ' [ ]'))
                })
            }
        })()
        //init文字編輯器
        this.initCodeMirror = function () {
            csApi.$jsonEditor.show()
            csApi.codeMirror = CodeMirror.fromTextArea(document.getElementById('jsonEditor'), {
                mode:           "application/ld+json",
                lineNumbers:    true,
                lineWrapping:   true,
                theme:          "monokai",
                viewportMargin: Infinity
            });
            csApi.$jsonEditor.hide()
        }

        this.run = function () {
            //當前節點顯示於top bar
            this.showNowNodeToTopBar.onClick()
            this.showNowNodeToTopBar.onMouseOver()
            //init文字編輯器
            this.initCodeMirror()
        }
    })()

    //在viewer準備完成時init一些東西右鍵選單
    this.initMenuOnViewerReady = new (function () {
        //init右鍵選單
        this.contextMenu = function (nodeSelector) {
            //key
            $.contextMenu({
                selector: `${nodeSelector} .editMode.receiveParam>.key`,
                callback: function (key, options, event) {
                    let m = "clicked: " + key;
                    let $target = options.$trigger
                    let $targetDesc = options.$trigger.parent().find('.desc:first')
                    //註冊為bean
                    if (key == "beanSetPoint") {
                        csApi.bean.setPoint($target)
                    }
                    //移除bean
                    else if (key == "beanRemovePoint") {
                        csApi.bean.removeBeanPoint($target)
                        //移除bean同時也要移除beanMapping
                        csApi.bean.removeBeanMapping($target)
                    }
                    //設定beanMapping
                    else if (key == "beanSetMapping") {
                        let text = $target.attr('data-bean-mapping') ? $target.attr('data-bean-mapping') : $target.html()
                        //設定beanMapping同時也要設定bean
                        csApi.bean.setPoint($target)
                        csApi.bean.setBeanMapping($target, window.prompt('設定beanMapping', text))
                    }
                    //移除beanMapping
                    else if (key == "beanRemoveMapping") {
                        csApi.bean.removeBeanMapping($target)
                    }
                    //註冊為狀態查核點
                    else if (key == "registerCheckPoint") {
                        //本身不可以是 狀態查核提示說明點
                        if (csApi.registerCheck.hasMessagePoint($targetDesc)) {
                            csApi.alert('不可以設定在狀態查核提示說明點上')
                            return true;
                        }
                        //已存在 狀態查核點
                        if (csApi.registerCheck.hasPoint()) {
                            //本身就是 狀態查核點
                            if (csApi.registerCheck.hasPoint($targetDesc)) {
                                csApi.editUiValue.modal.show($targetDesc)
                                return true;
                            }else if (!confirm('檢查到已存在 狀態查核點\n是否移除原檢查點並註冊此節點為新查核點？')) {
                                return true;
                            }
                        }
                        csApi.registerCheck.setPoint($targetDesc)
                    }
                    //註冊為狀態查核提示說明點
                    else if (key == "registerCheckMessagePoint") {
                        //本身不可以是 狀態查核點
                        if (csApi.registerCheck.hasPoint($targetDesc)) {
                            csApi.alert('不可以設定在狀態查核點上')
                            return true;
                        }
                        //已存在 狀態查核提示說明點
                        if (csApi.registerCheck.hasMessagePoint()) {
                            //本身就是 狀態查核提示說明點
                            if (csApi.registerCheck.hasMessagePoint($targetDesc)) {
                                return true;
                            }else if (!confirm('檢查到已存在 狀態查核提示說明點\n是否移除原提示說明點並註冊此節點為新提示說明點？')) {
                                return true;
                            }
                        }
                        csApi.registerCheck.setMessagePoint($targetDesc)
                    }
                },
                items:    {
                    "beanSetPoint": {name: "註冊為bean", icon: "beanSetPoint"},
                    "beanRemovePoint": {name: "移除bean", icon: "beanRemovePoint"},
                    "beanSetMapping": {name: "設定beanMapping", icon: "beanSetMapping"},
                    "beanRemoveMapping": {name: "移除beanMapping", icon: "beanRemoveMapping"},
                    "sep1":        "---------",
                    "registerCheckPoint": {name: "註冊為狀態查核點", icon: "registerCheckPoint"},
                    "registerCheckMessagePoint": {name: "註冊為狀態查核提示說明點", icon: "registerCheckMessagePoint"},
                    "sep2":        "---------",
                    "quit":        {
                        name: "離開", icon: function () {
                            // return 'context-menu-icon context-menu-icon-quit';
                        }
                    }
                }
            })
            $.contextMenu({
                selector: `${nodeSelector} .editMode>.desc`,
                callback: function (key, options, event) {
                    let m = "clicked: " + key;
                    let $target = options.$trigger
                    if (key == "editUiValue") {
                        csApi.editUiValue.modal.show($target)
                    }
                },
                items:    {
                    "editUiValue": {name: "編輯值域", icon: "editUiValue"},
                    "sep2":        "---------",
                    "quit":        {
                        name: "離開", icon: function () {
                            // return 'context-menu-icon context-menu-icon-quit';
                        }
                    }
                }
            })
        }

        this.run = function () {
            //init右鍵選單
            this.contextMenu(csApi.$jsonViewer.selector)
        }
    })()


    this.e.csApi = this

    //初始化
    this.run = function () {
        console.log("csApiDefine -> 初始化")
        //創建 csApiDefine
        this.create()
        //createModal
        this.editUiValue.modal.create()
        this.editType.modal.create()
        this.editSource.modal.create()
        //在definder準備完成時init一些動作
        this.initOnDefinederReady.run()

        // $ele.find(".type").click(function(){
        // 	let typeArr = ["string", "int", "boolean", "array", "object"]
        // })
    };
    this.run();
}