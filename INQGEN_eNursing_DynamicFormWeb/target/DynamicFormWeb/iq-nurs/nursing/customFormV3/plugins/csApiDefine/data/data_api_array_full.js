var data_api_array_full =
{
  "sts": {
    "value": "000000",
    "type": "string",
    "desc": "狀態代碼",
    "ui-value": "000000|,|E00004|,|E00003|,|E00001",
    "ui-desc": "查詢成功|,|發生錯誤|,|查無資料|,|傳入參數有誤",
    "is-check": true,
    "check-type": "success|,|error|,|other|,|other"
  },
  "msg": {
    "value": "執行完成提示",
    "type": "string",
    "desc": "狀態說明",
    "is-check-message": true
  },
  "erc": {
    "value": "[1,3,5,7]"
  },
  "err": {
    "value": "[\"A\",\"AA\",\"CC\"]"
  },
  "val": {
    "value": {
      "SHT_NO": {
        "value": "MR00-21",
        "type": "string",
        "desc": "編號",
        "is-bean": true,
        "bean-mapping": "no"
      },
      "MTN_DEPT": {
        "value": "3058",
        "type": "string",
        "is-bean": true
      },
      "VERSION_NO": {
        "value": ""
      },
      "NOTE": {
        "value": "2018.05.02經病委會同意新增CF1070501",
        "type": "string",
        "desc": "印於頁尾文字",
        "is-bean": true
      },
      "nam_a": {
        "value": "腎臟科",
        "type": "string",
        "desc": "科別",
        "is-bean": true
      },
      "nam_f": {
        "value": "腎臟內科",
        "type": "string",
        "desc": "詳細科別"
      },
      "tObj": {
        "value": {
          "tA": {
            "value": "1",
            "is-bean": true
          },
          "tB": {
            "value": 2,
            "type": "int",
            "is-bean": true
          }
        },
        "type": "object",
        "is-bean": true
      },
      "tArr": {
        "value": [
          10,
          23,
          77
        ],
        "type": "array",
        "is-bean": true
      }
    },
    "type": "object",
    "desc": "資料"
  }
}
;