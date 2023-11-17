package com.rspinoni.gums.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.rspinoni.gums.exceptions.InvalidRequestException;
import com.rspinoni.gums.exceptions.NotFoundException;
import com.rspinoni.gums.model.User;
import com.rspinoni.gums.repository.UserRepository;
import com.rspinoni.gums.service.utils.EmailValidator;
import com.rspinoni.gums.service.utils.PasswordValidator;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  private static final User USER = User.builder()
      .id("1")
      .name("test")
      .age(20)
      .isAdmin(false)
      .email("user@hotmail.com")
      .password("Password1")
      .build();

  @InjectMocks
  private UserService userService;

  @Mock
  private UserRepository userRepository;

  @Mock
  private EmailValidator emailValidator;

  @Mock
  private PasswordValidator passwordValidator;

  @Captor
  private ArgumentCaptor<User> userCaptor;

  @Test
  public void testValidUserCreation() {
    userService.createUser(USER);

    verify(userRepository).insert(userCaptor.capture());

    assertEquals(USER.getName(), userCaptor.getValue().getName());
    assertEquals(USER.getAge(), userCaptor.getValue().getAge());
    assertEquals(USER.getEmail(), userCaptor.getValue().getEmail());
    assertEquals(USER.getPassword(), userCaptor.getValue().getPassword());
    assertEquals(USER.isAdmin(), userCaptor.getValue().isAdmin());
    assertNotNull(userCaptor.getValue().getId());
  }

  @Test
  public void testInvalidNameUserCreation() {
    User userWithoutName = new User(
        null, "", USER.getAge(), USER.getEmail(), USER.getPassword(), USER.isAdmin(), null);

    assertThrows(InvalidRequestException.class, () -> userService.createUser(userWithoutName));
  }

  @Test
  public void testInvalidAgeUserCreation() {
    User userWithoutName = new User(
        null, USER.getName(), -1, USER.getEmail(), USER.getPassword(), USER.isAdmin(), null);

    assertThrows(InvalidRequestException.class, () -> userService.createUser(userWithoutName));
  }

  @Test
  public void testInvalidEmailUserCreation() {
    doThrow(InvalidRequestException.class).when(emailValidator).validateEmail(USER.getEmail());

    assertThrows(InvalidRequestException.class, () -> userService.createUser(USER));
  }

  @Test
  public void testInvalidPwdUserCreation() {
    doThrow(InvalidRequestException.class).when(passwordValidator).validatePassword(USER.getPassword());

    assertThrows(InvalidRequestException.class, () -> userService.createUser(USER));
  }

  @Test
  public void testInvalidAdminKeyUserCreation() {
    User userWithoutKey = new User(
        null, USER.getName(), USER.getAge(), USER.getEmail(), USER.getPassword(), true, null);

    assertThrows(InvalidRequestException.class, () -> userService.createUser(userWithoutKey));
  }

  @Test
  public void testUsedNameUserCreation() {
    when(userRepository.findAll()).thenReturn(List.of(USER));

    assertThrows(InvalidRequestException.class, () -> userService.createUser(USER));
  }

  @Test
  public void testValidUserUpdate() {
    when(userRepository.findAll()).thenReturn(List.of(USER));

    userService.updateUser(USER);

    verify(userRepository).save(userCaptor.capture());

    assertEquals(USER.getName(), userCaptor.getValue().getName());
    assertEquals(USER.getAge(), userCaptor.getValue().getAge());
    assertEquals(USER.getEmail(), userCaptor.getValue().getEmail());
    assertEquals(USER.getPassword(), userCaptor.getValue().getPassword());
    assertEquals(USER.isAdmin(), userCaptor.getValue().isAdmin());
    assertEquals(USER.getId(), userCaptor.getValue().getId());
  }

  @Test
  public void testInvalidNameUserUpdate() {
    when(userRepository.findAll()).thenReturn(List.of(USER));
    User userWithoutName = new User(
        null, "", USER.getAge(), USER.getEmail(), USER.getPassword(), USER.isAdmin(), null);

    assertThrows(InvalidRequestException.class, () -> userService.updateUser(userWithoutName));
  }

  @Test
  public void testInvalidAgeUserUpdate() {
    when(userRepository.findAll()).thenReturn(List.of(USER));
    User userWithoutName = new User(
        null, USER.getName(), -1, USER.getEmail(), USER.getPassword(), USER.isAdmin(), null);

    assertThrows(InvalidRequestException.class, () -> userService.updateUser(userWithoutName));
  }

  @Test
  public void testInvalidEmailUserUpdate() {
    when(userRepository.findAll()).thenReturn(List.of(USER));
    doThrow(InvalidRequestException.class).when(emailValidator).validateEmail(USER.getEmail());

    assertThrows(InvalidRequestException.class, () -> userService.updateUser(USER));
  }

  @Test
  public void testInvalidPwdUserUpdate() {
    when(userRepository.findAll()).thenReturn(List.of(USER));
    doThrow(InvalidRequestException.class).when(passwordValidator).validatePassword(USER.getPassword());

    assertThrows(InvalidRequestException.class, () -> userService.updateUser(USER));
  }

  @Test
  public void testInvalidAdminKeyUserUpdate() {
    when(userRepository.findAll()).thenReturn(List.of(USER));
    User userWithoutKey = new User(
        null, USER.getName(), USER.getAge(), USER.getEmail(), USER.getPassword(), true, null);

    assertThrows(InvalidRequestException.class, () -> userService.updateUser(userWithoutKey));
  }

  @Test
  public void testUsedNameUserUpdate() {
    User otherUserSameName = new User(
        "2", "name2", USER.getAge(), USER.getEmail(), USER.getPassword(), USER.isAdmin(), null);
    when(userRepository.findAll()).thenReturn(List.of(USER, otherUserSameName));

    User userWithNewName = new User(
        USER.getId(), "name2", USER.getAge(), USER.getEmail(), USER.getPassword(), USER.isAdmin(), null);

    assertThrows(InvalidRequestException.class, () -> userService.updateUser(userWithNewName));
  }

  @Test
  public void testGetUserById() {
    when(userRepository.findById(USER.getId())).thenReturn(Optional.of(USER));

    User result = userService.getUserById(USER.getId());

    assertEquals(USER, result);
  }

  @Test
  public void testGetUserByIdNotFound() {
    when(userRepository.findById(USER.getId())).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> userService.getUserById(USER.getId()));
  }

  @Test
  public void testGetUserByName() {
    when(userRepository.findByName(USER.getName())).thenReturn(Optional.of(USER));

    User result = userService.getUserByName(USER.getName());

    assertEquals(USER, result);
  }

  @Test
  public void testGetUserByNameNotFound() {
    when(userRepository.findByName(USER.getName())).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> userService.getUserByName(USER.getName()));
  }

  @Test
  public void testGetAllUsers() {
    when(userRepository.findAll()).thenReturn(List.of(USER));

    List<User> result = userService.getAllUsers();

    assertEquals(List.of(USER), result);
  }

  @Test
  public void testDeleteAllUsers() {
    userService.deleteAllUsers();

    verify(userRepository).deleteAll();
  }

  @Test
  public void testDeleteUserById() {
    userService.deleteUserById(USER.getId());

    verify(userRepository).deleteById(USER.getId());
  }

  @Test
  public void testDeleteUserByName() {
    userService.deleteUserByName(USER.getName());

    verify(userRepository).deleteByName(USER.getName());
  }
}