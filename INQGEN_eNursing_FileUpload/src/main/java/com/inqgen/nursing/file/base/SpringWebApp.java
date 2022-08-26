package com.inqgen.nursing.file.base;

import com.inqgen.nursing.file.context.ContextLoaderFile;

public class SpringWebApp {
	public static <T>T getObjectFromName(String name){
		Object bean = ContextLoaderFile.getCurrentWebApplicationContext().getBean(name);
		return (T) bean;
	}
}
