package com.report.unit.sett.jsonMapping;

import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * @Author wang
 * @Date 2021/11/15 14:38
 */
public class TableRelationDto {

    // 表名
    public List<String> tableNames;

    // schema
    public String schema;

    // 表
    public List<TableNode> tables;

    // 表關系
    public List<TableNode> tableRelationList;

    public TableRelationDto() {}

    public TableRelationDto(TableNode tableRelation, String schema) {
        setTableRelationList(tableRelation);
        this.schema = schema;
    }

    public List<String> getTableNames() {
        return tableNames;
    }

    public void setTableNames(List<String> tableNames) {
        this.tableNames = tableNames;
    }

    public List<TableNode> getTables() {
        return tables;
    }

    public void setTables(List<TableNode> tables) {
        this.tables = tables;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public List<TableNode> getTableRelationList() {
        return tableRelationList;
    }

    public void setTableRelationList(List<TableNode> tableRelationList) {
        this.tableRelationList = tableRelationList;
    }

    public void setTableRelationList(TableNode tableRelation) {
        List<TableNode> tableRelationList = new ArrayList<TableNode>();
        tableRelationList.add(tableRelation);
        this.tableRelationList = tableRelationList;
    }

    public void setTableNames() {
        tableNames = new ArrayList<String>();
        if (tableRelationList != null && tableRelationList.size() > 0) {
            for (TableNode tableNode : tableRelationList) {
                String table1 = tableNode.getTable1();
                String table2 = tableNode.getTable2();
                if (!tableNames.contains(table1)) {
                    tableNames.add(table1);
                }
                if (!tableNames.contains(table2)) {
                    tableNames.add(table2);
                }
            }
        }
        if(tableNames.size()>1){
            // 按照 多對一 關系排序
            Collections.sort(tableNames,new Comparator<String>() {
                @Override
                public int compare(String o1, String o2) {
                    int s = 0;
                    for (TableNode tableNode : tableRelationList) {
                        String table1 = tableNode.getTable1();
                        String table2 = tableNode.getTable2();
                        if((table1.equals(o1) || table1.equals(o2)) && (table2.equals(o1) || table2.equals(o2))){
                            if("1".equals(tableNode.getType())){       // 多對一
                                s = -1;
                            }else if("2".equals(tableNode.getType())){ // 一對一
                                s = 0;
                            }else if("3".equals(tableNode.getType())){ // 一對多
                                s = 1;
                            }
                            break;
                        }
                    }
                    return s;
                }
            });
        }
    }

    public void setTablesByTableName(List<TableNode> allTables) {
        this.tables = new ArrayList<TableNode>();
        if (allTables != null && allTables.size() > 0) {
            for (TableNode tableNode : allTables) {
                if (tableNode != null && "table".equals(tableNode.getType())) {
                    if (this.tableNames.contains(tableNode.getValue())) {
                        this.tables.add(tableNode);
                    }
                }
            }
        }
    }

    public String getSql() {
        String column = "";
        String tableName = null;

        for(int s=0;s<this.tableNames.size();s++){
            TableNode tableNode = null;
            for (int z = 0; z < this.tables.size(); z++) {
                if(tableNames.get(s).equals(this.tables.get(z).getValue())){
                    tableNode = this.tables.get(z);break;
                }
            }
            if(tableNode!=null){
                if(tableName == null){
                    tableName = tableNode.getValue();
                }
                String thisColumns = tableNode.getThisColumns();
                if (StringUtils.isNotBlank(column)) {
                    column += ",";
                }
                column += thisColumns;
            }
        }

        String leftJoinStr = "";
        if (this.tableRelationList != null && this.tableRelationList.size() > 0) {
            columns_y.add(tableName);
            leftJoinStr = getLeftJoinTable();
        }
        return "select " + column + " from ${" + this.schema + "}." + tableName + " " + leftJoinStr;
    }

    public List<String> columns_y = new ArrayList<String>();

    public String getLeftJoinTable() {
        String leftJoinStr = "";
        if (this.tableNames != null && this.tableNames.size() > 0) {
            for (String tableName : this.tableNames) {
                if (!columns_y.contains(tableName)) {
                    List<TableNode> tableNodeList = getTableNode(tableName);
                    if (tableNodeList != null && tableNodeList.size() > 0) {
                        leftJoinStr += " LEFT JOIN ${" + this.schema + "}." + tableName + " on ";
                        for (int s = 0; s < tableNodeList.size(); s++) {
                            if (s != 0) {
                                leftJoinStr += " and ";
                            }
                            leftJoinStr += tableNodeList.get(s).getColumn1() + " = " + tableNodeList.get(s).getColumn2() + " ";
                        }
                        columns_y.add(tableName);
                    }
                }
            }
        }
        if (columns_y.size() != this.tableNames.size()) {
            leftJoinStr += getLeftJoinTable();
        }
        return leftJoinStr;
    }

    public List<TableNode> getTableNode(String tableName) {
        List<TableNode> tableNodeList = new ArrayList<TableNode>();
        for (TableNode tableNode1 : this.tableRelationList) {
            String table1 = tableNode1.getTable1();
            String table2 = tableNode1.getTable2();
            if (table1.equals(tableName)) {
                if (columns_y.contains(table2)) {
                    tableNodeList.add(tableNode1);
                }
            } else if (table2.equals(tableName)) {
                if (columns_y.contains(table1)) {
                    tableNodeList.add(tableNode1);
                }
            }
        }
        return tableNodeList;
    }

}
