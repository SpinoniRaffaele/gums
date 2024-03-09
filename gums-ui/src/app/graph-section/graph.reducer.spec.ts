import { graphReducer, initialState } from './graph.reducer';
import {
  AddUserCompleted,
  EditUserCompleted,
  GetUsersCompleted,
  SelectUserCompleted,
  UnselectUserCompleted
} from './graph.action';
import { User } from './graph-utils/graph.datamodel';

describe('GraphReducer', () => {
  const initialStateWithUser = {
    ...initialState,
    users: [new User("1", "John", "mail", 12, true)]
  };

  it('should set the user', () => {
    const users = [new User("1", "John", "mail", 12, true)];
    const state = graphReducer(initialState, GetUsersCompleted({ users: users }));

    expect(state.users).toEqual(users);
    expect(state.selectedUserId).toBeNull();
    expect(state.projects).toEqual([]);
  });

  it('should add a user', () => {
    const user = new User("1", "John", "mail", 12, true);
    const state = graphReducer(initialState, AddUserCompleted({ newUser: user }));

    expect(state.users).toEqual([user]);
    expect(state.selectedUserId).toBeNull();
    expect(state.projects).toEqual([]);
  });

  it('should select a user', () => {
    const state = graphReducer(initialStateWithUser, SelectUserCompleted({ selectedUserId: "1" }));

    expect(state.users).toEqual(initialStateWithUser.users);
    expect(state.selectedUserId).toEqual("1");
    expect(state.projects).toEqual([]);
  });

  it('should unselect a user', () => {
    const initialStateWithSelectedUser = {
      ...initialState,
      users: [new User("1", "John", "mail", 12, true)],
      selectedUserId: "1"
    }
    const state = graphReducer(initialStateWithSelectedUser, UnselectUserCompleted());

    expect(state.users).toEqual(initialStateWithSelectedUser.users);
    expect(state.selectedUserId).toBeNull();
    expect(state.projects).toEqual([]);
  });

  it('should edit the user', () => {
    const state = graphReducer(initialStateWithUser, EditUserCompleted(
        { editedUser: new User("1", "John", "mail", 12, false) }));

    expect(state.users).toEqual([new User("1", "John", "mail", 12, false)]);
    expect(state.selectedUserId).toBeNull();
    expect(state.projects).toEqual([]);
  });
});