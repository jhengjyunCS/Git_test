import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import com.report.unit.DateUtils;
import com.report.unit.ListUtils;
import com.report.unit.ReportGeneratorUtils;
import com.report.unit.db.DataSourceUtils;


return {Field} ;

public Object parseDt(String value,String format){
	if(value!=null){
		return dateUtils.parse(value, format);
	}
}

public Object getMap(java.util.HashMap map,String key){
	return listUtils.getMap(map, key);
}

public getListToTm(HashMap<String, List<HashMap<String, Object>>> resultMap,String mapKey,String []key,String format){
	return listUtils.getListToTm(resultMap, mapKey,key,format);
}

public Object getListValue(HashMap<String, List<HashMap<String, Object>>> resultMap,String mapKey,String key){
	return listUtils.getListValue(resultMap,mapKey, key);
}
public Object getMapCount(HashMap<String, List<HashMap<String, Object>>> resultMap,String mapKey){
	return listUtils.getMapCount(resultMap,mapKey);
}

public Object UUID(){
	return UUID.randomUUID().toString();
}

public Object searchListHasVal(HashMap<String, List<HashMap<String, Object>>> resultMap,String mapKey,String key,String val){
	return listUtils.searchListHasVal(resultMap,mapKey,key,val);
}


public Object searchListFirstHasVal(HashMap<String, List<HashMap<String, Object>>> resultMap,String mapKey,String key,String val){
	return listUtils.searchListFirstHasVal(resultMap,mapKey,key,val);
}

