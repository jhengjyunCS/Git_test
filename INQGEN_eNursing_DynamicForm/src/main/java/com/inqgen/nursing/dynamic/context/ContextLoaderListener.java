package com.inqgen.nursing.dynamic.context;


import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;

/**
 * @author RainKing
 * @date 2019/6/6 14:58
 */
public class ContextLoaderListener extends org.springframework.web.context.ContextLoaderListener {

    private ContextLoader contextLoader;


    /**
     * Initialize the root web application context.
     */
    public void contextInitialized(ServletContextEvent event) {
        ServletContext servletContext = event.getServletContext();
        Object context = servletContext.getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
        if (context == null) {
            super.contextInitialized(event);
        }
        this.contextLoader = createContextLoader();
        this.contextLoader.initWebApplicationContext(servletContext);
    }

    /**
     * Create the ContextLoader to use. Can be overridden in subclasses.
     * @return the new ContextLoader
     */
    protected ContextLoader createContextLoader() {
        return new ContextLoader();
    }

    /**
     * Return the ContextLoader used by this listener.
     * @return the current ContextLoader
     */
    public ContextLoader getContextLoader() {
        return this.contextLoader;
    }


    /**
     * Close the root web application context.
     */
    public void contextDestroyed(ServletContextEvent event) {
        super.contextDestroyed(event);
        if (this.contextLoader != null) {
            this.contextLoader.closeWebApplicationContext(event.getServletContext());
        }
    }

}
