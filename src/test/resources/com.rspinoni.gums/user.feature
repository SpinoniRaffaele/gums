Feature: user API is working as expected
  Scenario: user retrieval
    Given The following users are in the database:
        | id | name  | age | email            | password            | isAdmin  | adminKey  |
        | 1  | Alice | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |
        | 2  | Bob   | 13  | bob@gmail.com    | 1234A_aeefewf3      | true     | qwerty    |
    When The client retrieves users with name "Alice"
    And The users received are:
      | id | name  | age | email            | password            | isAdmin  | adminKey  |
      | 1  | Alice | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |

  Scenario: user retrieval by ID
    Given The following users are in the database:
        | id | name  | age | email            | password            | isAdmin  | adminKey  |
        | 1  | Alice | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |
        | 2  | Bob   | 13  | mail@mail.com      | 1234A_aeefewf3      | true     | qwerty    |
    When The client retrieves user with ID "2"
    Then The users received are:
        | id | name  | age | email            | password            | isAdmin  | adminKey  |
        | 2  | Bob   | 13  | mail@mail.com    | 1234A_aeefewf3      | true     | qwerty    |

  Scenario: user deletion
    Given The following users are in the database:
      | id | name  | age | email            | password            | isAdmin  | adminKey  |
      | 1  | Alice | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |
      | 2  | Bob   | 13  | mail@mail.com      | 1234A_aeefewf3      | true     | qwerty    |
    When The client DELETE a user with name "Alice"
    Then The users left in database are 1
    And The users left in database are:
        | id | name  | age | email            | password            | isAdmin  | adminKey  |
        | 2  | Bob   | 13  | mail@mail.com      | 1234A_aeefewf3      | true     | qwerty    |

  Scenario: user deletion by ID
    Given The following users are in the database:
      | id | name  | age | email            | password            | isAdmin  | adminKey  |
      | 1  | Alice | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |
      | 2  | Bob   | 13  | mail@mail.com      | 1234A_aeefewf3      | true     | qwerty    |
    When The client DELETE a user with ID "2"
    Then The users left in database are 1
    And The users left in database are:
        | id | name  | age | email            | password            | isAdmin  | adminKey  |
        | 1  | Alice | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |

  Scenario: user creation
    Given The following users are in the database:
      | id | name  | age | email            | password            | isAdmin  | adminKey  |
    When The client adds the user:
      | name  | age | email            | password            | isAdmin  | adminKey  |
      | Alice | 23  | alice@tets.com   | 1234A_aeefewf3      | false    |           |
    Then The users left in database are 1
    And The user "Alice" is in the database

  Scenario: user modification
    Given The following users are in the database:
      | id | name  | age | email            | password            | isAdmin  | adminKey  |
      | 1  | Alice | 23  | alice@tets.com   | 1234A_aeefewf3      | false    |           |
    When The client updates the user to:
      | id | name     | age | email            | password            | isAdmin  | adminKey  |
      | 1  | AliceNew | 24  | alice@tets.com   | 1234A_aeefewf3      | true     | 123       |
    Then The users left in database are 1
    And The user "AliceNew" is in the database

  Scenario: user password update:
    Given The following users are in the database:
      | id | name  | age | email            | password            | isAdmin  | adminKey  |
      | 1  | Alice | 23  | alice            | 1234A_aeefewf3      | false    |           |
    When The client update the user with ID: "1" with the new password:
      | id | name  | age | email            | password            | isAdmin  | adminKey  |
      | 1  | Alice | 23  | alice            | 1234A_aeefewf3NEW   | false    |           |
    And The client checks the following credentials:
        | name             | password            |
        | Alice            | 1234A_aeefewf3NEW   |
    Then The status received is "VALID"
    And The users left in database are 1