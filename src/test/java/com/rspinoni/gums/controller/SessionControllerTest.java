package com.rspinoni.gums.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.servlet.http.HttpSession;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

  @Mock
  private HttpSession session;

  private final SessionController controller = new SessionController();

  @Test
  public void testLogin() {
    when(session.getId()).thenReturn("124");

    String result = controller.login(session);

    assert result.equals("124");
  }

  @Test
  public void testLogout() {
    controller.logout(session);

    verify(session).invalidate();
  }
}
