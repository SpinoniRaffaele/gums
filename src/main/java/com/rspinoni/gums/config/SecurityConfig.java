package com.rspinoni.gums.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
  PasswordEncoder encoder(){
    return new BCryptPasswordEncoder();
  }

  //Stateless security enforced with API KEY header,
  //csrf disabled since it is useless in a stateless environment
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(new ApiKeyFilter(apiKey, apiKeyHeader), BasicAuthenticationFilter.class);
    return http.build();
  }
}
