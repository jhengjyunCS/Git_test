package com.inqgen.nursing.dynamic.form.bean;

import com.inqgen.nursing.utils.FormUtils;
import org.apache.commons.collections.CollectionUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author RainKing
 * @since  2019/11/13 14:27
 */
public class GformExcelConf {
    private String id;
    private String formType;
    private String formDesc;
    private String parentForm;
    private List<GformItemExcelConf> itemList;
    Map<String, GformItemExcelConf> itemMap;
    private List<GformExcelConf> childGeConfList;
    DynamicFormTemplate formTemplate;
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFormType() {
        return formType;
    }

    public void setFormType(String formType) {
        this.formType = formType;
    }

    public String getFormDesc() {
        return formDesc;
    }

    public void setFormDesc(String formDesc) {
        this.formDesc = formDesc;
    }

    public String getParentForm() {
        return parentForm;
    }

    public void setParentForm(String parentForm) {
        this.parentForm = parentForm;
    }

    public DynamicFormTemplate getFormTemplate() {
        return formTemplate;
    }

    public void setFormTemplate(DynamicFormTemplate formTemplate) {
        this.formTemplate = formTemplate;
    }

    public List<GformItemExcelConf> getItemList(DynamicFormTemplate formTemplate) {
        setFormTemplate(formTemplate);
        if (formTemplate!=null&&(itemList == null ||itemList.isEmpty())) {
            setItemListFromItems(formTemplate.getItems());
            setItemListFromItems(formTemplate.getItems1());
        }
        return itemList;
    }

    public Map<String, GformItemExcelConf> getItemMap() {
        if (itemMap ==null&&CollectionUtils.isNotEmpty(itemList)) {
            itemMap = new HashMap<String, GformItemExcelConf>();
            for (GformItemExcelConf itemExcelConf : itemList) {
                if (itemExcelConf.getItemTemplate() == null) {
                    DynamicFormItem itemTemplate = FormUtils.getItemTemplate(formTemplate, itemExcelConf.getItemNameInner());
                    itemExcelConf.setItemTemplate(itemTemplate);
                }
                itemMap.put(itemExcelConf.getItemNameOuter(), itemExcelConf);
            }
        }
        return itemMap;
    }

    public void setItemMap(Map<String, GformItemExcelConf> itemMap) {
        this.itemMap = itemMap;
    }

    private void setItemListFromItems(DynamicFormItem... items) {
        if (items != null&&items.length>0) {
            if (itemList == null) {
                itemList = new ArrayList<GformItemExcelConf>();
            }
            for (DynamicFormItem itemTemplate : items) {
                itemList.add(new GformItemExcelConf(itemTemplate));
            }
        }
    }

    public List<GformItemExcelConf> getItemList() {
        return itemList;
    }

    public void setItemList(List<GformItemExcelConf> itemList) {
        this.itemList = itemList;
    }

    public List<GformExcelConf> getChildGeConfList() {
        return childGeConfList;
    }

    public void setChildGeConfList(List<GformExcelConf> childGeConfList) {
        this.childGeConfList = childGeConfList;
    }
}
