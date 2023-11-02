package com.rspinoni.gums.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason="The requested resource could not be found")
public class NotFoundException extends RuntimeException {

  public NotFoundException(String message) {
    super(message);
  }
}
