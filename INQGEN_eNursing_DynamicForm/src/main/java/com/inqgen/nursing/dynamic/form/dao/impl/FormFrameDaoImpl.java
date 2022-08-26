package com.inqgen.nursing.dynamic.form.dao.impl;

import com.inqgen.nursing.dynamic.form.bean.FormFrame;
import com.inqgen.nursing.dynamic.form.bean.FormVersion;
import com.inqgen.nursing.dynamic.form.dao.FormFrameDao;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FormFrameDaoImpl extends SqlMapClientDaoSupport implements FormFrameDao {

	/*
	 * FormFrame
	 */
	public void addFormFrame(FormFrame frame) throws Exception {
		getSqlMapClient().insert("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.addFormFrame", frame);
	}

	/*
	 * FormFrame
	 */
	public void updateFormFrameByFormTypeFrameModelVesion(FormFrame frame) throws Exception {
		getSqlMapClient().update("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.updateFormFrameByFormTypeFrameModelVesion", frame);
	}
	
	/*
	 * formType
	 * frameModel
	 * version
	 */
	public FormFrame selectFormFrame(HashMap map) throws Exception {
		FormFrame formFrame = (FormFrame) getSqlMapClient().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectFormFrame", map);
		return formFrame;
	}
	
	/*
	 * formType
	 * frameModel
	 */
	public int selectFormFrameMaxVersion(HashMap map) throws Exception {
		Object obj=getSqlMapClient().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectFormFrameMaxVersion", map);
		if(obj==null){
			return 0;
		}
		return (Integer)obj;
	}

	
	/*
	 * formType
	 * frameModel
	 * versionNo
	 */
	public int selectFormFrameMaxVersionByVersionNo(HashMap map) throws Exception {
		Object obj=getSqlMapClient().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectFormFrameMaxVersionByVersionNo", map);
		if(obj==null){
			return 0;
		}
		return (Integer)obj;
	}

	/*
	 * formType
	 */
	public int selectFormFrameMaxVersionByFormType(HashMap map) throws Exception {
		Object obj=getSqlMapClient().queryForObject("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectFormFrameMaxVersionByFormType", map);
		if(obj==null){
			return 0;
		}
		return (Integer)obj;
	}

	/*
	 * formType
	 */
	public List<FormFrame> selectFormFrameModelListByFormType(HashMap map) throws Exception {
		List<FormFrame> list=getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectFormFrameModelListByFormType", map);
		if(list.size()==0){
			return null;
		}
		return list; 
	}

	/*
	 * formType
	 * frameModel
	 */
	public List<FormFrame> selectFormFrameListByFormTypeFrameModel(HashMap map) throws Exception {
		List<FormFrame> list=getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectFormFrameListByFormTypeFrameModel", map);
		if(list.size()==0){
			return null;
		}
		return list; 
	}

	/*
	 * formType
	 * frameModel
	 */
	public List<FormFrame> selectFormFrameListMaxTsByFormType(String[] formTypeArr) throws Exception {
		List<FormFrame> list=getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectFormFrameListMaxTsByFormType", formTypeArr);
		if(list.size()==0){
			return null;
		}
		return list; 
	}

    @Override
    public List<FormFrame> selectFormFrameListVersionByFormType(HashMap map) throws Exception {

        return  getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectFormFrameListVersionByFormType", map);
    }

    @Override
    public List<FormFrame> selectAllFormFrameByFormType(HashMap map) throws Exception {
        return getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectAllFormFrameByFormType", map);
    }

    /*
	 * formType
	 * ts
	 */
	public List<FormFrame> selectFormFrameListByFormTypeTs(Map map) throws Exception {
		List<FormFrame> list=getSqlMapClient().queryForList("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.selectFormFrameListByFormTypeTs", map);
		if(list.size()==0){
			return null;
		}
		return list;
	}

	/*
	 * formType
	 * frameModel
	 * version
	 */
	public void deleteFormFrameByFormTypeFrameModelVersion(FormFrame FormFrame) throws Exception {
		getSqlMapClient().delete("com.inqgen.nursing.dynamic.form.dao.FormFrameDao.deleteFormFrameByFormTypeFrameModelVersion", FormFrame);
	}

}
