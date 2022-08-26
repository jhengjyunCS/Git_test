package com.report.unit.sett.report;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

@XStreamAlias("GformData")
public class GformData {
	@XStreamAlias("NAME")
	@XStreamAsAttribute
	public String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	private String test;

    public String getTest() {
        return test;
    }

    public void setTest(String test) {
        this.test = test;
    }

	@Override
	public String toString() {
		return "GformData [name=" + name + "]";
	}
	
	
}
