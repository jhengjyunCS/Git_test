package com.report.unit.sett.report;

import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;

@XStreamAlias("MainFile")
public class MainFile {
	
	
	
	@XStreamImplicit(itemFieldName = "QueryData")
	public List<QueryData> queryDatas;
	
	@XStreamAlias("TotalLevel")
	@XStreamAsAttribute
	public String totalLevel;
	
	@XStreamImplicit(itemFieldName="Key") 
	List<Key> keys;

	public List<QueryData> getQueryDatas() {
		return queryDatas;
	}

	public void setQueryDatas(List<QueryData> queryDatas) {
		this.queryDatas = queryDatas;
	}

	public String getTotalLevel() {
		return totalLevel;
	}

	public void setTotalLevel(String totalLevel) {
		this.totalLevel = totalLevel;
	}

	public List<Key> getKeys() {
		return keys;
	}

	public void setKeys(List<Key> keys) {
		this.keys = keys;
	}

	@Override
	public String toString() {
		return "MainFile{" +
				"queryDatas=" + queryDatas +
				", totalLevel='" + totalLevel + '\'' +
				", keys=" + keys +
				'}';
	}
}
