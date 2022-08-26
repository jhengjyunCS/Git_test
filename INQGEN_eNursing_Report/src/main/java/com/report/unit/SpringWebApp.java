package com.report.unit;

import com.inqgen.nursing.dynamic.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContext;

public class SpringWebApp {
	public static <T>T getObjectFromName(String name){
		Object bean = ContextLoader.getCurrentWebApplicationContext().getBean(name);
		return (T) bean;
	}
	public static ServletContext getServletContext(){
		WebApplicationContext webApplicationContext = ContextLoader.getCurrentWebApplicationContext();
		if (webApplicationContext != null) {
			return webApplicationContext.getServletContext();
		}
		return null;
	}
}
