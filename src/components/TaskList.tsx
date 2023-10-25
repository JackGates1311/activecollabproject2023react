import React from "react";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { Droppable } from "react-beautiful-dnd";
import dots from "../assets/trotacka.svg";
import { SingleTask } from "../types";
import Task from "../components/Task";
import { useState } from "react";
import Prompt from "./Prompt";
import { useDispatch, useSelector } from "react-redux";
import { addTaskAction } from "../store/taskReducer";
import { RootState } from "../store/reducers";
import { getTasksByTaskListId } from "../store/selectors";
import {
  completeTaskListAction,
  updateTaskListAction,
} from "../store/taskListReducer";

interface Props {
  id: number;
}

const TaskList = ({ id }: Props) => {
  const [dropdown, setDropdown] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(dropdown);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDropdown(event.currentTarget);
  };
  const handleMenuClose = () => {
    setDropdown(null);
  };
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) =>
    getTasksByTaskListId(state, id),
  );
  const taskList = useSelector((state: RootState) => state.taskList[id]);

  const completeTaskList = () => {
    handleMenuClose();
    dispatch(completeTaskListAction(id));
  };

  function deleteTaskList() {
    handleMenuClose();
    dispatch(
      updateTaskListAction({
        ...taskList,
        is_trashed: true,
      }),
    );
  }

  const onAddTask = (name: string) => {
    const position = tasks.length > 0 ? tasks.length : 0;
    const payload: SingleTask = {
      id: Date.now(),
      name,
      position,
      is_completed: false,
      start_on: null,
      due_on: null,
      task_list_id: id,
      comments_count: 0,
      open_subtasks: 0,
      is_important: false,
      assignee: [],
      labels: [],
      completed_on: null,
    };

    dispatch(addTaskAction(payload));
  };

  return (
    <>
      <Droppable droppableId={`${id}`} direction="vertical">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-[350px] py-3 px-1"
          >
            <div className="flex justify-between items-center m-2 mb-5">
              <h4 className="font-bold flex items-center gap-2 px-4">
                <span className="text-gray-700 text-lg ">{taskList?.name}</span>{" "}
                <span className="text-gray-400 text-md">({tasks.length})</span>
              </h4>

              <IconButton
                onClick={handleMenuOpen}
                aria-controls={menuOpen ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
              >
                <img src={dots} alt="dots" className="cursor-pointer" />
              </IconButton>
              <Menu
                open={menuOpen}
                onClose={handleMenuClose}
                sx={{
                  borderRadius: 8,
                }}
                anchorEl={dropdown}
              >
                <MenuItem onClick={completeTaskList}>Complete</MenuItem>
                <MenuItem onClick={deleteTaskList}>Move to Trash</MenuItem>
              </Menu>
            </div>
            <div className="max-h-[80vh]  scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full px-2">
              {tasks.map((singleTask, index) => {
                return (
                  <Task key={singleTask.id} id={singleTask.id} index={index} />
                );
              })}
              {provided.placeholder}
            </div>

            <button
              className="px-6 text-violet-700 font-bold mt-2 outline-none"
              onClick={() => setModal(true)}
            >
              + Add task
            </button>
          </div>
        )}
      </Droppable>
      <Prompt
        title="Add new task"
        isOpen={modal}
        closeFn={() => setModal(false)}
        submitFn={onAddTask}
      />
    </>
  );
};

export default TaskList;
