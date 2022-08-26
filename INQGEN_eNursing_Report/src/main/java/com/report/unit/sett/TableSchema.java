package com.report.unit.sett;

import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
@XStreamAlias("TableSchema")
public class TableSchema {
	
	@XStreamAlias("DataSource")
	@XStreamImplicit(itemFieldName="DataSource")
	List<DataSource> dataSources;
	
	List<Table> tables;

	public List<Table> getTables() {
		return tables;
	}

	public void setTables(List<Table> tables) {
		this.tables = tables;
	}

	public List<DataSource> getDataSources() {
		return dataSources;
	}

	public void setDataSources(List<DataSource> dataSources) {
		this.dataSources = dataSources;
	}

	@Override
	public String toString() {
		return "TableSchema{" +
				"dataSources=" + dataSources +
				", tables=" + tables +
				'}';
	}
}
