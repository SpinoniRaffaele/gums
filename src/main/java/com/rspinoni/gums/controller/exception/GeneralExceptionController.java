package com.rspinoni.gums.controller.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.rspinoni.gums.exceptions.InvalidRequestException;
import com.rspinoni.gums.exceptions.NotFoundException;
import com.rspinoni.gums.model.exception.ErrorMessage;

/**
 * This class handles all exceptions thrown by the application.
 * It overrides the default error screen by tomcat and generates custom errors based on the exception thrown
 */
@ControllerAdvice
public class GeneralExceptionController {

  @ExceptionHandler(value = AuthenticationException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public ResponseEntity<ErrorMessage> handleAuthenticationException() {
    return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(value = InvalidRequestException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<ErrorMessage> handleInvalidRequestException(InvalidRequestException ex) {
    return new ResponseEntity<>(new ErrorMessage(ex.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(value = NotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ResponseEntity<ErrorMessage> handleNotFoundException(NotFoundException ex) {
    return new ResponseEntity<>(new ErrorMessage(ex.getMessage()), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(value = Exception.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ResponseEntity<ErrorMessage> handleAllOtherException(Exception ex) {
    return new ResponseEntity<>(new ErrorMessage(ex.getMessage()), HttpStatus.NOT_FOUND);
  }
}
