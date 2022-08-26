package com.report.unit.sett.table;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

@XStreamAlias("DynamicFormItem")
public class DynamicFormItem {
    @XStreamAsAttribute
    String uiScore;
    @XStreamAsAttribute
    String uiDesc;
    @XStreamAsAttribute
    String uiValue;
    @XStreamAsAttribute
    boolean hasOther;

    public DynamicFormItem(String uiScore, String uiDesc, String uiValue, boolean hasOther) {
        this.uiScore = uiScore;
        this.uiDesc = uiDesc;
        this.uiValue = uiValue;
        this.hasOther = hasOther;
    }

    public String getUiScore() {
        return uiScore;
    }

    public void setUiScore(String uiScore) {
        this.uiScore = uiScore;
    }

    public String getUiDesc() {
        return uiDesc;
    }

    public void setUiDesc(String uiDesc) {
        this.uiDesc = uiDesc;
    }

    public String getUiValue() {
        return uiValue;
    }

    public void setUiValue(String uiValue) {
        this.uiValue = uiValue;
    }

    public boolean isHasOther() {
        return hasOther;
    }

    public void setHasOther(boolean hasOther) {
        this.hasOther = hasOther;
    }
}
