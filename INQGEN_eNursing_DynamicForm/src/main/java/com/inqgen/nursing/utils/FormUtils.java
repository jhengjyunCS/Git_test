package com.inqgen.nursing.utils;

import com.inqgen.nursing.dynamic.form.bean.DynamicFormItem;
import com.inqgen.nursing.dynamic.form.bean.DynamicFormTemplate;
import com.inqgen.nursing.dynamic.form.bean.FormVersion;
import com.inqgen.nursing.dynamic.form.bean.GFormItem;
import com.thoughtworks.xstream.XStream;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * @author RainKing
 * @date 2019/6/6 13:52
 */
public class FormUtils {
    public static XStream getXStream() {
        XStream xStream = new XStream();
        XStream.setupDefaultSecurity(xStream);
        xStream.allowTypesByRegExp(new String[]{".*"});
        Class<?>[] classes = {DynamicFormTemplate.class, DynamicFormItem.class};
        xStream.processAnnotations(classes);
        xStream.autodetectAnnotations(true);
        return xStream;
    }

    public static String getUUID(){
        return UUID.randomUUID().toString();//.replace("-", "");
    }

    public static DynamicFormTemplate getFormTemplate(FormVersion formVersion) {
        if (formVersion == null) return null;
        DynamicFormTemplate formTemplate = getFormTemplate(formVersion.getContent());
        if (formTemplate == null) return null;
        formTemplate.setFormVersionId(formVersion.getId());
        formTemplate.setVersion(formVersion.getVersion());
        return formTemplate;
    }
    public static DynamicFormTemplate getFormTemplate(FormVersion formVersion, XStream xStream) {
        if (formVersion == null) return null;
        DynamicFormTemplate formTemplate = getFormTemplate(formVersion.getContent(),xStream);
        if (formTemplate == null) return null;
        formTemplate.setFormVersionId(formVersion.getId());
        formTemplate.setVersion(formVersion.getVersion());
        return formTemplate;
    }

    public static DynamicFormTemplate getFormTemplate(String content) {
        if (content == null) return null;
        XStream xStream = getXStream();
        return getFormTemplate(content,xStream);
    }
    public static DynamicFormTemplate getFormTemplate(String content, XStream xStream) {
        if (content == null) return null;
        DynamicFormTemplate formTemplate = (DynamicFormTemplate) xStream.fromXML(content);
        formTemplate.runGroovyToUI();
        return formTemplate;
    }

    public static DynamicFormItem getItemTemplate(DynamicFormTemplate formTemplate, String itemKey) {
        return getItemTemplate(formTemplate.getItemTemplateMaps(), itemKey);
    }

    public static DynamicFormItem getItemTemplate(List<Map<String, DynamicFormItem>> itemTemplateMaps, String itemKey) {
        DynamicFormItem itemTemplate = null;
        for (Map<String, DynamicFormItem> itemTemplateMap : itemTemplateMaps) {
            itemTemplate = itemTemplateMap.get(itemKey);
            if (itemTemplate != null) {
                break;
            }
        }
        return itemTemplate;
    }

    public static String getItemValueDesc(DynamicFormTemplate formTemplate, GFormItem gformItem) {
        String itemKey = gformItem.getItemKey();
        String itemValue = gformItem.getItemValue();
        DynamicFormItem mainContactName = FormUtils.getItemTemplate(formTemplate, itemKey);
        String[] uiValue = mainContactName.getUiValue();
        String[] uiDesc = mainContactName.getUiDesc();
        if(uiValue!=null) {
            if (itemValue.contains(",")) {
                String[] itemValues = itemValue.split(",");
                List<String> valueArr = new ArrayList<String>();
                for (String value : itemValues) {
                    for (int i = 0; i < uiValue.length; i++) {
                        if (value.equals(uiValue[i])) {
                            valueArr.add(uiDesc[i]);
                        }
                    }
                }
                return StringUtils.join(valueArr, ",");
            } else {
                for (int i = 0; i < uiValue.length; i++) {
                    if (itemValue.equals(uiValue[i])) {
                        return uiDesc[i];
                    }
                }
            }
        }else{
            return itemValue;
        }
        return null;
    }

}
