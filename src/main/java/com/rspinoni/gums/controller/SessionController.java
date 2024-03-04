package com.rspinoni.gums.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
@PropertySource("classpath:gums.properties")
public class SessionController {

  private final int sessionTimeout;

  @Autowired
  public SessionController(@Value("${application.session.timeout}") int sessionTimeout) {
    this.sessionTimeout = sessionTimeout;
  }

  @GetMapping("/login")
  @ResponseStatus(HttpStatus.OK)
  public void login(HttpSession session) {
    session.setMaxInactiveInterval(sessionTimeout);
  }

  @GetMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(HttpSession session) {
    session.invalidate();
  }
}
