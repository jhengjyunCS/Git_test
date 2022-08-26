package com.inqgen.nursing.dynamic.form.dao;

import com.inqgen.nursing.dynamic.form.bean.GForm;
import com.inqgen.nursing.dynamic.form.bean.GFormItem;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface GFormDao {

    public void addForm(GForm GForm);

    public void addFormItem(GFormItem gFormItem);

    public void updateFormStates(Map map);

    public List<GForm> selectFormAutoItems(Map map);

    public List<GFormItem> selectFormItem(Map map);

    public List<GForm> selectFormWithItems(Map map);

    public List<GForm> getGFormListBySourceIdsGroupOne(Map map);

    public GForm selectLastGformWithItems(Map map);

    public List<GForm> selectLastGformAutoItems(Map<String, Object> map);

    public List<GForm> countGformSize(Map<String, Object> map);
    public String selectLastGFormId(Map map);

    public List<GForm> selectFormByFormIds(HashMap<String, Object> map);

    public Integer selectFormTotalCountByItemKey(HashMap<String, Object> map);

    public GForm selectGformByFdocId(String fdocid);

    public List<GForm> selectGformByFdocIds(HashMap<String, Object> map);

    public void updateGFormContentAndItemValue(HashMap<String, Object> map) throws SQLException;

    public List<GForm> selectFormTypeToProduceXml(HashMap map);

    public void updateFormSourceIdByFormId(String formId, String sourceId);

}