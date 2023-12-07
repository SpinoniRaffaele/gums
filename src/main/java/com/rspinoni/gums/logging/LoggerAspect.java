package com.rspinoni.gums.logging;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggerAspect {

  private static final Logger LOGGER = LoggerFactory.getLogger(LoggerAspect.class);

  @Before("execution(public * com.rspinoni.gums.controller.*.*(..))")
  public void logBefore(JoinPoint joinPoint) {
    LOGGER.info("Handling call to controller method: " + joinPoint.getSignature().getName());
  }

  @After("execution(public * com.rspinoni.gums.controller.*.*(..))")
  public void logAfter(JoinPoint joinPoint) {
    LOGGER.info("Return result from controller method: " + joinPoint.getSignature().getName());
  }
}
