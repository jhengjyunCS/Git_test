package com.report.unit.sett;

import java.util.ArrayList;
import java.util.List;

import com.report.unit.sett.table.Column;
import com.report.unit.sett.table.ForeignKey;
import com.report.unit.sett.table.PrimaryKey;
import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
@XStreamAlias("Table")
public class Table {
	public String dbSource;
	public String type;
	public String schema;
	public String name;
	public String selectSql;
	///暫時無用
	List<TableColumn> tableColumns;
	public List<Column> columns=new ArrayList<Column>();
	public List<PrimaryKey> primaryKeys=new ArrayList<PrimaryKey>();
	public List<ForeignKey> foreignKeys=new ArrayList<ForeignKey>();
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getSchema() {
		return schema;
	}
	public void setSchema(String schema) {
		this.schema = schema;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDbSource() {
		return dbSource;
	}
	public void setDbSource(String dbSource) {
		this.dbSource = dbSource;
	}
	public List<TableColumn> getTableColumns() {
		return tableColumns;
	}
	public void setTableColumns(List<TableColumn> tableColumns) {
		this.tableColumns = tableColumns;
	}
	public String getSelectSql() {
		return selectSql;
	}
	public void setSelectSql(String selectSql) {
		this.selectSql = selectSql;
	}

	public List<Column> getColumns() {

		return columns;
	}

	public void setColumns(List<Column> columns) {
		this.columns = columns;
	}

	public List<PrimaryKey> getPrimaryKeys() {
		return primaryKeys;
	}

	public void setPrimaryKeys(List<PrimaryKey> primaryKeys) {
		this.primaryKeys = primaryKeys;
	}

	public List<ForeignKey> getForeignKeys() {
		return foreignKeys;
	}

	public void setForeignKeys(List<ForeignKey> foreignKeys) {
		this.foreignKeys = foreignKeys;
	}

	@Override
	public String toString() {
		return "Table{" +
				"dbSource='" + dbSource + '\'' +
				", type='" + type + '\'' +
				", schema='" + schema + '\'' +
				", name='" + name + '\'' +
				", selectSql='" + selectSql + '\'' +
				", columns=" + columns +
				'}';
	}
}
