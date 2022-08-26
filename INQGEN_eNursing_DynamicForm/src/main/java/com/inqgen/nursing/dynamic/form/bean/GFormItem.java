package com.inqgen.nursing.dynamic.form.bean;

import java.util.Date;

public class GFormItem {
    private String formItemId;
    private String fdocId;
    private String formId;
    private String itemKey;
    private String itemValue;
    private String otherValue;
    private String creatorId;
    private String creatorName;
    private Date createTime;
    private String modifyUserId;
    private String modifyUserName;
    private Date modifyTime;

    public String getFormItemId() {
        return formItemId;
    }

    public void setFormItemId(String formItemId) {
        this.formItemId = formItemId;
    }

    public String getFdocId() {
        return fdocId;
    }

    public void setFdocId(String fdocId) {
        this.fdocId = fdocId;
    }

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

    public String getItemKey() {
        return itemKey;
    }

    public void setItemKey(String itemKey) {
        this.itemKey = itemKey;
    }

    public String getItemValue() {
        return itemValue;
    }

    public void setItemValue(String itemValue) {
        this.itemValue = itemValue;
    }

    public String getOtherValue() {
        return otherValue;
    }

    public void setOtherValue(String otherValue) {
        this.otherValue = otherValue;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getModifyUserId() {
        return modifyUserId;
    }

    public void setModifyUserId(String modifyUserId) {
        this.modifyUserId = modifyUserId;
    }

    public String getModifyUserName() {
        return modifyUserName;
    }

    public void setModifyUserName(String modifyUserName) {
        this.modifyUserName = modifyUserName;
    }
}
