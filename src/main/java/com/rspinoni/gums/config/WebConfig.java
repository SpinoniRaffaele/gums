package com.rspinoni.gums.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

//the configuration annotation is disabled because it breaks spring integration tests
//@Configuration
@EnableWebMvc
@EnableAspectJAutoProxy
@ComponentScan(basePackages = "com.rspinoni.gums.controller")
public class WebConfig implements WebMvcConfigurer {

  @Bean
  public ObjectMapper objectMapper() {
    var objMapper = new ObjectMapper();
    objMapper.enable(SerializationFeature.INDENT_OUTPUT);
    objMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    objMapper.findAndRegisterModules();
    return objMapper;
  }
}
