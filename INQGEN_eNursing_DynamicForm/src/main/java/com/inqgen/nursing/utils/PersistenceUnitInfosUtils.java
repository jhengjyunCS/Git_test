package com.inqgen.nursing.utils;

import com.inqgen.nursing.hibernate.ejb.packaging.PersistenceMetadata;
import com.inqgen.nursing.hibernate.ejb.packaging.PersistenceXmlLoader;

import javax.persistence.Persistence;
import javax.persistence.spi.PersistenceUnitTransactionType;
import java.net.URL;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;

public class PersistenceUnitInfosUtils {
	private static PersistenceUnitInfosUtils instance = null;
	static final HashMap<String, PersistenceMetadata> persistenceMap=new HashMap<String, PersistenceMetadata>();
	
	private PersistenceUnitInfosUtils() {
	}
	public static PersistenceUnitInfosUtils getInstance() {
		if (instance == null || persistenceMap.size()==0) {
			instance = new PersistenceUnitInfosUtils();
			//Persistence.createEntityManagerFactory("");
			try{
				 Enumeration<URL> urls = Thread.currentThread().getContextClassLoader().getResources("META-INF/persistence.xml");
				while (urls.hasMoreElements()) {
		                URL url = urls.nextElement();
		                List<PersistenceMetadata> metadataFiles = PersistenceXmlLoader.getPersistenceMetadataList(
		                        url,
		                        PersistenceUnitTransactionType.RESOURCE_LOCAL);

					for (PersistenceMetadata per : metadataFiles) {
						persistenceMap.put(per.getName(), per);
					}
				}
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		return instance;
	}
	public HashMap<String, PersistenceMetadata> getPersistenceMap() {
		return persistenceMap;
	}
}
