package com.rspinoni.gums.model;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@NoArgsConstructor
@Data
public class Admin extends User {

  String adminKey;

  public Admin(String id, String adminKey, String name, String email, String password) {
    super(id, name, email, password);
    this.adminKey = adminKey;
  }
}
