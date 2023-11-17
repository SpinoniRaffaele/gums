package com.rspinoni.gums.service.utils;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.rspinoni.gums.exceptions.InvalidRequestException;

class EmailValidatorTest {

  private final EmailValidator emailValidator = new EmailValidator();

  @Test
  public void testValidateEmail() {
    assertDoesNotThrow(() -> emailValidator.validateEmail("raff.spi@gmail.net"));
  }

  @Test
  public void testValidateEmailKO() {
    assertThrows(InvalidRequestException.class, () -> emailValidator.validateEmail("raff.spigmail"));
  }
}