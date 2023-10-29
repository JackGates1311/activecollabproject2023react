import {Collection, SingleLabel, SingleUser} from "../types";
import {fetchLabels, fetchAssignee} from "../api/api";

let labels_data: SingleLabel[] = [];
try {
    if(localStorage.getItem('token') !== null && localStorage.getItem('token') !== "" &&
        localStorage.getItem('token') !== undefined) {
        labels_data = await fetchLabels();
    }
} catch (error) {
    console.error('Error fetching labels:', error);
}

export const labels = labels_data.reduce<Collection<SingleLabel>>(
  (prev, next) => {
    prev[next.id] = next;
    return prev;
  },
  {},
);

let users_data: SingleUser[] = [];
try {
    if(localStorage.getItem('token') !== null && localStorage.getItem('token') !== "" &&
        localStorage.getItem('token') !== undefined) {
        users_data = await fetchAssignee();
    }
} catch (error) {
    console.error('Error fetching users:', error);
}
export const users = users_data.reduce<Collection<SingleUser>>((prev, next) => {
  prev[next.id] = next;
  return prev;
}, {});
