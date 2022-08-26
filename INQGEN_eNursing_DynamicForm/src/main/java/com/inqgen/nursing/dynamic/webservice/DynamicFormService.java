package com.inqgen.nursing.dynamic.webservice;

import com.inqgen.nursing.dynamic.form.bean.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public interface DynamicFormService {


    /**
     * 查詢動態表單
     **/
    public List<Form> getDynamicFormByEncIdV3(String encId, String formModel, Boolean hasContent) throws Exception;

    /**
     * 查詢動態表單(最後一筆)
     **/
    public List<Form> getLastDynamicFormByEncIdV3(String encId, String formModel, Boolean hasContent) throws Exception;

    /**
     * 新增formFrame
     **/
    public void addFormFrame(FormFrame frame) throws Exception;

    /**
     * 覆蓋formFrame
     *
     * @param frame
     * @return
     * @throws Exception
     **/
    public void updateFormFrameByFormTypeFrameModelVesion(FormFrame frame) throws Exception;

    /**
     * 同步formFrame (先delete再insert)
     *
     * @param frame
     * @return
     * @throws Exception
     **/
    public void syncFormFrame(FormFrame frame) throws Exception;

    /**
     * 查詢動態表單 最新版的formFrame (依據formType、frameModel)
     **/
    public FormFrame getCurrDynamicFormFrameByformTypeFrameModel(String formType, String frameModel) throws Exception;

    /**
     * 查詢動態表單 最新版的formFrame (依據formType、frameModel、versionNo)
     **/
    public FormFrame getDynamicFormFrameByformTypeFrameModelVersionNo(String formType, String frameModel, int versionNo) throws Exception;

    /**
     * 查詢動態表單 最大版號versionNo (依據formType)
     **/
    public int getDynamicFormMaxVersionNoByformType(String formType) throws Exception;

    /**
     * 查詢動態表單 frameModel的清單 (依據formType)
     **/
    public List<FormFrame> getDynamicFormFrameModelListByformType(String formType) throws Exception;

    /**
     * 查詢動態表單 frame的清單 (依據formType、frameModel)
     **/
    public List<FormFrame> getDynamicFormFrameListByformTypeFrameModel(String formType, String frameModel) throws Exception;

    /**
     * 獲取動態表單 frame差異資料 (根據List(FormVersion) -- formType,ts)
     **/
    public List<FormFrame> getDynamicFormFrameListByformTypeTs(List<FormVersion> versions, Boolean isLastFormFrame) throws Exception;
    
    /**
     * 增加或更新動態表單
     *
     * @return  返回分數 如果返回為NULL  則不需要增加匯報表
     **/
    public String addOrUpdateDynamicForm(String id, Form form, ArrayList<FormItem> formItems) throws Exception;

    /**
     * 刪除動態表單
     **/
    public void deleteDynamicForm(String id) throws Exception;

    /**
     * 新增formVersion
     *
     * @param version
     * @return
     * @throws Exception
     **/
    public void addFormVersion(FormVersion version) throws Exception;

    /**
     * 覆蓋formVersion
     *
     * @param version
     * @return
     * @throws Exception
     **/
    public void updateFormVersionByFormTypeFormModelVersion(FormVersion version) throws Exception;

    /**
     * 同步formVersion (先delete再insert)
     *
     * @param version
     * @return
     * @throws Exception
     **/
    public void syncFormVersion(FormVersion version) throws Exception;

    /**
     * 獲取評估單表,獲取當前最新版本模版
     *
     * @param formModel
     * @return
     * @throws Exception
     */
    public DynamicFormTemplate getCurrDynamicFormTemplateV3(String formModel) throws Exception;

    /**
     * 獲取模版所有清單
     *
     * @return
     * @throws Exception
     */
    public List<FormVersion> getFormVersionAllList() throws Exception;

    /**
     * 獲取模版最大版號 (根據formType)
     *
     * @param formTypeArr
     * @return
     * @throws Exception
     */
    public List<FormVersion> getFormVersionListMaxTsByFormType(String[] formTypeArr) throws Exception;

    /**
     * 獲取模版差異資料 (根據List(FormVersion) -- formType,ts)
     *
     * @param version
     * @return
     * @throws Exception
     */
    public List<FormVersion> getFormVersionListByFormTypeTs(List<FormVersion> version, Boolean isLastFormVersion) throws Exception;

    /**
     * 根據 FormType,獲取該模版的清單
     *
     * @param formType
     * @return
     * @throws Exception
     */
    public List<FormVersion> getFormVersionListByFormType(String formType) throws Exception;

    /**
     * 根據FormType,versionNo 獲取模版
     *
     * @return
     * @throws Exception
     */
    public FormVersion getFormVersionByFormTypeVersionNo(String formType, int versionNo) throws Exception;

    /**
     * 根據content 重新讀取xml轉換為 DynamicFormTemplate
     *
     * @return
     * @throws Exception
     */
    public DynamicFormTemplate getDynamicFormTemplateByContent(String content) throws Exception;

    /**
     * 根據 FormModel, versionNo版本號 獲取模版
     *
     * @param versionNo 版號
     * @return
     * @throws Exception
     */
    public DynamicFormTemplate getDynamicFormTemplateByFormModelVersionNo(String formModel, int versionNo) throws Exception;


    public List<GForm> getGFormList(String formType, String sourceId);
    public List<GForm> getGFormListBySourceIds(String formType, String[] sourceIds);
    public List<GForm> getGFormListBySourceIdsGroupOne(String formType, String[] sourceIds, String itemKey, String[] itemKeys);

    /*
     * String formType (必要)
     * String sourceId (非必要，與sourceIds擇一)
     * String[] sourceIds (非必要，與sourceId擇一)
     * String formId
     * Date beginDate (evaluationTime)
     * Date endDate (evaluationTime)
     * String beginTotalScore (totalScore)
     * String endTotalScore (totalScore)
     * Date beginCreateTime (createTime)
     * Date endCreateTime (createTime)
     * String status (Y N D)
     * String[] statusArr (Y,N,D)
     * String modifyUserId
     * String modifyUserName
     * Date beginModifyTime (modifyTime)
     * Date endModifyTime (modifyTime)
     * int beginVersionNo (versionNo)
     * int endVersionNo (versionNo)
     * 
     * String itemCondition (ex. (itemkey='pt_code' AND itemvalue = '') OR (itemkey='site' AND itemvalue = '700') )
     * int itemConditionHitCounts (至少命中幾項)
     * 
     * Boolean hasContent (是否查詢Gform的content欄位)
     * 
     * @param SearchParamGF
     * @author JhengJyun
     * @date 2019/7/3 15:23
     */
    public List<GForm> getGFormListWithCondition(SearchParamGF searchParamGF);
    
    /*
     * String formType (必要)
     * String sourceId (非必要，與sourceIds擇一)
     * String[] sourceIds (非必要，與sourceId擇一)
     * String formId
     * Date beginDate (evaluationTime)
     * Date endDate (evaluationTime)
     * String beginTotalScore (totalScore)
     * String endTotalScore (totalScore)
     * Date beginCreateTime (createTime)
     * Date endCreateTime (createTime)
     * String status (Y N D)
     * String[] statusArr (Y,N,D)
     * String modifyUserId
     * String modifyUserName
     * Date beginModifyTime (modifyTime)
     * Date endModifyTime (modifyTime)
     * int beginVersionNo (versionNo)
     * int endVersionNo (versionNo)
     * 
     * String itemCondition (ex. (itemkey='pt_code' AND itemvalue = '') OR (itemkey='site' AND itemvalue = '700') )
     * int itemConditionHitCounts (至少命中幾項)
     * 
     * ##在plus中已經拿掉，一律查詢content欄位
     * Boolean hasContent (是否查詢Gform的content欄位)
     * 
     * 查詢sql第n筆~第m筆
     * 從 beginIndex 開始查 counts筆
     * 僅限 getGFormListWithConditionPlus()
     * String counts; //查詢c筆
     * String beginIndex; //從第n筆開始查
     * String endIndex; //(nis websevices程式自動計算) =beginIndex + counts
     * 
     * @param SearchParamGF
     * @author JhengJyun
     * @date 2019/7/3 15:23
     */
    public List<GForm> getGFormListWithConditionPlus(SearchParamGF searchParamGF);

    public GForm getSingleGForm(String formType, String formId);

    public GForm getSingleGFormByUniqueItem(String formType, String itemKey, String itemValue);

    public String checkExistsGFormItem(String itemKey, String itemValue, String formType);

    /**
     * 新增或更新
     *
     * @param gForm: gForm.formId為空時新增，gForm.fromId不爲空時更新
     * @author RainKing
     * @date 2019/5/17 9:47
     */
    public GForm addOrUpdateGForm(GForm gForm, String sourceId) throws Exception;

    public void deleteGForm(String oldFormId, String sourceId) throws SQLException;
    public List<GForm> getGFormList(String formType, String sourceId,Boolean hasContent);
    public List<GForm> getLastGFormList(String formType, String sourceId,Boolean hasContent);
    public GForm getSingleGForm(String formType, String formId,Boolean hasContent);

    public GForm autoProcessGFormData(String json) throws Exception;

    public GForm getExtendGFormData(String json) throws Exception;

    public List<GForm> getExtendGFormList(String json) throws Exception;

    public String uploadToMergerGform(byte[] fileData,String statusIfError);

    public byte[] downLoadGformToFile(SearchParamGF searchParamGF);

    public byte[] downLoadGformToFile_byGetExtendGFormList(String json) throws Exception;

    public String checkPermissions(String json);

    /**
     * 查詢表單所有的版本號
     * @param formType
     * @param ts
     * @return
     * @throws Exception
     */
    public List<FormFrame> selectGFormListVersions(String formType, Date ts) throws Exception;;
    public List<FormFrame> selectAllFormFrameByFormType(String formType, Date ts) throws Exception;;
    public  List<FormVersionToTemp>  selectAllFormVersionFormType(String formType, Date ts) throws Exception;

    /**
     * 傳入表單類型，將JSP轉至成HTML供工具二次加工。為舊版動態表單特別書寫
     * @param formType
     * @return
     * @throws Exception
     */
    public String getCustomFormJsp(String formType)throws Exception;

    /**
     * 将工具加工好的JSP打印页，回写至项目JSP
     * @param json
     * @throws Exception
     */
    public void updateCustomFormJsp(String json) throws Exception;
}