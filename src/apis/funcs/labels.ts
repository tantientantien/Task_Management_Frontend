import { Label } from "@/src/types/labels";

export const fetchLabels = async (): Promise<Label[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/labels`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    let errorMessage = "Failed to fetch labels";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const result = await res.json();
  return result.data;
};

interface CreateLabelParams {
  name: string;
  color: string;
}

export const createLabel = async (
  params: CreateLabelParams
): Promise<Label> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/labels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: params.name,
      color: params.color,
    }),
  });

  if (!res.ok) {
    let errorMessage = "Failed to create label";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const result = await res.json();
  return result.data;
};

export const deleteLabel = async (labelId: number): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/labels/${labelId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    let errorMessage = "Failed to delete label";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
};

interface AddLabelToTaskParams {
  taskId: number;
  labelId: number;
}

export const addLabelToTask = async (params: AddLabelToTaskParams): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/tasklabels/${params.taskId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        labelId: params.labelId
      })
    }
  );

  if (!res.ok) {
    let errorMessage = "Failed to add label to task";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
};

interface DeleteLabelFromTaskParams {
  taskId: number;
  labelId: number;
}

export const deleteLabelFromTask = async (params: DeleteLabelFromTaskParams): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/tasklabels/${params.taskId}/labels/${params.labelId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    let errorMessage = "Failed to remove label from task";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
};


