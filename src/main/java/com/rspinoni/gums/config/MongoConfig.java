package com.rspinoni.gums.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;

@Configuration
@Profile("prod")
@ComponentScan(basePackages = {"com.rspinoni.gums"})
@PropertySource("classpath:application.properties")
@EnableMongoRepositories(basePackages = {"com.rspinoni.gums.repository"})
public class MongoConfig extends AbstractMongoClientConfiguration {

  @Value("${db.mongo.host}")
  private String host;

  @Value("${db.mongo.port}")
  private String port;

  @Value("${db.mongo.database}")
  private String database;

  @Bean
  public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
    return new PropertySourcesPlaceholderConfigurer();
  }

  @Override
  protected void configureClientSettings(MongoClientSettings.Builder builder) {
    builder.applyConnectionString(new ConnectionString(
        "mongodb://" + host + ":" + port + "/" + database));
  }

  @Override
  protected String getDatabaseName() {
    return database;
  }
}
