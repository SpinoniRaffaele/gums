Feature: user API is working as expected
  Scenario: user retrieval
    When the client calls /user
    Then no user is received
