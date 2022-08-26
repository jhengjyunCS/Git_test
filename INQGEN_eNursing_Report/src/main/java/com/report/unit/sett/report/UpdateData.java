package com.report.unit.sett.report;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

@XStreamAlias("UpdateData")
public class UpdateData {
	@XStreamAlias("NAME")
	@XStreamAsAttribute
	public String name;

	public String test;


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTest() {
		return test;
	}

	public void setTest(String test) {
		this.test = test;
	}

	@Override
	public String toString() {
		return "UpdateData [name=" + name + "]";
	}
	
	
}
