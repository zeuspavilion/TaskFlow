import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../api/client';
import { Task, TaskInput, TaskStats, TaskFilterState } from '../types';
import { sortTasks } from '../utils/sorting';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats | null;
  isLoading: boolean;
  isRefreshing: boolean;
  filter: TaskFilterState;
  setFilter: React.Dispatch<React.SetStateAction<TaskFilterState>>;
  fetchTasks: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createTask: (input: TaskInput) => Promise<{ success: boolean; message?: string }>;
  updateTask: (id: string, input: Partial<TaskInput> & { isCompleted?: boolean }) => Promise<{ success: boolean; message?: string }>;
  toggleTaskCompletion: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<{ success: boolean; message?: string }>;
  filteredTasks: Task[];
  categories: string[];
}

const defaultFilter: TaskFilterState = {
  status: 'all',
  priority: 'all',
  category: 'All',
  search: '',
  sortBy: 'smart',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<TaskFilterState>(defaultFilter);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiClient.get('/tasks', {
        params: {
          sortBy: filter.sortBy,
        },
      });
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (e: any) {
      console.warn('Error fetching tasks:', e.message);
    }
  }, [token, filter.sortBy]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiClient.get('/tasks/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (e: any) {
      console.warn('Error fetching stats:', e.message);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      Promise.all([fetchTasks(), fetchStats()]).finally(() => setIsLoading(false));
    } else {
      setTasks([]);
      setStats(null);
    }
  }, [token, fetchTasks, fetchStats]);

  const createTask = async (input: TaskInput): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiClient.post('/tasks', input);
      if (res.data.success) {
        setTasks((prev) => [res.data.data, ...prev]);
        fetchStats();
        return { success: true };
      }
      return { success: false, message: 'Failed to create task' };
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || 'Error creating task',
      };
    }
  };

  const updateTask = async (
    id: string,
    input: Partial<TaskInput> & { isCompleted?: boolean }
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiClient.put(`/tasks/${id}`, input);
      if (res.data.success) {
        const updated = res.data.data;
        setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
        fetchStats();
        return { success: true };
      }
      return { success: false, message: 'Failed to update task' };
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || 'Error updating task',
      };
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    const updatedStatus = !task.isCompleted;
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, isCompleted: updatedStatus } : t))
    );

    try {
      await apiClient.put(`/tasks/${task._id}`, { isCompleted: updatedStatus });
      fetchStats();
    } catch (e) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, isCompleted: task.isCompleted } : t))
      );
    }
  };

  const deleteTask = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiClient.delete(`/tasks/${id}`);
      if (res.data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        fetchStats();
        return { success: true };
      }
      return { success: false, message: 'Failed to delete task' };
    } catch (e: any) {
      return {
        success: false,
        message: e.response?.data?.message || e.message || 'Error deleting task',
      };
    }
  };

  // Distinct categories available in tasks
  const categories = useMemo(() => {
    const set = new Set<string>(['All', 'Work', 'Personal', 'Study', 'Health', 'General']);
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  // Client-side filtering & sorting
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Status filter
    if (filter.status === 'completed') {
      result = result.filter((t) => t.isCompleted);
    } else if (filter.status === 'pending') {
      result = result.filter((t) => !t.isCompleted);
    }

    // Priority filter
    if (filter.priority && filter.priority !== 'all') {
      result = result.filter((t) => t.priority === filter.priority);
    }

    // Category filter
    if (filter.category && filter.category !== 'All') {
      result = result.filter(
        (t) => t.category.toLowerCase() === filter.category?.toLowerCase()
      );
    }

    // Search filter
    if (filter.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort result
    return sortTasks(result, filter.sortBy);
  }, [tasks, filter]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        isLoading,
        isRefreshing,
        filter,
        setFilter,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask,
        filteredTasks,
        categories,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
