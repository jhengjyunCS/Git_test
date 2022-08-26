package com.inqgen.nursing.dynamic.form.controller;

import com.alibaba.fastjson.JSON;
import com.fto.m2.controller.ControllerException;
import com.fto.m2.controller.UnsupportedMimeTypeException;
import com.fto.m2.module.Output;
import com.fto.m2.module.StringComponent;
import com.fto.m2.service.org.OrgException;
import com.fto.m2.service.org.User;
import com.fto.m2.service.org.hb.HbGroup;
import com.fto.m2.servlet.RunData;
import com.inqgen.ehis.baseinfo.careinfo.CareInfoException;
import com.inqgen.ehis.baseinfo.careinfo.CareInfoService;
import com.inqgen.ehis.baseinfo.careinfo.Occupier;
import com.inqgen.ehis.baseinfo.encounter.EncounterException;
import com.inqgen.ehis.baseinfo.encounter.EncounterService;
import com.inqgen.ehis.baseinfo.encounter.ipd.IpdEncounter;
import com.inqgen.ehis.baseinfo.hisorg.Station;
import com.inqgen.ehis.baseinfo.patient.Patient;
import com.inqgen.ehis.baseinfo.patient.PatientInfoException;
import com.inqgen.ehis.baseinfo.patient.PatientInfoService;
import com.inqgen.nursing.base.AbstractController;
import com.inqgen.nursing.base.SpringWebApp;
import com.inqgen.nursing.dynamic.form.bean.*;
import com.inqgen.nursing.dynamic.form.dao.FormVersionDao;
import com.inqgen.nursing.dynamic.form.dao.impl.FormDaoImpl;
import com.inqgen.nursing.dynamic.form.dao.impl.FormFrameDaoImpl;
import com.inqgen.nursing.dynamic.form.dao.impl.FormVersionDaoImpl;
import com.inqgen.nursing.dynamic.form.dao.impl.GFormDaoImpl;
import com.inqgen.nursing.dynamic.form.tools.Glossary;
import com.inqgen.nursing.permissions.PermissionsUtils;
import com.inqgen.nursing.utils.FormUtils;
import com.thoughtworks.xstream.XStream;
import groovy.lang.Binding;
import groovy.lang.GroovyShell;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.net.URLEncoder;
import java.sql.Timestamp;
import java.util.*;


public class GFormController extends AbstractController {
    private String formType;
    private String addFormTemplate;
    private String listForm;
    private String addOrUpdateForm;
    private String printFormPrompt;
    private String printForm;
    private String permApp;
    private String permRes;
    private final String symbols[]={"-",","};
    protected void destroy() {

    }

    public Output doStart(RunData runData) throws ControllerException {
        String me="doStart(RunData runData) throws ControllerException";
        try{
            runData.setAttribute("formType", formType);
            DynamicFormTemplate formTemplate0=null;
            try {
                formTemplate0 = SpringWebApp.getObjectFromName(formType);
            } catch (Exception e) {
                log().println("沒有相應的spring bean "+formType);
            }
            if (formTemplate0!=null&&formTemplate0.getListPageGs() != null) {
                runGroovy(formTemplate0,runData,formTemplate0.getListPageGs());
            }
            if (!runData.getParameterBooleanValue("notSearch")) {
                String parentId = runData.getParameter("parentId");
                Map<String, Object> map = new HashMap<String, Object>();
                map.put("formType", formType);
                if(parentId.contains("%")){
                    map.put("isArray", true);
                    map.put("sourceId", runData.getAttribute("sourceId"));
                }else{
                    if (parentId.contains(",")) {
                        String[] source = parentId.split(",");
                        map.put("sourceId", source[source.length-1]);
                    }else{
                        map.put("sourceId", parentId);
                    }
                }
                map.put("items", runData.getAttribute("items"));
                GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
                List<GForm> gForms = formDao.selectFormWithItems(map);
                if (gForms != null) {
                    FormVersionDao formVersionDao = SpringWebApp.getObjectFromName("formVersionDao");
                    XStream xStream = FormUtils.getXStream();
                    Map<String, DynamicFormTemplate> formTemplateMap = new HashMap<String, DynamicFormTemplate>();
                    for (GForm gForm : gForms) {
                        String formVersionId = gForm.getFormVersionId();
                        gForm.setGformItemMap(gForm.getGformItems());
                        if (!formTemplateMap.containsKey(formVersionId)) {
                            FormVersion formVersion = formVersionDao.selectFormVersionById(formVersionId);
                            DynamicFormTemplate formTemplate = getFormTemplateFromXml(runData, formVersion, xStream);
                            formTemplateMap.put(formVersionId, formTemplate);
                        }
                    }
                    runData.setAttribute("formTemplateMap", formTemplateMap);
                }
                runData.setAttribute("forms", gForms);
            }
        }catch (Exception e){
            log().println(me,e);
        }
        return createJspComponent(runData, listForm, me);
    }

    /**
     * 取得病患基本資料
     * @param encid 病患就診號
     * @return IpdEncounter 病患基本資料
     * @throws com.inqgen.ehis.baseinfo.encounter.EncounterException
     */
    protected IpdEncounter getIpdEncounter(String encid) throws EncounterException {
        return (IpdEncounter) EncounterService.getInstance(servlet())
                .getSystem(EncounterService.IPD).getEncounter(encid);
    }
    
	public Output doCustomFormV3Start(RunData runData) throws ControllerException {
		String me="com.inqgen.nursing.customform.CustomFormController.doCustomFormV3Start(RunData)";
		
		String formType=runData.getParameter("formType");
		String formModel=runData.getParameter("formModel");
		String encid=runData.getParameter("encid");
		String encType=runData.getParameter("encType");
		String patientid = runData.getParameter("patientid");
		String frameModel = runData.getParameter("frameModel");
		String defaultUrl = runData.getParameter("defaultUrl");
		IpdEncounter enc = (IpdEncounter) runData.getSessionValue(Glossary.KEY_ENCOUNTER);
		try {
			if(enc==null && !"".equals(encid)){//處理外部接口傳來的enc信息 modify by leo 2016.8.17
				enc = getIpdEncounter(encid);
				runData.setSessionValue(Glossary.KEY_ENCOUNTER, enc);
			}else if(!"".equals(encid)){//處理工作清單傳來enc信息
				enc = getIpdEncounter(encid);
			}
		} catch (EncounterException e) {
			e.printStackTrace();
		}
		Patient pat=null;
		User user = null;
		try {
			patientid = "";
			if(enc != null){
				patientid = enc.getPatientId();
			}
			pat = PatientInfoService.getInstance(servlet()).getPatientByHisNum(patientid);
			user = runData.getMemberConnection().getSelf();
			//判斷是否具有修改他人表單的權限 add by leo 2016.11.30
			//setPerm(runData);
		} catch (PatientInfoException e1) {
			e1.printStackTrace();
		}

		String zoneId = (String) runData.getSessionValue(Glossary.KEY_ACTOR_ZONE);
		Station station=(Station) runData.getSessionValue(Glossary.KEY_STATION);
		
		FormDaoImpl formDaoImpl= SpringWebApp.getObjectFromName("formDao");
		HashMap map=new HashMap();
		//map.put("encId", encid);
		map.put("encIds", enc.getListIds());
		map.put("formType", formType);
		map.put("formModel",formModel);
	  	Object[] obj =  formDaoImpl.selectFromByMap(map);

		Occupier occ=null;
		try {
			occ = CareInfoService.getInstance(servlet(), CareInfoService.EncounterType_IPD).getOccupier(encid);
		}catch (CareInfoException e1) {
				e1.printStackTrace();
		}
	  	runData.setAttribute("encid", encid);
	  	runData.setAttribute("formType", formType);
	  	runData.setAttribute("frameModel", frameModel);
		runData.setAttribute("occ", occ);
		runData.setAttribute("pat", pat);
		runData.setAttribute("station", station);
		runData.setAttribute("zoneId", zoneId);
		runData.setAttribute("user", user);
	  	runData.setAttribute("formList", obj[0]);
	  	runData.setAttribute("formItemMap", obj[1]);
	  	runData.setAttribute("loginUserId", runData.getMemberConnection().getSelf().getLogin());
	  	

        runData.setAttribute("encType", encType);
		return createJspComponent(runData, "iq-nurs/nursing/customFormV3/"+defaultUrl, me);
	}
	
	public Output doCustomFormV4Start(RunData runData) throws ControllerException {
		String me="com.inqgen.nursing.customform.CustomFormController.doCustomFormV4Start(RunData)";
		
		String encId=runData.getParameter("encid");
		String patientId=runData.getParameter("patientid");
		String formType=runData.getParameter("formType");
		String sourceId=runData.getParameter("sourceId");
        String formId=runData.getParameter("formId");
        String otherPrem = runData.getParameter("otherPrem");
		String frameModel = runData.getParameter("frameModel");
		String defaultUrl = runData.getParameter("defaultUrl");
		String realPath = runData.getParameter("realPath");
		String hrefUrl = runData.getParameter("hrefUrl"); //在gform.jsp的下一個跳轉的頁面：只有當defaultUrl為gform.jsp且frameModel不是預設add/upd/list時才會用到
		User user = runData.getMemberConnection().getSelf();
		String userName = user.getFullName();
		String userId = user.getLogin();
		StringBuilder position = new StringBuilder();
		Enumeration<?> enumer = null;
		try {
			enumer = user.getParents();
		} catch (OrgException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        if (enumer != null) {
            while(enumer.hasMoreElements()){
                Object obj=enumer.nextElement();
                if(! (obj instanceof HbGroup)){
                    continue;
                }
                HbGroup group=(HbGroup)obj;
                position.append(",").append(group.getName());
            }
        }
        if (!StringUtils.EMPTY.equals(position.toString())){
			position = new StringBuilder(position.substring(1));
		}
		String possessive = "";
		try {
			possessive = user.getProperty("possessive");
		} catch (OrgException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
        String patStation = "";
        try {
            Occupier occupier = CareInfoService.getInstance(servlet(), CareInfoService.EncounterType_IPD).getOccupier(encId, patientId);
            runData.setAttribute("occupier", occupier);
            if (occupier != null) {
                patStation = occupier.getStation();
            }
            Patient patient = PatientInfoService.getInstance(servlet()).getPatientByHisNum(patientId);
            runData.setAttribute("patient", patient);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Station st = (Station) runData.getSessionValue(Glossary.KEY_STATION);
		String stationId=st==null?StringUtils.EMPTY:st.getId();
        if(StringUtils.isBlank(stationId)){
            stationId = patStation;
        }
		Map<String, String> paramMap = new HashMap<String, String>();
        try {
            paramMap.put("formType", formType);
            paramMap.put("encId", encId);
            paramMap.put("patientId", patientId);
            paramMap.put("stationId", stationId);
            paramMap.put("sourceId", sourceId);
            paramMap.put("frameModel", frameModel);
            paramMap.put("userId", userId);
            paramMap.put("userName", URLEncoder.encode(userName, "utf-8").replaceAll("%", "|A|"));
            paramMap.put("position", URLEncoder.encode(position.toString(), "utf-8").replaceAll("%", "|A|"));
            paramMap.put("possessive",URLEncoder.encode(possessive!=null?possessive:"", "utf-8").replaceAll("%", "|A|") );
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        //
        /* 讓sourceId可配置，取得 paramMap 的參數
         * 配置方法：給定sourceId，格式="@"開頭 "@"結束，且可加逗號","取得多組參數
         * 如：@patientId,encId@
         * 在m2_menu.xml配置方法如下
			<entry>
				<key>TSGHAdultDisnursing</key>
				<description>出院護理照護指導</description>
				<value class="com.inqgen.nursing.menu.MenuItem">
					<id>TSGHAdultDisnursing</id>
					<name>出院護理照護指導</name>
					<link>parent.changeFunction('customFormV4Start','customFormV4','&amp;formType=TSGHAdultDisnursing&amp;sourceId=@patientId,encId@&amp;frameModel=gFormWebLIST&amp;defaultUrl=gForm.jsp','N')</link>
				</value>
			</entry>
         */

        if (sourceId!=null&&sourceId.matches("^@.*@$")) {
            String  symbol=",";//默認逗號；愛愛院是-減號；別的醫院未知
            for(int i=0;i<symbols.length;i++){
                if(sourceId.contains(symbols[i])){
                    symbol=symbols[i];
                    break;
                }
            }
            String[] params =  sourceId.replaceAll("^@|@$", "").split(symbol);
            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i < params.length; i++) {
                if (i > 0) {
                    stringBuilder.append(symbol);
                }
                stringBuilder.append(StringUtils.defaultString(paramMap.get(params[i])));
            }
            sourceId = stringBuilder.toString();
        }
		defaultUrl+="?";
		defaultUrl+="formType="+formType;
		defaultUrl+="&encId="+encId;
		defaultUrl+="&patientId="+patientId;
		defaultUrl+="&stationId="+stationId;
		defaultUrl+="&sourceId="+(StringUtils.isNotBlank(sourceId) ? sourceId.trim() : formType);
		defaultUrl+="&frameModel="+frameModel;
		if (!StringUtils.isBlank(hrefUrl)){
			defaultUrl+="&hrefUrl="+hrefUrl;
		}
        if(StringUtils.isNotBlank(formId)){
            defaultUrl+="&formId="+formId;
        }
        if(StringUtils.isNotBlank(otherPrem)){
            defaultUrl+="&otherPrem="+otherPrem;
        }
        if(StringUtils.isNotBlank(realPath)){
            defaultUrl+="&realPath="+realPath;
        }
		defaultUrl+="&userId="+userId;
		defaultUrl+="&userName="+paramMap.get("userName");
		defaultUrl+="&position="+paramMap.get("position");
		defaultUrl+="&possessive="+paramMap.get("possessive");
		return createJspComponent(runData, "iq-nurs/nursing/customFormV4/"+defaultUrl, me);
	}

    public void init(RunData runData) {

    }

    public Output doAddFormTemplate(RunData runData) throws ControllerException {
        String me = "doAddFormTemplate(RunData runData) throws ControllerException";
        try {
            String template = runData.getParameter("template");
            if (template != null) {
                DynamicFormTemplate formTemplate = SpringWebApp.getObjectFromName(template);
                XStream xStream = FormUtils.getXStream();
                String xml = xStream.toXML(formTemplate);

                FormVersionDao versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
                int version = versionDaoImpl.selectMaxFormVersion(template);

                FormVersion formVersion = new FormVersion();
                formVersion.setId(FormUtils.getUUID());
                formVersion.setFormType(formTemplate.getFormType());
                if(formTemplate.getFormModel()==null){
                	formVersion.setFormModel(formTemplate.getFormType());
                }else{
                	formVersion.setFormModel(formTemplate.getFormModel());
                }
                formVersion.setTitle(formTemplate.getFormName());
                formVersion.setVersion(version + 1);
                formVersion.setContent(xml);
                User user = getUser(runData);
                formVersion.setCreatorId(user.getLogin());
                formVersion.setCreatorName(user.getFullName());
                formVersion.setCreateTime(new Date());
                versionDaoImpl.addOrUpdate(formVersion);

                runData.setAttribute("obj", formTemplate);
                runData.setAttribute("xml", xml);

            }
            runData.setAttribute("template", template);
        } catch (Exception e) {
            log().println("", e);
        }

        return createJspComponent(runData, addFormTemplate, me);
    }

    public void runGroovy(DynamicFormTemplate formTemplate,RunData runData, String groovy){
        if (groovy != null&&runData!=null) {
            Binding binding = new Binding();
            binding.setVariable("itSelf", formTemplate);
            binding.setVariable("runData", runData);
            GroovyShell gs = new GroovyShell(binding);
            gs.evaluate(groovy);
        }
    }

    public Output doAddFormPrompt(RunData runData) throws ControllerException {
        String me = "doAddFormPrompt(RunData runData) throws ControllerException";
        try {
            //權限處理
            if (permApp != null && permRes != null)
                PermissionsUtils.checkPermissions(runData, permApp, permRes, new GFormPermissions());
            String formType = runData.getParameter("formType");
            FormVersionDao versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
            FormVersion formVersion = versionDaoImpl.selectFormVersionMax(formType);
            XStream xStream =FormUtils.getXStream();
            DynamicFormTemplate formTemplate=getFormTemplateFromXml(runData, formVersion, xStream);
            runData.setAttribute("itemTemplateMaps", formTemplate.getItemTemplateMaps());
            runData.setAttribute("formVersionId", formVersion.getId());
            runData.setAttribute("now",new Date());
        } catch (Exception e) {
            log().println(me, e);
        }
        return createJspComponent(runData, addOrUpdateForm, me);
    }

    private DynamicFormTemplate getFormTemplateFromXml(RunData runData, FormVersion formVersion, XStream xStream) {
        DynamicFormTemplate formTemplate;
        try {
            formTemplate = (DynamicFormTemplate) xStream.fromXML(formVersion.getContent());
        } catch (Exception e) {
            xStream = FormUtils.getXStream();
            xStream.alias("FormTemplate",DynamicFormTemplate.class);
            xStream.alias("FormItemTemplate", DynamicFormItem.class);
            formTemplate = (DynamicFormTemplate) xStream.fromXML(formVersion.getContent());
        }
        if (formTemplate != null) {
            if (formTemplate.getItemTemplateMaps() == null) {
                formTemplate.setItems(formTemplate.getItems());
            }
            runGroovy(formTemplate, runData, formTemplate.getGroovyShellUi());
        }
        return formTemplate;
    }

    public Output doUpdateFormPrompt(RunData runData) throws ControllerException {
        String me = "doUpdateFormPrompt(RunData runData) throws ControllerException";
        try {
            //權限處理
            if (permApp != null && permRes != null)
                PermissionsUtils.checkPermissions(runData, permApp, permRes, new GFormPermissions());
            String formType = runData.getParameter("formType");
            String formId = runData.getParameter("formId");
            GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
            Map<String, String> map = new HashMap<String, String>();
            map.put("formType", formType);
            map.put("formId", formId);
            GForm gForm = formDao.selectFormByFormId(map);
            if (gForm != null) {
                FormVersionDao versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
                FormVersion formVersion = versionDaoImpl.selectFormVersionById(gForm.getFormVersionId());
                XStream xStream =FormUtils.getXStream();
                DynamicFormTemplate formTemplate = getFormTemplateFromXml(runData,formVersion,xStream);
                runData.setAttribute("itemTemplateMaps", formTemplate.getItemTemplateMaps());
                runData.setAttribute("formVersionId", formVersion.getId());
                runData.setAttribute("form", gForm);
                runData.setAttribute("now",new Date());
            }
        } catch (Exception e) {
            log().println(me, e);
        }
        return createJspComponent(runData, addOrUpdateForm, me);
    }

    public Output doAddOrUpdateForm(RunData runData) {
        String me="doAddForm(RunData runData) throws ControllerException";
        String oldFormId= runData.getParameter("formId");
        String formType=runData.getParameter("formType");
        String formVersionId=runData.getParameter("formVersionId");
        String status=runData.getParameter("status");
        String evalDate=runData.getParameter("evalDate");
        String evalTime=runData.getParameter("evalTime");
        String totalScore=runData.getParameter("totalScore");
        String parentId = runData.getParameter("parentId");

        try {
            FormVersionDaoImpl versionDaoImpl=SpringWebApp.getObjectFromName("formVersionDao");
            FormVersion formVersion = versionDaoImpl.selectFormVersionById(formVersionId);
            DynamicFormTemplate formTemplate=null;
            if (formVersion != null) {
                XStream xStream = FormUtils.getXStream();
                formTemplate = getFormTemplateFromXml(runData,formVersion,xStream);

            }
            if (formTemplate != null) {
                GFormDaoImpl gFormDaoImpl = SpringWebApp.getObjectFromName("gFormDao");

                GForm gForm = new GForm();
                gForm.setFdocId(FormUtils.getUUID());
                gForm.setFormType(formType);
                Date inputDate = DateUtils.parseDate(evalDate + evalTime, new String[]{"yyyy/MM/ddHHmm"});
                gForm.setEvaluationTime(inputDate);
                gForm.setFormVersionId(formVersionId);
                User user = getUser(runData);
                String userId = user.getLogin();
                String userName = user.getFullName();
                if (StringUtils.isNotBlank(oldFormId)) {
                    Map<String, String> map = new HashMap<String, String>();
                    map.put("formType", formType);
                    map.put("formId", oldFormId);
                    GForm oldGForm = gFormDaoImpl.selectFormByFormId(map,true);
                    gForm.setFormId(oldFormId);
                    gForm.setCreatorId(oldGForm.getCreatorId());
                    gForm.setCreatorName(oldGForm.getCreatorName());
                    gForm.setCreateTime(oldGForm.getModifyTime()==null? oldGForm.getCreateTime(): oldGForm.getModifyTime());
                    gForm.setModifyUserId(userId);
                    gForm.setModifyUserName(userName);
                    gForm.setModifyTime(new Date());
                }else{
                    gForm.setFormId(gForm.getFdocId());
                    gForm.setCreatorId(userId);
                    gForm.setCreatorName(userName);
                    gForm.setCreateTime(new Date());
                }

                if (StringUtils.isNotBlank(totalScore)) {
                    gForm.setTotalScore(totalScore);
                }
                if (StringUtils.isNotBlank(status)) {
                    gForm.setStatus(status);
                }
                addFormByUI(runData, formTemplate, gForm);
                gFormDaoImpl.addOrUpdateForm(oldFormId, gForm,parentId);
            }

        } catch (Exception e) {
            log().println(me, e);
        }
        StringBuilder params = new StringBuilder();
        if(StringUtils.isNotBlank(parentId))
            params.append("&parentId=").append(parentId);

        if (params.length() > 0) {
            int i = params.indexOf("&", 0);
            if (i > -1) {
                params.deleteCharAt(i);
            }
            params.insert(0, '?');
        }
        return createRedirect("m2/"+this.getName()+"/start"+params.toString());
    }

    public Output doDeleteForm(RunData runData) throws ControllerException{
        String me = "doDeleteForm(RunData runData) throws ControllerException";
        try {
            String oldFormId = runData.getParameter("formId");
            String parentId = runData.getParameter("parentId");
            GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
            if (StringUtils.isNotBlank(parentId)) {
                formDao.deleteFormIndex(oldFormId);
            }
            formDao.deleteForm(oldFormId);
        } catch (Exception e) {
            log().println(me,e);
        }
        return doStart(runData);
    }

    private void addFormByUI(RunData runData,DynamicFormTemplate formTemplate,GForm gForm) {
        String[] itemKeys=runData.getParameterValues("formItem");
        List<Map<String, DynamicFormItem>> itemTemplateMaps = formTemplate.getItemTemplateMaps();
        Map<String, GFormItem> formItemMap = gForm.getGformItemMap();
        for (String itemKey : itemKeys) {
            DynamicFormItem itemTemplate;
            for (Map<String, DynamicFormItem> itemTemplateMap : itemTemplateMaps) {
                itemTemplate = itemTemplateMap.get(itemKey);
                if (itemTemplate != null) {
                    String controlType = itemTemplate.getControlType();
                    if ("checkbox".equals(controlType)) {
                        String[] itemValues = runData.getParameterValues(itemKey);
                        if (itemValues != null) {
                            String value = Arrays.toString(itemValues).replaceAll("\\[|\\s+|]", "");
                            GFormItem gFormItem = produceGformItem(gForm, itemKey, value);
                            Boolean[] hasO = itemTemplate.getHasOther();
                            if (hasO != null) {
                                String[] uiValue = itemTemplate.getUiValue();
                                StringBuilder others = null;
                                for (int i = 0,j=0; i < uiValue.length; i++) {
                                    String s = uiValue[i];
                                    if (ArrayUtils.indexOf(itemValues,s)>-1) {
                                        if (others == null) {
                                            others = new StringBuilder();
                                        }
                                        if (hasO[i]!=null&&hasO[i]) {
                                            String other = runData.getParameter(itemKey + "Other"+i);
                                            others.append(StringUtils.isNotBlank(other)?other:"!");
                                        }else{
                                            others.append("!");
                                        }
                                        if (j < itemValues.length - 1) {
                                            others.append("@_@");
                                        }
                                        j++;
                                    }
                                }
                                if (others != null&&others.length()>0) {
                                    gFormItem.setOtherValue(others.toString());
                                }
                            }
                            if (formItemMap == null) {
                                formItemMap=new HashMap<String, GFormItem>();
                                gForm.setGformItemMap(formItemMap);
                            }
                            formItemMap.put(itemKey, gFormItem);
                        }
                    }
                    else{
                        String itemValue = runData.getParameter(itemKey);
                        if (StringUtils.isNotBlank(itemValue)) {
                            GFormItem gFormItem = produceGformItem(gForm, itemKey, itemValue);
                            if ("radio".equals(controlType)){
                                Boolean[] hasO = itemTemplate.getHasOther();
                                if (hasO != null) {
                                    String[] uiValue = itemTemplate.getUiValue();
                                    for (int i = 0; i < uiValue.length; i++) {
                                        String s = uiValue[i];
                                        if (itemValue.equals(s)) {
                                            if (hasO[i]!=null&&hasO[i]) {
                                                String other = runData.getParameter(itemKey + "Other"+i);
                                                gFormItem.setOtherValue(other);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                            if (formItemMap == null) {
                                formItemMap=new HashMap<String, GFormItem>();
                                gForm.setGformItemMap(formItemMap);
                            }
                            formItemMap.put(itemKey, gFormItem);
                        }
                    }
                    break;
                }
            }
        }
        if (formItemMap != null) {
            gForm.setGformItems(new ArrayList<GFormItem>(formItemMap.values()));
        }
    }

    private GFormItem produceGformItem(GForm gForm, String itemKey, String value) {
        GFormItem gFormItem = new GFormItem();
        gFormItem.setFormItemId(FormUtils.getUUID());
        gFormItem.setItemKey(itemKey);
        gFormItem.setItemValue(value);
        gFormItem.setModifyTime(new Date());
        return gFormItem;
    }

    public Output doCheckExists(RunData runData){
        String key = runData.getParameter("key");
        String value = runData.getParameter("value");
        GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
        Map<String, String> item = new HashMap<String, String>();
        item.put("key", key);
        item.put("value", value);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("formType", formType);
        map.put("items",new Map[]{item});
        List<GForm> gForms = formDao.selectFormAutoItems(map);
        String result = gForms ==null|| gForms.size()==0?"false":"true";
        return new StringComponent(result);
    }

    public Output doPublishFormTemplate(RunData runData) throws UnsupportedMimeTypeException {
        String me = "doPublishFormTemplate(RunData runData) throws ControllerException";
        try {
            String formId = runData.getParameter("formId");
            String formType = runData.getParameter("formType");
            String isImport = runData.getParameter("isImport");
            runData.setAttribute("isImport", isImport);
            GFormDaoImpl formDao = SpringWebApp.getObjectFromName("gFormDao");
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("formType", formType);
            map.put("formId", formId);
            map.put("hasContent", true);
            GForm gForm = formDao.selectFormByFormId(map);
            String content = gForm.getContent();
            List<GFormItem> gFormItems;
            if (JSON.isValidArray(content)){
                gFormItems = JSON.parseArray(content, GFormItem.class);
            }else{
            	gFormItems = gForm.getGformItems();
            }
            if (gFormItems != null) {
                Map<String, Object> formTemplateMap = new HashMap<String, Object>();
                Map<String, String> itemsMap = new HashMap<String, String>();
                Map<String, List<DynamicFormItem>> itemListMap = new HashMap<String, List<DynamicFormItem>>();
                for (GFormItem gFormItem : gFormItems) {
                    String key = gFormItem.getItemKey().replaceFirst("^ft", "");
                    String c = key.substring(0,1);
                    key = key.replaceFirst(c, c.toLowerCase());
                    if (!key.contains("items") && !key.contains("apis")) {
                        formTemplateMap.put(key, gFormItem.getItemValue());
                    }else if(key.contains("apis")) {
                    	String apisJSONString = gFormItem.getItemValue();
                        if (JSON.isValidArray(apisJSONString)) {
                            formTemplateMap.put(key, JSON.parseArray(apisJSONString,FormApiTemplate.class));
                        }

                	}else{
                        itemsMap.put(key, gFormItem.getItemValue());
                    }
                }

                DynamicFormTemplate formTemplate = new DynamicFormTemplate();
                BeanUtils.populate(formTemplate,formTemplateMap);
                Map<String, Object> map1 = new HashMap<String, Object>();
                map1.put("sourceId", gForm.getFormId());
                map1.put("formType","formItemTemplate");
                map1.put("status","Y");
                map1.put("hasContent", true);
                List<GForm> gForms = formDao.selectFormWithItems(map1);
                if (gForms != null) {
                    Field[] fields = DynamicFormItem.class.getDeclaredFields();
                    Map<String, Field> fieldMap = new HashMap<String, Field>();
                    for (Field field : fields) {
                        fieldMap.put(field.getName(), field);
                    }
                    for (GForm gForm1 : gForms) {
                        List<GFormItem> gFormItems1;
                        String content2 = gForm1.getContent();
                        if (JSON.isValidArray(content2)){
                            gFormItems1 = JSON.parseArray(content2, GFormItem.class);
                        }else{
                        	gFormItems1 = gForm1.getGformItems();
                        }
                        if (gFormItems1 != null) {
                            Map<String, Object> formItemTemplateMap = new HashMap<String, Object>(gFormItems1.size());
                            for (GFormItem gFormItem : gFormItems1) {
                                String key = gFormItem.getItemKey().replaceFirst("^fit", "");
                                String c = key.substring(0,1);
                                key = key.replaceFirst(c,c.toLowerCase());
                                String itemValue = gFormItem.getItemValue();
                                Field field = fieldMap.get(key);
                                if (field != null) {
                                    if (itemValue!=null&&field.getType().isArray()){
                                        formItemTemplateMap.put(key, itemValue.split(","));
                                    }else{
                                        formItemTemplateMap.put(key, itemValue);
                                    }
                                }
                            }
                            DynamicFormItem formItemTemplate = new DynamicFormItem();
                            BeanUtils.populate(formItemTemplate,formItemTemplateMap);
                            for (Map.Entry<String, String> items : itemsMap.entrySet()) {
                                if(items.getValue()!=null && items.getValue().contains(formItemTemplate.getName())){
                                    List<DynamicFormItem> dynamicFormItems = itemListMap.get(items.getKey());
                                    if (dynamicFormItems == null) {
                                        dynamicFormItems = new ArrayList<DynamicFormItem>();
                                        itemListMap.put(items.getKey(), dynamicFormItems);
                                    }
                                    dynamicFormItems.add(formItemTemplate);
                                    break;
                                }
                            }

                        }
                    }
                    if (itemListMap.size() > 0) {
                        Map<String, DynamicFormItem[]> itemArrayMap = new HashMap<String, DynamicFormItem[]>();
                        for (Map.Entry<String, List<DynamicFormItem>> entry : itemListMap.entrySet()) {
                            itemArrayMap.put(entry.getKey(), entry.getValue().toArray(new DynamicFormItem[0]));
                        }
                        BeanUtils.populate(formTemplate,itemArrayMap);
                    }
                }
                String template = formTemplate.getFormType();
                if (template != null) {
                    XStream xStream = FormUtils.getXStream();
                    formTemplate.setFormModel(formTemplate.getFormType());
                    xStream.omitField(DynamicFormTemplate.class,"itemTemplateMaps");
                    String xml = xStream.toXML(formTemplate);

                    FormVersionDao versionDaoImpl = SpringWebApp.getObjectFromName("formVersionDao");
                    int version = versionDaoImpl.selectMaxFormVersion(template);

                    FormVersion formVersion = new FormVersion();
                    formVersion.setId(FormUtils.getUUID());
                    formVersion.setFormType(formTemplate.getFormType());
                    if(formTemplate.getFormModel()==null){
                    	formVersion.setFormModel(formTemplate.getFormType());
                    }else{
                    	formVersion.setFormModel(formTemplate.getFormModel());
                    }
                    formVersion.setTitle(formTemplate.getFormName());

            		FormFrameDaoImpl frameDaoImpl= SpringWebApp.getObjectFromName("formFrameDao");
            		HashMap<String,String> map2=new HashMap<String,String>();
            		map2.put("formType", formTemplate.getFormType());
            		int frameVersion=frameDaoImpl.selectFormFrameMaxVersionByFormType(map2);
            		version= Math.max(frameVersion, version);

                    formVersion.setVersion(version + 1);
                    formVersion.setContent(xml);
                    formVersion.setTs(new Timestamp(System.currentTimeMillis()));
                    versionDaoImpl.addOrUpdate(formVersion);

                    runData.setAttribute("obj", formTemplate);
                    runData.setAttribute("xml", xml);

                }
                runData.setAttribute("template", template);
            }
        } catch (Exception e) {
            log().println("", e);
        }

        return createJspComponent(runData, addFormTemplate, me);
    }

    public String getAddFormTemplate() {
        return addFormTemplate;
    }

    public void setAddFormTemplate(String addFormTemplate) {
        this.addFormTemplate = addFormTemplate;
    }

    public String getListForm() {
        return listForm;
    }

    public void setListForm(String listForm) {
        this.listForm = listForm;
    }

    public String getAddOrUpdateForm() {
        return addOrUpdateForm;
    }

    public void setAddOrUpdateForm(String addOrUpdateForm) {
        this.addOrUpdateForm = addOrUpdateForm;
    }


    public String getPrintFormPrompt() {
        return printFormPrompt;
    }

    public void setPrintFormPrompt(String printFormPrompt) {
        this.printFormPrompt = printFormPrompt;
    }

    public String getPrintForm() {
        return printForm;
    }

    public void setPrintForm(String printForm) {
        this.printForm = printForm;
    }

    public String getPermApp() {
        return permApp;
    }

    public void setPermApp(String permApp) {
        this.permApp = permApp;
    }

    public String getPermRes() {
        return permRes;
    }

    public void setPermRes(String permRes) {
        this.permRes = permRes;
    }

    public String getFormType() {
        return formType;
    }

    public void setFormType(String formType) {
        this.formType = formType;
    }
}
