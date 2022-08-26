package com.inqgen.nursing.dynamic.form.bean;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;

/**
 * @author RainKing
 * @since  2019/11/13 14:27
 */
public class GformItemExcelConf {
    private String itemDesc;
    private String itemNameInner;
    private String itemNameOuter;
    private String dataFormat;
    private Boolean uniqueItem;
    private boolean showDesc=true;
    private String script;

    public GformItemExcelConf(DynamicFormItem itemTemplate) {
        if (itemTemplate != null) {
            this.itemTemplate = itemTemplate;
            itemDesc = itemTemplate.getTitle();
            itemNameInner = itemTemplate.getName();
            itemNameOuter = itemTemplate.getName();
            dataFormat = getDataFormat(itemTemplate);
            uniqueItem = getUniqueItem();
            showDesc = true;
            script = null;
        }
    }

    public GformItemExcelConf() {
    }

    public String getItemDesc() {
        return itemDesc;
    }

    public void setItemDesc(String itemDesc) {
        this.itemDesc = itemDesc;
    }

    public String getItemNameInner() {
        return itemNameInner;
    }

    public void setItemNameInner(String itemNameInner) {
        this.itemNameInner = itemNameInner;
    }

    public String getItemNameOuter() {
        return itemNameOuter;
    }

    public void setItemNameOuter(String itemNameOuter) {
        this.itemNameOuter = itemNameOuter;
    }

    DynamicFormItem itemTemplate;

    public DynamicFormItem getItemTemplate() {
        return itemTemplate;
    }

    public void setItemTemplate(DynamicFormItem itemTemplate) {
        this.itemTemplate = itemTemplate;
    }

    JSONObject typeFormatJSON;

    public JSONObject getTypeFormatJSON(DynamicFormItem itemTemplate) {
        if (typeFormatJSON == null&&itemTemplate!=null) {
            String typeFormat = itemTemplate.getTypeFormat();
            if (JSON.isValidObject(typeFormat)) {
                typeFormatJSON = JSON.parseObject(typeFormat);
            }
        }
        return typeFormatJSON;
    }

    public JSONObject getTypeFormatJSON() {
        return typeFormatJSON;
    }

    public void setTypeFormatJSON(JSONObject typeFormatJSON) {
        this.typeFormatJSON = typeFormatJSON;
    }

    public String getDataFormat(DynamicFormItem itemTemplate) {
        if (itemTemplate != null && StringUtils.isBlank(dataFormat)) {
            setDataFormatFromJSON(getTypeFormatJSON(itemTemplate));
        }
        return dataFormat;
    }

    public void setDataFormatFromJSON(JSONObject typeFormatJSON) {
        if (typeFormatJSON!=null&&typeFormatJSON.containsKey("date")&&JSON.isValidObject(typeFormatJSON.getString("date"))) {
            JSONObject date = typeFormatJSON.getJSONObject("date");
            if (date.containsKey("format")) {
                dataFormat = date.getString("format");
            }
        }
    }

    public void setDataFormat(String dataFormat) {
        this.dataFormat = dataFormat;
    }

    public String getDataFormat() {
        return dataFormat;
    }

    public boolean isUniqueItem() {
        if (uniqueItem == null) {
                return BooleanUtils.toBoolean(getUniqueItem());
        }else{
            return uniqueItem;
        }
    }

    public void setUniqueItem(Boolean uniqueItem) {
        this.uniqueItem = uniqueItem;
    }

    public Boolean getUniqueItem() {
        if (getTypeFormatJSON(itemTemplate) != null) {
            uniqueItem = typeFormatJSON.getBooleanValue("uniqueItem");
        }
        return uniqueItem;
    }

	public boolean isShowDesc() {
		return showDesc;
	}

	public void setShowDesc(boolean showDesc) {
		this.showDesc = showDesc;
	}

	public String getScript() {
		return script;
	}

	public void setScript(String script) {
		this.script = script;
	}
}
