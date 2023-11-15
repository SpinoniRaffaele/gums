package com.rspinoni.gums.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.DeleteQuery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.rspinoni.gums.model.Project;

public interface ProjectRepository extends MongoRepository<Project, String> {
  @Query("{ 'name' : ?0 }")
  List<Project> findAllByName(String name);

  @Query("{ 'ownerId' : ?0 }")
  List<Project> findAllByOwnerId(String ownerId);

  @Query("{ 'name' : ?0, 'ownerId' : ?1 }")
  List<Project> findAllByNameAndOwnerId(String name, String ownerId);

  @DeleteQuery("{ 'name' : ?0}")
  List<Project> deleteAllByName(String name);

  @DeleteQuery("{ 'ownerId' :  ?0}")
  List<Project> deleteAllByOwnerId(String ownerId);

  @DeleteQuery("{ 'name' :  ?0, 'ownerId' :  ?1}")
  List<Project> deleteAllByNameAndOwnerId(String name, String ownerId);
}
