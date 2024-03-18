import { graphReducer, initialState } from './graph.reducer';
import {
  AddUserCompleted, DeleteUserCompleted, EditProjectCompleted,
  EditUserCompleted, GetProjectsCompleted,
  GetUsersCompleted,
  SelectElementCompleted,
  UnselectElementCompleted
} from './graph.action';
import { Project, User } from './graph-utils/graph.datamodel';

describe('GraphReducer', () => {
  const initialStateWithUser = {
    ...initialState,
    users: [new User("1", "John", "mail", 12, true)]
  };

  it('should set the user', () => {
    const users = [new User("1", "John", "mail", 12, true)];
    const state = graphReducer(initialState, GetUsersCompleted({ users: users }));

    expect(state.users).toEqual(users);
    expect(state.selectedId).toBeNull();
    expect(state.projects).toEqual([]);
  });

  it('should add a user', () => {
    const user = new User("1", "John", "mail", 12, true);
    const state = graphReducer(initialState, AddUserCompleted({ newUser: user }));

    expect(state.users).toEqual([user]);
    expect(state.selectedId).toBeNull();
    expect(state.projects).toEqual([]);
  });

  it('should select a user', () => {
    const state = graphReducer(initialStateWithUser, SelectElementCompleted({ selectedId: "1" }));

    expect(state.users).toEqual(initialStateWithUser.users);
    expect(state.selectedId).toEqual("1");
    expect(state.projects).toEqual([]);
  });

  it('should unselect a user', () => {
    const initialStateWithSelectedUser = {
      ...initialState,
      users: [new User("1", "John", "mail", 12, true)],
      selectedUserId: "1"
    }
    const state = graphReducer(initialStateWithSelectedUser, UnselectElementCompleted());

    expect(state.users).toEqual(initialStateWithSelectedUser.users);
    expect(state.selectedId).toBeNull();
    expect(state.projects).toEqual([]);
  });

  it('should edit the user', () => {
    const state = graphReducer(initialStateWithUser, EditUserCompleted(
        { editedUser: new User("1", "John", "mail", 12, false) }));

    expect(state.users).toEqual([new User("1", "John", "mail", 12, false)]);
    expect(state.selectedId).toBeNull();
    expect(state.projects).toEqual([]);
  });

  it('should delete the user', () => {
    const state = graphReducer(initialStateWithUser, DeleteUserCompleted( { deletedUserId: "1" }));
    expect(state.users).toEqual([]);
    expect(state.selectedId).toBeNull();
    expect(state.projects).toEqual([]);
  });

  it('should set the projects', () => {
    const projects = [new Project("1", "Proj1", "{}", [], [], "user1", {})];
    const state = graphReducer(initialState, GetProjectsCompleted({ projects: projects }));

    expect(state.projects).toEqual(projects);
    expect(state.selectedId).toBeNull();
    expect(state.users).toEqual([]);
  });

  it('should edit the projects', () => {
    const project = new Project("1", "Proj1", "{}", [], [], "user1", {});
    const state = graphReducer({
      ...initialState,
      projects: [{
          id: "1",
          name: "old",
          content: "{\"old\"}",
          collaboratorIds: ["old"],
          linkedProjectIds: ["old"],
          ownerId: "old",
          properties: { old: "old" }
        }]
    }, EditProjectCompleted({ project: project }));

    expect(state.projects).toEqual([project]);
    expect(state.selectedId).toBeNull();
    expect(state.users).toEqual([]);
  });
});