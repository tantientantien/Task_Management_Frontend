import React from "react";
import { Clock, Trash, ChatLines, Attachment } from "iconoir-react";
import { Task} from "@/src/types/tasks";
import { useUserStore } from "@/src/hooks/use-user-store";
import { Badge } from "@/src/components/ui/badge";
import tinycolor from "tinycolor2";
import TaskDetail from "./task-detail";


interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <div className="w-auto bg-white px-5 py-3 font-bold rounded-xl">
        <span className="text-[0.8rem] font-semibold bg-gray-200 px-4 py-1 rounded-md inline-block">
          {task.category.name}
        </span>

          <TaskDetail  taskName={task.title} taskId={task.id}/>
        <div
          onPointerDown={(e) => e.preventDefault()}
          className="mt-2 flex flex-wrap gap-x-5"
        >
          <button className="flex items-center gap-0.5 hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <Clock color="black" width={15} />
            <p className="text-black text-xs font-light">
              {new Date(task.duedate).toLocaleDateString("vi-VN")}
            </p>
          </button>
          <button
            className="flex items-center gap-0.5 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={() => {}}
          >
            <Trash color="black" width={15} />
            <span className="text-black text-xs font-light">Delete</span>
          </button>
          <button className="flex items-center gap-0.5 hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <ChatLines color="black" width={15} />
            <span className="text-black text-xs font-light">
              {task.commentCount}
            </span>
          </button>
          <button className="flex items-center gap-0.5 hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <Attachment color="black" width={15} />
            <span className="text-black text-xs font-light">
              {task.attachmentCount}
            </span>
          </button>
        </div>
        <div
          className="font-light text-gray-600 mt-2 flex flex-wrap z-[-100]"
          onPointerDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-wrap gap-2">
            {task.labels.length > 0 ? (
              <>
                <Badge
                  key={task.labels[0].id}
                  className="font-bold rounded-full py-1 relative transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    backgroundColor: task.labels[0].color,
                    color: tinycolor(task.labels[0].color)
                      .darken(59)
                      .toHexString(),
                  }}
                >
                  {task.labels[0].name}
                </Badge>

                {task.labels.length > 1 && (
                  <Badge className="text-gray-500 rounded-full bg-transparent">
                    +{task.labels.length - 1}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-gray-500 text-sm">No labels</span>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-end justify-end">
          {task.assigneeId === user?.id ? (
            <p className="bg-violet-100 text-violet-500 text-xs py-1 px-2 font-bold rounded">
              Your Task
            </p>
          ) : (
            <p className="bg-gray-100 text-gray-500 text-xs py-1 px-2 font-bold rounded">
              Others
            </p>
          )}
        </div>
      </div>
      {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {selectedTaskId && <TaskDetail taskId={selectedTaskId} />}
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default TaskCard;
