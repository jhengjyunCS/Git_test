package com.inqgen.nursing.dynamic.form.dao;

import com.inqgen.nursing.dynamic.form.bean.FormVersion;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface FormVersionDao {

    public FormVersion selectFormVersion(Map map) throws Exception;

    public void addOrUpdate(FormVersion version) throws Exception;

    public int selectMaxFormVersion(String formType) throws Exception;

    public FormVersion selectFormVersionById(String id) throws Exception;

    public String selectMaxFormVersionId(String formType) throws Exception;

    public FormVersion selectFormVersionMax(String formType) throws Exception;

    public void updateFormVersionByFormTypeFormModelVersion(FormVersion version) throws Exception;

    public List<FormVersion> selectFormVersionAllList(boolean...hasContent) throws Exception;
    
    public List<FormVersion> selectFormVersionListMaxTsByFormType(String[] formTypeArr) throws Exception;
    
    public List<FormVersion> selectFormVersionListByFormTypeTs(Map map) throws Exception;

    public List<FormVersion> selectFormVersionListByFormType(String formType) throws Exception;

    public FormVersion selectFormVersionByFormModelVersionNo(Map map) throws Exception;
    public  List<FormVersion>  selectFormVersionListVersionByFormType(HashMap map) throws Exception;
    public  List<FormVersion>  selectAllFormVersionFormType(HashMap map) throws Exception;
}
