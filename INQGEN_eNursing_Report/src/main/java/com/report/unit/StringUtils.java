package com.report.unit;

public class StringUtils {
	public String fillEmp(String str,int length){
		String s=new String(str);
		if(s!=null && s.length()<10){
			for(int i=s.length();i<length;i++){
				s+=" ";
			}
		}
		return s;
	}
}
