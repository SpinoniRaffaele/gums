import { Project, User } from "./graph-utils/graph.datamodel";
import {
  AddUserCompleted,
  EditUserCompleted,
  GetUsersCompleted,
  SelectUserCompleted,
  UnselectUserCompleted
} from "./graph.action";
import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";

export const GRAPH_REDUCER = 'graph';

export const initialState: GraphState = {
  selectedUserId: null,
  users: [],
  projects: []
}

export interface GraphState {
  selectedUserId: string;
  users: User[];
  projects: Project[];
}

export const graphReducer = createReducer(
  initialState,
  on(GetUsersCompleted, getUserCompletedAction),
  on(AddUserCompleted, addUserCompletedAction),
  on(SelectUserCompleted, selectUserCompleted),
  on(UnselectUserCompleted, unselectUserCompleted),
  on(EditUserCompleted, editUserCompletedAction)
)

function getUserCompletedAction(state: GraphState, action) {
  return {
    ...state,
    users: action.users
  }
}

function addUserCompletedAction(state: GraphState, action) {
  return {
    ...state,
    users: [...state.users, action.newUser]
  }
}

function selectUserCompleted(state: GraphState, action) {
  return {
    ...state,
    selectedUserId: action.selectedUserId
  }
}

function unselectUserCompleted(state: GraphState) {
  return {
    ...state,
    selectedUserId: null
  }
}

function editUserCompletedAction(state: GraphState, action) {
  return {
    ...state,
    users: state.users.map(user => user.id === action.editedUser.id ? action.editedUser : user),
    selectedUserId: null
  };
}

export const select = createFeatureSelector<GraphState>(GRAPH_REDUCER);

export const selectSelectedUser = createSelector(select, (state: GraphState) => {
  return state.users.find(user => user.id === state.selectedUserId);
});

export const selectNoElementsToDisplay = createSelector(select, (state: GraphState) => {
  return state.users.length === 0 && state.projects.length === 0;
});