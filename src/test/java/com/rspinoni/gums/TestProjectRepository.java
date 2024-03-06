package com.rspinoni.gums;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.rspinoni.gums.config.MongoDBTestContainerConfig;
import com.rspinoni.gums.config.security.SecurityConfig;
import com.rspinoni.gums.model.Project;
import com.rspinoni.gums.repository.ProjectRepository;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = { MongoDBTestContainerConfig.class, SecurityConfig.class })
@Testcontainers
@ActiveProfiles("test")
public class TestProjectRepository {

  private static final String ID = UUID.randomUUID().toString();

  private static final String ID_2 = UUID.randomUUID().toString();

  private static final Project PROJECT = new Project(
      ID,
      "name",
      Arrays.asList("proj1", "proj2"),
      "{\"key\":\"val\"}",
      Arrays.asList("user1", "user2"),
      "ownerId",
      Collections.singletonMap("key", "val")
  );

  private static final Project PROJECT_2 = new Project(
      ID_2,
      "name",
      Arrays.asList("proj3", "proj4"),
      "plain content",
      Arrays.asList("user3", "user4"),
      "ownerId2",
      Collections.singletonMap("key", "val")
  );

  @Autowired
  private ProjectRepository projectRepository;

  @AfterEach
  public void cleanUp() {
    projectRepository.deleteAll();
  }

  @Test
  public void testInsert() {
    projectRepository.insert(PROJECT);

    List<Project> projects = projectRepository.findAll();
    assertEquals(1, projects.size());
    assertEquals("name", projects.get(0).getName(), "Project name should be name");
    assertEquals("proj1", projects.get(0).getLinkedProjectIds().get(0), "Project linked project is correct");
    assertEquals("proj2", projects.get(0).getLinkedProjectIds().get(1), "Project linked project is correct");
    assertEquals("val", projects.get(0).getProperties().get("key"), "Project properties are correct");
    assertEquals("user1", projects.get(0).getCollaboratorIds().get(0), "Project collaborators are correct");
    assertEquals("user2", projects.get(0).getCollaboratorIds().get(1), "Project collaborators are correct");
    assertEquals("ownerId", projects.get(0).getOwnerId(), "Project owner is correct");
    assertEquals(ID, projects.get(0).getId(), "Project id is correct");
  }

  @Test
  public void testRetrieveById() {
    projectRepository.insert(PROJECT);
    projectRepository.insert(PROJECT_2);
    Project project = projectRepository.findById(ID).get();

    assertEquals("name", project.getName(), "Project name should be name");
    assertEquals("proj1", project.getLinkedProjectIds().get(0), "Project linked project is correct");
    assertEquals("proj2", project.getLinkedProjectIds().get(1), "Project linked project is correct");
    assertEquals("val", project.getProperties().get("key"), "Project properties are correct");
    assertEquals("user1", project.getCollaboratorIds().get(0), "Project collaborators are correct");
    assertEquals("user2", project.getCollaboratorIds().get(1), "Project collaborators are correct");
    assertEquals("ownerId", project.getOwnerId(), "Project owner is correct");
    assertEquals(ID, project.getId(), "Project id is correct");
  }

  @Test
  public void testRetrieveByName() {
    projectRepository.insert(PROJECT);
    projectRepository.insert(PROJECT_2);
    List<Project> projects = projectRepository.findAllByName("name");

    assertEquals(2, projects.size());
    assertEquals("name", projects.get(0).getName(), "Project name should be name");
    assertEquals("name", projects.get(1).getName(), "Project name should be name");
    assertTrue(projects.stream().anyMatch(project -> project.getId().equals(ID)), "Project id is correct");
    assertTrue(projects.stream().anyMatch(project -> project.getId().equals(ID_2)), "Project id is correct");
  }

  @Test
  public void testRetrieveByOwnerId() {
    projectRepository.insert(PROJECT);
    projectRepository.insert(PROJECT_2);
    List<Project> projects = projectRepository.findAllByOwnerId("ownerId");

    assertEquals(1, projects.size());
    assertEquals(ID, projects.get(0).getId(), "Project id is correct");
  }

  @Test
  public void testRetrieveByOwnerIdAndName() {
    projectRepository.insert(PROJECT);
    projectRepository.insert(PROJECT_2);
    List<Project> projects = projectRepository.findAllByNameAndOwnerId("name", "ownerId");

    assertEquals(1, projects.size());
    assertEquals(ID, projects.get(0).getId(), "Project id is correct");
  }

  @Test
  public void testDeleteByName() {
    projectRepository.insert(PROJECT);
    projectRepository.insert(PROJECT_2);
    projectRepository.deleteAllByName("name");

    List<Project> projects = projectRepository.findAll();
    assertEquals(0, projects.size());
  }

  @Test
  public void testDeleteByOwnerId() {
    projectRepository.insert(PROJECT);
    projectRepository.insert(PROJECT_2);
    projectRepository.deleteAllByOwnerId("ownerId");

    List<Project> projects = projectRepository.findAll();
    assertEquals(1, projects.size());
    assertEquals("ownerId2", projects.get(0).getOwnerId(), "The correct project was deleted");
  }

  @Test
  public void testDeleteByOwnerIdAndName() {
    projectRepository.insert(PROJECT);
    projectRepository.insert(PROJECT_2);
    projectRepository.deleteAllByNameAndOwnerId("name", "ownerId");

    List<Project> projects = projectRepository.findAll();
    assertEquals(1, projects.size());
    assertEquals("ownerId2", projects.get(0).getOwnerId(), "The correct project was deleted");
  }
}
