import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { colors, borderRadius, spacing, shadows } from '../theme';
import { formatDateTime, getDeadlineStatus } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onPress,
  onEdit,
  onDelete,
}) => {
  const deadlineInfo = getDeadlineStatus(task.deadline, task.isCompleted);

  const confirmDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const getDeadlineStyle = () => {
    if (task.isCompleted) return { color: colors.textMuted, bg: 'transparent' };
    if (deadlineInfo.urgencyLevel === 'critical') {
      return { color: colors.danger, bg: 'rgba(239, 68, 68, 0.15)' };
    }
    if (deadlineInfo.urgencyLevel === 'warning') {
      return { color: colors.warning, bg: 'rgba(245, 158, 11, 0.15)' };
    }
    return { color: colors.secondary, bg: 'rgba(6, 182, 212, 0.15)' };
  };

  const dlStyle = getDeadlineStyle();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        task.isCompleted && styles.completedCard,
        deadlineInfo.isOverdue && !task.isCompleted && styles.overdueBorder,
      ]}
    >
      <View style={styles.topRow}>
        {/* Checkbox */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleComplete}
          style={[styles.checkbox, task.isCompleted && styles.checkboxChecked]}
        >
          {task.isCompleted ? <Text style={styles.checkmark}>✓</Text> : null}
        </TouchableOpacity>

        {/* Title and Category */}
        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, task.isCompleted && styles.completedText]}
            numberOfLines={1}
          >
            {task.title}
          </Text>

          {task.category ? (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>#{task.category}</Text>
            </View>
          ) : null}
        </View>

        {/* Priority Badge */}
        <PriorityBadge priority={task.priority} size="sm" />
      </View>

      {/* Description */}
      {task.description ? (
        <Text
          style={[styles.description, task.isCompleted && styles.completedDesc]}
          numberOfLines={2}
        >
          {task.description}
        </Text>
      ) : null}

      {/* Footer Info & Deadline */}
      <View style={styles.footerRow}>
        <View style={[styles.deadlineBadge, { backgroundColor: dlStyle.bg }]}>
          <Text style={[styles.deadlineIcon, { color: dlStyle.color }]}>
            {deadlineInfo.isOverdue ? '⚠️' : '⏰'}
          </Text>
          <Text style={[styles.deadlineText, { color: dlStyle.color }]}>
            {deadlineInfo.label}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Smart Score Pill if available */}
      {task.urgencyScore !== undefined && !task.isCompleted && (
        <View style={styles.scoreRow}>
          <Text style={styles.scoreText}>
            ⚡ Urgency Score: <Text style={styles.scoreValue}>{task.urgencyScore}</Text>
          </Text>
          <Text style={styles.dateScheduled}>
            Scheduled: {formatDateTime(task.dateTime)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  completedCard: {
    opacity: 0.65,
    backgroundColor: '#121824',
    borderColor: 'transparent',
  },
  overdueBorder: {
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  categoryPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
    marginLeft: 34,
  },
  completedDesc: {
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 34,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  deadlineIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 6,
  },
  actionIcon: {
    fontSize: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 34,
    paddingTop: 4,
  },
  scoreText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  scoreValue: {
    color: colors.secondary,
    fontWeight: '700',
  },
  dateScheduled: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
