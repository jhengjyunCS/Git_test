package com.inqgen.nursing.file.context;


import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;

/**
 * @author RainKing
 * @date 2019/6/6 14:58
 */
public class ContextLoaderListenerFile extends org.springframework.web.context.ContextLoaderListener {

    private ContextLoaderFile contextLoaderFile;


    /**
     * Initialize the root web application context.
     */
    public void contextInitialized(ServletContextEvent event) {
        ServletContext servletContext = event.getServletContext();
        Object context = servletContext.getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
        if (context == null) {
            super.contextInitialized(event);
        }
        this.contextLoaderFile = createContextLoader();
        this.contextLoaderFile.initWebApplicationContext(servletContext);
    }

    /**
     * Create the ContextLoader to use. Can be overridden in subclasses.
     * @return the new ContextLoader
     */
    protected ContextLoaderFile createContextLoader() {
        return new ContextLoaderFile();
    }

    /**
     * Return the ContextLoader used by this listener.
     * @return the current ContextLoader
     */
    public ContextLoaderFile getContextLoader() {
        return this.contextLoaderFile;
    }


    /**
     * Close the root web application context.
     */
    public void contextDestroyed(ServletContextEvent event) {
        super.contextDestroyed(event);
        if (this.contextLoaderFile != null) {
            this.contextLoaderFile.closeWebApplicationContext(event.getServletContext());
        }
    }

}
