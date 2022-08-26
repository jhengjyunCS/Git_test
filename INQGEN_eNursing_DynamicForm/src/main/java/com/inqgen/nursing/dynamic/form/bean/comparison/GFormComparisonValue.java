package com.inqgen.nursing.dynamic.form.bean.comparison;

import java.util.Date;

/**
 * @Author wang
 * @Date 2022/2/10 16:13
 */
public class GFormComparisonValue {

    private String eventType;
    private String xmlOrder;
    private String itemKey;
    private String itemTitle;
    private String itemType;
    private String vKey;
    private String uiValue;
    private int uiScore;
    private String uiDesc;
    private String uiDescsim;
    private String hasOther;
    private String otherTitle;
    private String xmlName;
    private Date tm;

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

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getvKey() {
        return vKey;
    }

    public void setvKey(String vKey) {
        this.vKey = vKey;
    }

    public String getUiValue() {
        return uiValue;
    }

    public void setUiValue(String uiValue) {
        this.uiValue = uiValue;
    }

    public int getUiScore() {
        return uiScore;
    }

    public void setUiScore(int uiScore) {
        this.uiScore = uiScore;
    }

    public String getUiDesc() {
        return uiDesc;
    }

    public void setUiDesc(String uiDesc) {
        this.uiDesc = uiDesc;
    }

    public String getUiDescsim() {
        return uiDescsim;
    }

    public void setUiDescsim(String uiDescsim) {
        this.uiDescsim = uiDescsim;
    }

    public String getHasOther() {
        return hasOther;
    }

    public void setHasOther(String hasOther) {
        this.hasOther = hasOther;
    }

    public String getOtherTitle() {
        return otherTitle;
    }

    public void setOtherTitle(String otherTitle) {
        this.otherTitle = otherTitle;
    }

    public String getXmlName() {
        return xmlName;
    }

    public void setXmlName(String xmlName) {
        this.xmlName = xmlName;
    }

    public Date getTm() {
        return tm;
    }

    public void setTm(Date tm) {
        this.tm = tm;
    }

}
