/**
 * Helper to format date strings into human readable representations
 */
export const formatDateTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleDateString(undefined, options);
};

export const formatDateOnly = (dateString: string | Date): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  return date.toLocaleDateString(undefined, options);
};

export const formatTimeOnly = (dateString: string | Date): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid time';

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleTimeString(undefined, options);
};

/**
 * Returns deadline proximity status:
 * - isOverdue: boolean
 * - label: e.g. "Overdue by 2h", "Due in 45m", "Due tomorrow"
 * - urgencyLevel: 'critical' | 'warning' | 'normal' | 'done'
 */
export const getDeadlineStatus = (
  deadlineStr: string | Date,
  isCompleted: boolean = false
): {
  isOverdue: boolean;
  label: string;
  urgencyLevel: 'critical' | 'warning' | 'normal' | 'done';
} => {
  if (isCompleted) {
    return {
      isOverdue: false,
      label: 'Completed',
      urgencyLevel: 'done',
    };
  }

  const deadline = new Date(deadlineStr).getTime();
  const now = new Date().getTime();
  const diffMs = deadline - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) {
    const overdueHours = Math.floor(Math.abs(diffHours));
    if (overdueHours < 1) {
      return { isOverdue: true, label: 'Just passed deadline', urgencyLevel: 'critical' };
    } else if (overdueHours < 24) {
      return { isOverdue: true, label: `Overdue by ${overdueHours}h`, urgencyLevel: 'critical' };
    } else {
      const days = Math.floor(overdueHours / 24);
      return { isOverdue: true, label: `Overdue by ${days}d`, urgencyLevel: 'critical' };
    }
  }

  if (diffHours < 1) {
    const mins = Math.max(1, Math.floor(diffHours * 60));
    return { isOverdue: false, label: `Due in ${mins}m`, urgencyLevel: 'critical' };
  } else if (diffHours <= 12) {
    return { isOverdue: false, label: `Due in ${Math.floor(diffHours)}h`, urgencyLevel: 'warning' };
  } else if (diffHours <= 24) {
    return { isOverdue: false, label: 'Due today', urgencyLevel: 'warning' };
  } else if (diffHours <= 48) {
    return { isOverdue: false, label: 'Due tomorrow', urgencyLevel: 'normal' };
  } else {
    const days = Math.floor(diffHours / 24);
    return { isOverdue: false, label: `Due in ${days} days`, urgencyLevel: 'normal' };
  }
};
