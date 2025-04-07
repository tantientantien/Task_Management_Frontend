export interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  assigneeId: string;
  attachmentCount: number;
  commentCount: number;
  createdAt: string;
  category: {
    name: string;
    description: string;
  };
  duedate: string;
  labels: [
    {
      id: number,
      name: string,
      color: string
    }
  ]
}

export interface TaskDetailData {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  user: {
    id: string;
    email: string;
    userName: string;
    avatar: string;
  };
  assignee: {
    id: string;
    email: string;
    userName: string;
    avatar: string;
  };
  attachmentCount: number;
  commentCount: number;
  createdAt: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
  duedate: string;
  labels: {
    id: number;
    name: string;
    color: string;
  }[];
}

export interface TaskComment {
  id: number;
  user: {
    id: string;
    email: string;
    userName: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

export interface UpdateTask{
  id: number;
  title?: string;
  description?: string;
  isCompleted?: boolean;
  assigneeId?: string;
  duedate?: string;
  categoryId?: number;
}


export interface Attachment{
  id: number,
  fileName: string,
  fileUrl: string,
  taskId: number,
  uploadedAt: string
}