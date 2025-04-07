import React, { useState } from "react";
import Image from "next/image";
import RichTextEditor from "../ui/richtext-editor";
import { MenuScale } from "iconoir-react";
import { TaskComment } from "@/src/types/tasks";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { deleteComment, editComment } from "@/src/apis/funcs/tasks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/src/apis/handler/get-query-client";

interface CommentProps {
  comments: TaskComment[];
  userId: string;
  taskId: number;
  handleCommentSubmit: (content: string) => void;
}

const CommentSection: React.FC<CommentProps> = ({
  comments,
  userId,
  taskId,
  handleCommentSubmit,
}) => {
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const queryClient = getQueryClient();

  const handleSubmit = () => {
    if (commentContent.trim()) {
      handleCommentSubmit(commentContent);
      setCommentContent("");
    }
  };

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      toast("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast("Error deleting comment");
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      editComment(commentId, content),
    onSuccess: () => {
      toast("Comment edited successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      setEditingCommentId(null);
    },
    onError: () => {
      toast("Error editing comment");
    },
  });

  const handleEditClick = (comment: TaskComment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditSubmit = (commentId: number) => {
    if (editContent.trim()) {
      editCommentMutation.mutate({ commentId, content: editContent });
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-10">
      <p className="text-[1rem] font-medium text-black">Comment</p>
      <RichTextEditor
        content={commentContent}
        onChange={setCommentContent}
        onSubmit={handleSubmit}
      />
      {comments.map((cm) => (
        <div
          key={cm.id}
          className="flex items-start gap-3 p-5 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-violet-300 hover:bg-gradient-to-br hover:from-violet-50 hover:to-white animate-fade-in"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-violet-200 transition-all duration-300 hover:border-violet-400">
            <Image
              src={cm.user.avatar || "https://via.placeholder.com/40"}
              alt="User avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/40")
              }
            />
          </div>

          {/* Comment Content */}
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-900">
                  {cm.user.userName || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(cm.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {cm.user.id === userId ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MenuScale width={15} height={15} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                    <DropdownMenuItem
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-md transition-colors cursor-pointer"
                      onClick={() => handleEditClick(cm)}
                    >
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors cursor-pointer"
                      onClick={() => deleteCommentMutation.mutate(cm.id)}
                    >
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
            
            {editingCommentId === cm.id ? (
              <div className="mt-2">
                <RichTextEditor
                  content={editContent}
                  onChange={setEditContent}
                  onSubmit={() => handleEditSubmit(cm.id)}
                  onExitEditMode={() => setEditingCommentId(null)}
                />
              </div>
            ) : (
              <div
                className="text-sm text-gray-700 mt-2 leading-relaxed border-t border-gray-100 pt-2"
                dangerouslySetInnerHTML={{
                  __html: cm.content,
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
