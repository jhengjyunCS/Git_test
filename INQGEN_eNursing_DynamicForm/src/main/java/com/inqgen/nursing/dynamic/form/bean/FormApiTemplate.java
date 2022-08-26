package com.inqgen.nursing.dynamic.form.bean;

import com.thoughtworks.xstream.annotations.XStreamAlias;

import java.util.List;

/**
 * @author RainKing
 * @date 2020/2/26 11:48
 */
@XStreamAlias("FormApiTemplate")
public class FormApiTemplate {
    /**api名稱(限英文)(會當成INIT內的functionName)*/
    private String title;
    /**備註*/
    private String remark;
    /**動態表單API*/
    private String url;
    /**單一表單(true) / 多表單(false)*/
    private Boolean singleTable;
    /**簡單條件(easy) / 複雜條件(complex)*/
    private String condition;
    /**多表單 and 複雜條件 才需要填api的url，否則為false*/
    private String callApiUrl;
    /**自定義入參(customize) / 固定入參(fixed)*/
    private String paramModel;
    /**需要客製化處理(customize) / 自動ditto(ditto)*/
    private String act;
    /**當url為動態表單API時，將會以form/gForm的表單欄位為條件*/
    private List<FormParamTemplate> paramsDynamicForm;
    /**當url為資料庫view時，...*/
    private List<FormParamTemplate> paramsViewTable;
    /***/
    private List<FormParamTemplate> params;
    /***/
    private List<FormDittoTemplate> dittos;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getSingleTable() {
        return singleTable;
    }

    public void setSingleTable(Boolean singleTable) {
        this.singleTable = singleTable;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getCallApiUrl() {
        return callApiUrl;
    }

    public void setCallApiUrl(String callApiUrl) {
        this.callApiUrl = callApiUrl;
    }

    public String getParamModel() {
        return paramModel;
    }

    public void setParamModel(String paramModel) {
        this.paramModel = paramModel;
    }

    public String getAct() {
        return act;
    }

    public void setAct(String act) {
        this.act = act;
    }

    public List<FormParamTemplate> getParamsDynamicForm() {
        return paramsDynamicForm;
    }

    public void setParamsDynamicForm(List<FormParamTemplate> paramsDynamicForm) {
        this.paramsDynamicForm = paramsDynamicForm;
    }

    public List<FormParamTemplate> getParamsViewTable() {
        return paramsViewTable;
    }

    public void setParamsViewTable(List<FormParamTemplate> paramsViewTable) {
        this.paramsViewTable = paramsViewTable;
    }

    public List<FormParamTemplate> getParams() {
        return params;
    }

    public void setParams(List<FormParamTemplate> params) {
        this.params = params;
    }

    public List<FormDittoTemplate> getDittos() {
        return dittos;
    }

    public void setDittos(List<FormDittoTemplate> dittos) {
        this.dittos = dittos;
    }
}
