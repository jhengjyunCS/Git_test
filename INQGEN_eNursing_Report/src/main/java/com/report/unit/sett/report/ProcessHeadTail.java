package com.report.unit.sett.report;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamImplicit;

import java.util.List;

@XStreamAlias("Process_Tail")
public class ProcessHeadTail implements Comparable{
	

	@XStreamAlias("Level")
	public int level;
	
	@XStreamImplicit(itemFieldName="NewData")
	List<NewData> newDatas;
	@XStreamImplicit(itemFieldName="ForEach")
	List<ForEach> forEach;

	@XStreamImplicit(itemFieldName="UpdateData")
	List<UpdateData> updateDatas;
	@XStreamImplicit(itemFieldName="DeleteData")
	List<DeleteData> deleteDatas;
	@XStreamImplicit(itemFieldName="GformData")
	List<GformData> gformDatas;

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public List<NewData> getNewDatas() {
		return newDatas;
	}

	public void setNewDatas(List<NewData> newDatas) {
		this.newDatas = newDatas;
	}

	public List<UpdateData> getUpdateDatas() {
		return updateDatas;
	}

	public void setUpdateDatas(List<UpdateData> updateDatas) {
		this.updateDatas = updateDatas;
	}

	public List<DeleteData> getDeleteDatas() {
		return deleteDatas;
	}

	public void setDeleteDatas(List<DeleteData> deleteDatas) {
		this.deleteDatas = deleteDatas;
	}

	public List<GformData> getGformDatas() {
		return gformDatas;
	}

	public void setGformDatas(List<GformData> gformDatas) {
		this.gformDatas = gformDatas;
	}

	public List<ForEach> getForEach() {
		return forEach;
	}

	public void setForEach(List<ForEach> forEach) {
		this.forEach = forEach;
	}

	@Override
	public int compareTo(Object o) {
		ProcessHeadTail key=(ProcessHeadTail)o;
		
		if(this.level>key.level){
			return 1;
		}else if(this.level<key.level){
			return -1;
		}else{
			return 0;
		}
	}
	
}
