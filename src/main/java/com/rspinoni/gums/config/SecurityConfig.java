package com.rspinoni.gums.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.rspinoni.gums.security.ApiKeyFilter;

@Configuration
@EnableWebSecurity
@Profile("prod")
@PropertySource("classpath:gums.properties")
public class SecurityConfig {

  @Value("${application.apiKey}") String apiKey;

  @Value("${application.apiKeyHeader}") String apiKeyHeader;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(new ApiKeyFilter(apiKey, apiKeyHeader), BasicAuthenticationFilter.class);
    return http.build();
  }
}
