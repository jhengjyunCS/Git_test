package com.report.unit.sett;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

@XStreamAlias("DataSource")
public class DataSource {
	
	@XStreamAsAttribute
	public String name;
	@XStreamAsAttribute
	public String schema;
	
	@XStreamAsAttribute
	public String jndi;
	
	@XStreamAsAttribute
	public String driver;
	@XStreamAsAttribute
	public String url;
	@XStreamAsAttribute
	public String userName;
	@XStreamAsAttribute
	public String pwd;
	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSchema() {
		return schema;
	}
	public void setSchema(String schema) {
		this.schema = schema;
	}
	public String getDriver() {
		return driver;
	}
	public void setDriver(String driver) {
		this.driver = driver;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getJndi() {
		return jndi;
	}
	public void setJndi(String jndi) {
		this.jndi = jndi;
	}
	
	
}
