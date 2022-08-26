package com.inqgen.nursing.dynamic.form.bean;

import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 * @author RainKing
 * @date 2020/2/26 12:00
 */
@XStreamAlias("FormParamTemplate")
public class FormParamTemplate {
    /**入參名稱*/
    private String key;
    /**參數來源： 表單(form) / 表單子項(formItem) / 病人資訊(patBasic) / 固定值(fixed) / 日期家族(dateFamily) / 自定義(customize)*/
    private String source;
    /**匹配條件： 相等(=) / 大於(>) / 小於(<) / 不等於(<>) / 不為null(is not null) null(is null) / 區間(between)*/
    private String condition;
    /**參數值： 當source為formItem，此欄填beanName*/
    private String value;
    /**備註*/
    private String remark;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
