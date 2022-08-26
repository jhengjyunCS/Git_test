package com.inqgen.nursing.dynamic.form.bean;

import java.sql.Timestamp;
import java.util.Date;

public class FormFrame {
	/**流水號**/
	String id;
	/**表單類型**/
	String formType;
	/**表單模型**/
	String frameModel;
	/**模版文本**/
	String content;
	/**版號**/
	int version;
	/**備註**/
	String note;
	/**目前formVersion和fromFrame的最新版號版號**/
	int newVersionNo;
	/**時戳**/
	Timestamp ts;

	private String creatorId;
	private String creatorName;
	private Date createTime;
	private String modifyUserId;
	private String modifyUserName;
	private Date modifyTime;
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
	public String getFrameModel() {
		return frameModel;
	}
	public void setFrameModel(String frameModel) {
		this.frameModel = frameModel;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public int getVersion() {
		return version;
	}
	public void setVersion(int version) {
		this.version = version;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public int getNewVersionNo() {
		return newVersionNo;
	}
	public void setNewVersionNo(int newVersionNo) {
		this.newVersionNo = newVersionNo;
	}
	public Timestamp getTs() {
		return ts;
	}
	public void setTs(Timestamp ts) {
		this.ts = ts;
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

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
}
