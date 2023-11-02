package com.rspinoni.gums.service.utils;

import org.springframework.stereotype.Service;

@Service
public class PasswordValidator {
  private final int MINIMUM_PASSWORD_LENGTH = 10;

    public boolean validatePassword(String password) {
      boolean hasUppercase = !password.equals(password.toLowerCase());
      boolean hasLowercase = !password.equals(password.toUpperCase());
      boolean hasNumber = password.matches(".*\\d.*");
      boolean isLongEnough = password.length() >= MINIMUM_PASSWORD_LENGTH;
      return hasLowercase && hasNumber && hasUppercase && isLongEnough;
    }
}
