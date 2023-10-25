import { combineReducers } from "@reduxjs/toolkit";
import { taskReducer } from "./taskReducer";
import { taskListReducer } from "./taskListReducer";

const rootReducer = combineReducers({
  task: taskReducer,
  taskList: taskListReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
