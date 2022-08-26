package com.inqgen.nursing.dynamic.form.bean.db;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@XStreamAlias("InsertOneMany")
public class InsertOneMany extends Statement {
    @XStreamAsAttribute
    private String primaryKey;
    private String primarySql;
    @XStreamImplicit(itemFieldName = "childSql")
    private List<String> childSqlList;

    public String getPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(String primaryKey) {
        this.primaryKey = primaryKey;
    }

    public String getPrimarySql() {
        return replaceSchema(primarySql);
    }

    public void setPrimarySql(String primarySql) {
        this.primarySql = primarySql;
    }

    public List<String> getChildSqlList() {
        if (!CollectionUtils.isEmpty(childSqlList)) {
            ArrayList<String> temp = new ArrayList<String>(childSqlList.size());
            for (String childSql : childSqlList) {
                temp.add(replaceSchema(childSql));
            }
            childSqlList = temp;
        }
        return childSqlList;
    }

    public void setChildSqlList(List<String> childSqlList) {
        this.childSqlList = childSqlList;
    }

    @Override
    public String getSql() {
        return isNull(primarySql, childSqlList);
    }
}
