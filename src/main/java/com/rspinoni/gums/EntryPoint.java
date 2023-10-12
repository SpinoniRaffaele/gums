package com.rspinoni.gums;

import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.rspinoni.gums.config.MongoConfig;

public class EntryPoint {
  public static void main(String[] args) {
    ConfigurableApplicationContext context = new AnnotationConfigApplicationContext(MongoConfig.class);
    context.close();
  }
}