package com.report.unit.sett.report;

import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
@XStreamAlias("OutputExcel")
public class OutputExcel {
	@XStreamAlias("tabName")
	@XStreamAsAttribute
	public String tabName;

	@XStreamAlias("Column")
	@XStreamImplicit(itemFieldName="Column")
	List<Column> Column;
	
	public String getTabName() {
		return tabName;
	}
	public void setTabName(String tabName) {
		this.tabName = tabName;
	}
	public List<Column> getColumn() {
		return Column;
	}
	public void setColumn(List<Column> column) {
		Column = column;
	}
	@Override
	public String toString() {
		return "OutputExcel [tabName=" + tabName + ", Column=" + Column
				+ "]";
	}
	
	
	
}
