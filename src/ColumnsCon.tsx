import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "./TrashIcon";
import { Colum, Id, Task } from "./Types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "./PlusIcon";
import TaskCard from "./TaskCard";
interface props {
  column: Colum;
  deleteColumns: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (ColumId: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}
function ColumnsCon(props: props) {
  const {
    column,
    deleteColumns,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor opacity-40 border-2 border-red-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-mainBackgroundColor text-md : h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-mainBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-4">
          <div className="flex items-center justify-center bg-mainBackgroundColor px-2 py-1 text-sm rounded-full ">
            0
          </div>
          {/* {column.title} */}
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border-2 rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumns(column.id)}
          className="stroke-gray-500 hover:ring-rose-500 hover:bg-columnBackgroundColor rounded px-2 py-2"
        >
          <TrashIcon />
        </button>
      </div>

      <div className="flex flex-grow flex-col p-2 gap-4 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black justify-center"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
}

export default ColumnsCon;
