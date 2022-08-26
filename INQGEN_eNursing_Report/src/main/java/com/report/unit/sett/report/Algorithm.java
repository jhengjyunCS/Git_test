package com.report.unit.sett.report;

import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamImplicit;

@XStreamAlias("Algorithm")
public class Algorithm {
	
	
	@XStreamAlias("DeleteData")
	@XStreamImplicit(itemFieldName="DeleteData") 
	List<DeleteData> DeleteData;
	
	
	@XStreamAlias("MainFile")
	public MainFile mainFile;
	
	@XStreamAlias("Process_Detail")
	public ProcessDetail processDetails;
	
	
	@XStreamAlias("Process_Head")
	@XStreamImplicit(itemFieldName="Process_Head")
	public List<ProcessHeadTail> processHead;
	
	@XStreamAlias("Process_Tail")
	@XStreamImplicit(itemFieldName="Process_Tail")
	public List<ProcessHeadTail> processTail;
	
	

	public MainFile getMainFile() {
		return mainFile;
	}

	public void setMainFile(MainFile mainFile) {
		this.mainFile = mainFile;
	}

	public ProcessDetail getProcessDetails() {
		return processDetails;
	}

	public void setProcessDetails(ProcessDetail processDetails) {
		this.processDetails = processDetails;
	}

	public List<ProcessHeadTail> getProcessHead() {
		return processHead;
	}

	public void setProcessHead(List<ProcessHeadTail> processHead) {
		this.processHead = processHead;
	}

	public List<ProcessHeadTail> getProcessTail() {
		return processTail;
	}

	public void setProcessTail(List<ProcessHeadTail> processTail) {
		this.processTail = processTail;
	}

	public List<DeleteData> getDeleteData() {
		return DeleteData;
	}

	public void setDeleteData(List<DeleteData> deleteData) {
		DeleteData = deleteData;
	}
}
