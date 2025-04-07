import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAttachment,
  downloadAttachment,
  fetchAttachment,
  uploadAttachment,
} from "@/src/apis/funcs/attachments";
import { Download, Xmark } from "iconoir-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Attachment } from "@/src/types/tasks";

interface AttachmentsProps {
  taskId: number;
}

const Attachments: React.FC<AttachmentsProps> = ({ taskId }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const { data: attachments = [] } = useQuery({
    queryKey: ["attachments", taskId],
    queryFn: () => fetchAttachment(taskId),
  });

  const downloadMutation = useMutation({
    mutationFn: ({ attachmentId }: { attachmentId: number }) =>
      downloadAttachment(taskId, attachmentId),
    onSuccess: (blob, variables) => {
      const fileName =
        attachments
          ?.find((a) => a.id === variables.attachmentId)
          ?.fileName.split("_")[1] || "downloaded_file";
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    },
    onError: (error) => {
      console.error("Download error:", error);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadAttachment(taskId, file),
    onMutate: () => {
      setUploading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    },
    onSuccess: () => {
      toast.success("Uploaded file successfully");
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload file");
    },
    onSettled: () => {
      setUploading(false);
      setProgress(0);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (attachmentId: number) =>
      deleteAttachment(taskId, attachmentId),
    onSuccess: (_, deletedId) => {
      toast.success("Deleted attachment successfully");
  
      queryClient.setQueryData<Attachment[]>(["attachments", taskId], (old) => {
        if (!old) return [];
        return old.filter((a) => a.id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete attachment");
    },
    onSettled: () => {
      setUploading(false);
      setProgress(0);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        uploadMutation.mutate(file);
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => {
        uploadMutation.mutate(file);
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="mb-4 text-gray-700 text-sm">
      <p className="text-[1rem] font-medium text-black mb-2">Attachment</p>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="py-10 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 hover:border-violet-400 hover:bg-violet-50 transition-colors cursor-pointer"
      >
        <p className="text-sm">Click or drag file to this area to upload</p>
        <p className="text-xs text-gray-400 mt-1">
          Only image/pdf/doc allowed (demo)
        </p>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-400 mt-1">{progress}%</p>
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2 mt-4">
          {attachments.map((attachment) => {
            const fileNameParts = attachment.fileName.split("_");
            const displayFileName =
              fileNameParts.length > 1 ? fileNameParts[1] : attachment.fileName;

            return (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 flex items-center justify-center bg-violet-100 text-violet-600 rounded-full">
                    📎
                  </div>
                  <span className="text-gray-800 truncate max-w-xs text-sm font-medium">
                    <a
                      href={`${attachment.fileUrl}${process.env.NEXT_PUBLIC_BLOB_KEY}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-violet-600 transition-colors"
                    >
                      {displayFileName}
                    </a>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      downloadMutation.mutate({ attachmentId: attachment.id })
                    }
                    disabled={downloadMutation.isPending}
                    className="p-2 rounded-full bg-violet-100 hover:bg-violet-50 transition-colors disabled:opacity-50"
                  >
                    {downloadMutation.isPending ? (
                      <span className="text-xs text-gray-500">........</span>
                    ) : (
                      <Download className="w-5 h-5 text-violet-500" />
                    )}
                  </button>

                  <button
                    onClick={() => deleteMutation.mutate(attachment.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Xmark className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Attachments;
