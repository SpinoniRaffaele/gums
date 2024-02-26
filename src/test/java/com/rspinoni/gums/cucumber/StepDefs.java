package com.rspinoni.gums.cucumber;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rspinoni.gums.model.Credentials;
import com.rspinoni.gums.model.CredentialsStatus;
import com.rspinoni.gums.model.Project;
import com.rspinoni.gums.model.User;
import io.cucumber.java.DataTableType;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class StepDefs extends CucumberIntegrationTest {

  public static final TypeReference<Map<String, String>> MAP_TYPE = new TypeReference<>() {};

  public static final TypeReference<List<String>> LIST_TYPE = new TypeReference<>() {};

  private final ObjectMapper objectMapper = new ObjectMapper();

  private List<User> latestUsers;

  private List<Project> latestProjects;

  private CredentialsStatus latestStatus;

  @DataTableType
  public User userEntry(Map<String, String> entry) {
    return new User(
        entry.get("id"),
        entry.get("name"),
        Integer.parseInt(entry.get("age")),
        entry.get("email"),
        entry.get("password"),
        Boolean.parseBoolean(entry.get("isAdmin")),
        entry.get("adminKey"));
  }

  @DataTableType
  public Project projectEntry(Map<String, String> entry) throws JsonProcessingException {
    return new Project(
        entry.get("id"),
        entry.get("name"),
        objectMapper.readValue(entry.get("linkedProjectIds"), LIST_TYPE),
        entry.get("content"),
        objectMapper.readValue(entry.get("collaboratorIds"), LIST_TYPE),
        entry.get("ownerId"),
        objectMapper.readValue(entry.get("properties"), MAP_TYPE)
    );
  }

  @DataTableType
  public Credentials credentialEntry(Map<String, String> entry) {
    return new Credentials(entry.get("name"), entry.get("password"));
  }

  @AfterEach
  public void cleanUp() {
    userRepo.deleteAll();
    projectRepo.deleteAll();
  }

  // GIVEN steps

  @Given("The following users are in the database:")
  public void theFollowingUsersAreInTheDatabase(List<User> users) {
    userRepo.deleteAll();
    userRepo.saveAll(users);
  }

  @Given("The following projects are in the database:")
  public void theFollowingProjectsAreInTheDatabase(List<Project> projects) {
    projectRepo.deleteAll();
    projectRepo.saveAll(projects);
  }

  // WHEN steps

  @When("The client retrieves users with name {string}")
  public void theClientGetUser(String name) {
    latestUsers = userController.getUsers(name);
  }

  @When("The client retrieves projects with name {string} and owner {string}")
  public void theClientGetProjects(String name, String owner) {
    latestProjects = projectController.getProjects(name, owner);
  }

  @When("The client retrieves user with ID {string}")
  public void theClientGetUserByID(String id) {
    latestUsers = Collections.singletonList(userController.getUserById(id));
  }

  @When("The client retrieves project with ID {string}")
  public void theClientGetProjectByID(String id) {
    latestProjects = Collections.singletonList(projectController.getProjectById(id));
  }

  @When("The client DELETE a user with name {string}")
  public void theClientDeleteUser(String name) {
    userController.deleteUsers(name);
  }

  @When("The client DELETE projects with name {string} and owner {string}")
  public void theClientDeleteProjects(String name, String owner) {
    projectController.deleteProjects(name, owner);
  }

  @When("The client DELETE a user with ID {string}")
  public void theClientDeleteUserByID(String id) {
    userController.deleteUserById(id);
  }

  @When("The client DELETE a project with ID {string}")
  public void theClientDeleteProjectByID(String id) {
    projectController.deleteProjectById(id);
  }

  @When("The client adds the user:")
  public void theClientAddsTheUser(User user) {
    userController.createUser(user);
  }

  @When("The client adds the project:")
  public void theClientAddsTheUser(Project project) {
    projectController.createProject(project);
  }

  @When("The client updates the user to:")
  public void theClientUpdatesTheUser(User user) {
    userController.updateUser(user);
  }

  @When("The client updates the project to:")
  public void theClientUpdatesTheProject(Project project) {
    projectController.updateProject(project);
  }

  @When("The client checks the following credentials:")
  public void theClientChecksTheCredentials(Credentials credentials) {
    latestStatus = userController.checkUserCredentials(credentials);
  }

  @When("The client update the user with ID: {string} with the new password:")
  public void theClientUpdatesPassword(String id, User user) {
    userController.updatePassword(id, user);
  }

  // THEN steps

  @Then("The users received are:")
  public void theUsersReceivedAre(List<User> users) {
    Assertions.assertEquals(latestUsers, users);
  }

  @Then("The projects received are:")
  public void theProjectsReceivedAre(List<Project> projects) {
    Assertions.assertEquals(latestProjects, projects);
  }

  @Then("The status received is {string}")
  public void theStatusReceivedIs(String status) {
    Assertions.assertEquals(latestStatus.name(), status);
  }

  @Then("The users left in database are {int}")
  public void theUserDatabaseStateIs(Integer num) {
    Assertions.assertEquals(userController.getUsers(null).size(), num);
  }

  @Then("The projects left in database are {int}")
  public void theProjectDatabaseStateIs(Integer num) {
    Assertions.assertEquals(projectController.getProjects(null, null).size(), num);
  }

  @Then("The users left in database are:")
  public void theUserDatabaseStateIs(List<User> users) {
    Assertions.assertEquals(userRepo.findAll(), users);
  }

  @Then("The projects left in database are:")
  public void theProjectDatabaseStateIs(List<Project> projects) {
    Assertions.assertEquals(projectRepo.findAll(), projects);
  }

  @Then("There are {int} projects named {string} in database")
  public void theProjectDatabaseStateIs(int num, String name) {
    Assertions.assertEquals(projectController.getProjects(name, null).size(), num);
  }

  @Then("The user {string} is in the database")
  public void theUserIsInTheDatabase(String name) {
    Assertions.assertFalse(userController.getUsers(name).isEmpty());
  }
}