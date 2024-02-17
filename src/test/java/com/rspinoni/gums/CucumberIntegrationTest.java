package com.rspinoni.gums;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.rspinoni.gums.config.MongoDBTestContainerConfig;
import com.rspinoni.gums.config.SecurityConfig;
import com.rspinoni.gums.controller.ProjectController;
import com.rspinoni.gums.controller.UserController;
import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import io.cucumber.spring.CucumberContextConfiguration;

@RunWith(Cucumber.class)
@CucumberOptions(features = "src/test/resources")
@CucumberContextConfiguration()
@ContextConfiguration(classes = { MongoDBTestContainerConfig.class, SecurityConfig.class })
@Testcontainers
@ActiveProfiles("test")
public class CucumberIntegrationTest {

  @Autowired
  protected UserController userController;

  @Autowired
  protected ProjectController projectController;
}
