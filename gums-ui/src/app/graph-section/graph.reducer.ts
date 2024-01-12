import { Project, User } from "./graph-utils/graph.datamodel";
import { GetUsersCompleted } from "./graph.action";
import { createReducer, on } from "@ngrx/store";

export const GRAPH_REDUCER = 'graph';

export const initialState = {
  users: [],
  projects: []
}

export interface GraphState {
  users: User[];
  projects: Project[];
}

export const graphReducer = createReducer(
  initialState,
  on(GetUsersCompleted, getUserCompletedAction),
)

function getUserCompletedAction(state: GraphState, action) {
  return {
    ...state,
    users: action.users
  }
}