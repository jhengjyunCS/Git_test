package com.inqgen.nursing.dynamic.form.bean.db;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;


@XStreamAlias("result")
public class Result {
	@XStreamAsAttribute
	public String column;
	@XStreamAsAttribute
	public String property;
	
	public String getColumn() {
		return column;
	}
	public void setColumn(String column) {
		this.column = column;
	}
	public String getProperty() {
		return property;
	}
	public void setProperty(String property) {
		this.property = property;
	}
	@Override
	public String toString() {
		return "Result [column=" + column + ", property=" + property + "]";
	}
	
	

}
