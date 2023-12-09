package com.rspinoni.gums;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.rspinoni.gums.config.MongoDBTestContainerConfig;
import com.rspinoni.gums.config.SecurityConfig;
import com.rspinoni.gums.model.User;
import com.rspinoni.gums.repository.UserRepository;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {MongoDBTestContainerConfig.class, SecurityConfig.class})
@Testcontainers
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class TestUserRepository {

  private static final String ID = UUID.randomUUID().toString();

  private static final User USER_1 = new User(
      ID, "UserName", 40, "user.name@mail.com", "password", false, null);

  private static final User USER_1_MODIFIED = new User(
      ID, "UserName", 40, "user.name@mail.com", "newPassword", true, "adminKey");

  @Autowired
  private UserRepository userRepository;

  @AfterAll
  public static void cleanUp(@Autowired UserRepository userRepository) {
    userRepository.deleteAll();
  }

  @Test
  @Order(0)
  public void testInsert() {
    userRepository.insert(USER_1);

    assertEquals(1, userRepository.findAll().size());
  }

  @Test
  @Order(1)
  public void testRetrieval() {
    Optional<User> user = userRepository.findById(ID);
    assertFalse(user.isEmpty());
    assertEquals("UserName", user.get().getName(), "User name should be UserName");
  }

  @Test
  @Order(2)
  public void testUpdate() {
    userRepository.save(USER_1_MODIFIED);

    List<User> users = userRepository.findAll();

    assertEquals(1, users.size());

    User user = users.get(0);

    assertEquals("UserName", user.getName(), "User name should be UserName");
    assertEquals("newPassword", user.getPassword(), "User password should be newPassword");
    assertTrue(user.isAdmin(), "User should be admin");
    assertEquals("adminKey", user.getAdminKey(), "User admin key should be adminKey");
  }

  @Test
  @Order(3)
  public void testGetByName() {
    Optional<User> user = userRepository.findByName("UserName");
    assertFalse(user.isEmpty());
    assertEquals("UserName", user.get().getName(), "User name should be UserName");
    assertTrue(user.get().isAdmin(), "User should be admin");
  }

  @Test
  @Order(4)
  public void testDeleteById() {
    userRepository.deleteById(ID);

    List<User> users = userRepository.findAll();

    assertEquals(0, users.size());
  }
  @Test
  @Order(5)
  public void testDeleteByName() {
    userRepository.insert(USER_1);
    userRepository.deleteByName("UserName");

    List<User> users = userRepository.findAll();

    assertEquals(0, users.size());
  }
}
