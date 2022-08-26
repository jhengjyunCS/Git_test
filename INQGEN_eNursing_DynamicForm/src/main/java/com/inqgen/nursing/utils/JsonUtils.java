package com.inqgen.nursing.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author RainKing
 * @since 2019/5/11 17:47
 */
public class JsonUtils {
    public final static Pattern compile = Pattern.compile("\\[(\\d+)]");
    public final static Pattern attrCom = Pattern.compile("([a-zA-Z]\\w*(\\[\\d+])*)|((?<=\\[['\"]).*(?=['\"]]))|((\\[\\d+])+)");

    public static <T> String toJson(T t) {
        Gson gson = new GsonBuilder().setDateFormat("yyyy/MM/dd HHmm").create();
        return gson.toJson(t);
    }

    public static <T> String toJson(T t, String format) {
        Gson gson = new GsonBuilder().setDateFormat(format).create();
        return gson.toJson(t);
    }

    public static JSON processJSONFromAttrPath(JSON root, String attrPath, Object attrValue) {
        Matcher attrMat = attrCom.matcher(attrPath);
        List<String> attrs = new ArrayList<String>();
        while (attrMat.find()) {
            attrs.add(attrMat.group());
        }
        JSONObject prev = null;
        for (int i = 0; i < attrs.size(); i++) {
            String attr = attrs.get(i);
            boolean ltLast = i < (attrs.size() - 1);
            if (i == 0 && root instanceof JSONObject) {
                prev = (JSONObject) root;
            }
            JSONObject nextUse = null;
            Matcher matcher = compile.matcher(attr);
            if (matcher.find()) {
                /*array **/
                List<String> indList = new ArrayList<String>();
                indList.add(matcher.group(1));
                while (matcher.find()) {
                    indList.add(matcher.group(1));
                }
                int indLast = indList.size() - 1;
                attr = matcher.replaceAll("");
                JSONArray array;
                if (i == 0 && attr.length() == 0) {
                    if (root instanceof JSONArray) {
                        array = (JSONArray) root;
                    } else {
                        array = new JSONArray();
                        root = array;
                    }
                } else {
                    array = prev.getJSONArray(attr);
                }
                if (array == null) {
                    array = new JSONArray();
                    prev.put(attr, array);
                }
                for (int j = 0; j < indLast; j++) {
                    int k = Integer.parseInt(indList.get(j));
                    JSONArray next;
                    if (k < array.size()) {
                        next = array.getJSONArray(k);
                        if (next == null) {
                            array.remove(k);
                            next = new JSONArray();
                            array.add(k, next);
                        }
                    } else {
                        for (int l = array.size(); l < k; l++) {
                            array.add(null);
                        }
                        next = new JSONArray();
                        array.add(next);
                    }
                    array = next;
                }
                int size = array.size();
                int max = Integer.parseInt(indList.get(indLast));
                if (max < size) {
                    if (ltLast) {
                        nextUse = array.getJSONObject(max);
                        if (nextUse == null) {
                            nextUse = new JSONObject();
                            array.remove(max);
                            array.add(max, nextUse);
                        }
                    } else {
                        array.remove(max);
                        array.add(max, attrValue);
                    }
                } else {
                    if (max > size)
                        for (int j = size; j < max; j++) {
                            array.add(null);
                        }
                    if (ltLast) {
                        nextUse = new JSONObject();
                        array.add(max, nextUse);
                    } else {
                        array.add(max, attrValue);
                    }
                }
            } else {
                /*obj **/
                if (ltLast) {
                    nextUse = prev.getJSONObject(attr);
                    if (nextUse == null) {
                        nextUse = new JSONObject();
                        prev.put(attr, nextUse);
                    }
                } else {
                    prev.put(attr, attrValue);
                }
            }
            if (ltLast)
                prev = nextUse;
        }
        return root;
    }

    public static Object getByAttrPath(JSON root, String attrPath){
        Matcher attrMat = attrCom.matcher(attrPath);
        Object result=null;
        while (attrMat.find()) {
            String attr = attrMat.group();
            if (result == null) {
                result = root;
            }
            Matcher matcher = compile.matcher(attr);
            if (matcher.find()) {
                /*array **/
                List<String> indList = new ArrayList<String>();
                indList.add(matcher.group(1));
                while (matcher.find()) {
                    indList.add(matcher.group(1));
                }
                attr = matcher.replaceAll("");
                try {
                    if (StringUtils.isNotBlank(attr)) {
                        result = ((JSONObject) result).get(attr);
                    }
                    for (String ind : indList) {
                        JSONArray array = (JSONArray) result;
                        int i = Integer.parseInt(ind);
                        result = (array).get(i);
                    }
                } catch (Exception e) {
                    result = null;
                }
            } else {
                try {
                    result = ((JSONObject) result).get(attr);
                } catch (Exception e) {
                    result = null;
                }
            }
            if (result == null) {
                return null;
            }
        }
        return result;
    }
}
