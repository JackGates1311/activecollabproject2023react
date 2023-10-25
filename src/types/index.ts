export type ArrOfNumbers = number[];

export interface SingleLabel {
  id: number;
  color: string;
}

export interface SingleUser {
  id: number;
  name: string;
  avatar_url: string;
}

export interface SingleTaskList {
  id: number;
  name: string;
  open_tasks: number;
  completed_tasks: number;
  position: number;
  is_completed: boolean;
  is_trashed: boolean;
}

export interface SingleTask {
  id: number;
  name: string;
  is_completed: boolean;
  task_list_id: number;
  position: number;
  start_on: string | null;
  due_on: string | null;
  labels: ArrOfNumbers;
  open_subtasks: number;
  comments_count: number;
  assignee: ArrOfNumbers;
  is_important: boolean;
  completed_on: string | null;
}

export interface Collection<T> {
  [key: string]: T;
  [key: number]: T;
}
