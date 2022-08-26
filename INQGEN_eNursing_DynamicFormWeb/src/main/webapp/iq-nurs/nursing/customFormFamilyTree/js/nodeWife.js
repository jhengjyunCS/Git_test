function CsFamilyTreeWife(that) {
    //建立人物物件
    this.createObj = function(obj){
        //與上一層建立鏈結
        obj.node.husband = obj.parent
        //創建本節點
        that["createPerson"+obj.personType](obj)
    }
    //建立人物關係線
    this.createRelation = function(obj, objWife){
        let position = that.getPositionInfo(obj)
        let positionWife =  that.getPositionInfo(objWife)
        let polyline = []

        //起點
        //如果丈夫在妻子的左邊，取丈夫的右邊當起始點
        if (position.center.x < positionWife.center.x) {
            polyline.push(position.middleRight)
        } else {
            polyline.push(position.middleLeft)
        }
        //終點
        //如果丈夫在妻子的左邊，取妻子的左邊當終點
        if (position.center.x < positionWife.center.x) {
            polyline.push(positionWife.middleLeft)
        } else {
            polyline.push(positionWife.middleRight)
        }

        //畫線
        that.createPersonLine(`lineWife_${obj.type}_${objWife.type}`, polyline, {
            //虛線
            strokeDashArray: [5, 5]
        })
    }
}