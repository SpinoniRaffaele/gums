package com.rspinoni.gums;

import static org.junit.Assert.assertTrue;

import java.util.List;

import com.rspinoni.gums.model.Project;
import com.rspinoni.gums.model.User;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class StepDefs extends CucumberIntegrationTest {

  private List<User> latestUsers;

  private List<Project> latestProjects;

  @When("^the client calls /user$")
  public void theClientGetUser() {
    latestUsers = userController.getUsers(null);
  }

  @Then("^no user is received$")
  public void noUserIsReceived() {
    assertTrue(latestUsers.isEmpty());
  }
}