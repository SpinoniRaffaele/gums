package com.rspinoni.gums.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;

//configures the test database
@Configuration
@Profile("test")
@ComponentScan(basePackages = {"com.rspinoni.gums"})
@EnableMongoRepositories(basePackages = {"com.rspinoni.gums.repository"})
public class MockDbConfig extends AbstractMongoClientConfiguration {

  private final String TEST_DB_NAME = "test";

  private final String CONNECTION_URI = "mongodb://localhost:27017";

  @Override
  protected void configureClientSettings(MongoClientSettings.Builder builder) {
    builder.applyConnectionString(new ConnectionString(CONNECTION_URI));
  }

  @Override
  protected String getDatabaseName() {
    return TEST_DB_NAME;
  }
}
