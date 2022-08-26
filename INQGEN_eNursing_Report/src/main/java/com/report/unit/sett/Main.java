package com.report.unit.sett;

import java.util.ArrayList;

public class Main {
	public static void main(String[] args) {
		Table table=new Table();
		table.dbSource="nis";
		table.type="Table";
		table.name="PAT_ADM_CASE";
		table.schema="his021";
		
		TableColumn column=new TableColumn();
		column.name="HNURSTA";
		column.columnType="CHAR(4)";
		
		
		ArrayList cols=new ArrayList();
		cols.add(column);
		column=new TableColumn();
		column.name="HHISNUM";
		column.columnType="CHAR(8)";
		cols.add(column);
		
		table.setTableColumns(cols);
		
		TableSchema schema=new TableSchema();
		ArrayList tabs=new ArrayList();
		tabs.add(table);
		tabs.add(table);
		
		schema.setTables(tabs);
		
		com.thoughtworks.xstream.XStream xStream=new com.thoughtworks.xstream.XStream();
		xStream.processAnnotations(new Class[]{
				com.report.unit.sett.TableSchema.class,
				com.report.unit.sett.Table.class,
				com.report.unit.sett.TableColumn.class
		});
	}
}
