package com.report.unit;

import java.io.IOException;
import java.io.InputStream;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.inqgen.nursing.dynamic.form.bean.DynamicFormItem;
import com.inqgen.nursing.dynamic.form.bean.DynamicFormTemplate;
import com.inqgen.nursing.dynamic.webservice.DynamicFormServiceImpl;
import com.report.unit.db.DataSourceUtils;
import com.report.unit.sett.DataSource;
import com.report.unit.sett.Table;
import com.report.unit.sett.TableSchema;
import com.report.unit.sett.table.Column;
import com.thoughtworks.xstream.XStream;
import org.apache.commons.io.IOUtils;

import javax.servlet.ServletContext;

public class TableSetUtils {

    public static TableSchema ts = null;

    /**
     * JDBC type to javaType
     **/
    static HashMap<Integer, String> typeToJType = new HashMap<Integer, String>();

    public TableSetUtils() {
        if (typeToJType.keySet().size() == 0) {
            typeToJType.put(Types.BIT, "java.lang.Boolean");
            typeToJType.put(Types.TINYINT, "java.lang.Bute");
            typeToJType.put(Types.SMALLINT, "java.lang.Integer");
            typeToJType.put(Types.INTEGER, "java.lang.Integer");
            typeToJType.put(Types.BIGINT, "java.lang.String");
            typeToJType.put(Types.FLOAT, "java.lang.Double");
            typeToJType.put(Types.REAL, "java.lang.Float");
            typeToJType.put(Types.DOUBLE, "java.lang.Double");
            typeToJType.put(Types.NUMERIC, "java.math.BigDecimal");
            typeToJType.put(Types.DECIMAL, "java.math.BigDecimal");
            typeToJType.put(Types.CHAR, "char");
            typeToJType.put(Types.VARCHAR, "java.lang.String");
            typeToJType.put(Types.LONGVARCHAR, "java.lang.String");
            typeToJType.put(Types.DATE, "java.sql.Date");
            typeToJType.put(Types.TIME, "java.sql.Time");
            typeToJType.put(Types.TIMESTAMP, "java.sql.Timestamp");
            typeToJType.put(Types.BINARY, "byte");
            typeToJType.put(Types.VARBINARY, "byte");
            typeToJType.put(Types.LONGVARBINARY, "byte");
            typeToJType.put(Types.NULL, "java.lang.String");
            typeToJType.put(Types.OTHER, "java.lang.Object");
            typeToJType.put(Types.JAVA_OBJECT, "java.lang.Object");
            typeToJType.put(Types.DISTINCT, "java.lang.String");
            typeToJType.put(Types.STRUCT, "java.lang.String");
            typeToJType.put(Types.ARRAY, "java.lang.String");
            typeToJType.put(Types.BLOB, "byte");
            typeToJType.put(Types.CLOB, "java.lang.String");
            typeToJType.put(Types.REF, "java.lang.Object");
            typeToJType.put(Types.DATALINK, "java.lang.Object");
            typeToJType.put(Types.BOOLEAN, "java.lang.Boolean");
            typeToJType.put(Types.ROWID, "java.lang.String");
            typeToJType.put(Types.NCHAR, "char[]");
            typeToJType.put(Types.NVARCHAR, "java.lang.String");
            typeToJType.put(Types.LONGNVARCHAR, "java.lang.String");
            typeToJType.put(Types.NCLOB, "java.lang.String");
            typeToJType.put(Types.SQLXML, "java.lang.String");
        }
    }

    public String toXML(TableSchema tableSchema) {
        com.thoughtworks.xstream.XStream xStream = new com.thoughtworks.xstream.XStream();
        xStream.processAnnotations(new Class[]{
                com.report.unit.sett.TableSchema.class,
                com.report.unit.sett.Table.class,
                com.report.unit.sett.DataSource.class,
                Column.class
        });
        XStream.setupDefaultSecurity(xStream);
        xStream.allowTypes(new Class[]{
                com.report.unit.sett.TableSchema.class,
                com.report.unit.sett.Table.class,
                com.report.unit.sett.DataSource.class,
                Column.class
        });
        return xStream.toXML(tableSchema);
    }

    public TableSchema getTableSchema() {
        if (ts == null) {
            com.thoughtworks.xstream.XStream xStream = new com.thoughtworks.xstream.XStream();
            XStream.setupDefaultSecurity(xStream);
            Class<?>[] classes = {
                    TableSchema.class,
                    Table.class,
                    DataSource.class,
                    Column.class
            };
            xStream.allowTypes(classes);
            xStream.processAnnotations(classes);

            InputStream inputStream = null;
            try {
                ServletContext servletContext = SpringWebApp.getServletContext();
                if (servletContext != null) {
                    inputStream = servletContext.getResourceAsStream("/WEB-INF/classes/table.xml");
                }
            } catch (Exception e) {
				// e.printStackTrace();
            }

            TableSchema tableSchema = null;
            if (inputStream != null) {
                try {
                    tableSchema = (TableSchema) xStream.fromXML(IOUtils.toString(inputStream, "UTF-8"));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            } else {
                try {
                    inputStream = TableSchema.class.getResourceAsStream("table.xml");
                    if (inputStream != null) {
                        tableSchema = (TableSchema) xStream.fromXML(IOUtils.toString(inputStream, "UTF-8"));
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            ts = tableSchema;
        }
        return ts;
    }

    public String getSchema(String tableName) {
        tableName = tableName.split(" ")[0];
        TableSchema tableSchema = getTableSchema();
        List<Table> tables = tableSchema.getTables();
        for (int i = 0; i < tables.size(); i++) {
            Table table = tables.get(i);
            if (table.getName().equals(tableName)) {
                List<DataSource> sources = tableSchema.getDataSources();
                for (int j = 0; j < sources.size(); j++) {
                    if (table.getDbSource().equals(sources.get(j).getName())) {
                        return sources.get(j).getSchema();
                    }
                }
            }
        }
        return null;
    }

    public String getSchemaByTableName(String tableName) {
        TableSchema tableSchema = getTableSchema();
        List<Table> tables = tableSchema.getTables();
        for (int i = 0; i < tables.size(); i++) {
            Table table = tables.get(i);
            if (table.getName().equals(tableName)) {
                List<DataSource> sources = tableSchema.getDataSources();
                for (int j = 0; j < sources.size(); j++) {
                    if (table.getDbSource().equals(sources.get(j).getName())) {
                        return sources.get(j).getSchema();
                    }
                }
            }
        }
        return null;
    }

    public String getDbSource(String sql) throws Exception {
        SqlParse parse = new SqlParse();
        List tablesName = parse.getSelectTables(sql);
        List<Table> tables = getTableSchema().getTables();
        for (int i = 0; i < tables.size(); i++) {
            Table table = tables.get(i);
            for (int k = 0; k < tablesName.size(); k++) {
                String tableName = tablesName.get(k).toString();
                String[] schemaTab = tablesName.get(k).toString().split("\\.");
                if (schemaTab.length > 1) {
                    if (table.getName().equals(schemaTab[1])) {
                        return table.getDbSource();
                    }
                } else {
                    if (table.getName().equals(tablesName.get(k))) {
                        return table.getDbSource();
                    }
                }
            }
        }
        return null;
    }

    /**
     * 載入資料表欄位訊息
     * @throws Exception
     */
    public void loadTableSchema() throws Exception {
        List<Table> tables = getTableSchema().getTables();
        for (int i = 0; i < tables.size(); i++) {
            Table table = tables.get(i);
            if (table.getType().equals("RDB") || table.getType().equals("OLAP") || table.getType().equals("VGH")) {
                try {
                    execTableType(table);
                } catch (Exception e) {
                    // e.printStackTrace();
                }
            }
            if (table.getType().equals("GForm")) {
                try {
                    execGFormType(table);
                } catch (Exception e) {
                    // e.printStackTrace();
                }
            }

        }
    }

    public void execGFormType(Table table) throws Exception {
        //CICVERSI
        List<Column> ls = getColumn(table.getDbSource(), "NDMINDEX");
        ls.addAll(getColumn(table.getDbSource(), "NDMGFORM"));
        DynamicFormServiceImpl dynamicFormService = new DynamicFormServiceImpl();
        int version = dynamicFormService.getDynamicFormMaxVersionNoByformType(table.getName());
        DynamicFormTemplate formTemplate = dynamicFormService.getDynamicFormTemplateByFormModelVersionNo(table.getName(), version);
        DynamicFormItem[] formItem = formTemplate.getItems();
        for (int i = 0; i < formItem.length; i++) {
            DynamicFormItem item = formItem[i];
            Column column = new Column(item.getName(), item.getName(), item.getControlType(), item.getName(), null, 0);

            String[] uiDesc = item.getUiDesc();
            String[] uiScore = item.getUiScore();
            String[] uiValue = item.getUiValue();
            Boolean[] hasOther = item.getHasOther();

            if (uiDesc != null && uiScore != null && uiValue != null && hasOther != null && uiDesc.length == uiScore.length
                            && uiDesc.length == uiScore.length && uiDesc.length == uiValue.length && uiDesc.length == hasOther.length) {
                if (column.getDynamicFormItems() == null) {
                    column.setDynamicFormItems(new ArrayList<com.report.unit.sett.table.DynamicFormItem>());
                }
                for (int j = 0; j < uiDesc.length; j++) {
                    column.getDynamicFormItems().add(new com.report.unit.sett.table.DynamicFormItem(uiScore[j], uiDesc[j], uiValue[j], hasOther[j]));
                }
            }
            ls.add(column);
        }
        table.setColumns(ls);
    }

    public void execTableType(Table table) throws Exception {
        table.setColumns(getColumn(table.getDbSource(), table.getName()));
    }

    /**
     * 得到資料表中有哪些例
     *
     * @return
     * @throws Exception
     */
    public List<Column> getColumn(String dsName, String tableName) throws Exception {
        javax.sql.DataSource ds = DataSourceUtils.getDataSource(dsName);
        Connection conn = null;
        PreparedStatement pre = null;
        ResultSet colRet = null;
        ResultSet extRet = null;
        List<Column> ls = new ArrayList<Column>();
        try {
            conn = ds.getConnection();
            colRet = conn.getMetaData().getColumns(null, getSchemaByTableName(tableName), tableName, null);
            while (colRet.next()) {
                String TABLE_CAT = colRet.getString("TABLE_CAT");
                String TABLE_SCHEM = colRet.getString("TABLE_SCHEM");
                String TABLE_NAME = colRet.getString("TABLE_NAME");
                String COLUMN_NAME = colRet.getString("COLUMN_NAME");
                String DATA_TYPE = colRet.getString("DATA_TYPE");
                String TYPE_NAME = colRet.getString("TYPE_NAME");
                int COLUMN_SIZE = colRet.getInt("COLUMN_SIZE");
                String BUFFER_LENGTH = colRet.getString("BUFFER_LENGTH");
                String DECIMAL_DIGITS = colRet.getString("DECIMAL_DIGITS");
                String NUM_PREC_RADIX = colRet.getString("NUM_PREC_RADIX");
                String NULLABLE = colRet.getString("NULLABLE");
                String REMARKS = colRet.getString("REMARKS");
                String COLUMN_DEF = colRet.getString("COLUMN_DEF");
                String SQL_DATA_TYPE = colRet.getString("SQL_DATA_TYPE");
                String SQL_DATETIME_SUB = colRet.getString("SQL_DATETIME_SUB");
                String CHAR_OCTET_LENGTH = colRet.getString("CHAR_OCTET_LENGTH");
                String ORDINAL_POSITION = colRet.getString("ORDINAL_POSITION");
                String IS_NULLABLE = colRet.getString("IS_NULLABLE");
                Column column = new Column(COLUMN_NAME, REMARKS == null ? COLUMN_NAME : REMARKS, typeToJType.get(Integer.valueOf(DATA_TYPE)) == null ? DATA_TYPE : typeToJType.get(Integer.valueOf(DATA_TYPE)), COLUMN_NAME, TYPE_NAME, COLUMN_SIZE);
                ls.add(column);
            }
			/*
            pre = conn.prepareStatement("select * from " + tableSetUtils.getSchemaByTableName(table.getName()) + "." + table.getName());
            ResultSetMetaData data = pre.getMetaData();
            for (int i = 1; i <= data.getColumnCount(); i++) {
                //獲得所有列的數目及實際列數
                int columnCount = data.getColumnCount();
                //獲得指定列的列名
                String columnName = data.getColumnName(i);
                //獲得指定列的資料類型
                int columnType = data.getColumnType(i);
                //獲得指定列的資料類型名
                String columnTypeName = data.getColumnTypeName(i);
                //所在的Catalog名字
                String catalogName = data.getCatalogName(i);

                //對應資料類型的類
                String columnClassName = data.getColumnClassName(i);
                //在資料庫中類型的最大字元個數
                int columnDisplaySize = data.getColumnDisplaySize(i);
                //預設的列的標題
                String columnLabel = data.getColumnLabel(i);
                //獲得列的模式 ```
                String schemaName = data.getSchemaName(i);
                //某列類型的精確度(類型的長度)
                int precision = data.getPrecision(i);
                //小數點後的位數
                int scale = data.getScale(i);
                //取得某列對應的表名
                String tableName = data.getTableName(i);
                // 是否自動遞增
                boolean isAutoInctement = data.isAutoIncrement(i);
                //在資料庫中是否為貨幣型
                boolean isCurrency = data.isCurrency(i);
                //是否為空
                int isNullable = data.isNullable(i);
                //是否為只讀
                boolean isReadOnly = data.isReadOnly(i);
                //能否出現在where中
                boolean isSearchable = data.isSearchable(i);

                Column column = new Column(columnName, columnName, columnClassName, columnName, columnTypeName, columnDisplaySize);
                ls.add(column);
            }
            */
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (extRet != null) extRet.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                if (colRet != null) colRet.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                if (pre != null) pre.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                if (conn != null) conn.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return ls;
    }

}
