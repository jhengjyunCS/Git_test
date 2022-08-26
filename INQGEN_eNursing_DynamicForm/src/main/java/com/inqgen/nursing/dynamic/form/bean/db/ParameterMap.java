package com.inqgen.nursing.dynamic.form.bean.db;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
import com.thoughtworks.xstream.annotations.XStreamOmitField;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author RainKing
 * @date 2019/9/26 10:11
 */
@XStreamAlias("parameterMap")
public class ParameterMap {
    @XStreamAsAttribute
    private String name;
    @XStreamImplicit
    private List<Parameter> parameters;
    @XStreamOmitField
    private Map<String, Parameter> parameterMap;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Parameter> getParameters() {
        return parameters;
    }

    public void setParameters(List<Parameter> parameters) {
        this.parameters = parameters;
    }

    public Map<String, Parameter> getParameterMap() {
        if (parameterMap == null&&parameters!=null&&parameters.size()>0) {
            synchronized (this) {
                parameterMap = new LinkedHashMap<String, Parameter>();
                for (Parameter parameter : parameters) {
                    parameterMap.put(parameter.getItemName(), parameter);
                }
            }
        }
        return parameterMap;
    }

    public void setParameterMap(Map<String, Parameter> parameterMap) {
        this.parameterMap = parameterMap;
    }
}
