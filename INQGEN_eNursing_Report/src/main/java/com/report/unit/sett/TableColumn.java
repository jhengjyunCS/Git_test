package com.report.unit.sett;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("TableColumn")
public class TableColumn {
	public String name;
	public String columnType;
	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getColumnType() {
		return columnType;
	}
	public void setColumnType(String columnType) {
		this.columnType = columnType;
	}
	
	
	
	
	
}
