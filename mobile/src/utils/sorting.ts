import { Task, SortOption } from '../types';

export const calculateSmartScore = (task: Task): number => {
  if (task.isCompleted) {
    return -10000;
  }

  let score = 0;

  // 1. Priority scoring
  switch (task.priority) {
    case 'high':
      score += 350;
      break;
    case 'medium':
      score += 200;
      break;
    case 'low':
      score += 100;
      break;
  }

  // 2. Deadline Urgency
  const deadlineMs = new Date(task.deadline).getTime();
  const nowMs = Date.now();
  const diffHours = (deadlineMs - nowMs) / (1000 * 60 * 60);

  if (diffHours < 0) {
    // Overdue
    const overdueHours = Math.abs(diffHours);
    score += 500 + Math.min(overdueHours * 5, 200);
  } else if (diffHours <= 12) {
    score += 300 * (1 - diffHours / 12);
  } else if (diffHours <= 24) {
    score += 200 * (1 - (diffHours - 12) / 12);
  } else if (diffHours <= 72) {
    score += 100 * (1 - (diffHours - 24) / 48);
  } else if (diffHours <= 168) {
    score += 40 * (1 - (diffHours - 72) / 96);
  }

  // 3. Scheduled Time today
  const scheduledMs = new Date(task.dateTime).getTime();
  const scheduledDiffHours = (scheduledMs - nowMs) / (1000 * 60 * 60);
  if (scheduledDiffHours <= 0 && scheduledDiffHours > -24) {
    score += 50;
  }

  return Math.round(score);
};

export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
  const list = [...tasks];

  switch (sortBy) {
    case 'smart':
      return list.sort((a, b) => {
        const scoreA = calculateSmartScore(a);
        const scoreB = calculateSmartScore(b);
        return scoreB - scoreA;
      });

    case 'deadline':
      return list.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });

    case 'priority': {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return list.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    }

    case 'dateTime':
      return list.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
      });

    case 'createdAt':
    default:
      return list.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
};
