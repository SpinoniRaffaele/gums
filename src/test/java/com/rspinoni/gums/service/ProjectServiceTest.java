package com.rspinoni.gums.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.rspinoni.gums.exceptions.InvalidRequestException;
import com.rspinoni.gums.exceptions.NotFoundException;
import com.rspinoni.gums.model.Project;
import com.rspinoni.gums.model.User;
import com.rspinoni.gums.repository.ProjectRepository;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

  private static final String ID = "id";

  private static final String ID_2 = "id2";

  private static final Project PROJECT = Project.builder()
      .id(ID)
      .name("name")
      .linkedProjectIds(Collections.emptyList())
      .content(null)
      .collaboratorIds(Collections.singletonList("ownerId"))
      .ownerId("ownerId")
      .properties(Collections.singletonMap("key", "value"))
      .build();

  private static final User USER = User.builder()
      .id("ownerId")
      .name("name")
      .email("email")
      .build();

  @Mock
  private ProjectRepository projectRepository;

  @Mock
  private UserService userService;

  @Captor
  private ArgumentCaptor<Project> projectArgumentCaptor;

  @InjectMocks
  private ProjectService projectService;

  @Test
  void testCreateProject() {
    Project inputProject = Project.builder()
        .name("name")
        .linkedProjectIds(Collections.emptyList())
        .content(null)
        .collaboratorIds(Collections.singletonList("ownerId"))
        .ownerId("ownerId")
        .properties(Collections.singletonMap("key", "value"))
        .build();

    when(projectRepository.findAll()).thenReturn(Collections.emptyList());
    when(userService.getAllUsers()).thenReturn(Collections.singletonList(USER));

    projectService.createProject(inputProject);

    verify(projectRepository).insert(projectArgumentCaptor.capture());
    assertEquals(inputProject.getName(), projectArgumentCaptor.getValue().getName());
    assertNotNull(projectArgumentCaptor.getValue().getId());
  }

  @Test
  void testCreateProjectNoName() {
    Project inputProject = Project.builder()
        .name("")
        .linkedProjectIds(Collections.emptyList())
        .content(null)
        .collaboratorIds(Collections.singletonList("ownerId"))
        .ownerId("ownerId")
        .properties(Collections.singletonMap("key", "value"))
        .build();

    assertThrows(InvalidRequestException.class, () -> projectService.createProject(inputProject));
  }

  @Test
  void testCreateProjectNoOwnerId() {
    Project inputProject = Project.builder()
        .name("name")
        .linkedProjectIds(Collections.emptyList())
        .content(null)
        .collaboratorIds(Collections.singletonList("ownerId"))
        .ownerId(null)
        .properties(Collections.singletonMap("key", "value"))
        .build();

    assertThrows(InvalidRequestException.class, () -> projectService.createProject(inputProject));
  }

  @Test
  void testCreateProjectInvalidLinkedProjectId() {
    Project inputProject = Project.builder()
        .name("name")
        .linkedProjectIds(Collections.singletonList(ID_2))
        .content(null)
        .collaboratorIds(Collections.singletonList("ownerId"))
        .ownerId("ownerId")
        .properties(Collections.singletonMap("key", "value"))
        .build();

    when(projectRepository.findAll()).thenReturn(Collections.singletonList(PROJECT));

    assertThrows(InvalidRequestException.class, () -> projectService.createProject(inputProject));
  }

  @Test
  void testCreateProjectInvalidCollaboratorId() {
    Project inputProject = Project.builder()
        .name("name")
        .linkedProjectIds(Collections.singletonList(ID))
        .content(null)
        .collaboratorIds(Collections.singletonList("invalidId"))
        .ownerId("ownerId")
        .properties(Collections.singletonMap("key", "value"))
        .build();

    when(projectRepository.findAll()).thenReturn(Collections.singletonList(PROJECT));
    when(userService.getAllUsers()).thenReturn(Collections.singletonList(USER));

    assertThrows(InvalidRequestException.class, () -> projectService.createProject(inputProject));
  }

  @Test
  void testCreateProjectInvalidOwnerId() {
    Project inputProject = Project.builder()
        .name("name")
        .linkedProjectIds(Collections.singletonList(ID))
        .content(null)
        .collaboratorIds(Collections.singletonList("ownerId"))
        .ownerId("invalidId")
        .properties(Collections.singletonMap("key", "value"))
        .build();

    when(projectRepository.findAll()).thenReturn(Collections.singletonList(PROJECT));
    when(userService.getAllUsers()).thenReturn(Collections.singletonList(USER));

    assertThrows(InvalidRequestException.class, () -> projectService.createProject(inputProject));
  }

  @Test
  void testCreateProjectInvalidOwnerIdMissingInCollaborators() {
    Project inputProject = Project.builder()
        .name("name")
        .linkedProjectIds(Collections.singletonList(ID))
        .content(null)
        .collaboratorIds(Collections.emptyList())
        .ownerId("ownerId")
        .properties(Collections.singletonMap("key", "value"))
        .build();

    when(projectRepository.findAll()).thenReturn(Collections.singletonList(PROJECT));
    when(userService.getAllUsers()).thenReturn(Collections.singletonList(USER));

    assertThrows(InvalidRequestException.class, () -> projectService.createProject(inputProject));
  }

  @Test
  void testUpdateProject() {
    when(projectRepository.findById(ID)).thenReturn(Optional.of(PROJECT));
    when(projectRepository.findAll()).thenReturn(Collections.singletonList(PROJECT));
    when(userService.getAllUsers()).thenReturn(Collections.singletonList(USER));

    projectService.updateProject(PROJECT);

    verify(projectRepository).save(projectArgumentCaptor.capture());
    assertEquals(PROJECT.getId(), projectArgumentCaptor.getValue().getId());
    assertEquals(PROJECT.getName(), projectArgumentCaptor.getValue().getName());
  }

  @Test
  void testUpdateProjectKo() {
    when(projectRepository.findById(ID)).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> projectService.updateProject(PROJECT));
  }

  @Test
  void testGetProjectById() {
    when(projectRepository.findById(ID)).thenReturn(Optional.of(PROJECT));

    Project project = projectService.getProjectById(ID);

    assertEquals(PROJECT.getId(), project.getId());
    assertEquals(PROJECT.getName(), project.getName());
  }

  @Test
  void testGetProjectByIdKo() {
    when(projectRepository.findById(ID)).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () -> projectService.getProjectById(ID));
  }
}