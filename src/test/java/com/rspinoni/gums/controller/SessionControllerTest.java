package com.rspinoni.gums.controller;

import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.servlet.http.HttpSession;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

  @Mock
  private HttpSession session;

  private final SessionController controller = new SessionController(10);

  @Test
  public void testLogin() {
    controller.login(session);

    verify(session).setMaxInactiveInterval(10);
  }

  @Test
  public void testLogout() {
    controller.logout(session);

    verify(session).invalidate();
  }
}
