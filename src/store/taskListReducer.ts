import { createAction, createReducer } from "@reduxjs/toolkit";
import {Collection, SingleTaskList} from "../types";
//import data from "../data.json";
import {fetchTaskLists} from "../api/api";

export const addTaskListAction = createAction<SingleTaskList>(
  "taskList/addTaskList",
);

export const updateTaskListAction = createAction<Partial<SingleTaskList>>(
  "taskList/updateTaskList",
);

export const completeTaskListAction = createAction<number>(
  "taskLists/completeTaskList",
);

let task_lists: SingleTaskList[] = [];
try {
  if(localStorage.getItem('token') !== null && localStorage.getItem('token') !== "" &&
      localStorage.getItem('token') !== undefined) {
    task_lists = await fetchTaskLists();
  }
} catch (error) {
  console.error('Error fetching task lists:', error);
}

const initialState = task_lists.reduce<Collection<SingleTaskList>>( // fetching task list data
  (prev, next) => {
    prev[next.id] = next;
    return prev;
  },
  {},
);

// alert(JSON.stringify(initialState, null, 2));

export const taskListReducer = createReducer<Collection<SingleTaskList>>( // create new task list function
  initialState,
  (builder) => {
    builder
      .addCase(addTaskListAction, (state, action) => {
        return {
          ...state,
          [action.payload.id]: action.payload,
        };
      })
      .addCase(updateTaskListAction, (state, action) => {
        if (action.payload.id && state[action.payload.id]) {
          return {
            ...state,
            [action.payload.id]: {
              ...state[action.payload.id],
              ...action.payload,
            },
          };
        }
        return state;
      })
      .addCase(completeTaskListAction, (state, action) => {
        if (state[action.payload]) {
          state = {
            ...state,
            [action.payload]: {
              ...state[action.payload],
              is_completed: true,
            },
          };
        }
        return state;
      });
  },
);
