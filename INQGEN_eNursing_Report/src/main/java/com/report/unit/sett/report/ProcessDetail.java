package com.report.unit.sett.report;

import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamImplicit;

@XStreamAlias("Process_Detail")
public class ProcessDetail {
	
	@XStreamImplicit(itemFieldName="QueryData")
	public List<QueryData> queryDatas;

	public List<QueryData> getQueryDatas() {
		return queryDatas;
	}

	public void setQueryDatas(List<QueryData> queryDatas) {
		this.queryDatas = queryDatas;
	}

	@Override
	public String toString() {
		return "ProcessDetail [queryDatas=" + queryDatas + "]";
	}
	
	
}
