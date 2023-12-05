package com.rspinoni.gums.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;

import com.mongodb.client.MongoClients;

@Configuration
@EnableMongoRepositories(basePackages = {"com.rspinoni.gums.repository"})
@Profile("test")
@ComponentScan(basePackages = {"com.rspinoni.gums"})
public class MongoDBTestContainerConfig {

  @Bean
  MongoTemplate mongoTemplate() {
    return new MongoTemplate(MongoClients.create(), "test");
  }

  @Container
  public static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:latest")
      .withExposedPorts(27017);

  static {
    mongoDBContainer.start();
  }
}
