package com.rspinoni.gums.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.savedrequest.NullRequestCache;

@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  PasswordEncoder encoder(){
    return new BCryptPasswordEncoder();
  }

  @Bean
  @Profile("prod")
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .authorizeHttpRequests((authorize) -> authorize
            .anyRequest().authenticated()
        )
        .requestCache((requestCache) -> requestCache
            .requestCache(new NullRequestCache())
        )
        .httpBasic(Customizer.withDefaults())
        .sessionManagement((sessionManagement) -> sessionManagement
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
        .build();
  }

  @Autowired
  public void configureGlobal(AuthenticationManagerBuilder auth, PasswordEncoder encoder) throws Exception {
    auth.inMemoryAuthentication()
        .withUser(User.withUsername("user").password(encoder.encode("password")).roles("USER").build());
  }
}
