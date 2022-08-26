package com.inqgen.nursing.dynamic.form.bean.comparison;

import java.util.Date;
import java.util.List;

/**
 * @Author wang
 * @Date 2022/2/10 16:13
 */
public class GFormComparisonItem {

    private String eventType;
    private String xmlOrder;
    private String itemKey;
    private String itemTitle;
    private String oKey;
    private String itemType;
    private String xmlName;
    private String remark;
    private Date tm;
    private List<GFormComparisonValue> comparisonValues;

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getXmlOrder() {
        return xmlOrder;
    }

    public void setXmlOrder(String xmlOrder) {
        this.xmlOrder = xmlOrder;
    }

    public String getItemKey() {
        return itemKey;
    }

    public void setItemKey(String itemKey) {
        this.itemKey = itemKey;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public String getoKey() {
        return oKey;
    }

    public void setoKey(String oKey) {
        this.oKey = oKey;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getXmlName() {
        return xmlName;
    }

    public void setXmlName(String xmlName) {
        this.xmlName = xmlName;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Date getTm() {
        return tm;
    }

    public void setTm(Date tm) {
        this.tm = tm;
    }

    public List<GFormComparisonValue> getComparisonValues() {
        return comparisonValues;
    }

    public void setComparisonValues(List<GFormComparisonValue> comparisonValues) {
        this.comparisonValues = comparisonValues;
    }
}
