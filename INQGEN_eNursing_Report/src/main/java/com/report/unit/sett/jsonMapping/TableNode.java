package com.report.unit.sett.jsonMapping;

import org.apache.commons.lang.StringUtils;

import java.util.List;

/**
 * @Author wang
 * @Date 2021/11/15 13:40
 */
public class TableNode {

    public String text;

    public String value;

    /**
     * 1:      多對一
     * 2:      一對多
     * 3:      一對一
     * table:  資料表
     * schema: 資料庫 schema
     * column: 資料表欄位
     * form:   GFROM 表單
     */
    public String type;

    public String description;

    public String column1;

    public String column2;

    public List<TableNode> nodes;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColumn1() {
        return column1;
    }

    public void setColumn1(String column1) {
        this.column1 = column1;
    }

    public String getColumn2() {
        return column2;
    }

    public void setColumn2(String column2) {
        this.column2 = column2;
    }

    public List<TableNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<TableNode> nodes) {
        this.nodes = nodes;
    }

    public String getTable1(){
        String table1 = "";
        if(column1!=null){
            table1 = column1.split("\\.")[0];
        }
        return table1;
    }

    public String getTable2(){
        String table2 = "";
        if(column2!=null){
            table2 = column2.split("\\.")[0];
        }
        return table2;
    }

    public String getThisColumns(){
        String column = "";
        if("table".equals(this.type) && this.nodes!=null && this.nodes.size()>0){
            for(TableNode tableNode : this.nodes){
                if("column".equals(tableNode.getType()) && StringUtils.isNotBlank(this.value)){
                    if(StringUtils.isNotBlank(column)){column += ",";}
                    column += (this.value + "." + tableNode.getValue());
                }
            }
        }
        return column;
    }

}
