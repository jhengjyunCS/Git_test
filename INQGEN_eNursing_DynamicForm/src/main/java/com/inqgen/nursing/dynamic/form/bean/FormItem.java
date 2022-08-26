package com.inqgen.nursing.dynamic.form.bean;

import java.util.UUID;

public class FormItem {
	/**主健**/
	
	String ID;
	/**外健**/
	
	String formID;
	/**項目**/
	
	String itemKey;
	/**項目值**/
	
	String itemValue;
	/**其他值**/
	
	String otherValue;
	/**住院號**/
	
	String encId;
	/**病例號**/
	
	String patientId;
	/**護理站**/
	
	String stationId;
	
	public FormItem() {
		super();
	}

	public FormItem(String formID, String itemKey, String encId,
			String patientId, String stationId) {
		super();
		this.ID=UUID.randomUUID().toString();
		this.formID = formID;
		this.itemKey = itemKey;
		this.encId = encId;
		this.patientId = patientId;
		this.stationId = stationId;
	}
	
	public String getID() {
		return ID;
	}
	public void setID(String iD) {
		ID = iD;
	}
	public String getFormID() {
		return formID;
	}
	public void setFormID(String formID) {
		this.formID = formID;
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

	@Override
	public String toString() {
		return "FormItem [ID=" + ID + ", formID=" + formID + ", itemKey="
				+ itemKey + ", itemValue=" + itemValue + ", otherValue="
				+ otherValue + ", encId=" + encId + ", patientId=" + patientId
				+ ", stationId=" + stationId + "]";
	}
	
	

}
