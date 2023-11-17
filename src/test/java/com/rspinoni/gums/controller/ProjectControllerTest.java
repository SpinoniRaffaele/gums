package com.rspinoni.gums.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.rspinoni.gums.model.Project;
import com.rspinoni.gums.service.ProjectService;

@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

  private static final Project PROJECT = Project.builder()
      .id("1")
      .name("test")
      .ownerId("1")
      .build();

  private static final Project PROJECT_2 = Project.builder()
      .id("2")
      .name("test2")
      .ownerId("2")
      .build();

  @InjectMocks
  private ProjectController projectController;

  @Mock
  private ProjectService projectService;

  @Captor
  private ArgumentCaptor<String> stringArgumentCaptor;

  @Test
  public void testGetProjectById() {
    when(projectService.getProjectById("1")).thenReturn(PROJECT);

    Project project = projectController.getProjectById("1");
    assertEquals(PROJECT, project);
  }

  @Test
  public void testGetProjectByNameAndOwnerId() {
    when(projectService.getProjectsByNameAndOwnerId("test", "1")).thenReturn(List.of(PROJECT));

    List<Project> project = projectController.getProjects("test", "1");
    assertEquals(1, project.size());
    assertEquals(PROJECT, project.get(0));
  }

  @Test
  public void testGetProjectByName() {
    when(projectService.getProjectsByName("test")).thenReturn(List.of(PROJECT));

    List<Project> project = projectController.getProjects("test", null);
    assertEquals(1, project.size());
    assertEquals(PROJECT, project.get(0));
  }

  @Test
  public void testGetProjectByOwnerId() {
    when(projectService.getProjectsByOwnerId("1")).thenReturn(List.of(PROJECT));

    List<Project> project = projectController.getProjects(null, "1");
    assertEquals(1, project.size());
    assertEquals(PROJECT, project.get(0));
  }

  @Test
  public void testGetAllProjects() {
    when(projectService.getAllProjects()).thenReturn(List.of(PROJECT, PROJECT_2));

    List<Project> project = projectController.getProjects(null, null);
    assertEquals(2, project.size());
    assertEquals(PROJECT, project.get(0));
    assertEquals(PROJECT_2, project.get(1));
  }

  @Test
  public void testDeleteProjectById() {
    projectController.deleteProjectById("1");

    verify(projectService).deleteProjectById(stringArgumentCaptor.capture());
    assertEquals("1", stringArgumentCaptor.getValue());
  }

  @Test
  public void testDeleteProjectByNameAndOwnerId() {
    projectController.deleteProjects("test", "1");

    verify(projectService).deleteProjectsByNameAndOwnerId(stringArgumentCaptor.capture(),
        stringArgumentCaptor.capture());
    assertEquals("test", stringArgumentCaptor.getAllValues().get(0));
    assertEquals("1", stringArgumentCaptor.getAllValues().get(1));
  }

  @Test
  public void testDeleteProjectByName() {
    projectController.deleteProjects("test", null);

    verify(projectService).deleteProjectsByName(stringArgumentCaptor.capture());
    assertEquals("test", stringArgumentCaptor.getValue());
  }

  @Test
  public void testDeleteProjectByOwnerId() {
    projectController.deleteProjects(null, "1");

    verify(projectService).deleteProjectsByOwnerId(stringArgumentCaptor.capture());
    assertEquals("1", stringArgumentCaptor.getValue());
  }

  @Test
  public void testDeleteAllProjects() {
    projectController.deleteProjects(null, null);

    verify(projectService).deleteAllProjects();
  }

  @Test
  public void testCreateProject() {
    projectController.createProject(PROJECT);

    verify(projectService).createProject(PROJECT);
  }

  @Test
  public void testUpdateProject() {
    projectController.updateProject(PROJECT);

    verify(projectService).updateProject(PROJECT);
  }
}