package com.inqgen.nursing.database.webservice.bean;

import com.alibaba.fastjson.annotation.JSONField;
import com.inqgen.nursing.base.SpringWebApp;
import com.inqgen.nursing.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;

import javax.naming.NamingException;
import javax.sql.DataSource;
import java.util.*;

public class Schema {
    @JSONField(alternateNames = {"schema"})
    private String name;
    private List<Table> tables;
    private Map<String,Table> tableMap;
    private List<Map<String, Object>> dataList;
    private Map<String, Set<Object>> colDataListMap;
    private Map<String[], String[]> joined;
    private String jndiName;
    private DataSource dataSource;
    private BaseData baseData;

    private Map<String,String> labelColumnMap;

    public Map<String, String> getLabelColumnMap() {
        return labelColumnMap;
    }

    public void setLabelColumnMap(Map<String, String> labelColumnMap) {
        this.labelColumnMap = labelColumnMap;
    }

    public Schema() {
        setTableMap(new LinkedHashMap<String, Table>());
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Table> getTables() {
        return tables;
    }

    public void setTables(List<Table> tables) {
        this.tables = tables;
    }

    public Map<String,Table> getTableMap() {
        return tableMap;
    }

    public void setTableMap(Map<String,Table> tableMap) {
        this.tableMap = tableMap;
    }

    public void addTable(Table table) {
        tableMap.put(table.getName(),table);
        baseData.addTable(table);
    }

    public boolean containsTable(String tableName) {
        return tableMap.containsKey(tableName);
    }

    public List<Map<String, Object>> getDataList() {
        return dataList;
    }

    public Schema setDataList(List<Map<String, Object>> dataList) {
        this.dataList = convertDataList(dataList);
        return this;
    }

    /**
    * convert data list to real data list
    * @param dataList :
    * @return java.util.List<java.util.Map<java.lang.String,java.lang.Object>>
    * @author Rain King
    * @since 2022/5/31 18:32
    */
    List<Map<String, Object>> convertDataList(List<Map<String, Object>> dataList){
        if (CollectionUtils.isNotEmpty(dataList)&&MapUtils.isNotEmpty(labelColumnMap)) {
            for (int i = 0; i < dataList.size(); i++) {
                Map<String, Object> data = dataList.get(i);
                Map<String, Object> lineMap = new LinkedHashMap<String, Object>();
                dataList.set(i, lineMap);
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    lineMap.put(MapUtils.getString(labelColumnMap,entry.getKey(),entry.getKey()),entry.getValue());
                }
            }
        }
        return dataList;
    }

    public void addJoined(String[] key, String[] value) {
        if (joined == null) {
            joined = new LinkedHashMap<String[], String[]>();
        }
        joined.put(key, value);
    }

    public void joinedDataList(List<Map<String, Object>> mapList) {
        if (dataList == null) {
            return;
        }
        if (mapList.isEmpty()) {
            mapList.addAll(dataList);
        } else if(MapUtils.isNotEmpty(joined)){
            /*join*/
            for (int i = 0; i < mapList.size(); i++) {
                Map<String, Object> map = mapList.get(i);
                int c = 0;
                for (Map<String, Object> data : dataList) {
                    /*檢核join條件*/
                    if (enJoin(map, data)) {
                        if (c++ == 0) {
                            map.putAll(data);
                        } else {
                            Map<String, Object> tmp = new LinkedHashMap<String, Object>(map);
                            tmp.putAll(data);
                            mapList.add(tmp);
                            i++;
                        }
                    }
                }
                if (c==0) {
                    mapList.remove(i--);
                }
            }
        }
    }

    private boolean enJoin(Map<String, Object> map, Map<String, Object> data) {
        if (MapUtils.isEmpty(map)|| MapUtils.isEmpty(data)) {
            return false;
        }
        for (Map.Entry<String[], String[]> entry : joined.entrySet()) {
            Object mapV = map.get(StringUtils.join(entry.getValue(),"."));
            if (mapV==null) {
                mapV = map.get(entry.getValue()[1]);
            }
            Object dataV = data.get(StringUtils.join(entry.getKey(),"."));
            if (dataV == null) {
                dataV = data.get(entry.getKey()[1]);
            }
            if (mapV==dataV) {
                continue;
            }
            if (mapV==null||null==dataV) {
                return false;
            }
            if (mapV.equals(dataV)) {
                continue;
            }
            if ((mapV instanceof Number||NumberUtils.isNumber(mapV.toString()))
            &&(dataV instanceof Number||NumberUtils.isNumber(dataV.toString()))) {
                double m = NumberUtils.toDouble(mapV.toString());
                double d = NumberUtils.toDouble(dataV.toString());
                if (m==d) {
                    continue;
                }
            }
            return false;
        }
        return true;
    }

    public Map<String, Set<Object>> getColDataListMap() {
        return colDataListMap;
    }

    public void setColDataListMap(Map<String, Set<Object>> colDataListMap) {
        this.colDataListMap = colDataListMap;
    }

    public Set<Object> getColDataList(String col) {
        if (dataList != null) {
            if (colDataListMap == null) {
                setColDataListMap(new HashMap<String, Set<Object>>());
            }
            Set<Object> colDataList = colDataListMap.get(col);
            if (colDataList != null) {
                return colDataList;
            }
            colDataList = new LinkedHashSet<Object>();
            for (Map<String, Object> colMap : dataList) {
                Object value = colMap.get(col);
                colDataList.add(value);
            }
            colDataListMap.put(col, colDataList);
            return colDataList;
        }
        return null;
    }

    public BaseData getBaseData() {
        return baseData;
    }

    public void setBaseData(BaseData baseData) {
        this.baseData = baseData;
    }

    public NamedParameterJdbcTemplate getNamedParameterJdbcTemplate() throws Exception {
        return baseData.getNamedParameterJdbcTemplate(getJndiName());
    }

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public DataSource getDataSource() throws NamingException {
        if (dataSource == null) {
            setDataSource(baseData.getDataSource(getJndiName()));
        }
        return dataSource;
    }

    public void setJndiName(String jndiName) {
        this.jndiName = jndiName;
    }

    public String getJndiName() {
        if (StringUtils.isNotBlank(jndiName)) {
            return jndiName;
        }
        Map<String,String> schemaJndiMap = SpringWebApp.getObjectFromName("schemaJndiMap");
        setJndiName(schemaJndiMap.get(name));
        if (StringUtils.isBlank(jndiName)) {
            setJndiName((String) SpringWebApp.getObjectFromName("gformJndiName"));
        }
        return jndiName;
    }

    public Set<Object> getRealValue(String onKey, String onVal){
        return baseData.getRealValue(onKey, onVal);
    }
}
