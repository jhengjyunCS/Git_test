package com.inqgen.nursing.dynamic.form.dao;

import com.inqgen.nursing.dynamic.form.bean.Form;
import com.inqgen.nursing.dynamic.form.bean.FormItem;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface FormDao {
	
	public void insertForm(Form form);
	public void insertFormItem(ArrayList<FormItem> formItems);
	public void addOrUpdate(String id, Form form, ArrayList<FormItem> formItems)throws SQLException;
	public void addOrUpdate2(String id, Form form, ArrayList<FormItem> formItems) throws SQLException;
	public Form selectFormById(String id);
	/**
	 *
	 * @param map
	 *   [encId]
	 *   [formType],
	 *   [formModel]
	 *   [beginDate]
	 *   [endDate]
	 *
	 * @return
	 */
	public Object[] selectFromByMap(HashMap map);

	public Object[] selectFromByMapSign(HashMap map);

	/**
	 * 通過條件查詢表單主信息
	 * @param map
	 * @return
	 */
	public ArrayList<Form> queryFormByPros(HashMap map);

	public List<Form> selectFormForWS(Map map);
	public String selectLastFormId(Map map) throws SQLException;
	
	/**查詢動態表單,供PDA使用***/
	public List<Form> selectFormToOem(Map map);

	public void deleteForm(String Id);



	public void deleteFormMoniterNurseById(String id);


	public void deleteMoniterLogById(String id);

	public void deleteFormCheckMoniterById(String id);


	public HashMap getRegistrationPressureData(HashMap map);
	public List selectRegistrationPressureToReport(HashMap map);
	public void updateRegistrationPressure(HashMap map);


	public HashMap getRegistrationFallData(HashMap map);
	public void updateRegistrationFall(HashMap map);

	public HashMap getRegistrationTubeData(HashMap map);
	public void updateRegistrationTube(HashMap map);

	public List selectForm2(HashMap map);

	public void cancelStopMonitorTable(String id);

	public List selectFormMoniterNurseToWorkList(HashMap map);

	public List<String> selectFormToWorkList(HashMap map);

	public List<String> selectFormToWorkListOracle(HashMap map);

	public List<Form> selectFormToKardex(HashMap map);

	public Form getLastForm(String formTypes, String encId);
	
	/***查詢最後一次增加的資料,新增時帶入資料**/
	public String getLastAddFormDitto(HashMap map) throws SQLException;
	/**
	 * 最後一次入院評估（兒童）的體重
	 * @param param
	 * @return
	 */
	public String getLastCbwByParam(HashMap<String, Object> param);
	public List<FormItem> getFormItemForBMIScore(HashMap map)throws SQLException ;
	public Form getFormById(String id);
	
	/**
	 * 通過表單類型和時間刪除表單
	 * @throws Exception
	 */
	public void deleteFormByType(HashMap<String, Object> param) throws Exception;
	
	public List<Form> selectFormByTypes(HashMap<String, Object> map);
	//鎮靜評估
	public List queryFormByCalm(HashMap map);
	public Object[] selectFromByCalm(HashMap map);
	//取跌倒壓力性損傷分數
	public List<Form> getScoresForRecordList(HashMap map);
	//獲取表單的數量
	public String getFormCount(HashMap map);
}
