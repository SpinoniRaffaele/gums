package com.rspinoni.gums.model;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {
  @Id
  String id;

  String name;

  List<String> linkedProjectIds;

  Object content;

  List<String> collaboratorIds;

  String ownerId;

  Map<String, String> properties;
}
