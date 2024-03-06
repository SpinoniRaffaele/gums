package com.rspinoni.gums.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rspinoni.gums.exceptions.InvalidRequestException;
import com.rspinoni.gums.exceptions.NotFoundException;
import com.rspinoni.gums.model.Credentials;
import com.rspinoni.gums.model.CredentialsStatus;
import com.rspinoni.gums.model.User;
import com.rspinoni.gums.repository.UserRepository;
import com.rspinoni.gums.service.utils.EmailValidator;
import com.rspinoni.gums.service.utils.PasswordValidator;

@Service
public class UserService {

  private final UserRepository userRepository;

  private final EmailValidator emailValidator;

  private final PasswordValidator passwordValidator;

  private final PasswordEncoder passwordEncoder;

  @Autowired
  public UserService(UserRepository userRepository, EmailValidator emailValidator, PasswordValidator passwordValidator,
      PasswordEncoder passwordEncoder)
  {
    this.userRepository = userRepository;
    this.emailValidator = emailValidator;
    this.passwordValidator = passwordValidator;
    this.passwordEncoder = passwordEncoder;
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
    userRepository.deleteByName(name);
  }

  public void deleteUserById(String id) {
    userRepository.deleteById(id);
  }

  public void createUser(User user) {
    validateUserCreation(user);
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setId(UUID.randomUUID().toString());
    userRepository.insert(user);
  }

  public void updateUser(User user) {
    validateUserUpdate(user);
    userRepository.save(user);
  }

  public void updateUserPassword(String id, String password) {
    passwordValidator.validatePassword(password);
    User user = getUserById(id);
    user.setPassword(passwordEncoder.encode(password));
    userRepository.save(user);
  }

  public CredentialsStatus checkUserCredentials(Credentials credentials) {
    User user = getUserByName(credentials.name());
    if (passwordEncoder.matches(credentials.password(), user.getPassword())) {
      return CredentialsStatus.VALID;
    } else {
      return CredentialsStatus.INVALID;
    }
  }

  private void validateUser(User user) {
    if (user.getAge() <= 0) {
      throw new InvalidRequestException("Invalid field: age");
    }
    passwordValidator.validatePassword(user.getPassword());
    emailValidator.validateEmail(user.getEmail());
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
      user.setPassword(oldUser.getPassword());
      validateUser(user);
    } else {
      throw new InvalidRequestException("No user with the specified ID has been found in the database");
    }
  }
}
