import { createAction, props } from "@ngrx/store";
import { Project, User } from "./graph-utils/graph.datamodel";

export const GetUsersCompleted = createAction('[Graph Action] Get Users completed',
    props<{users: User[]}>());
export const AddUserCompleted = createAction('[Graph Action] Add User completed',
    props<{newUser: User}>());
export const SelectElementCompleted = createAction('[Graph Action] Select User completed',
    props<{selectedId: string}>());
export const UnselectElementCompleted = createAction('[Graph Action] Unselect User completed');
export const EditUserCompleted = createAction('[Graph Action] Edit User completed',
    props<{editedUser: User}>());
export const DeleteUserCompleted = createAction('[Graph Action] Delete User completed',
    props<{deletedUserId: string}>());
export const GetProjectsCompleted = createAction('[Graph Action] Get Projects completed',
    props<{projects: Project[]}>());
export const EditProjectCompleted = createAction('[Graph Action] Edit Project completed',
    props<{project: Project}>());