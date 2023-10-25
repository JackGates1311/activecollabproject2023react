import data from "../data.json";
import { Collection, SingleLabel, SingleUser } from "../types";

export const labels = data.labels.reduce<Collection<SingleLabel>>(
  (prev, next) => {
    prev[next.id] = next;
    return prev;
  },
  {},
);

export const users = data.users.reduce<Collection<SingleUser>>((prev, next) => {
  prev[next.id] = next;
  return prev;
}, {});
