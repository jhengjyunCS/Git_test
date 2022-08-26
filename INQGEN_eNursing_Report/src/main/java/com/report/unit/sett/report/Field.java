package com.report.unit.sett.report;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamConverter;
import com.thoughtworks.xstream.converters.extended.ToAttributedValueConverter;

@XStreamAlias("Field")
@XStreamConverter(value = ToAttributedValueConverter.class, strings = { "value" })
public class Field {
	@XStreamAlias("NAME")
	
	@XStreamAsAttribute
	public String name;
	
	@XStreamAlias("isPk")
	public boolean isPk;
	
	private String value;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "Field [name=" + name + ", value=" + value + "]";
	}

	public boolean isPk() {
		return isPk;
	}

	public void setPk(boolean isPk) {
		this.isPk = isPk;
	}
	
	
	
}


