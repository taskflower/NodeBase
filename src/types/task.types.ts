export interface Task {
  id: number;
  title: string;
  what: string;
  who: string;
  to: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed';
  created: string;
  parent_task?: string;
  result?: {
    output: string;
    timestamp: string;
  };
  review?: {
    reviewer: string;
    content: string;
    timestamp: string;
  };
  warnings?: string;
}

export interface TaskWithSubordinates extends Task {
  subordinates?: {
    id: string;
    role: string;
    permissions: string[];
  }[];
}

export interface TaskCreationData {
  description: string;
  creatorRole: string;
  creatorId: string;
  assigneeId: string;
  assigneeRole: string;
  availablePermissions: string[];
  type: string;
  subordinates: {
    id: string;
    role: string;
    permissions: string[];
  }[];
}

export interface TaskAnalysis {
  title: string;
  description: string;
  assignee_id: string;
  type: string;
  needs_split: boolean;
  subtasks?: {
    title: string;
    description: string;
    type: string;
  }[];
}

export type TaskResult = {
  output: string;
  timestamp: string;
};

export type ReviewResult = {
  reviewer: string;
  content: string;
  timestamp: string;
};

export type FinalReviewResult = {
  result: string;
  timestamp: string;
};