package com.report.unit.sett.jsonMapping;

import java.util.List;

/**
 * @Author wang
 * @Date 2021/11/15 13:35
 */
public class TableDetail {

    public Title title;

    public List<ColumnDetail> form;

    public List<ColumnDetail> database;

    public List<TableNode> tableRelationship;

    public Title getTitle() {
        return title;
    }

    public void setTitle(Title title) {
        this.title = title;
    }

    public List<ColumnDetail> getForm() {
        return form;
    }

    public void setForm(List<ColumnDetail> form) {
        this.form = form;
    }

    public List<ColumnDetail> getDatabase() {
        return database;
    }

    public void setDatabase(List<ColumnDetail> database) {
        this.database = database;
    }

    public List<TableNode> getTableRelationship() {
        return tableRelationship;
    }

    public void setTableRelationship(List<TableNode> tableRelationship) {
        this.tableRelationship = tableRelationship;
    }
}
