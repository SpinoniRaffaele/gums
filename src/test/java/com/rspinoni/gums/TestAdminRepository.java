package com.rspinoni.gums;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.rspinoni.gums.config.MockDbConfig;
import com.rspinoni.gums.dao.Admin;
import com.rspinoni.gums.repository.AdminRepository;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = { MockDbConfig.class})
public class TestAdminRepository {

  @Autowired
  AdminRepository adminRepository;

  @BeforeEach
  public  void setup() {
      Admin user1 = new Admin(1L, "adminKey", "UserName", "user.name@mail.com", "password");
    adminRepository.save(user1);
  }

  @AfterEach
  public void tearDown() {
    adminRepository.deleteAll();
  }

  @Test
  public void testRetrieval() {
    Optional<Admin> user = adminRepository.findById(1L);
    assertFalse(user.isEmpty());
    assertEquals("adminKey", user.get().getAdminKey(), "Admin key should be correct");
  }
}
