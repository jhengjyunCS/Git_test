package com.inqgen.nursing.file.context;

import org.springframework.beans.BeansException;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContext;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author RainKing
 * @date 2019/6/6 14:59
 */
public class ContextLoaderFile extends org.springframework.web.context.ContextLoader {
    /**
     * Map from (thread context) ClassLoader to WebApplicationContext.
     * Often just holding one reference - if the ContextLoader class is
     * deployed in the web app ClassLoader itself!
     */
    private static final Map<ClassLoader, WebApplicationContext> currentContextPerThread =
            new ConcurrentHashMap<ClassLoader, WebApplicationContext>(1);

    /**
     * Initialize Spring's web application context for the given servlet context,
     * according to the "{@link #CONTEXT_CLASS_PARAM contextClass}" and
     * "{@link #CONFIG_LOCATION_PARAM contextConfigLocation}" context-params.
     * @param servletContext current servlet context
     * @return the new WebApplicationContext
     * @throws IllegalStateException if there is already a root application context present
     * @throws BeansException if the context failed to initialize
     * @see #CONTEXT_CLASS_PARAM
     * @see #CONFIG_LOCATION_PARAM
     */
    @Override
    public WebApplicationContext initWebApplicationContext(ServletContext servletContext) throws IllegalStateException, BeansException {
        WebApplicationContext context = (WebApplicationContext) servletContext.getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
        if (context == null) {
            context = super.initWebApplicationContext(servletContext);
        }
        currentContextPerThread.put(Thread.currentThread().getContextClassLoader(), context);
        return context;
    }

    /**
     * Close Spring's web application context for the given servlet context. If
     * the default {@link #loadParentContext(ServletContext)} implementation,
     * which uses ContextSingletonBeanFactoryLocator, has loaded any shared
     * parent context, release one reference to that shared parent context.
     * <p>If overriding {@link #loadParentContext(ServletContext)}, you may have
     * to override this method as well.
     * @param servletContext the ServletContext that the WebApplicationContext runs in
     */
    public void closeWebApplicationContext(ServletContext servletContext) {
        servletContext.log("Closing Spring root WebApplicationContext");
        currentContextPerThread.remove(Thread.currentThread().getContextClassLoader());
    }


    /**
     * Obtain the Spring root web application context for the current thread
     * (i.e. for the current thread's context ClassLoader, which needs to be
     * the web application's ClassLoader).
     * @return the current root web application context, or <code>null</code>
     * if none found
     */
    public static WebApplicationContext getCurrentWebApplicationContext() {
        return (WebApplicationContext) currentContextPerThread.get(Thread.currentThread().getContextClassLoader());
    }
}
