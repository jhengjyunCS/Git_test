package com.report.unit;

import com.inqgen.nursing.dynamic.context.ContextLoader;
import com.report.ReportThread;
import com.report.TempFile;
import com.report.unit.db.DataSourceUtils;
import com.report.unit.sett.report.*;
import com.thoughtworks.xstream.XStream;
import groovy.lang.Binding;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.web.context.WebApplicationContext;

import javax.script.*;
import javax.servlet.ServletContext;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.TimeUnit;

public class ReportGeneratorUtils {
	TableSetUtils tableSetUtils=new TableSetUtils();
    FileUtils fileUtils=new FileUtils();
	public String reportConfig;
	public String baseScript;
	public String logPath;//日誌文件

    public String getLogPath() {
        return logPath;
    }

    public void setLogPath(String logPath) {
        this.logPath = logPath;
    }

    public ReportGeneratorUtils(String reportConfig){
		this.reportConfig=reportConfig;
		try {
			InputStream inputStream = null;
			try {
				ServletContext servletContext = SpringWebApp.getServletContext();
				if (servletContext!=null) {
					inputStream = servletContext.getResourceAsStream("/WEB-INF/classes/BasicGroovy.groovy");
				}
			} catch (Exception e) {
			}
			if (inputStream==null) {
				inputStream=ReportThread.class.getResourceAsStream("\\BasicGroovy.groovy");
			}
			if(inputStream!=null) {
				baseScript=IOUtils.toString(inputStream, "utf8");
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 取得報表
	 * @param filePath
	 * @return
	 */
	public ReportGenerator getReportGenerator(String filePath ){
		XStream xStream=new XStream();
		XStream.setupDefaultSecurity(xStream);
		Class<?>[] classes = {
				ReportGenerator.class,
				Algorithm.class,
				Field.class,
				Key.class,
				MainFile.class,
				NewData.class,
				DeleteData.class,
				ProcessDetail.class,
				QueryData.class,
				ResultTable.class,
				UpdateData.class,
				OutputExcel.class,
				Column.class
		};
		xStream.allowTypes(classes);
		xStream.processAnnotations(classes);
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

		if(defaultListableBeanFactory.containsBean(filePath)){
			TempFile tempFile = (TempFile) defaultListableBeanFactory.getBean(filePath);
			return (ReportGenerator) xStream.fromXML(tempFile.getFile());
		}
		return null;
	}
	/**
	 * 執行主方法
	 * @param generator
	 * @param binding
	 * @return
	 * @throws Exception
	 */
	public List execMainFile(ReportGenerator generator,Binding binding ) throws Exception{
		MainFile mainFile=generator.getAlgorithm().getMainFile();
		List<QueryData> queryDatas = mainFile.getQueryDatas();
		if (queryDatas != null&&queryDatas.size()>0) {
            fileUtils.writeStringToFile(this.logPath,
                    "【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】查詢MainFile資料--開始\r\n");
			List mainData = execQueryData(queryDatas.get(0), binding);
            fileUtils.writeStringToFile(this.logPath,
                    "【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】查詢MainFile資料--結束 共【"
                            +(mainData!=null?mainData.size():0)+"】資料\r\n");
			if (mainData == null||mainData.size()==0) {
				return null;
			}
			for (int i = 1; i < queryDatas.size(); i++) {
				QueryData queryData = queryDatas.get(i);
				String where = queryData.getWhere();
				Map<String, String> joinColMap = queryData.getJoinColMap();
				if (joinColMap != null) {
					StringBuilder joinCons = new StringBuilder();
					for (Map.Entry<String, String> entry : joinColMap.entrySet()) {
						String value = entry.getValue();
						String key = entry.getKey();
						if (where!=null&&where.contains(key)) {
							continue;
						}
						joinCons.append(" and ").append(key);
						if(mainData.size()==1){
							joinCons.append("='").append(((Map) mainData.get(0)).get(value)).append("'");
						}else{
							joinCons.append(" in (");
							for (int j = 0; j < mainData.size(); j++) {
								Object mainDatum = mainData.get(j);
								if (j > 0) {
									joinCons.append(',');
								}
								joinCons.append("'").append(((Map) mainDatum).get(value)).append("'");
							}
						}
					}
					if (joinCons.length() > 0) {
						where=where==null||where.length()==0?joinCons.toString().replaceFirst(" and",""):(where+joinCons.toString());
					}
					queryData.setWhere(where); fileUtils.writeStringToFile(this.logPath,
                            "【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】查詢MainFile資料--開始\r\n");

					List list = execQueryData(queryData, binding);
                    fileUtils.writeStringToFile(this.logPath,
                            "【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】查詢MainFile資料--結束 共【"
                                    +(mainData!=null?mainData.size():0)+"】資料\r\n");
					if (list == null||list.isEmpty()) {
						return null;
					}
					for (Object mainDatum : mainData) {
						Map datum = (Map) mainDatum;
						for (Object childData : list) {
							Map data = (Map) childData;
							boolean flag=true;
							for (Map.Entry<String, String> entry : joinColMap.entrySet()) {
								Object mV = datum.get(entry.getValue());
								Object cV = data.get(entry.getKey());
								flag = mV.equals(cV);
								if(!flag)break;
							}
							if (flag) {
								datum.putAll(data);
							}
						}
					}
				}
			}
			return mainData;
		}
		return null;
	}
	
	public void execDeleteData(DeleteData deleteData, HashMap param ) throws Exception{
		String name=deleteData.getName();
		String where=deleteData.getWhere();

		String tableName=deleteData.getName();
		 String schema=tableSetUtils.getSchema(tableName);
		 if(schema!=null){
			tableName=schema+"."+tableName;
		 }
		String sql = "delete FROM " + tableName + " WHERE " + where;
		if(DataSourceUtils.showSQL){
		}
        fileUtils.writeStringToFile(this.logPath,
                "【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】清除資料DeleteData--sql【"+sql+"】\r\n");
		new DataSourceUtils().update(sql, param);
	}
	
	
	
	
	
	
	/**
	 * 取得層級
	 * @param generator
	 * @return
	 */
	public List<HashMap<String, String>> getLevel(ReportGenerator generator) {
		MainFile mainFile = generator.getAlgorithm().getMainFile();
		List<Key> keys = mainFile.getKeys();
		List<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
		if (keys != null && keys.size() > 0) {
			Collections.sort(keys);
			for (int i = 0; i < keys.size(); i++) {
				HashMap<String, String> map = new HashMap<String, String>();
				map.put(keys.get(i).getName(), "");
				list.add(map);
			}
		}
		return list;
	}
	/**
	 * 處理消息主體，將每一步的結果存檔List中
	 * @param generator
	 * @param binding
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, List<HashMap<String, Object>>> execProcessDetail(ReportGenerator generator,Binding binding) throws Exception{
		
		ProcessDetail detail=generator.getAlgorithm().getProcessDetails();
		if (detail!=null) {
			List<QueryData> queryDatas=detail.getQueryDatas();
			if(queryDatas!=null){
				HashMap<String,  List<HashMap<String, Object>>> resultMap=new HashMap<String,  List<HashMap<String, Object>>>();
				for(int i=0;i<queryDatas.size();i++){
					QueryData queryData=queryDatas.get(i);
					String name=queryData.getName();
					fileUtils.writeStringToFile(this.logPath,
							"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】查詢ProcessDetail--開始\r\n");
					List list=execQueryData(queryData, binding);
					fileUtils.writeStringToFile(this.logPath,
							"【"+DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】查詢ProcessDetail--結束共【"
									+(list!=null?list.size():0)+"】資料\r\n");
					resultMap.put(name, list);
					binding.setVariable("resultMap", resultMap);
				}
				return resultMap;
			}
		}
		return null;
	}
	
	
	
	public List execQueryData(QueryData queryData,Binding binding) throws Exception{
		
		if(queryData.getJavaApi()!=null){
            fileUtils.writeStringToFile(this.logPath,
                    "【" + DateUtils.format(new Date(), DateUtils.FORMAT_6) + "】調用外部接口api【"+queryData.getJavaApi()+"】--開始\r\n");
			return (List) execField(binding,queryData.getName()+"javaApi", queryData.getJavaApi());
		}
		
		String name=queryData.getName();
		String column=queryData.getColumn();
		String where=queryData.getWhere();
		String groupby=queryData.getGroupBy();
		String orderby=queryData.getOrderBy();
		if(column==null || column.trim().length()==0){
			column="*";
		}
		List<Field> fields=queryData.fields;
		Object obj[]=null;
		HashMap map=new HashMap();
		if(fields!=null){
			map=execField(binding,queryData.getName(), fields);
		}

		String schema=tableSetUtils.getSchema(name);
		if(schema!=null){
			name=schema+"."+name;
		}
        DataSourceUtils dataSourceUtils= new DataSourceUtils();
		if(StringUtils.isNotBlank(this.logPath)) {
            dataSourceUtils.setLogPath(this.logPath);
        }
		List list=dataSourceUtils.queryForList(queryData,column, name, where,groupby, orderby, map);
		return list;
	}
	
	
	
	public ProcessHeadTail getProcessTail(ReportGenerator generator,String type, int level){
		
		List<ProcessHeadTail> tails=null;
		if(type.equals("Process_Head")){
			tails= generator.getAlgorithm().getProcessHead();
		}
		if(type.equals("Process_Tail")){
			tails= generator.getAlgorithm().getProcessTail();
		}
		
		if(tails!=null && tails.size()>=0){
			Collections.sort(tails);
			
			for(int i=0;i<tails.size();i++){
				ProcessHeadTail headTail=tails.get(i);
				if(level==level){
					return headTail;
				}
			}
		}
		return null;
	}
	
	
	public ResultTable getResultTable(ReportGenerator generator,String name){
		List<ResultTable> resultTables= generator.getResultTables();
		for(int i=0;i<resultTables.size();i++){
			ResultTable table=resultTables.get(i);
			if(name!=null && table.getName()!=null && table.getName().equals(name)){
				return table;
			}
		}
		return null;
		
	}
	
	
	public List<String> getFieldScript(ResultTable table){
		List<String> script=new ArrayList<String>();
		List<Field> fields=table.getFields();
		 for(int i=0;i<fields.size();i++){
			 String val=fields.get(i).getValue();
			 if(val!=null && val.trim().length()!=0)
			 {
				 script.add(val);
			 }else{
				 script.add(null);
			 }
			 
		 }
		 return script;
	}	
	
	public String getResultTableInsert(ResultTable table){
		if(table!=null){
			 String column="";
			 String param="";
			 List<Field> fields=table.getFields();
			 for(int i=0;i<fields.size();i++){
				 Field field=fields.get(i);
				 
				 if(  (i==fields.size()-1)){
					 column+=fields.get(i).getName();
					 param+=":"+fields.get(i).getName();
				 }else{
					 column+=fields.get(i).getName()+",";
					 param+=":"+fields.get(i).getName()+",";
				 }
			 }
			 
			 String tableName=table.getName();
			 String schema=tableSetUtils.getSchema(table.getName());
			 if(schema!=null){
				tableName=schema+"."+tableName;
			 }

			 return "insert into "+tableName+"("+column+") values("+param+")";
		}
		return null;
	}
	
	
	/**
	 * where 如何表達
	 * @param table
	 * @return
	 */
	public String getResultTableUpdate(ResultTable table){
		if(table!=null){
			 StringBuilder column= new StringBuilder();
			 List<Field> fields=table.getFields();
			 for(int i=0;i<fields.size();i++){
				 Field field=fields.get(i);
				 column.append(field.getName()).append("=:").append(field.getName());
				 if(i<fields.size()-1){
					 column.append(",");
				 }
			 }
			 
			 String tableName=table.getName();
			 String schema=tableSetUtils.getSchema(table.getName());
			 if(schema!=null){
				tableName=schema+"."+tableName;
			 }

			 return "update "+tableName+" set "+column+ " where "+table.getWhere();
		}
		return null;
	}
	
	
	public HashMap<String,Object> execField(Binding binding,String queryName,List<Field> fields) throws Exception{
		HashMap<String,Object> map=new LinkedHashMap<String,Object>();
		if(fields!=null){
			for(int i=0;i<fields.size();i++){
				Field field=fields.get(i);
				String name=field.getName();
				String script=field.getValue();
				if(script!=null && script.trim().length()!=0){
					Object obj=null;
					try{
						//long q=System.currentTimeMillis();
						CompiledScript compiledScript=getCompiledScript(queryName+i,baseScript.replace("{Field}",script));
						SimpleBindings bindings=new SimpleBindings();
						bindings.putAll(binding.getVariables());
						obj=compiledScript.eval(bindings);
					}catch(Exception e){
						e.printStackTrace();
					}
					map.put(name, obj);
				}else{
					map.put(name, null);
				}
			}
		}
		return map;
	}
	public Object execField(Binding binding,String queryName,String shell) throws Exception{
		if(shell!=null && shell.trim().length()!=0){
			shell=baseScript.replace("{Field}",shell);
			try{
				CompiledScript compiledScript=getCompiledScript(queryName,shell);
				SimpleBindings bindings=new SimpleBindings();
				bindings.putAll(binding.getVariables());
				return compiledScript.eval(bindings);
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		return null;
	}

	public CompiledScript getCompiledScript(String key,String script) throws ScriptException {
		CompiledScript compiledScript=ReportThread.scriptMap.get(this.reportConfig+key);

		if(compiledScript==null){
			ScriptEngineManager manager = new ScriptEngineManager();
			ScriptEngine engine = manager.getEngineByName("groovy");
			compiledScript =((Compilable)engine).compile(script);
			ReportThread.scriptMap.put(this.reportConfig+key,compiledScript);
		}else{
		}
//		try{
//			FileOutputStream out=new FileOutputStream("d:\\a.txt",true);
//			out.write((this.reportConfig+key+"\r\n").getBytes());
//			out.close();
//		}catch(Exception e){
//			e.printStackTrace();
//		}


		return compiledScript;
	}

	public String getReportConfig() {
		return reportConfig;
	}

	public void setReportConfig(String reportConfig) {
		this.reportConfig = reportConfig;
	}

	public String getBaseScript() {
		return baseScript;
	}

	public void setBaseScript(String baseScript) {
		this.baseScript = baseScript;
	}
}
