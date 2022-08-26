package com.report.unit.sett.report;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;

import java.util.List;

@XStreamAlias("ForEach")
public class ForEach {
    @XStreamAlias("begin")
    @XStreamAsAttribute
    public String begin;
    @XStreamAlias("item")
    @XStreamAsAttribute
    public String item;
    @XStreamAlias("regex")
    @XStreamAsAttribute
    public String regex;
    @XStreamAlias("end")
    @XStreamAsAttribute
    public String end;
    @XStreamAlias("step")
    @XStreamAsAttribute
    public String step;
    @XStreamAlias("var")
    @XStreamAsAttribute
    public String var;
    @XStreamAlias("unikey")
    @XStreamAsAttribute
    public String unikey;
    @XStreamImplicit(itemFieldName="NewData")
    public List<NewData> newDataList;
    @XStreamImplicit(itemFieldName="UpdateData")
    public List<UpdateData> updateDataList;

    public String getBegin() {
        return begin;
    }

    public void setBegin(String begin) {
        this.begin = begin;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getRegex() {
        return regex;
    }

    public void setRegex(String regex) {
        this.regex = regex;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public String getStep() {
        return step;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public String getVar() {
        return var;
    }

    public void setVar(String var) {
        this.var = var;
    }

    public String getUnikey() {
        return unikey;
    }

    public void setUnikey(String unikey) {
        this.unikey = unikey;
    }

    public List<NewData> getNewDataList() {
        return newDataList;
    }

    public void setNewDataList(List<NewData> newDataList) {
        this.newDataList = newDataList;
    }

    public List<UpdateData> getUpdateDataList() {
        return updateDataList;
    }

    public void setUpdateDataList(List<UpdateData> updateDataList) {
        this.updateDataList = updateDataList;
    }
}
