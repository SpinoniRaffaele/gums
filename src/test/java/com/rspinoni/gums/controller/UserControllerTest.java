package com.rspinoni.gums.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.rspinoni.gums.model.User;
import com.rspinoni.gums.service.UserService;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

  private static final User USER = User.builder()
      .id("1")
      .name("test")
      .build();

  @InjectMocks
  private UserController userController;

  @Mock
  private UserService userService;

  @Captor
  private ArgumentCaptor<String> stringArgumentCaptor;

  @Test
  public void testGetUserById() {
    when(userService.getUserById("1")).thenReturn(USER);

    User user = userController.getUserById("1");
    assertEquals(USER, user);
  }

  @Test
  public void testGetUserByName() {
    when(userService.getUserByName("test")).thenReturn(USER);

    List<User> user = userController.getUsers("test");
    assertEquals(USER, user.get(0));
  }

  @Test
  public void testGetAllUsers() {
    when(userService.getAllUsers()).thenReturn(List.of(USER, USER));

    List<User> user = userController.getUsers(null);
    assertEquals(2, user.size());
    assertEquals(USER, user.get(0));
  }

  @Test
  public void testDeleteUserById() {
    userController.deleteUserById("1");

    verify(userService).deleteUserById(stringArgumentCaptor.capture());
    assertEquals("1", stringArgumentCaptor.getValue());
  }

  @Test
  public void testDeleteUserByName() {
    userController.deleteUsers("test");

    verify(userService).deleteUserByName(stringArgumentCaptor.capture());
    assertEquals("test", stringArgumentCaptor.getValue());
  }

  @Test
  public void testDeleteAllUsers() {
    userController.deleteUsers(null);

    verify(userService).deleteAllUsers();
  }

  @Test
  public void testCreateUser() {
    userController.createUser(USER);

    verify(userService).createUser(USER);
  }

  @Test
  public void testUpdateUser() {
    userController.updateUser(USER);

    verify(userService).updateUser(USER);
  }
}