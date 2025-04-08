import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { useMutation, useQuery } from "@tanstack/react-query";
import { TaskComment, TaskDetailData, UpdateTask } from "@/src/types/tasks";
import {
  addComment,
  fetchTaskComment,
  fetchTaskDetail,
  updateTask,
} from "@/src/apis/funcs/tasks";
import { useUserStore } from "@/src/hooks/use-user-store";
import { NavArrowDown} from "iconoir-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Categories } from "@/src/types/categories";
import { fetchCategories } from "@/src/apis/funcs/categories";
import React, { useState, useEffect } from "react";
import {} from "@/src/apis/funcs/attachments";
import Attachments from "./attachments";
import Description from "./description";
import CommentSection from "./comment";
import { toast } from "sonner";
import { getQueryClient } from "@/src/apis/handler/get-query-client";
import Labels from "./task-label";

interface TaskDetailProps {
  taskName: string;
  taskId: number;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskName, taskId }) => {
  const user = useUserStore();
  const queryClient = getQueryClient();
  const { data: tasks } = useQuery<TaskDetailData>({
    queryKey: ["tasks", taskId],
    queryFn: () => fetchTaskDetail(taskId),
  });

  const { data: comment } = useQuery<TaskComment[]>({
    queryKey: ["comments", taskId],
    queryFn: () => fetchTaskComment(taskId),
  });

  const { data: categories } = useQuery<Categories[]>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (tasks?.description) {
      setDescription(tasks.description);
    }
  }, [tasks]);

  useEffect(() => {
    if (tasks?.title) {
      setTitle(tasks.title);
    }
  }, [tasks]);

  const updateTaskMutation = useMutation({
    mutationFn: ({
      field,
      value,
    }: {
      field: keyof UpdateTask;
      value: string | number;
    }) => {
      if (!tasks?.id) {
        throw new Error("Task ID is undefined");
      }
      return updateTask(tasks.id.toString(), { [field]: value });
    },
    onSuccess: () => {
      toast("Updated task successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast("Error updating task");
    },
  });

  const handleTitleSubmit = () => {
    if (!tasks?.id) {
      console.error("Task ID is undefined");
      return;
    }

    updateTaskMutation.mutate({ field: "title", value: title });
  };

  const handleDescriptionSubmit = () => {
    if (!tasks?.id) {
      console.error("Task ID is undefined");
      return;
    }

    updateTaskMutation.mutate({ field: "description", value: description });
  };

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => {
      if (!tasks?.id) {
        throw new Error("Task ID is undefined");
      }
      return addComment(tasks.id, content);
    },
    onSuccess: () => {
      toast("Comment added successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
    },
    onError: () => {
      toast("Error adding comment");
    },
  });

  const handleCommentSubmit = (content: string) => {
    if (!tasks?.id) {
      console.error("Task ID is undefined");
      return;
    }

    console.log("Submitting comment:", content);

    addCommentMutation.mutate(content);
  };

  const handleCategoryChange = (categoryId: number) => {
    updateTaskMutation.mutate({ field: "categoryId", value: categoryId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-transparent shadow-none text-black block mt-2 font-semibold text-[1rem] p-0 hover:text-violet-500 hover:bg-transparent hover:font-bold">
          {taskName}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] max-h-[85vh] overflow-y-hidden">
        <DialogHeader>
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  if (title !== tasks?.title) {
                    handleTitleSubmit();
                  }
                  setIsEditingTitle(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTitleSubmit();
                  } else if (e.key === "Escape") {
                    setTitle(tasks?.title || "");
                    setIsEditingTitle(false);
                  }
                }}
                className="w-full px-3 py-2 text-2xl font-semibold bg-violet-50 border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
                autoFocus
              />
            </div>
          ) : (
            <DialogTitle
              className="mb-5 text-2xl cursor-pointer hover:text-violet-600 transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {tasks?.title}
            </DialogTitle>
          )}
        </DialogHeader>

        <section className="flex flex-row justify-between gap-20">
          <div className="flex-1/3 max-h-[calc(85vh-120px)] overflow-y-auto">
            {/* Attachment */}
            <Attachments taskId={taskId} />

            {/* Task Description */}
            <Description
              description={tasks?.description}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setDescription={setDescription}
              handleDescriptionSubmit={handleDescriptionSubmit}
            />

            {/* Comment */}
            <CommentSection
              comments={comment || []}
              userId={user.user?.id || ""}
              taskId={tasks?.id || 0}
              handleCommentSubmit={handleCommentSubmit}
            />
          </div>

          <div className="w-1/3">
            <div className="p-5 bg-gray-50 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Details
              </h2>

              {/* Body */}
              <div className="flex flex-col gap-y-7 text-sm">
                {/* Creator */}
                <div className="flex items-center">
                  <h3 className="w-1/3 text-gray-600 font-semibold">Creator</h3>
                  <div className="flex items-center text-gray-500">
                    <Avatar className="mr-2 border-2 border-gray-200 rounded-full transition-all duration-300 hover:border-violet-300">
                      <AvatarImage
                        src={tasks?.user.avatar}
                        className="w-7 h-7 rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{tasks?.user.userName || "Unknown"}</span>
                  </div>
                </div>

                {/* Assignee */}
                <div className="flex items-center">
                  <h3 className="w-1/3 text-gray-600 font-semibold">
                    Assignee
                  </h3>
                  <div className="flex items-center text-gray-500">
                    <Avatar className="mr-2 border-2 border-gray-200 rounded-full transition-all duration-300 hover:border-violet-300">
                      <AvatarImage
                        src={tasks?.assignee.avatar}
                        className="w-7 h-7 rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{tasks?.assignee.userName || "Unassigned"}</span>
                  </div>
                </div>

                {/* Labels */}
                <Labels taskId={taskId} taskLabels={tasks?.labels || []} />

                {/* Category */}
                <div className="flex items-center">
                  <h3 className="w-1/3 text-gray-600 font-semibold">
                    Category
                  </h3>
                  <div className="text-gray-500">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="flex justify-between items-center border rounded-md border-gray-300 w-36 py-1.5 px-3 text-sm transition-all duration-300 hover:border-violet-300 hover:bg-violet-50"
                        disabled={updateTaskMutation.isPending}
                      >
                        {tasks?.category.name || "Select Category"}
                        <NavArrowDown className="w-4 h-4 ml-2" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {categories?.map((category) => (
                          <DropdownMenuItem
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                            className={`cursor-pointer ${
                              tasks?.category.id === category.id
                                ? "bg-violet-50 text-violet-700"
                                : ""
                            }`}
                          >
                            {category.name}
                            {tasks?.category.id === category.id && (
                              <span className="ml-2">✓</span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-center">
                  <h3 className="w-1/3 text-gray-600 font-semibold">
                    Created At
                  </h3>
                  <span className="text-gray-500">
                    {tasks?.createdAt
                      ? new Date(tasks.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </span>
                </div>

                {/* Due Date */}
                <div className="flex items-center">
                  <h3 className="w-1/3 text-gray-600 font-semibold">
                    Due Date
                  </h3>
                  <span className="text-gray-500">
                    {tasks?.duedate
                      ? new Date(tasks.duedate).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </span>
                </div>

                {/* Attachments */}
                <div className="flex items-center">
                  <h3 className="w-1/3 text-gray-600 font-semibold">
                    Attachments
                  </h3>
                  <span className="text-gray-500">
                    {tasks?.attachmentCount || 0}
                  </span>
                </div>

                {/* Comments */}
                <div className="flex items-center">
                  <h3 className="w-1/3 text-gray-600 font-semibold">
                    Comments
                  </h3>
                  <span className="text-gray-500">
                    {tasks?.commentCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetail;
