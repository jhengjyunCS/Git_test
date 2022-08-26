package com.inqgen.nursing.database.webservice.bean;

import com.alibaba.fastjson.annotation.JSONField;
import com.inqgen.nursing.jdbc.support.JdbcUtils;
import com.inqgen.nursing.utils.StringUtils;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.*;
import java.util.concurrent.TimeUnit;

public class Table {
    @JSONField(alternateNames = {"table"})
    private String name;
    private List<String> columns;
    private List<String> join;
    private String where;
    private String order;
    private Schema schema;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameWithSchema() {
        return schema.getName()+"."+name;
    }

    public List<String> getColumns() {
        return columns;
    }

    public void autoSetLabelColumnMap(){
        if (schema.getLabelColumnMap() == null) {
            schema.setLabelColumnMap(new HashMap<String,String>());
        }
    }
    void addLabelColumn(String label, String column) {
        autoSetLabelColumnMap();
        schema.getLabelColumnMap().put(label, column);
    }
    public String getSelectColumns() throws Exception {
        List<String> columns = autoColumns(true);

        StringBuilder columnSql = new StringBuilder();
        for (int l = 0, m = 0; l < columns.size(); l++) {
            String column = columns.get(l);
            if (StringUtils.isNotBlank(column)) {
                if (m++ > 0) {
                    columnSql.append(",");
                }
                String separator = " ";
                int labelInd = column.lastIndexOf(separator);
                if (labelInd>-1) {
                    String label = column.substring(labelInd + separator.length());
                    String dbColumn = column.substring(0, labelInd);
                    if (!column.startsWith(name + ".")) {
                        dbColumn = name + "." + dbColumn;
                    }
                    String dbLabel = StringUtils.generateLabelId(name+"."+label);
                    addLabelColumn(dbLabel, name+"."+label);
                    columnSql.append(dbColumn).append(" ").append(dbLabel);
                }else {
                    String dbColumn=column;
                    if (!column.startsWith(name + ".")) {
                        dbColumn = name + "." + column;
                    }
                    String dbLabel = StringUtils.generateLabelId(dbColumn);
                    addLabelColumn(dbLabel, dbColumn);
                    columnSql.append(dbColumn).append(" ").append(dbLabel);
                }
            }
        }

        return columnSql.toString();
    }

    public List<String> autoColumns(boolean... autoSet) throws Exception {
        if (getColumns() != null) {
            return getColumns();
        }
        List<String> columns = getColumnsFromDb();
        if (columns==null||columns.size() == 0) {
            int retry = 0;
            do {
                try {
                    TimeUnit.MILLISECONDS.sleep(10);
                    retry++;
                } catch (InterruptedException ignored) {}
                columns = getColumnsFromDb();
            } while (retry<10&&(columns==null||columns.size() == 0));

        }
        if (columns==null||columns.size() == 0){
            throw new Exception(getNameWithSchema()+": can't get columns from db!");
        }
        if (autoSet != null && autoSet[0]) {
            setColumns(columns);
        }
        return columns;
    }

    private List<String> getColumnsFromDb(){
        Connection conn = null;
        ResultSet rs = null;
        try {
            DataSource dataSource = getSchema().getDataSource();
            conn = dataSource.getConnection();
            DatabaseMetaData dbMetaData = conn.getMetaData();
            rs = dbMetaData.getColumns(null, schema.getName().toUpperCase(), getName(), "%");
            List<String> columns = new ArrayList<String>();
            while (rs.next()) {
                String columnName = rs.getString("COLUMN_NAME");
                columns.add(columnName);
            }
            return columns;
        }catch (Exception ignored){}
        finally {
            JdbcUtils.closeResultSet(rs);
            JdbcUtils.closeConnection(conn);
        }
        return null;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns;
    }

    public List<String> getJoin() {
        return join;
    }

    public void setJoin(List<String> join) {
        this.join = join;
    }

    public String getWhere() {
        return where;
    }

    public void setWhere(String where) {
        this.where = where;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public Schema getSchema() {
        return schema;
    }

    public void setSchema(Schema schema) {
        schema.addTable(this);
        this.schema = schema;
    }

    public void addJoined(String[] keyTabCol, String[] valTabCol) {
        getSchema().addJoined(keyTabCol, valTabCol);
        autoAddColumn(keyTabCol);
    }

    private void autoAddColumn(String[] tabCol) {
        String tableColumn = StringUtils.join(tabCol,".");
        if (getColumns() == null) {
            setColumns(new ArrayList<String>());
        }else{
            for (String column : columns) {
                if (column != null&&(column.endsWith("."+tabCol[1])||column.endsWith(" "+tabCol[1]))) {
                    return;
                }
            }
        }
        columns.add(tableColumn);
    }
}
