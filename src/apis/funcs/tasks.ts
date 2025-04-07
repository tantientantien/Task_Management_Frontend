import { Task, TaskComment, TaskDetailData, UpdateTask } from "@/src/types/tasks";


export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch tasks");

  const result = await res.json();
  return result.data;
};


export const fetchTaskDetail = async (id: number): Promise<TaskDetailData> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/tasks/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch task details");

  const result = await res.json();
  return result.data;
};


export const fetchTaskComment = async (id: number): Promise<TaskComment[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/comments/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    let errorMessage = "Failed to fetch task comments";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {
    }
    throw new Error(errorMessage);
  }

  const result = await res.json();
  return result.data;
};




export const updateTask = async (
  id: string,
  payload: Partial<UpdateTask>
): Promise<Partial<UpdateTask>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (res.status === 204) {
    return payload;
  }

  if (!res.ok) {
    let errorMessage = "Failed to update task";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {
    }
    throw new Error(errorMessage);
  }
  const result = await res.json();
  return result.data ?? payload;
};



export const addComment = async (
  taskId: number,
  content: string
): Promise<void> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/comments/${taskId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ "content": content }),
  });

  if (res.status === 204) {
    return;
  }

  if (!res.ok) {
    let errorMessage = "Failed to add comment";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {
    }
    throw new Error(errorMessage);
  }
};


export const deleteComment = async (commentId: number): Promise<void> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (res.status === 204) {
    return;
  }

  if (!res.ok) {
    let errorMessage = "Failed to delete comment";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {
    }
    throw new Error(errorMessage);
  }
};


export const editComment = async (
  commentId: number,
  content: string
): Promise<void> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({"content": content}),
  });

  if (res.status === 204) {
    return;
  }

  if (!res.ok) {
    let errorMessage = "Failed to edit comment";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {

    }
    throw new Error(errorMessage);
  }
};