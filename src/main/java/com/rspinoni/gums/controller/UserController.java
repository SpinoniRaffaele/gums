package com.rspinoni.gums.controller;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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

  @GetMapping()
  @ResponseStatus(HttpStatus.OK)
  public List<User> getUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/{name}")
  @ResponseStatus(HttpStatus.OK)
  public User getUserByName(@PathVariable String name) {
    return userService.getUserByName(name);
  }

  @DeleteMapping()
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteUsers() {
    userService.deleteAllUsers();
  }

  @DeleteMapping("/{name}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteUserByName(@PathVariable String name) {
    userService.deleteUserByName(name);
  }

  @PostMapping()
  @ResponseStatus(HttpStatus.CREATED)
  public void createUser(@RequestBody User user) {
    userService.createUser(user);
  }

  @PutMapping()
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void updateUser(@RequestBody User user) {
    userService.updateUser(user);
  }
}
