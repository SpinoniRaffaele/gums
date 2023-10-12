package com.rspinoni.gums;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.Optional;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.rspinoni.gums.config.MongoConfig;
import com.rspinoni.gums.dao.User;
import com.rspinoni.gums.repository.UserRepository;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = { MongoConfig.class})
public class TestUserRepository {

  @Autowired
  private UserRepository userRepository;

  @Test
  public void testRetrieval() {
    Optional<User> user = userRepository.findById(1090L);
    assertFalse(user.isEmpty());
    assertEquals("UserName", user.get().getName(), "User name should be UserName");
  }

  @Test
  @Disabled
  public void testInsertion() {
    User user1 = new User(1090L, "UserName", "user.name@mail.com", "password");
    userRepository.save(user1);
  }
}
