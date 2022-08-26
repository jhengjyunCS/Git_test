package com.inqgen.nursing.dynamic.form.bean;

import lombok.Data;

import java.util.Date;
@Data
public class GFormIndex {

    private String id;
    private String sourceId;
    private String formId;
    private String formType;
    private String creatorId;
    private String creatorName;
    private Date createTime;
    private String modifyUserId;
    private String modifyUserName;
    private Date modifyTime;
    private String status;
    private String versionNo;
	public String getId() {
		return id;
	}
	public String getSourceId() {
		return sourceId;
	}
	public String getFormId() {
		return formId;
	}
	public String getFormType() {
		return formType;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public String getModifyUserId() {
		return modifyUserId;
	}
	public String getModifyUserName() {
		return modifyUserName;
	}
	public Date getModifyTime() {
		return modifyTime;
	}
	public String getStatus() {
		return status;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
	}
	public void setFormId(String formId) {
		this.formId = formId;
	}
	public void setFormType(String formType) {
		this.formType = formType;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public void setModifyUserId(String modifyUserId) {
		this.modifyUserId = modifyUserId;
	}
	public void setModifyUserName(String modifyUserName) {
		this.modifyUserName = modifyUserName;
	}
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getVersionNo() {
		return versionNo;
	}
	public void setVersionNo(String versionNo) {
		this.versionNo = versionNo;
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
}
