package com.inqgen.nursing.dynamic.form.bean.db;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("InsertOrUpdate")
public class InsertOrUpdate extends Statement{
    private String selectSql;
    private String insertSql;
    private String updateSql;

    public String getSelectSql() {
        return replaceSchema(selectSql);
    }

    public void setSelectSql(String selectSql) {
        this.selectSql = selectSql;
    }

    public String getInsertSql() {
        return replaceSchema(insertSql);
    }

    public void setInsertSql(String insertSql) {
        this.insertSql = insertSql;
    }

    public String getUpdateSql() {
        return replaceSchema(updateSql);
    }

    public void setUpdateSql(String updateSql) {
        this.updateSql = updateSql;
    }

    @Override
    public String getSql() {
        return isNull(selectSql,insertSql,updateSql);
    }
}
