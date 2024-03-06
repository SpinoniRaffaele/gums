package com.rspinoni.gums.cucumber;

import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.rspinoni.gums.config.MongoDBTestContainerConfig;
import com.rspinoni.gums.config.security.SecurityConfig;
import com.rspinoni.gums.controller.ProjectController;
import com.rspinoni.gums.controller.UserController;
import com.rspinoni.gums.repository.ProjectRepository;
import com.rspinoni.gums.repository.UserRepository;
import io.cucumber.spring.CucumberContextConfiguration;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("com.rspinoni.gums")
@CucumberContextConfiguration
@ContextConfiguration(classes = { MongoDBTestContainerConfig.class, SecurityConfig.class })
@Testcontainers
@ActiveProfiles("test")
public class CucumberIntegrationTest {

  @Autowired
  protected UserController userController;

  @Autowired
  protected ProjectController projectController;

  @Autowired
  protected UserRepository userRepo;

  @Autowired
  protected ProjectRepository projectRepo;
}
