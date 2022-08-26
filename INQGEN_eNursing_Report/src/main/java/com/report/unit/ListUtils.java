package com.report.unit;

import com.alibaba.fastjson.JSON;

import java.math.BigDecimal;
import java.math.RoundingMode;
import org.apache.commons.lang.StringUtils;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ListUtils {
	/**
	 * 從結果集中提取資料，轉換成日期（當結果集只有一條資料時）
	 * @param list
	 * @param key
	 * @return
	 * @throws Exception 
	 */
	public Object getListToTm(List list,String key[],String format) throws Exception{
		if(list!=null&&list.size()>0){
			Object obj=list.get(0);
			Map map=(Map)obj;
			 String tmStr="";
			 if(key!=null){
				 for(int i=0;i<key.length;i++){
					 Object val=map.get(key[i]);
					 if(val!=null)
					 {
						 tmStr+=val.toString();
					 }
				 }
				 try{
					 Date dt=DateUtils.parse(tmStr, format);
					 return dt;
				 }catch(Exception e){
					 return null;
				 }
			 }
		}
		return null;
	}
	
	public Object getListToTm(Map<String, List<Map<String, Object>>> resultMap,String mapKey,String key[],String format) throws Exception{
		List list=resultMap.get(mapKey);
		if(list!=null&&list.size()>0){
			Object obj=list.get(0);
			Map map=(Map)obj;
			 String tmStr="";
			 if(key!=null){
				 for(int i=0;i<key.length;i++){
					 Object val=map.get(key[i]);
					 if(val!=null)
					 {
						 tmStr+=val.toString();
					 }
				 }
				 try{
					 Date dt=DateUtils.parse(tmStr, format);
					 return dt;
				 }catch(Exception e){
					 return null;
				 }
			 }
		}
		return null;
	}
	
	/**
	 * 從List 中的第一條，取得資料
	 * @param list
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public Object getListValue(List list,String key) throws Exception{
		if(list!=null&&list.size()>0){
			Object obj=list.get(0);
			Map map=(Map)obj;
			return map.get(key);
		}
		return null;
	}
	
	public Object getListValue(Map<String, List<Map<String, Object>>> resultMap,String mapKey,String key) throws Exception{
		List list=resultMap.get(mapKey);
		if(list!=null&&list.size()>0){
			Object obj=list.get(0);
			Map map=(Map)obj;
			return map.get(key);
		}
		return null;
	}
	public String getStrListValue(Map<String, List<Map<String, Object>>> resultMap,
								  String mapKey,String key,String Joiner){
		List <Map<String, Object>>list=resultMap.get(mapKey);
		StringBuffer sb=new StringBuffer();

		try {
			if (list != null && list.size() > 0) {
				for (Map<String, Object> maps : list) {
					sb.append(maps.get(key).toString()).append(Joiner);
				}
			}
			if (sb.length() > 0) {
				sb = sb.deleteCharAt(sb.length() - 1);
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return sb.length() > 0 ? sb.toString() : null;
	}
    Object getListValueToJsonString(HashMap<String, List<HashMap<String, Object>>> resultMap, String mapKey){
        List list=resultMap.get(mapKey);
        if(list!=null&&list.size()>0){
            Object obj=list.get(0);
            return JSON.toJSONString(obj);
        }
        return null;
    }
	public Object getStrEmpVal(Map<String, List<Map<String, Object>>> resultMap,String mapKey,String key) throws Exception{
		List list=resultMap.get(mapKey);
		if(list!=null&&list.size()>0){
			Object obj=list.get(0);
			Map map=(Map)obj;
			return map.get(key);
		}
		return "";
	}
	
	public Object getMapCount(Map<String, List<Map<String, Object>>> resultMap,String mapKey){
		if(resultMap!=null){
			List list=resultMap.get(mapKey);
			if(list!=null){
				return list.size();
			}
		}
		return 0;
	}
	/**
	 * 從結果集中的一條，取出欄位值
	 * @param map
	 * @param key
	 * @return
	 */
	public Object getMap(Map map,String key){
		return map.get(key);
	}
	
	/**
	 * 查詢指定結果集，指定的KEY的值，是否包括 指定的值
	 * @param resultMap
	 * @param mapKey
	 * @param key
	 * @param val
	 * @return
	 */
	public Object searchListHasVal(Map<String, List<Map<String, Object>>> resultMap,String mapKey,String key,String val){
		List<Map<String, Object>> list=resultMap.get(mapKey);
		if(list!=null){
			for(int i=0;i<list.size();i++){
				if(list.get(i)!=null){
					Object obj=list.get(i).get(key);
					if(obj!=null && obj instanceof String){
						return obj.toString().contains(val);
					}
				}
			}
		}
		return false;
	}
	
	public Object searchListFirstHasVal(Map<String, List<Map<String, Object>>> resultMap,String mapKey,String key,String val){
		List<Map<String, Object>> list=resultMap.get(mapKey);
		if(list!=null){
			for(int i=0;i<list.size();i++){
				if(list.get(i)!=null){
					Object obj=list.get(i).get(key);
					if(obj!=null && obj instanceof String){
						return obj.toString().contains(val);
					}
				}
				break;
			}
		}
		return false;
	}
			
	public void aa(){
		
		Map mainFile=new HashMap();
		mainFile.put("allTeam", "脆弱性骨折個管師");
		String a="整合照護".equals(getMap(mainFile, "allTeam"))?"DischargePlanning":"居家護理".equals(getMap(mainFile, "allTeam"))?"NursingHomeHospice":"急性腦中風個管師".equals(getMap(mainFile, "allTeam"))?"PacCerebralApoplexy":"創傷性神經損傷個管師".equals(getMap(mainFile, "allTeam"))?"PacBrainWound":"脆弱性骨折個管師".equals(getMap(mainFile, "allTeam"))?"PacFracture":"衰弱高齡個管師".equals(getMap(mainFile, "allTeam"))?"Pacweak":"心臟衰竭個管師".equals(getMap(mainFile, "allTeam"))?"PacHeartFailure":"";
	}
	public static void main(String[] args) {
		new ListUtils().aa();
	}

    /**
     *
     * @param resultMap 結果集
     * @param mapKeyList  [tablename:column]
     * @param split  分隔符
     * @param conversion 數局轉換 將key換成value
     * @return
     * @throws Exception
     */
    public Object getChexckboxItemValue(Map<String, List<Map<String, Object>>> resultMap,List<Map<String, String>> mapKeyList,String split,Map<String, String> conversion ) throws Exception{
        StringBuffer sb=new StringBuffer();
        for(Map<String, String> maps:mapKeyList) {
            String mapKey = maps.get("mapKey");
            String key = maps.get("key");
            List list = resultMap.get(mapKey);
            if (list != null && list.size() > 0) {
                Object obj = list.get(0);
                Map map = (Map) obj;
                String value = (String) map.get(key);
                String valArray[] = value.split(split);

                for (String str : valArray) {
                    if (conversion.containsKey(str)) {
                        sb.append(conversion.get(str) + ",");
                    }
                }
            }
        }
        if (sb.length() > 0) {
            sb = sb.deleteCharAt(sb.length() - 1);
        }
        return sb.length() > 0 ? sb.toString() : null;
    }
    /**
     *
     * @param resultMap 結果集
     * @param mapKeyList  [tablename:column]
     * @param split  分隔符
     * @param conversion 數局轉換 將key換成value
     * @return
     * @throws Exception
     */
    public Object getChexckboxOtherItemValue(Map<String, List<Map<String, Object>>> resultMap,List<Map<String, String>> mapKeyList,String split,Map<String, String> conversion ) throws Exception{
        StringBuffer sb = new StringBuffer();
        for(Map<String, String> maps:mapKeyList) {
           String mapKey = maps.get("mapKey");
           String key    = maps.get("key");
            List list = resultMap.get(mapKey);
            if (list != null && list.size() > 0) {
                Object obj = list.get(0);
                Map map = (Map) obj;
                String value = (String) map.get(key);
                String valArray[] = value.split(split);

                for (String str : valArray) {
                    if (conversion.containsKey(str)) {
                        sb.append("|");
                    }
                }

            }
        }
        return sb.length()>0?sb.toString():null;
    }

	/**
	 * 計算百分比
	 * @param O1    分子
	 * @param O2    分母
	 * @param num   保留小數位
	 * @param flag  是否四舍五入
	 * @return
	 */
	public String getPercentage(Object O1, Object O2, int num, boolean flag) {
		String str = "0";
		if (O1 != null && O2 != null) {
			String str1 = String.valueOf(O1);
			String str2 = String.valueOf(O2);
			if (num == 0) {num = 1;}
			if (StringUtils.isBlank(str1)) {str1 = "0";}
			if (StringUtils.isBlank(str2)) {str2 = "0";}
			try {
				int num1 = Integer.parseInt(str1);
				int num2 = Integer.parseInt(str2);
				if (num1 != 0 && num2 != 0) {
					float fValue = 0f;
					BigDecimal b = BigDecimal.valueOf((float) (num1 * 100) / (float) num2);
					if (flag) {
						fValue = b.setScale(num, RoundingMode.HALF_UP).floatValue();
					} else {
						fValue = b.setScale(num, RoundingMode.DOWN).floatValue();
					}
					str = String.valueOf(fValue);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return str;
	}

}
