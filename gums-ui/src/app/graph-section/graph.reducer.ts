import { ElementType, Project, User } from "./graph-utils/graph.datamodel";
import {
  AddUserCompleted, CreateProjectCompleted,
  DeleteProjectCompleted,
  DeleteUserCompleted,
  EditProjectCompleted,
  EditUserCompleted,
  GetProjectsCompleted,
  GetUsersCompleted,
  SelectElementCompleted,
  UnselectElementCompleted
} from "./graph.action";
import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";

export const GRAPH_REDUCER = 'graph';

export const initialState: GraphState = {
  selectedId: null,
  users: [],
  projects: []
}

export interface GraphState {
  selectedId: string;
  users: User[];
  projects: Project[];
}

export const graphReducer = createReducer(
  initialState,
  on(GetUsersCompleted, getUserCompletedAction),
  on(AddUserCompleted, addUserCompletedAction),
  on(SelectElementCompleted, selectElementCompleted),
  on(UnselectElementCompleted, unselectElementCompleted),
  on(EditUserCompleted, editUserCompletedAction),
  on(DeleteUserCompleted, deleteUserCompletedAction),
  on(GetProjectsCompleted, getProjectsCompletedAction),
  on(EditProjectCompleted, editProjectsCompletedAction),
  on(DeleteProjectCompleted, deleteProjectsCompletedAction),
  on(CreateProjectCompleted, createProjectCompletedAction)
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

function selectElementCompleted(state: GraphState, action) {
  return {
    ...state,
    selectedId: action.selectedId
  }
}

function unselectElementCompleted(state: GraphState) {
  return {
    ...state,
    selectedId: null
  }
}

function editUserCompletedAction(state: GraphState, action) {
  return {
    ...state,
    users: state.users.map(user => user.id === action.editedUser.id ? action.editedUser : user),
    selectedId: null
  };
}

function deleteUserCompletedAction(state: GraphState, action) {
  return {
    ...state,
    users: state.users.filter(user => user.id !== action.deletedUserId),
    selectedId: null
  };
}

function getProjectsCompletedAction(state: GraphState, action) {
  return {
    ...state,
    projects: action.projects
  };
}

function editProjectsCompletedAction(state: GraphState, action) {
  return {
    ...state,
    projects: state.projects.map(project => project.id === action.project.id ? action.project : project),
  };
}

function deleteProjectsCompletedAction(state: GraphState, action) {
  return {
    ...state,
    projects: state.projects.filter(project => project.id !== action.projectId)
  };
}

function createProjectCompletedAction(state: GraphState, action) {
  return {
    ...state,
    projects: [...state.projects, action.project]
  };
}


export const select = createFeatureSelector<GraphState>(GRAPH_REDUCER);

export const selectSelectedElement = createSelector(select, (state: GraphState) => {
  const project = state.projects.find(project => project.id === state.selectedId);
  return project ? {element: project, type: ElementType.PROJECT} :
      {element: state.users.find(user => user.id === state.selectedId), type: ElementType.USER};
});

export const selectNoElementsToDisplay = createSelector(select, (state: GraphState) => {
  return state.users.length === 0 && state.projects.length === 0;
});