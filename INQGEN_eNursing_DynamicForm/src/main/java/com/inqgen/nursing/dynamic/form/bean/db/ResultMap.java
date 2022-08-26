
package com.inqgen.nursing.dynamic.form.bean.db;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.thoughtworks.xstream.annotations.*;


@XStreamAlias("resultMap")
public class ResultMap {

    @XStreamAsAttribute
    private String name;
    @XStreamImplicit
    private List<Result> results;
    @XStreamOmitField
    private Map<String,Result> resultMap;

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, Result> getResultMap() {
        if (resultMap == null&&results!=null&&results.size()>0) {
            synchronized (this) {
                resultMap = new LinkedHashMap<String, Result>();
                for (Result result : results) {
                    resultMap.put(result.getColumn(), result);
                }
            }
        }
        return resultMap;
    }

    @Override
    public String toString() {
        return "ResultMap [name=" + name + ", results=" + results + "]";
    }


}
