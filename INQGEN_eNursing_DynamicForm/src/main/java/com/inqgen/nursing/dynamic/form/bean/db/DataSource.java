package com.inqgen.nursing.dynamic.form.bean.db;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamOmitField;

@XStreamAlias("DataSource")
public class DataSource {
    private List<Resource> resources;
    private List<ResultMap> resultMaps;
    @XStreamOmitField
    private Map<String, ResultMap> resultMapMap;
    private List<ParameterMap> parameterMaps;
    @XStreamOmitField
    private Map<String, ParameterMap> parameterMapMap;

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public List<ResultMap> getResultMaps() {
        return resultMaps;
    }

    public void setResultMaps(List<ResultMap> resultMaps) {
        this.resultMaps = resultMaps;
    }

    public Map<String, ResultMap> getResultMapMap() {
        if (resultMapMap == null && resultMaps != null&&resultMaps.size()>0) {
            synchronized (this) {
                resultMapMap = new LinkedHashMap<String, ResultMap>();
                for (ResultMap resultMap : resultMaps) {
                    resultMapMap.put(resultMap.getName(), resultMap);
                }
            }
        }
        return resultMapMap;
    }

    public void setResultMapMap(Map<String, ResultMap> resultMapMap) {
        this.resultMapMap = resultMapMap;
    }

    public List<ParameterMap> getParameterMaps() {
        return parameterMaps;
    }

    public void setParameterMaps(List<ParameterMap> parameterMaps) {
        this.parameterMaps = parameterMaps;
    }

    public Map<String, ParameterMap> getParameterMapMap() {
        if (parameterMapMap == null&&parameterMaps!=null&&parameterMaps.size()>0) {
            synchronized (this) {
                parameterMapMap = new LinkedHashMap<String, ParameterMap>();
                for (ParameterMap parameterMap : parameterMaps) {
                    parameterMapMap.put(parameterMap.getName(), parameterMap);
                }
            }
        }
        return parameterMapMap;
    }

    public void setParameterMapMap(Map<String, ParameterMap> parameterMapMap) {
        this.parameterMapMap = parameterMapMap;
    }
}
