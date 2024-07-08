import { useState } from "react"
import TrashIcon from "./TrashIcon"
import { Task,Id } from "./Types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
interface Props{
    task:Task
    deleteTask:(id:Id)=>void
    updateTask:(id:Id, content:string)=>void
}
function TaskCard({task,deleteTask,updateTask}:Props) {
    const [mouseIsover, setMouseIsOver]=useState(false);
    const [editMode , setEditMode]=useState(false)
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
      } = useSortable({
        id: task.id,
        data: {
          type: "task",
          task,
        },
        disabled: editMode,
      });
      const style = {
        transition,
        transform: CSS.Transform.toString(transform),
      };
    const toggleEditMode=()=>{
        setEditMode((prev)=>!prev);
        setMouseIsOver(false)
    }
    if(isDragging){
        return <div ref={setNodeRef} style={style} className="bg-mainBackgroundColor p-2.5 items-center
            h-[100px] min-h-[100px] rounded-xl text-left relative  hover:ring-rose-500 cursor-grab border-2 border-rose-500 opacity-30"/>
    }
    if(editMode){
        return (
            <div ref={setNodeRef} style={style}{...attributes}{...listeners} className="bg-mainBackgroundColor p-2.5 items-center
            h-[100px] min-h-[100px] rounded-xl text-left relative hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab">
           <textarea className="h-[90%] w-full resize-none border-none bg-transparent text-white focus:outline-none" value={task.content} autoFocus placeholder="TASKS hERE" onBlur={toggleEditMode} onKeyDown={(e)=>{
            if(e.key === "Enter"&& e.shiftKey)toggleEditMode()
           }} onChange={(e)=>updateTask(task.id , e.target.value)}></textarea>
            </div>
        )
    }
  return (
    <div ref={setNodeRef} style={style}{...attributes}{...listeners} onClick={toggleEditMode} className="bg-mainBackgroundColor p-2.5 items-center
    h-[100px] min-h-[100px] rounded-xl text-left relative hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
    onMouseEnter={()=>{
        setMouseIsOver(true)
    }}
    onMouseLeave={()=>{
        setMouseIsOver(false)
    }}>
     <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"> {task.content}</p>
     {mouseIsover && (<button onClick={()=>{
        deleteTask(task.id)
     }} className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-mainBackgroundColor opacity-60 hover:opacity-100 p-2 rounded">
        <TrashIcon/>
      </button>)}
    </div>
  )
}

export default TaskCard
