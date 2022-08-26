package com.inqgen.nursing.dynamic.form.bean;

import java.sql.Timestamp;
import java.util.Date;


public class FormVersion {
	/**流水號**/
	private String id;
	/**表單類型**/
	private String formType;
	/**表單模型**/
	private String formModel;
	/**標題**/
	private String title;
	/**模版文本**/
	private String content;
	/**版號**/
	private int version;
	/**時戳**/
	private Timestamp ts;
	/**創建者**/
	private String creatorId;
	/**創建者名稱*/
	private String creatorName;
	/**創建時間*/
	private Date createTime;
	/**異動者者*/
	private String modifyUserId;
	/**異動者名稱*/
	private String modifyUserName;
	/**異動者時間*/
	private Date modifyTime;
	/**Api敘述**/
	private String apiStructure;
	
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
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
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

	public String getApiStructure() {
		return apiStructure;
	}

	public void setApiStructure(String apiStructure) {
		this.apiStructure = apiStructure;
	}
}
