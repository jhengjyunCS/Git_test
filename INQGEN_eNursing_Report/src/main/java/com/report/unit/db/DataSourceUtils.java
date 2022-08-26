package com.report.unit.db;


import com.inqgen.nursing.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import com.inqgen.nursing.utils.StringUtils;
import com.report.unit.DateUtils;
import com.report.unit.FileUtils;
import com.report.unit.TableSetUtils;
import com.report.unit.sett.Table;
import com.report.unit.sett.report.QueryData;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.util.*;
public class DataSourceUtils {
	public static boolean showSQL=false;
    FileUtils fileUtils=new FileUtils();
    public String logPath;

    public String getLogPath() {
        return logPath;
    }

    public void setLogPath(String logPath) {
        this.logPath = logPath;
    }

    static HashMap<String, DataSource> registerDataSource=new HashMap<String, DataSource>();
	TableSetUtils tableSetUtils= new TableSetUtils();
	
	public static void register(String name,String driverClassName, String url,String username, String password ){
		 registerDataSource.put(name,getDataSource(driverClassName, url, username, password));
	}
	
	public static void register(String name,String jndi){
		 registerDataSource.put(name,getJNDIDataSource(jndi));
	}
	public static DataSource getJNDIDataSource(String jndi){
		try{
			Context context = new InitialContext();
			return (DataSource) context.lookup(StringUtils.preventLdapInject(jndi));
		}catch(Exception e){
			return null;
		}
	}
	
	public static DataSource  getDataSource(String name) throws Exception{
		DataSource ds=registerDataSource.get(name);
		if(ds==null){
			throw new Exception("找不到資料源，請注冊！"+name);
		}
		return ds;
	}
	private static DataSource getDataSource(String driverClassName, String url,String username, String password) {
		DriverManagerDataSource dataSource = new DriverManagerDataSource(url,username, password);
		dataSource.setDriverClassName(driverClassName);
		return dataSource;
	}
	
	
	
	public List queryForList(QueryData queryData,String column,String tableName,String where ,String groupBy,String order,HashMap param) throws Exception{

		StringBuffer bf=new StringBuffer();
		bf.append("select ");
		if(column!=null){
			bf.append(column);	
		}else{
			bf.append(" *");	
		}
		if(tableName!=null){
			bf.append(" from "+tableName);
		}else{
			throw new Exception("無效的資料表查詢");
		}
		if(where!=null){
			bf.append(" where "+where);
		}
		
		if(groupBy!=null && groupBy.trim().length()!=0){
			bf.append(" group by "+groupBy);
		}
		
		if(order!=null && order.trim().length()!=0){
			bf.append(" order by "+order);
		}
		//讀取資料庫連線
		boolean isGform=false;
		String conn=null;
		List<Table> tables= new TableSetUtils().getTableSchema().getTables();
		for(int i=0;i<tables.size();i++){
			Table table=tables.get(i);
			if(table.getType().equals("XmlForm") && table.getName().equals(tableName.replaceAll("\\s+|(\\w+\\.)", ""))){
				String sql=table.getSelectSql().replace("{FORMTYPE}", tableName.replaceAll("\\s+|(\\w+\\.)",""))
                        ;
                if(where!=null){
                    sql=sql.replace("{where}", where);
                }
				if(order!=null && order.trim().length()!=0){
					sql=sql.replace("{ORDER}", "order by "+order);
				}else{
					sql=sql.replace("{ORDER}", "");
				}
				bf=new StringBuffer(sql);
				isGform=true;
				conn=table.getDbSource();
				break;
			}
		}
		List<com.report.unit.sett.DataSource> ds=tableSetUtils.getTableSchema().getDataSources();
		//替換schema  替換占位符
		if(isGform){
			String sql=bf.toString();
			for(int i=0;i<ds.size();i++){
				String name=ds.get(i).getName();
				String schema=ds.get(i).getSchema();
				sql=sql.replace("${"+name+"}", schema);
			}
			bf=new StringBuffer(sql);
		}
		
		if(queryData.getSql()!=null && queryData.getDataSource()!=null){
			bf=new StringBuffer(queryData.getSql());
			String sql=bf.toString();
			for(int i=0;i<ds.size();i++){
				String name=ds.get(i).getName();
				String schema=ds.get(i).getSchema();
				sql=sql.replace("${"+name+"}", schema);
			}
			bf=new StringBuffer(sql);
			conn=queryData.getDataSource();
		}else if(isGform==false){
			conn=tableSetUtils.getDbSource(bf.toString());
		}
		
		javax.sql.DataSource dataSource= DataSourceUtils.getDataSource(conn);
		String dbName=null;
		try{
			java.sql.Connection connection=dataSource.getConnection();
			dbName=connection.getMetaData().getDatabaseProductName();
			connection.close();
		}catch(Exception e){
			e.printStackTrace();
		}
		NamedParameterJdbcTemplate jdbc_nis=new NamedParameterJdbcTemplate(dataSource);

		List dbList=null;
		if(StringUtils.isNotBlank(dbName) && dbName.contains("DB2")
                && !(bf.toString().contains("CALL") || bf.toString().contains("call"))){
                bf.append(" with ur");
		}
        fileUtils.writeStringToFile(this.logPath,
                "【"+ DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】查詢sql【"+bf.toString()+"】\r\n");
        fileUtils.writeStringToFile(this.logPath,
                "【"+ DateUtils.format(new Date(),DateUtils.FORMAT_6)+"】查詢參數【"+param+"】\r\n");
        dbList=jdbc_nis.queryForList(bf.toString(),param);
		//判讀如果查詢的是動態表單，則將資料轉置打橫
		if(isGform){
			//動態表單轉至
			List transList=new ArrayList();
			//臨時用index
			Map<String, Map> tempMap=new HashMap();
			if(dbList.size()>0)
			{
				for(int j=0;j<dbList.size();j++)
				{
					Map item=(Map)dbList.get(j);
					String key=item.get("FORMID").toString();
					Map newMap=null;
					if(tempMap.containsKey(key)){
						newMap=tempMap.get(key);
					}else{
						newMap=new LinkedHashMap();
						tempMap.put(key, newMap);
						transList.add(newMap);
					}

					Iterator it=item.keySet().iterator();
					while(it.hasNext()){
						Object itKey=it.next();

						if( itKey.toString().equals("ITEMKEY") || itKey.toString().equals("ITEMVALUE") || itKey.toString().equals("OTHERVALUE") ){
						}else{
							Object itVal=item.get(itKey);
							newMap.put(itKey.toString(), itVal);
						}
					}
					Object itKey=item.get("ITEMKEY");
					Object itValue=item.get("ITEMVALUE");
					Object itOVal=item.get("OTHERVALUE");
					if(itKey!=null){
						newMap.put(itKey.toString(), itValue);
						newMap.put(itKey+"_OTHERVALUE", itOVal);
					}
				}
			}
			tempMap.clear();
			return transList;
		}
		return dbList;
	}

	
	public int update(String sql,HashMap param) throws Exception{
		String conn=new TableSetUtils().getDbSource(sql);
		NamedParameterJdbcTemplate jdbc_nis=new NamedParameterJdbcTemplate(DataSourceUtils.getDataSource(conn));
		return jdbc_nis.update(sql, param);
	}
	public static void main(String[] args) {
		
		
	}
}
