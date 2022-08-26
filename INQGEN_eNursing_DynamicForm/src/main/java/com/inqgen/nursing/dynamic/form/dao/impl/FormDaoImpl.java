package com.inqgen.nursing.dynamic.form.dao.impl;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.inqgen.nursing.dynamic.form.bean.Form;
import com.inqgen.nursing.dynamic.form.bean.FormItem;
import com.inqgen.nursing.dynamic.form.dao.FormDao;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import java.sql.SQLException;
import java.util.*;

public class FormDaoImpl extends SqlMapClientDaoSupport implements FormDao {

    public void insertForm(Form form) {
        getSqlMapClientTemplate().insert("com.inqgen.nursing.dynamic.form.dao.FormDao.insertForm", form);
    }

    public void insertFormItem(ArrayList<FormItem> formItems) {
        for (int i = 0; i < formItems.size(); i++) {
            HashMap map = new HashMap();
            map.put("formId", formItems.get(i).getFormID());
            map.put("itemKey", formItems.get(i).getItemKey());
            if (checkFormItemExist(map) == null) {
                formItems.get(i).setID(UUID.randomUUID().toString());
                getSqlMapClientTemplate().insert("com.inqgen.nursing.dynamic.form.dao.FormDao.insertFormItem", formItems.get(i));
            }
        }
    }

    public String checkFormItemExist(HashMap map) {
        List list = getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.checkFormItemExist", map);
        if (list != null && list.size() != 0) {
            return list.get(0).toString();
        }
        return null;
    }

    public void deleteFormItemByFormIdKey(HashMap map) {
        getSqlMapClientTemplate().delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteFormItemByFormIdKey", map);
    }

    public Form selectFormById(String id) {
        // TODO Auto-generated method stub
        return (Form) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormById", id);
    }

    public void addOrUpdate(String id, Form form, ArrayList<FormItem> formItems) throws SQLException {
        SqlMapClient client = getSqlMapClientTemplate().getSqlMapClient();
        client.startTransaction();
        try {
            if (id != null && id.length() != 0) {
                client.delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteForm", id);
            }
            client.insert("com.inqgen.nursing.dynamic.form.dao.FormDao.insertForm", form);
            for (int i = 0; i < formItems.size(); i++) {
                client.insert("com.inqgen.nursing.dynamic.form.dao.FormDao.insertFormItem", formItems.get(i));
            }

            client.commitTransaction();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            client.endTransaction();
        }
    }

    public Object[] selectFromByMap(HashMap map) {

        ArrayList<Form> forms = (ArrayList<Form>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectForm", map);
        ArrayList<FormItem> formItems = (ArrayList<FormItem>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormItem", map);
        HashMap<String, HashMap<String, FormItem>> maps = new HashMap<String, HashMap<String, FormItem>>();
        for (int i = 0; i < formItems.size(); i++) {
            FormItem fi = formItems.get(i);
            HashMap<String, FormItem> temp = null;
            if (maps.containsKey(fi.getFormID())) {
                maps.get(fi.getFormID()).put(fi.getItemKey(), fi);
            } else {
                temp = new HashMap<String, FormItem>();
                temp.put(fi.getItemKey(), fi);

                maps.put(fi.getFormID(), temp);
            }
        }
        return new Object[]{forms, maps};
    }

    public Object[] selectFromByMapSign(HashMap map) {

        ArrayList<Form> forms = (ArrayList<Form>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormSign", map);
        ArrayList<FormItem> formItems = (ArrayList<FormItem>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormItem", map);
        HashMap<String, HashMap<String, FormItem>> maps = new HashMap<String, HashMap<String, FormItem>>();
        for (int i = 0; i < formItems.size(); i++) {
            FormItem fi = formItems.get(i);
            HashMap<String, FormItem> temp = null;
            if (maps.containsKey(fi.getFormID())) {
                maps.get(fi.getFormID()).put(fi.getItemKey(), fi);
            } else {
                temp = new HashMap<String, FormItem>();
                temp.put(fi.getItemKey(), fi);

                maps.put(fi.getFormID(), temp);
            }
        }
        return new Object[]{forms, maps};
    }

    public ArrayList<Form> queryFormByPros(HashMap map) {
        ArrayList<Form> forms = (ArrayList<Form>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectForm", map);
        return forms;
    }

    public void deleteForm(String Id) {
        getSqlMapClientTemplate().delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteFormItem", Id);
        getSqlMapClientTemplate().delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteForm", Id);
    }


    public void deleteFormMoniterNurseById(String id) {
        getSqlMapClientTemplate().delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteFormMoniterNurseById", id);
    }


    public void deleteMoniterLogById(String id) {
        getSqlMapClientTemplate().delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteMoniterLogById", id);
    }

    public void deleteFormCheckMoniterById(String id) {
        getSqlMapClientTemplate().delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteFormCheckMoniterById", id);
    }

    public HashMap getRegistrationPressureData(HashMap map) {
        return (HashMap) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormDao.getRegistrationPressureData", map);

    }

    public List selectRegistrationPressureToReport(HashMap map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectRegistrationPressureToReport", map);

    }

    public HashMap getRegistrationFallData(HashMap map) {
        return (HashMap) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormDao.getRegistrationFallData", map);

    }


    public HashMap getRegistrationTubeData(HashMap map) {
        return (HashMap) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormDao.getRegistrationTubeData", map);

    }

    public void updateRegistrationFall(HashMap map) {
        getSqlMapClientTemplate().update("com.inqgen.nursing.dynamic.form.dao.FormDao.updateRegistrationFall", map);
    }

    public void updateRegistrationPressure(HashMap map) {
        getSqlMapClientTemplate().update("com.inqgen.nursing.dynamic.form.dao.FormDao.updateRegistrationPressure", map);

    }

    public void updateRegistrationTube(HashMap map) {
        getSqlMapClientTemplate().update("com.inqgen.nursing.dynamic.form.dao.FormDao.updateRegistrationTube", map);

    }

    public List selectForm2(HashMap map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectForm2", map);
    }

    public void cancelStopMonitorTable(String id) {
        getSqlMapClientTemplate().update("com.inqgen.nursing.dynamic.form.dao.FormDao.cancelStopMonitorTable", id);
    }

    public List selectFormMoniterNurseToWorkList(HashMap map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormMoniterNurseToWorkList", map);
    }

    public List<String> selectFormToWorkList(HashMap map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormToWorkList", map);

    }

    public List<String> selectFormToWorkListOracle(HashMap map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormToWorkListOracle", map);

    }

    public Form getLastForm(String formTypes, String encId) {
        HashMap map = new HashMap();
        map.put("formTypes", formTypes.split(","));
        map.put("encId", encId);
        List list = getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.getLastFormScore", map);
        if (list.size() == 0) {
            return null;
        }
        return (Form) list.get(0);

    }

    public List<Form> selectFormForWS(Map map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormForWS", map);
    }

    public String selectLastFormId(Map map) {
        Object obj = getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormDao.selectLastFormId", map);
        if (obj == null) {
            return "";
        }
        return (String) obj;
    }

    public List<Form> selectFormToOem(Map map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormToOem", map);
    }

    public List<FormItem> selectFormItemOem(Map map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormItemOem", map);
    }

    public List<Form> selectFormToKardex(HashMap map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormToKardex", map);
    }

    public String getLastAddFormDitto(HashMap map) throws SQLException {
        List<String> list = getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.getLastAddForm", map);
        if (list != null && list.size() != 0) {
            return list.get(0);
        }
        return null;
    }

    public String getLastAddFormDittoId(HashMap map) throws SQLException {
        List<String> list = getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.getLastAddFormId", map);
        if (list != null && list.size() != 0) {
            return list.get(0);
        }
        return null;
    }

    public String getLastCbwByParam(HashMap<String, Object> param) {
        return (String) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormDao.getLastCbwByParam", param);
    }


    public void addOrUpdate2(String id, Form form, ArrayList<FormItem> formItems)
            throws SQLException {
        SqlMapClient client = getSqlMapClientTemplate().getSqlMapClient();
        client.startTransaction();
        try {
            if (id != null && id.length() != 0) {
                client.delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteFormItem", id);
                client.delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteForm", id);
            }
            client.insert("com.inqgen.nursing.dynamic.form.dao.FormDao.insertForm2", form);
            for (int i = 0; i < formItems.size(); i++) {
                formItems.get(i).setFormID(form.getFormId());
                if (formItems.get(i) != null && formItems.get(i).getItemValue() != null && formItems.get(i).getItemValue().length() >= 500) {
                	try{
                        client.insert("com.inqgen.nursing.dynamic.form.dao.FormDao.insertFormItem", formItems.get(i));
                    } catch (Exception e) {
                    }
                    
                } else {
                    client.insert("com.inqgen.nursing.dynamic.form.dao.FormDao.insertFormItem", formItems.get(i));
                }
            }

            client.commitTransaction();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            client.endTransaction();
        }

    }

    public String getFormIdByOfFormId(HashMap<String, String> map) {
        List list = getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.getFormIdByOfFormId", map);
        if (list != null && list.size() != 0) {
            return list.get(0).toString();
        }
        return null;
    }

    public void addOrUpdate3(String id, Form form, ArrayList<FormItem> formItems)
            throws SQLException {
        SqlMapClient client = getSqlMapClientTemplate().getSqlMapClient();
        client.startTransaction();
        try {
            if (id != null && id.length() != 0) {
                client.delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteFormItem", id);
                client.delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteForm", id);
            }
            client.insert("com.inqgen.nursing.dynamic.form.dao.FormDao.insertForm3", form);
            for (int i = 0; i < formItems.size(); i++) {
                formItems.get(i).setFormID(form.getFormId());
                client.insert("com.inqgen.nursing.dynamic.form.dao.FormDao.insertFormItem", formItems.get(i));
            }

            client.commitTransaction();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            client.endTransaction();
        }

    }

    public List<FormItem> getFormItemForBMIScore(HashMap map) throws SQLException {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.getFormItemForBMIScore", map);
    }

    public Form getFormById(String id) {
        return (Form) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormDao.getFormById", id);

    }

    public Object[] selectFromByEvaTime(HashMap map) {
        ArrayList<Form> forms = (ArrayList<Form>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormByEvaTime", map);
        ArrayList<FormItem> formItems = (ArrayList<FormItem>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormItem", map);
        HashMap<String, HashMap<String, FormItem>> maps = new HashMap<String, HashMap<String, FormItem>>();
        for (int i = 0; i < formItems.size(); i++) {
            FormItem fi = formItems.get(i);
            HashMap<String, FormItem> temp = null;
            if (maps.containsKey(fi.getFormID())) {
                maps.get(fi.getFormID()).put(fi.getItemKey(), fi);
            } else {
                temp = new HashMap<String, FormItem>();
                temp.put(fi.getItemKey(), fi);

                maps.put(fi.getFormID(), temp);
            }
        }
        return new Object[]{forms, maps};
    }

    public void deleteFormByType(HashMap<String, Object> param) throws Exception {
        getSqlMapClientTemplate().delete("com.inqgen.nursing.dynamic.form.dao.FormDao.deleteFormByType", param);
    }

    public List<Form> selectFormByTypes(HashMap<String, Object> map) {
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormByTypes", map);
    }

    /**
     * 南京鎮靜評估專用
     */
    public List queryFormByCalm(HashMap map) {
        ArrayList<Form> forms = (ArrayList<Form>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.queryFormByCalm", map);
        return forms;
    }

    /**
     * 南京鎮靜評估專用
     */
    public Object[] selectFromByCalm(HashMap map) {
        ArrayList<Form> forms = (ArrayList<Form>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.queryFormByCalm", map);
        ArrayList<FormItem> formItems = (ArrayList<FormItem>) getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.selectFormItem", map);
        HashMap<String, HashMap<String, FormItem>> maps = new HashMap<String, HashMap<String, FormItem>>();
        for (int i = 0; i < formItems.size(); i++) {
            FormItem fi = formItems.get(i);
            HashMap<String, FormItem> temp = null;
            if (maps.containsKey(fi.getFormID())) {
                maps.get(fi.getFormID()).put(fi.getItemKey(), fi);
            } else {
                temp = new HashMap<String, FormItem>();
                temp.put(fi.getItemKey(), fi);

                maps.put(fi.getFormID(), temp);
            }
        }
        return new Object[]{forms, maps};

    }

    public List<Form> getScoresForRecordList(HashMap map) {

        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.FormDao.getScoresForRecordList", map);
    }

    public Form selectLastFormWithItems(Map map) {
        return (Form) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormDao.selectLastFormWithItems", map);
    }
    
    public String getFormCount(HashMap map) {
    	return (String) getSqlMapClientTemplate().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormDao.getFormCount", map);
    }

}
