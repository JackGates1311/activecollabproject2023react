import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskList from "./TaskList";
import { useDispatch, useSelector } from "react-redux";
import { getTaskListsSorted, getTasksByTaskListsIds } from "../store/selectors";
import { useCallback, useState } from "react";
import Prompt from "./Prompt";
import { SingleTaskList } from "../types";
import { addTaskListAction } from "../store/taskListReducer";
import {
  completeTaskAction,
  reopenTaskAction,
  updateTaskPositionAction,
} from "../store/taskReducer";
import CompletedTaskList from "./CompletedTaskList";

export const TaskLists = () => {
  const dispatch = useDispatch();
  const taskLists = useSelector(getTaskListsSorted);
  const tasksByTaskList = useSelector(getTasksByTaskListsIds);
  const [modal, setModal] = useState(false);

  const calculatePositions = useCallback(
    (
      sourcePos: number,
      destinationPos: number,
      sourceListId: number | string,
      destinationListId: number | string,
    ) => {
      if (sourceListId === destinationListId) {
        const sourcePositions = tasksByTaskList[sourceListId];
        const result = Array.from(sourcePositions);
        const [removed] = result.splice(sourcePos, 1);
        result.splice(destinationPos, 0, removed);
        return {
          [sourceListId]: result,
        };
      } else {
        const sourcePositions = tasksByTaskList[sourceListId] || [];
        const destinationPosition = tasksByTaskList[destinationListId] || [];
        const resultSource = Array.from(sourcePositions);
        const resultDestination = Array.from(destinationPosition);
        const [removed] = resultSource.splice(sourcePos, 1);
        resultDestination.splice(destinationPos, 0, removed);
        return {
          [sourceListId]: resultSource,
          [destinationListId]: resultDestination,
        };
      }
    },
    [tasksByTaskList],
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      // console.log("debug", result);
      if (!result.destination) return;

      const { source, destination, draggableId } = result;

      if (
        source.droppableId === "completed-list" &&
        destination?.droppableId === "completed-list"
      ) {
        return;
      }

      if (destination?.droppableId === "completed-list") {
        dispatch(completeTaskAction(Number(draggableId)));
        return;
      }

      if (source.droppableId === "completed-list") {
        dispatch(
          reopenTaskAction({
            id: Number(draggableId),
            task_list_id: Number(destination?.droppableId),
          }),
        );
      }

      const pos = calculatePositions(
        source.index,
        destination?.index,
        source.droppableId,
        destination?.droppableId,
      );

      if (pos) {
        const { "completed-list": completed, ...payload } = pos;
        dispatch(updateTaskPositionAction(payload));
      }
    },
    [calculatePositions, dispatch],
  );

  const handleAddNewList = (name: string) => {
    const lastPosition = taskLists[taskLists.length - 1]?.position || 0;
    const list: SingleTaskList = {
      id: Date.now(),
      name,
      position: lastPosition + 1,
      is_completed: false,
      is_trashed: false,
      open_tasks: 0,
      completed_tasks: 0,
    };
    dispatch(addTaskListAction(list));
  };
  return (
    <div className="flex gap-3">
      <DragDropContext onDragEnd={handleDragEnd}>
        {taskLists.map((taskList, index) => {
          return <TaskList key={index} id={taskList.id} />;
        })}
        <div
          onClick={() => setModal(true)}
          className="px-4 py-2 pt-1 text-3xl shadow-lg bg-slate-100 h-fit rounded-md flex justify-center items-center border-slate-200 text-slate-400 border-[1px] cursor-pointer"
        >
          <span>+</span>
        </div>
        <CompletedTaskList />
      </DragDropContext>
      <Prompt
        title="Add new task list"
        isOpen={modal}
        closeFn={() => setModal(false)}
        submitFn={handleAddNewList}
      />
    </div>
  );
};
