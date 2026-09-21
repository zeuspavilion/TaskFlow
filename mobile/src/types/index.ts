export type PriorityLevel = 'low' | 'medium' | 'high';

export type TaskStatus = 'all' | 'pending' | 'completed';

export type SortOption = 'smart' | 'deadline' | 'priority' | 'createdAt' | 'dateTime';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  user: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: PriorityLevel;
  category: string;
  isCompleted: boolean;
  completedAt?: string;
  urgencyScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  dateTime: string;
  deadline: string;
  priority: PriorityLevel;
  category: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
  categories?: { _id: string; count: number }[];
}

export interface TaskFilterState {
  status: TaskStatus;
  priority?: PriorityLevel | 'all';
  category?: string;
  search: string;
  sortBy: SortOption;
}

// Navigation parameter types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AddEditTask: { task?: Task };
  TaskDetails: { taskId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Analytics: undefined;
  Profile: undefined;
};
