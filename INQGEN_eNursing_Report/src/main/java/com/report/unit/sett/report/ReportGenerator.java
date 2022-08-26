package com.report.unit.sett.report;

import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
import com.thoughtworks.xstream.annotations.XStreamInclude;

@XStreamAlias("ReportGenerator")
public class ReportGenerator {
	@XStreamAlias("Algorithm")
	public Algorithm algorithm;
	
	@XStreamImplicit(itemFieldName="ResultTable")
	@XStreamAlias("ResultTable")
	public List<ResultTable> resultTables;
	
	@XStreamImplicit(itemFieldName="OutputExcel")
	@XStreamAlias("OutputExcel")
	public List<OutputExcel> outputExcel;


	public Algorithm getAlgorithm() {
		return algorithm;
	}


	public void setAlgorithm(Algorithm algorithm) {
		this.algorithm = algorithm;
	}


	public List<ResultTable> getResultTables() {
		return resultTables;
	}


	public void setResultTables(List<ResultTable> resultTables) {
		this.resultTables = resultTables;
	}


	public List<OutputExcel> getOutputExcel() {
		return outputExcel;
	}


	public void setOutputExcel(List<OutputExcel> outputExcel) {
		this.outputExcel = outputExcel;
	}


	@Override
	public String toString() {
		return "ReportGenerator [algorithm=" + algorithm + ", resultTables="
				+ resultTables + ", outputExcel="
				+ outputExcel + "]";
	}
	
	
}
