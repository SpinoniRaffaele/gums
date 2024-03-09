package com.rspinoni.gums.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
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
  @ResponseStatus(HttpStatus.OK)
  public Project getProjectById(@PathVariable String id) {
    return projectService.getProjectById(id);
  }

  @GetMapping
  @ResponseStatus(HttpStatus.OK)
  public List<Project> getProjects(@RequestParam(value = "name", required = false) String name,
      @RequestParam(value = "ownerId", required = false) String ownerId) {
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
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteProjectById(@PathVariable String id) {
    projectService.deleteProjectById(id);
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteProjects(@RequestParam(value = "name", required = false) String name,
      @RequestParam(value = "ownerId", required = false) String ownerId) {
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
  @ResponseStatus(HttpStatus.CREATED)
  public Project createProject(@RequestBody Project project) {
    return projectService.createProject(project);
  }

  @PutMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void updateProject(@RequestBody Project project) {
    projectService.updateProject(project);
  }
}
