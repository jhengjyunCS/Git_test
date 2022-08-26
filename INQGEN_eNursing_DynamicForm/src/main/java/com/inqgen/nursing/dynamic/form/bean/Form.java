package com.inqgen.nursing.dynamic.form.bean;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Form {
	/*** 主健*/
	
	String formId;
	/**表單類型**/
	
	String formType;
	/**表單模版**/
	
	String formModel;
	/**住院號**/
	
	String encId;
	/**病例號**/
	
	String patientId;
	/**護理站**/
	
	String stationId;
	/**總分**/
	
	String totalScore;
	/**評估時間**/
	
	Date evaluationTime;
	/**創建時間**/
	
	Date createTime;
	/**床號**/
	
	String bedId;
	/**創建者ID**/
	
	String createUserId;
	/***創建者名字**/
	
	String createUserName;
	
	/**評估項**/
	
	List<FormItem> items;
	/****/
    Map<String, FormItem> formItems;
    
    String recordPoid;
	
    String content;
	
    String itemstring;
	
	/**新加簽名接收人*/
	
	String receiveUserId;
	
	/**新加簽名接收姓名*/
	
	String receiveUserName;
	
	/**新加簽名接收時間*/
	
	Date receiveTime;
	
	/*** 關聯主健*/
	
	String ofFormId;
	/**
	 *鎮靜評估表CALM的主鍵id
	 */
	
	private String calmId;
	
	private String eventIds;
	
	private String versionNo;
	public String getCalmId() {
		return calmId;
	}

	public void setCalmId(String calmId) {
		this.calmId = calmId;
	}
	private String signatureId;
	private String signatureName;
	private Date  signatureDate;

	public String getSignatureId() {
		return signatureId;
	}

	public void setSignatureId(String signatureId) {
		this.signatureId = signatureId;
	}

	public String getSignatureName() {
		return signatureName;
	}

	public void setSignatureName(String signatureName) {
		this.signatureName = signatureName;
	}

	public Date getSignatureDate() {
		return signatureDate;
	}

	public void setSignatureDate(Date signatureDate) {
		this.signatureDate = signatureDate;
	}
	
	public String getReceiveUserId() {
		return receiveUserId;
	}
	public void setReceiveUserId(String receiveUserId) {
		this.receiveUserId = receiveUserId;
	}
	public String getReceiveUserName() {
		return receiveUserName;
	}
	public void setReceiveUserName(String receiveUserName) {
		this.receiveUserName = receiveUserName;
	}
	public Date getReceiveTime() {
		return receiveTime;
	}
	public void setReceiveTime(Date receiveTime) {
		this.receiveTime = receiveTime;
	}
	public String getItemstring() {
		return itemstring;
	}
	public void setItemstring(String itemstring) {
		this.itemstring = itemstring;
	}
	
	String formVersionId;
	
	public String getRecordPoid() {
		return recordPoid;
	}
	public void setRecordPoid(String recordPoid) {
		this.recordPoid = recordPoid;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getFormVersionId() {
		return formVersionId;
	}
	public void setFormVersionId(String formVersionId) {
		this.formVersionId = formVersionId;
	}
	public String getStates() {
		return states;
	}
	public void setStates(String states) {
		this.states = states;
	}
	String states="Y";
	
	public String getFormId() {
		return formId;
	}
	public void setFormId(String formId) {
		this.formId = formId;
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
	public String getEncId() {
		return encId;
	}
	public void setEncId(String encId) {
		this.encId = encId;
	}
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	public String getStationId() {
		return stationId;
	}
	public void setStationId(String stationId) {
		this.stationId = stationId;
	}
	public String getTotalScore() {
		return totalScore;
	}
	public void setTotalScore(String totalScore) {
		this.totalScore = totalScore;
	}
	public Date getEvaluationTime() {
		return evaluationTime;
	}
	public void setEvaluationTime(Date evaluationTime) {
		this.evaluationTime = evaluationTime;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Map<String, FormItem> getFormItems() {
		return formItems;
	}
	public Map<String, FormItem> getFormItemMap() {
		if (formItems == null&&items!=null&&items.size()>0) {
			formItems = new HashMap<String, FormItem>();
			for (FormItem formItem : items) {
				formItems.put(formItem.getItemKey(), formItem);
			}
		}
		return formItems;
	}
	public void setFormItems(Map<String, FormItem> formItems) {
		this.formItems = formItems;
	}
	public String getCreateUserId() {
		return createUserId;
	}
	public void setCreateUserId(String createUserId) {
		this.createUserId = createUserId;
	}
	public String getCreateUserName() {
		return createUserName;
	}
	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}
	public String getBedId() {
		return bedId;
	}
	public void setBedId(String bedId) {
		this.bedId = bedId;
	}
	public List<FormItem> getItems() {
		return items;
	}
	public void setItems(List<FormItem> items) {
		this.items = items;
	}

	public String getOfFormId() {
		return ofFormId;
	}

	public void setOfFormId(String ofFormId) {
		this.ofFormId = ofFormId;
	}

	public String getEventIds() {
		return eventIds;
	}

	public void setEventIds(String eventIds) {
		this.eventIds = eventIds;
	}

	public String getVersionNo() {
		return versionNo;
	}

	public void setVersionNo(String versionNo) {
		this.versionNo = versionNo;
	}
	
	
}
