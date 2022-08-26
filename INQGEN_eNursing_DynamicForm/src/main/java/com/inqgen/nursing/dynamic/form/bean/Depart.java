package com.inqgen.nursing.dynamic.form.bean;

/**
 * @author RainKing
 * @date 2019/11/15 11:44
 */
public class Depart {
    private String id;
    private String departId;
    private String departName;
    private String departType;
    private String parentId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDepartId() {
        return departId;
    }

    public void setDepartId(String departId) {
        this.departId = departId;
    }

    public String getDepartName() {
        return departName;
    }

    public void setDepartName(String departName) {
        this.departName = departName==null||departName.trim().length()==0?departName:departName.replaceAll("[^.\\w\\u4E00-\\u9FA5]+","_").replaceAll("_$","");
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getDepartType() {
        return departType;
    }

    public void setDepartType(String departType) {
        this.departType = departType;
    }
}
