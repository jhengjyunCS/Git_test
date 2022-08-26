package com.inqgen.nursing.database.webservice;

import com.alibaba.fastjson.JSON;
import com.inqgen.nursing.base.SpringWebApp;
import com.inqgen.nursing.database.webservice.bean.BaseData;
import com.inqgen.nursing.database.webservice.bean.Node;
import com.inqgen.nursing.database.webservice.bean.Schema;
import com.inqgen.nursing.database.webservice.bean.Table;
import com.inqgen.nursing.dynamic.form.bean.*;
import com.inqgen.nursing.dynamic.form.dao.impl.FormVersionDaoImpl;
import com.inqgen.nursing.dynamic.form.dao.impl.GFormDaoImpl;
import com.inqgen.nursing.jdbc.support.JdbcUtils;
import com.inqgen.nursing.utils.FormUtils;
import com.inqgen.nursing.utils.PrintUtils;
import com.inqgen.nursing.utils.StringUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.jndi.JndiTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DataBaseServiceImpl implements DataBaseService {

    public String getAllDataBase(String params) throws Exception {
        try {
            List<Node> database = new ArrayList<Node>();
            Map<String, String> schemaJndiMap = SpringWebApp.getObjectFromName("schemaJndiMap");
            JndiTemplate jndiTemplate = new JndiTemplate();
            for (Map.Entry<String, String> entry : schemaJndiMap.entrySet()) {
                String schemaName = entry.getKey();
                String jndiName = entry.getValue();
                DataSource dataSource = (DataSource) jndiTemplate.lookup(StringUtils.preventLdapInject(jndiName));
                Node schema = new Node();
                schema.setValue(schemaName);
                schema.setText(schema.getValue());
                schema.setType("schema");
                List<Node> tables = getTables(schemaName, dataSource);
                schema.setNodes(tables);
                database.add(schema);
            }
            List<Node> forms = getForms();
            Map<String, Object> jsonObject = new HashMap<String, Object>();
            jsonObject.put("database", database);
            jsonObject.put("form", forms);
            return JSON.toJSONString(jsonObject);
        } catch (Exception e) {
            PrintUtils.printByDVm(e);
            return ExceptionUtils.getFullStackTrace(e);
        }
    }

    public List<Node> getTables(String schema, DataSource dataSource) throws Exception {
        List<Node> tables = new ArrayList<Node>();
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            DatabaseMetaData dbMetaData = conn.getMetaData();
            {
                ResultSet rs = null;
                try {
                    rs = dbMetaData.getTables(null, schema.toUpperCase(), null, new String[]{"TABLE", "VIEW"});
                    while (rs.next()) {
                        String tableName = rs.getString("TABLE_NAME");
                        Node table = new Node();
                        table.setValue(tableName);
                        table.setText(tableName);
                        table.setType(Node.TABLE);
                        table.setDescription(rs.getString("REMARKS"));
                        tables.add(table);
                    }
                } finally {
                    JdbcUtils.closeResultSet(rs);
                }
            }
            for (Node table : tables) {
                ResultSet rs = null;
                try {
                    rs = dbMetaData.getColumns(null, schema.toUpperCase(), table.getValue(), "%");
                    List<Node> columns = new ArrayList<Node>();
                    while (rs.next()) {
                        Node column = new Node();
                        column.setValue(rs.getString("COLUMN_NAME"));
                        column.setText(column.getValue());
                        column.setType(Node.COLUMN);
                        column.setDescription(rs.getString("REMARKS"));
                        columns.add(column);
                    }
                    table.setNodes(columns);
                } finally {
                    JdbcUtils.closeResultSet(rs);
                }
            }
        } finally {
            JdbcUtils.closeConnection(conn);
        }
        return tables;
    }

    public List<Node> getForms() throws Exception {
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        List<FormVersion> formVersions = versionDaoImpl.selectFormVersionAllList(true);
        if (formVersions == null) {
            return null;
        }
        List<Node> forms = new ArrayList<Node>();
        for (FormVersion formVersion : formVersions) {
            DynamicFormTemplate formTemplate = FormUtils.getFormTemplate(formVersion);
            if (formTemplate == null || formTemplate.getItemTemplateMaps() == null) {
                continue;
            }
            Node form = new Node();
            form.setValue(formVersion.getFormType());
            form.setText(form.getValue());
            form.setType("form");
            form.setDescription(formVersion.getTitle());
            forms.add(form);
            List<Node> items = new ArrayList<Node>();
            form.setNodes(items);
            Collection<String> gformFixedFields = SpringWebApp.getObjectFromName("gformFixedFields");
            addItem(items, gformFixedFields.toArray(new String[0]));
            List<Map<String, DynamicFormItem>> itemTemplateMaps = formTemplate.getItemTemplateMaps();
            for (Map<String, DynamicFormItem> itemTemplateMap : itemTemplateMaps) {
                for (DynamicFormItem itemTemplate : itemTemplateMap.values()) {
                    Node item = new Node();
                    item.setValue(itemTemplate.getName());
                    item.setText(item.getValue());
                    String controlType = itemTemplate.getControlType();
                    if ("time".equals(controlType) || "date".equals(controlType))
                        item.setType("datetime");
                    else
                        item.setType(controlType);
                    String[] uiValueArray = itemTemplate.getUiValue();
                    StringBuilder title = new StringBuilder(StringUtils.defaultString(itemTemplate.getTitle()));
                    if (!ArrayUtils.isEmpty(uiValueArray)) {
                        String[] uiDescArray = itemTemplate.getUiDesc();
                        for (int i = 0; i < uiValueArray.length; i++) {
                            String uiValue = uiValueArray[i];
                            if (i>= uiDescArray.length) {
                                System.out.println("formTemplate error!formType:"+formVersion.getFormType()+"itemName:"+itemTemplate.getName()+" :--uiValue.length>uiDesc.length");
                                continue;
                                //throw new Exception("formTemplate error!formType:"+formVersion.getFormType()+"itemName:"+itemTemplate.getName()+" :--uiValue.length>uiDesc.length");
                            }
                            String uiDesc = uiDescArray[i];
                            if (!StringUtils.equals(uiValue,uiDesc)) {
                                title.append(" ").append(StringUtils.defaultString(uiValue)).append(" : ").append(uiDesc);
                            }
                        }
                    }
                    item.setDescription(title.toString());
                    items.add(item);
                }
            }
        }
        return forms;
    }

    private void addItem(List<Node> items, String... itemNames) {
        if (itemNames != null) {
            for (String itemName : itemNames) {
                if (itemName != null) {
                    Node item = new Node();
                    item.setValue(itemName);
                    item.setText(item.getValue());
                    item.setType("item");
                    items.add(item);
                }
            }
        }
    }

    String gformSeparator = "@*@";

    public String getResultSetList(String params) throws Exception {
        try {
            if (JSON.isValidObject(params)) {
                BaseData baseData = JSON.parseObject(params, BaseData.TYPE);
                List<Map<String, Object>> mapList = new ArrayList<Map<String, Object>>();
                int tabInd = 0;
                for (Map.Entry<String, List<Schema>> entry : baseData.entrySet()) {
                    boolean noResult = false;
                    if ("database".equals(entry.getKey())) {
                        for (Schema schema : entry.getValue()) {
                            schema.setBaseData(baseData);
                            List<Table> tables = schema.getTables();
                            StringBuilder columnSql = new StringBuilder();
                            StringBuilder tableSql = new StringBuilder();
                            StringBuilder whereSql = new StringBuilder();
                            StringBuilder orderSql = new StringBuilder();
                            for (int k = 0,columnsInd=0, whereInd = 0, orderInd = 0; k < tables.size(); k++, tabInd++) {
                                Table table = tables.get(k);
                                table.setSchema(schema);
                                String tableName = table.getName();
                                String tableNameWithSchema = table.getNameWithSchema();
                                table.autoColumns(true);
                                List<String> join = table.getJoin();
                                if (k > 0) {
                                    if (join == null) {
                                        tableSql.append(",").append(tableNameWithSchema);
                                    } else {
                                        StringBuilder onSqlSb = new StringBuilder();
                                        for (int l = 0, m = 0; l < join.size(); l++) {
                                            String onSql = join.get(l);
                                            if (StringUtils.isNotBlank(onSql)) {
                                                String[] eqs = onSql.split(",");
                                                for (int n = 0; n < eqs.length; n++) {
                                                    String onKey = eqs[n];
                                                    if (onKey.contains(tableName + ".")) {
                                                        String onVal = eqs[eqs.length - n - 1];
                                                        String onTable = StringUtils.substringBefore(onVal, ".");
                                                        if (schema.containsTable(onTable)) {
                                                            onSql = onKey + "=" + onVal;
                                                        } else {
                                                            onSql = getInSql(onKey, schema.getRealValue(onKey,onVal));
                                                        }
                                                        break;
                                                    }
                                                }
                                                if (m > 0) {
                                                    onSqlSb.append(" AND ");
                                                }
                                                onSqlSb.append(onSql);
                                                m++;
                                            }
                                        }
                                        if (onSqlSb.length() > 0) {
                                            tableSql.append(" LEFT JOIN ").append(tableNameWithSchema)
                                                    .append(" ON ").append(onSqlSb);
                                        } else {
                                            tableSql.append(",").append(tableNameWithSchema);
                                        }
                                    }
                                } else {
                                    tableSql.append(tableNameWithSchema);
                                    if (tabInd > 0 && join != null) {
                                        /*TODO 連接其他schema中表的條件*/
                                        StringBuilder onSqlSb = new StringBuilder();
                                        for (int l = 0, m = 0; l < join.size(); l++) {
                                            String onSql = join.get(l);
                                            if (StringUtils.isNotBlank(onSql)) {
                                                String[] eqs = onSql.split(",");
                                                for (int n = 0; n < eqs.length; n++) {
                                                    String onKey = eqs[n];
                                                    if (onKey.contains(tableName + ".")) {
                                                        String onVal = eqs[eqs.length - n - 1];
                                                        onSql = getInSql(onKey, schema.getRealValue(onKey,onVal));
                                                        break;
                                                    }
                                                }
                                                if (m > 0) {
                                                    onSqlSb.append(" AND ");
                                                }
                                                onSqlSb.append(onSql);
                                                m++;
                                            }
                                        }
                                        if (onSqlSb.length() > 0) {
                                            whereSql.append(onSqlSb);
                                            whereInd++;
                                        }
                                    }
                                }
                                /*get changed columns*/
                                String selectColumns = table.getSelectColumns();
                                if (selectColumns.length()>0) {
                                    if (columnsInd++ > 0) {
                                        columnSql.append(",");
                                    }
                                    columnSql.append(selectColumns);
                                }

                                String where = table.getWhere();
                                if (StringUtils.isNotBlank(where)) {
                                    if (whereInd > 0) {
                                        whereSql.append(" AND (");
                                    }
                                    whereSql.append(where);
                                    if (whereInd > 0) {
                                        whereSql.append(" )");
                                    }
                                    whereInd++;
                                }
                                String order = table.getOrder();
                                if (StringUtils.isNotBlank(order)) {
                                    if (orderInd > 0) {
                                        orderSql.append(",");
                                    }
                                    orderSql.append(order);
                                    orderInd++;
                                }
                            }
                            StringBuilder sql = new StringBuilder();
                            sql.append("SELECT ").append(columnSql).append(" FROM ").append(tableSql);
                            if (whereSql.length() > 0) {
                                sql.append(" WHERE ").append(whereSql);
                            }
                            if (orderSql.length() > 0) {
                                sql.append(" ORDER BY ").append(orderSql);
                            }
                            List<Map<String, Object>> dataList = schema.getNamedParameterJdbcTemplate().queryForList(sql.toString(), (Map<String, ?>) null);
                            schema.setDataList(dataList).joinedDataList(mapList);
                            noResult=dataList==null||dataList.size()==0;
                        }
                    } else if ("form".equals(entry.getKey())) {
                        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
                        Map<String, Object> map = new HashMap<String, Object>();
                        Set<String> gformFixedFields = SpringWebApp.getObjectFromName("gformFixedFields");
                        for (Schema schema : entry.getValue()) {
                            List<Table> tables = schema.getTables();
                            for (int k = 0; k < tables.size(); k++, tabInd++) {
                                Table table = tables.get(k);
                                List<String> initColumns = table.getColumns();
                                String tableName = table.getName();
                                schema = new Schema();
                                schema.setBaseData(baseData);
                                table.setSchema(schema);
                                map.put("formType", tableName);
                                List<String> join = table.getJoin();
                                List<Map<String, Object>> items = new ArrayList<Map<String, Object>>();
                                if (tabInd > 0) {
                                    if (join != null) {
                                        for (String onSql : join) {
                                            if (StringUtils.isNotBlank(onSql)) {
                                                String[] eqs = onSql.split(",");
                                                for (int m = 0; m < eqs.length; m++) {
                                                    String itemKey = eqs[m].replace(tableName + ".", "");
                                                    if (!eqs[m].equals(itemKey)) {
                                                        Set<Object> realValues = schema.getRealValue(eqs[m], eqs[eqs.length - m - 1]);
                                                        if (gformFixedFields.contains(itemKey)) {
                                                            map.put(itemKey + "s", realValues.toArray());
                                                        } else {
                                                            Map<String, Object> item = new HashMap<String, Object>();
                                                            item.put("key", itemKey);
                                                            item.put("values", realValues);
                                                            items.add(item);
                                                        }
                                                        break;
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                                String where = table.getWhere();
                                if (StringUtils.isNotBlank(where)) {
                                    for (String fixedField : gformFixedFields) {
                                        String attach = "((\\s+)(and|or)(\\s+))?";
                                        Pattern compile = Pattern.compile(attach + "(" + tableName + "\\.)?" + fixedField + "(\\s+)?(>)?(<)?=(\\s+)?'([^']+)'" + attach, Pattern.CASE_INSENSITIVE);
                                        Matcher matcher = compile.matcher(where);
                                        if (matcher.find()) {
                                            String value = matcher.group(10);
                                            if ("evaluationTime".equalsIgnoreCase(fixedField)) {
                                                if (matcher.group(7) != null) {
                                                    map.put("beginDate", value);
                                                } else if (matcher.group(8) != null) {
                                                    map.put("endDate", value);
                                                }
                                            } else {
                                                map.put(fixedField, value);
                                            }
                                            where = matcher.replaceFirst("");
                                        }
                                    }
                                    /*識別itemKey*/
                                    if (StringUtils.isNotBlank(where.trim())) {
                                        String in = "'([^']+)'";
                                        Pattern compile = Pattern.compile("(" + tableName + "\\.)?" +
                                                "(\\w+)(" +
                                                "((\\s+)?=(\\s+)?'([^']+)')" +
                                                "|" +
                                                "(\\s+(in|IN)\\s+\\(((" + in + "((\\s+)?,(\\s+)?)?)+)\\))" +
                                                ")");
                                        Pattern inC = Pattern.compile(in);
                                        Matcher matcher = compile.matcher(where);
                                        while (matcher.find()) {
                                            String itemKey = matcher.group(2);
                                            String value = matcher.group(7);
                                            String values = matcher.group(10);
                                            Map<String, Object> item = new HashMap<String, Object>();
                                            item.put("key", itemKey);
                                            item.put("value", value);
                                            if (values != null) {
                                                Matcher inM = inC.matcher(values);
                                                Set<Object> realValues = new LinkedHashSet<Object>();
                                                while (inM.find()) {
                                                    realValues.add(inM.group(1));
                                                }
                                                item.put("values", realValues);
                                            }
                                            items.add(item);
                                        }
                                    }
                                }
                                map.put("items", items.toArray(new Map[0]));
                                List<GForm> gformList = formDao.selectFormWithItems(map);
                                noResult= gformList==null||gformList.size() == 0;
                                if (!noResult) {
                                    List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
                                    List<String> columns = table.getColumns();
                                    for (GForm gform : gformList) {
                                        Map<String, Object> gMap = new LinkedHashMap<String, Object>();
                                        dataList.add(gMap);
                                        String column;
                                        column = "sourceId";
                                        if (containsColumn(initColumns,columns, column))
                                            gMap.put(tableName+"."+column, gform.getSourceId());
                                        column = "formId";
                                        if (containsColumn(initColumns, columns, column))
                                            gMap.put(tableName+"."+column, gform.getFormId());
                                        column = "formVersionId";
                                        if (containsColumn(initColumns, columns, column))
                                            gMap.put(tableName+"."+column, gform.getFormVersionId());
                                        column = "evaluationTime";
                                        if (containsColumn(initColumns, columns, column))
                                            gMap.put(tableName+"."+column, gform.getEvaluationTime());
                                        column = "status";
                                        if (containsColumn(initColumns, columns, column))
                                            gMap.put(tableName+"."+column, gform.getStatus());
                                        for (GFormItem gformItem : gform.getGformItems()) {
                                            String itemKey = gformItem.getItemKey();
                                            if (containsColumn(initColumns, columns, itemKey)) {
                                                String itemValue = gformItem.getItemValue();
                                                String otherValue = gformItem.getOtherValue();
                                                if (StringUtils.isNotBlank(otherValue)) {
                                                    itemValue += gformSeparator + otherValue;
                                                }
                                                gMap.put(tableName+"."+itemKey, itemValue);
                                            }
                                        }
                                    }
                                    String order = table.getOrder();
                                    if (StringUtils.isNotBlank(order)) {
                                        String[] orders = order.split(",");
                                        final Map<String, Integer> orderMap = new LinkedHashMap<String, Integer>();
                                        for (String ord : orders) {
                                            Pattern compile = Pattern.compile("(" + tableName + "\\.)?(\\w+)(\\s+(desc|DESC)|(asc|ASC))?");
                                            Matcher matcher = compile.matcher(ord);
                                            if (matcher.find()) {
                                                String itemKey = matcher.group(2);
                                                String desc = matcher.group(4);
                                                orderMap.put(itemKey, desc != null ? -1 : 1);
                                            }
                                        }
                                        Collections.sort(dataList, new Comparator<Map<String, Object>>() {
                                            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                                                int c = 0;
                                                for (Map.Entry<String, Integer> entry : orderMap.entrySet()) {
                                                    String key = entry.getKey();
                                                    Integer order = entry.getValue();
                                                    Object oV1 = o1.get(key);
                                                    Object oV2 = o2.get(key);
                                                    if ((oV1 instanceof Date) && (oV2 instanceof Date)) {
                                                        c = ((Date) oV1).compareTo((Date) oV2) * order;
                                                    } else if ((oV1 instanceof String) && (oV2 instanceof String)) {
                                                        String v1 = (String) oV1;
                                                        String v2 = (String) oV2;
                                                        if (StringUtils.isNotBlank(v1) && StringUtils.isNotBlank(v2)) {
                                                            v1 = StringUtils.substringBefore(v1, gformSeparator);
                                                            v2 = StringUtils.substringBefore(v2, gformSeparator);
                                                            if (NumberUtils.isNumber(v1) && NumberUtils.isNumber(v2)) {
                                                                c = NumberUtils.compare(NumberUtils.toFloat(v1), NumberUtils.toFloat(v2)) * order;
                                                            } else {
                                                                c = v1.compareTo(v2) * order;
                                                            }
                                                        }
                                                    }
                                                }
                                                return c;
                                            }
                                        });
                                    }
                                    schema.setDataList(dataList).joinedDataList(mapList);
                                }
                            }

                        }
                    }
                    if (noResult) {
                        break;
                    }
                }
                return JSON.toJSONStringWithDateFormat(mapList,"yyyy/MM/dd HH:mm:ss");
            }
            return null;
        } catch (Exception e) {
            PrintUtils.printByDVm(e);
            return ExceptionUtils.getFullStackTrace(e);
        }
    }

    public static String getInSql(String column, Collection<Object> values) {
        int step = 1000;
        Collection<Object> valSet;
        if (values instanceof Set) {
            valSet = values;
        }else{
            valSet = new LinkedHashSet<Object>(values);

        }
        StringBuilder inSql = new StringBuilder("( ");
        Iterator<Object> iterator = valSet.iterator();
        for (int i = 0; iterator.hasNext(); i++) {
            Object val = iterator.next();
            if (i % step == 0) {
                if(i>0)inSql.append(") OR ");
                inSql.append(column).append(" IN (");
            }else if (i > 0) {
                inSql.append(",");
            }
            inSql.append("'").append(ObjectUtils.toString(val)).append("'");
            if (!iterator.hasNext()) {
                inSql.append(")");
            }
        }
        inSql.append(" )");
        return inSql.toString();
    }

    public static boolean containsColumn(List<String> initColumns, List<String> columns, String column) {
        if (initColumns == null || initColumns.size() == 0) {
            return true;
        }
        for (String col : initColumns) {
            if (col.equals(column) || col.endsWith("." + column)) {
                return true;
            }
        }
        if (columns != null) {
            for (String col : columns) {
                if (col.equals(column) || col.endsWith("." + column)) {
                    return true;
                }
            }
        }
        return false;
    }

}
