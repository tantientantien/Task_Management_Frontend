import { Label } from "@/src/types/labels";
import { Badge } from "@/src/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Circle, Plus, Xmark } from "iconoir-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLabelToTask, createLabel, deleteLabel, deleteLabelFromTask, fetchLabels } from "@/src/apis/funcs/labels";
import { useState } from "react";
import tinycolor from "tinycolor2";
import { toast } from "sonner";

interface LabelsProps {
  taskId: number;
  taskLabels: Label[];
}

const Labels = ({ taskId, taskLabels }: LabelsProps) => {
  const queryClient = useQueryClient();
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#ffb6c1");

  const { data: labels } = useQuery({
    queryKey: ["labels"],
    queryFn: fetchLabels,
  });

  const createLabelMutation = useMutation({
    mutationFn: createLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      setIsCreatingLabel(false);
      setNewLabelName("");
      setNewLabelColor("#ffb6c1");
      toast.success("Label created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create label");
    },
  });

  const deleteLabelMutation = useMutation({
    mutationFn: deleteLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      toast.success("Label deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete label");
    },
  });

  const addLabelToTaskMutation = useMutation({
    mutationFn: addLabelToTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Label added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add label");
    },
  });

  const deleteLabelFromTaskMutation = useMutation({
    mutationFn: deleteLabelFromTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Label removed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove label");
    },
  });

  return (
    <div className="flex items-center">
      <h3 className="w-1/3 text-gray-600 font-semibold">Labels</h3>
      <div className="flex flex-wrap items-center gap-2">
        {taskLabels?.map((label) => (
          <Badge
            key={label.id}
            className="group relative font-bold rounded-full py-1 px-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              backgroundColor: label.color,
              color: tinycolor(label.color).darken(59).toHexString(),
            }}
          >
            {label.name}
            <button
              onClick={() => {
                deleteLabelFromTaskMutation.mutate({
                  taskId: taskId,
                  labelId: label.id,
                });
              }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-gray-600/50 text-white rounded-full transition-all duration-200"
            >
              <Xmark className="w-5 h-5" />
            </button>
          </Badge>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-2 p-1 rounded-full hover:bg-violet-50 transition-colors">
            <Plus className="w-5 h-5 text-violet-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
            {!isCreatingLabel ? (
              <>
                <DropdownMenuLabel>Add Label</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {labels?.map((label) => (
                  <DropdownMenuItem
                    key={label.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-violet-50 rounded-md cursor-pointer group relative"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (taskLabels?.some((l) => l.id === label.id)) {
                        deleteLabelFromTaskMutation.mutate({
                          taskId: taskId,
                          labelId: label.id,
                        });
                      } else {
                        addLabelToTaskMutation.mutate({
                          taskId: taskId,
                          labelId: label.id,
                        });
                      }
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-sm text-gray-700">{label.name}</span>
                    {taskLabels?.some((l) => l.id === label.id) ? (
                      <span className="ml-auto text-violet-500">✓</span>
                    ) : (
                      <span className="ml-auto opacity-0 group-hover:opacity-100 text-violet-500">
                        Add
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${label.name}"?`)) {
                          deleteLabelMutation.mutate(label.id);
                        }
                      }}
                      className="absolute right-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                    >
                      <Xmark className="w-4 h-4" />
                    </button>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 px-3 py-2 hover:bg-violet-50 rounded-md cursor-pointer text-violet-600"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCreatingLabel(true);
                  }}
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Circle className="w-4 h-4" />
                  <span className="text-sm">Create new label</span>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Create Label</span>
                  <button
                    onClick={() => setIsCreatingLabel(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-3 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 font-medium">Name</label>
                    <input
                      type="text"
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
                      placeholder="Enter label name"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 font-medium">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newLabelColor}
                        onChange={(e) => setNewLabelColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <div
                        className="flex-1 px-3 py-1.5 rounded-md text-sm"
                        style={{
                          backgroundColor: newLabelColor,
                          color: tinycolor(newLabelColor).darken(59).toHexString(),
                        }}
                      >
                        Preview
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full px-3 py-2 bg-violet-500 text-white rounded-md text-sm font-medium hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newLabelName.trim() || createLabelMutation.isPending}
                    onClick={() => {
                      createLabelMutation.mutate({
                        name: newLabelName.trim(),
                        color: newLabelColor,
                      });
                    }}
                  >
                    {createLabelMutation.isPending ? "Creating..." : "Create Label"}
                  </button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Labels;