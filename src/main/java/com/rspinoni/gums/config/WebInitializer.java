package com.rspinoni.gums.config;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.FrameworkServlet;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class WebInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

  @Override
  protected Class<?>[] getRootConfigClasses() {
    return new Class[]{MongoConfig.class};
  }

  @Override
  protected Class<?>[] getServletConfigClasses() {
    return new Class[]{WebConfig.class};
  }

  @Override
  protected String[] getServletMappings() {
    return new String[]{"/"};
  }

  @Override
  protected FrameworkServlet createDispatcherServlet(WebApplicationContext context) {
    FrameworkServlet servlet = super.createDispatcherServlet(context);
    ((DispatcherServlet) servlet).setThrowExceptionIfNoHandlerFound(true);
    return servlet;
  }
}
