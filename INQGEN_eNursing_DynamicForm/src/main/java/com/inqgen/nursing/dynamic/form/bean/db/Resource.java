package com.inqgen.nursing.dynamic.form.bean.db;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@XStreamAlias("Resource")
public class Resource {

    @XStreamAsAttribute
    private String jndiName;
    @XStreamAsAttribute
    private String persistenceUnitName;
    @XStreamAsAttribute
    private String schema;
    @XStreamImplicit(itemFieldName = "insert")
    private List<Insert> insertList;
    @XStreamImplicit(itemFieldName = "insertOneMany")
    private List<InsertOneMany> insertOneManyList;
    @XStreamImplicit(itemFieldName = "insertOrUpdate")
    private List<InsertOrUpdate> insertOrUpdateList;
    @XStreamImplicit(itemFieldName = "select")
    private List<Select> selectList;
    @XStreamImplicit(itemFieldName = "update")
    private List<Update> updateList;
    @XStreamImplicit(itemFieldName = "delete")
    private List<Delete> deleteList;

    public String getJndiName() {
        return jndiName;
    }

    public void setJndiName(String jndiName) {
        this.jndiName = jndiName;
    }

    public String getPersistenceUnitName() {
        return persistenceUnitName;
    }

    public void setPersistenceUnitName(String persistenceUnitName) {
        this.persistenceUnitName = persistenceUnitName;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public <T extends Statement>List<T> setSchema(List<T> statementList) {
        if (!CollectionUtils.isEmpty(statementList)) {
            for (Statement statement : statementList) {
                statement.setSchema(getSchema());
            }
        }
        return statementList;
    }
    public List<Insert> getInsertList() {
        return setSchema(insertList);
    }

    public void setInsertList(List<Insert> insertList) {
        this.insertList = insertList;
    }

    public List<InsertOneMany> getInsertOneManyList() {
        return setSchema(insertOneManyList);
    }

    public void setInsertOneManyList(List<InsertOneMany> insertOneManyList) {
        this.insertOneManyList = insertOneManyList;
    }

    public List<InsertOrUpdate> getInsertOrUpdateList() {
        return setSchema(insertOrUpdateList);
    }

    public void setInsertOrUpdateList(List<InsertOrUpdate> insertOrUpdateList) {
        this.insertOrUpdateList = insertOrUpdateList;
    }

    public List<Select> getSelectList() {
        return setSchema(selectList);
    }

    public void setSelectList(List<Select> selectList) {
        this.selectList = selectList;
    }

    public List<Update> getUpdateList() {
        return setSchema(updateList);
    }

    public void setUpdateList(List<Update> updateList) {
        this.updateList = updateList;
    }

    public List<Delete> getDeleteList() {
        return setSchema(deleteList);
    }

    public void setDeleteList(List<Delete> deleteList) {
        this.deleteList = deleteList;
    }

    public void addStatement(Statement... statements) {
        if (statements != null) {
            for (Statement statement : statements) {
                if (statement instanceof Insert) {
                    if (insertList == null) {
                        insertList = new ArrayList<Insert>();
                    }
                    insertList.add((Insert)statement);
                }
                else if (statement instanceof InsertOneMany) {
                    if (insertOneManyList == null) {
                        insertOneManyList = new ArrayList<InsertOneMany>();
                    }
                    insertOneManyList.add((InsertOneMany)statement);
                }
                else if (statement instanceof InsertOrUpdate) {
                    if (insertOrUpdateList == null) {
                        insertOrUpdateList = new ArrayList<InsertOrUpdate>();
                    }
                    insertOrUpdateList.add((InsertOrUpdate)statement);
                }
                else if (statement instanceof Delete) {
                    if (deleteList == null) {
                        deleteList = new ArrayList<Delete>();
                    }
                    deleteList.add((Delete)statement);
                }
                else if (statement instanceof Update) {
                    if (updateList == null) {
                        updateList = new ArrayList<Update>();
                    }
                    updateList.add((Update)statement);
                }
                else if (statement instanceof Select) {
                    if (selectList == null) {
                        selectList = new ArrayList<Select>();
                    }
                    selectList.add((Select)statement);
                }
            }
        }
    }
}
