package com.inqgen.nursing.jdbc.core;

import com.inqgen.nursing.dynamic.form.bean.db.Result;
import com.inqgen.nursing.dynamic.form.bean.db.ResultMap;
import com.inqgen.nursing.jdbc.support.JdbcUtils;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author RainKing
 * @date 2019/10/10 17:35
 */
public class ColumnMapRowMapper extends org.springframework.jdbc.core.ColumnMapRowMapper {

    private ResultMap resultMap;
    @Override
    public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
        ResultSetMetaData rsmd = rs.getMetaData();
        int columnCount = rsmd.getColumnCount();
        Map<String, Object> mapOfColValues = createColumnMap(columnCount);
        Map<String, Integer> reColMap = new HashMap<String, Integer>();
        for (int i = 1; i <= columnCount; i++) {
            String key = getColumnKey(JdbcUtils.lookupColumnName(rsmd,i));
            Object obj = getColumnValue(rs, i);
            if (resultMap!=null) {
                Result result = resultMap.getResultMap().get(key);
                if (result != null) {
                    key = result.getProperty();
                }
            }
            if (mapOfColValues.containsKey(key)) {
                Object prevObj = mapOfColValues.get(key);
                if (prevObj==null){
                    if (obj == null) {
                        continue;
                    }
                }else if(prevObj.equals(obj)) {
                    continue;
                }
                Integer c = reColMap.get(key);
                if (c == null) {
                    c=1;
                }
                key = key+"("+c+")";
                reColMap.put(key, ++c);
            }
            mapOfColValues.put(key , obj);
        }
        return mapOfColValues;
    }

    public ColumnMapRowMapper() {
    }

    public ColumnMapRowMapper(ResultMap resultMap) {
        setResultMap(resultMap);
    }

    public void setResultMap(ResultMap resultMap) {
        this.resultMap = resultMap;
    }
}
