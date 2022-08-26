function CsFamilyTreeSon(that) {
    //建立人物物件
    this.createObj = function(obj){
        //與上一層建立鏈結
        let sex = obj.personInfo.sex
        let parentSex = obj.parent.personInfo.sex
        if (parentSex === 'M') {
            //爸爸
            obj.node.father = obj.parent
            //媽媽
            let nodeWife = that.getNode(obj.parent.node.wife)
            if (nodeWife !== null) {
                obj.node.mother = nodeWife
                nodeWife.node.son = obj
            }
        } else if (parentSex === 'F') {
            //媽媽
            obj.node.mother = obj.parent
            //爸爸
            let nodeHusband = that.getNode(obj.parent.node.husband)
            if (nodeHusband !== null) {
                obj.node.father = nodeHusband
                nodeHusband.node.son = obj
            }
        }
        //建立本節點
        that["createPerson"+obj.personType](obj)
    }
    //建立人物關係線
    this.createRelation = function(obj, objSon){
        let position = that.getPositionInfo(obj)
        let positionSon =  that.getPositionInfo(objSon)
        let polyline = []

        let nodeFather = that.getNode(objSon.node.father)
        let nodeMother = that.getNode(objSon.node.mother)
        let positionFather = (nodeFather) ? that.getPositionInfo(nodeFather) : null
        let positionMother = (nodeMother) ? that.getPositionInfo(nodeMother) : null

        //起點
        //如果小孩"有"爸爸 & 媽媽，取兩個的中間
        if (nodeFather && nodeMother) {
            polyline.push({
                x: (positionFather.center.x + positionMother.center.x) / 2,
                y: position.center.y
            })
        } else {
            polyline.push({
                x: (position.center.x + position.center.x) / 2,
                y: position.middleBottom.y
            })
        }
        //轉折1
        polyline.push({
            x: polyline[polyline.length-1].x,
            y: positionSon.middleTop.y - that.config.eachNodeHeight
        })
        //轉折2
        polyline.push({
            x: positionSon.middleTop.x,
            y: polyline[polyline.length-1].y
        })
        //終點
        polyline.push(positionSon.middleTop)

        //畫線
        that.createPersonLine(`lineSon_${obj.type}_${objSon.type}`, polyline, {
        })
    }
}