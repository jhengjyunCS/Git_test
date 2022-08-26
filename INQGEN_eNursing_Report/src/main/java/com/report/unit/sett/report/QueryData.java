package com.report.unit.sett.report;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;

@XStreamAlias("QueryData")
public class QueryData {
	
	@XStreamAlias("NAME")
	@XStreamAsAttribute
	public String name;
	
	@XStreamAlias("DataSource")
	@XStreamAsAttribute
	public String dataSource;
	
	@XStreamAlias("Column")
	public String column;

	@XStreamAsAttribute
	public String joinCons;

	@XStreamAlias("Where")
	public String where;
	
	@XStreamAlias("GroupBy")
	public String groupBy;
	
	
	@XStreamAlias("OrderBy")
	public String orderBy;
	
	@XStreamAlias("Sql")
	public String sql;
	
	@XStreamAlias("JavaApi")
	public String javaApi;
	
	
	
	
	@XStreamAlias("Field")
	@XStreamImplicit(itemFieldName="Field")
	public List<Field> fields;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getWhere() {
		return where;
	}

	public void setWhere(String where) {
		this.where = where;
	}

	public String getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}

	public String getColumn() {
		return column;
	}

	public void setColumn(String column) {
		this.column = column;
	}

	public String getJoinCons() {
		return joinCons;
	}
	public Map<String,String> getJoinColMap() {
		if (joinCons != null) {
			Map<String, String> joinColMap = new LinkedHashMap<String, String>();
			String[] cons = joinCons.split(",");
			for (String con : cons) {
				String[] cols = con.split("=");
				joinColMap.put(cols[0], cols[1]);
			}
			return joinColMap;
		}
		return null;
	}

	public void setJoinCons(String joinCons) {
		this.joinCons = joinCons;
	}

	public String getGroupBy() {
		return groupBy;
	}

	public void setGroupBy(String groupBy) {
		this.groupBy = groupBy;
	}

	public List<Field> getFields() {
		return fields;
	}

	public void setFields(List<Field> fields) {
		this.fields = fields;
	}

	public String getDataSource() {
		return dataSource;
	}

	public void setDataSource(String dataSource) {
		this.dataSource = dataSource;
	}

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public String getJavaApi() {
		return javaApi;
	}

	public void setJavaApi(String javaApi) {
		this.javaApi = javaApi;
	}
	
	
	
}
