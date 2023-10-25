import { Droppable } from "react-beautiful-dnd";
import Task from "../components/Task";
import { useSelector } from "react-redux";
import { getCompletedTasks } from "../store/selectors";

export default function CompletedTaskList() {
  const completedTasks = useSelector(getCompletedTasks);

  return (
    <Droppable droppableId="completed-list">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="w-[350px] py-3 px-1"
        >
          <div className="flex justify-between items-center m-2 mb-5">
            <h4 className="font-bold flex items-center gap-2 px-4">
              <span className="text-gray-700 text-lg ">Completed Tasks</span>{" "}
              <span className="text-gray-400 text-md">
                ({completedTasks.length})
              </span>
            </h4>
          </div>
          <div className="max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full px-2">
            {completedTasks.map((task, index) => {
              return <Task key={index} id={task.id} index={index} />;
            })}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
