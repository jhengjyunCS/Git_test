package com.report.unit.sett.report;

import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
@XStreamAlias("ResultTable")
public class ResultTable {
	@XStreamAlias("NAME")
	@XStreamAsAttribute
	public String name;
	@XStreamAlias("where")
	@XStreamAsAttribute
	public String where;

	@XStreamAlias("Description")
	@XStreamAsAttribute
	public String description;

	@XStreamAlias("Field")
	@XStreamImplicit(itemFieldName="Field")
	List<Field> fields;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Field> getFields() {
		return fields;
	}

	public void setFields(List<Field> fields) {
		this.fields = fields;
	}

	public String getWhere() {
		return where;
	}

	public void setWhere(String where) {
		this.where = where;
	}

	@Override
	public String toString() {
		return "ResultTable [name=" + name + ", description=" + description
				+ ", fields=" + fields + "]";
	}
	
	
	
}
