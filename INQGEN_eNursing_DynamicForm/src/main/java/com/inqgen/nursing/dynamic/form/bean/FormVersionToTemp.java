package com.inqgen.nursing.dynamic.form.bean;

import java.sql.Timestamp;

public class FormVersionToTemp {
    /**流水號**/
    private String id;
    /**表單類型**/
    private String formType;
    /**表單模型**/
    private String formModel;
    /**版號**/
    private int version;
    /**時戳**/
    private Timestamp ts;
    DynamicFormTemplate template;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFormType() {
        return formType;
    }

    public void setFormType(String formType) {
        this.formType = formType;
    }

    public String getFormModel() {
        return formModel;
    }

    public void setFormModel(String formModel) {
        this.formModel = formModel;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public Timestamp getTs() {
        return ts;
    }

    public void setTs(Timestamp ts) {
        this.ts = ts;
    }

    public DynamicFormTemplate getTemplate() {
        return template;
    }

    public void setTemplate(DynamicFormTemplate template) {
        this.template = template;
    }
}
