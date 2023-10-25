import { Draggable } from "react-beautiful-dnd";
import comments from "../assets/comments.svg";
import subtasks from "../assets/subtasks.svg";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers";
import { labels as allLabels, users } from "../store/data";

interface TaskProps {
  id: number;
  index: number;
}

export default function Task({ id, index }: TaskProps) {
  const task = useSelector((state: RootState) => state.task[id]);

  const {
    is_important,
    name,
    labels,
    comments_count,
    open_subtasks,
    start_on,
    due_on,
    assignee,
    is_completed,
  } = task;
  const displayDueOnDate = (date: string | null) => {
    if (!date) return "";
    if (dayjs().year() !== Number(dayjs(date).format("YYYY"))) {
      return dayjs(date).format("MMM D. YYYY");
    } else {
      return dayjs(date).format("MMM D.");
    }
  };

  return (
    <Draggable key={id} draggableId={`${id}`} index={index}>
      {(provided) => (
        <div
          className={`m-1 flex min-h-[100px] bg-slate-100 shadow-lg rounded-md border-[1px] overflow-hidden ${
            is_important
              ? "before:bg-pink-600 before:w-1 before:block"
              : "before:bg-slate-100 before:w-1 before:block"
          } ${is_completed && "before:bg-green-50 bg-green-50"}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          data-id={id}
        >
          <div className="flex-1 p-2">
            <p className={`${is_completed && "line-through"}`}>
              #{id} {name}
            </p>
            <div className="flex gap-2 items-center mt-2">
              {labels.length > 5 ? (
                <div className="flex gap-1 items-center">
                  {[...labels].slice(0, 5).map((id, index) => {
                    return (
                      <div
                        key={index}
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: allLabels[id].color,
                        }}
                      />
                    );
                  })}
                  <span className="text-gray-400 text-sm">
                    +{labels.length - 5}
                  </span>
                </div>
              ) : labels.length > 0 ? (
                <div className="flex gap-1">
                  {labels.map((id) => {
                    return (
                      <div
                        key={id}
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: allLabels[id].color,
                        }}
                      ></div>
                    );
                  })}
                </div>
              ) : (
                <></>
              )}
              {comments_count > 0 && (
                <div className="flex gap-1 items-center">
                  <img src={subtasks} alt="comment_icon" className="w-4" />
                  <span className="text-gray-400 text-sm">
                    {comments_count}
                  </span>
                </div>
              )}
              {open_subtasks > 0 && (
                <div className="flex gap-1 items-center">
                  <img src={comments} alt="subtasks_icon" className="w-4" />
                  <span className="text-gray-400 text-sm">{open_subtasks}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="font-bold text-gray-700">
                <span>
                  {start_on ? `${dayjs(start_on).format("MMMM D.")} - ` : ""}
                </span>
                <span>{displayDueOnDate(due_on)}</span>
              </p>
              <div className="flex -space-x-2">
                {assignee.map((id, index) => {
                  const { avatar_url, name } = users[id];
                  return (
                    <img
                      key={index}
                      src={avatar_url}
                      alt={name}
                      className="w-7 h-7 rounded-full"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
