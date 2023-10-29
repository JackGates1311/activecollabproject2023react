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
import {addNewTaskList, sortTaskList} from "../api/api";

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
    async (result: DropResult) => {
        if (!result.destination) return;

        const {source, destination, draggableId} = result;

        const isDraggedIntoCompletedList = destination?.droppableId === "completed-list";

        if (source.droppableId === "completed-list" && !isDraggedIntoCompletedList) {
            dispatch(
                reopenTaskAction({
                    id: Number(draggableId),
                    task_list_id: Number(destination?.droppableId),
                })
            );
        }

        if (isDraggedIntoCompletedList) {
            dispatch(completeTaskAction(Number(draggableId)));
        }

        const pos = calculatePositions(
            source.index,
            destination?.index,
            source.droppableId,
            destination?.droppableId,
        );

        if (pos) {
            const {"completed-list": completed, ...payload} = pos;

            if (isDraggedIntoCompletedList) {
                payload.isCompletedItem = [Number(draggableId)];
            }

            const response = await sortTaskList(payload);

            if(response.status === 202)
            {
                console.log('input: ' + JSON.stringify(payload) + '\n' + JSON.stringify(response.data));
                dispatch(updateTaskPositionAction(payload));
            } else {
                console.log('input: ' + JSON.stringify(payload) + '\n' + JSON.stringify(response.data));
                console.log(JSON.stringify(response.data));
            }

        }
    },
    [calculatePositions, dispatch],
  );

  const handleAddNewList = async (name: string) => {
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

      const response = await addNewTaskList(list);

      if(response.status === 201) {
          list.id = response.data.taskList.id;
          dispatch(addTaskListAction(list));
      } else {
          console.log(JSON.stringify(response.data.status));
      }
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
        <CompletedTaskList/>
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
