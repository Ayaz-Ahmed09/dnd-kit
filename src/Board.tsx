import { useMemo, useState } from "react";
import PlusIcon from "./PlusIcon";
import { Colum, Id, Task } from "./Types";
import ColumnsCon from "./ColumnsCon";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // console.log(tasks,"hell noo")
  const [columns, setColumns] = useState<Colum[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  console.log(columns);
  const [activeColumn, setActiveColumn] = useState<Colum | null>(null);
  const [activeTask , setActiveTask]= useState<Task |   null>(null)
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  });
  return (
    <div className="m-auto flex min-h-screen items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={[sensor]}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        {" "}
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnsCon
                  column={col}
                  key={col.id}
                  deleteColumns={deleteColumns}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  tasks={tasks.filter(task=>task.columnId===col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColum();
            }}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon /> Add Colum
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnsCon
                column={activeColumn}
                deleteColumns={deleteColumns}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(task=>task.columnId===activeColumn.id)}
               
              />
            )}
             {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>} 
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  } 
  function deleteTask(id:Id){
    const newTask=tasks.filter((task)=>task.id !== id)
    setTasks(newTask)
  }
  function createNewColum() {
    const columnstoadd: Colum = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnstoadd]);
  }
  function updateTask(id:Id,content:string){
   const  newTasks= tasks.map((task)=>{
    if(task.id !== id)return task
    return{...task,content}
   })
   setTasks(newTasks)
  }
  function deleteColumns(id: Id) {
    console.log("called", id);

    const filteredColumns = columns.filter((col) => col.id !== id);
    console.log("filteredColumns", filteredColumns);
    setColumns(filteredColumns);
    const newTask=tasks.filter((t)=>t.columnId !== id)
    setTasks(newTask)
  }
  function updateColumn(id: Id, title: string) {
    const newColum = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColum);
  }
  function onDragStart(event: DragStartEvent) {
    console.log("event starting", event);
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) {
      // Task is being dropped in its own column, do nothing
      return;
    }
  
    const task = tasks.find((task) => task.id === active.id);
    if (task) {
      const newTasks = [...tasks];
      const taskIndex = newTasks.findIndex((t) => t.id === task.id);
      if (taskIndex !== -1) {
        newTasks[taskIndex].columnId = overColumnId;
      }
      setTasks(newTasks);
    }
  }
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default Board;
