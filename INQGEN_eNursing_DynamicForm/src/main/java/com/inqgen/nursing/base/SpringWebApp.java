package com.inqgen.nursing.base;

import com.inqgen.nursing.dynamic.context.ContextLoader;

public class SpringWebApp {
	public static <T>T getObjectFromName(String name){
		Object bean = ContextLoader.getCurrentWebApplicationContext().getBean(name);
		return (T) bean;
	}
}
