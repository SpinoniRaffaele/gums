package com.rspinoni.gums.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

  @Id
  String id;

  String name;

  int age;

  String email;

  String password;

  boolean isAdmin;

  String adminKey;
}
