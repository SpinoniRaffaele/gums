package com.rspinoni.gums.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rspinoni.gums.model.Admin;
import com.rspinoni.gums.exceptions.InvalidRequestException;
import com.rspinoni.gums.repository.AdminRepository;

@Service
public class AdminService {

  private final AdminRepository adminRepository;

  private final UserService userService;

  @Autowired
  public AdminService(AdminRepository adminRepository, UserService userService) {
    this.adminRepository = adminRepository;
    this.userService = userService;
  }

  public void createAdmin(Admin admin) {
    validateAdminKey(admin);
    userService.validateUser(admin);
    adminRepository.save(admin);
  }

  public List<Admin> getAllAdmins() {
    return adminRepository.findAll();
  }

  private void validateAdminKey(Admin admin) {
    if (admin.getAdminKey() != null && !admin.getAdminKey().isEmpty()) {
      throw new InvalidRequestException("Admin key cannot be empty");
    }
  }
}
