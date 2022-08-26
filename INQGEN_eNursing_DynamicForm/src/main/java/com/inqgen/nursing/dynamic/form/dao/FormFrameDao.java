package com.inqgen.nursing.dynamic.form.dao;

import com.inqgen.nursing.dynamic.form.bean.FormFrame;

import java.util.HashMap;
import java.util.List;

public interface FormFrameDao {
	public void addFormFrame(FormFrame frame) throws Exception;
	public void updateFormFrameByFormTypeFrameModelVesion(FormFrame frame) throws Exception;
	public FormFrame selectFormFrame(HashMap map) throws Exception;
	public int selectFormFrameMaxVersion(HashMap map) throws Exception;
	public int selectFormFrameMaxVersionByVersionNo(HashMap map) throws Exception;
	public int selectFormFrameMaxVersionByFormType(HashMap map) throws Exception;
	public List<FormFrame> selectFormFrameModelListByFormType(HashMap map) throws Exception;
	public List<FormFrame> selectFormFrameListByFormTypeFrameModel(HashMap map) throws Exception;
    public List<FormFrame> selectFormFrameListMaxTsByFormType(String[] formTypeArr) throws Exception;
    public List<FormFrame> selectFormFrameListVersionByFormType(HashMap map) throws Exception;
    public List<FormFrame> selectAllFormFrameByFormType(HashMap map) throws Exception;

}
