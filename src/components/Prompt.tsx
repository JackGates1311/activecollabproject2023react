import Modal from "@mui/material/Modal";
import {useEffect, useState} from "react";
import {fetchAssignee, fetchLabels} from "../api/api";
import {SingleLabel, SingleUser} from "../types";

interface Props {
  title: string;
  isOpen: boolean;
  closeFn: () => void;
  submitFn: (text: string, start_on: string, due_on: string, assignees: number[], labels: number[]) => void;
}

export default function Prompt({ title, closeFn, submitFn, isOpen }: Props) {
  const [value, setValue] = useState("");
  const [startOn, setStartOn] = useState("");
  const [dueOn, setDueOn] = useState("");
  const [assignees, setAssignees] = useState<SingleUser[]>([]);
  const [labels, setLabels] = useState<SingleLabel[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<number[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);

  function handleSubmit() {
    if (!value.trim()) return;
    submitFn(value, startOn, dueOn, selectedAssignees, selectedLabels);
    closeFn();
    setValue("");
  }

  const onLoad = async () => {
    let users: SingleUser[] = [];
    let labels: SingleLabel[] = [];
    try {
      users = await fetchAssignee();
    } catch (error) {
      console.error('Error fetching assignees:', error);
    }
    try {
      labels = await fetchLabels();
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
    setAssignees(users);
    setLabels(labels);
  };

  useEffect(() => {
    onLoad().then(() => {});
  }, []);

  return (
    <Modal open={isOpen} onClose={closeFn}>
      <div className="absolute top-[30%] left-[50%] -translate-x-[50%] -translate-y-[30%] bg-gray-300 rounded-md p-5 ">
        <h3 className="text-lg font-bold mb-5">{title}</h3>
        <form onSubmit={handleSubmit}>
          <label className="pt-3">Name:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="block mt-1 w-100"
            autoFocus
            required
          />
          {title === 'Add new task' && (
              <div>
                <label className="pt-3">Start on date:</label>
                <input className="block mt-1 w-100"
                       type="date"
                       value={startOn}
                       onChange={(e) => setStartOn(e.target.value)}
                />
                <label className="pt-3">Due on date:</label>
                <input className="block mt-1 w-100"
                       type="date"
                       value={dueOn}
                       onChange={(e) => setDueOn(e.target.value)}
                />
                <label className="pt-3">Assignee:</label>
                <select
                    className="block mt-1 w-100"
                    multiple
                    value={selectedAssignees.map(String)}
                    onChange={(e) => setSelectedAssignees(Array.from(e.target.selectedOptions,
                        option => parseInt(option.value)))}
                >
                  {assignees.map(assignee => (
                      <option key={assignee.id} value={assignee.id}>
                        {assignee.name}
                      </option>
                  ))}
                </select>
                <label className="pt-3">Labels:</label>
                <select
                    className="block mt-1 w-100"
                    multiple
                    value={selectedLabels.map(String)}
                    onChange={(e) => setSelectedLabels(Array.from(e.target.selectedOptions,
                      option => parseInt(option.value, 10)))}
                >
                  {labels.map(label => (
                      <option key={label.id} value={label.id}>
                        {label.color}
                      </option>
                  ))}
                </select>
              </div>
          )}
          <button className="block mt-3 text-white bg-violet-700 px-3 py-1 rounded-md shadow-md">
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
}
