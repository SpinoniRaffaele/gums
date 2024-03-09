import { createAction, props } from "@ngrx/store";
import { User } from "./graph-utils/graph.datamodel";

export const GetUsersCompleted = createAction('[Graph Action] Get Users completed',
    props<{users: User[]}>());
export const AddUserCompleted = createAction('[Graph Action] Add User completed',
    props<{newUser: User}>());
export const SelectUserCompleted = createAction('[Graph Action] Select User completed',
    props<{selectedUserId: string}>());
export const UnselectUserCompleted = createAction('[Graph Action] Unselect User completed');
export const EditUserCompleted = createAction('[Graph Action] Edit User completed',
    props<{editedUser: User}>());