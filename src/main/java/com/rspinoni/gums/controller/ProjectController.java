package com.rspinoni.gums.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rspinoni.gums.model.Project;
import com.rspinoni.gums.service.ProjectService;

@RestController
@RequestMapping("/project")
public class ProjectController {

  private final ProjectService projectService;

  public ProjectController(ProjectService projectService) {
    this.projectService = projectService;
  }

  @GetMapping("/{id}")
  public Project getProjectById(@PathVariable String id) {
    return projectService.getProjectById(id);
  }

  @GetMapping
  public List<Project> getProjects(
      @RequestParam("name") String name, @RequestParam("ownerId") String ownerId) {
    boolean nameFilter = name != null && !name.isEmpty();
    boolean ownerIdFilter = ownerId != null && !ownerId.isEmpty();
    if (nameFilter && ownerIdFilter) {
      return projectService.getProjectsByNameAndOwnerId(name, ownerId);
    } else {
      if (nameFilter) {
        return projectService.getProjectsByName(name);
      }
      if (ownerIdFilter) {
        return projectService.getProjectsByOwnerId(ownerId);
      }
    }
    return projectService.getAllProjects();
  }

  @DeleteMapping("/{id}")
  public void deleteProjectById(@PathVariable String id) {
    projectService.deleteProjectById(id);
  }

  @DeleteMapping
  public void deleteProjects(
      @RequestParam("name") String name, @RequestParam("ownerId") String ownerId) {
    boolean nameFilter = name != null && !name.isEmpty();
    boolean ownerIdFilter = ownerId != null && !ownerId.isEmpty();
    if (nameFilter && ownerIdFilter) {
      projectService.deleteProjectsByNameAndOwnerId(name, ownerId);
      return;
    } else {
      if (nameFilter) {
        projectService.deleteProjectsByName(name);
        return;
      }
      if (ownerIdFilter) {
        projectService.deleteProjectsByOwnerId(ownerId);
        return;
      }
    }
    projectService.deleteAllProjects();
  }

  @PostMapping
  public void createProject(Project project) {
    projectService.createProject(project);
  }

  @PutMapping
  public void updateProject(Project project) {
    projectService.updateProject(project);
  }
}
