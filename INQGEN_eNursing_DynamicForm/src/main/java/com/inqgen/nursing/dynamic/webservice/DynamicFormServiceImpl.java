package com.inqgen.nursing.dynamic.webservice;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fto.m2.M2Servlet;
import com.fto.m2.service.auth.NameAndComment;
import com.fto.m2.service.auth.ResourceManageService;
import com.fto.m2.service.org.OrgService;
import com.fto.m2.service.org.User;
import com.fto.m2.service.security.MemberConnection;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.inqgen.nursing.base.SpringWebApp;
import com.inqgen.nursing.dynamic.form.bean.*;
import com.inqgen.nursing.dynamic.form.bean.comparison.GFormComparison;
import com.inqgen.nursing.dynamic.form.bean.db.*;
import com.inqgen.nursing.dynamic.form.dao.FormDao;
import com.inqgen.nursing.dynamic.form.dao.FormVersionDao;
import com.inqgen.nursing.dynamic.form.dao.impl.FormDaoImpl;
import com.inqgen.nursing.dynamic.form.dao.impl.FormFrameDaoImpl;
import com.inqgen.nursing.dynamic.form.dao.impl.FormVersionDaoImpl;
import com.inqgen.nursing.dynamic.form.dao.impl.GFormDaoImpl;
import com.inqgen.nursing.hibernate.ejb.packaging.PersistenceMetadata;
import com.inqgen.nursing.jdbc.core.ColumnMapRowMapper;
import com.inqgen.nursing.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import com.inqgen.nursing.poi.ValueComment;
import com.inqgen.nursing.service.customFrom.CustomFormService;
import com.inqgen.nursing.service.impl.customFrom.CustomFormServiceImpl;
import com.inqgen.nursing.utils.*;
import com.thoughtworks.xstream.XStream;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellReference;
import org.springframework.jndi.JndiTemplate;

import javax.naming.NamingException;
import javax.script.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.alibaba.fastjson.serializer.SerializerFeature.WriteMapNullValue;
import static com.inqgen.nursing.utils.JsonUtils.processJSONFromAttrPath;


public class DynamicFormServiceImpl implements DynamicFormService {
	public static HashMap<String, CompiledScript> scriptMap=new HashMap<String, CompiledScript>();
	public static String basicGroovy=null;


    public void addFormVersion(FormVersion version) throws Exception {
        if (version == null) {
            throw new Exception("version is null");
        }
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        versionDaoImpl.addOrUpdate(version);
    }

    public void updateFormVersionByFormTypeFormModelVersion(FormVersion version) throws Exception {
        if (version == null) {
            throw new Exception("version is null");
        }
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        versionDaoImpl.updateFormVersionByFormTypeFormModelVersion(version);
    }

    public void syncFormVersion(FormVersion version) throws Exception {
        if (version == null) {
            throw new Exception("version is null");
        }
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        versionDaoImpl.deleteFormVersionListByFormTypeVersion(version);
        versionDaoImpl.addOrUpdate(version);
    }


    public DynamicFormTemplate getCurrDynamicFormTemplateV3(String formModel) throws Exception {
        if (formModel == null) {
            return null;
        }
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        HashMap map = new HashMap();
        map.put("formType", formModel);
        map.put("formModel", formModel);
        int version = versionDaoImpl.selectMaxFormVersion(formModel);
        map.put("version", version);
        FormVersion formVersion = versionDaoImpl.selectFormVersion(map);
        return FormUtils.getFormTemplate(formVersion);

    }

    public List<FormVersion> getFormVersionAllList() throws Exception {
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        List<FormVersion> list = versionDaoImpl.selectFormVersionAllList();
        return list;
    }

    public List<FormVersion> getFormVersionListMaxTsByFormType(String[] formTypeArr) throws Exception {
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        List<FormVersion> vList = versionDaoImpl.selectFormVersionListMaxTsByFormType(formTypeArr);
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        List<FormFrame> fList = frameDaoImpl.selectFormFrameListMaxTsByFormType(formTypeArr);

        List<FormVersion> list = new ArrayList();
        Map<String, Timestamp> rows = new HashMap();
        Timestamp ts;
        if (vList != null) {
            //1. 沒有formType就存起來
            //2. 比較ts，儲存較大者
            for (int i = 0; i < vList.size(); i++) {
                ts = rows.get(vList.get(i).getFormType());
                if (ts == null) {
                    rows.put(vList.get(i).getFormType(), vList.get(i).getTs());
                } else if (ts.before(fList.get(i).getTs())) {
                    rows.put(vList.get(i).getFormType(), vList.get(i).getTs());
                }
            }
        }
        if (fList != null) {
            //1. 沒有formType就存起來
            //2. 比較ts，儲存較大者
            for (int i = 0; i < fList.size(); i++) {
                ts = rows.get(fList.get(i).getFormType());
                if (ts == null) {
                    rows.put(fList.get(i).getFormType(), fList.get(i).getTs());
                } else if (ts.before(fList.get(i).getTs())) {
                    rows.put(fList.get(i).getFormType(), fList.get(i).getTs());
                }
            }

        }
        FormVersion version = null;
        for (Map.Entry<String, Timestamp> entry : rows.entrySet()) {
            version = new FormVersion();
            version.setFormType(entry.getKey());
            version.setTs(entry.getValue());
            list.add(version);
        }

        return list;
    }

    public List<FormVersion> getFormVersionListByFormTypeTs(List<FormVersion> version, Boolean isLastFormVersion) throws Exception {
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");

        Map[] versions = new Map[version.size()];
        for (int i = 0, len = version.size(); i<len; ++i){
        	FormVersion fromVersion = version.get(i);
            Map<String, Object> vs = new HashMap<String, Object>();
        	vs.put("formType", fromVersion.getFormType());
        	vs.put("ts", fromVersion.getTs());
        	versions[i] = vs;
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("isLastFormVersion", isLastFormVersion);
        map.put("versions", versions);
        List<FormVersion> list = versionDaoImpl.selectFormVersionListByFormTypeTs(map);
        return list;
    }

    public List<FormVersion> getFormVersionListByFormType(String formType) throws Exception {
        if (formType == null) {
            return null;
        }
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        List<FormVersion> list = versionDaoImpl.selectFormVersionListByFormType(formType);
        return list;

    }

    public FormVersion getFormVersionByFormTypeVersionNo(String formType, int versionNo) throws Exception {
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        HashMap map = new HashMap();
        map.put("formType", formType);
        map.put("formModel", formType);
        map.put("versionNo", versionNo);
        FormVersion formVersion = versionDaoImpl.selectFormVersionByFormModelVersionNo(map);
        return formVersion;

    }

    public DynamicFormTemplate getDynamicFormTemplateByContent(String content) throws Exception {
        if (content == null) return null;
        DynamicFormTemplate formTemplate = FormUtils.getFormTemplate(content);
        formTemplate.setFormVersionId(UUID.randomUUID().toString());
        return formTemplate;
    }

    public DynamicFormTemplate getDynamicFormTemplateByFormModelVersionNo(String formModel, int versionNo) throws Exception {
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("formType", formModel);
        map.put("formModel", formModel);
        map.put("versionNo", versionNo);
        FormVersion formVersion = versionDaoImpl.selectFormVersionByFormModelVersionNo(map);
        return FormUtils.getFormTemplate(formVersion);
    }


    public List<Form> getDynamicFormByEncIdV3(String encId, String formModel, Boolean hasContent) throws Exception {
        FormDaoImpl formDaoImpl = SpringWebApp.getObjectFromName("formDao");
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("encId", encId);
        map.put("formType", formModel);
        map.put("formModel", formModel);
        if (hasContent) {
            map.put("hasContent", hasContent);
        }
        List<Form> list = formDaoImpl.selectFormForWS(map);
        List<Form> list2 = new ArrayList<Form>();
        for (Form form : list) {
        	if (hasContent){
        		if (form.getContent()==null){
        			map.remove("hasContent");
        			map.put("formId", form.getFormId());
        			form = (formDaoImpl.selectFormForWS(map)).get(0);
        		}
        	}
            List<FormItem> formItemList = form.getItems();
            if (formItemList != null) {
                Map<String, FormItem> formItemMap = new HashMap<String, FormItem>();
                for (FormItem formItem : formItemList) {
                    formItemMap.put(formItem.getItemKey(), formItem);
                }
                form.setFormItems(formItemMap);
            }
            list2.add(form);
        }
        return list2;
    }

    public List<Form> getLastDynamicFormByEncIdV3(String encId, String formModel, Boolean hasContent) throws Exception {
        FormDaoImpl formDaoImpl = SpringWebApp.getObjectFromName("formDao");
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("encId", encId);
        map.put("formType", formModel);
        map.put("formModel", formModel);
        if (hasContent) {
            map.put("hasContent", hasContent);
        }
        map.put("formId", formDaoImpl.selectLastFormId(map));
        List<Form> list = formDaoImpl.selectFormForWS(map);
        List<Form> list2 = new ArrayList<Form>();
        for (Form form : list) {
        	if (hasContent){
        		if (form.getContent()==null){
        			map.remove("hasContent");
        			map.put("formId", form.getFormId());
        			form = (formDaoImpl.selectFormForWS(map)).get(0);
        		}
        	}
            List<FormItem> formItemList = form.getItems();
            if (formItemList != null) {
                Map<String, FormItem> formItemMap = new HashMap<String, FormItem>();
                for (FormItem formItem : formItemList) {
                    formItemMap.put(formItem.getItemKey(), formItem);
                }
                form.setFormItems(formItemMap);
            }
            list2.add(form);
        }
        return list2;
    }

    public void addFormFrame(FormFrame frame) throws Exception {
        if (frame == null) {
            throw null;
        }
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        frameDaoImpl.addFormFrame(frame);
    }

    public void updateFormFrameByFormTypeFrameModelVesion(FormFrame frame) throws Exception {
        if (frame == null) {
            throw null;
        }
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        frameDaoImpl.updateFormFrameByFormTypeFrameModelVesion(frame);
    }

    public void syncFormFrame(FormFrame frame) throws Exception {
        if (frame == null) {
            throw null;
        }
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        frameDaoImpl.deleteFormFrameByFormTypeFrameModelVersion(frame);
        frameDaoImpl.addFormFrame(frame);
    }

    public FormFrame getCurrDynamicFormFrameByformTypeFrameModel(String formType, String frameModel) throws Exception {
        if (formType == null || frameModel == null) {
            return null;
        }
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        HashMap map = new HashMap();
        map.put("formType", formType);
        map.put("frameModel", frameModel);
        int version = frameDaoImpl.selectFormFrameMaxVersion(map);
        map.put("version", version);
        FormFrame formFrame = frameDaoImpl.selectFormFrame(map);
        if (formFrame == null) {
            return null;
        }
        int newVersionNo = getDynamicFormMaxVersionNoByformType(formType);
        formFrame.setNewVersionNo(newVersionNo);
        return formFrame;
    }

    public FormFrame getDynamicFormFrameByformTypeFrameModelVersionNo(String formType, String frameModel, int versionNo) throws Exception {
        if (formType == null || frameModel == null) {
            return null;
        }
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        HashMap map = new HashMap();
        map.put("formType", formType);
        map.put("frameModel", frameModel);
        map.put("versionNo", versionNo);
        int version = frameDaoImpl.selectFormFrameMaxVersionByVersionNo(map);
        map.put("version", version);
        FormFrame formFrame = frameDaoImpl.selectFormFrame(map);
        if (formFrame == null) {
            return null;
        }
        int newVersionNo = getDynamicFormMaxVersionNoByformType(formType);
        formFrame.setNewVersionNo(newVersionNo);
        return formFrame;
    }

    public int getDynamicFormMaxVersionNoByformType(String formType) throws Exception {
        if (formType == null) {
            return 0;
        }
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        HashMap map = new HashMap();
        map.put("formType", formType);
        int frameVersion = frameDaoImpl.selectFormFrameMaxVersionByFormType(map);

        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        int xmlVersion = versionDaoImpl.selectMaxFormVersion(formType);

        int version = (frameVersion > xmlVersion) ? frameVersion : xmlVersion;
        return version;
    }

    public List<FormFrame> getDynamicFormFrameModelListByformType(String formType) throws Exception {
        if (formType == null) {
            return null;
        }
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        HashMap map = new HashMap();
        map.put("formType", formType);
        List<FormFrame> list = frameDaoImpl.selectFormFrameModelListByFormType(map);
        return list;
    }

    public List<FormFrame> getDynamicFormFrameListByformTypeFrameModel(String formType, String frameModel) throws Exception {
        if (formType == null || frameModel == null) {
            return null;
        }
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        HashMap map = new HashMap();
        map.put("formType", formType);
        map.put("frameModel", frameModel);
        List<FormFrame> list = frameDaoImpl.selectFormFrameListByFormTypeFrameModel(map);
        return list;
    }


    public List<FormFrame> getDynamicFormFrameListByformTypeTs(List<FormVersion> version, Boolean isLastFormFrame) throws Exception {
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");

        Map[] versions = new Map[version.size()];
        for (int i = 0, len = version.size(); i<len; ++i){
        	FormVersion fromVersion = version.get(i);
            Map<String, Object> vs = new HashMap<String, Object>();
        	vs.put("formType", fromVersion.getFormType());
        	vs.put("ts", fromVersion.getTs());
        	versions[i] = vs;
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("isLastFormFrame", isLastFormFrame);
        map.put("versions", versions);
        List<FormFrame> list = frameDaoImpl.selectFormFrameListByFormTypeTs(map);
        return list;
    }

    public String addOrUpdateDynamicForm(String id, Form form, ArrayList<FormItem> formItems) throws Exception {
        FormDao formDaoImpl = SpringWebApp.getObjectFromName("formDao");
        formDaoImpl.addOrUpdate2(id, form, formItems);
        return null;

    }

    public void deleteDynamicForm(String id) throws Exception {
        FormDaoImpl formDaoImpl = SpringWebApp.getObjectFromName("formDao");
		/*CaService caService=CaService.getInstance(M2Servlet.getInstance());
		Form form= formDaoImpl.getFormById(id);
		if(form!=null)
		{
			caService.deleteForm(form.getPatientId(), form.getEncId(), id, form.getFormType(), form.getFormModel());
		}*/
        formDaoImpl.deleteForm(id);
    }


    public List<GForm> getGFormList(String formType, String sourceId) {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("formType", formType);
        map.put("sourceId", sourceId);
        return GFormComparison.setGFormComparison(formDao.selectFormWithItems(map));
    }

    public List<GForm> getGFormListBySourceIds(String formType, String[] sourceIds) {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("formType", formType);
        map.put("sourceIds", sourceIds);
        return GFormComparison.setGFormComparison(formDao.selectFormWithItems(map));
    }

    @Override
    public List<GForm> getGFormListBySourceIdsGroupOne(String formType, String[] sourceIds, String itemKey, String[] itemKeys) {
        if(StringUtils.isBlank(formType) || sourceIds == null || sourceIds.length<1){
            return null;
        }
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("formType", formType);
        map.put("sourceIds", sourceIds);
        map.put("isGroupOne", "Y");
        if(StringUtils.isNotBlank(itemKey)){
            map.put("itemKey", itemKey);
        }
        if(itemKeys!=null && itemKeys.length>0){
            map.put("itemKeys", itemKeys);
        }
        return GFormComparison.setGFormComparison(formDao.getGFormListBySourceIdsGroupOne(map));
    }

    public List<GForm> getGFormList(String formType, String sourceId, Boolean hasContent) {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("formType", formType);
        map.put("sourceId", sourceId);
        if (hasContent) {
            map.put("hasContent", hasContent);
        }
        return GFormComparison.setGFormComparison(formDao.selectFormWithItems(map));
    }

    public List<GForm> getLastGFormList(String formType, String sourceId, Boolean hasContent){
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("formType", formType);
        map.put("sourceId", sourceId);
        if (hasContent) {
            map.put("hasContent", hasContent);
        }
        map.put("status","Y");//帶入最後一次正式存檔記錄
//        map.put("formId", formDao.selectLastGFormId(map));
        ArrayList<GForm> gForms = new ArrayList<GForm>();
        GForm gForm = formDao.selectLastGformWithItems(map);
        if (gForm != null) {
            gForms.add(gForm);
        }
        return GFormComparison.setGFormComparison(gForms);
    }

    public List<GForm> getGFormListWithCondition(SearchParamGF searchParamGF) {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        if (searchParamGF.getSourceId() != null) {
            searchParamGF.setHasSourceId(true);
        }
        if (searchParamGF.getSourceIds() != null && searchParamGF.getSourceIds().length > 0) {
            searchParamGF.setHasSourceIds(true);
        }
        if (searchParamGF.getStatus() == null && searchParamGF.getStatusArr() == null) {
            searchParamGF.setStatusArr(new String[]{"Y", "N"});
        }
        if (searchParamGF.getBeginVersionNo() == 0 && searchParamGF.getEndVersionNo() == 0) {
            searchParamGF.setEndVersionNo(99998);
        }
        return GFormComparison.setGFormComparison(formDao.selectGFormListWithCondition(searchParamGF));
    }

    public List<GForm> getGFormListWithConditionPlus(SearchParamGF searchParamGF) {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        List<GForm> gformList;
        if (searchParamGF.getSourceId() != null) {
            searchParamGF.setHasSourceId(true);
        }
        if (searchParamGF.getSourceIds() != null && searchParamGF.getSourceIds().length > 0) {
            searchParamGF.setHasSourceIds(true);
        }
        if (searchParamGF.getStatus() == null && searchParamGF.getStatusArr() == null) {
            searchParamGF.setStatusArr(new String[]{"Y", "N"});
        }
        if (searchParamGF.getBeginVersionNo() == 0 && searchParamGF.getEndVersionNo() == 0) {
            searchParamGF.setEndVersionNo(99998);
        }
        //計算 查詢第n筆~第m筆
        //n=beginIndex, m=n+counts
        //counts有值才需要計算
    	searchParamGF.setQueryTotalCounts(false);
        if (searchParamGF.getCounts() != null) {
        	if (searchParamGF.getBeginIndex() == null){
        		searchParamGF.setBeginIndex("1");
        	}
        	int begin = Integer.parseInt(searchParamGF.getBeginIndex());
        	int count = Integer.parseInt(searchParamGF.getCounts());
    		searchParamGF.setEndIndex(Integer.toString(begin+count-1));
        }else{
    		searchParamGF.setCounts(null);
    		searchParamGF.setBeginIndex(null);
    		searchParamGF.setEndIndex(null);
        }

        gformList = formDao.selectGFormListWithConditionPlus(searchParamGF);

    	//取得 totalCounts;
        String totalCounts = "-1";
        if (searchParamGF.getCounts() != null) {
        	if (gformList.size()>0){
            	searchParamGF.setQueryTotalCounts(true);
            	List<GForm> list = formDao.selectGFormListWithConditionPlus(searchParamGF);
            	totalCounts = list.get(0).getTotalCounts();
        	}
        }
    	//設定 totalCounts;
    	if (gformList.size()>0){
        	GForm gform = gformList.get(0);
        	gform.setTotalCounts(totalCounts);
        	gformList.set(0, gform);
    	}
        return GFormComparison.setGFormComparison(gformList);
    }

    public GForm getSingleGForm(String formType, String formId) {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, String> map = new HashMap<String, String>();
        map.put("formType", formType);
        map.put("formId", formId);
        return GFormComparison.setGFormComparison(formDao.selectFormByFormId(map));
    }

    public GForm getSingleGForm(String formType, String formId, Boolean hasContent) {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("formType", formType);
        map.put("formId", formId);
        if (hasContent) {
            map.put("hasContent", hasContent);
        }
        return GFormComparison.setGFormComparison(formDao.selectFormByFormId(map));
    }

    public GForm getSingleGFormByUniqueItem(String formType, String itemKey, String itemValue) {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, String> item = new HashMap<String, String>();
        item.put("key", itemKey);
        item.put("value", itemValue);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("formType", formType);
        map.put("items", new Map[]{item});
        return GFormComparison.setGFormComparison(formDao.getSingleGFormByUniqueItem(map));
    }

    public String checkExistsGFormItem(String itemKey, String itemValue, String formType) {
        List<GForm> gformList = getExistsGformList(itemKey, itemValue, formType);
        return gformList == null || gformList.size() == 0 ? "false" : "true";
    }

    private List<GForm> getExistsGformList(String itemKey, String itemValue, String formType) {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, String> item = new HashMap<String, String>();
        item.put("key", itemKey);
        item.put("value", itemValue);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("formType", formType);
        map.put("items", new Map[]{item});
        return GFormComparison.setGFormComparison(formDao.selectFormAutoItems(map));
    }

    /**
     * 新增或更新
     *
     * @param gForm: gForm.formId為空時新增，gForm.fromId不爲空時更新
     * @author RainKing
     * @date 2019/5/17 9:47
     */
    public GForm addOrUpdateGForm(GForm gForm, String sourceId) throws Exception {
        if (gForm != null) {
            String oldFormId = gForm.getFormId();
            String oldFdocId = "";
            GFormDaoImpl gFormDaoImpl = SpringWebApp.getObjectFromName("gFormDao");
            GForm oldGForm;
            String formId = FormUtils.getUUID();
            if (StringUtils.isNotBlank(oldFormId)) {//更新
                Map<String, String> map = new HashMap<String, String>();
                map.put("formType", gForm.getFormType());
                map.put("formId", oldFormId);
                oldGForm = gFormDaoImpl.selectFormByFormId(map);
                if (oldGForm != null) {
                    oldFdocId=oldGForm.getFdocId();
                    if(StringUtils.isNotBlank(oldGForm.getCreatorId())){
                        gForm.setCreatorId(oldGForm.getCreatorId());
                    }else{
                        gForm.setCreatorId(gForm.getModifyUserId());
                    }
                    if(StringUtils.isNotBlank(oldGForm.getCreatorName())){
                        gForm.setCreatorName(oldGForm.getCreatorName());
                    }else{
                        gForm.setCreatorName(gForm.getModifyUserName());
                    }
//                    gForm.setCreateTime(oldGForm.getModifyTime() == null ? oldGForm.getCreateTime() : oldGForm.getModifyTime());
                    gForm.setCreateTime(oldGForm.getCreateTime() );
                    if (StringUtils.isBlank(gForm.getFormVersionId())) {
                        gForm.setFormVersionId(oldGForm.getFormVersionId());
                    }
                    if (StringUtils.isBlank(gForm.getVersionNo())) {
                        gForm.setVersionNo(oldGForm.getVersionNo());
                    }
                    gForm.setModifyTime(new Date());
                }else{//查詢不到可能是app前端新增或更新自己產生的ID,用於離綫緩存此時應該新增
                    gForm.setCreatorId(gForm.getModifyUserId());
                    gForm.setCreatorName(gForm.getModifyUserName());
                    gForm.setCreateTime(new Date());
                    gForm.setModifyUserId(null);
                    gForm.setModifyUserName(null);
                    gForm.setModifyTime(null);
                    oldFormId=null;//再把其設為null，代表是新增
                }
            } else {
                gForm.setCreatorId(gForm.getModifyUserId());
                gForm.setCreatorName(gForm.getModifyUserName());
                gForm.setFormId(formId);
                gForm.setCreateTime(new Date());
                gForm.setModifyUserId(gForm.getCreatorId());
                gForm.setModifyUserName(gForm.getCreatorName());
                gForm.setModifyTime(gForm.getCreateTime());
            }
            gForm.setFdocId(formId);
            gForm.setSourceId(sourceId);
            gFormDaoImpl.addOrUpdateForm(oldFormId, gForm, sourceId);
            /*TODO 構造autoProcess參數 edited by RainKing at 2019/9/26 17:37*/
            JSONObject versionParamMap = new JSONObject();
            versionParamMap.put("formType", gForm.getFormType());
            versionParamMap.put("formModel", gForm.getFormType());
            versionParamMap.put("versionNo", gForm.getVersionNo());
            try {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("versionParamMap", versionParamMap);
                GFormItem action = gForm.getGformItemMap().get("gformAction");
                if (action != null&&StringUtils.isNotBlank(action.getItemValue())) {
                    jsonObject.put("action", action.getItemValue());
                }else{
                    jsonObject.put("action", StringUtils.isNotBlank(oldFormId) ? "update" : "add");
                }
                jsonObject.put("gform", gForm);
                autoProcessGFormData(jsonObject);
            } catch (Exception e) {
                PrintUtils.printByDVm(e);
            }
            /*TODO produce obj edited by RainKing at 2020/2/27 12:21*/
            try {
                FormVersionDao versionDao = SpringWebApp.getObjectFromName("formVersionDao");
                FormVersion formVersion = versionDao.selectFormVersionByFormModelVersionNo(versionParamMap);
                if (formVersion!=null) {
                    String content = formVersion.getContent();
                    if (StringUtils.isNotBlank(content)) {
                        DynamicFormTemplate formTemplate = FormUtils.getFormTemplate(content);
                        convertToObj(formTemplate, gForm,oldFormId);
                    }
                }
            } catch (Exception e) {
                PrintUtils.printByDVm(e);
            }
            /*TODO process formTemplate edited by RainKing at 2020/4/13 18:39*/
            try {
                Class<?> reportThread = Class.forName("com.report.ReportThread");
                Method processGform = reportThread.getMethod("processGform", JSONObject.class);
                JSONObject paramMap = new JSONObject();
                paramMap.put("action", StringUtils.isBlank(oldFormId) ? "add" : "update");
                paramMap.put("oldFormId", oldFormId);
                paramMap.put("oldFdocId", oldFdocId);//舊的主鍵
                paramMap.put("fDocId", gForm.getFdocId());
                paramMap.put("sourceId", gForm.getSourceId());
                paramMap.put("formType", gForm.getFormType());
                processGform.invoke(null,paramMap);
            } catch (Exception e) {
                if (!(e instanceof ClassNotFoundException)) {
                    PrintUtils.printByDVm(e);
                }
            }

            if("Y".equals(gForm.getStatus())){
                try {
                    /*TODO process Gform To SignLog edited by zhangtao at 2020/9/1 10:10*/
                    processGformToSign(StringUtils.isBlank(oldFormId) ? "add" : "update",gForm);
                } catch (Exception e) {
                    PrintUtils.printByDVm(e);
                }
            }
        }
        return GFormComparison.setGFormComparison(gForm);
    }

    public static void convertToObj(DynamicFormTemplate formTemplate, GForm gForm,String oldFormId) {
        if (formTemplate != null) {
            List<Map<String, DynamicFormItem>> itemTemplateMaps = formTemplate.getItemTemplateMaps();
            if (itemTemplateMaps != null) {
                JSON root = new JSONObject();
                for (Map<String, DynamicFormItem> itemTemplateMap : itemTemplateMaps) {
                    for (Map.Entry<String, DynamicFormItem> itemEntry : itemTemplateMap.entrySet()) {
                        DynamicFormItem itemTemplate = itemEntry.getValue();
                        String objAttr = itemTemplate.getObjAttr();
                        if (objAttr != null) {
                            String parent = itemTemplate.getParent();
                            String itemValue = null;
                            if (parent != null) {
                                String[] parents = parent.split(",");
                                for (String p : parents) {
                                    GFormItem gFormItem = gForm.getGformItemMap().get(p);
                                    if (gFormItem != null) {
                                        String group = gFormItem.getItemValue();
                                        if (JSON.isValidObject(group)) {
                                            JSONObject jsonObject = JSON.parseObject(group).getJSONObject(p);
                                            for (int i = 0; i < jsonObject.size(); i++) {
                                                JSONObject groupS = jsonObject.getJSONObject("" + i);
                                                itemValue = groupS.getObject(itemTemplate.getName(), GFormItem.class).getItemValue();
                                            }

                                        }
                                    }

                                }
                            } else {
                                GFormItem gFormItem = gForm.getGformItemMap().get(itemTemplate.getName());
                                if (gFormItem != null) {
                                    itemValue = gFormItem.getItemValue();
                                }
                            }
                            root = processJSONFromAttrPath(root, objAttr, itemValue);
                        }

                    }
                }
                PrintUtils.printByDVm(JSON.toJSONString(root, WriteMapNullValue));
                processTransGform((JSONObject)root,gForm,oldFormId);
            }
        }
    }
    public static void processGformToSign(String type,GForm gForm){
        Object obj=SpringWebApp.getObjectFromName("gformToSignService");
        if(obj!=null) {
            Method method;
            try {
                method = obj.getClass().getMethod("processGformToSignLog", String.class, GForm.class);
                method.invoke(obj,type , gForm);
            } catch (Exception e) {
                PrintUtils.printByDVm(e);
            }
        }
    }
    public static void processTransGform(JSONObject root,GForm gForm,String oldFormId){

        if(root.containsKey("resource")&&"Y".equals(gForm.getStatus())) {//正式保存
            String resource = root.getString("resource");
            Object obj=null;
            if ("MSDischargeNote".equals(resource)) {//出院準備篩檢表
                 obj= SpringWebApp.getObjectFromName("msDischargeNote");
            }else if("MSConsultNeed".equals(resource)){//照會申請
                obj= SpringWebApp.getObjectFromName("msConsultNeed");
            }else if("TransRecord".equals(resource)){
                obj= SpringWebApp.getObjectFromName("transRecord");
            }else if("MSTelClose".equals(resource)){//電訪記錄
                obj= SpringWebApp.getObjectFromName("telClose");

            }
            if(obj!=null) {
                Method method;
                Object classes;
                try {
                    method = obj.getClass().getMethod("processGform", String.class, GForm.class,String.class);
                    classes = method.invoke(obj, JSON.toJSONString(root, WriteMapNullValue), gForm,oldFormId);
                } catch (Exception e) {
                    e.printStackTrace();
                    classes = ExceptionUtils.getFullStackTrace(e);
                }
            }
        }
    }
    public void deleteGForm(String oldFormId, String sourceId) throws SQLException {
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        /*TODO process formTemplate edited by RainKing at 2020/4/13 18:39*/
        Map<String, String> map = new HashMap<String, String>();
        map.put("formId", oldFormId);
        GForm oldGform = formDao.selectFormByFormId(map);
        try {
            Class<?> reportThread = Class.forName("com.report.ReportThread");
            Method processGform = reportThread.getMethod("processGform", JSONObject.class);
            JSONObject paramMap = new JSONObject();
            paramMap.put("action", "delete");
            paramMap.put("oldFormId", oldFormId);
            paramMap.put("oldFdocId", oldGform.getFdocId());
            paramMap.put("fDocId", oldGform.getFdocId());
            paramMap.put("sourceId", oldGform.getSourceId());
            paramMap.put("formType", oldGform.getFormType());
            processGform.invoke(null, paramMap);

        } catch (Exception e) {
            if (!(e instanceof ClassNotFoundException)) {
                PrintUtils.printByDVm(e);
            }
        }
        try {
            if ("Y".equals(oldGform.getStatus())) {//插入一筆刪除的簽章資料
                processGformToSign("delete", oldGform);
            }
        }catch (Exception e) {
            e.printStackTrace();
        }
        if (StringUtils.isNotBlank(sourceId)) {
            formDao.deleteFormIndex(oldFormId);
        }
        formDao.deleteForm(oldFormId);
    }

    public GForm getExtendGFormData(String json) throws Exception {
        if (JSON.isValidObject(json)) {
            try {
                JSONObject paramMap = JSON.parseObject(json);
                Class<?> reportThread = Class.forName("com.report.ReportThread");
                Method getExtendGFormData = reportThread.getMethod("getExtendGFormData", JSONObject.class);
                Object invoke = getExtendGFormData.invoke(null, paramMap);
                return GFormComparison.setGFormComparison(((GForm) invoke));
            } catch (Exception e) {
                if (!(e instanceof ClassNotFoundException)) {
                    PrintUtils.printByDVm(e);
                    throw e;
                }
            }
        }
        return null;
    }

    public List<GForm> getExtendGFormList(String json) throws Exception {
        if (JSON.isValidObject(json)) {
            try {
                JSONObject paramMap = JSON.parseObject(json);
                Class<?> reportThread = Class.forName("com.report.ReportThread");
                Method getExtendGFormData = reportThread.getMethod("getExtendGFormList", JSONObject.class);
                Object invoke = getExtendGFormData.invoke(null, paramMap);
                return GFormComparison.setGFormComparison(((List<GForm>) invoke));
            } catch (Exception e) {
                if (!(e instanceof ClassNotFoundException)) {
                    PrintUtils.printByDVm(e);
                    throw e;
                }
            }
        }
        return null;
    }

    public GForm autoProcessGFormData(String json) throws Exception {
        if (JSON.isValidObject(json)) {
            JSONObject jsonObject = JSON.parseObject(json);
            return GFormComparison.setGFormComparison(autoProcessGFormData(jsonObject));
        }
        return null;
    }
    private GForm autoProcessGFormData(JSONObject jsonObject) throws Exception {
        if(jsonObject.containsKey("versionParamMap")&&jsonObject.containsKey("action")){
            String action = jsonObject.getString("action");
            FormVersionDao versionDao = SpringWebApp.getObjectFromName("formVersionDao");
            FormVersion formVersion = versionDao.selectFormVersionByFormModelVersionNo(jsonObject.getJSONObject("versionParamMap"));
            if (formVersion!=null) {
                String content = formVersion.getContent();
                if (StringUtils.isNotBlank(content)) {
                    DynamicFormTemplate formTemplate = FormUtils.getFormTemplate(content);
                    DataSource dataSource = formTemplate.getDataSource();
                    if (dataSource != null) {
                        GForm gForm = new GForm();
                        Map<String, NamedParameterJdbcTemplate> jdbcTemplateMap = new HashMap<String, NamedParameterJdbcTemplate>(0);
                        Map<String, Select> selectMap = new HashMap<String, Select>();
                        List<Select> selectsToWait = new ArrayList<Select>();
                        Map<String, Map<String, String>> schemaAndJndiMap = new HashMap<String, Map<String, String>>();
                        for (Resource resource : dataSource.getResources()) {
                            if (StringUtils.isBlank(resource.getJndiName())) {
                                Map<String, String> schemaAndJndiName = getSchemaAndJndiName(resource.getPersistenceUnitName(), schemaAndJndiMap);
                                String jndiName = schemaAndJndiName.get("jndiName");
                                String schema = schemaAndJndiName.get("schema");
                                resource.setJndiName(jndiName);
                                resource.setSchema(schema);
                            }
                            autoProcessStatement(jsonObject, dataSource, jdbcTemplateMap, resource, resource.getInsertList(), action);
                            autoProcessStatement(jsonObject, dataSource, jdbcTemplateMap, resource, resource.getInsertOneManyList(), action);
                            autoProcessStatement(jsonObject, dataSource, jdbcTemplateMap, resource, resource.getInsertOrUpdateList(), action);
                            autoProcessStatement(jsonObject, dataSource, jdbcTemplateMap, resource, resource.getDeleteList(),action);
                            autoProcessStatement(jsonObject, dataSource, jdbcTemplateMap, resource, resource.getUpdateList(),action);
                            List<Select> selects = resource.getSelectList();
                            if (selects != null&&selects.size()>0) {
                                for (Select select : selects) {
                                    if (select != null&&StringUtils.isNotBlank(select.getSql())&&select.hasAction(action)) {
                                        String parameterMap = select.getParameterMaps();
                                        if (StringUtils.isNotBlank(parameterMap)) {
                                            if (jsonObject.containsKey(parameterMap)) {
                                                Map<String, Object> paramMap = jsonObject.getJSONObject(parameterMap);
                                                NamedParameterJdbcTemplate jdbcTemplate = getNamedParameterJdbcTemplate(resource.getJndiName(), jdbcTemplateMap);
                                                String resultMapName = select.getResultMap();
                                                ResultMap resultMap = dataSource.getResultMapMap().get(resultMapName);
                                                List list = jdbcTemplate.query(select.getSql(), paramMap, new ColumnMapRowMapper(resultMap));
                                                if (list != null && list.size() > 0) {
                                                    select.setResult(list);
                                                    selectMap.put(select.getName(), select);
                                                }
                                            }
                                            else{
                                                select.setJndiName(resource.getJndiName());
                                                selectsToWait.add(select);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (selectMap.size() > 0) {
                            mergeResultSet(selectMap);
                            /*set the result as a parameter, to continue the query*/
                            if (selectsToWait.size()>0) {
                                for (Select select : selectsToWait) {
                                    String parameterMap = select.getParameterMaps();
                                    Select paramSelect = selectMap.get(parameterMap);
                                    if (paramSelect!=null) {
                                        List result = paramSelect.getResult();
                                        Map<String, List<Object>> paramMap = new HashMap<String, List<Object>>();
                                        for (Object o : result) {
                                            if (o instanceof Map) {
                                                for (Map.Entry<?, ?> entry : ((Map<?, ?>) o).entrySet()) {
                                                    String key = entry.getKey().toString();
                                                    List<Object> list = paramMap.get(key);
                                                    if (list == null) {
                                                        list = new ArrayList<Object>();
                                                        paramMap.put(key, list);
                                                    }
                                                    list.add(entry.getValue());
                                                }
                                            }
                                        }
                                        NamedParameterJdbcTemplate jdbcTemplate = getNamedParameterJdbcTemplate(select.getJndiName(), jdbcTemplateMap);
                                        String resultMapName = select.getResultMap();
                                        ResultMap resultMap = dataSource.getResultMapMap().get(resultMapName);
                                        List list = jdbcTemplate.query(select.getSql(), paramMap, new ColumnMapRowMapper(resultMap));
                                        if (list != null && list.size() > 0) {
                                            select.setResult(list);
                                            selectMap.put(select.getName(), select);
                                        }
                                    }
                                }
                                mergeResultSet(selectMap);
                            }
                            for (Select select : selectMap.values()) {
                                String target = select.getTarget();
                                if (!gForm.containsItem(target)) {
                                    Map<String, Object> group = new LinkedHashMap<String, Object>();
                                    Map<String, Object> itemsMap = new LinkedHashMap<String, Object>();
                                    group.put(target, itemsMap);
                                    List result = select.getResult();
                                    for (int i = 0; i < result.size(); i++) {
                                        Object o = result.get(i);
                                        if (o instanceof Map) {
                                            Map<String, Object> items = new HashMap<String, Object>();
                                            itemsMap.put("" + i, items);
                                            for (Map.Entry<?, ?> entry : ((Map<?, ?>) o).entrySet()) {
                                                Object key = entry.getKey();
                                                Map<String, Object> temp = new HashMap<String, Object>();
                                                Object itemValue = entry.getValue();
                                                String itemKey = target + "-" + i + "-" + key.toString();
                                                temp.put("itemKey", itemKey);
                                                temp.put("nodeId", itemKey);
                                                temp.put("itemValue", itemValue);
                                                items.put(key.toString(), temp);
                                            }
                                        }
                                    }
                                    String itemValue = JSON.toJSON(group).toString();
                                    GFormItem gFormItem = new GFormItem();
                                    gFormItem.setItemKey(target);
                                    gFormItem.setItemValue(itemValue);
                                    gForm.addGformItem(gFormItem);
                                }
                            }
                        }
                        if (gForm.getGformItems()!=null&&gForm.getGformItems().size()>0) {
                            return GFormComparison.setGFormComparison(gForm);
                        }
                    }
                }
            }
        }
        return null;
    }
    /**
    * merge resultSet
    * @param selectMap :
    * @author RainKing
    * @date 2019/10/11 11:45
    */
    private void mergeResultSet(Map<String, Select> selectMap) {
        for (Select select : selectMap.values()) {
            List orgResults = select.getResult();
            Select tar = selectMap.get(select.getMergeTo());
            if (tar != null) {
                List tarResults= tar.getResult();
                if (tar.getTarget() != null && tar.getTarget().equals(select.getTarget())) {
                    /*remove merged select*/
                    selectMap.remove(select.getName());
                    String mergeKeys = select.getMergeKeys();
                    if (mergeKeys != null) {
                        String[] keys = mergeKeys.split(",");
                        Map<String, Map> orgResultMap = new HashMap<String, Map>();
                        for (Object o : orgResults) {
                            if (o instanceof Map) {
                                Map map = (Map) o;
                                StringBuilder sb = new StringBuilder();
                                for (String key : keys) {
                                    sb.append(map.get(key).toString()).append('-');
                                }
                                orgResultMap.put(sb.toString(), map);
                            }
                        }
                        for (Object o : tarResults) {
                            if (o instanceof Map) {
                                Map map = (Map) o;
                                StringBuilder sb = new StringBuilder();
                                for (String key : keys) {
                                    sb.append(map.get(key).toString()).append('-');
                                }
                                map.putAll(orgResultMap.get(sb.toString()));
                            }
                        }
                    }
                }
            }
        }
    }

    private void autoProcessStatement(JSONObject jsonObject, DataSource dataSource, Map<String, NamedParameterJdbcTemplate> jdbcTemplateMap, Resource resource, List<? extends Statement> statements,String action) throws NamingException {
        if (statements!=null&&statements.size()>0) {
            for (Statement statement : statements) {
                if (statement != null&&StringUtils.isNotBlank(statement.getSql())&&statement.hasAction(action)) {
                    String parameterMapName = statement.getParameterMaps();
                    if (StringUtils.isNotBlank(parameterMapName)) {
                        Map<String,Object> paramMap;
                        if (jsonObject.containsKey(parameterMapName)) {
                            paramMap = jsonObject.getJSONObject(parameterMapName);
                            autoProcessStatement(jdbcTemplateMap, resource, statement, paramMap);
                        }
                        else if(jsonObject.containsKey("gform")){
                            GForm gform = jsonObject.getObject("gform", GForm.class);
                            Map<String, ParameterMap> parameterMapMap = dataSource.getParameterMapMap();
                            if(parameterMapMap!=null&&parameterMapMap.containsKey(parameterMapName)){
                                paramMap = new HashMap<String, Object>();
                                ParameterMap parameterMap = parameterMapMap.get(parameterMapName);
                                List<Parameter> parameters = parameterMap.getParameters();
                                for (Parameter parameter : parameters) {
                                    String v = gform.getGformItemMap().get(parameter.getItemName()).getItemValue();
                                    String k = parameter.getProperty();
                                    paramMap.put(k, v);
                                }
                                autoProcessStatement(jdbcTemplateMap, resource, statement, paramMap);
                            }
                            else{
                                String[] parameterMapNames=null;
                                if(parameterMapName.contains(",")){
                                    parameterMapNames = parameterMapName.split(",");
                                }
                                boolean containsKeys=false;
                                Map<String, GFormItem> gformItemMap = gform.getGformItemMap();
                                if(gformItemMap.containsKey(parameterMapName)||(containsKeys=containKeys(gformItemMap,parameterMapNames))){
                                    String primaryKey = null,primaryKeyName=null;
                                    JSONObject[] paramMaps=null;
                                    if (parameterMapNames==null) {
                                        parameterMapNames = new String[]{parameterMapName};
                                    }
                                    String autoUuIds = statement.getAutoUuIds();
                                    String[] autoUuIdArray=null;
                                    if (autoUuIds != null) {
                                        autoUuIdArray = autoUuIds.split(",");
                                    }
                                    boolean isInsertOneMay = statement instanceof InsertOneMany;
                                    if(isInsertOneMay)primaryKeyName=((InsertOneMany) statement).getPrimaryKey();
                                    for (String mapName : parameterMapNames) {
                                        parameterMapName = mapName;
                                        String groupJson = gform.getGformItemMap().get(parameterMapName).getItemValue();
                                        if (JSON.isValidObject(groupJson)) {
                                            JSONObject groups = JSON.parseObject(groupJson);
                                            JSONObject items = groups.getJSONObject(parameterMapName);
                                            if (paramMaps == null) {
                                                paramMaps = new JSONObject[items.size()];
                                            }
                                            for (int i = 0; i < items.size(); i++) {
                                                JSONObject group = items.getJSONObject("" + i);
                                                if (paramMaps[i] == null) {
                                                    paramMaps[i] = new JSONObject();
                                                }
                                                paramMap = paramMaps[i];
                                                for (String key : group.keySet()) {
                                                    String value = group.getObject(key, GFormItem.class).getItemValue();
                                                    paramMap.put(containsKeys?(parameterMapName+"_"+key):key, value);
                                                }
                                                if (autoUuIdArray != null) {
                                                    for (String autoUuId : autoUuIdArray) {
                                                        if(!paramMap.containsKey(autoUuId))paramMap.put(autoUuId, FormUtils.getUUID());
                                                    }
                                                }
                                                if (isInsertOneMay) {
                                                    if (paramMap.containsKey(primaryKeyName)) {
                                                        primaryKey = paramMap.get(primaryKeyName).toString();
                                                    } else if (primaryKey == null) {
                                                        primaryKey = FormUtils.getUUID();
                                                        paramMap.put(primaryKeyName, primaryKey);
                                                    }else {
                                                        paramMap.put(primaryKeyName, primaryKey);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (paramMaps!=null&&paramMaps.length>0) {
                                        NamedParameterJdbcTemplate jdbcTemplate = getNamedParameterJdbcTemplate(resource.getJndiName(),jdbcTemplateMap);
                                        if (isInsertOneMay) {
                                            InsertOneMany insertOneMany = (InsertOneMany) statement;
                                            jdbcTemplate.update(insertOneMany.getPrimarySql(), paramMaps[0]);
                                            List<String> childSqlList = insertOneMany.getChildSqlList();
                                            if (childSqlList != null&&childSqlList.size()>0) {
                                                for (String childSql : childSqlList) {
                                                    jdbcTemplate.batchUpdate(childSql,paramMaps);
                                                }
                                            }
                                        }else if(statement instanceof InsertOrUpdate){
                                            InsertOrUpdate insertOrUpdate = (InsertOrUpdate) statement;
                                            for (Map<String, ?> paramMapTemp : paramMaps) {
                                                processInsertOrUpdate(jdbcTemplate, insertOrUpdate, paramMapTemp);
                                            }
                                        }else{
                                            jdbcTemplate.batchUpdate(statement.getSql(),paramMaps);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private <K, V> boolean containKeys(Map<K, V> map, K... ks) {
        if (ks != null) {
            for (K k : ks) {
                if (!map.containsKey(k)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    private void processInsertOrUpdate(NamedParameterJdbcTemplate jdbcTemplate, InsertOrUpdate insertOrUpdate, Map<String, ?> paramMapTemp) {
        List list = jdbcTemplate.queryForList(insertOrUpdate.getSelectSql(), paramMapTemp);
        jdbcTemplate.update(list == null || list.size() == 0 ?insertOrUpdate.getInsertSql():insertOrUpdate.getUpdateSql(), paramMapTemp);
    }

    private void autoProcessStatement(Map<String, NamedParameterJdbcTemplate> jdbcTemplateMap, Resource resource, Statement statement, Map<String, Object> paramMap) throws NamingException {
        NamedParameterJdbcTemplate jdbcTemplate = getNamedParameterJdbcTemplate(resource.getJndiName(),jdbcTemplateMap);
        if (statement instanceof InsertOneMany) {
            InsertOneMany insertOneMany = (InsertOneMany) statement;
            if (!paramMap.containsKey(insertOneMany.getPrimaryKey())) {
                paramMap.put(insertOneMany.getPrimaryKey(), FormUtils.getUUID());
            }
            jdbcTemplate.update(insertOneMany.getPrimarySql(), paramMap);
            List<String> childSqlList = insertOneMany.getChildSqlList();
            if (childSqlList != null&&childSqlList.size()>0) {
                for (String sql : childSqlList) {
                    jdbcTemplate.update(sql, paramMap);
                }
            }
        } else if (statement instanceof InsertOrUpdate) {
            InsertOrUpdate insertOrUpdate = (InsertOrUpdate) statement;
            processInsertOrUpdate(jdbcTemplate, insertOrUpdate, paramMap);
        } else {
            jdbcTemplate.update(statement.getSql(), paramMap);
        }
    }

    private NamedParameterJdbcTemplate getNamedParameterJdbcTemplate(String jndiName, Map<String, NamedParameterJdbcTemplate> jdbcTemplateMap) throws NamingException {
        NamedParameterJdbcTemplate jdbcTemplate=jdbcTemplateMap.get(jndiName);
        if (jdbcTemplate==null) {
            JndiTemplate jndiTemplate = new JndiTemplate();
            javax.sql.DataSource source = (javax.sql.DataSource) jndiTemplate.lookup(StringUtils.preventLdapInject(jndiName));
            jdbcTemplate = new NamedParameterJdbcTemplate(source);
            jdbcTemplateMap.put(jndiName, jdbcTemplate);
        }
        return jdbcTemplate;
    }
    private Map<String,String> getSchemaAndJndiName(String persistenceUnitName, Map<String,Map<String,String>> schemaAndJndiMap){
        Map<String, String> schemaAndJndi = schemaAndJndiMap.get(persistenceUnitName);
        if (schemaAndJndi==null) {
        	PersistenceMetadata metadata= PersistenceUnitInfosUtils.getInstance().getPersistenceMap().get(persistenceUnitName);
        	Properties properties=metadata.getProps();
        	//EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory(persistenceUnitName);
            //Map<String, Object> properties = entityManagerFactory.getProperties();
            String schema = (String) properties.get("hibernate.default_schema");
            String jndiName = metadata.getNonJtaDatasource();
            schemaAndJndi = new HashMap<String, String>();
            schemaAndJndiMap.put(persistenceUnitName, schemaAndJndi);
            schemaAndJndi.put("schema", schema);
            schemaAndJndi.put("jndiName", jndiName);
        }
        return schemaAndJndi;
    }
    public String uploadToMergerGform(byte[] fileData,String statusIfError){
        StringBuilder errorLog = new StringBuilder();
        try{
            Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(fileData));
            GFormDaoImpl gformDao = SpringWebApp.getObjectFromName("gFormDao");
            //讀設定檔
            List<GformExcelConf> gformExcelConfList = gformDao.selectGformTypeRelation();
            Map<String, List<GformExcelConf>> formTemplateConfigMap = new HashMap<String, List<GformExcelConf>>();
            if (gformExcelConfList != null&&gformExcelConfList.size()>0) {
                Map<String, List<GformExcelConf>> tempMap = new HashMap<String, List<GformExcelConf>>();
                Map<String, GformExcelConf> gformExcelConfMap = new HashMap<String, GformExcelConf>();
                for (GformExcelConf gformExcelConf : gformExcelConfList) {
                    String parentForm = gformExcelConf.getParentForm();
                    if (StringUtils.isNotBlank(parentForm)) {
                        List<GformExcelConf> excelConfList = tempMap.get(parentForm);
                        if (excelConfList == null) {
                            excelConfList = new ArrayList<GformExcelConf>();
                            tempMap.put(parentForm,excelConfList);
                        }
                        excelConfList.add(gformExcelConf);
                    }
                    gformExcelConfMap.put(gformExcelConf.getId(), gformExcelConf);
                }
                for (Map.Entry<String, List<GformExcelConf>> entry : tempMap.entrySet()) {
                    formTemplateConfigMap.put(gformExcelConfMap.get(entry.getKey()).getFormType(), entry.getValue());
                }
            }
            //設定讀取頁簽參數
            Map<String, Sheet> sheetMap = new LinkedHashMap<String, Sheet>();
            Map<String, Sheet> sheetMapTemp = new ConcurrentHashMap<String, Sheet>();
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                Sheet sheet = workbook.getSheetAt(i);
                if (!workbook.isSheetHidden(i)) {
                    String sheetName = sheet.getSheetName();
                    Pattern compile = Pattern.compile("\\((\\w+)\\)$");
                    Matcher matcher = compile.matcher(sheetName);
                    if (matcher.find()) {
                        String formType = matcher.group(1);
                        if (formTemplateConfigMap.containsKey(formType)) {
                            sheetMapTemp.put(formType,sheet);
                        }
                        sheetMap.put(formType, sheet);
                    }
                }
            }
            for (Map.Entry<String, Sheet> entry : sheetMapTemp.entrySet()) {
                List<GformExcelConf> formTypes = formTemplateConfigMap.get(entry.getKey());
                for (GformExcelConf excelConf : formTypes) {
                    sheetMapTemp.remove(excelConf.getFormType());
                }
            }
            if(sheetMapTemp.size()>0) {
                FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
                XStream xStream = FormUtils.getXStream();
                Map<String, DynamicFormTemplate> formTemplateMap = new HashMap<String, DynamicFormTemplate>();
                //other欄位
                Pattern compile = Pattern.compile("^([\\w-]+)(\\((\\d+)\\))?(\\.other)?");
                /*根層sheet*/
                //開始轉換父層(或單一層)
                for (Map.Entry<String, Sheet> entry : sheetMapTemp.entrySet()) {
                    Sheet rootSheet = entry.getValue();
                    String rootFormType = entry.getKey();
                    processSheetToGform(sheetMap, versionDaoImpl, xStream, formTemplateMap, null, gformDao, compile, rootSheet, rootFormType,statusIfError,errorLog);
                }
            }
        }catch (Exception e){
            errorLog.append("\r\n").append(ExceptionUtils.getFullStackTrace(e));
        }
        Map<String, Object> resultMsg = new HashMap<String, Object>();
        if (errorLog.length() > 0) {
            resultMsg.put("success", false);
            errorLog.insert(0, "數據處理完成，錯誤數據已"+("N".equals(statusIfError)?"暫存":"跳過")+"，錯誤信息如下：\r\n");
            resultMsg.put("message", errorLog.toString());
        }else{
            resultMsg.put("success", true);
            resultMsg.put("message", "merger fileData to gform successful");
        }
        return JsonUtils.toJson(resultMsg);
    }

    //轉換資料至gform
    private void processSheetToGform(Map<String, Sheet> sheetMap, FormVersionDaoImpl versionDaoImpl, XStream xStream, Map<String, DynamicFormTemplate> formTemplateMap, Map<String, GForm> parentGformMap, GFormDaoImpl gformDao, Pattern compile, Sheet rootSheet, String rootFormType, String statusIfError, StringBuilder errorLog) throws Exception {
        //取得 GEMCCONF GIEMCCONF
    	GformExcelConf gformExcelConf = gformDao.selectGformExcelConfByType(rootFormType);
        if (gformExcelConf != null) {
        	//取得模板
            DynamicFormTemplate formTemplate = getLastFormTemplate(rootFormType, versionDaoImpl, xStream,formTemplateMap);
            //取得模板讀取設定 GEMCCONF GIEMCCONF
            List<GformItemExcelConf> itemList = gformExcelConf.getItemList(formTemplate);
            if (CollectionUtils.isNotEmpty(itemList)) {
                Map<String, GformItemExcelConf> itemExcelConfMap = gformExcelConf.getItemMap();
                if (formTemplate!=null) {
                    List<Map<String, DynamicFormItem>> itemTemplateMaps = formTemplate.getItemTemplateMaps();
                    if (itemTemplateMaps!=null) {
                        Row keyRow = rootSheet.getRow(rootSheet.getFirstRowNum() + 1);
                        Map<String, GForm> newGformMap = new HashMap<String, GForm>();
                        for (int i = rootSheet.getFirstRowNum()+2; i <= rootSheet.getLastRowNum(); i++) {
                            Row row = rootSheet.getRow(i);
                            GForm gform = null;
                            String oldFormId=null;
                            Set<GFormItem> toVerifyGformItems = new LinkedHashSet<GFormItem>();
                            Map<String, String[][]> valueAndOtherMap = new HashMap<String, String[][]>();
                            //讀取formId，並獲取gForm的殼
                            int formIdNum=-1;
                            for (int j = row.getFirstCellNum(); j <= row.getLastCellNum(); j++) {
                                String key = WorkBookUtils.getStringCellValue(keyRow.getCell(j));
                                String value = WorkBookUtils.getStringCellValue(row.getCell(j));
                                if (key.matches("^formId$")) {
                                	//formId為new開頭代表新增，但不能重複，如new1 new2...
                                    if (value.matches("^new(\\w+)?")) {
                                        gform = new GForm();
                                        String uuid = FormUtils.getUUID();
                                        gform.setFormId(uuid);
                                        gform.setFdocId(uuid);
                                        gform.setEvaluationTime(new Date());
                                        gform.setFormType(formTemplate.getFormType());
                                        gform.setFormVersionId(formTemplate.getFormVersionId());
                                        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
                                        HashMap<String, String> map = new HashMap<String, String>();
                                        map.put("formType", formTemplate.getFormType());
                                        int frameVersion = frameDaoImpl.selectFormFrameMaxVersionByFormType(map);
                                        gform.setVersionNo(Math.max(formTemplate.getVersion(), frameVersion) + "");
                                        gform.setStatus("Y");
                                        gform.setCreateTime(new Date());
                                        gform.setCreatorId("fromExcel");
                                        gform.setCreatorName("fromExcel");
                                        newGformMap.put(value, gform);
                                    } else { //更新
                                        Map<String, String> map = new HashMap<String, String>();
                                        map.put("formType", formTemplate.getFormType());
                                        map.put("formId", value);
                                        gform = gformDao.selectFormByFormId(map, true);
                                        if (gform != null) {
                                            gform.setStatus("O");
                                            oldFormId = gform.getFormId();
                                        }
                                    }
                                    formIdNum = j;
                                    break;
                                }
                            }
                            //開始篩值、填充gForm
                            if (gform!=null) {
                                GFormItem uniqueItem = null;
                                for (int j = row.getFirstCellNum(); j <= row.getLastCellNum(); j++) {
                                    if(j==formIdNum)continue;
                                    String key = WorkBookUtils.getStringCellValue(keyRow.getCell(j));
                                    String value = WorkBookUtils.getStringCellValue(row.getCell(j));
                                    if (key.matches("^sourceId$")) {
                                        if (value.matches("^new(\\w+)?")) {
                                            gform.setSourceId(parentGformMap.get(value).getFormId());
                                        } else {
                                            gform.setSourceId(value);
                                        }
                                    } else {
                                        Matcher matcher = compile.matcher(key);
                                        if (matcher.find()) {
                                            GformItemExcelConf gformItemExcelConf = itemExcelConfMap.get(matcher.group(1));
                                            String itemKey = gformItemExcelConf.getItemNameInner();
                                            String other = matcher.group(4);
                                            DynamicFormItem itemTemplate = FormUtils.getItemTemplate(itemTemplateMaps, itemKey);
                                            if (itemTemplate != null) {
                                                String controlType = itemTemplate.getControlType();
                                                boolean required = itemTemplate.isRequired();
                                                GFormItem gformItem = gform.getGformItemMap() != null ? gform.getGformItemMap().get(itemKey) : null;
                                                if (controlType.matches("radio|select")) {
                                                    if (other != null) {
                                                        if (StringUtils.isBlank(value)) {
                                                            if (gformItem != null) {
                                                                if (StringUtils.isNotBlank(gformItem.getOtherValue())) {
                                                                    gformItem.setOtherValue(null);
                                                                    toVerifyGformItems(toVerifyGformItems, gformItem, j);
                                                                    if ("O".equals(gform.getStatus()))
                                                                        gform.setStatus("Y");
                                                                }
                                                            }
                                                        } else {
                                                            if (gformItem != null) {
                                                                if (!value.equals(gformItem.getOtherValue())) {
                                                                    gformItem.setOtherValue(value);
                                                                    toVerifyGformItems(toVerifyGformItems, gformItem, j);
                                                                    if ("O".equals(gform.getStatus()))
                                                                        gform.setStatus("Y");
                                                                }
                                                            } else {
                                                                gformItem = createItemToGform(gform, itemKey, null, value);
                                                                toVerifyGformItems(toVerifyGformItems, gformItem, j);
                                                            }
                                                        }
                                                    } else {
                                                        if (StringUtils.isBlank(value)) {
                                                            if (required) {
                                                                processErrorMessage(gform, statusIfError, errorLog, formTemplate, i, j);
                                                            } else if (gformItem != null) {
                                                                gformItem.setItemValue(null);
                                                                if ("O".equals(gform.getStatus()))
                                                                    gform.setStatus("Y");
                                                            }
                                                        } else {
                                                            String[] uiDesc = itemTemplate.getUiDesc();
                                                            String[] uiValueArray = itemTemplate.getUiValue();
                                                            String uiValue = null;
                                                            for (int k = 0; k < uiDesc.length; k++) {
                                                                if (uiDesc[k].equals(value)) {
                                                                    uiValue = uiValueArray[k];
                                                                    break;
                                                                }
                                                            }
                                                            if (uiValue == null) {
                                                                processErrorMessage(gform, statusIfError, errorLog, formTemplate, i, j, "的值不合規");
                                                            }
                                                            if (gformItem != null) {
                                                                if (!gformItem.getItemValue().equals(uiValue)) {
                                                                    gformItem.setItemValue(uiValue);
                                                                    toVerifyGformItems(toVerifyGformItems, gformItem, j);
                                                                    if ("O".equals(gform.getStatus()))
                                                                        gform.setStatus("Y");
                                                                }
                                                            } else {
                                                                gformItem = createItemToGform(gform, itemKey, uiValue);
                                                                toVerifyGformItems(toVerifyGformItems, gformItem, j);
                                                            }
                                                        }
                                                    }
                                                } else if (controlType.matches("checkbox")) {
                                                    String index = matcher.group(3);
                                                    if (StringUtils.isNotBlank(value) && index != null) {
                                                        String[] uiDesc = itemTemplate.getUiDesc();
                                                        String[] uiValue = itemTemplate.getUiValue();
                                                        int ind = Integer.parseInt(index);
                                                        if (ind < uiDesc.length) {
                                                            String[][] valueAndOther = valueAndOtherMap.get(itemKey);
                                                            if (valueAndOther == null) {
                                                                valueAndOther = new String[4][uiDesc.length];
                                                                valueAndOtherMap.put(itemKey, valueAndOther);
                                                            }
                                                            if (other != null) {
                                                                valueAndOther[1][ind] = value;
                                                                valueAndOther[3][ind] = j + "";
                                                            } else {
                                                                if (uiDesc[ind].equals(value)) {
                                                                    valueAndOther[0][ind] = uiValue[ind];
                                                                    valueAndOther[2][ind] = j + "";
                                                                } else {
                                                                    processErrorMessage(gform, statusIfError, errorLog, formTemplate, i, j, "的值不合規");
                                                                }
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (gformItem != null) {
                                                        if (!value.equals(gformItem.getItemValue())) {
                                                            if (StringUtils.isBlank(value)) {
                                                                if (required)
                                                                    processErrorMessage(gform, statusIfError, errorLog, formTemplate, i, j);
                                                                else
                                                                    gformItem.setItemValue(null);
                                                            } else {
                                                                gformItem.setItemValue(value);
                                                            }
                                                            if ("O".equals(gform.getStatus())) gform.setStatus("Y");
                                                        }
                                                    } else {
                                                        if (StringUtils.isBlank(value)) {
                                                            if (required)
                                                                processErrorMessage(gform, statusIfError, errorLog, formTemplate, i, j);
                                                        } else {
                                                            gformItem=createItemToGform(gform, itemKey, value);
                                                        }
                                                    }
                                                }
                                                if (gformItem!=null&&gformItemExcelConf.isUniqueItem()) {
                                                    uniqueItem=gformItem;
                                                }
                                            }
                                        }
                                    }
                                }
                                //單獨設定checkbox的otherValue
                                /*checkbox*/
                                for (Map.Entry<String, String[][]> valueAndOtherEntry : valueAndOtherMap.entrySet()) {
                                    String itemKey = valueAndOtherEntry.getKey();
                                    String[][] valueAndOther = valueAndOtherEntry.getValue();
                                    StringBuilder itemValue = new StringBuilder();
                                    StringBuilder otherValue = new StringBuilder();
                                    DynamicFormItem itemTemplate = FormUtils.getItemTemplate(itemTemplateMaps, itemKey);
                                    if (itemTemplate != null) {
                                        GformItemExcelConf gformItemExcelConf = itemExcelConfMap.get(itemKey);
                                        Boolean[] hasOther = itemTemplate.getHasOther();
                                        for (int l = 0,h=0; l < valueAndOther[0].length; l++) {
                                            String value = valueAndOther[0][l];
                                            if (value != null) {
                                                if (h>0) {
                                                    itemValue.append(',');
                                                    otherValue.append('|');
                                                }
                                                itemValue.append(value);
                                                if (hasOther != null&&hasOther.length>l&&hasOther[l] != null && hasOther[l]) {
                                                    String other = valueAndOther[1][l];
                                                    if (other == null) {
                                                        processErrorMessage(gform,statusIfError,errorLog,formTemplate, i, Integer.parseInt(valueAndOther[3][l]));
                                                    }else{
                                                        otherValue.append(other);
                                                    }
                                                }
                                                h++;
                                            }
                                        }
                                        GFormItem gformItem = gform.getGformItemMap() == null ? null : gform.getGformItemMap().get(itemKey);
                                        String value = itemValue.toString();
                                        String other = otherValue.toString();
                                        if (gformItem != null) {
                                            if (!value.equals(gformItem.getItemValue()) || !other.equals(gformItem.getOtherValue())) {
                                                gformItem.setItemValue(value);
                                                gformItem.setOtherValue(other);
                                                if("O".equals(gform.getStatus())) gform.setStatus("Y");
                                            }
                                        }else{
                                            gformItem=createItemToGform(gform, itemKey, value, other);
                                        }
                                        if (gformItemExcelConf.isUniqueItem()) {
                                            uniqueItem=gformItem;
                                        }
                                    }
                                }
                                //單獨設定radio|select的otherValue
                                /*radio|select*/
                                for (GFormItem gformItem : toVerifyGformItems) {
                                    DynamicFormItem itemTemplate = FormUtils.getItemTemplate(itemTemplateMaps, gformItem.getItemKey());
                                    String value = gformItem.getItemValue();
                                    String[] uiValueArray = itemTemplate.getUiValue();
                                    Boolean[] hasOther = itemTemplate.getHasOther();
                                    for (int m = 0; m < uiValueArray.length; m++) {
                                        String uiValue = uiValueArray[m];
                                        if (value.equals(uiValue)) {
                                            if (hasOther != null &&hasOther.length>m&& hasOther[m] != null && hasOther[m]) {
                                                String otherValue = gformItem.getOtherValue();
                                                if (StringUtils.isBlank(otherValue)) {
                                                    processErrorMessage(gform,statusIfError,errorLog,formTemplate, i, Integer.parseInt(gformItem.getCreatorId()));
                                                }
                                            }else{
                                                gformItem.setOtherValue(null);
                                            }
                                            break;
                                        }
                                    }

                                }
                                //保存
                                if (gform.getStatus()!=null&&gform.getStatus().matches("^([YN])$")) {
                                    if (oldFormId != null) {
                                        gform.setFdocId(FormUtils.getUUID());
                                        gform.setModifyTime(new Date());
                                        gform.setModifyUserId("fromExcel");
                                        gform.setModifyUserName("fromExcel");
                                        for (GFormItem gformItem : gform.getGformItems()) {
                                            gformItem.setFormItemId(FormUtils.getUUID());
                                        }
                                    }else if(uniqueItem!=null){
                                        List<GForm> gformList = getExistsGformList(uniqueItem.getItemKey(), uniqueItem.getItemValue(), gform.getFormType());
                                        if (CollectionUtils.isNotEmpty(gformList)) {
                                            GForm oldGform = null;
                                            for (int gformListSize = gformList.size(), j = gformListSize - 1; j > -1; j--) {
                                                GForm gForm = gformList.get(j);
                                                if (oldGform == null) {
                                                    oldGform = gForm;
                                                    oldFormId = oldGform.getFormId();
                                                    gform.setFormId(oldGform.getFormId());
                                                    gform.setSourceId(oldGform.getSourceId());
                                                } else {
                                                    gformDao.deleteForm(gForm.getFormId());
                                                }
                                            }
                                        }
                                    }
                                    if (StringUtils.isBlank(gform.getSourceId())) {
                                        gform.setSourceId(gform.getFormType());
                                    }
                                    gformDao.addOrUpdateForm(oldFormId,gform,gform.getSourceId());
                                }
                            }
                        }
                        List<GformExcelConf> gformExcelConfList = gformDao.selectGformExcelConfByParent(gformExcelConf.getId());
                        if (gformExcelConfList != null&&gformExcelConfList.size()>0) {
                        	//開始轉換子層
                            for (GformExcelConf excelConf : gformExcelConfList) {
                                Sheet sheet = sheetMap.get(excelConf.getFormType());
                                if (sheet != null) {
                                    processSheetToGform(sheetMap,versionDaoImpl,xStream,formTemplateMap,newGformMap,gformDao,compile,sheet,excelConf.getFormType(), statusIfError, errorLog);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private boolean toVerifyGformItems(Set<GFormItem> toVerifyGformItems, GFormItem gformItem, int j) {
        gformItem.setCreatorId(j+"");
        return toVerifyGformItems.add(gformItem);
    }

    private GFormItem createItemToGform(GForm gform, String itemKey, String... values) {
        GFormItem gformItem = new GFormItem();
        gformItem.setFormItemId(FormUtils.getUUID());
        gformItem.setItemKey(itemKey);
        if (values.length > 0) {
            gformItem.setItemValue(values[0]);
        }
        if (values.length > 1) {
            gformItem.setOtherValue(values[1]);
        }
        gform.addGformItem(gformItem);
        return gformItem;
    }

    private void processErrorMessage(GForm gform, String statusIfError, StringBuilder errorLog, DynamicFormTemplate formTemplate, int i, int j, String... msgs) {
        gform.setStatus(statusIfError);
        if (errorLog.length() > 0) {
            errorLog.append("\r\n");
        }
        errorLog.append("sheet[").append(formTemplate.getFormName()).append("(").append(formTemplate.getFormType())
                .append(")]：第").append(i + 1).append("行，第").append(CellReference.convertNumToColString(j)).append("列")
                .append(msgs == null || msgs.length == 0 ? "為必填值" : msgs[0]).append("，請重新填值後上傳！");
    }

    public byte[] downLoadGformToFile(SearchParamGF searchParamGF) {
        Workbook workbook = null;
        ByteArrayOutputStream byteArrayOutputStream = null;
        try {
            workbook = WorkBookUtils.createWorkbook("xlsx");
            processAllRelatedGform(searchParamGF,workbook,workbook.getCreationHelper(),false);
            byteArrayOutputStream = new ByteArrayOutputStream();
            workbook.write(byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        } catch (IOException e) {
            PrintUtils.printByDVm(e);
            return null;
        }finally {
            try {
                if (workbook != null) workbook.close();
                if (byteArrayOutputStream != null) byteArrayOutputStream.close();
            } catch (IOException e) {
                PrintUtils.printByDVm(e);}
        }
    }

    public byte[] downLoadGformToFile_byGetExtendGFormList(String json) throws Exception {
    	//取得 gFormList
    	List<GForm> gFormList = getExtendGFormList(json);
        if (gFormList==null) {
            return null;
        }

        //取得 BasicGroovy ，為資料轉換做準備
        Class<?> reportThread = Class.forName("com.report.ReportThread");
        Method getBasicGroovy = reportThread.getMethod("getBasicGroovy", String.class);
        Object invoke = getBasicGroovy.invoke(null, "null");
        basicGroovy = (String) invoke;

        //取得 xml 的 outputExcels 節點
        JSONObject paramMap = JSON.parseObject(json);
        reportThread = Class.forName("com.report.ReportThread");
        Method getOutputExcel = reportThread.getMethod("getOutputExcel", JSONObject.class);
        invoke = getOutputExcel.invoke(null, paramMap);
        String result = JsonUtils.toJson(invoke);
        if (result==null){
        	return null;
        }
        JSONArray outputExcels = new JSONArray();
        outputExcels = (JSONArray) outputExcels.parse(result);
        if (outputExcels.size()<1){
        	return null;
        }
        JSONObject outputExcel = outputExcels.getJSONObject(0);

        //開始輸出excel
        Workbook workbook = null;
        ByteArrayOutputStream byteArrayOutputStream = null;
        try {
            workbook = WorkBookUtils.createWorkbook("xlsx");
            String formType = gFormList.get(0).getFormType();
            GFormDaoImpl gformDao = SpringWebApp.getObjectFromName("gFormDao");
            //取得要輸出的表單資訊
            GformExcelConf gformExcelConf = new GformExcelConf();
//          gformExcelConf = gformDao.selectGformExcelConfByType(formType);
//          if (gformExcelConf==null) {
//            	return null;
//        	}
            gformExcelConf.setFormType(formType); //formType
            //<OutputExcel>
            gformExcelConf.setFormDesc(outputExcel.getString("tabName")); //頁籤名稱
            //取得要輸出的items資訊  <column>
            List<GformItemExcelConf> itemList = new ArrayList();
            GformItemExcelConf item = null;
            JSONArray columns = outputExcel.getJSONArray("Column");
            JSONObject column = null;
            for (int i =0, len=columns.size(); i<len; ++i){
            	item = new GformItemExcelConf();
            	column = columns.getJSONObject(i);
            	item.setItemDesc(column.getString("title"));
            	item.setItemNameInner(column.getString("name"));
            	item.setItemNameOuter(column.getString("name"));
            	String showDesc = column.getString("showDesc");
            	item.setShowDesc((showDesc!=null && showDesc.equals("true")) ? true : false);
            	item.setScript(column.getString("data"));
            	itemList.add(item);

            }
            gformExcelConf.setItemList(itemList);
            //實例化
            FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
            XStream xStream = FormUtils.getXStream();
            Map<String, DynamicFormTemplate> formTemplateMap = new HashMap<String, DynamicFormTemplate>();
            Map<String, Sheet> sheetMap = new HashMap<String, Sheet>();
            DynamicFormTemplate formTemplate=getLastFormTemplate(gformExcelConf.getFormType(), versionDaoImpl, xStream, formTemplateMap);
            if (formTemplate == null) {
            	return null;
            }
            //設置excel頁簽、formType、formName、beanName標題、beanTitle
            addSheetWithHead(workbook,workbook.getCreationHelper(), sheetMap,formTemplate,gformExcelConf, false);
            //填充gForm數據
            addDataToSheet(gformExcelConf,versionDaoImpl, xStream,formTemplateMap, workbook.getCreationHelper(), sheetMap, gFormList, false);

            //processAllRelatedGform(searchParamGF,workbook,workbook.getCreationHelper(),false);
            byteArrayOutputStream = new ByteArrayOutputStream();
            workbook.write(byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        } catch (IOException e) {
            PrintUtils.printByDVm(e);
            return null;
        }finally {
            try {
                if (workbook != null) workbook.close();
                if (byteArrayOutputStream != null) byteArrayOutputStream.close();
            } catch (IOException e) {
                PrintUtils.printByDVm(e);}
        }
    }

    public void processAllRelatedGform(SearchParamGF searchParamGF,Workbook workbook, CreationHelper creationHelper,
                                       boolean hasParent) {
        String formType = searchParamGF.getFormType();
        GFormDaoImpl gformDao = SpringWebApp.getObjectFromName("gFormDao");
        GformExcelConf gformExcelConf = gformDao.selectGformExcelConfByType(formType);
        if (gformExcelConf!=null) {
            FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
            XStream xStream = FormUtils.getXStream();
            Map<String, DynamicFormTemplate> formTemplateMap = new HashMap<String, DynamicFormTemplate>();
            //設置excel頁簽、formType、formName、beanName標題、beanTitle
            Map<String, Sheet> sheetMap = new HashMap<String, Sheet>();
            addSheetWithHead(gformDao,gformExcelConf,versionDaoImpl, xStream,formTemplateMap,workbook,creationHelper,sheetMap, hasParent);
            //填充gForm父層數據
            List<GForm> gformList = getGFormListWithCondition(searchParamGF);
            addDataToSheet(gformExcelConf,versionDaoImpl, xStream,formTemplateMap, creationHelper, sheetMap, gformList, hasParent);
        }
    }

    private DynamicFormTemplate getLastFormTemplate(String formType, FormVersionDaoImpl versionDaoImpl, XStream xStream, Map<String, DynamicFormTemplate> formTemplateMap){
        try {
            DynamicFormTemplate formTemplate = formTemplateMap.get(formType);
            if (formTemplate==null) {
                Map<String, Object> map = new HashMap<String, Object>();
                map.put("formType", formType);
                map.put("formModel", formType);
                int version = versionDaoImpl.selectMaxFormVersion(formType);
                map.put("version", version);
                FormVersion formVersion = versionDaoImpl.selectFormVersion(map);
                formTemplate = FormUtils.getFormTemplate(formVersion, xStream);
                formTemplateMap.put(formType, formTemplate);
            }
            return formTemplate;
        } catch (Exception e) {
            PrintUtils.printByDVm(e);
            return null;
        }
    }

    public void addDataToSheet(GformExcelConf gformExcelConf, FormVersionDaoImpl versionDaoImpl, XStream xStream, Map<String, DynamicFormTemplate> formTemplateMap, CreationHelper creationHelper, Map<String, Sheet> sheetMap,List<GForm> gformList, boolean hasParent) {
        DynamicFormTemplate formTemplate = getLastFormTemplate(gformExcelConf.getFormType(), versionDaoImpl, xStream, formTemplateMap);
        List<GformItemExcelConf> itemList = gformExcelConf.getItemList(formTemplate);
        if (CollectionUtils.isNotEmpty(itemList)) {
            if (formTemplate != null) {
                List<Map<String, DynamicFormItem>> itemTemplateMaps = formTemplate.getItemTemplateMaps();
                if (gformList != null && gformList.size() > 0) {
                    List<List<String>> dataList = new ArrayList<List<String>>();
                    for (GForm gform : gformList) {
                        if (itemTemplateMaps != null && itemTemplateMaps.size() > 0) {
                            Map<String, GFormItem> gformItemMap = gform.getGformItemMap();
                            if (gformItemMap != null && gformItemMap.size() > 0) {
                                List<String> data = new ArrayList<String>();
                                dataList.add(data);
                                data.add(gform.getFormId());
                                if (hasParent) data.add(gform.getSourceId());
                                for (GformItemExcelConf itemExcelConf : itemList) {
                                    DynamicFormItem itemTemplate = getItemTemplate(formTemplate, itemExcelConf);
                                    if (itemTemplate != null) {
                                        processDataItemData(gformItemMap, data, itemTemplate, itemExcelConf.isShowDesc(), itemExcelConf.getScript());
                                    }else{
                                        GFormItem gFormItem = gformItemMap.get(itemExcelConf.getItemNameInner());
                                        String itemValue = "";
                                        String script = itemExcelConf.getScript();
                                        if (gFormItem==null){
                                        	itemValue = getNewItemValue(StringUtils.EMPTY, script);
                                            data.add(itemValue);
                                        }else if (gFormItem.getItemValue()==null){
                                        	itemValue = getNewItemValue(StringUtils.EMPTY, script);
                                            data.add(itemValue);
                                        }else{
                                        	itemValue = getNewItemValue(gFormItem.getItemValue(), script);
                                            data.add(itemValue);
                                        }
                                    }
                                }

                            }
                        }
                        //填充子層數據
                        List<GformExcelConf> childGeConfList = gformExcelConf.getChildGeConfList();
                        if (childGeConfList != null&&childGeConfList.size()>0) {
                            for (GformExcelConf excelConf : childGeConfList) {
                                addDataToSheet(excelConf, versionDaoImpl, xStream, formTemplateMap, creationHelper, sheetMap,getGFormList(excelConf.getFormType(), gform.getFormId()), true);
                            }
                        }
                    }
                    WorkBookUtils.addDataToSheet(sheetMap, creationHelper, gformExcelConf.getFormDesc() + "(" + gformExcelConf.getFormType() + ")", dataList);
                }
            }
        }
    }

    private void processDataItemData(Map<String, GFormItem> gformItemMap, List<String> data, DynamicFormItem itemTemplate, boolean isShowDesc, String script) {
        String controlType = itemTemplate.getControlType();
        String[] uiValues = itemTemplate.getUiValue();
        String[] uiDescArray = itemTemplate.getUiDesc();
        Boolean[] hasOther = itemTemplate.getHasOther();
        GFormItem gFormItem = gformItemMap.get(itemTemplate.getName());
        String itemValue;
        int idx = -1;

        if (gFormItem != null&&(itemValue = gFormItem.getItemValue())!=null) {
            if (controlType.matches("^radio|select$")) {
            	if (isShowDesc){
                	idx = java.util.Arrays.asList(uiValues).indexOf(itemValue);
                	//代入data，執行groovy作資料轉換
                	//有匹配就是拿uiDesc去作轉換
                	data.add((idx!=-1) ? getNewItemValue(uiDescArray[idx], script) : getNewItemValue(itemValue, script));
            	}else{
            		data.add(itemValue);
            	}
                if (hasOther != null) {
                    for (Boolean other : hasOther) {
                        if (other != null && other) {
                            data.add(StringUtils.defaultString(gFormItem.getOtherValue()));
                            break;
                        }
                    }
                }
            } else if (controlType.matches("^checkbox$")) {
            	boolean hasItemOther = (gFormItem.getOtherValue()!=null);
                String[] values = itemValue.split(",");
                String[] others = hasItemOther?gFormItem.getOtherValue().split("\\|"):null;
                String v = "", nv = "", ov="";
                //讓 values 和 others 的個數與 uiValues 相同
                for (int i = 0, len = uiValues.length; i < len; i++) {
                	idx = java.util.Arrays.asList(values).indexOf(uiValues[i]);
                	if (idx>-1){
                		v += values[idx];
                		ov += (hasItemOther && others!=null && others.length>=idx+1)? others[idx] : "";
                	}
                	v += ((i+1)!=len) ? "," : "";
                	ov += ((i+1)!=len) ? "|" : "";
                }
                values = v.split(",", -1);
                others = ov.split("\\|", -1);
                //填充數據
                for (int i = 0, len = uiDescArray.length; i < len; i++) {
                	if (isShowDesc){
                    	//代入data，執行groovy作資料轉換
                    	//有匹配就是拿uiDesc去作轉換
                		getNewItemValue(itemValue, script);
                		data.add((values[i].equals("")) ? getNewItemValue("", script) : getNewItemValue(uiDescArray[i], script));
                	}else{
                		data.add(getNewItemValue(values[i], script));
                	}
                    if (hasOther != null && hasOther.length > i && hasOther[i] != null && hasOther[i]) {
                		data.add(others[i]);
                    }
                }

//                for (int i = 0, j = 0; i < uiDescArray.length; i++) {
//                    boolean hasValue = j<values.length&&uiValues[i].equals(values[j]);
//                    if (hasValue) {
//                    	idx = java.util.Arrays.asList(uiValues).indexOf(values[j]);
//                    	data.add((idx!=-1) ? uiDescArray[idx] : values[j]);
//                        j++;
//                    } else {
//                        data.add(StringUtils.EMPTY);
//                    }
//                    if (hasOther != null && hasOther.length > i && hasOther[i] != null && hasOther[i]) {
//                        if (hasValue&&others!=null&&others.length>=j) {
//                            data.add(others[j - 1]);
//                        } else {
//                            data.add(StringUtils.EMPTY);
//                        }
//                    }
//                }
            } else {
            	itemValue = getNewItemValue(itemValue, script); //代入data，執行groovy作資料轉換
                data.add(itemValue);
            }
        } else {
            if (controlType.matches("^radio|select$")) {
            	itemValue = getNewItemValue(StringUtils.EMPTY, script); //代入data，執行groovy作資料轉換
                data.add(itemValue);
                if (hasOther != null) {
                    for (Boolean other : hasOther) {
                        if (other != null && other) {
                            data.add(StringUtils.EMPTY);
                            break;
                        }
                    }
                }
            } else if (controlType.matches("^checkbox$")) {
                for (int i = 0; i < uiDescArray.length; i++) {
                	itemValue = getNewItemValue(StringUtils.EMPTY, script); //代入data，執行groovy作資料轉換
                    data.add(itemValue);
                    if (hasOther != null && hasOther.length > i && hasOther[i] != null && hasOther[i]) {
                        data.add(StringUtils.EMPTY);
                    }
                }
            } else {
            	itemValue = getNewItemValue(StringUtils.EMPTY, script); //代入data，執行groovy作資料轉換
                data.add(itemValue);
            }
        }
    }

    //代入data，執行groovy作資料轉換
    public String getNewItemValue(String itemValue, String script){
    	if (script==null){
    		return itemValue;
    	}
    	CompiledScript compiledScript = getCompiledScript(script);
    	if (compiledScript==null){
    		return itemValue;
    	}

        //代入data，執行groovy作資料轉換
        //用作資料轉換
		SimpleBindings bindings = null;
		try{
			bindings=new SimpleBindings();
			bindings.put("data", itemValue);
			return (String) compiledScript.eval(bindings);
		}catch(Exception e){
			e.printStackTrace();
			return itemValue;
		}
    }
    public CompiledScript getCompiledScript(String script){
		CompiledScript compiledScript=DynamicFormServiceImpl.scriptMap.get(script);
		if(compiledScript==null){
			try{
				ScriptEngineManager manager = new ScriptEngineManager();
				ScriptEngine engine = manager.getEngineByName("groovy");
				compiledScript =((Compilable)engine).compile(DynamicFormServiceImpl.basicGroovy.replace("{Field}",script));
				DynamicFormServiceImpl.scriptMap.put(script, compiledScript);
			}catch(Exception e){
				DynamicFormServiceImpl.scriptMap.put(script, null);
				e.printStackTrace();
				return null;
			}
		}
    	return compiledScript;
    }

    public DynamicFormItem getItemTemplate(DynamicFormTemplate formTemplate, GformItemExcelConf itemExcelConf) {
        return FormUtils.getItemTemplate(formTemplate, itemExcelConf.getItemNameInner());
    }

    //設置excel頁簽、formType、formName、beanName標題、beanTitle
    private void addSheetWithHead(GFormDaoImpl gformDao, GformExcelConf gformExcelConf, FormVersionDaoImpl versionDaoImpl, XStream xStream, Map<String, DynamicFormTemplate> formTemplateMap, Workbook workbook, CreationHelper creationHelper, Map<String, Sheet> sheetMap,boolean hasParent) {
        DynamicFormTemplate formTemplate=getLastFormTemplate(gformExcelConf.getFormType(), versionDaoImpl, xStream, formTemplateMap);
        if (formTemplate != null) {
            addSheetWithHead(workbook,creationHelper, sheetMap,formTemplate,gformExcelConf, hasParent);
            List<GformExcelConf> gformExcelConfList = gformDao.selectGformExcelConfByParent(gformExcelConf.getId());
            if (gformExcelConfList != null&&gformExcelConfList.size()>0) {
                gformExcelConf.setChildGeConfList(gformExcelConfList);
                for (GformExcelConf excelConf : gformExcelConfList) {
                    addSheetWithHead(gformDao,excelConf, versionDaoImpl, xStream,formTemplateMap,workbook,creationHelper,sheetMap,true);
                }
            }
        }
    }

    private void addSheetWithHead(Workbook workbook, CreationHelper createHelper, Map<String, Sheet> sheetMap,DynamicFormTemplate formTemplate, GformExcelConf gformExcelConf, boolean hasParent) {
        List<GformItemExcelConf> itemList = gformExcelConf.getItemList(formTemplate);
        if (CollectionUtils.isNotEmpty(itemList)) {
            List<Map<String, DynamicFormItem>> itemTemplateMaps = formTemplate.getItemTemplateMaps();
            if (CollectionUtils.isNotEmpty(itemTemplateMaps)) {
                List<List<ValueComment<String, String[][]>>> heads = new ArrayList<List<ValueComment<String, String[][]>>>();
                List<ValueComment<String, String[][]>> head0 = new ArrayList<ValueComment<String, String[][]>>();
                List<CellStyle> headStyles = new ArrayList<CellStyle>();
                List<CellStyle> dataStyles = new ArrayList<CellStyle>();
                heads.add(head0);
                List<ValueComment<String, String[][]>> head1 = new ArrayList<ValueComment<String, String[][]>>();
                heads.add(head1);
                int defaultCols=0;
                head0.add(new ValueComment<String, String[][]>("表單ID"));
                head1.add(new ValueComment<String, String[][]>("formId"));
                addCellStyle(workbook,headStyles,dataStyles,true);
                defaultCols++;
                if (hasParent) {
                    head0.add(new ValueComment<String, String[][]>("父表單ID"));
                    head1.add(new ValueComment<String, String[][]>("sourceId"));
                    addCellStyle(workbook,headStyles,dataStyles,true);
                    defaultCols++;
                }
                for (GformItemExcelConf itemExcelConf : itemList) {
                    DynamicFormItem itemTemplate = getItemTemplate(formTemplate, itemExcelConf);
                    if (itemTemplate != null) {
                        processHeadItemData(workbook, formTemplate, head0, headStyles, dataStyles, head1, itemExcelConf, itemTemplate);
                    }else{
                        head0.add(new ValueComment<String, String[][]>(itemExcelConf.getItemDesc()));
                        head1.add(new ValueComment<String, String[][]>(itemExcelConf.getItemNameOuter()));
                        addCellStyle(workbook,headStyles,dataStyles,false,itemExcelConf.getDataFormat());
                    }
                }
                WorkBookUtils.addSheetWithHead(workbook,createHelper, gformExcelConf.getFormDesc()+"("+gformExcelConf.getFormType()+")",sheetMap, heads,headStyles,dataStyles,defaultCols);
            }
        }
    }

    private void processHeadItemData(Workbook workbook, DynamicFormTemplate formTemplate, List<ValueComment<String, String[][]>> head0, List<CellStyle> headStyles, List<CellStyle> dataStyles, List<ValueComment<String, String[][]>> head1, GformItemExcelConf itemExcelConf, DynamicFormItem itemTemplate) {
        String controlType = itemTemplate.getControlType();
        String[] uiValueArray = itemTemplate.getUiValue();
        String[] uiDescArray = itemTemplate.getUiDesc();
        Boolean[] hasOther = itemTemplate.getHasOther();
        if (controlType.matches("^radio|select$")) {
            String[] uiSuper = itemTemplate.getUiSuper();
            String[] uiSuperDesc = null;
            if (!ArrayUtils.isEmpty(uiSuper)) {
                List<String> uiSuperDescList = new ArrayList<String>();
                List<String> uiDescList = new ArrayList<String>();
                DynamicFormItem itemTemplateParent = FormUtils.getItemTemplate(formTemplate, itemTemplate.getUiParent());
                String[] parentUiValue = itemTemplateParent.getUiValue();
                String[] parentUiDesc = itemTemplateParent.getUiDesc();
                Map<String, String> kv = new HashMap<String, String>();
                for (int i = 0; i < parentUiValue.length; i++) {
                    kv.put(parentUiValue[i], parentUiDesc[i]);
                }
                for (int i = 0; i < uiSuper.length; i++) {
                    if (uiSuper[i] != null) {
                        uiDescList.add(uiDescArray[i]);
                        uiSuperDescList.add(kv.get(uiSuper[i]));
                    }
                }
                uiDescArray = uiDescList.toArray(new String[0]);
                uiSuperDesc = uiSuperDescList.toArray(new String[0]);
            }
            String[][] comment = null;
            if (itemExcelConf.isShowDesc()){
            	comment = new String[][]{uiDescArray, uiSuperDesc};
            }else{
            	comment = new String[][]{uiValueArray, uiSuperDesc};
            }
            head0.add(new ValueComment<String, String[][]>(itemExcelConf.getItemDesc(), comment));
            head1.add(new ValueComment<String, String[][]>(itemExcelConf.getItemNameOuter()));
            addCellStyle(workbook,headStyles,dataStyles,itemTemplate.isRequired(),itemExcelConf.getDataFormat(itemTemplate));
            if (hasOther != null) {
                for (Boolean other : hasOther) {
                    if (other != null && other) {
                        head0.add(new ValueComment<String, String[][]>(itemExcelConf.getItemDesc() + ".其他"));
                        head1.add(new ValueComment<String, String[][]>(itemExcelConf.getItemNameOuter() + ".other"));
                        addCellStyle(workbook,headStyles,dataStyles,false);
                        break;
                    }
                }
            }
        } else if (controlType.matches("^checkbox$")) {
            for (int i = 0; i < uiDescArray.length; i++) {
                String[][] comment = null;
                if (itemExcelConf.isShowDesc()){
                	comment = new String[][]{{uiDescArray[i]}};
                }else{
                	comment = new String[][]{{uiValueArray[i]}};
                }
                head0.add(new ValueComment<String, String[][]>(itemExcelConf.getItemDesc()+"\r\n"+uiDescArray[i], comment));
                head1.add(new ValueComment<String, String[][]>(itemExcelConf.getItemNameOuter() + "(" + i + ")"));
                addCellStyle(workbook,headStyles,dataStyles,false);
                if (hasOther != null && hasOther.length > i && hasOther[i] != null && hasOther[i]) {
                    head0.add(new ValueComment<String, String[][]>(itemExcelConf.getItemDesc()+"\r\n"+uiDescArray[i] + ".其他"));
                    head1.add(new ValueComment<String, String[][]>(itemExcelConf.getItemNameOuter() + "(" + i + ").other"));
                    addCellStyle(workbook,headStyles,dataStyles,false);
                }
            }
        } else {
            head0.add(new ValueComment<String, String[][]>(itemExcelConf.getItemDesc()));
            head1.add(new ValueComment<String, String[][]>(itemExcelConf.getItemNameOuter()));
            addCellStyle(workbook,headStyles,dataStyles,itemTemplate.isRequired(),itemExcelConf.getDataFormat(itemTemplate));
        }
    }

    private void addCellStyle(Workbook workbook, List<CellStyle> headStyles, List<CellStyle> dataStyles, boolean require,String... format) {
        CellStyle headStyle = WorkBookUtils.getHeadStyle(workbook);
        headStyle.setWrapText(true);
        CellStyle dataStyle = WorkBookUtils.getDataStyle(workbook);
        if (require) {
            headStyle.setFillForegroundColor(IndexedColors.TAN.getIndex());
            dataStyle.setFillForegroundColor(IndexedColors.TAN.getIndex());
            dataStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }
        if (!ArrayUtils.isEmpty(format)&&StringUtils.isNotBlank(format[0])) {
            DataFormat dataFormat = workbook.createDataFormat();
            dataStyle.setDataFormat(dataFormat.getFormat(format[0]));
        }
        headStyles.add(headStyle);
        dataStyles.add(dataStyle);
    }

    /*
     * 獲取權限設定
     *
     * userId, permApp, permRes
     */
    public String checkPermissions(String json){
        M2Servlet m2Servlet = M2Servlet.getInstance();
        LoadingCache<String,String> cache = (LoadingCache<String,String>) m2Servlet.getServletContext().getAttribute("PermissionsCache");
        if (cache == null) {
            cache= CacheBuilder.newBuilder()
                    .expireAfterAccess(19, TimeUnit.SECONDS)
                    .expireAfterWrite(19, TimeUnit.SECONDS)
                    .build(new CacheLoader<String, String>() {
                @Override
                public String load(String integer) throws Exception {
                    return null;
                }
            });
            m2Servlet.getServletContext().setAttribute("PermissionsCache",cache);
        }
        String result = null;
        try {
            result = cache.get(json);
        } catch (Exception ignore) {}
        if (result == null) {
            Map<String, Object> resultSet = new HashMap<String, Object>();
            Map<String, Object> resultMsg = new HashMap<String, Object>();
            resultSet.put("resultMsg", resultMsg);
            try {
                if (JSON.isValidObject(json)) {
                    JSONObject jsonObject = JSON.parseObject(json);
                    if (jsonObject.containsKey("userId")
                            &&jsonObject.containsKey("permApp")
                            &&jsonObject.containsKey("permRes")
                    ) {
                        String login=jsonObject.getString("userId");
                        String permApp=jsonObject.getString("permApp");
                        String permRes=jsonObject.getString("permRes");
                        JSONArray permNc = jsonObject.getJSONArray("permNc");
                        NameAndComment[] permissions;
                        if (permNc != null) {
                            permissions = new NameAndComment[permNc.size()];
                            for (int i = 0; i < permNc.size(); i++) {
                                permissions[i] = new NameAndComment();
                                permissions[i].setName(permNc.getString(i));
                            }
                        }else
                            permissions = new GformPermissions().getPermissions();
                        if (!ArrayUtils.isEmpty(permissions)) {
                            Map<String, Object> data = new HashMap<String, Object>();
                            ResourceManageService rms = ResourceManageService.getInstance(m2Servlet);
                            String resourceId = rms.convertResNameToResId(permApp,permRes);
                            OrgService orgService = OrgService.getInstance(m2Servlet);
                            String userId = orgService.getUserIdFromLogin(login);
                            User staff= orgService.getUser(userId);
                            MemberConnection mConn = new MemberConnection(m2Servlet, staff);
                            Map<String,Boolean> permMap=new HashMap<String, Boolean>();
                            for (NameAndComment permission : permissions) {
                                try {
                                    boolean isPermitted= mConn.checkPermission(resourceId, permission.getName());
                                    permMap.put(permission.getName(), isPermitted);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                            try {
                                GFormDaoImpl gformDao = SpringWebApp.getObjectFromName("gFormDao");
                                UserDepart userDepart = gformDao.selectUserDepartList(login);
                                Set<String> departIds=null;
                                String possessive = staff.getProperty("possessive");
                                if (StringUtils.isNotBlank(possessive)) {
                                    String[] departs = possessive.split(",");
                                    departIds = new HashSet<String>(0);
                                    departIds.addAll(Arrays.asList(departs));
                                }
                                if (userDepart != null) {
                                    Set<String> departIdSet = userDepart.getDepartIds();
                                    if (departIdSet == null || departIdSet.size() == 0) {
                                        if (departIds == null) {
                                            departIds = new HashSet<String>(0);
                                        } else
                                            departIds.clear();
                                    } else {
                                        if (departIds == null) {
                                            departIds = departIdSet;
                                        } else {
                                            departIds.addAll(departIdSet);
                                        }
                                    }
                                }
                                data.put("departIds", departIds);
                            }catch (Exception ignore){

                            }
                            data.put("permissionMap", permMap);
                            resultMsg.put("success", true);
                            resultSet.put("data",data);
                        }
                    }
                    else{
                        resultMsg.put("success", false);
                        resultMsg.put("message", "缺少userId,permApp,permRes中的參數！");
                    }
                }else{
                    resultMsg.put("success", false);
                    resultMsg.put("message", "數據格式錯誤！");
                }
            } catch (Exception e) {
                resultMsg.put("success", false);
                resultMsg.put("message", ExceptionUtils.getFullStackTrace(e));
            }
            result = JsonUtils.toJson(resultSet);
            cache.put(json,result);
        }
        return result;
    }

    public List<FormFrame> selectGFormListVersions(String formType,Date ts) throws Exception{
        List<FormFrame> versions=new ArrayList<FormFrame>();
        HashMap map=new HashMap();
        map.put("formType",formType);
        if(ts!=null){
            map.put("diffTs",ts);
        }
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        List<FormFrame> formFrameList= frameDaoImpl.selectFormFrameListVersionByFormType(map);
        if(formFrameList!=null&&formFrameList.size()>0) {
            for(FormFrame formFrame:formFrameList){
                FormFrame db=new FormFrame();
                db.setFormType(formFrame.getFormType());
                db.setVersion(formFrame.getVersion());
                db.setTs(formFrame.getTs());
                db.setId(formFrame.getId());
                versions.add(db);
            }
        }
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        List<FormVersion> formVersionList=versionDaoImpl.selectFormVersionListVersionByFormType(map);
        if(formVersionList!=null&&formVersionList.size()>0) {
            for(FormVersion formVersion:formVersionList){
                FormFrame db=new FormFrame();
                db.setFormType(formVersion.getFormType());
                db.setVersion(formVersion.getVersion());
                db.setTs(formVersion.getTs());
                db.setId(formVersion.getId());
                versions.add(db);
            }
        }

        return versions.size()>0?versions:null;
    }

    @Override
    public List<FormFrame> selectAllFormFrameByFormType(String formType, Date ts) throws Exception {
        FormFrameDaoImpl frameDaoImpl = SpringWebApp.getObjectFromName("formFrameDao");
        HashMap map=new HashMap();
        map.put("formType",formType);
        return frameDaoImpl.selectAllFormFrameByFormType(map);
    }

    @Override
    public List<FormVersionToTemp> selectAllFormVersionFormType(String formType, Date ts) throws Exception {
        FormVersionDaoImpl versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
        HashMap map=new HashMap();
        map.put("formType",formType);
        List<FormVersion>formVersions= versionDaoImpl.selectAllFormVersionFormType(map);
        if(formVersions.size()>0){
            List<FormVersionToTemp> temp=new ArrayList<FormVersionToTemp>();
            for(FormVersion formVersion:formVersions){
                FormVersionToTemp formVersionToTemp=new FormVersionToTemp();
                formVersionToTemp.setId(formVersion.getId());
                formVersionToTemp.setTs(formVersion.getTs());
                formVersionToTemp.setVersion(formVersion.getVersion());
                formVersionToTemp.setFormType(formVersion.getFormType());
                formVersionToTemp.setFormModel(formVersion.getFormModel());
                formVersionToTemp.setTemplate(FormUtils.getFormTemplate(formVersion));
                temp.add(formVersionToTemp);
            }
            return temp;
        }
        return null;
    }

    @Override
    public String getCustomFormJsp(String formType) throws Exception {
        CustomFormService customFormService=new CustomFormServiceImpl();
        return customFormService.getCustomFormJsp(formType);
    }
    @Override
    public void updateCustomFormJsp(String json) throws Exception{
        CustomFormService customFormService=new CustomFormServiceImpl();
        customFormService.updateCustomFormJsp(json);
    }

}
