package com.report.unit.sett.report;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

@XStreamAlias("Key")
public class Key implements Comparable {
	
	@XStreamAlias("Level")
	@XStreamAsAttribute
	public int level ;
	
	
	@XStreamAlias("NAME")
	@XStreamAsAttribute
	public String name;

	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	@Override
	public String toString() {
		return "Key [level=" + level + ", name=" + name + "]";
	}
	@Override
	public int compareTo(Object o) {
		Key key=(Key)o;
		
		if(this.level>key.level){
			return 1;
		}else if(this.level<key.level){
			return -1;
		}else{
			return 0;
		}
	}
	
	
}
