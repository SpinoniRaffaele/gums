package com.rspinoni.gums.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;
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

  //the name is unique for users
  String name;

  int age;

  String email;

  @JsonProperty( value = "password", access = JsonProperty.Access.WRITE_ONLY)
  String password;

  boolean isAdmin;

  @JsonProperty( value = "adminKey", access = JsonProperty.Access.WRITE_ONLY)
  String adminKey;
}
