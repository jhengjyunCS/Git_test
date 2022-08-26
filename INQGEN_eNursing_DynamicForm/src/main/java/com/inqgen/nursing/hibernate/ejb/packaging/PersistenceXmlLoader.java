/*
 * Hibernate, Relational Persistence for Idiomatic Java
 *
 * Copyright (c) 2010, Red Hat Inc. or third-party contributors as
 * indicated by the @author tags or express copyright attribution
 * statements applied by the authors.  All third-party contributions are
 * distributed under license by Red Hat Inc.
 *
 * This copyrighted material is made available to anyone wishing to use, modify,
 * copy, or redistribute it subject to the terms and conditions of the GNU
 * Lesser General Public License, as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this distribution; if not, write to:
 * Free Software Foundation, Inc.
 * 51 Franklin Street, Fifth Floor
 * Boston, MA  02110-1301  USA
 */
package com.inqgen.nursing.hibernate.ejb.packaging;

import com.inqgen.nursing.hibernate.ejb.util.XmlHelper;
import org.apache.commons.lang.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.persistence.PersistenceException;
import javax.persistence.spi.PersistenceUnitTransactionType;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * Handler for persistence.xml files.
 *
 * @author <a href="mailto:bill@jboss.org">Bill Burke</a>
 * @author Emmanuel Bernard
 */
public final class PersistenceXmlLoader {
    public static List<PersistenceMetadata> getPersistenceMetadataList(URL url, PersistenceUnitTransactionType defaultTransactionType) throws Exception {
        Document doc = loadUrl(url);
        Element top = doc.getDocumentElement();
        //version is mandatory
        final String version = top.getAttribute("version");

        NodeList children = top.getChildNodes();
        ArrayList<PersistenceMetadata> units = new ArrayList<PersistenceMetadata>();
        for (int i = 0; i < children.getLength(); i++) {
            if (children.item(i).getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) children.item(i);
                String tag = element.getTagName();
                if (tag.equals("persistence-unit")) {
                    PersistenceMetadata metadata = parsePersistenceUnit(element);
                    metadata.setVersion(version);
                    /*
                     * if explicit => use it
                     * if JTA DS => JTA transaction
                     * if non JTA DA => RESOURCE_LOCAL transaction
                     * else default JavaSE => RESOURCE_LOCAL
                     */
                    PersistenceUnitTransactionType transactionType = metadata.getTransactionType();
                    Boolean isJTA = null;
                    if (StringUtils.isNotEmpty(metadata.getJtaDatasource())) {
                        isJTA = Boolean.TRUE;
                    } else if (StringUtils.isNotEmpty(metadata.getNonJtaDatasource())) {
                        isJTA = Boolean.FALSE;
                    }
                    if (transactionType == null) {
                        if (isJTA == Boolean.TRUE) {
                            transactionType = PersistenceUnitTransactionType.JTA;
                        } else if (isJTA == Boolean.FALSE) {
                            transactionType = PersistenceUnitTransactionType.RESOURCE_LOCAL;
                        } else {
                            transactionType = defaultTransactionType;
                        }
                    }
                    metadata.setTransactionType(transactionType);
                    Properties properties = metadata.getProps();
                    units.add(metadata);
                }
            }
        }
        return units;
    }

    private static Document loadUrl(URL xmlUrl) throws Exception {
        final String resourceName = xmlUrl.toExternalForm();
        try {
            URLConnection conn = xmlUrl.openConnection();
            conn.setUseCaches(false); //avoid JAR locking on Windows and Tomcat
            try {
                InputStream inputStream = conn.getInputStream();
                final InputSource inputSource = new InputSource(inputStream);
                try {
                    DocumentBuilder documentBuilder = documentBuilderFactory().newDocumentBuilder();
                    return documentBuilder.parse(inputSource);
                } catch (ParserConfigurationException e) {
                    throw new PersistenceException(
                            "Unable to generate javax.xml.parsers.DocumentBuilder instance",
                            e
                    );
                }
            } catch (IOException e) {
                throw new PersistenceException("Unable to obtain input stream from [" + resourceName + "]", e);
            }
        } catch (IOException e) {
            throw new PersistenceException("Unable to access [" + resourceName + "]", e);
        }
    }

    private static DocumentBuilderFactory documentBuilderFactory;

    public static DocumentBuilderFactory documentBuilderFactory() {
        if (documentBuilderFactory == null) {
            documentBuilderFactory = buildDocumentBuilderFactory();
        }
        return documentBuilderFactory;
    }

    private static DocumentBuilderFactory buildDocumentBuilderFactory() {
        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
        documentBuilderFactory.setNamespaceAware(true);
        return documentBuilderFactory;
    }

    private static PersistenceMetadata parsePersistenceUnit(Element top)
            throws Exception {
        PersistenceMetadata metadata = new PersistenceMetadata();
        String puName = top.getAttribute("name");
        if (StringUtils.isNotEmpty(puName)) {
            metadata.setName(puName);
        }
        NodeList children = top.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            if (children.item(i).getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) children.item(i);
                String tag = element.getTagName();
                if (tag.equals("non-jta-data-source")) {
                    metadata.setNonJtaDatasource(XmlHelper.getElementContent(element));
                } else if (tag.equals("jta-data-source")) {
                    metadata.setJtaDatasource(XmlHelper.getElementContent(element));
                } else if (tag.equals("provider")) {
                    metadata.setProvider(XmlHelper.getElementContent(element));
                } else if (tag.equals("class")) {
                    metadata.getClasses().add(XmlHelper.getElementContent(element));
                } else if (tag.equals("mapping-file")) {
                    metadata.getMappingFiles().add(XmlHelper.getElementContent(element));
                } else if (tag.equals("jar-file")) {
                    metadata.getJarFiles().add(XmlHelper.getElementContent(element));
                } else if (tag.equals("exclude-unlisted-classes")) {
                    metadata.setExcludeUnlistedClasses(true);
                } else if (tag.equals("delimited-identifiers")) {
                    metadata.setUseQuotedIdentifiers(true);
                } else if (tag.equals("validation-mode")) {
                    metadata.setValidationMode(XmlHelper.getElementContent(element));
                } else if (tag.equals("shared-cache-mode")) {
                    metadata.setSharedCacheMode(XmlHelper.getElementContent(element));
                } else if (tag.equals("properties")) {
                    NodeList props = element.getChildNodes();
                    for (int j = 0; j < props.getLength(); j++) {
                        if (props.item(j).getNodeType() == Node.ELEMENT_NODE) {
                            Element propElement = (Element) props.item(j);
                            if (!"property".equals(propElement.getTagName())) continue;
                            String propName = propElement.getAttribute("name").trim();
                            String propValue = propElement.getAttribute("value").trim();
                            if (StringUtils.isEmpty(propValue)) {
                                //fall back to the natural (Hibernate) way of description
                                propValue = XmlHelper.getElementContent(propElement, "");
                            }
                            metadata.getProps().put(propName, propValue);
                        }
                    }

                }
            }
        }
        PersistenceUnitTransactionType transactionType = getTransactionType(top.getAttribute("transaction-type"));
        if (transactionType != null) metadata.setTransactionType(transactionType);

        return metadata;
    }

    public static PersistenceUnitTransactionType getTransactionType(String elementContent) {
        if (StringUtils.isEmpty(elementContent)) {
            return null; //PersistenceUnitTransactionType.JTA;
        } else if (elementContent.equalsIgnoreCase("JTA")) {
            return PersistenceUnitTransactionType.JTA;
        } else if (elementContent.equalsIgnoreCase("RESOURCE_LOCAL")) {
            return PersistenceUnitTransactionType.RESOURCE_LOCAL;
        } else {
            throw new PersistenceException("Unknown TransactionType: " + elementContent);
        }
    }
}
