import { Attachment } from "@/src/types/tasks";

export const fetchAttachment = async (
  taskId: number
): Promise<Attachment[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/attachments/${taskId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    let errorMessage = "Failed to fetch attachments";
    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const result = await res.json();
  return result.data;
};

export const downloadAttachment = async (
  taskId: number,
  attachmentId: number
): Promise<Blob> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/attachments/${taskId}/${attachmentId}/download`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Download failed");
  return response.blob();
};

export const uploadAttachment = async (
  taskId: number,
  file: File
): Promise<{
  id: number;
  fileName: string;
  fileUrl: string;
  taskId: number;
  uploadedAt: string;
}> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/attachments/${taskId}`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    let errorMessage = "Failed to upload attachment";
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result.data;
};


export const deleteAttachment = async (taskId: number, attachmentId: number): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/attachments/${taskId}/${attachmentId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    let errorMessage = "Failed to delete attachment";
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {
    }
    throw new Error(errorMessage);
  }
};
