package com.inqgen.nursing.jdbc.support;

import org.apache.commons.lang.StringUtils;

import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public class JdbcUtils extends org.springframework.jdbc.support.JdbcUtils {
    private JdbcUtils() {
    }

    public static String lookupColumnName(ResultSetMetaData resultSetMetaData, int columnIndex) throws SQLException {
        String name = resultSetMetaData.getColumnLabel(columnIndex);
        if (name == null || name.length() < 1) {
            name = resultSetMetaData.getColumnName(columnIndex);
        }
        return name;
    }
    public static String lookupTableName(ResultSetMetaData resultSetMetaData, int... columnIndex) throws SQLException {
        String tableName = resultSetMetaData.getTableName(columnIndex[0]);
        if (StringUtils.isNotBlank(tableName)||columnIndex.length<2) {
            return tableName;
        }else{
            return String.valueOf(columnIndex[1]);
        }
    }
}
