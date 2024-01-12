import { createAction, props } from "@ngrx/store";
import { User } from "./graph-utils/graph.datamodel";

export const GetUsersCompleted = createAction('[Graph Action] Get Users completed', props<{users: User[]}>());
