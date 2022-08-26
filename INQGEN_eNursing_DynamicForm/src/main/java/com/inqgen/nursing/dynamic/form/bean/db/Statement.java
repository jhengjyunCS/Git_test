package com.inqgen.nursing.dynamic.form.bean.db;

import com.inqgen.nursing.xstream.annotations.XStreamAliasAlternate;
import com.inqgen.nursing.xstream.annotations.XStreamAsValue;
import com.inqgen.nursing.xstream.converters.ReflectionProConverter;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamConverter;
import com.thoughtworks.xstream.annotations.XStreamOmitField;
import org.apache.commons.lang.StringUtils;

import java.util.UUID;
@XStreamConverter(ReflectionProConverter.class)
public class Statement {
    @XStreamAsAttribute
    private String name;
    @XStreamAsAttribute
    private String jndiName;
    @XStreamAsAttribute
    private String persistenceUnitName;
    @XStreamAsAttribute
    private String actions;
    @XStreamAsValue
    private String sql;
    @XStreamAsAttribute
    @XStreamAliasAlternate({"parameterMap"})
    private String parameterMaps;
    @XStreamAsAttribute
    private String autoUuIds;
    @XStreamOmitField
    private String schema;

    public String getName() {
        return StringUtils.isBlank(name) ? UUID.randomUUID().toString() : name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public String getActions() {
        return actions;
    }

    public void setActions(String actions) {
        this.actions = actions;
    }

    public String getSql() {
        return replaceSchema(sql);
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public String getParameterMaps() {
        return parameterMaps;
    }

    public void setParameterMaps(String parameterMaps) {
        this.parameterMaps = parameterMaps;
    }

    public String getAutoUuIds() {
        return autoUuIds;
    }

    public void setAutoUuIds(String autoUuIds) {
        this.autoUuIds = autoUuIds;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public boolean hasAction(String action) {
        if (action != null && actions != null) {
            String[] actionArray = actions.split(",");
            for (String actionTemp : actionArray) {
                if (actionTemp.equals(action)) {
                    return true;
                }
            }
        }
        return false;
    }

    public String isNull(Object... objects) {
        if (objects != null) {
            for (Object object : objects) {
                if (object == null) {
                    return null;
                }
            }
            return objects[0].toString();
        }
        return null;
    }


    protected String replaceSchema(String sql){
        return sql==null?null: sql.contains("${schema}")&&StringUtils.isNotBlank(schema)? sql.replace("${schema}",schema+"."): sql;
    }
}
