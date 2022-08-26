package com.inqgen.nursing.dynamic.form.dao.impl;

import com.inqgen.nursing.dynamic.form.bean.FormVersion;
import com.inqgen.nursing.dynamic.form.dao.FormVersionDao;
import org.apache.commons.lang.StringUtils;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FormVersionDaoImpl extends SqlMapClientDaoSupport implements FormVersionDao {
	public void addOrUpdate(FormVersion version) throws Exception {
		getSqlMapClient().insert("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.addOrUpdate", version);
	}
	public FormVersion selectFormVersion(Map map) throws Exception {
		Object obj=getSqlMapClient().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectFormVersion", map);
		return (FormVersion) obj;
	}
	
	public FormVersion selectFormVersionById(String id) throws Exception {
		return (FormVersion) getSqlMapClient().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectFormVersionById", id);
	}
	
	public int selectMaxFormVersion(String formType) throws Exception {
		Object obj=getSqlMapClient().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectMaxFormVersion", formType);
		if(obj==null){
			return 0;
		}
		return (Integer)obj;
	}
	
	public String selectMaxFormVersionId(String formType) throws Exception {
		Object obj = getSqlMapClient().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectMaxFormVersionId", formType);
		if(obj==null){
			return "";
		}
		return (String)obj;
	}

	public FormVersion selectFormVersionMax(String formType) throws Exception {
		return (FormVersion) getSqlMapClient().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectFormVersionMax", formType);
	}

	public void updateFormVersionByFormTypeFormModelVersion(FormVersion version) throws Exception {
		getSqlMapClient().update("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.updateFormVersionByFormTypeFormModelVersion", version);
	}


	public List<FormVersion> selectFormVersionAllList(boolean...hasContent) throws Exception {
		HashMap<String, Object> map = new HashMap<String, Object>();
		if (hasContent!=null && hasContent.length>0 && hasContent[0]) {
			map.put("hasContent", "true");
		}
		List<FormVersion> list=getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectFormVersionAllList", map);
		if(list.size()==0){
			return null;
		}
		return list;
	}

	public List<FormVersion> selectFormVersionListMaxTsByFormType(String[] formTypeArr) throws Exception {
		List<FormVersion> list=getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectFormVersionListMaxTsByFormType", formTypeArr);
		if(list.size()==0){
			return null;
		}
		return list;
	}
	
	public List<FormVersion> selectFormVersionListByFormTypeTs(Map map) throws Exception {
		List<FormVersion> list=getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectFormVersionListByFormTypeTs", map);
		if(list.size()==0){
			return null;
		}
		return list;
	}

	public List<FormVersion> selectFormVersionListByFormType(String formType) throws Exception {
		List<FormVersion> list=getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectFormVersionListByFormType", formType);
		if(list.size()==0){
			return null;
		}
		return list;
	}

	public FormVersion selectFormVersionByFormModelVersionNo(Map map) throws Exception {
		HashMap mapNew = new HashMap();
		mapNew.put("formType", preventXSRF(String.valueOf(map.get("formType"))));
		mapNew.put("formModel", preventXSRF(String.valueOf(map.get("formModel"))));
		mapNew.put("versionNo", preventXSRF(String.valueOf(map.get("versionNo"))));
		List<FormVersion> list=getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectFormVersionByFormModelVersionNo", mapNew);
		if(list.size()==0){
			return null;
		}
		return list.get(0);
	}

	public  String preventXSRF(String str){
		if (StringUtils.isNotBlank(str)) {
			return str
					.replace("<", "&lt;")
					.replace(">", "&gt;")
					.replace("\"", "&quot;")
					.replace("'", "&#39;")
					;
		}
		return str;
	}

    @Override
    public List<FormVersion> selectFormVersionListVersionByFormType(HashMap map) throws Exception {
        return getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectFormVersionListVersionByFormType", map);
    }

    @Override
    public List<FormVersion> selectAllFormVersionFormType(HashMap map) throws Exception {
        return getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.selectAllFormVersionFormType", map);

    }

    public void deleteFormVersionListByFormTypeVersion(FormVersion version) throws Exception {
		getSqlMapClient().delete("com.inqgen.nursing.dynamic.form.dao.FormVersionDao.deleteFormVersionListByFormTypeVersion", version);
	}
}
