package com.report;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.inqgen.nursing.dynamic.context.ContextLoader;
import com.inqgen.nursing.dynamic.form.bean.GForm;
import com.inqgen.nursing.dynamic.form.bean.GFormItem;
import com.report.unit.*;
import com.report.unit.db.DataSourceUtils;
import com.report.unit.sett.DataSource;
import com.report.unit.sett.report.*;
import groovy.lang.Binding;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.core.SpringVersion;
import org.springframework.web.context.WebApplicationContext;

import javax.script.CompiledScript;
import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

public class ReportThread extends Thread{
	//初始化工具化
	DateUtils dateUtils=new DateUtils();
	ListUtils listUtils=new ListUtils();
	com.report.unit.StringUtils strUtils=new com.report.unit.StringUtils();
	ReportGeneratorUtils generatorUtils;
	TableSetUtils tableSetUtils=new TableSetUtils();
    FileUtils fileUtils=new FileUtils();
	DataSourceUtils dataSourceUtil=new DataSourceUtils();
	ReportGenerator generator;
	Map<String,Object> params;
	String reportConfig=null;
	/**系統錯誤**/
	Exception exception=null;
	Boolean start;
    String logPath=null;
	public static HashMap<String, CompiledScript> scriptMap=new HashMap<String, CompiledScript>();
	public static boolean initScript=false;
	public ReportThread(){
		try{
			if(!initScript) {
				initScript=true;
				try{
					TimeUnit.MILLISECONDS.sleep(1000*60*5);
				}catch (Exception e){
					e.printStackTrace();
				}
				init();
			}
		}catch (Exception e){
			errorMsg(e).printStackTrace();
		}
	}
	Exception errorMsg(Exception e){
		params.put("errorMsg", StringUtils.defaultString((String) params.get("errorMsg"))+ExceptionUtils.getFullStackTrace(e));
		return e;
	}


	public void init() {
		ServletContext servletContext = SpringWebApp.getServletContext();
		//获取context.
		WebApplicationContext applicationContext=ContextLoader.getCurrentWebApplicationContext();
		//获取BeanFactory
		DefaultListableBeanFactory defaultListableBeanFactory = (DefaultListableBeanFactory)applicationContext.getAutowireCapableBeanFactory();
		if (servletContext != null) {
			Hashtable<Object,Object> properties=(Hashtable) SpringWebApp.getObjectFromName("formTempConfig");

			if(properties!=null){
				for (Map.Entry<Object,Object> entry : properties.entrySet()) {
					String xmlMames= (String) entry.getValue();
					if(xmlMames!=null) {
						String xmls[]=xmlMames.split(",");

						for(String xml:xmls) {
							if (xml.endsWith(".xml")) {
								String path=servletContext.getRealPath("/WEB-INF/formTemplate"+xml);
								File file=new File(path);
								//创建bean信息
								BeanDefinitionBuilder beanDefinitionBuilder = BeanDefinitionBuilder.genericBeanDefinition(TempFile.class);
								beanDefinitionBuilder.addPropertyValue("file",file);
								//动态注册bean
								defaultListableBeanFactory.registerBeanDefinition(path,beanDefinitionBuilder.getBeanDefinition());
								ReportGeneratorUtils utils = new ReportGeneratorUtils(path);
								ReportGenerator reportGenerator = utils.getReportGenerator(path);

								Algorithm algorithm = reportGenerator.getAlgorithm();
								List<DeleteData> clearDatas = algorithm.getDeleteData();
								if (clearDatas != null) {
									for (int j = 0; j < clearDatas.size(); j++) {
										DeleteData deleteData = clearDatas.get(j);
										List<Field> fields = deleteData.fields;
										if (fields != null && fields.size() > 0) {
											for (int k = 0; k < fields.size(); k++) {
												Field field = fields.get(k);
												String key = deleteData.getName() + j + k;
												String script = utils.baseScript.replace("{Field}", field.getValue());
												try {
													utils.getCompiledScript(key, script);
												} catch (Exception e) {
													errorMsg(e).printStackTrace();
												}

											}
										}
									}
								}
								MainFile mainFile = algorithm.getMainFile();
								if (mainFile != null) {
									List<QueryData> queryDataList = algorithm.getMainFile().getQueryDatas();
									if (queryDataList != null && queryDataList.size() > 0) {
										for (QueryData queryData : queryDataList) {
											if (queryData != null) {
												if (queryData.getJavaApi() != null) {
													try {
														String script = utils.baseScript.replace("{Field}", queryData.getJavaApi());
														utils.getCompiledScript(queryData.getName() + "javaApi", script);
													} catch (Exception e) {
														errorMsg(e).printStackTrace();
													}
												}
												List<Field> fields = queryData.fields;
												if (fields != null && fields.size() > 0) {
													for (int k = 0; k < fields.size(); k++) {
														Field field = fields.get(k);
														String script = utils.baseScript.replace("{Field}", field.getValue());
														try {
															utils.getCompiledScript(queryData.getName() + k, script);
														} catch (Exception e) {
															errorMsg(e).printStackTrace();
														}
													}
												}
											}

										}
									}
								}
								ProcessDetail detail = algorithm.getProcessDetails();
								if (detail != null) {
									List<QueryData> queryDataList = detail.getQueryDatas();
									if (queryDataList != null && queryDataList.size() > 0) {
										for (QueryData queryData : queryDataList) {
											if (queryData != null) {
												if (queryData.getJavaApi() != null) {
													try {
														String script = utils.baseScript.replace("{Field}", queryData.getJavaApi());
														utils.getCompiledScript(queryData.getName() + "javaApi", script);
													} catch (Exception e) {
														errorMsg(e).printStackTrace();
													}
												}
												List<Field> fields = queryData.fields;
												if (fields != null && fields.size() > 0) {
													for (int k = 0; k < fields.size(); k++) {
														Field field = fields.get(k);
														String script = utils.baseScript.replace("{Field}", field.getValue());
														try {
															utils.getCompiledScript(queryData.getName() + k, script);
														} catch (Exception e) {
															errorMsg(e).printStackTrace();
														}
													}
												}
											}
										}
									}
								}


								List<ProcessHeadTail> tails = algorithm.getProcessTail();
								if (tails != null && tails.size() > 0) {
									for (ProcessHeadTail tail : tails) {
										List<ForEach> forEachList = tail.getForEach();
										List<NewData> newDataList = tail.getNewDatas();
										List<UpdateData> updateDataList = tail.getUpdateDatas();
										List<DeleteData> deleteDataList = tail.getDeleteDatas();
										List<GformData> gformDataList = tail.getGformDatas();

										if (forEachList != null && forEachList.size() > 0) {
											for (ForEach forEach : forEachList) {
												String begin = forEach.getBegin();
												String unikey = forEach.getUnikey();
												String var = forEach.getVar();
												if (StringUtils.isNotBlank(begin)) {
													try {
														begin = utils.baseScript.replace("{Field}", begin);
														utils.getCompiledScript("ForEach" + unikey + var + "Begin", begin);
													} catch (Exception e) {
														errorMsg(e).printStackTrace();
													}
												}
												String end = forEach.getEnd();
												if (StringUtils.isNotBlank(end)) {
													try {
														end = utils.baseScript.replace("{Field}", end);
														utils.getCompiledScript("ForEach" + unikey + var + "End", end);
													} catch (Exception e) {
														errorMsg(e).printStackTrace();
													}
												}
												String item = forEach.getItem();
												if (StringUtils.isNotBlank(item)) {
													try {
														item = utils.baseScript.replace("{Field}", item);
														utils.getCompiledScript("ForEach" + unikey + var + "item", item);
													} catch (Exception e) {
														errorMsg(e).printStackTrace();
													}
												}
											}
										}
										if (newDataList != null && newDataList.size() > 0) {
											for (NewData newData : newDataList) {
												String script = newData.getTest();
												if (StringUtils.isNotBlank(script)) {
													try {
														script = utils.baseScript.replace("{Field}", script);
														utils.getCompiledScript("newData" + newData.getName() + "Test", script);
													} catch (Exception e) {
														errorMsg(e).printStackTrace();
													}
												}
											}
										}

										if (updateDataList != null && updateDataList.size() > 0) {
											for (UpdateData updateData : updateDataList) {
												String script = updateData.getTest();
												if (StringUtils.isNotBlank(script)) {
													try {
														script = utils.baseScript.replace("{Field}", script);
														utils.getCompiledScript("updateData" + updateData.getName() + "Test", script);
													} catch (Exception e) {
														errorMsg(e).printStackTrace();
													}
												}
											}
										}
										if (deleteDataList != null && deleteDataList.size() > 0) {
											for (DeleteData deleteData : deleteDataList) {
												String script = deleteData.getTest();
												if (StringUtils.isNotBlank(script)) {
													try {
														script = utils.baseScript.replace("{Field}", script);
														utils.getCompiledScript("deleteData" + deleteData.getName() + "Test", script);
													} catch (Exception e) {
														errorMsg(e).printStackTrace();
													}
												}
											}
										}
										if (gformDataList != null && gformDataList.size() > 0) {
											for (GformData gformData : gformDataList) {
												String script = gformData.getTest();
												if (StringUtils.isNotBlank(script)) {
													try {
														script = utils.baseScript.replace("{Field}", script);
														utils.getCompiledScript("gformData" + gformData.getName() + "Test", script);
													} catch (Exception e) {
														errorMsg(e).printStackTrace();
													}
												}
											}
										}
									}
								}

								List<ResultTable> resultTables = reportGenerator.getResultTables();
								if (resultTables != null && resultTables.size() != 0) {
									for (ResultTable resultTable : resultTables) {
										List<Field> fields = resultTable.getFields();
										for (int k = 0; k < fields.size(); k++) {
											Field field = fields.get(k);
											String script = utils.baseScript.replace("{Field}", field.getValue());
											try {
												utils.getCompiledScript("resultTable" + resultTable.getName() + k, script);
											} catch (Exception e) {
												errorMsg(e).printStackTrace();
											}
										}

									}
								}
							}
						}
					}



				}

			}
		}
	}
	public ReportThread(boolean start,Map<String,Object> params,String reportConfig) {
		this.start=start;
		this.params=params;
		this.reportConfig=reportConfig;
		generatorUtils=new ReportGeneratorUtils(reportConfig);

	}

	public ReportThread(Map<String,Object> params,String reportConfig) {
		this.params=params;
		this.reportConfig=reportConfig;
		initRegisterBean(reportConfig);
		generatorUtils=new ReportGeneratorUtils(reportConfig);

	}

	/**
     * 註冊bean
	 * @param filePath
	 */
	public void initRegisterBean(String filePath){
		//获取context.
		WebApplicationContext applicationContext=ContextLoader.getCurrentWebApplicationContext();
		while (applicationContext==null) {
			try {
				TimeUnit.MILLISECONDS.sleep(10);
			} catch (InterruptedException ignore) {
			}
			applicationContext =ContextLoader.getCurrentWebApplicationContext();
		}
		//获取BeanFactory
		DefaultListableBeanFactory defaultListableBeanFactory = (DefaultListableBeanFactory)applicationContext.getAutowireCapableBeanFactory();

		if(!defaultListableBeanFactory.containsBean(filePath)){
			File file=new File(filePath);
			//创建bean信息
			String version=SpringVersion.getVersion();
			BeanDefinitionBuilder  beanDefinitionBuilder = BeanDefinitionBuilder.rootBeanDefinition(TempFile.class);
			beanDefinitionBuilder.addPropertyValue("file",file);
			//动态注册bean
			defaultListableBeanFactory.registerBeanDefinition(filePath,beanDefinitionBuilder.getBeanDefinition());
		}
	}
    /**
     *
     * @param params '
     * @param reportConfig '
     * @param logPath  日誌文件路徑
     */
	public ReportThread(Map<String,Object> params,String reportConfig,String logPath) {
		this.params=params;
		this.reportConfig=reportConfig;
		this.logPath=logPath;
		generatorUtils=new ReportGeneratorUtils(reportConfig);
        generatorUtils.setLogPath(logPath);

	}

	public static void main(String[] args) throws Exception {
//		Map<String, Object> params = new HashMap<String, Object>();
//		params.put("month", "202004");
//		new ReportThread(params,
//				//ReportGenerator.class.getResource("\\ReportGenerator.xml").toURI().toString()
//				"E:\\workspace\\AERS\\INQGEN_eNursing_Report\\src\\main\\java\\com\\report\\ReportGenerator_CICRDPS_0409_2.xml"
//				).flowRun();
		String fileName = "E:\\workspace\\AERS\\INQGEN_eNursing_Report\\src\\main\\java\\com\\report\\ReportGenerator_CICRDPS_0409_2.xml";
		System.out.println(FilenameUtils.normalize(fileName));
		System.out.println(FilenameUtils.getName(fileName));
		System.out.println(FilenameUtils.getBaseName(fileName));
		System.out.println("stringArrayArray".replaceAll("[Aa]rray$",""));
	}
	/**
	* process gform
	* @param params :
	 * params#action
	 * params#oldFormId
	 * params#fDocId
	 * params#sourceId
	 * params#formType
	* @author RainKing
	* @since 2020/6/22 14:29
	*/
	public static void processGform(JSONObject params) throws Exception{
		runFormConfig(params);
	}

	private static void runFormConfig(JSONObject params) throws IOException {
		ServletContext servletContext = SpringWebApp.getServletContext();
		Hashtable<Object,Object> properties=(Hashtable) SpringWebApp.getObjectFromName("formTempConfig");

		if(properties==null) {
			return;
		}
		String formType = params.getString("formType");
		String action = params.getString("action");

		if(StringUtils.isNotBlank(formType)&&StringUtils.isNotBlank(action)){
			String formTemplates = (String) properties.get(formType + "." + action);
			if (formTemplates != null) {
				String[] temps = formTemplates.split(",");
				for (String temp : temps) {
					String filePath = servletContext.getRealPath("/WEB-INF/formTemplate/" + temp);
					new ReportThread(params, filePath).flowRun();
				}
			}
		}
	}
	public static Object getExtendGFormData(JSONObject params) throws Exception{
		ReportThread reportThread = getReportThread(params);
		if(reportThread!=null){
			reportThread.flowRun();
			return params.get("gformData");
		}else{
			return params.get("errorMsg");
		}
	}
	public static Object gformInit(JSONObject paramMap){
		JSONObject resultSet = new JSONObject();
		JSONObject resultMsg = new JSONObject();
		resultSet.put("resultMsg", resultMsg);
		resultMsg.put("success", false);
		ServletContext servletContext = SpringWebApp.getServletContext();
		if(servletContext!=null){
			JSONArray configFiles = paramMap.getJSONArray("configFiles");
			if (configFiles != null) {
				Map<String,Object> reportParamMap = new HashMap<String,Object>();
				try {
					JSONArray params = paramMap.getJSONArray("params");
					if (params != null) {
						for (int i = 0; i < params.size(); i++) {
							JSONObject param = params.getJSONObject(i);
							String key = param.getString("key");
							if (StringUtils.isBlank(key)) {
								continue;
							}
							String type = defaultType(param.getString("type"));
							String format = param.getString("format");
							reportParamMap.put(key, convertValue(param,type,format));
						}
					}else{
						resultMsg.put("message", "傳入參數缺少params:[{key:'',value:'',type:'',format:''},...]");
						resultMsg.put("code", "E00001");
					}
					List<GForm> gformList = new ArrayList<GForm>();
					reportParamMap.put("gformList", gformList);
					for (int i = 0; i < configFiles.size(); i++) {
						String fileName = configFiles.getString(i);
						String filePath = servletContext.getRealPath("/WEB-INF/formTemplate/" + FilenameUtils.getName(fileName));
						new ReportThread(reportParamMap, filePath).flowRun();
					}
					String errorMsg = (String) reportParamMap.get("errorMsg");
					if (StringUtils.isNotBlank(errorMsg)) {
						resultMsg.put("message", errorMsg);
						resultMsg.put("code", "E00999");
					}else {
						resultSet.put("result", gformList);
						resultMsg.put("success", true);
						resultMsg.put("message", "获取初始化數據成功");
						resultMsg.put("code", "000000");
					}
				} catch (Exception e) {
					resultMsg.put("message", "其他錯誤");
					resultMsg.put("code", "E00999");
				}
			}else{
				resultMsg.put("message", "傳入參數缺少configFiles:['',...]");
				resultMsg.put("code", "E00001");
			}
		}else{
			resultMsg.put("message", "獲取servletContext失敗");
			resultMsg.put("code", "E00999");
		}
		return resultSet;
	}

	private static String defaultType(String type) {
		return StringUtils.defaultString(type, "string");
	}

	private static Object convertValue(JSONObject param,String type,String format) throws ParseException {
		if (type.matches("^[Ii]nt(eger)?$")) {
			return param.getInteger("value");
		}
		else if (type.matches("^[Dd]ouble$")) {
			return param.getDouble("value");
		}
		else if (type.matches("^[Ff]loat$")) {
			return param.getFloat("value");
		}
		else if (type.matches("^[Ll]ong$")) {
			return param.getLong("value");
		}
		else if (type.matches("^[Bb]oolean$")) {
			return param.getBoolean("value");
		}
		else if (type.matches("^[Dd]ate([Tt]ime)?$")) {
			return DateUtils.parse(param.getString("value"), format);
		}
		else if(type.matches("[Aa]rray$")){
			JSONArray jsonArray = param.getJSONArray("value");
			convertValue(jsonArray, type, format);
			return jsonArray;
		}else{
			return param.get("value");
		}
	}

	private static void convertValue(JSONArray jsonArray,String type, String format) throws ParseException {
		if(jsonArray !=null){
			type = defaultType(type.replaceAll("[Aa]rray$", ""));
			for (int i = 0; i < jsonArray.size(); i++) {
				if (type.matches("^[Ii]nt(eger)?$")) {
					jsonArray.set(i, jsonArray.getInteger(i));
				}
				else if (type.matches("^[Dd]ouble$")) {
					jsonArray.set(i, jsonArray.getDouble(i));
				}
				else if (type.matches("^[Ff]loat$")) {
					jsonArray.set(i, jsonArray.getFloat(i));
				}
				else if (type.matches("^[Ll]ong$")) {
					jsonArray.set(i, jsonArray.getLong(i));
				}
				else if (type.matches("^[Bb]oolean$")) {
					jsonArray.set(i, jsonArray.getBoolean(i));
				}
				else if (type.matches("^[Dd]ate([Tt]ime)?$")) {
					jsonArray.set(i,DateUtils.parse(jsonArray.getString(i), format));
				} else if (type.matches("[Aa]rray$")) {
					convertValue(jsonArray.getJSONArray(i), type,format);
				}
			}
		}
	}

	public static ReportThread getReportThread(JSONObject params) throws Exception{
		ServletContext servletContext = SpringWebApp.getServletContext();
		String formType = params.getString("formType");
		String action = params.getString("action");
		Hashtable<Object,Object> properties=(Hashtable) SpringWebApp.getObjectFromName("formTempConfig");

		if(StringUtils.isNotBlank(formType)&&StringUtils.isNotBlank(action)&&properties!=null){
			String formTemplates = (String) properties.get(formType + "." + action);
			if (formTemplates != null) {
				String[] temps = formTemplates.split(",");
				String filePath = servletContext.getRealPath("/WEB-INF/formTemplate/" + temps[0]);
				return new ReportThread(params,filePath);
			}
		}else{
			params.put("errorMsg", "《無可執行資料》。/WEB-INF/formTemplate/formConfig.properties 是否存在："+properties!=null);
			return null;
		}
		params.put("errorMsg", null);
		return null;
	}

	public static Object getOutputExcel(JSONObject params) throws Exception{
		ReportThread reportThread = getReportThread(params);
		if(reportThread!=null){
			ReportGenerator generator = reportThread.getGeneratorUtils().getReportGenerator(reportThread.getReportConfig());
			reportThread.setGenerator(generator);
			if (generator!=null){
				params.put("outputExcel", generator.getOutputExcel());
				return params.get("outputExcel");
			}else{
				return null;
			}
		}else{
			return params.get("errorMsg");
		}
	}

	public static Object getBasicGroovy(String reportConfig) throws Exception{
		ReportGeneratorUtils utils=new ReportGeneratorUtils(reportConfig);
		return utils.baseScript;
	}


	public static Object getExtendGFormList(JSONObject params) throws Exception{
		ReportThread reportThread = getReportThread(params);
		if(reportThread!=null){
			reportThread.flowRun();
			return params.get("gformList");
		}else{
			return params.get("errorMsg");
		}
	}

	/**
	 * 處理：Process_Head.NewData
	 * @param newData
	 * @param mainFile
	 * @param resultMap
	 * @param level
	 */
	public void Process_Head_NewData(NewData newData,Map mainFile,HashMap<String, List<HashMap<String, Object>>> resultMap,int level){
	}
	/**
	 * 處理：Process_Head.UpdateData
	 * @param updateData
	 */
	public void Process_Head_UpdateData(UpdateData updateData,Map mainFile,HashMap<String, List<HashMap<String, Object>>> resultMap,int level){
	}
	
	
	/**
	 * 處理：Process_Tail.NewData
	 * @param newData
	 * @param mainFile
	 * @throws Exception
	 * @throws ParseException 
	 */
	public void Process_Tail_NewData(NewData newData,Map mainFile,Binding binding) throws ParseException, Exception{
		String name=newData.getName();
		ResultTable resultTable=generatorUtils.getResultTable(generator, name);
		List<Field> fields=resultTable.getFields();
		List<String> scripts=generatorUtils.getFieldScript(resultTable);
		binding.setVariable("mainFile", mainFile);
		String test = newData.getTest();
		if (StringUtils.isNotBlank(test)) {
			Object t = generatorUtils.execField(binding, "newData"+newData.getName()+"Test",test);
			if (!((Boolean) t)) {
				return;
			}
		}
		String sql=generatorUtils.getResultTableInsert(resultTable);
		HashMap<String,Object> param=generatorUtils.execField(binding,"resultTable"+resultTable.getName(), fields);
		if(fields!=null){
			for (Field field : fields) {
				if (field.isPk) {
					mainFile.put(resultTable.getName() + "." + field.getName(), param.get(field.getName()));
				}
			}
		}
        fileUtils.writeStringToFile(this.logPath,
                "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_NewData--sql【"+sql+"】\r\n");

        fileUtils.writeStringToFile(this.logPath,
                "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_NewData--參數【"+param+"】\r\n");

        dataSourceUtil.update(sql, param);
	}
	
	
	/**
	 * 處理：Process_Tail.UpdateData
	 * @param updateData
	 * @param mainFile
	 * @throws Exception
	 */
	public void Process_Tail_UpdateData(UpdateData updateData,Map mainFile,Binding binding) throws Exception{
		String name=updateData.getName();
		ResultTable resultTable=generatorUtils.getResultTable(generator, name);
		List<Field> fields=resultTable.getFields();
		List<String> scripts=generatorUtils.getFieldScript(resultTable);
		String sql=generatorUtils.getResultTableUpdate(resultTable);
		binding.setVariable("mainFile", mainFile);
		String test = updateData.getTest();
		if (StringUtils.isNotBlank(test)) {
			Object t = generatorUtils.execField(binding,"updateData"+updateData.getName()+"Test", test);
			if (!((Boolean) t)) {
				return;
			}
		}
		HashMap<String,Object> param=generatorUtils.execField(binding,"resultTable"+resultTable.getName(), fields);
		if(fields!=null){
			for (Field field : fields) {
				if (field.isPk) {
					mainFile.put(resultTable.getName() + "." + field.getName(), param.get(field.getName()));
				}
			}
		}
        fileUtils.writeStringToFile(this.logPath,
                "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_UpdateData--sql【"+sql+"】\r\n");

        fileUtils.writeStringToFile(this.logPath,
                "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_UpdateData--參數【"+param+"】\r\n");


        dataSourceUtil.update(sql, param);
	}
	
	//處理第一層：頭
	public void Process_Head(Map mainFile,HashMap<String, List<HashMap<String, Object>>> resultMap,int level){

		ProcessHeadTail headTail=generatorUtils.getProcessTail(generator,"Process_Head", level);
		if(headTail!=null && headTail.getLevel()==level){

			Binding binding=getBindingParam(mainFile,resultMap,level);
			
			List<NewData> newDatas= headTail.getNewDatas();
			if(newDatas!=null && newDatas.size()>0)
			{
				for (NewData newData : newDatas) {
					Process_Head_NewData(newData, mainFile, resultMap, level);
				}
			}
			List<UpdateData> updateDatas=headTail.getUpdateDatas();
			if(updateDatas!=null && updateDatas.size()>0){
				for (UpdateData updateData : updateDatas) {
					Process_Head_UpdateData(updateData, mainFile, resultMap, level);
				}
			}
			List<DeleteData> deleteDatas = headTail.getDeleteDatas();
			if (deleteDatas != null&&deleteDatas.size()>0) {
                fileUtils.writeStringToFile(this.logPath,
                        "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Head--開始\r\n");
				for (DeleteData deleteData : deleteDatas) {
					try {
						processDeleteData(deleteData,mainFile,binding);
					} catch (Exception e) {
						errorMsg(e).printStackTrace();
					}
				}
                fileUtils.writeStringToFile(this.logPath,
                        "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Head--結束\r\n");
			}
		}
		
	}
	
	//綁定參數
	public Binding getBindingParam(Map mainFile,HashMap<String, List<HashMap<String, Object>>> resultMap,int level){
		Binding binding = new Binding();
		binding.setVariable("dateUtils", dateUtils);
		binding.setVariable("listUtils", listUtils);
		binding.setVariable("strUtils", strUtils);
		binding.setVariable("mainFile", mainFile);
		binding.setVariable("resultMap", resultMap);
		if (params != null) {
			for (Map.Entry<String, Object> entry : params.entrySet()) {
				binding.setVariable(entry.getKey(), entry.getValue());
			}
		}
		binding.setVariable("level", level);
		return binding;
	}
	//處理第N層：尾
	public void Process_Tail(Map mainFile,HashMap<String, List<HashMap<String, Object>>> resultMap,int level){
		ProcessHeadTail headTail=generatorUtils.getProcessTail(generator,"Process_Tail", level);
		if(headTail!=null && headTail.getLevel()==level){
			Binding binding=getBindingParam(mainFile,resultMap,level);
			List<DeleteData> deleteDatas = headTail.getDeleteDatas();
			//先執行刪除作業
			if (deleteDatas != null&&deleteDatas.size()>0) {
				fileUtils.writeStringToFile(this.logPath,
						"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_DeleteData_"+level+"--開始\r\n");

				for (DeleteData deleteData : deleteDatas) {
					try {
						processDeleteData(deleteData,mainFile,binding);
					} catch (Exception e) {
						errorMsg(e).printStackTrace();
						fileUtils.writeStringToFile(this.logPath,
								"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_DeleteData_"+level+"--error"+ ExceptionUtils.getMessage(e)+"\r\n");

					}
				}
				fileUtils.writeStringToFile(this.logPath,
						"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_DeleteData_"+level+"--結束\r\n");

			}
			List<ForEach> forEaches=headTail.getForEach();
			if(forEaches!=null && forEaches.size()>0){
				fileUtils.writeStringToFile(this.logPath,
						"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_forEache_"+level+"--開始\r\n");
				for (ForEach forEach : forEaches) {

					String item=forEach.getItem();
					String regex=forEach.getRegex();
					String begin=forEach.getBegin();
					String end=forEach.getEnd();
					String step=forEach.getStep();
					String unikey = forEach.getUnikey();
					String var = forEach.getVar();
					if(StringUtils.isNotBlank(begin)&&StringUtils.isNotBlank(end)&&StringUtils.isNotBlank(step)){
						try {
							Object b = generatorUtils.execField(binding,"ForEach"+unikey+var+"Begin", begin);
							Object e = generatorUtils.execField(binding,"ForEach"+unikey+var+"End", end);
							int beginVal=Integer.parseInt(b.toString());
							int endVal=Integer.parseInt(e.toString());
							int stepVal=Integer.parseInt(step);
							int index=1;
							if(beginVal>0 && beginVal<=endVal && stepVal>=1) {
								for (int i = beginVal; i <= endVal; i += stepVal) {

									ForEachProperties prop = new ForEachProperties();
									prop.setCount((endVal - beginVal) / stepVal);
									prop.setFirst(i == beginVal);
									prop.setLast(i == endVal);
									prop.setIndex(index++);
									binding.setVariable(forEach.getVar(), prop);
									List<NewData> newDatas = forEach.getNewDataList();
									List<UpdateData> updateDatas = forEach.getUpdateDataList();
									if (newDatas != null && newDatas.size() > 0) {
										fileUtils.writeStringToFile(this.logPath,
												"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_NewData_" + level + "--開始\r\n");
										for (NewData newData : newDatas) {
											try {
												Process_Tail_NewData(newData, mainFile, binding);
											} catch (Exception e2) {
												errorMsg(e2).printStackTrace();

												fileUtils.writeStringToFile(this.logPath,
														"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_NewData_" + level + "--error" + ExceptionUtils.getMessage(e2) + "\r\n");

											}
										}
										fileUtils.writeStringToFile(this.logPath,
												"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_NewData_" + level + "--結束\r\n");
									}
									if(updateDatas!=null && updateDatas.size()>0){
										fileUtils.writeStringToFile(this.logPath,
												"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_UpdateData_"+level+"--開始\r\n");

										for (UpdateData updateData : updateDatas) {
											try {
												Process_Tail_UpdateData(updateData, mainFile, binding);
											} catch (Exception eu) {
												errorMsg(eu).printStackTrace();
												fileUtils.writeStringToFile(this.logPath,
														"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_UpdateData_" + level + "--error" + ExceptionUtils.getMessage(eu) + "\r\n");

											}
										}
										fileUtils.writeStringToFile(this.logPath,
												"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_UpdateData_"+level+"--結束\r\n");

									}
								}
							}else{
								fileUtils.writeStringToFile(this.logPath,
										"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_NewData_ForEach 參數不正確，無法循環轉檔 begin=【"+beginVal+"】end=【"+endVal+"】step=【"+stepVal+"】");

							}
						} catch (Exception e) {
							e.printStackTrace();
							fileUtils.writeStringToFile(this.logPath,
									"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_NewData_" + level + "處理出錯--\r\n");
							fileUtils.writeStringToFile(this.logPath,ExceptionUtils.getFullStackTrace(e));

						}
					}else if(StringUtils.isNotBlank(item)){

						try {
							Object itobj = generatorUtils.execField(binding,"ForEach"+unikey+var+"item", item);
							if(itobj!=null){
								String items[]=itobj.toString().split(regex);
								for(int i=0;i<items.length;i++){
									ForEachProperties prop = new ForEachProperties();
									prop.setCount(items.length);
									prop.setFirst(i == 0);
									prop.setLast(i == items.length-1);
									prop.setIndex(i+1);
									prop.setCurrent(items[i]);
									binding.setVariable(forEach.getVar(), prop);
									List<NewData> newDatas = forEach.getNewDataList();
									List<UpdateData> updateDatas = forEach.getUpdateDataList();
									if (newDatas != null && newDatas.size() > 0) {
										fileUtils.writeStringToFile(this.logPath,
												"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_NewData_" + level + "--開始\r\n");
										for (NewData newData : newDatas) {
											try {
												Process_Tail_NewData(newData, mainFile, binding);
											} catch (Exception e2) {
												errorMsg(e2).printStackTrace();

												fileUtils.writeStringToFile(this.logPath,
														"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_NewData_" + level + "--error" + ExceptionUtils.getMessage(e2) + "\r\n");

											}
										}
										fileUtils.writeStringToFile(this.logPath,
												"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_NewData_" + level + "--結束\r\n");
									}
									if(updateDatas!=null && updateDatas.size()>0){
										fileUtils.writeStringToFile(this.logPath,
												"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_UpdateData_"+level+"--開始\r\n");

										for (UpdateData updateData : updateDatas) {
											try {
												Process_Tail_UpdateData(updateData, mainFile, binding);
											} catch (Exception eu) {
												errorMsg(eu).printStackTrace();
												fileUtils.writeStringToFile(this.logPath,
														"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_UpdateData_" + level + "--error" + ExceptionUtils.getMessage(eu) + "\r\n");

											}
										}
										fileUtils.writeStringToFile(this.logPath,
												"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_UpdateData_"+level+"--結束\r\n");

									}
								}
							}

						} catch (Exception e) {
							e.printStackTrace();
						}


					}
				}
				fileUtils.writeStringToFile(this.logPath,
						"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_forEache_"+level+"--結束\r\n");
			}

			List<NewData> newDatas= headTail.getNewDatas();
			if(newDatas!=null && newDatas.size()>0)
			{
				fileUtils.writeStringToFile(this.logPath,
						"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_NewData_"+level+"--開始\r\n");
				for (NewData newData : newDatas) {
					try {
						Process_Tail_NewData(newData, mainFile, binding);
					} catch (Exception e) {
						errorMsg(e).printStackTrace();

						fileUtils.writeStringToFile(this.logPath,
								"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_NewData_" + level + "--error" + ExceptionUtils.getMessage(e) + "\r\n");

					}
				}
				fileUtils.writeStringToFile(this.logPath,
						"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_NewData_"+level+"--結束\r\n");
			}
			List<UpdateData> updateDatas=headTail.getUpdateDatas();
			if(updateDatas!=null && updateDatas.size()>0){
                fileUtils.writeStringToFile(this.logPath,
                        "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_UpdateData_"+level+"--開始\r\n");

				for (UpdateData updateData : updateDatas) {
					try {
						Process_Tail_UpdateData(updateData, mainFile, binding);
					} catch (Exception e) {
						errorMsg(e).printStackTrace();
						fileUtils.writeStringToFile(this.logPath,
								"【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】Process_Tail_UpdateData_" + level + "--error" + ExceptionUtils.getMessage(e) + "\r\n");

					}
				}
                fileUtils.writeStringToFile(this.logPath,
                        "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_UpdateData_"+level+"--結束\r\n");

            }

			List<GformData> gformDatas = headTail.getGformDatas();
			if (gformDatas != null&&gformDatas.size()>0) {
				for (GformData gformData : gformDatas) {
					try {
						toGformData(gformData,mainFile,binding);
					} catch (Exception e) {
						errorMsg(e).printStackTrace();
                        fileUtils.writeStringToFile(this.logPath,
                                "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】Process_Tail_"+level+" 轉換gformdata--error"+ ExceptionUtils.getMessage(e)+"\r\n");

                    }
				}
			}
		}
	}

	private void toGformData(GformData gformData, Map mainFile, Binding binding) throws Exception {
		String name = gformData.getName();
		ResultTable resultTable = generatorUtils.getResultTable(generator, name);
		List<Field> fields = resultTable.getFields();
		binding.setVariable("mainFile", mainFile);
		String test = gformData.getTest();
		if (StringUtils.isNotBlank(test)) {
			Object t = generatorUtils.execField(binding,"gformData"+gformData.getName()+"Test", test);
			if (!((Boolean) t)) {
				return;
			}
		}
		Map<String,Object> fieldMap = generatorUtils.execField(binding,"resultTable"+resultTable.getName(), fields);
		if (fieldMap != null) {
			Map<String, GFormItem> gformItemMap = new LinkedHashMap<String, GFormItem>();
			for (Map.Entry<String, Object> entry : fieldMap.entrySet()) {
				String key = entry.getKey();
				Object value = entry.getValue();
				String val = value == null ? null : String.valueOf(value);
				if(key.endsWith("_otherValue")){
					String itemKey = key.replace("_otherValue", "");
					GFormItem gformItem = gformItemMap.get(itemKey);
					if (gformItem == null) {
						gformItem = new GFormItem();
						gformItem.setItemKey(itemKey);
						gformItemMap.put(itemKey, gformItem);
					}
					gformItem.setOtherValue(val);
				}else{
					GFormItem gformItem = gformItemMap.get(key);
					if (gformItem == null) {
						gformItem = new GFormItem();
						gformItem.setItemKey(key);
						gformItemMap.put(key, gformItem);
					}
					gformItem.setItemValue(val);
					if (fieldMap.get(key+"_OTHERVALUE")!=null){
						Object ot_value = fieldMap.get(key+"_OTHERVALUE");
						String ot_val = ot_value == null ? null : String.valueOf(ot_value);
						gformItem.setOtherValue(ot_val);
					}
				}
			}
			
			GForm gform = new GForm();
			gform.setFormType((String) params.get("formType"));
			//取得gForm的基本參數
			try{
				long nowTimeLong;
		        DateFormat ymdhmsFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				if (null!=fieldMap.get("SOURCEID"))
					gform.setSourceId((String) fieldMap.get("SOURCEID"));
				if (null!=fieldMap.get("FDOCID"))
					gform.setFdocId((String) fieldMap.get("FDOCID"));
				if (null!=fieldMap.get("FORMID"))
					gform.setFormId((String) fieldMap.get("FORMID"));
				gform.setFormType((String) ((null!=fieldMap.get("FORMTYPE")) ? fieldMap.get("FORMTYPE"):params.get("formType")));
				if (null!=fieldMap.get("EVALUATIONTIME")){
					nowTimeLong= (Long) fieldMap.get("EVALUATIONTIME");
					gform.setEvaluationTime(ymdhmsFormat.parse(ymdhmsFormat.format(nowTimeLong)));
				}
				if (null!=fieldMap.get("FORMVERSIONID"))
					gform.setFormVersionId((String) fieldMap.get("FORMVERSIONID"));
				if (null!=fieldMap.get("USERID"))
					gform.setCreatorId((String) fieldMap.get("USERID"));
				if (null!=fieldMap.get("USERNAME"))
					gform.setCreatorName((String) fieldMap.get("USERNAME"));
				if (null!=fieldMap.get("CREATETIME")){
					nowTimeLong= (Long) fieldMap.get("CREATETIME");
					gform.setEvaluationTime(ymdhmsFormat.parse(ymdhmsFormat.format(nowTimeLong)));
				}
				if (null!=fieldMap.get("MODIFYID"))
					gform.setModifyUserId((String) fieldMap.get("MODIFYID"));
				if (null!=fieldMap.get("MODIFYNAME"))
					gform.setModifyUserName((String) fieldMap.get("MODIFYNAME"));
				if (null!=fieldMap.get("MODIFYTIME")){
					nowTimeLong= (Long) fieldMap.get("MODIFYTIME");
					gform.setEvaluationTime(ymdhmsFormat.parse(ymdhmsFormat.format(nowTimeLong)));
				}

//				gformItemMap.remove("SOURCEID");
//				gformItemMap.remove("FDOCID");
//				gformItemMap.remove("FORMID");
//				gformItemMap.remove("FORMTYPE");
//				gformItemMap.remove("EVALUATIONTIME");
//				gformItemMap.remove("FORMVERSIONID");
//				gformItemMap.remove("USERID");
//				gformItemMap.remove("USERNAME");
//				gformItemMap.remove("CREATETIME");
//				gformItemMap.remove("MODIFYID");
//				gformItemMap.remove("MODIFYNAME");
//				gformItemMap.remove("MODIFYTIME");
			}catch(Exception ignored){
			}
			gform.setGformItemMap(gformItemMap);
			gform.setGformItems(new ArrayList<GFormItem>(gformItemMap.values()));
			
			params.put("gformData", gform);
			List<GForm> gformList = (List<GForm>) params.get("gformList");
			if (gformList == null) {
				gformList = new ArrayList<GForm>();
				params.put("gformList", gformList);
			}
			gformList.add(gform);
		}

	}

	private void processDeleteData(DeleteData deleteData, Map mainFile, Binding binding) throws Exception {
		String name = deleteData.getName();
//		ResultTable resultTable = generatorUtils.getResultTable(generator, name);
		List<Field> fields = deleteData.getFields();
		binding.setVariable("mainFile", mainFile);
		String test = deleteData.getTest();
		if (StringUtils.isNotBlank(test)) {
			Object t = generatorUtils.execField(binding,"deleteData"+deleteData.getName()+"Test", test);
			if (!((Boolean) t)) {
				return;
			}
		}
		HashMap param = generatorUtils.execField(binding,"deleteData"+deleteData.getName(), fields);
//		if (fields != null) {
//			for (int i = 0; i < fields.size(); i++) {
//				Field field = fields.get(i);
//				if (field.isPk) {
//					mainFile.put(resultTable.getName() + "." + fields.get(i).getName(), param.get(fields.get(i).getName()));
//				}
//			}
//		}
		generatorUtils.execDeleteData(deleteData, param);
	}

	public void run() {
		//long q=System.currentTimeMillis();
		if (start != null) {
			if (start) {
				ServletContext context = null;
				while (context==null) {
					try {
						TimeUnit.MILLISECONDS.sleep(10);
					} catch (InterruptedException ignore) {
					}
					context = SpringWebApp.getServletContext();
				}
				reportConfig= context.getRealPath(reportConfig);
				initRegisterBean(reportConfig);
				registerDataSource();
				Object month1 = params.get("month");
				Object day1 = params.get("day");
				Object hour1 = params.get("hour");
				Object minute1 = params.get("minute");
				int month =month1==null?-1:Integer.parseInt((String) month1);
				int day =day1==null?-1:Integer.parseInt((String) day1);
				int hour =hour1==null?-1:Integer.parseInt((String) hour1);
				int minute =minute1==null?-1:Integer.parseInt((String) minute1);
				boolean toC=false;
				int prevYear=-1,prevMonth=-1,prevDay=-1,prevHour=-1;
				while (start) {
					Calendar now = Calendar.getInstance();
					int curYear = now.get(Calendar.YEAR);
					int curMonth = now.get(Calendar.MONTH);
					int curDay = now.get(Calendar.DAY_OF_MONTH);
					int curHour = now.get(Calendar.HOUR_OF_DAY);
					int curMinute = now.get(Calendar.MINUTE);
					/*year report*/
					if (month >-1) {
						if (prevYear != curYear) {
							if (month == curMonth&&day==curDay&&hour==curHour&&minute==curMinute) {
								now.set(Calendar.MONTH,0);
								now.set(Calendar.DAY_OF_MONTH,0);
								now.set(Calendar.HOUR_OF_DAY,0);
								now.set(Calendar.MINUTE,0);
								now.add(Calendar.YEAR,-1);
								params.put("year", now.getTime());
								toC=true;
								prevYear=curYear;
							}
						}else{
							toC=false;
						}
					}
					/*month report*/
					else if(day>-1){
						if (prevMonth != curMonth) {
							if (day==curDay&&hour==curHour&&minute==curMinute) {
								now.set(Calendar.DAY_OF_MONTH,0);
								now.set(Calendar.HOUR_OF_DAY,0);
								now.set(Calendar.MINUTE,0);
								now.add(Calendar.MONTH,-1);
								params.put("month", now.getTime());
								toC=true;
								prevMonth = curMonth;
							}
						}else{
							toC=false;
						}
					}
					/*day report*/
					else if(hour>-1){
						if (prevDay != curDay) {
							if (hour==curHour&&minute==curMinute) {
								now.set(Calendar.HOUR_OF_DAY,0);
								now.set(Calendar.MINUTE,0);
								now.add(Calendar.DAY_OF_MONTH,-1);
								params.put("day", now.getTime());
								toC=true;
								prevDay = curDay;
							}
						}else{
							toC=false;
						}
					}
					/*hour report*/
					else if(minute>-1){
						if (prevHour != curHour) {
							if (minute==curMinute) {
								now.set(Calendar.MINUTE,0);
								now.add(Calendar.HOUR_OF_DAY,-1);
								params.put("hour", now.getTime());
								toC=true;
								prevHour = curHour;
							}
						}else{
							toC=false;
						}
					}
					if (toC) {
						runD();
					}
					try {
						TimeUnit.MILLISECONDS.sleep(1000);
					} catch (InterruptedException ignore) {
					}
				}
			}
		}else{
			flowRun();
		}
	}
	public void flowRun(){
		registerDataSource();
		runD();
	}

	private void registerDataSource() {
		if (generator==null) {
			generator=generatorUtils.getReportGenerator(reportConfig);
			//初始化資料庫連線
			List<DataSource> dsList=tableSetUtils.getTableSchema().getDataSources();
			if(dsList!=null){
				for (DataSource ds : dsList) {
					if (ds.getJndi() != null) {
						DataSourceUtils.register(
								ds.getName(),
								ds.getJndi());
					} else {
						DataSourceUtils.register(
								ds.getName(),
								ds.getDriver(),
								ds.getUrl(),
								ds.getUserName(),
								ds.getPwd());
					}
				}
			}
		}
	}

	public void runD() {
		try{
			Binding binding = new Binding();
			binding.setVariable("dateUtils", dateUtils);
			binding.setVariable("listUtils", listUtils);
			binding.setVariable("strUtils", strUtils);
			if (params != null) {
				for (Map.Entry<String, Object> entry : params.entrySet()) {
					binding.setVariable(entry.getKey(), entry.getValue());
				}
			}
			//Algorithm.DeleteData
			List<DeleteData> clearDatas= generator.getAlgorithm().getDeleteData();
			if(clearDatas!=null){
                fileUtils.writeStringToFile(this.logPath,
                        "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】清除資料--開始\r\n");
				for(int i=0;i<clearDatas.size();i++){
					DeleteData deleteData=clearDatas.get(i);
					List<Field> fields=deleteData.fields;
					HashMap deleteDataMap=generatorUtils.execField(binding,"deleteData"+deleteData.getName()+i, fields);
					generatorUtils.execDeleteData(deleteData, deleteDataMap);
				}
                fileUtils.writeStringToFile(this.logPath,
                        "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】清除資料--結束\r\n");
			}
			//end Algorithm.DeleteData

			//Algorithm.MainFile.QueryData
//			MainFile mainFile=generator.getAlgorithm().getMainFile();
//			List<Field> fields=mainFile.getQueryData().fields;
//			HashMap mainFileMap=generatorUtils.execField(binding, fields);
			//取得報表起始資料  執行：MainFile
			List<Map> list=generatorUtils.execMainFile(generator, binding);
			if (list == null) {
				return;
			}
			//end Algorithm.MainFile.QueryData


			//取得Key_level
			List<HashMap<String,String>> levelLs=generatorUtils.getLevel(generator);

			//String preNumber=null;
			///* 處理每一筆資料 in CICCASE */
			boolean a =false;
			Map cicCaseMap=null;
			HashMap<String, List<HashMap<String, Object>>> resultMap=null;
			for(int i=0;i<list.size();i++){
				cicCaseMap=list.get(i);
				//處理：Algorithm.MainFile.Process_Detail
				binding.setVariable("mainFile", cicCaseMap);
				resultMap=generatorUtils.execProcessDetail(generator,binding);
				//end Algorithm.MainFile.Process_Detail

				//處理頭
				String level2Val="";
				for(int j=0;j<levelLs.size();j++){

					HashMap<String,String> Key_level=levelLs.get(j);
					String key=Key_level.keySet().iterator().next();
					String value=Key_level.get(key);
					String forValue=(String)cicCaseMap.get(key);

					//第一級
					if(j==0){
						level2Val=forValue;
						if(forValue!=null && !forValue.equals(value)){
							Process_Head(cicCaseMap,resultMap,(j+1));
						}
					//第二級+
					}else{
						level2Val+=","+forValue;
						if(level2Val!=null && value!=null && !level2Val.equals(value)){
							Process_Head(cicCaseMap,resultMap,(j+1));
						}
					}
				}


				//處理尾
				int n=i+1;
				level2Val="";
				boolean isexec=false;
				for(int j=0;j<levelLs.size();j++){
					HashMap<String,String> Key_level=levelLs.get(j);
					String key=Key_level.keySet().iterator().next();
					String value=Key_level.get(key);
					String forValue=(String)cicCaseMap.get(key);
					//第一級
					if(j==0){
						level2Val=forValue;
						//對比下一條資料
						if(n<list.size() || n==list.size()-1){
							String tmpforValue=(String)list.get(n).get(key);
							if( tmpforValue!=null && !tmpforValue.equals(forValue)){
								isexec=true;
								Process_Tail(cicCaseMap,resultMap,(j+1));
							}
						}
						if(forValue!=null && !forValue.equals(value)){
							Key_level.put(key, forValue);
						}
					}else{
						level2Val+=","+forValue;
						//對比下一條資料
						if(n<list.size() || n==list.size()-1){
							String tmpforValue="";
							for(int t=0;t<levelLs.size();t++){
								HashMap<String,String> t_Key_level=levelLs.get(t);
								String t_key=t_Key_level.keySet().iterator().next();
								String tempValue=(String)list.get(n).get(t_key);
								if(t!=0){
									tmpforValue+=","+tempValue;
								}else{
									tmpforValue=tempValue;
								}
							}
							if( tmpforValue!=null && !tmpforValue.equals(level2Val)){
								Process_Tail(cicCaseMap,resultMap,(j+1));
							}
						}

						if(level2Val!=null && forValue!=null && !level2Val.equals(forValue)){
							Key_level.put(key, level2Val);
						}
					}
				}

				for(int j=0;j<levelLs.size();j++){
					HashMap<String,String> Key_level=levelLs.get(j);
					String key=Key_level.keySet().iterator().next();
					String value=Key_level.get(key);

					if(isexec && j==0){
						//execProcessTail01(cicCaseMap,resultMap);
					}
				}
			}
			//處理最後一筆資料
			if(list.size()>0){
				cicCaseMap=list.get(list.size()-1);
				for(int j=levelLs.size()-1;j>=0;j--){
					HashMap<String,String> Key_level=levelLs.get(j);
					String key=Key_level.keySet().iterator().next();
					String value=Key_level.get(key);
					String forValue=(String)cicCaseMap.get(key);
					if(j==0)
					{
						Process_Tail(cicCaseMap,resultMap,(j+1));
					}else{
						Process_Tail(cicCaseMap,resultMap,(j+1));
					}
				}
			}
		}catch(Exception e){
			this.exception=e;
			errorMsg(e).printStackTrace();
		}
	}

	public void loadTableSchema() throws Exception {
		loadDataSource();
		tableSetUtils.loadTableSchema();
	}

	public void loadDataSource(){
		List<DataSource> dsList=tableSetUtils.getTableSchema().getDataSources();
		if(dsList!=null){
			for (DataSource ds : dsList) {
				if (ds.getJndi() != null) {
					DataSourceUtils.register(
							ds.getName(),
							ds.getJndi());
				} else {
					DataSourceUtils.register(
							ds.getName(),
							ds.getDriver(),
							ds.getUrl(),
							ds.getUserName(),
							ds.getPwd());
				}
			}
		}
	}
	public Exception getException() {
		return exception;
	}
	public void setException(Exception exception) {
		this.exception = exception;
	}
	public String getReportConfig() {
		return reportConfig;
	}
	public void setReportConfig(String reportConfig) {
		this.reportConfig = reportConfig;
	}
	public ReportGeneratorUtils getGeneratorUtils() {
		return generatorUtils;
	}
	public void setGeneratorUtils(ReportGeneratorUtils generatorUtils) {
		this.generatorUtils = generatorUtils;
	}
	public ReportGenerator getGenerator() {
		return generator;
	}
	public void setGenerator(ReportGenerator generator) {
		this.generator = generator;
	}
	
}
