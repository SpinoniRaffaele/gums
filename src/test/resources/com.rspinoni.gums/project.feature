Feature: project API is working as expected
  Scenario: project retrieval
    Given The following projects are in the database:
      | id | name | linkedProjectIds | content | collaboratorIds    | ownerId | properties        |
      | 1  | P1   | ["2"]            | BLOB    | ["user1", "user2"] | user1   | {"key1":"value1"} |
      | 2  | P1   | ["2"]            | BLOB    | []                 | user0   | {"key1":"value1"} |
      | 3  | P2   | []               | BLOB    | ["user2"]          | user2   | {"key1":"value2"} |
    When The client retrieves projects with name "P1" and owner "user1"
    Then The projects received are:
      | id | name | linkedProjectIds | content | collaboratorIds    | ownerId | properties        |
      | 1  | P1   | ["2"]            | BLOB    | ["user1", "user2"] | user1   | {"key1":"value1"} |

  Scenario: project retrieval by ID
    Given The following projects are in the database:
      | id | name | linkedProjectIds | content | collaboratorIds    | ownerId | properties        |
      | 1  | P1   | ["2"]            | BLOB    | ["user1", "user2"] | user1   | {"key1":"value1"} |
      | 2  | P1   | ["2"]            | BLOB    | []                 | user0   | {"key1":"value1"} |
      | 3  | P2   | []               | BLOB    | ["user2"]          | user2   | {"key1":"value2"} |
    When The client retrieves project with ID "1"
    Then The projects received are:
      | id | name | linkedProjectIds | content | collaboratorIds    | ownerId | properties        |
      | 1  | P1   | ["2"]            | BLOB    | ["user1", "user2"] | user1   | {"key1":"value1"} |

  Scenario: project delete by ID
    Given The following projects are in the database:
      | id | name | linkedProjectIds | content | collaboratorIds    | ownerId | properties        |
      | 1  | P1   | ["2"]            | BLOB    | ["user1", "user2"] | user1   | {"key1":"value1"} |
      | 2  | P1   | ["2"]            | BLOB    | []                 | user0   | {"key1":"value1"} |
      | 3  | P2   | []               | BLOB    | ["user2"]          | user2   | {"key1":"value2"} |
    When The client DELETE a project with ID "1"
    Then The projects left in database are 2

  Scenario: project delete by name
    Given The following projects are in the database:
      | id | name | linkedProjectIds | content | collaboratorIds    | ownerId | properties        |
      | 1  | P1   | ["2"]            | BLOB    | ["user1", "user2"] | user1   | {"key1":"value1"} |
      | 2  | P1   | ["2"]            | BLOB    | []                 | user0   | {"key1":"value1"} |
      | 3  | P2   | []               | BLOB    | ["user2"]          | user2   | {"key1":"value2"} |
    When The client DELETE projects with name "P1" and owner ""
    Then The projects left in database are 1

  Scenario: project creation
    Given The following projects are in the database:
      | id | name | linkedProjectIds | content | collaboratorIds    | ownerId | properties        |
      | 1  | P1   | ["2"]            | BLOB    | ["user1", "user2"] | user1   | {"key1":"value1"} |
      | 3  | P2   | []               | BLOB    | ["user2"]          | user2   | {"key1":"value2"} |
    And The following users are in the database:
      | id     | name  | age | email            | password            | isAdmin  | adminKey  |
      | user0  | Andre | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |
      | user1  | Alice | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |
      | user2  | Bob   | 13  | bob@gmail.com    | 1234A_aeefewf3      | true     | qwerty    |
    When The client adds the project:
      | name | linkedProjectIds  | content | collaboratorIds    | ownerId | properties        |
      | P3   | ["3"]            | BLOB    | ["user1", "user2"] | user1   | {"key1":"value1"} |
    Then The projects left in database are 3
    And There are 1 projects named "P3" in database

  Scenario: project update
    Given The following projects are in the database:
      | id | name | linkedProjectIds | content | collaboratorIds    | ownerId | properties        |
      | 1  | P1   | ["2"]            | BLOB    | ["user1", "user2"] | user1   | {"key1":"value1"} |
      | 2  | P1   | ["2"]            | BLOB    | []                 | user0   | {"key1":"value1"} |
      | 3  | P2   | []               | BLOB    | ["user2"]          | user2   | {"key1":"value2"} |
    And The following users are in the database:
      | id     | name  | age | email            | password            | isAdmin  | adminKey  |
      | user0  | Andre | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |
      | user1  | Alice | 23  | alice@mail.com   | 1234A_aeefewf3      | false    |           |
      | user2  | Bob   | 13  | bob@gmail.com    | 1234A_aeefewf3      | true     | qwerty    |
    Then The client cannot update the project to:
      | id | name | linkedProjectIds | content | collaboratorIds    | ownerId | properties        |
      | 1  | P2   | ["2"]            | NEWBLOB | ["user1", "user2"] | user2   | {"key1":"value2"} |
