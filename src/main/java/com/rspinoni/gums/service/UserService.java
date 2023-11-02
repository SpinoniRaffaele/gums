package com.rspinoni.gums.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rspinoni.gums.dao.User;
import com.rspinoni.gums.exceptions.InvalidRequestException;
import com.rspinoni.gums.exceptions.NotFoundException;
import com.rspinoni.gums.repository.UserRepository;
import com.rspinoni.gums.service.utils.EmailValidator;
import com.rspinoni.gums.service.utils.PasswordValidator;

@Service
public class UserService {

  private final UserRepository userRepository;

  private final EmailValidator emailValidator;

  private final PasswordValidator passwordValidator;

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

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public void deleteAllUsers() {
    userRepository.deleteAll();
  }

  public void createUser(User user) {
    validateUser(user);
    user.setId(UUID.randomUUID().toString());
    userRepository.save(user);
  }

  public void validateUser(User user) {
    if (user.getName() == null || user.getName().isEmpty()) {
      throw new InvalidRequestException("User name cannot be empty");
    }
    if (user.getPassword() == null || !passwordValidator.validatePassword(user.getPassword())) {
      throw new InvalidRequestException("Invalid password, the password must match the following criteria: "
          + "at least 8 characters long, contain at least one uppercase letter, "
          + "one lowercase letter and one number");
    }
    if (user.getEmail() == null || !emailValidator.validateEmail(user.getEmail())) {
      throw new InvalidRequestException("User email is invalid");
    }
  }
}
