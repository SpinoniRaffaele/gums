package com.rspinoni.gums.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.savedrequest.NullRequestCache;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver;

@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@PropertySource("classpath:gums.properties")
public class SecurityConfig {

  @Value("${application.admin.password}")
  private String adminPassword;

  @Value("${application.admin.username}")
  private String adminUsername;

  @Autowired
  private AuthenticationEntryPoint authenticationEntryPoint;

  @Bean
  PasswordEncoder encoder(){
    return new BCryptPasswordEncoder();
  }

  @Bean
  @Profile("prod")
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests((authorize) -> authorize
            .requestMatchers("/auth/login").permitAll()
            .anyRequest().authenticated()
        )
        .requestCache((requestCache) -> requestCache
            .requestCache(new NullRequestCache())
        )
        .httpBasic(Customizer.withDefaults())
        .exceptionHandling((exceptionHandling) -> exceptionHandling
            .authenticationEntryPoint(authenticationEntryPoint)
        )
        .sessionManagement((sessionManagement) -> sessionManagement
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
        .build();
  }

  @Bean
  @Profile("test")
  public HandlerExceptionResolver exceptionResolver() {
    return new DefaultHandlerExceptionResolver();
  }

  @Autowired
  public void configureGlobal(AuthenticationManagerBuilder auth, PasswordEncoder encoder) throws Exception {
    auth.inMemoryAuthentication()
        .withUser(User.withUsername(adminUsername).password(encoder.encode(adminPassword)).roles("ADMIN").build());
  }
}
