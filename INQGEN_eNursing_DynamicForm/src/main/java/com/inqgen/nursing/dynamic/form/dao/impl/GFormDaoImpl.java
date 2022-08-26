package com.inqgen.nursing.dynamic.form.dao.impl;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.inqgen.nursing.dynamic.form.bean.*;
import com.inqgen.nursing.dynamic.form.dao.GFormDao;
import org.springframework.orm.ibatis.SqlMapClientTemplate;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.apache.commons.lang.StringUtils;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

import static com.inqgen.nursing.utils.FormUtils.getUUID;

public class GFormDaoImpl extends SqlMapClientDaoSupport implements GFormDao {

    public void addForm(GForm gForm) {
        getSqlMapClientTemplate().insert("com.inqgen.nursing.dynamic.form.dao.GFormDao", gForm);

    }

    public void addFormItem(GFormItem gFormItem) {
        getSqlMapClientTemplate().insert("com.inqgen.nursing.dynamic.form.dao.GFormDao.insertFormItem", gFormItem);
    }

    public void updateFormStates(Map map) {
        getSqlMapClientTemplate().update("com.inqgen.nursing.dynamic.form.dao.GFormDao.updateFormStates", map);
    }

    public List<GForm> selectFormAutoItems(Map map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormAutoItems", map);
    }

    public List<GForm> selectFormWithItems(Map map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormWithItems", processMapItems(map));
    }

    public List<GForm> getGFormListBySourceIdsGroupOne(Map map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.getGFormListBySourceIdsGroupOne", map);
    }

    public List<GForm> selectFormWithItemsForSign(Map map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormWithItemsForSign", map);
    }
    
    public GForm selectLastGformWithItems(Map map) {
        GForm gForm = (GForm) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectLastGformWithItems", map);
        if (null!=gForm && null!= map.get("hasContent") && ((Boolean) map.get("hasContent"))) {
            Map<String, String> map2 = new HashMap<String, String>();
            map2.put("fdocId", gForm.getFdocId());
            gForm.setContent((String) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectContentByFormId", map2));
        }
        return gForm;
    }

    public List<GForm> selectLastGformAutoItems(Map<String,Object> map) {
        if (map.get("itemKey")!=null||map.get("itemKeys")!=null) {
            map.put("withItems", true);
        }
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectLastGformAutoItems", map);
    }

    public List<GForm> countGformSize(Map<String,Object> map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.countGformSize", map);
    }
	public String selectLastGFormId(Map map) {
		Object obj=getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectLastGFormId", map);
		if(obj==null){
			return "";
		}
		return (String)obj;
	}

    @Override
    public List<GForm> selectFormByFormIds(HashMap<String, Object> map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormByFormIds", map);
    }

    @Override
    public Integer selectFormTotalCountByItemKey(HashMap<String, Object> map) {
        return (Integer) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormTotalCountByItemKey",map);
    }

    public List<GForm> selectGFormListWithCondition(SearchParamGF searchParamGF) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectGFormListWithCondition", searchParamGF);
    }

    public List<GForm> selectGFormListWithConditionPlus(SearchParamGF searchParamGF) {
        List<GForm> gFormList = new ArrayList<GForm>();

        // // 數據庫為 SQL Server，並且查詢類型為查詢數據數量
        if(isSQLServerDatabase(getSqlMapClientTemplate()) && searchParamGF.getQueryTotalCounts()){
            Integer num = (Integer) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectGFormListWithConditionPlusCountSQLServer", searchParamGF);
            GForm gForm = new GForm();
            gForm.setTotalCounts(num != null ? num.toString() : "0");
            gFormList.add(gForm);
        }else{
            gFormList = getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectGFormListWithConditionPlus", searchParamGF);
        }

        //如果不是抓取總數，且hasContent==true or null，預設抓取content欄位
        if (!searchParamGF.getQueryTotalCounts()){
            if (null == searchParamGF.getHasContent() || searchParamGF.getHasContent()) {
                for (GForm gForm : gFormList) {
                    Map<String, String> map = new HashMap<String, String>();
                    map.put("fdocId", gForm.getFdocId());
                    gForm.setContent((String) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectContentByFormId", map));
                }
            }
        }
        return gFormList;
    }

    public GForm selectFormByFormId(Map map,boolean... autoItems) {
        if (autoItems!=null&&autoItems.length>0&&autoItems[0])
            return (GForm) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormAutoItems", map);
        else {
            return getSingleGFormByUniqueItem(map);
        }
    }
    public GForm getSingleGFormByUniqueItem(Map<String,Object> map) {
        return (GForm) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormWithItems", processMapItems(map));
    }

    /**
     * 查询form数据最新状态
     */
    public String selectFormStatusByFormId(String formId) {
        Object o = getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormStatusByFormId", formId);
        String status = "D";
        if (o != null && StringUtils.isNotBlank((String) o)) {
            status = (String) o;
        }
        return status;
    }

    private Map<String, Object> processMapItems(Map<String, Object> map) {
        if (map != null) {
            Object items = map.get("items");
            if (items != null) {
                StringBuilder itemCons = new StringBuilder();
                Map[] maps = (Map[]) items;
                for (int i = 0; i < maps.length; i++) {
                    Map<?, ?> item = maps[i];
                    String key = (String) item.get("key");
                    String value = (String) item.get("value");
                    Set<Object> values = (Set<Object>) item.get("values");
                    if (i>0) {
                        itemCons.append(" or ");
                    }
                    itemCons.append("(");
                    itemCons.append("gfi.itemKey='").append(key).append("'").append(" and ");
                    if (value != null) {
                        itemCons.append("itemValue='").append(value).append("'");
                    } else if (values != null) {
                        itemCons.append("itemValue in ('").append(StringUtils.join(values, "','")).append("')");
                    }
                    itemCons.append(")");
                }
                if (itemCons.length()>0) {
                    map.put("itemCons", itemCons.toString());
                    map.put("itemSize", maps.length);
                }
            }

        }
        return map;
    }

    public List<GFormItem> selectFormItem(Map map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormItem", map);
    }

    public void addOrUpdateForm(String oldFormId, GForm gForm, String sourceId) throws Exception {
        SqlMapClient client = getSqlMapClientTemplate().getSqlMapClient();
        try {
            if (gForm.getEvaluationTime() == null) {
                gForm.setEvaluationTime(new Date());
            }
            client.startTransaction();
            client.startBatch();
            if (StringUtils.isNotBlank(oldFormId)) {
                client.update("com.inqgen.nursing.dynamic.form.dao.GFormDao.deleteFormWeak", oldFormId);
            }
            if (StringUtils.isBlank(oldFormId)) {
                GFormIndex gFormIndex = new GFormIndex();
                gFormIndex.setId(getUUID());
                gFormIndex.setSourceId(sourceId);
                gFormIndex.setFormId(gForm.getFormId());
                gFormIndex.setFormType(gForm.getFormType());
                gFormIndex.setCreatorId(gForm.getCreatorId());
                gFormIndex.setCreatorName(gForm.getCreatorName());
                gFormIndex.setCreateTime(gForm.getCreateTime());
                gFormIndex.setModifyUserId(gForm.getModifyUserId());
                gFormIndex.setModifyUserName(gForm.getModifyUserName());
                gFormIndex.setModifyTime(gForm.getModifyTime());
                gFormIndex.setStatus(gForm.getStatus());
                gFormIndex.setVersionNo(gForm.getVersionNo());
                addOrUpdateFormIndex(client, oldFormId, gFormIndex);
            }
            client.insert("com.inqgen.nursing.dynamic.form.dao.GFormDao.insertForm", gForm);
            if (gForm.getGformItems() != null) {
                for (GFormItem gFormItem : gForm.getGformItems()) {
                    if (gFormItem != null && gFormItem.getItemValue() != null) {
                        if (gFormItem.getItemValue().length() >= 500 || (StringUtils.isNotBlank(gFormItem.getOtherValue()) && gFormItem.getOtherValue().length() >= 500)) {
                        } else {
                            gFormItem.setFdocId(gForm.getFdocId());
                            gFormItem.setFormId(gForm.getFormId());
                            gFormItem.setCreatorId(gForm.getCreatorId());
                            gFormItem.setCreatorName(gForm.getCreatorName());
                            gFormItem.setCreateTime(gForm.getCreateTime());
                            gFormItem.setModifyUserId(gForm.getModifyUserId());
                            gFormItem.setModifyUserName(gForm.getModifyUserName());
                            gFormItem.setModifyTime(gForm.getModifyTime());
                            client.insert("com.inqgen.nursing.dynamic.form.dao.GFormDao.insertFormItem", gFormItem);
                        }
                    }
                }
            }
            client.executeBatch();
            client.commitTransaction();
        } finally {
            client.endTransaction();
        }
    }

    public void addOrUpdateFormIndex(SqlMapClient client, String oldFormId, GFormIndex gFormIndex) throws SQLException {
        deleteFormIndex(client,oldFormId);
        getSqlMapClientTemplate().insert("com.inqgen.nursing.dynamic.form.dao.GFormDao.insertFormIndex", gFormIndex);
        Map<String, String> map = new HashMap<String, String>(2);
        map.put("oldFormId", oldFormId);
        map.put("formId", gFormIndex.getFormId());
        updateFormIndexLinked(client,map);
    }

    public void deleteForm(String oldFormId) {
        if (StringUtils.isNotBlank(oldFormId)) {
            getSqlMapClientTemplate().update("com.inqgen.nursing.dynamic.form.dao.GFormDao.deleteFormWeak", oldFormId);
        }
    }

    public void deleteFormIndex(String oldFormId) throws SQLException {
        deleteFormIndex(getSqlMapClientTemplate().getSqlMapClient(),oldFormId);
    }
    private void deleteFormIndex(SqlMapClient client, String oldFormId) throws SQLException {
        if (StringUtils.isNotBlank(oldFormId)) {
            client.update("com.inqgen.nursing.dynamic.form.dao.GFormDao.deleteFormIndexWeak", oldFormId);
        }
    }
    private void updateFormIndexLinked(SqlMapClient client, Map<String, String> map) throws SQLException {
        if (StringUtils.isNotBlank(map.get("oldFormId"))) {
            client.update("com.inqgen.nursing.dynamic.form.dao.GFormDao.updateFormIndex", map);
        }
    }
    public GformExcelConf selectGformExcelConfByType(String formType) {
        return (GformExcelConf) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectGformExcelConfByType", formType);
    }
    public List<GformExcelConf> selectGformExcelConfByParent(String parentForm) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectGformExcelConfByParent",parentForm);
    }
    public List<GformExcelConf> selectGformTypeRelation() {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectGformTypeRelation");
    }
    public List<Depart> selectDepartList() {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectDepartList");
    }
    public UserDepart selectUserDepartList(String userId) {
        return (UserDepart) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectUserDepartList",userId);
    }
    public GForm selectGformByFdocId(String fdocid ){
        return (GForm) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectGformByFdocId", fdocid);
    }
    public  List<GForm> selectGformByFdocIds(HashMap<String, Object> map ){
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectGformByFdocIds", map);
    }

    @Override
    public void updateGFormContentAndItemValue(HashMap<String, Object> map)throws SQLException {
        SqlMapClient client= getSqlMapClientTemplate().getSqlMapClient();
        client.startTransaction();
        client.startBatch();
        client.update("com.inqgen.nursing.dynamic.form.dao.GFormDao.updateGFormContent", map);
        client.update("com.inqgen.nursing.dynamic.form.dao.GFormDao.updateGFormItemValue", map);
        client.executeBatch();
        client.commitTransaction();
        client.endTransaction();
    }

    public List<GForm> selectFormTypeToProduceXml(HashMap map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormDao.selectFormTypeToProduceXml", map);
    }

    public void updateFormSourceIdByFormId(String formId, String sourceId) {
        if (StringUtils.isNotBlank(formId) && StringUtils.isNotBlank(sourceId)) {
            HashMap<String, String> map = new HashMap<String, String>();
            map.put("formId", formId);
            map.put("sourceId", sourceId);
            getSqlMapClientTemplate().update("com.inqgen.nursing.dynamic.form.dao.GFormDao.updateFormSourceIdByFormId", map);
        }
    }

    /**
     * 判断数据库是否为 SQL Server
     */
    private boolean isSQLServerDatabase(SqlMapClientTemplate clientTemplate){
        boolean flag = false;
        try {
            Connection connection = clientTemplate.getDataSource().getConnection();
            String name = connection.getMetaData().getDatabaseProductName();
            if("Microsoft SQL Server".equals(name)){
                flag = true;
            }
            connection.close();
        }catch (Exception e){
            e.printStackTrace();
        }
        return flag;
    }
}
