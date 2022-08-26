package com.report.unit.sett.report;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamConverter;
import com.thoughtworks.xstream.converters.extended.ToAttributedValueConverter;

@XStreamAlias("Column")
public class Column {
	@XStreamAlias("NAME")
	@XStreamAsAttribute
	public String name;

	@XStreamAlias("title")
	@XStreamAsAttribute
	public String title;

	@XStreamAlias("showDesc")
	@XStreamAsAttribute
	public String showDesc;
	
	@XStreamAlias("Data")
	public String data;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getShowDesc() {
		return showDesc;
	}
	public void setShowDesc(String showDesc) {
		this.showDesc = showDesc;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	@Override
	public String toString() {
		return "Column [name=" + name + ", title=" + title + ", showDesc=" + showDesc + ", data=" + data + "]";
	}
	
	
	
}


