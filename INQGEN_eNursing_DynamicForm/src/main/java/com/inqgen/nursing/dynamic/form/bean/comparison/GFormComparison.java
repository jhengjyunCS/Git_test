package com.inqgen.nursing.dynamic.form.bean.comparison;

import com.alibaba.fastjson.JSON;
import com.inqgen.nursing.base.SpringWebApp;
import com.inqgen.nursing.dynamic.form.bean.GForm;
import com.inqgen.nursing.dynamic.form.bean.GFormItem;
import com.inqgen.nursing.dynamic.form.dao.impl.GFormComparisonImpl;
import org.apache.commons.lang.StringUtils;

import java.io.FileInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * GForm Item value 对照表
 * @Author wang
 * @Date 2022/2/10 14:39
 */
public class GFormComparison {

    private static boolean open = false;
    private static Map<String, Map<String, GFormComparisonItem>> compDataMap;

    /**
     * 查询配置档，开启数据对照并查询对照表数据
     */
    static {
        try {
            Properties pro = new Properties();
            pro.load(new FileInputStream(GFormComparison.class.getResource("/baseConfig.properties").getPath()));
            open = Boolean.parseBoolean(pro.getProperty("gFormComparisonOpen"));
        } catch (Exception e) {
            open = false;
        }
    }

    /**
     * 查询对照表数据
     */
    private static void setComparisonDate() {
        compDataMap = new HashMap<String, Map<String, GFormComparisonItem>>();
        try {
            GFormComparisonImpl gFormComparison = SpringWebApp.getObjectFromName("gFormComparison");
            List<GFormComparisonItem> comparisonItems = gFormComparison.selectGFormComparisonItemList();
            if (comparisonItems != null && comparisonItems.size() > 0) {
                for (GFormComparisonItem comparisonItem : comparisonItems) {
                    Map<String, String> pram = new HashMap<String, String>();
                    pram.put("eventType", comparisonItem.getEventType());
                    pram.put("itemKey", comparisonItem.getItemKey());
                    List<GFormComparisonValue> gFormComparisonValues = gFormComparison.selectGFormComparisonValueList(pram);
                    comparisonItem.setComparisonValues(gFormComparisonValues);
                    String pKey = comparisonItem.getEventType();
                    Map<String, GFormComparisonItem> itemMap = compDataMap.get(pKey);
                    if (itemMap == null || itemMap.size() < 1) {
                        itemMap = new HashMap<String, GFormComparisonItem>();
                    }
                    itemMap.put(comparisonItem.getItemKey(), comparisonItem);
                    compDataMap.put(pKey, itemMap);
                }
            }
        }catch (Exception e){
            compDataMap = null;
            e.printStackTrace();
        }
    }

    /**
     * 对照 GForm 数据
     * @param gForm
     */
    private static void setGFormData(GForm gForm) {
        try {
            if (compDataMap == null) {
                setComparisonDate();
            }
            if (compDataMap != null && compDataMap.size() > 0 && gForm != null) {
                Map<String, GFormComparisonItem> gFormComparisonItemMap = compDataMap.get(gForm.getFormType());
                if(gFormComparisonItemMap!=null && gFormComparisonItemMap.size()>0){
                    if(StringUtils.isNotBlank(gForm.getContent())){
                        GFormItem[] items = JSON.parseObject(gForm.getContent(), GFormItem[].class);
                        for(GFormItem gFormItem : items){
                            setGFormItemData(gFormItem, gFormComparisonItemMap);
                        }
                        gForm.setContent(JSON.toJSONString(items));
                    }
                    if(gForm.getGformItems()!=null && gForm.getGformItems().size()>0) {
                        for(GFormItem gFormItem : gForm.getGformItems()){
                            setGFormItemData(gFormItem, gFormComparisonItemMap);
                        }
                    }
                    gForm.getGformItemMap();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 匹配 itemValue 并替换
     * @param gFormItem
     * @param gFormComparisonItemMap
     */
    private static void setGFormItemData(GFormItem gFormItem, Map<String, GFormComparisonItem> gFormComparisonItemMap){
        GFormComparisonItem comparisonItem = gFormComparisonItemMap.get(gFormItem.getItemKey());
        if(comparisonItem!=null && comparisonItem.getComparisonValues()!=null && comparisonItem.getComparisonValues().size()>0){
            for(GFormComparisonValue comparisonValue : comparisonItem.getComparisonValues()){
                if(comparisonValue!=null && comparisonValue.getUiValue()!=null){
                    if(comparisonValue.getUiValue().equals(gFormItem.getItemValue())){
                        gFormItem.setItemValue(comparisonValue.getvKey());
                    }
                }
            }
        }
    }

    /**
     * 获取状态
     * @return
     */
    public static boolean openStatus() {
        return open;
    }

    /**
     * 获取当前对照表数据
     * @return
     */
    public static Map<String, Map<String, GFormComparisonItem>> getComparisonData() {
        if(open && compDataMap == null){
            setComparisonDate();
        }
        return compDataMap;
    }

    /**
     * 刷新对照表数据
     */
    public static void getNewComparisonData() {
        setComparisonDate();
    }

    /**
     * 开启对照表 & 获取对照表单数据
     */
    public static void openGFormComparison(){
        open = true;
        setComparisonDate();
    }

    /**
     * 关闭对照表
     */
    public static void closeGFormComparison(){
        open = false;
        compDataMap = null;
    }

    /**
     * 设置对照表数据
     * @param gForm
     * @return
     */
    public static GForm setGFormComparison(GForm gForm) {
        if (open) {
            setGFormData(gForm);
        }
        return gForm;
    }

    /**
     * 设置对照表数据
     * @param gFormList
     * @return
     */
    public static List<GForm> setGFormComparison(List<GForm> gFormList) {
        if (open) {
            if (gFormList != null && gFormList.size() > 0) {
                for (GForm gForm : gFormList) {
                    setGFormData(gForm);
                }
            }
        }
        return gFormList;
    }

}
