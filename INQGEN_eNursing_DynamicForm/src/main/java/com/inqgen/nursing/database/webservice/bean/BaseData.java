package com.inqgen.nursing.database.webservice.bean;

import com.inqgen.nursing.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import com.inqgen.nursing.utils.StringUtils;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.jndi.JndiTemplate;

import javax.naming.NamingException;
import javax.sql.DataSource;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;

public class BaseData extends LinkedHashMap<String, List<Schema>> {
    public final static Type TYPE=new ParameterizedType() {
        public Type[] getActualTypeArguments() {
            ParameterizedType superclass = (ParameterizedType) BaseData.class.getGenericSuperclass();
            return superclass.getActualTypeArguments();
        }

        public Type getRawType() {
            return BaseData.class;
        }

        public Type getOwnerType() {
            return BaseData.class;
        }
    };

    private transient Map<String, Table> tableMap;
    private transient Map<String, DataSource> dataSourceMap;
    private transient Map<String, NamedParameterJdbcTemplate> jdbcTemplateMap;
    private transient JndiTemplate jndiTemplate;

    public BaseData() {
        setTableMap(new HashMap<String, Table>());
        setDataSourceMap(new HashMap<String, DataSource>());
        setJdbcTemplateMap(new HashMap<String, NamedParameterJdbcTemplate>(2));
        setJndiTemplate(new JndiTemplate());
    }

    protected Map<String, Table> getTableMap() {
        return tableMap;
    }

    protected void setTableMap(Map<String, Table> tableMap) {
        this.tableMap = tableMap;
    }

    protected Map<String, NamedParameterJdbcTemplate> getJdbcTemplateMap() {
        return jdbcTemplateMap;
    }

    protected void setJdbcTemplateMap(Map<String, NamedParameterJdbcTemplate> jdbcTemplateMap) {
        this.jdbcTemplateMap = jdbcTemplateMap;
    }

    public void setJndiTemplate(JndiTemplate jndiTemplate) {
        this.jndiTemplate = jndiTemplate;
    }

    protected Map<String, DataSource> getDataSourceMap() {
        return dataSourceMap;
    }

    protected void setDataSourceMap(Map<String, DataSource> dataSourceMap) {
        this.dataSourceMap = dataSourceMap;
    }

    protected void addTable(Table table){
        tableMap.put(table.getName(), table);
    }

    protected void addJndiDataSource(String jndiName,DataSource dataSource) {
        getDataSourceMap().put(jndiName, dataSource);
    }

    protected NamedParameterJdbcTemplate getNamedParameterJdbcTemplate(String jndiName) throws Exception {
        NamedParameterJdbcTemplate jdbcTemplate=getJdbcTemplateMap().get(jndiName);
        if (jdbcTemplate==null) {
            jdbcTemplate = new NamedParameterJdbcTemplate(getDataSource(jndiName));
            getJdbcTemplateMap().put(jndiName, jdbcTemplate);
        }
        return jdbcTemplate;
    }

    protected DataSource getDataSource(String jndiName) throws NamingException {
        if (dataSourceMap.containsKey(jndiName)) {
            return dataSourceMap.get(jndiName);
        }
        DataSource dataSource = (DataSource)jndiTemplate.lookup(StringUtils.preventLdapInject(jndiName));
        addJndiDataSource(jndiName,dataSource);
        return dataSource;
    }

    protected Set<Object> getRealValue(String onKey, String onVal) {
        if (onVal != null) {
            String[] valTabCol = onVal.split("\\.");
            Table valTab = getTableMap().get(valTabCol[0]);
            if (valTab != null) {
                String[] keyTabCol = onKey.split("\\.");
                Table keyTab = getTableMap().get(keyTabCol[0]);
                keyTab.addJoined(keyTabCol, valTabCol);
                Set<Object> colDataList = valTab.getSchema().getColDataList(onVal);
                if (CollectionUtils.isNotEmpty(colDataList)) {
                    return colDataList;
                }
            }
        }
        return Collections.singleton(null);
    }
}
