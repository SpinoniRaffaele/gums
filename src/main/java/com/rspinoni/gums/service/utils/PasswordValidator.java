package com.rspinoni.gums.service.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import com.rspinoni.gums.exceptions.InvalidRequestException;

@Service
@PropertySource("classpath:gums.properties")
public class PasswordValidator {

  private final int MINIMUM_PASSWORD_LENGTH;

  @Autowired
  public PasswordValidator(@Value("${application.password.minimumLength}") int minimumPasswordLength) {
    this.MINIMUM_PASSWORD_LENGTH = minimumPasswordLength;
  }

  public void validatePassword(String password) throws InvalidRequestException {
    if (password == null) {
      throw new InvalidRequestException("Password cannot be null");
    }
    boolean hasUppercase = !password.equals(password.toLowerCase());
    boolean hasLowercase = !password.equals(password.toUpperCase());
    boolean hasNumber = password.matches(".*\\d.*");
    boolean isLongEnough = password.length() >= MINIMUM_PASSWORD_LENGTH;
    if (!(hasLowercase && hasNumber && hasUppercase && isLongEnough)) {
      throw new InvalidRequestException("Invalid password, the password must match the following criteria: "
          + "at least " + MINIMUM_PASSWORD_LENGTH + " characters long, contain at least one uppercase letter, "
          + "one lowercase letter and one number");
    }
  }
}
