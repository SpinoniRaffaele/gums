package com.rspinoni.gums.service.utils;

import org.springframework.stereotype.Service;

@Service
public class EmailValidator {

  public boolean validateEmail(String email) {
    return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
  }
}
