"use client";

import { Task } from "@/src/types/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTasks, updateTask } from "../../apis/funcs/tasks";
import TaskCard from "./task-card";
import { animations } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getQueryClient } from "@/src/apis/handler/get-query-client";
import { toast } from "sonner";

const TaskList: React.FC = () => {
  const queryClient = getQueryClient();
  const { data } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const initialTodoItems = data?.filter((task) => !task.isCompleted) || [];
  const initialDoneItems = data?.filter((task) => task.isCompleted) || [];

  const [draggedItem, setDraggedItem] = useState<Task | null>(null);

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) =>
      updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast("Success", {
        description: "Updated task successfully",
      });
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
      toast("Failed", {
        description: "Failed to update task, please try again",
      });
    },
  });

  const [todoList, todos, setTodos] = useDragAndDrop<HTMLUListElement, Task>(
    initialTodoItems,
    {
      group: "taskList",
      onDragstart: (item) => {
        const dragged = item.values[item.position] as Task;
        setDraggedItem(dragged);
        console.log(`Dragging: ${dragged.title}`);
      },
      onDragend: () => {
        if (draggedItem && dones.includes(draggedItem)) {
          updateTaskMutation.mutate({
            id: draggedItem.id.toString(),
            payload: { isCompleted: true },
          });
        }
        setDraggedItem(null);
      },
      plugins: [animations()],
    }
  );

  const [doneList, dones, setDones] = useDragAndDrop<HTMLUListElement, Task>(
    initialDoneItems,
    {
      group: "taskList",
      onDragstart: (item) => {
        const dragged = item.values[item.position] as Task;
        setDraggedItem(dragged);
        console.log(`Dragging: ${dragged.title}`);
      },
      onDragend: () => {
        if (draggedItem && todos.includes(draggedItem)) {
          updateTaskMutation.mutate({
            id: draggedItem.id.toString(),
            payload: { isCompleted: false },
          });
        }
        setDraggedItem(null);
      },
      plugins: [animations()],
    }
  );

  useEffect(() => {
    if (data) {
      const newTodoItems = data.filter((task) => !task.isCompleted);
      const newDoneItems = data.filter((task) => task.isCompleted);
      setTodos(newTodoItems);
      setDones(newDoneItems);
    }
  }, [data, setTodos, setDones]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-row justify-evenly gap-4"
    >
      <div className="w-1/2 bg-gray-200 p-4 rounded-lg">
        <div className="flex flex-row justify-between items-center text-[0.8rem] font-bold text-gray-500 my-5">
          <p>
            In Progress
            {""}
            <span className="bg-gray-300 ml-1 px-1 py-0.5 rounded text-xs">
              {todos.length <= 9 && 0 < todos.length
                ? "0" + todos.length
                : todos.length}
            </span>
          </p>
          {/* {isInProgress ? renderAddButton() : renderPlaceholderButton()} */}
        </div>
        <ul ref={todoList} className="flex flex-wrap justify-between">
          {todos.length > 0 ? (
            todos.map((task) => (
              <div className="w-1/2 p-2" key={task.id}>
                <TaskCard task={task} />
              </div>
            ))
          ) : (
            <div className="text-center w-full p-20 rounded-xl border-2 border-gray-500 border-dashed">
              <span className="text-gray-500 text-sm">
                Drag and drop tasks to be{" "}
                <p className="text-violet-500 font-bold inline-block">redone</p>{" "}
                here or{" "}
                <p className="text-violet-500 font-bold inline-block">create</p>{" "}
                a new task
              </span>
            </div>
          )}
        </ul>
      </div>
      <div className="w-1/2 bg-gray-200 p-4 rounded-lg">
        <div className="flex flex-row justify-between items-center text-[0.8rem] font-bold text-gray-500 my-5">
          <p>
            Done
            {""}
            <span className="bg-gray-300 ml-1 px-1 py-0.5 rounded text-xs">
              {dones.length <= 9 && 0 < dones.length
                ? "0" + dones.length
                : dones.length}
            </span>
          </p>
          {/* {isInProgress ? renderAddButton() : renderPlaceholderButton()} */}
        </div>
        <ul ref={doneList} className="flex flex-wrap justify-between">
          {dones.length > 0 ? (
            dones.map((task) => (
              <div className="w-1/2 p-2" key={task.id}>
                <TaskCard task={task} />
              </div>
            ))
          ) : (
            <div className="text-center w-full p-30 rounded-xl border-2 border-gray-500 border-dashed">
              <span className="text-gray-500 text-sm">
                Drag and drop{" "}
                <p className="text-violet-500 font-bold inline-block">
                  completed
                </p>{" "}
                tasks here
              </span>
            </div>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

export default TaskList;
