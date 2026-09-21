import { ITask } from '../models/Task';

/**
 * Calculates a composite smart urgency score for a task based on:
 * 1. Priority Weight (High: 300, Medium: 200, Low: 100)
 * 2. Deadline Urgency (Overdue gives critical boost, nearest deadlines scale up exponentially)
 * 3. Scheduled Date-Time Proximity
 * 4. Completion status (completed items sink to bottom)
 */
export const calculateSmartScore = (task: ITask, referenceTime: Date = new Date()): number => {
  // If task is completed, it gets deprioritized
  if (task.isCompleted) {
    return -10000 + (task.completedAt ? task.completedAt.getTime() / 1000000000 : 0);
  }

  let score = 0;

  // 1. Priority Scoring
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
    default:
      score += 150;
  }

  // 2. Deadline Urgency Factor
  const deadlineMs = new Date(task.deadline).getTime();
  const nowMs = referenceTime.getTime();
  const diffHours = (deadlineMs - nowMs) / (1000 * 60 * 60);

  if (diffHours < 0) {
    // Task is OVERDUE: Maximum alert boost + scaling for how overdue it is
    const overdueHours = Math.abs(diffHours);
    score += 500 + Math.min(overdueHours * 5, 200);
  } else if (diffHours <= 12) {
    // Due within 12 hours - extreme urgency
    score += 300 * (1 - diffHours / 12);
  } else if (diffHours <= 24) {
    // Due within 24 hours
    score += 200 * (1 - (diffHours - 12) / 12);
  } else if (diffHours <= 72) {
    // Due within 3 days
    score += 100 * (1 - (diffHours - 24) / 48);
  } else if (diffHours <= 168) {
    // Due within 1 week
    score += 40 * (1 - (diffHours - 72) / 96);
  }

  // 3. Scheduled Date-Time Alignment
  const scheduledMs = new Date(task.dateTime).getTime();
  const scheduledDiffHours = (scheduledMs - nowMs) / (1000 * 60 * 60);
  if (scheduledDiffHours <= 0 && scheduledDiffHours > -24) {
    // Scheduled for today and active now
    score += 50;
  }

  return Math.round(score * 100) / 100;
};

/**
 * Sorts an array of tasks using the Smart Mix Algorithm
 */
export const sortTasksBySmartAlgorithm = (tasks: ITask[]): ITask[] => {
  const now = new Date();
  return [...tasks].sort((a, b) => {
    const scoreA = calculateSmartScore(a, now);
    const scoreB = calculateSmartScore(b, now);
    return scoreB - scoreA; // Descending order of urgency
  });
};
