package com.rspinoni.gums.service.utils;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.rspinoni.gums.exceptions.InvalidRequestException;

class PasswordValidatorTest {

  private final PasswordValidator passwordValidator = new PasswordValidator(10);

  @Test()
  public void testValidPassword() {
    String password = "Password123";

    assertDoesNotThrow(() -> passwordValidator.validatePassword(password));
  }

  @Test
  public void testShortPassword() {
    String password = "Pass123";
    assertThrows(InvalidRequestException.class, () -> passwordValidator.validatePassword(password));
  }

  @Test
  public void testPasswordWithoutNumber() {
    String password = "Password";
    assertThrows(InvalidRequestException.class, () -> passwordValidator.validatePassword(password));
  }

  @Test
  public void testPasswordWithoutUppercase() {
    String password = "password123";
    assertThrows(InvalidRequestException.class, () -> passwordValidator.validatePassword(password));
  }

  @Test
  public void testPasswordWithoutLowercase() {
    String password = "PASSWORD123";
    assertThrows(InvalidRequestException.class, () -> passwordValidator.validatePassword(password));
  }
}