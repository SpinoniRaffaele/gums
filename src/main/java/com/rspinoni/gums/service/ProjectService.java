package com.rspinoni.gums.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rspinoni.gums.exceptions.InvalidRequestException;
import com.rspinoni.gums.exceptions.NotFoundException;
import com.rspinoni.gums.model.Project;
import com.rspinoni.gums.model.User;
import com.rspinoni.gums.repository.ProjectRepository;

@Service
public class ProjectService {
  private final ProjectRepository projectRepository;

  private final UserService userService;

  @Autowired
  public ProjectService(ProjectRepository projectRepository, UserService userService) {
    this.projectRepository = projectRepository;
    this.userService = userService;
  }

  public Project createProject(Project project) {
    project.setId(UUID.randomUUID().toString());
    validateProjectCreation(project);
    return projectRepository.insert(project);
  }

  public void updateProject(Project project) {
    projectRepository.findById(project.getId()).ifPresentOrElse(
        projectToUpdate -> {
          validateProjectCreation(project);
          projectRepository.save(project);
        },
        () -> {
          throw new NotFoundException("Project with specified id not found");
        });
  }

  public Project getProjectById(String id) {
    Optional<Project> optionalProject = projectRepository.findById(id);
    if (optionalProject.isEmpty()) {
      throw new NotFoundException("Project with specified id not found");
    }
    return optionalProject.get();
  }

  public List<Project> getProjectsByName(String name) {
    return projectRepository.findAllByName(name);
  }

  public List<Project> getProjectsByOwnerId(String ownerId) {
    return projectRepository.findAllByOwnerId(ownerId);
  }

  public List<Project> getProjectsByNameAndOwnerId(String name, String ownerId) {
    return projectRepository.findAllByNameAndOwnerId(name, ownerId);
  }

  public List<Project> getAllProjects() {
    return projectRepository.findAll();
  }

  public void deleteAllProjects() {
    projectRepository.deleteAll();
  }


  public void deleteProjectsByName(String name) {
    projectRepository.deleteAllByName(name);
  }

  public void deleteProjectsByOwnerId(String ownerId) {
    projectRepository.deleteAllByOwnerId(ownerId);
  }

  public void deleteProjectsByNameAndOwnerId(String name, String ownerId) {
    projectRepository.deleteAllByNameAndOwnerId(name, ownerId);
  }

  public void deleteProjectById(String id) {
    projectRepository.deleteById(id);
  }

  private void validateProjectCreation(Project project) {
    if (project.getName() == null || project.getName().isEmpty()) {
      throw new InvalidRequestException("Project name is missing");
    }
    if (project.getOwnerId() == null || project.getOwnerId().isEmpty()) {
      throw new InvalidRequestException("Project owner missing");
    }
    List<String> projectsIds = getAllProjects().stream().map(Project::getId).toList();
    if (project.getLinkedProjectIds().stream().anyMatch(linkedProjectId -> !projectsIds.contains(linkedProjectId))) {
      throw new InvalidRequestException("Linked projects must be present in the database");
    }
    List<String> usersId = userService.getAllUsers().stream().map(User::getId).toList();
    if (project.getCollaboratorIds().stream().anyMatch(collaboratorIds -> !usersId.contains(collaboratorIds))) {
      throw new InvalidRequestException("Collaborators must be valid users");
    }
    if (!usersId.contains(project.getOwnerId())) {
      throw new InvalidRequestException("Owner must be a valid user");
    }
    if (!project.getCollaboratorIds().contains(project.getOwnerId())) {
      throw new InvalidRequestException("Owner must also be a collaborator");
    }
  }
}
