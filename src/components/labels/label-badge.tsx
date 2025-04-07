// import React from "react";
// // import { Label } from "../../structures/model";
// // import { deleteTaskLabel } from "../../services/api";
// import { useQueryClient, useMutation } from "@tanstack/react-query";
// // import { toast } from "react-toastify";
// import { Xmark } from "iconoir-react";

// interface LabelBadgeProps {
//   label: Label;
//   taskId: number;
// }

// const LabelBadge: React.FC<LabelBadgeProps> = ({ label, taskId }) => {
//   const queryClient = useQueryClient();

//   const deleteLabelMutation = useMutation({
//     mutationFn: ({ taskId, labelId }: { taskId: number; labelId: number }) =>
//       deleteTaskLabel(taskId, labelId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["taskLabels"] });
//       queryClient.invalidateQueries({ queryKey: ["tasks"] });
//       queryClient.invalidateQueries({ queryKey: ["labels"] });
//     },
//     onError: (error: Error) => {
//       console.error("Failed to delete label:", error);
//       toast.error(error.message || "Failed to delete label");
//     },
//   });

//   const handleDeleteLabel = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     deleteLabelMutation.mutate({ taskId: taskId, labelId: label.id });
//   };
//   return (
//     <span
//       className="inline-flex items-center text-black py-1 text-[0.7rem] rounded-full px-4 mr-1 font-bold group relative transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
//       style={{ backgroundColor: label.color }}
//     >
//       <span className="pr-2">{label.name}</span>

//       <button
//         onClick={handleDeleteLabel}
//         disabled={deleteLabelMutation.isPending}
//         className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-0.5 hover:bg-red-100"
//         aria-label={`Delete label ${label.name}`}
//       >
//         <Xmark
//           className={`w-3 h-3 text-gray-500 hover:text-red-500 transition-colors duration-200 ${
//             deleteLabelMutation.isPending ? "opacity-50" : ""
//           }`}
//         />
//       </button>
//     </span>
//   );
// };

// export default LabelBadge;
