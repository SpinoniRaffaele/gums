package com.rspinoni.gums.cucumber;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;

import com.rspinoni.gums.model.Credentials;
import com.rspinoni.gums.model.CredentialsStatus;
import com.rspinoni.gums.model.Project;
import com.rspinoni.gums.model.User;
import io.cucumber.java.DataTableType;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class StepDefs extends CucumberIntegrationTest {

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

  // WHEN steps

  @When("The client retrieves users with name {string}")
  public void theClientGetUser(String name) {
    latestUsers = userController.getUsers(name);
  }

  @When("The client retrieves user with ID {string}")
  public void theClientGetUserByID(String id) {
    latestUsers = Collections.singletonList(userController.getUserById(id));
  }

  @When("The client DELETE a user with name {string}")
  public void theClientDeleteUser(String name) {
    userController.deleteUsers(name);
  }

  @When("The client DELETE a user with ID {string}")
  public void theClientDeleteUserByID(String id) {
    userController.deleteUserById(id);
  }

  @When("The client adds the user:")
  public void theClientAddsTheUser(User user) {
    userController.createUser(user);
  }

  @When("The client updates the user to:")
  public void theClientUpdatesTheUser(User user) {
    userController.updateUser(user);
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

  @Then("No user is received")
  public void noUserIsReceived() {
    Assertions.assertTrue(latestUsers.isEmpty());
  }

  @Then("The users received are:")
  public void theUsersReceivedContains(List<User> users) {
    Assertions.assertEquals(latestUsers, users);
  }

  @Then("The status received is {string}")
  public void theStatusReceivedIs(String status) {
    Assertions.assertEquals(latestStatus.name(), status);
  }

  @Then("The users left in database are {int}")
  public void theDatabaseStateIs(Integer num) {
    Assertions.assertEquals(userController.getUsers(null).size(), num);
  }

  @Then("The users left in database are:")
  public void theDatabaseStateIs(List<User> users) {
    Assertions.assertEquals(userRepo.findAll(), users);
  }

  @Then("The user {string} is in the database")
  public void theUserIsInTheDatabase(String name) {
    Assertions.assertFalse(userController.getUsers(name).isEmpty());
  }
}