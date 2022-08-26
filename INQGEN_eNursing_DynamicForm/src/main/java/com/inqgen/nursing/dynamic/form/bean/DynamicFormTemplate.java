package com.inqgen.nursing.dynamic.form.bean;

import com.inqgen.nursing.dynamic.form.bean.db.DataSource;
import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamOmitField;
import groovy.lang.Binding;
import groovy.lang.GroovyShell;
import org.apache.commons.lang.StringUtils;
import org.springframework.core.io.Resource;

import java.io.InputStream;
import java.util.*;

@XStreamAlias("DynamicFormTemplate")
public class DynamicFormTemplate {
	/**formTool的屬性**/
	private String formToolAttribute;
	/**表單模板ID**/
	public String formVersionId;
	/**表單中文描述**/
	public String formName;
	/**表單類型**/
	public String formType;
	public String formModel;
	/**是否ditto**/
	public boolean ditto;
	/**條件連動式 2019-10-18**/
	public String interlocking;
	/**子項驗證規則 2019-10-18**/
	public String verification;
	/**增加頁面表頭描述**/
	public String addPageheader;
	/**增加頁面表尾描術**/
	public String addPagefooter;
	/**數據清單頁面表頭描述**/
	public String listPageheader;
	/**數據清單表尾描術**/
	public String listPagefooter;
	/**
	 * 表單選項
	 **/
	private DynamicFormItem[] items;
	/**
	 * 表單選項1
	 **/
	private DynamicFormItem[] items1;
	/**api結構**/
	private String apiStructure;
	public DynamicFormItem[] getItems1() {
		return items1;
	}

	public void setItems1(DynamicFormItem[] items1) {
		this.items1 = items1;
		processItems(items1);
	}

	/**表單措施**/
	DynamicFormItem measure;
	/**運算符號**/
	String arithmetic;
	/**異常分數**/
	Float highRisk;
	/**人物種類  adult=成人  child=兒童**/
	public String peopleCategory;
	/**護理增加匯報表後，護士長需要填完寫的監控記錄模版**/
	public String linkMoniterTemplate;
	/**匯報登記表 表頭信息**/
	public String moniterNurseFormTitle;

	/**轉護理記錄字符串**/
	public String recordString;

	/**嵌入JavaScript***/
	public String javaScript;

	/**
	 * 簽名1
	 */
	public String nurseSignature1;
	/**
	 * 簽名2
	 */
	public String nurseSignature2;

	public String jspIncludeJavaScript;


	/**帶入數據**/
	public HashMap extData=new HashMap();

	/**帶入 hisDataString*/
	public String hisDataString;
	
	/**版本號**/
	public int version;


	/**
	 * 增加頁面表頭描述
	 **/
	private String addPageHeader;
	/**
	 * 增加頁面表尾描術
	 **/
	private String addPageFooter;
	/**
	 * 數據清單頁面表頭描述
	 **/
	private String listPageHeader;
	/**
	 * 數據清單表尾描術
	 **/
	private String listPageFooter;
	/**
	 * 表單選項
	 **/
	protected List<Map<String, DynamicFormItem>> itemTemplateMaps;


	@XStreamOmitField
	private Resource groovyShellUI;
	private String groovyShellUi;
	@XStreamOmitField
	private Resource listPageGS;
	private String listPageGs;

	private DataSource dataSource;
	private List<FormApiTemplate> apis;

	public void setGroovyShellUI(Resource groovyShellUI) {
		this.groovyShellUI = groovyShellUI;
		this.groovyShellUi = processResourceToS(groovyShellUI);
	}

	private String processResourceToS(Resource resource){
		try {
			InputStream inputStream = resource.getInputStream();
			byte[] b = new byte[inputStream.available()];
			inputStream.read(b);
			inputStream.close();
			return new String(b,"UTF-8");
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	public void setListPageGS(Resource listPageGS) {
		this.listPageGS = listPageGS;
		this.listPageGs = processResourceToS(listPageGS);
	}
	public String getHisDataString() {
		return hisDataString;
	}

	public void setHisDataString(String hisDataString) {
		this.hisDataString = hisDataString;
	}

	public boolean isAbnormal(float score)
	{
		if(highRisk!=null){
		if(">".equals(arithmetic)){
			if(score>highRisk){
				return true;
			}
		}
		if("<".equals(arithmetic)){
			if(score<highRisk){
				return true;
			}
		}
		}
		return false;
	}

	public String getFormName() {
		return formName;
	}
	public void setFormName(String formName) {
		this.formName = formName;
	}
	public String getFormType() {
		return formType;
	}
	public void setFormType(String formType) {
		this.formType = formType;
	}

	public DynamicFormItem[] getItems() {
		return items;
	}
	public void setItems(DynamicFormItem[] items) {
		this.items = items;
		processItems(items);
	}

	private void processItems(DynamicFormItem[] items) {
		if (items != null) {
			Map<String, DynamicFormItem> itemMap = new LinkedHashMap<String, DynamicFormItem>(items.length);
			for (DynamicFormItem dynamicFormItem : items) {
				itemMap.put(dynamicFormItem.name, dynamicFormItem);
			}
			if (itemTemplateMaps == null) {
				itemTemplateMaps = new ArrayList<Map<String, DynamicFormItem>>();
			}
			itemTemplateMaps.add(itemMap);
		}
	}

	public String getFormToolAttribute() {
		return formToolAttribute;
	}

	public void setFormToolAttribute(String formToolAttribute) {
		this.formToolAttribute = formToolAttribute;
	}

	public DynamicFormItem getMeasure() {
		return measure;
	}
	public void setMeasure(DynamicFormItem measure) {
		this.measure = measure;
	}
	public String getAddPageheader() {
		return addPageheader;
	}
	public void setAddPageheader(String addPageheader) {
		this.addPageheader = addPageheader;
	}
	public String getAddPagefooter() {
		return addPagefooter;
	}
	public void setAddPagefooter(String addPagefooter) {
		this.addPagefooter = addPagefooter;
	}
	public String getListPageheader() {
		return listPageheader;
	}
	public void setListPageheader(String listPageheader) {
		this.listPageheader = listPageheader;
	}
	public String getListPagefooter() {
		return listPagefooter;
	}
	public void setListPagefooter(String listPagefooter) {
		this.listPagefooter = listPagefooter;
	}
	public Float getHighRisk() {
		return highRisk;
	}
	public void setHighRisk(Float highRisk) {
		this.highRisk = highRisk;
	}
	public String getArithmetic() {
		return arithmetic;
	}
	public void setArithmetic(String arithmetic) {
		this.arithmetic = arithmetic;
	}

	public String getPeopleCategory() {
		return peopleCategory;
	}

	public void setPeopleCategory(String peopleCategory) {
		this.peopleCategory = peopleCategory;
	}

	public String getLinkMoniterTemplate() {
		return linkMoniterTemplate;
	}

	public void setLinkMoniterTemplate(String linkMoniterTemplate) {
		this.linkMoniterTemplate = linkMoniterTemplate;
	}

	public String getMoniterNurseFormTitle() {
		return moniterNurseFormTitle;
	}

	public void setMoniterNurseFormTitle(String moniterNurseFormTitle) {
		this.moniterNurseFormTitle = moniterNurseFormTitle;
	}

	public String getRecordString() {
		return recordString;
	}

	public void setRecordString(String recordString) {
		this.recordString = recordString;
	}

	public String getJavaScript() {
		return javaScript;
	}

	public void setJavaScript(String javaScript) {
		this.javaScript = javaScript;
	}
	public HashMap getExtData() {
		return extData;
	}

	public void setExtData(HashMap extData) {
		this.extData = extData;
	}

	public String getNurseSignature1() {
		return nurseSignature1;
	}

	public void setNurseSignature1(String nurseSignature1) {
		this.nurseSignature1 = nurseSignature1;
	}

	public String getNurseSignature2() {
		return nurseSignature2;
	}

	public void setNurseSignature2(String nurseSignature2) {
		this.nurseSignature2 = nurseSignature2;
	}

	public String getJspIncludeJavaScript() {
		return jspIncludeJavaScript;
	}

	public void setJspIncludeJavaScript(String jspIncludeJavaScript) {
		this.jspIncludeJavaScript = jspIncludeJavaScript;
	}

	public String getFormVersionId() {
		return formVersionId;
	}

	public void setFormVersionId(String formVersionId) {
		this.formVersionId = formVersionId;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public String getAddPageHeader() {
		return addPageHeader;
	}

	public void setAddPageHeader(String addPageHeader) {
		this.addPageHeader = addPageHeader;
	}

	public String getAddPageFooter() {
		return addPageFooter;
	}

	public void setAddPageFooter(String addPageFooter) {
		this.addPageFooter = addPageFooter;
	}

	public String getListPageHeader() {
		return listPageHeader;
	}

	public void setListPageHeader(String listPageHeader) {
		this.listPageHeader = listPageHeader;
	}

	public String getListPageFooter() {
		return listPageFooter;
	}

	public void setListPageFooter(String listPageFooter) {
		this.listPageFooter = listPageFooter;
	}

	public List<Map<String, DynamicFormItem>> getItemTemplateMaps() {
		if (itemTemplateMaps == null) {
			processItems(items);
			processItems(items1);
		}
		return itemTemplateMaps;
	}

	public void setItemTemplateMaps(List<Map<String, DynamicFormItem>> itemTemplateMaps) {
		this.itemTemplateMaps = itemTemplateMaps;
	}

	public Resource getGroovyShellUI() {
		return groovyShellUI;
	}

	public String getGroovyShellUi() {
		return groovyShellUi;
	}

	public void setGroovyShellUi(String groovyShellUi) {
		this.groovyShellUi = groovyShellUi;
	}

	public Resource getListPageGS() {
		return listPageGS;
	}

	public String getListPageGs() {
		return listPageGs;
	}

	public void setListPageGs(String listPageGs) {
		this.listPageGs = listPageGs;
	}
	public String getFormModel() {
		return formModel;
	}
	public void setFormModel(String formModel) {
		this.formModel = formModel;
	}
	public boolean isDitto() {
		return ditto;
	}

	public void setDitto(boolean ditto) {
		this.ditto = ditto;
	}
	
	public String getInterlocking() {
		return interlocking;
	}

	public void setInterlocking(String interlocking) {
		this.interlocking = interlocking;
	}

	public String getVerification() {
		return verification;
	}

	public void setVerification(String verification) {
		this.verification = verification;
	}

	public DataSource getDataSource() {
		return dataSource;
	}

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public List<FormApiTemplate> getApis() {
		return apis;
	}

	public void setApis(List<FormApiTemplate> apis) {
		this.apis = apis;
	}

	public void runGroovyToUI(){
		if (StringUtils.isNotBlank(groovyShellUi)) {
			Binding binding = new Binding();
			binding.setVariable("itSelf", this);
			GroovyShell gs = new GroovyShell(binding);
			gs.evaluate(groovyShellUi);
		}
	}

	public String getApiStructure() {
		return apiStructure;
	}

	public void setApiStructure(String apiStructure) {
		this.apiStructure = apiStructure;
	}

}
