package com.rspinoni.gums.service.utils;

import org.springframework.stereotype.Service;

import com.rspinoni.gums.exceptions.InvalidRequestException;

@Service
public class EmailValidator {

  public void validateEmail(String email) throws IllegalArgumentException {
    if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
      throw new InvalidRequestException("User email is invalid");
    }
  }
}
