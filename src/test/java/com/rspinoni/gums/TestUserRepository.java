package com.rspinoni.gums;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.rspinoni.gums.config.MockDbConfig;
import com.rspinoni.gums.model.User;
import com.rspinoni.gums.repository.UserRepository;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = { MockDbConfig.class})
@ActiveProfiles("test")
public class TestUserRepository {

  @Autowired
  private UserRepository userRepository;

  String id;

  @BeforeEach
  public  void setup() {
    id = UUID.randomUUID().toString();
    User user1 = new User(id, "UserName", "user.name@mail.com", "password");
    userRepository.save(user1);
  }

  @AfterEach
  public void tearDown() {
    userRepository.deleteAll();
  }

  @Test
  public void testRetrieval() {
    Optional<User> user = userRepository.findById(id);
    assertFalse(user.isEmpty());
    assertEquals("UserName", user.get().getName(), "User name should be UserName");
  }
}
