const projects = [
  {
    "id": "projId0",
    "name": "project0",
    "linkedProjectIds": [],
    "content": {"key": true, "list": ["string", "string"]},
    "collaboratorIds": ["55252615-b947-4bb6-a5ce-62a9340aec33"],
    "ownerId": "55252615-b947-4bb6-a5ce-62a9340aec33",
    "properties": {"key": "value"}
  },
  {
    "id": "projId1",
    "name": "project1",
    "linkedProjectIds": [],
    "content": {"description": "random content"},
    "collaboratorIds": ["55252615-b947-4bb6-a5ce-62a9340aec44"],
    "ownerId": "55252615-b947-4bb6-a5ce-62a9340aec44",
    "properties": {"key": "val"}
  },
  {
    "id": "projId2",
    "name": "project2",
    "linkedProjectIds": ["projId0"],
    "content": {},
    "collaboratorIds": [
      "55252615-b947-4bb6-a5ce-62a9340aec55",
      "55252615-b947-4bb6-a5ce-62a9340aec66"
    ],
    "ownerId": "55252615-b947-4bb6-a5ce-62a9340aec55",
    "properties": {"key": "val"}
  }
];

module.exports = {projects};