package com.rspinoni.gums.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.rspinoni.gums.model.Credentials;
import com.rspinoni.gums.model.CredentialsStatus;
import com.rspinoni.gums.model.User;
import com.rspinoni.gums.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

  private final UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public User getUserById(@PathVariable String id) {
    return userService.getUserById(id);
  }

  @GetMapping()
  @ResponseStatus(HttpStatus.OK)
  public List<User> getUsers(@RequestParam(value = "name", required = false) String name) {
    if (name == null || name.isEmpty()) {
      return userService.getAllUsers();
    }
    return Collections.singletonList(userService.getUserByName(name));
  }

  @DeleteMapping()
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteUsers(@RequestParam(value = "name", required = false) String name) {
    if (name == null || name.isEmpty()) {
      userService.deleteAllUsers();
      return;
    }
    userService.deleteUserByName(name);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteUserById(@PathVariable String id) {
    userService.deleteUserById(id);
  }

  @PostMapping()
  @ResponseStatus(HttpStatus.CREATED)
  public User createUser(@RequestBody User user) {
    return userService.createUser(user);
  }

  @PutMapping()
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void updateUser(@RequestBody User user) {
    userService.updateUser(user);
  }

  @PutMapping("/{id}/password")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void updatePassword(@PathVariable String id, @RequestBody User user) {
    userService.updateUserPassword(id, user.getPassword());
  }

  @PostMapping("/checkCredentials")
  @ResponseStatus(HttpStatus.OK)
  public CredentialsStatus checkUserCredentials(@RequestBody Credentials credentials) {
    return userService.checkUserCredentials(credentials);
  }
}
