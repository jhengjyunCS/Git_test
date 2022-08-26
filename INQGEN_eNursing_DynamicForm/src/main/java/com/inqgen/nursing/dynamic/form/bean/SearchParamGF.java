package com.inqgen.nursing.dynamic.form.bean;

import lombok.Data;

import java.util.Date;

@Data
public class SearchParamGF {

    private String formType;
    private String sourceId;
    private String[] sourceIds;
	private String fdocId;
	private String formId;
    private Date beginDate;
    private Date endDate;
    private String beginTotalScore;
    private String endTotalScore;
    private Date beginCreateTime;
    private Date endCreateTime;
    private String status;
    private String[] statusArr;
    private String userId;
    private String modifyUserId;
    private String modifyUserName;
    private Date beginModifyTime;
    private Date endModifyTime;
    private int beginVersionNo;
    private int endVersionNo;
    
    private String itemCondition;
    private int itemConditionHitCounts;

    private Boolean hasSourceId;
    private Boolean hasSourceIds;
    //在 getGFormListWithConditionPlus() 已作廢
    private Boolean hasContent;

    //查詢sql第n筆~第m筆
    //從 beginIndex 開始查 counts筆
    //僅限 getGFormListWithConditionPlus()
    private Boolean queryTotalCounts; //(程式自動給值) 是否查詢總筆數
    private String counts; //查詢c筆
    private String beginIndex; //從第n筆開始查
    private String endIndex; //(程式自動計算)  =beginIndex + counts - 1
    
    
	public String getFdocId() {
		return fdocId;
	}

	public void setFdocId(String fdocId) {
		this.fdocId = fdocId;
	}

	public String getFormType() {
		return formType;
	}
	public void setFormType(String formType) {
		this.formType = formType;
	}
	public String getSourceId() {
		return sourceId;
	}
	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
	}
	public String[] getSourceIds() {
		return sourceIds;
	}
	public void setSourceIds(String[] sourceIds) {
		this.sourceIds = sourceIds;
	}
	public String getFormId() {
		return formId;
	}
	public void setFormId(String formId) {
		this.formId = formId;
	}
	public Date getBeginDate() {
		return beginDate;
	}
	public void setBeginDate(Date beginDate) {
		this.beginDate = beginDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getBeginTotalScore() {
		return beginTotalScore;
	}
	public void setBeginTotalScore(String beginTotalScore) {
		this.beginTotalScore = beginTotalScore;
	}
	public String getEndTotalScore() {
		return endTotalScore;
	}
	public void setEndTotalScore(String endTotalScore) {
		this.endTotalScore = endTotalScore;
	}
	public Date getBeginCreateTime() {
		return beginCreateTime;
	}
	public void setBeginCreateTime(Date beginCreateTime) {
		this.beginCreateTime = beginCreateTime;
	}
	public Date getEndCreateTime() {
		return endCreateTime;
	}
	public void setEndCreateTime(Date endCreateTime) {
		this.endCreateTime = endCreateTime;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String[] getStatusArr() {
		return statusArr;
	}
	public void setStatusArr(String[] statusArr) {
		this.statusArr = statusArr;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
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
	public Date getBeginModifyTime() {
		return beginModifyTime;
	}
	public void setBeginModifyTime(Date beginModifyTime) {
		this.beginModifyTime = beginModifyTime;
	}
	public Date getEndModifyTime() {
		return endModifyTime;
	}
	public void setEndModifyTime(Date endModifyTime) {
		this.endModifyTime = endModifyTime;
	}
	public int getBeginVersionNo() {
		return beginVersionNo;
	}
	public void setBeginVersionNo(int beginVersionNo) {
		this.beginVersionNo = beginVersionNo;
	}
	public int getEndVersionNo() {
		return endVersionNo;
	}
	public void setEndVersionNo(int endVersionNo) {
		this.endVersionNo = endVersionNo;
	}
	public String getItemCondition() {
		return itemCondition;
	}
	public void setItemCondition(String itemCondition) {
		this.itemCondition = itemCondition;
	}
	public int getItemConditionHitCounts() {
		return itemConditionHitCounts;
	}
	public void setItemConditionHitCounts(int itemConditionHitCounts) {
		this.itemConditionHitCounts = itemConditionHitCounts;
	}
	public Boolean getHasSourceId() {
		return hasSourceId;
	}
	public void setHasSourceId(Boolean hasSourceId) {
		this.hasSourceId = hasSourceId;
	}
	public Boolean getHasSourceIds() {
		return hasSourceIds;
	}
	public void setHasSourceIds(Boolean hasSourceIds) {
		this.hasSourceIds = hasSourceIds;
	}

    public Boolean getHasContent() {
        return hasContent;
    }

    public void setHasContent(Boolean hasContent) {
        this.hasContent = hasContent;
    }

	public Boolean getQueryTotalCounts() {
		return queryTotalCounts;
	}

	public void setQueryTotalCounts(Boolean queryTotalCounts) {
		this.queryTotalCounts = queryTotalCounts;
	}

	public String getCounts() {
		return counts;
	}

	public void setCounts(String counts) {
		this.counts = counts;
	}

	public String getBeginIndex() {
		return beginIndex;
	}

	public void setBeginIndex(String beginIndex) {
		this.beginIndex = beginIndex;
	}

	public String getEndIndex() {
		return endIndex;
	}

	public void setEndIndex(String endIndex) {
		this.endIndex = endIndex;
	}
}
