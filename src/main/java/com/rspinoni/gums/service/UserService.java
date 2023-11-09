package com.rspinoni.gums.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rspinoni.gums.exceptions.InvalidRequestException;
import com.rspinoni.gums.exceptions.NotFoundException;
import com.rspinoni.gums.model.User;
import com.rspinoni.gums.repository.UserRepository;
import com.rspinoni.gums.service.utils.EmailValidator;
import com.rspinoni.gums.service.utils.PasswordValidator;

@Service
public class UserService {

  private final UserRepository userRepository;

  private final EmailValidator emailValidator;

  private final PasswordValidator passwordValidator;

  //todo: encrypt password with BCryptPasswordEncoder once added spring-security dependency

  @Autowired
  public UserService(UserRepository userRepository, EmailValidator emailValidator, PasswordValidator passwordValidator)
  {
    this.userRepository = userRepository;
    this.emailValidator = emailValidator;
    this.passwordValidator = passwordValidator;
  }

  public User getUserByName(String name) {
    Optional<User> userOptional = userRepository.findByName(name);
    if (userOptional.isEmpty()) {
      throw new NotFoundException("User with specified name not found");
    }
    return userOptional.get();
  }

  public User getUserById(String id) {
    Optional<User> userOptional = userRepository.findById(id);
    if (userOptional.isEmpty()) {
      throw new NotFoundException("User with specified name not found");
    }
    return userOptional.get();
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public void deleteAllUsers() {
    userRepository.deleteAll();
  }

  public void deleteUserByName(String name) {
    Optional<User> optionalUser = userRepository.findByName(name);
    if (optionalUser.isPresent()) {
      userRepository.delete(optionalUser.get());
    } else {
      throw new InvalidRequestException("The specified name is not present in the database");
    }
  }

  public void createUser(User user) {
    validateUserCreation(user);
    user.setId(UUID.randomUUID().toString());
    userRepository.insert(user);
  }

  public void updateUser(User user) {
    validateUserUpdate(user);
    userRepository.save(user);
  }

  private void validateUser(User user) {
    if (user.getAge() <= 0) {
      throw new InvalidRequestException("Invalid field: age");
    }
    if (user.getPassword() == null || !passwordValidator.validatePassword(user.getPassword())) {
      throw new InvalidRequestException("Invalid password, the password must match the following criteria: "
          + "at least 8 characters long, contain at least one uppercase letter, "
          + "one lowercase letter and one number");
    }
    if (user.getEmail() == null || !emailValidator.validateEmail(user.getEmail())) {
      throw new InvalidRequestException("User email is invalid");
    }
    if (user.getName() == null || user.getName().isEmpty()) {
      throw new InvalidRequestException("User name cannot be empty");
    }
    if (user.isAdmin()) {
      if (user.getAdminKey() == null || user.getAdminKey().isEmpty()) {
        throw new InvalidRequestException("Admin key cannot be empty");
      }
    }
  }

  private void validateUserCreation(User user) {
    validateUser(user);
    ensureUniqueName(user, getAllUsers());
  }

  private void ensureUniqueName(User user, List<User> savedUsers) {
    if (savedUsers.stream().anyMatch(savedUser -> user.getName().equals(savedUser.getName()))) {
      throw new InvalidRequestException("the specified UserName is already in use");
    }
  }

  private void validateUserUpdate(User user) {
    List<User> users = getAllUsers();
    Optional<User> optionalUser = users.stream()
        .filter(savedUser -> savedUser.getId().equals(user.getId()))
        .findFirst();
    if (optionalUser.isPresent()) {
      User oldUser = optionalUser.get();
      if (!oldUser.getName().equals(user.getName())) {
        ensureUniqueName(user, users);
      }
      validateUser(user);
    } else {
      throw new InvalidRequestException("No user with the specified ID has been found in the database");
    }
  }
}
