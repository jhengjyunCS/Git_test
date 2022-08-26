package com.report.unit.sett.table;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

import java.util.ArrayList;
import java.util.List;

@XStreamAlias("Column")
public class Column {
    /**程序用欄位名**/
    @XStreamAsAttribute
    private String name;
    /**程序用欄位中文說明**/
    @XStreamAsAttribute
    private String comment;
    /**程序用資料類型**/
    @XStreamAsAttribute
    private String type;
    /**資料庫例名**/
    @XStreamAsAttribute
    private String dbName;
    /**資料庫類型**/
    @XStreamAsAttribute
    private String dbType;
    /**資料庫欄位長度**/
    @XStreamAsAttribute
    private int dbLength;

    public List<DynamicFormItem> dynamicFormItems=null;

    public Column(String name, String comment, String type, String dbName, String dbType, int dbLength) {
        this.name = name;
        this.comment = comment;
        this.type = type;
        this.dbName = dbName;
        this.dbType = dbType;
        this.dbLength = dbLength;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getDbType() {
        return dbType;
    }

    public void setDbType(String dbType) {
        this.dbType = dbType;
    }

    public int getDbLength() {
        return dbLength;
    }

    public void setDbLength(int dbLength) {
        this.dbLength = dbLength;
    }

    public List<DynamicFormItem> getDynamicFormItems() {
        return dynamicFormItems;
    }

    public void setDynamicFormItems(List<DynamicFormItem> dynamicFormItems) {
        this.dynamicFormItems = dynamicFormItems;
    }

    @Override
    public String toString() {
        return "Column{" +
                "name='" + name + '\'' +
                ", comment='" + comment + '\'' +
                ", type='" + type + '\'' +
                ", dbName='" + dbName + '\'' +
                ", dbType='" + dbType + '\'' +
                ", dbLength=" + dbLength +
                '}';
    }
}
