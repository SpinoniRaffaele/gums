package com.rspinoni.gums.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/")
@PropertySource("classpath:gums.properties")
public class SessionController {

  @Value("${application.session.timeout}")
  private int sessionTimeout;

  @GetMapping("/login")
  @ResponseStatus(HttpStatus.OK)
  public String login(HttpSession session) {
    session.setMaxInactiveInterval(sessionTimeout);
    return session.getId();
  }

  @GetMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(HttpSession session) {
    session.invalidate();
  }
}
