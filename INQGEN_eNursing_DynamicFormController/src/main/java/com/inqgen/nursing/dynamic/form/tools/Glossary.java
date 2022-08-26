package com.inqgen.nursing.dynamic.form.tools;
/**
 * 用來定義護理站系統使用的參數
 * @author Alice Wang
 *
 */
public interface Glossary
{
	/** 目前所使用的護理站物件 代碼 */
	public static final String KEY_STATION = "selectStation";
	/** 目前所使用的病患物件 代碼 */
	public static final String KEY_PATIENT = "selectPatient";
	/** 目前所選取病人所在護理站物件 代碼 */
	public static final String KEY_PATIENT_STATION = "selectPatientStation";
	/** 目前所選取病人所在科別物件 代碼 */
	public static final String KEY_PATIENT_SECTION = "selectPatientSection";
	/** 目前所選取病人所在床位物件 代碼 */
	public static final String KEY_PATIENT_BED = "selectPatientBed";
	/** 目前所使用的就診記錄物件 代碼 */
	public static final String KEY_ENCOUNTER = "selectEncounter";
	/** 目前登入的使用者 Actor 物件  */
	public static final String KEY_ACTOR = "loginActor";
	/** 目前使用者所設定可以使用的護理站物件清單 代碼 */
	public static final String KEY_ACTOR_STATION = "login.Actor.Station";
	/** 目前使用者所指定院區 代碼 */
	public static final String KEY_ACTOR_ZONE = "login.Actor.Zone";
	/** 選取所有的護理站代碼 */
	public static final String RANGE_ALL_STATION = "ALL_STATION";

	// --- Defined by Alan
	/**護理計劃診斷其他項目代碼前置詞*/
	public static final String PLAN_DIAG_OTHER_PRFIX = "D";
	/**護理計劃措施項目代碼前置詞*/
	public static final String PLAN_DIAG_MEASURE_PRFIX = "M";
	/**護理計劃目定義特征他項目代碼前置詞*/
	public static final String PLAN_DIAG_DEF_PRFIX = "E";
	/**護理計劃導因其他項目代碼前置詞*/
	public static final String PLAN_DIAG_CAUSE_PRFIX = "C";
	/**護理計劃目標其他項目代碼前置詞*/
	public static final String PLAN_DIAG_GOAL_PRFIX = "G";
	/**護理計劃措施及衛教其他項目代碼前置詞*/
	public static final String PLAN_DIAG_INTERVEN_PRFIX = "I";
	//	--- Defined by Alan
}
