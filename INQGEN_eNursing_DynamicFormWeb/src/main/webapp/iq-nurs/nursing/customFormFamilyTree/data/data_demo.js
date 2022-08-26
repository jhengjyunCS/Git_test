const data_basic = {
    // 在fabric內，type等同於ID
    "type": "XXX",
    "personType": "Rect",
    "left": 500,
    "top": 50,
    "radius": 1,
    "text": "",
    "angleValue": 0,
    "opacity": 1.0,
    "width": 100,
    "height": 50,
    "desc": "XXX",
    "personInfo": {
        "name": "王曉明",
        "sex": "",
        "birthday": "",
        "phoneNumber1": "0912345678",
        "phoneNumber2": "",
        "e-mail": "",
        "address": "",
        "remark": ""
    },
    /**
     * 節點內有三種狀態
     * #### [] -> 沒有下一個分支
     * #### [{}] -> 有N個分支
     * #### {} -> 僅引用 (csFamilyTree.run的時候才創建)
     * ####
     * #### 例如
     * ####{
     * >
     * ####    "type": "XXX",
     * ####    "node": {
     * >>
     * ####        "daughter": [{
     * >>>
     * ####            "type": "XXX's daughter",
     * ####            "node": {
     * >>>>
     * ####                "father": {
     * >>>>>
     * ####                    "type": "XXX", ...
     * >>>>
     * ####                }
     * >>>
     * ####            }
     * >>
     * ####        }]
     * >
     * ####    }
     *
     * ####}
     */
    "node": {
        "father":         [],
        "mother":         [],
        "husband":        [],
        "wife":           [],
        "elderBrother":   [],
        "youngerBrother": [],
        "elderSister":    [],
        "youngerSister":  [],
        "son":            [],
        "daughter":       []
    }
}

const data_demo = {
    "type": "xxx",
    "personType": "Rect",
    "left": 200,
    "top": 20,
    "radius": 1,
    "text": "",
    "angleValue": 0,
    "opacity": 1.0,
    "width": 100,
    "height": 50,
    "desc": "XXX",
    "relation": {
        "lineType": "" //線的類型
    },
    "personInfo": {
        "name": "王曉明",
        "sex": "M",
        "birthday": "",
        "phoneNumber1": "0912345678",
        "phoneNumber2": "",
        "e-mail": "",
        "address": "",
        "remark": ""
    },
    "node": {
        "father": [],
        "mother": [],
        "husband": [],
        "wife": [{
            "type": "b1",
            "personType": "Rect",
            "left": 200,
            "top": 0,
            "radius": 1,
            "text": "",
            "angleValue": 0,
            "opacity": 1.0,
            "width": 100,
            "height": 50,
            "desc": "XXX",
            "personInfo": {
                "name": "王小美",
                "sex": "F",
                "birthday": "",
                "phoneNumber1": "0912345678",
                "phoneNumber2": "",
                "e-mail": "",
                "address": "",
                "remark": ""
            },
            "node": {
                "father":         [],
                "mother":         [],
                "husband":        [],
                "wife":           [],
                "elderBrother":   [],
                "youngerBrother": [],
                "elderSister":    [],
                "youngerSister":  [],
                "son":            [],
                "daughter":       []
            }
        }],
        "elderBrother": [],
        "youngerBrother": [],
        "elderSister": [],
        "youngerSister": [],
        "son": [
            {
                "type": "c1",
                "personType": "Rect",
                "left": 0,
                "top": 100,
                "radius": 1,
                "text": "",
                "angleValue": 0,
                "opacity": 1.0,
                "width": 100,
                "height": 50,
                "desc": "XXX",
                "personInfo": {
                    "name": "王老大",
                    "sex": "M",
                    "birthday": "",
                    "phoneNumber1": "0912345678",
                    "phoneNumber2": "",
                    "e-mail": "",
                    "address": "",
                    "remark": ""
                },
                "node": {
                    "father": [],
                    "mother": [],
                    "husband": [],
                    "wife": [],
                    "elderBrother": [],
                    "youngerBrother": [],
                    "elderSister": [],
                    "youngerSister": [],
                    "son": [{
                        "type": "c11",
                        "personType": "Rect",
                        "left": -75,
                        "top": 200,
                        "radius": 1,
                        "text": "",
                        "angleValue": 0,
                        "opacity": 1.0,
                        "width": 100,
                        "height": 50,
                        "desc": "XXX",
                        "personInfo": {
                            "name": "王老大-大",
                            "sex": "M",
                            "birthday": "",
                            "phoneNumber1": "0912345678",
                            "phoneNumber2": "",
                            "e-mail": "",
                            "address": "",
                            "remark": ""
                        },
                        "node": {
                            "father":         [],
                            "mother":         [],
                            "husband":        [],
                            "wife":           [],
                            "elderBrother":   [],
                            "youngerBrother": [],
                            "elderSister":    [],
                            "youngerSister":  [],
                            "son":            [],
                            "daughter":       []
                        }
                    },
                    {
                        "type": "c12",
                        "personType": "Rect",
                        "left": 75,
                        "top": 200,
                        "radius": 1,
                        "text": "",
                        "angleValue": 0,
                        "opacity": 1.0,
                        "width": 100,
                        "height": 50,
                        "desc": "XXX",
                        "personInfo": {
                            "name": "王老大-二",
                            "sex": "M",
                            "birthday": "",
                            "phoneNumber1": "0912345678",
                            "phoneNumber2": "",
                            "e-mail": "",
                            "address": "",
                            "remark": ""
                        },
                        "node": {
                            "father":         [],
                            "mother":         [],
                            "husband":        [],
                            "wife":           [],
                            "elderBrother":   [],
                            "youngerBrother": [],
                            "elderSister":    [],
                            "youngerSister":  [],
                            "son":            [],
                            "daughter":       []
                        }
                    }],
                    "daughter": []
                }
            },
            {
                "type": "c2",
                "personType": "Rect",
                "left": 200,
                "top": 100,
                "radius": 1,
                "text": "",
                "angleValue": 0,
                "opacity": 1.0,
                "width": 100,
                "height": 50,
                "desc": "XXX",
                "personInfo": {
                    "name": "王老二",
                    "sex": "M",
                    "birthday": "",
                    "phoneNumber1": "0912345678",
                    "phoneNumber2": "",
                    "e-mail": "",
                    "address": "",
                    "remark": ""
                },
                "node": {
                    "father":         [],
                    "mother":         [],
                    "husband":        [],
                    "wife":           [],
                    "elderBrother":   [],
                    "youngerBrother": [],
                    "elderSister":    [],
                    "youngerSister":  [],
                    "son":            [],
                    "daughter":       []
                }
            }],
        "daughter": []
    }
}