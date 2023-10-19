package com.rspinoni.gums.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
  @GetMapping(value = "/")
  public String hello() {
    return "Hello World!";
  }
}
