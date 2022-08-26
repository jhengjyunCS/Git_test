package com.inqgen.nursing.tag;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.inqgen.nursing.dynamic.form.bean.DynamicFormItem;
import com.inqgen.nursing.dynamic.form.bean.DynamicFormTemplate;
import com.inqgen.nursing.dynamic.form.bean.GForm;
import com.inqgen.nursing.dynamic.form.bean.GFormItem;
import org.apache.commons.lang.StringUtils;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;
import java.util.*;

public class GformToDocument extends TagSupport {
    //動作；print,list,add,update
    private String action;

    private DynamicFormTemplate template;

    private GForm gForm;

    private String beanName;

    private String groupBeanName;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public DynamicFormTemplate getTemplate() {
        return template;
    }

    public void setTemplate(DynamicFormTemplate template) {
        this.template = template;
    }

    public GForm getgForm() {
        return gForm;
    }

    public void setgForm(GForm gForm) {
        this.gForm = gForm;
    }

    public String getBeanName() {
        return beanName;
    }

    public void setBeanName(String beanName) {
        this.beanName = beanName;
    }

    public String getGroupBeanName() {
        return groupBeanName;
    }

    public void setGroupBeanName(String groupBeanName) {
        this.groupBeanName = groupBeanName;
    }

    public int doStartTag() throws JspException {
        try {
            JspWriter out = pageContext.getOut();
            template.setItems(template.getItems());
            List<Map<String, DynamicFormItem>> mapList= template.getItemTemplateMaps();
            String html=showPrintUi(gForm.getGformItemMap(),mapList.get(0),beanName);
            out.write( html);
        } catch (Exception e) {
            throw new JspException(e.getMessage());
        }
        return EVAL_PAGE;
    }
    public String showPrintUi( Map<String, GFormItem> gFormItemMap,
                               Map<String, DynamicFormItem> dynamicFormItemMap,
                               String bean){
        DynamicFormItem dynamicFormItem=dynamicFormItemMap.get(bean);
        String controlType=dynamicFormItem.getControlType();
        String ui="";
        try {
            if (("print".equals(action) || "list".equals(action) )&& gFormItemMap.containsKey(bean)) {
                if ("text".equals(controlType) || "textarea".equals(controlType)
                ||"hidden".equals(controlType)||"date".equals(controlType)
                ||"time".equals(controlType)||"datetime".equals(controlType)
                ) {
                    ui = processText(gFormItemMap, dynamicFormItemMap, bean);
                } else if ("radio".equals(controlType)) {
                    ui = processRadio(gFormItemMap, dynamicFormItemMap, bean);
                } else if ("checkbox".equals(controlType)) {
                    ui = processCheckbox(gFormItemMap, dynamicFormItemMap, bean);
                } else if ("select".equals(controlType)) {
                    ui = processSelect(gFormItemMap, dynamicFormItemMap, bean);
                } else if ("group".equals(controlType)) {
                    ui = processGroup(gFormItemMap, dynamicFormItemMap, bean);
                } else {
                    //hidden,date,time,datetime,label
                    ui = gFormItemMap.get(bean).getItemValue();
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return ui;

    }
    private int getIndexInUiValue(String uiValue[],String itemValue){
        int index =-1;
        for(int i=0;i<uiValue.length;i++){
            if(uiValue[i].equals(itemValue)){
                index=i;
                break;
            }
        }
        return index;
    }
    private String processRadio( Map<String, GFormItem> gFormItemMap,
                                Map<String, DynamicFormItem> dynamicFormItemMap,
                                String bean ){

        DynamicFormItem dynamicFormItem=dynamicFormItemMap.get(bean);
        GFormItem gFormItem=gFormItemMap.get(bean);
        String itemValue = gFormItem.getItemValue();
        String otherValue = StringUtils.isBlank(gFormItem.getOtherValue()) ?"":gFormItem.getOtherValue();

        String uivalue[]=dynamicFormItem.getUiValue();
        int eleIndex =getIndexInUiValue(uivalue,itemValue);
        String uiDesc="";
        if (eleIndex!=-1) {
            String otherItemsHor[] = null; //橫向展開
            if (StringUtils.isNotBlank(dynamicFormItem.getHorizontalFormItem())) {
                otherItemsHor = dynamicFormItem.getHorizontalFormItem().split("\\|,\\|",-1);
            }
            String otherItemsVer[] = null; //向下展開
            if (StringUtils.isNotBlank(dynamicFormItem.getVerticalFormItem())) {
                otherItemsVer = dynamicFormItem.verticalFormItem.split("\\|,\\|",-1);
            }
            uiDesc = dynamicFormItem.uiDesc[eleIndex];
            if (StringUtils.isNotBlank(otherValue)){
                uiDesc += ":"+otherValue ;
            }
            if(dynamicFormItem.getOtherBackTitle()!=null
                    &&StringUtils.isNotBlank(dynamicFormItem.getOtherBackTitle()[eleIndex])){
                uiDesc+=dynamicFormItem.getOtherBackTitle()[eleIndex];
            }


            //橫向展開
            if (otherItemsHor!=null &&StringUtils.isNotBlank( otherItemsHor[eleIndex]) ) {
                String otherItemsArr[] = otherItemsHor[eleIndex].split(",");
                String oUiDesc = "";
                for (int i2 = 0; i2 <  otherItemsArr.length; i2++) {
                    if (gFormItemMap.containsKey(otherItemsArr[i2])
                            && dynamicFormItemMap.containsKey(otherItemsArr[i2])) {
                        String oUiDesc2 =showPrintUi( gFormItemMap,dynamicFormItemMap,otherItemsArr[i2]);
                        if(StringUtils.isNotBlank(oUiDesc2)){
                            oUiDesc +=","+oUiDesc2 ;
                        }
                    }
                }
                uiDesc += (oUiDesc != "") ? "(" + oUiDesc.substring(1) + ")" : "";
            }
            //向下展開
            if (otherItemsVer!=null &&StringUtils.isNotBlank( otherItemsVer[eleIndex])) {
                String otherItemsArr[] = otherItemsVer[eleIndex].split(",");
                String oUiDesc = "";
                for (int i2 = 0; i2 <  otherItemsArr.length; i2++) {
                    if (gFormItemMap.containsKey(otherItemsArr[i2])
                            && dynamicFormItemMap.containsKey(otherItemsArr[i2])) {
                        String oUiDesc2 =showPrintUi( gFormItemMap,dynamicFormItemMap,otherItemsArr[i2]);
                        if(StringUtils.isNotBlank(oUiDesc2)) {
                            oUiDesc +=  "<br/>" + oUiDesc2 ;
                        }
                    }
                }
                uiDesc += (oUiDesc != "") ? oUiDesc : "";
            }
        }
        return StringUtils.isNotBlank(uiDesc) ? (((dynamicFormItem.isShowTitle() ? (dynamicFormItem.getTitle() + ':') : "")
                + uiDesc + (StringUtils.isNotBlank(dynamicFormItem.backTitle )?dynamicFormItem.backTitle :""))):"" ;
    }

    private String processCheckbox( Map<String, GFormItem> gFormItemMap,
                                Map<String, DynamicFormItem> dynamicFormItemMap,
                                String bean ){
        DynamicFormItem dynamicFormItem=dynamicFormItemMap.get(bean);
        GFormItem gFormItem=gFormItemMap.get(bean);
        String itemValue[] = gFormItem.getItemValue().split(",");
        String otherValue[] = gFormItem.getOtherValue().split("\\|",-1);
        String uiValue[]=dynamicFormItem.getUiValue();
        String otherItemsHor[] = null; //橫向展開
        if (StringUtils.isNotBlank(dynamicFormItem.getHorizontalFormItem())) {
            otherItemsHor = dynamicFormItem.getHorizontalFormItem().split("\\|,\\|",-1);
        }
        String otherItemsVer[] = null; //向下展開
        if (StringUtils.isNotBlank(dynamicFormItem.getVerticalFormItem())) {
            otherItemsVer = dynamicFormItem.verticalFormItem.split("\\|,\\|",-1);
        }


        int count =0;
        String uiDesc="";
        HashMap<Integer,Integer> countMap=new HashMap<Integer, Integer>();
        for (int i=0; i<itemValue.length;i++){
            int eleIndex =getIndexInUiValue(uiValue,itemValue[i]);
            if (eleIndex!=-1){uiDesc+=","+dynamicFormItem.getUiDesc()[eleIndex];}

            if (StringUtils.isNotBlank(otherValue[i])){
                uiDesc+=":"+otherValue[i]+
                        (dynamicFormItem.getOtherBackTitle()!=null?dynamicFormItem.getOtherBackTitle()[i]:"");
            }

            if (eleIndex!=-1 ){
                //橫向展開
                if(otherItemsHor!=null && StringUtils.isNotBlank( otherItemsHor[eleIndex])){
                    String otherItemsArr[] = otherItemsHor[eleIndex].split(",");
                    String oUiDesc = "";
                    for (int i2=0;i2<otherItemsArr.length;i2++){
                        if(gFormItemMap.containsKey(otherItemsArr[i2])
                                && dynamicFormItemMap.containsKey(otherItemsArr[i2])){
                            String oUiDesc2 = showPrintUi(gFormItemMap,dynamicFormItemMap,otherItemsArr[i2]);
                            if(StringUtils.isNotBlank(oUiDesc2)){
                                oUiDesc +=","+oUiDesc2 ;
                            }
                        }
                    }
                    uiDesc+=(oUiDesc!="") ? "("+oUiDesc.substring(1)+")" : "";
                }
                //向下展開
                countMap.put(count,eleIndex);
                count++;
            }
        }
        int otherItemsVer_idx []= new int[count];

        //向下展開
        if(otherItemsVer!=null ){
            for (int i=0;i<otherItemsVer_idx.length; i++){
                String otherItemsArr[] = otherItemsVer[countMap.get(i)].split(",");
                String oUiDesc = "";
                for (int i2=0; i2<otherItemsArr.length; i2++){
                    if(gFormItemMap.containsKey(otherItemsArr[i2])
                            && dynamicFormItemMap.containsKey(otherItemsArr[i2])){
                        String oUiDesc2 = showPrintUi(gFormItemMap,dynamicFormItemMap,otherItemsArr[i2]);
                        if(StringUtils.isNotBlank(oUiDesc2)) {
                            oUiDesc +=  "<br/>" + oUiDesc2 ;
                        }
                    }
                }
                uiDesc+=(oUiDesc!="") ? oUiDesc : "";
            }
        }
        return StringUtils.isNotBlank(uiDesc) ? ((dynamicFormItem.isShowTitle() ? (dynamicFormItem.getTitle() + ":") : "") + uiDesc.substring(1) +  StringUtils.defaultIfEmpty(dynamicFormItem.getBackTitle(),"")) : "";
    }
    private String processSelect( Map<String, GFormItem> gFormItemMap,
                                    Map<String, DynamicFormItem> dynamicFormItemMap,
                                    String bean ){
        DynamicFormItem dynamicFormItem=dynamicFormItemMap.get(bean);
        GFormItem gFormItem=gFormItemMap.get(bean);
        String itemValue = gFormItem.getItemValue();
        String otherValue = StringUtils.isBlank(gFormItem.getOtherValue()) ?"":gFormItem.getOtherValue();
        String uiDesc="";
        int eleIndex =getIndexInUiValue(dynamicFormItem.getUiValue(),itemValue);
        if (eleIndex!=-1) {
            uiDesc = dynamicFormItem.getUiDesc()[eleIndex];
            if (StringUtils.isNotBlank(otherValue )){

                uiDesc += otherValue ;
            }
            if(dynamicFormItem.getOtherBackTitle()!=null
                    &&StringUtils.isNotBlank(dynamicFormItem.getOtherBackTitle()[eleIndex])){
                uiDesc+=dynamicFormItem.getOtherBackTitle()[eleIndex];
            }
        }
        return uiDesc;
    }
    private String processText( Map<String, GFormItem> gFormItemMap,
                                    Map<String, DynamicFormItem> dynamicFormItemMap,
                                    String bean ){
        DynamicFormItem dynamicFormItem=dynamicFormItemMap.get(bean);
        GFormItem gFormItem=gFormItemMap.get(bean);
        String itemValue = gFormItem.getItemValue();
        String otherValue = StringUtils.isBlank(gFormItem.getOtherValue()) ?"":gFormItem.getOtherValue();
       String ui="";
       if(StringUtils.isNotBlank(itemValue)){
           ui+=  (dynamicFormItem.isShowTitle() ? (dynamicFormItem.getTitle() + ":") : "")
                   + itemValue + (StringUtils.isNotBlank(dynamicFormItem.getBackTitle())?dynamicFormItem.getBackTitle():"");
       }
        return ui;
    }
    private String processGroup( Map<String, GFormItem> gFormItemMap,
                                Map<String, DynamicFormItem> dynamicFormItemMap,
                                String bean ){
        DynamicFormItem dynamicFormItem=dynamicFormItemMap.get(bean);
        GFormItem gFormItem=gFormItemMap.get(bean);
        String itemValue = gFormItem.getItemValue();
        StringBuffer ui=new StringBuffer();
        if(StringUtils.isNotBlank(itemValue)&& JSON.isValidObject(itemValue)){
            String groupBean[]=groupBeanName.split(",");

            if( JSON.isValidObject(itemValue))

            {
                JSONObject groupData = JSON.parseObject(itemValue);
                /*
                HashMap<Object,Object> itemMap=new HashMap<Object, Object>();
                getKeys(groupData,itemMap);
                List<String> keys=new ArrayList<String>();
                if(itemMap.size()>0){
                    for(Map.Entry<Object,Object> entry:itemMap.entrySet()){
                        Object key= entry.getKey();
                        if(key instanceof String){
                            keys.add(key.toString());
                        }
                    }
                }
                Collections.sort(keys);
                HashMap<Object, List<HashMap<Integer,Object>>> map=new HashMap<Object,  List<HashMap<Integer,Object>>>();
                processBean(template.getItemTemplateMaps().get(0),bean,itemMap,keys,map);
                */
                JSONObject data=groupData.getJSONObject(bean);
                Iterator<String> it = data.keySet().iterator();
                HashMap<String,HashMap<String,HashMap<String,String>>> map=new HashMap<String, HashMap<String, HashMap<String,String>>>();
               List<Integer> indexList=new ArrayList<Integer>();
                while(it.hasNext()) {
                    String key = it.next();
                    indexList.add(Integer.parseInt(key));
                    map.put(key,null);
                }
                Collections.sort(indexList);
                //解析Group
                getDataByGroup(data,map,null,null);
                for( Integer index: indexList){
                    HashMap<String,HashMap<String,String>> beanMap= map.get(index.toString());
                   //tr
                    ui.append("<tr>");
                    for(String tr:groupBean){

                        String gb2[]=tr.split("@",-1);
                        //td
                        ui.append("<td class=\"etd_executeA col-9\" style=\"text-align: center;\">");
                        for( String td: gb2) {
                            HashMap<String,String> item=beanMap.get(td);
                            if(item!=null) {
                                String itVal = "";
                                String itOtherVal = "";
                                if (item.containsKey("itemValue")) {
                                    itVal = item.get("itemValue");
                                    if (StringUtils.isNotBlank(itVal) && dynamicFormItemMap.containsKey(td)) {
                                        GFormItem git = JSON.parseObject(JSON.toJSONString(item), GFormItem.class);
                                        if (git.getOtherValue() == null) {
                                            git.setOtherValue("");
                                        }
                                        gFormItemMap.put(td, git);
                                        itVal = showPrintUi(gFormItemMap, dynamicFormItemMap, td);
                                    }
                                }

                                ui.append(itVal + "&nbsp;");
                            }
                        }
                        ui.append("</td>");
                    }
                    ui.append("</tr>");
                }

            }
        }
        return ui.length()>0?ui.toString():"";
    }
    public static boolean isGroup( Map<String, DynamicFormItem> dynamicFormItemMap,String bean){
        return "group".equals(dynamicFormItemMap.get(bean).getControlType());
    }
    private static void processBean(  Map<String, DynamicFormItem> dynamicFormItemMap,
                                      String bean,HashMap<Object,Object>itemMap, List<String> keys
            , HashMap<Object, List<HashMap<Integer,Object>>> map){
        DynamicFormItem dynamicFormItem=dynamicFormItemMap.get(bean);
        String children=dynamicFormItem.getChildren();

        if (isGroup(dynamicFormItemMap,bean)){

            String child[]=null;
            if(StringUtils.isNotEmpty(children)){
                child= children.split(",");
            }
            List<String> beanList=new ArrayList<String>();
            List<String> groupBeanList=new ArrayList<String>();

            for( String chi:child){
                for(String key:keys){
                    if(isGroup(dynamicFormItemMap,chi)){
                        groupBeanList.add(key);
                    }else if(key.endsWith(chi)){
                        beanList.add(key);
                    }
                }
            }
            for(String key:beanList){
                String kk=key.substring(key.lastIndexOf(bean)+bean.length()+1);
                String beanKey[]=kk.split("-");

                String index = beanKey[0];
                String childs = beanKey[1];
                if (beanKey.length == 2) {
                    HashMap<Integer, Object> indMap = new HashMap<Integer, Object>();
                    indMap.put(Integer.parseInt(index), itemMap.get(key));
                    if (map.containsKey(childs)) {
                        map.get(childs).add(indMap);
                    } else {
                        List<HashMap<Integer, Object>> hashMapList = new ArrayList<HashMap<Integer, Object>>();
                        hashMapList.add(indMap);
                        map.put(childs, hashMapList);
                    }
                }
            }
            for(String key:groupBeanList){
                String kk=key.substring(key.lastIndexOf(bean)+bean.length()+1);
                String beanKey[]=kk.split("-");
                if(beanKey.length>=2) {
                    String childs = beanKey[1];
                    if(beanKey.length>2) {
                        processBean(dynamicFormItemMap,childs,itemMap,groupBeanList,map);
                        break;
                    }
                }

            }


        }
    }
    public static void getKeys(JSONObject test,HashMap<Object,Object>item) {

        Iterator keys = test.keySet().iterator();
        while(keys.hasNext()){
            Object key = keys.next();
            Object value = test.get(key);

            if( value instanceof JSONObject){
                if(((JSONObject) value).containsKey("itemKey")){
                    item.put(((JSONObject) value).get("itemKey"),value);
                }
                getKeys((JSONObject) value,item);
            }else if(value instanceof JSONArray){
                JSONArray arrays = ( JSONArray) value;
                for(int k =0;k<arrays.size();k++){
                    if(arrays.get(k) instanceof JSONObject){
                        getKeys((JSONObject)arrays.get(k),item) ;
                    }
                }
            }
        }

    }

    public  void getDataByGroup(JSONObject data,HashMap<String,HashMap<String,HashMap<String,String>>> map,String oldKey, HashMap<String,HashMap<String,String>> beanMap){

        Iterator<String> it = data.keySet().iterator();
        HashMap<String,String>  valueMap=new HashMap<String, String>();
        while(it.hasNext()){
            String key = it.next();
            if(data.get(key) instanceof JSONObject){
                JSONObject value = data.getJSONObject(key);
                if(!map.containsKey(key)){
                    if(beanMap==null){
                        beanMap=new HashMap<String, HashMap<String, String>>();
                    }
                    beanMap.put(key,new HashMap<String,String>());
                }
                getDataByGroup(value,map,key,beanMap);

            }else if(data.get(key) instanceof String){
                valueMap.put(key,data.getString(key));
            }
        }
        if(beanMap!=null&&beanMap.containsKey(oldKey)){
            beanMap.put(oldKey,valueMap);
        }
        if(StringUtils.isNotBlank(oldKey)&&map.containsKey(oldKey)){
            map.put(oldKey,beanMap);
        }
    }
}
