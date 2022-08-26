function CsFamilyTreeRoot(that) {
    //建立人物物件 (根節點)
    this.createObj = function(){
        //設定root座標
        that.root.left = that.data.left
        that.root.top = that.data.top
        //移除物件
        that.cvs.remove(that.getObj(that.data))
        //建立物件
        that["createPerson"+that.data.personType](that.data, {
            left:          that.root.left,
            top:           that.root.top,
            lockMovementY: false, //是否禁止垂直拖動
        })
        //建立人物物件
        that.createPersonObj(that.data)
    }
}