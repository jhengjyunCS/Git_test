package com.report.unit.sett.report;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("DeleteData")
public class DeleteData extends QueryData{
    private String test;

    public String getTest() {
        return test;
    }

    public void setTest(String test) {
        this.test = test;
    }
}
