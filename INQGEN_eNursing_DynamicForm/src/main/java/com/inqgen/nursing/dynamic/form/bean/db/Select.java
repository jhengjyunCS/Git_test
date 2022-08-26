package com.inqgen.nursing.dynamic.form.bean.db;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamOmitField;

import java.util.List;

@XStreamAlias("Select")
public class Select extends Statement{
    @XStreamOmitField
    private List<?> result;
    @XStreamAsAttribute
    private String resultMap;
    @XStreamAsAttribute
    private String target;
    @XStreamAsAttribute
    private String id;
    @XStreamAsAttribute
    private String mergeTo;
    @XStreamAsAttribute
    private String mergeKeys;

    public List<?> getResult() {
        return result;
    }

    public void setResult(List<?> result) {
        this.result = result;
    }

    public String getResultMap() {
        return resultMap;
    }

    public void setResultMap(String resultMap) {
        this.resultMap = resultMap;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMergeTo() {
        return mergeTo;
    }

    public void setMergeTo(String mergeTo) {
        this.mergeTo = mergeTo;
    }

    public String getMergeKeys() {
        return mergeKeys;
    }

    public void setMergeKeys(String mergeKeys) {
        this.mergeKeys = mergeKeys;
    }
}
