# GUMS: Graph User Management System

## Introduction
This project is a spring application that provides a reactive REST API for managing users and projects linked to them.
The application stores data in the NoSQL MongoDB.

## Details
The application is meant to be a toy project that plays with spring, in particular, the project uses:
- Spring IoC
- Spring Data
- Spring AOP
- Spring webMVC
- Spring Security
- JUnit 5
- Mockito
- MongoDB
- Lombok
- Maven
- Github action

In the frontend it uses:
- Angular
- Three.js
- Karma

The choice of not using spring boot is intentional, the goal is to understand how spring works under the hood.

## Run the backend application
In order to run the application you need to have docker installed and then run the following command
from the root directory of the project:
```bash
docker compose up
```
it will pull the mongo image and start the application on port 8080 you can access the application at 
http://localhost:8080/gums-1/

## UI Demo
The full project is not deployed anywhere, 
but the frontend app with fake backend calls is available in the project
in order to run it, you need to have node 18 installed and then run the following commands:
```bash
cd gums-ui
npm install
npm run start:mock
```
Then you can open your browser at http://localhost:4200

## TODO
- Move to reactive implementation
- Build UI with Three.js
- Add docker and export the microservice as a docker image