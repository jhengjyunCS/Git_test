package com.inqgen.nursing.dynamic.form.bean;

import lombok.Data;

import java.util.*;

@Data
public class GForm {
    private String sourceId;
    private String fdocId;
    private String formId;
    private String formType;
    private Date evaluationTime;
    private String totalScore;
    private String formVersionId;
    private String status;
	private String creatorId;
	private String creatorName;
	private Date createTime;
	private String modifyUserId;
	private String modifyUserName;
	private Date modifyTime;
    private String versionNo;
    private String totalCounts;
    private String content;

    private List<GFormItem> gformItems;
    private Map<String, GFormItem> gformItemMap;

    public void setGformItems(List<GFormItem> gFormItems) {
        this.gformItems = gFormItems;
		setGformItemMap(gFormItems);
	}
	public void addGformItem(GFormItem gformItem){
		if (gformItems == null) {
			synchronized (this) {
				this.gformItems = new ArrayList<GFormItem>();
				this.gformItemMap = new HashMap<String, GFormItem>();
			}
		}
		gformItems.add(gformItem);
		gformItemMap.put(gformItem.getItemKey(), gformItem);
	}
	public void setGformItemMap(List<GFormItem> gFormItems) {
		if (gFormItems != null && gFormItems.size()>0) {
			gformItemMap = new HashMap<String, GFormItem>();
			for (GFormItem gFormItem : gFormItems) {
				gformItemMap.put(gFormItem.getItemKey(), gFormItem);
			}
		}
	}

	public String getSourceId() {
		return sourceId;
	}

	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
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

	public String getFormType() {
		return formType;
	}

	public Date getEvaluationTime() {
		return evaluationTime;
	}

	public String getTotalScore() {
		return totalScore;
	}

	public String getFormVersionId() {
		return formVersionId;
	}

	public String getStatus() {
		return status;
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

	public List<GFormItem> getGformItems() {
		return gformItems;
	}

	public void setFormId(String formId) {
		this.formId = formId;
	}

	public void setFormType(String formType) {
		this.formType = formType;
	}

	public void setEvaluationTime(Date evaluationTime) {
		this.evaluationTime = evaluationTime;
	}

	public void setTotalScore(String totalScore) {
		this.totalScore = totalScore;
	}

	public void setFormVersionId(String formVersionId) {
		this.formVersionId = formVersionId;
	}

	public void setStatus(String status) {
		this.status = status;
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

	public String getVersionNo() {
		return versionNo;
	}

	public void setVersionNo(String versionNo) {
		this.versionNo = versionNo;
	}

	public String getTotalCounts() {
		return totalCounts;
	}
	public void setTotalCounts(String totalCounts) {
		this.totalCounts = totalCounts;
	}
	public Map<String, GFormItem> getGformItemMap() {
		if (gformItemMap == null&&gformItems!=null&&gformItems.size()>0) {
			setGformItemMap(gformItems);
		}
		return gformItemMap;
	}

	public void setGformItemMap(Map<String, GFormItem> gformItemMap) {
		this.gformItemMap = gformItemMap;
	}

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

	public boolean containsItem(String itemKey) {
		getGformItemMap();
		if (gformItemMap != null) {
			return gformItemMap.containsKey(itemKey);
		}
		return false;
	}
}
