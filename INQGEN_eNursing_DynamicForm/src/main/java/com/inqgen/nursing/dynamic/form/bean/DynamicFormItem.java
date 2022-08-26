package com.inqgen.nursing.dynamic.form.bean;

import com.thoughtworks.xstream.annotations.XStreamAlias;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.List;

@XStreamAlias("DynamicFormItem")
public class DynamicFormItem{
	/**當控件前部標題**/
	public String title;
	/**當控件為文字框時,尾部標題**/
	public	String backTitle;
	/**是否顯示標題**/
	public boolean showTitle=true;
	/**列印時,是否顯示標題**/
	public boolean printShowTitle=false;
	/**item類型**/
	public String itemType;
	/**控件名字**/
	public	String name;
	/**控件類型**/
	public	String controlType;
	/**控件型態**/
	public	String controlMode;
	/**檔案模式 (只在controlType為file時有效)**/
	public	String fileMode;
	/**元件寬度**/
	public	String width;
	/**預設值**/
	public	String defaultValue;
	/**是否不要ditto (只在DynamicFormTemplate的ditto為true時有效)**/
	public boolean dontDitto;
    /**UI-Class**/
    public  String uiClass;
    /**橫向展開其他項**/
    public  String horizontalFormItem;
    /**向下展開其他項**/
    public  String verticalFormItem;
	/**格式設定**/
	public	String typeFormat;
	/**最小值**/
	public	String minLimit;
	/**最大值**/
	public	String maxLimit;
	/**
	 * 控件元素分數
	 **/
	public String[] uiScore;
	/**
	 * 控件元素標題
	 **/
	public String[] uiDesc;
	/**
	 * 控件元素值
	 **/
	public String[] uiValue;
	/**
	 * 控件元素簡單描述標題
	 **/
	public String[] uiDescSimple;
	/**顯示方式 horizontal**/
	public	String displayMode;
	/**
	 * 是否顯示其他值
	 **/
	public Boolean[] hasOther;
	/**
	 * 其他值控件名字
	 **/
	public String[] otherName;
	/**
	 * 顯示其化控件
	 **/
	public DynamicFormItem[] otherFromItem;
	/**
	 * 其他值標題前面部分
	 **/
	public String[] otherTitle;
	/**
	 * 值後面文字
	 **/
	public String[] otherBackTitle;
	/**
	 * 其他值寬度
	 **/
	public String[] otherWidth;
	/**
	 * 是否被選中
	 **/
	public boolean[] isChecked;
	/**是否顯示出來**/
	public boolean show=true;
	/**
	 * 控制其他組件是否顯示
	 **/
	public String[] showItem;
	/**是否必填**/
	public	boolean required=true;
	/**控件驗證提示語**/
	public String promptTips;
	/**字體大小**/
	public int textSize=8;
	/**最大字元長度**/
	public String maxlength;
	/**文字框灰色提示字**/
	public String placeholder;
	/**date灰色提示字**/
	public String placeholderdate;
	/**time灰色提示字**/
	public String placeholdertime;
	/**父層**/
	public String parent;
	/**子層**/
	public String children;
	/**點擊事件**/
	public String click;
	/**onkeydown事件**/
	public String onkeydown;
	/**失焦事件**/
	public String blur;
	/**描述說明**/
	public String description;

	//========UI自動生成控制項==========
    /**所屬頁籤**/
    public String tab;
    /**排序**/
    public String sortNo;
    /**ui跨行配置**/
    public String rowLevel;
	

	//========護理計劃宣教提醒功能==========
	/**
	 * 護理計劃
	 **/
	public String[] planNos;
	/**
	 * 宣教
	 **/
	public String[] educationNos;
	//=========================
	//========功能跳轉=============
	/**
	 * 
	 * 
	 * 模組跳轉
	 **/
	public String[] modelLink;
	//========功能跳轉==========end
	
	/**
	 * 需要轉記錄的項目
	 */
	public String recordItems;

	////=======此組屬性搭配用於轉介資料到其他功能
	/**資料轉介**/
	public String dataAdapter;
	/**資料類型**/
	public String dateType;
	/**資料單位***/
	public String dateUnit;
	/**資料Value1**/
	public String dateTypeSub;
	/**資料轉介項次,不填的話,就只包括此項**/
	public String dateControls;
	/**
	 * 資料的其他備注
	 */
	public String[] dateNotation;

	////=======此組屬性搭配用於轉介資料到其他功能====end


	////=======用於通報 上傳用=======
	/**
	 * 如果有選中,則通報此項
	 **/
	public Boolean[] isCircular;
	public String[] circularKey;


	/**計算通報  如果分數大於多少分的時候,例入計算**/
	public String circularControls;
	/**通報分數*/
	public String circularScore;
	/**通報分數 大於多少分的時候,  通報的東西*/
	public String circularScoreKey;
	/**動態角本**/
	public String groovyShell;


	/**統計分數控件組  , 號分隔**/
	public String totalScoreCons;
	public List<ScoreDesc> scoreDesc;
	/**統計類型    total=加總得分	maxGroupScore=項目組中的,最大分**/
	public String totalScoreType="total";
	/**最大顯示分數,如果統計超過此分,則以此分進行顯示**/
	public int maxTotalScore=Integer.MAX_VALUE;

	/**單組選項,最大分數  此選項,包括子選項**/
	public int maxItemTotalScore=Integer.MAX_VALUE;

	/*上級管控id*/
	private String[] uiSuper;
	/*上級管控*/
	private String uiParent;
	/**
	 * 是否被選中
	 **/
	private Boolean[] checked;
	/**
	 * 獲焦事件
	 **/
	private String focus;
	/* select改變事件*/
	private String change;

	/**
	 * 資料類型
	 **/
	private String dataType;
	/**
	 * 資料單位
	 ***/
	private String dataUnit;
	////=======此組屬性搭配用於轉介資料到其他功能====end

	private String style;

	/**
	 * 統計類型    total=加總得分	maxGroupScore=項目組中的,最大分
	 **/
	private String scoreType;
	private Boolean readOnly;
	/** 轉換對象屬性 e.g user.names[0].id**/
	private String objAttr;
	/** 轉換對象條件 **/
	private String objAttrCon;

	private Boolean upload;
	/**
	 * formtool模塊的屬性
	 */
	private String formToolAttribute;

	public String getFormToolAttribute() {
		return formToolAttribute;
	}

	public void setFormToolAttribute(String formToolAttribute) {
		this.formToolAttribute = formToolAttribute;
	}

	public Boolean[] getHasOther() {
		return hasOther;
	}

	public void setHasOther(Boolean[] hasOther) {
		this.hasOther = hasOther;
	}

	public boolean isRequired() {
		return required;
	}

	public void setRequired(boolean required) {
		this.required = required;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getControlType() {
		return controlType;
	}

	public void setControlType(String controlType) {
		this.controlType = controlType;
	}

	public String getControlMode() {
		return controlMode;
	}

	public void setControlMode(String controlMode) {
		this.controlMode = controlMode;
	}

	public String getFileMode() {
		return fileMode;
	}

	public void setFileMode(String fileMode) {
		this.fileMode = fileMode;
	}

	public String getWidth() {
		return width;
	}

	public void setWidth(String width) {
		this.width = width;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public boolean isDontDitto() {
		return dontDitto;
	}

	public void setDontDitto(boolean dontDitto) {
		this.dontDitto = dontDitto;
	}

	public String getUiClass() {
		return uiClass;
	}

	public void setUiClass(String uiClass) {
		this.uiClass = uiClass;
	}

	public String getHorizontalFormItem() {
		return horizontalFormItem;
	}

	public void setHorizontalFormItem(String horizontalFormItem) {
		this.horizontalFormItem = horizontalFormItem;
	}

	public String getVerticalFormItem() {
		return verticalFormItem;
	}

	public void setVerticalFormItem(String verticalFormItem) {
		this.verticalFormItem = verticalFormItem;
	}

	public String getTypeFormat() {
		return typeFormat;
	}

	public void setTypeFormat(String typeFormat) {
		this.typeFormat = typeFormat;
	}

	public String getMinLimit() {
		return minLimit;
	}

	public void setMinLimit(String minLimit) {
		this.minLimit = minLimit;
	}

	public String getMaxLimit() {
		return maxLimit;
	}

	public void setMaxLimit(String maxLimit) {
		this.maxLimit = maxLimit;
	}

	public String[] getUiScore() {
		return uiScore;
	}

	public void setUiScore(String[] uiScore) {
		this.uiScore = uiScore;
	}

	public String[] getUiDesc() {
		return uiDesc;
	}

	public void setUiDesc(String[] uiDesc) {
		this.uiDesc = uiDesc;
	}

	public String[] getUiValue() {
		return uiValue;
	}

	public void setUiValue(String[] uiValue) {
		this.uiValue = uiValue;
	}

	public String[] getUiDescSimple() {
		return uiDescSimple;
	}

	public void setUiDescSimple(String[] uiDescSimple) {
		this.uiDescSimple = uiDescSimple;
	}

	public String[] getOtherTitle() {
		return otherTitle;
	}

	public void setOtherTitle(String[] otherTitle) {
		this.otherTitle = otherTitle;
	}

	public boolean[] getIsChecked() {
		return isChecked;
	}

	public void setIsChecked(boolean[] isChecked) {
		this.isChecked = isChecked;
	}

	public String getDisplayMode() {
		return displayMode;
	}
	public void setDisplayMode(String displayMode) {
		this.displayMode = displayMode;
	}

	public String[] getOtherBackTitle() {
		return otherBackTitle;
	}
	public void setOtherBackTitle(String[] otherBackTitle) {
		this.otherBackTitle = otherBackTitle;
	}



	public String[] getOtherWidth() {
		return otherWidth;
	}

	public void setOtherWidth(String[] otherWidth) {
		this.otherWidth = otherWidth;
	}

	public String getBackTitle() {
		return backTitle;
	}

	public void setBackTitle(String backTitle) {
		this.backTitle = backTitle;
	}
	public String getPromptTips() {
		return promptTips;
	}
	public void setPromptTips(String promptTips) {
		this.promptTips = promptTips;
	}
	
	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getChildren() {
		return children;
	}

	public void setChildren(String children) {
		this.children = children;
	}

	@Override
	public String toString() {
		return "DynamicFormItem [title=" + title + ", backTitle=" + backTitle
				+ ", name=" + name + ", controlType=" + controlType
				+ ", uiScore=" + Arrays.toString(uiScore) + ", uiDesc="
				+ Arrays.toString(uiDesc) + ", uiValue="
				+ Arrays.toString(uiValue) + ", uiDescSimple="
				+ Arrays.toString(uiDescSimple) + ", displayMode="
				+ displayMode + ", hasOther=" + Arrays.toString(hasOther)
				+ ", otherTitle=" + Arrays.toString(otherTitle)
				+ ", otherBackTitle=" + Arrays.toString(otherBackTitle)
				+ ", isChecked=" + Arrays.toString(isChecked) + ", showItem="
				+ ", required=" + required + "]";
	}

	public String getClick() {
		return click;
	}
	public void setClick(String click) {
		this.click = click;
	}

	public String getOnkeydown() {
		return onkeydown;
	}

	public void setOnkeydown(String onkeydown) {
		this.onkeydown = onkeydown;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public DynamicFormItem[] getOtherFromItem() {
		return otherFromItem;
	}

	public void setOtherFromItem(DynamicFormItem[] otherFromItem) {
		this.otherFromItem = otherFromItem;
	}

	public String[] getPlanNos() {
		return planNos;
	}

	public void setPlanNos(String[] planNos) {
		this.planNos = planNos;
	}

	public String[] getEducationNos() {
		return educationNos;
	}

	public void setEducationNos(String[] educationNos) {
		this.educationNos = educationNos;
	}

	public String[] getOtherName() {
		return otherName;
	}
	public void setOtherName(String[] otherName) {
		this.otherName = otherName;
	}
	public boolean isShowTitle() {
		return showTitle;
	}
	public void setShowTitle(boolean showTitle) {
		this.showTitle = showTitle;
	}
	public String[] getModelLink() {
		return modelLink;
	}
	public void setModelLink(String[] modelLink) {
		this.modelLink = modelLink;
	}

	public String getDataAdapter() {
		return dataAdapter;
	}

	public void setDataAdapter(String dataAdapter) {
		this.dataAdapter = dataAdapter;
	}

	public String getDateType() {
		return dateType;
	}

	public void setDateType(String dateType) {
		this.dateType = dateType;
	}

	public String getDateControls() {
		return dateControls;
	}

	public void setDateControls(String dateControls) {
		this.dateControls = dateControls;
	}

	public String getDateUnit() {
		return dateUnit;
	}

	public void setDateUnit(String dateUnit) {
		this.dateUnit = dateUnit;
	}



	public Boolean[] getIsCircular() {
		return isCircular;
	}

	public void setIsCircular(Boolean[] isCircular) {
		this.isCircular = isCircular;
	}

	public String getCircularControls() {
		return circularControls;
	}

	public void setCircularControls(String circularControls) {
		this.circularControls = circularControls;
	}

	public String getCircularScore() {
		return circularScore;
	}

	public void setCircularScore(String circularScore) {
		this.circularScore = circularScore;
	}

	public String[] getCircularKey() {
		return circularKey;
	}

	public void setCircularKey(String[] circularKey) {
		this.circularKey = circularKey;
	}

	public String getCircularScoreKey() {
		return circularScoreKey;
	}

	public void setCircularScoreKey(String circularScoreKey) {
		this.circularScoreKey = circularScoreKey;
	}


	public boolean isShow() {
		return show;
	}

	public void setShow(boolean show) {
		this.show = show;
	}

	public String getValue(Hashtable map){
		if(map.get(name)==null){
			return null;
		}
		if("text".equals(this.controlType)){
			return ((String[])map.get(this.name))[0];
		}
		String ks[]=(String[])map.get(this.name);
		ArrayList<String> result=new ArrayList<String>();
		for(int i=0;i<ks.length;i++){
			if("radio".equals(this.controlType)){
				if(this.click.startsWith("totalScore")){
					int score=0;
					for(int j=0;j<this.uiValue.length;j++){
						if(ks[i].equals(this.uiValue[j])){
							score+=Integer.valueOf(this.uiScore[j]);
						}
					}
					result.add(score+"");
				}else{
					for(int j=0;j<this.uiValue.length;j++){
						if(ks[i].equals(this.uiValue[j])){
							result.add(this.uiDesc[j]+(this.hasOther[j]?map.get(this.name+"other"+j)!=null?(String)map.get(this.name+"other"+j):"":""));
						}
					}
				}
			}
			if("checkbox".equals(this.controlType)){
				for(int j=0;j<this.uiValue.length;j++){
					if(ks[i].equals(this.uiValue[j])){
						result.add(this.uiDesc[j]+(this.hasOther[j]?map.get(this.name+"other"+j)!=null?(String)map.get(this.name+"other"+j):"":""));
					}
				}
			}
		}
		if(result.size()!=0){
			return result.toString().replace("[","").replace("]", "").replace(" ", "");
		}



		return null;

	}

	public String getValute(String values,String othervalues){
		if("text".equals(this.controlType)){
			return values;
		}
		String ks[]=values.split(",");
		String vs[]=null;
		if(othervalues!=null){
			vs=othervalues.split("\\|");
		}
		ArrayList<String> result=new ArrayList<String>();
		for(int i=0;i<ks.length;i++){
			if("radio".equals(this.controlType)){
				if(this.click!=null && this.click.startsWith("totalScore")){
					int score=0;
					for(int j=0;j<this.uiValue.length;j++){
						if(ks[i].equals(this.uiValue[j])){
							score+=Integer.valueOf(this.uiScore[j]);
						}
					}
					result.add(score+"");
				}else{
					for(int j=0;j<this.uiValue.length;j++){
						if(ks[i].equals(this.uiValue[j])){
							result.add(this.uiDesc[j]);
						}
					}
				}
			}
			if("checkbox".equals(this.controlType)){
				for(int j=0;j<this.uiValue.length;j++){
					if(ks[i].equals(this.uiValue[j])){
						result.add(this.uiDesc[j]);
					}
				}
			}
		}
		if(result.size()!=0){
			return result.toString().replace("[","").replace("]", "").replace(" ", "");
		}
		return null;
	}

	public int getTextSize() {
		return textSize;
	}

	public void setTextSize(int textSize) {
		this.textSize = textSize;
	}
	

	public String getMaxlength() {
		return maxlength;
	}

	public void setMaxlength(String maxlength) {
		this.maxlength = maxlength;
	}

	public String getPlaceholder() {
		return placeholder;
	}

	public void setPlaceholder(String placeholder) {
		this.placeholder = placeholder;
	}

	public String getPlaceholderdate() {
		return placeholderdate;
	}

	public void setPlaceholderdate(String placeholderdate) {
		this.placeholderdate = placeholderdate;
	}

	public String getPlaceholdertime() {
		return placeholdertime;
	}

	public void setPlaceholdertime(String placeholdertime) {
		this.placeholdertime = placeholdertime;
	}

	public String getDateTypeSub() {
		return dateTypeSub;
	}

	public void setDateTypeSub(String dateTypeSub) {
		this.dateTypeSub = dateTypeSub;
	}

	public String[] getDateNotation() {
		return dateNotation;
	}

	public void setDateNotation(String[] dateNotation) {
		this.dateNotation = dateNotation;
	}

	public String getGroovyShell() {
		return groovyShell;
	}

	public void setGroovyShell(String groovyShell) {
		this.groovyShell = groovyShell;
	}


	public String getTotalScoreCons() {
		return totalScoreCons;
	}

	public void setTotalScoreCons(String totalScoreCons) {
		this.totalScoreCons = totalScoreCons;
	}

	public String getTotalScoreType() {
		return totalScoreType;
	}

	public void setTotalScoreType(String totalScoreType) {
		this.totalScoreType = totalScoreType;
	}

	public int getMaxTotalScore() {
		return maxTotalScore;
	}

	public void setMaxTotalScore(int maxTotalScore) {
		this.maxTotalScore = maxTotalScore;
	}

	public boolean isPrintShowTitle() {
		return printShowTitle;
	}

	public void setPrintShowTitle(boolean printShowTitle) {
		this.printShowTitle = printShowTitle;
	}

	public int getMaxItemTotalScore() {
		return maxItemTotalScore;
	}

	public void setMaxItemTotalScore(int maxItemTotalScore) {
		this.maxItemTotalScore = maxItemTotalScore;
	}

	public String getBlur() {
		return blur;
	}

	public void setBlur(String blur) {
		this.blur = blur;
	}

	public String getTab() {
		return tab;
	}

	public void setTab(String tab) {
		this.tab = tab;
	}

	public String getSortNo() {
		return sortNo;
	}

	public void setSortNo(String sortNo) {
		this.sortNo = sortNo;
	}

	public String getRowLevel() {
		return rowLevel;
	}

	public void setRowLevel(String rowLevel) {
		this.rowLevel = rowLevel;
	}

	public String getItemType() {
		return itemType;
	}

	public void setItemType(String itemType) {
		this.itemType = itemType;
	}

	public String[] getShowItem() {
		return showItem;
	}

	public void setShowItem(String[] showItem) {
		this.showItem = showItem;
	}

	public String[] getUiSuper() {
		return uiSuper;
	}

	public void setUiSuper(String[] uiSuper) {
		this.uiSuper = uiSuper;
	}

	public String getUiParent() {
		return uiParent;
	}

	public void setUiParent(String uiParent) {
		this.uiParent = uiParent;
	}

	public Boolean[] getChecked() {
		return checked;
	}

	public void setChecked(Boolean[] checked) {
		this.checked = checked;
	}

	public String getFocus() {
		return focus;
	}

	public void setFocus(String focus) {
		this.focus = focus;
	}

	public String getChange() {
		return change;
	}

	public void setChange(String change) {
		this.change = change;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getDataUnit() {
		return dataUnit;
	}

	public void setDataUnit(String dataUnit) {
		this.dataUnit = dataUnit;
	}

	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	public String getScoreType() {
		return scoreType;
	}

	public void setScoreType(String scoreType) {
		this.scoreType = scoreType;
	}

	public Boolean getReadOnly() {
		return readOnly;
	}

	public void setReadOnly(Boolean readOnly) {
		this.readOnly = readOnly;
	}

	public List<ScoreDesc> getScoreDesc() {
		return scoreDesc;
	}

	public void setScoreDesc(List<ScoreDesc> scoreDesc) {
		this.scoreDesc = scoreDesc;
	}

	public String getObjAttr() {
		return objAttr;
	}

	public void setObjAttr(String objAttr) {
		this.objAttr = objAttr;
	}

	public String getObjAttrCon() {
		return objAttrCon;
	}

	public void setObjAttrCon(String objAttrCon) {
		this.objAttrCon = objAttrCon;
	}

	public String getRecordItems() {
		return recordItems;
	}

	public void setRecordItems(String recordItems) {
		this.recordItems = recordItems;
	}

	public Boolean getUpload() {
		return upload;
	}

	public void setUpload(Boolean upload) {
		this.upload = upload;
	}
/**
	 <!-- 資料轉介-疼痛評估-->
	 <property name="dataAdapter" value="NURSINGEVENT"></property>
	 <!--事件類型-->
	 <property name="dateType" value="PAIN"></property>
	 <!--事件類型-單位-->
	 <property name="dateUnit" value="分"></property>
	 <!--評估控件組-->
	 <property name="dateControls" value="admDifficulty1,admDifficulty2,admDifficulty3,admDifficulty4,admDifficulty5"></property>
	 <!--
	 1=數字量表(成人)
	 2=臉譜量表(兒童)
	 3=困難評估(成人)
	 4=困難評估(兒童)
	 -->
	 <!--nursingevent.value2-->
	 <property name="dateTypeSub" value="3"></property>
	 <!--nursingevent.notation-->
	 <property name="dateNotation" value="BODYL_1"></property>


	 <!--	介接通報   circularScore >value -->
	 <property name="circularControls" value="ageExit,diagnosisExit,lifeExit,mindExit,stoolExit,skinExit,socialExit,familyExit,economicExit,pipelineExit"></property>
	 <property name="circularScore" value="4"></property>
	 <property name="circularScoreKey" value="M"></property>


	 **/



}
