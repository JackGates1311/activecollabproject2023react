import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./reducers";
import { Collection } from "../types";

const getTasks = (state: RootState) => state.task;
const getTaskLists = (state: RootState) => state.taskList;

const getTasksArray = createSelector(getTasks, (tasks) => Object.values(tasks));

export const getTaskListsArray = createSelector(getTaskLists, (taskLists) =>
  Object.values(taskLists),
);

const sortByPosition = (a: { position: number }, b: { position: number }) => {
  if (a.position === b.position) {
    return 0;
  }
  return a.position < b.position ? -1 : 1;
};

export const getTasksByTaskListId = createSelector(
  getTasksArray,
  (state: RootState, id: number) => id,
  (tasks, taskListId) => {
    return tasks
      .filter((task) => task.task_list_id === taskListId && !task.is_completed)
      .sort(sortByPosition);
  },
);

export const getTaskListsSorted = createSelector(
  getTaskListsArray,
  (taskLists) => {
    return taskLists
      .filter((taskList) => !taskList.is_completed && !taskList.is_trashed)
      .sort((a, b) => {
        return a.position - b.position;
      });
  },
);

export const getCompletedTasks = createSelector(getTasksArray, (tasks) => {
  return tasks
    .filter((t) => t.is_completed)
    .sort((a, b) => {
      if (a.completed_on && b.completed_on) {
        if (a.completed_on === b.completed_on) {
          return 0;
        }
        return Date.parse(a.completed_on) > Date.parse(b.completed_on) ? -1 : 1;
      }
      return sortByPosition(a, b);
    });
});

export const getTasksByTaskListsIds = createSelector(
  getTasks,
  getCompletedTasks,
  (tasks, completedTasks) => {
    return Object.values(tasks).reduce<Collection<number[]>>(
      (prev, next) => {
        const key = next.task_list_id;
        if (!prev[key]) {
          prev[key] = [];
        }
        prev[key].push(next.id);
        prev[key].sort((a, b) => {
          return sortByPosition(tasks[a], tasks[b]);
        });
        return prev;
      },
      {
        "completed-list": completedTasks.map((t) => t.id),
      },
    );
  },
);
