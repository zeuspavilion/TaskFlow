import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import { PriorityBadge } from '../components/PriorityBadge';
import { CustomButton } from '../components/CustomButton';
import { colors, borderRadius, spacing, shadows } from '../theme';
import { formatDateTime, getDeadlineStatus } from '../utils/dateUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

export const TaskDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();

  const task = tasks.find((t) => t._id === taskId);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Task not found or has been deleted.</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const deadlineInfo = getDeadlineStatus(task.deadline, task.isCompleted);

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to permanently remove this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task._id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddEditTask', { task })}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Banner */}
        <View
          style={[
            styles.statusBanner,
            task.isCompleted ? styles.completedBanner : styles.activeBanner,
          ]}
        >
          <Text style={styles.statusBannerText}>
            {task.isCompleted ? '✓ Task is Completed' : '⚡ Task is Active / Pending'}
          </Text>
        </View>

        {/* Card Main */}
        <View style={styles.card}>
          <View style={styles.tagRow}>
            <PriorityBadge priority={task.priority} size="md" />
            {task.category ? (
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>#{task.category}</Text>
              </View>
            ) : null}
          </View>

          <Text style={[styles.title, task.isCompleted && styles.completedTitle]}>
            {task.title}
          </Text>

          {task.description ? (
            <View style={styles.descBox}>
              <Text style={styles.sectionLabel}>DESCRIPTION</Text>
              <Text style={styles.descriptionText}>{task.description}</Text>
            </View>
          ) : null}

          {/* Timeline Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <View>
                <Text style={styles.infoLabel}>SCHEDULED TIME</Text>
                <Text style={styles.infoValue}>{formatDateTime(task.dateTime)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏰</Text>
              <View>
                <Text style={styles.infoLabel}>DEADLINE</Text>
                <Text style={styles.infoValue}>{formatDateTime(task.deadline)}</Text>
                <Text
                  style={[
                    styles.deadlineBadgeText,
                    deadlineInfo.isOverdue && !task.isCompleted
                      ? { color: colors.danger }
                      : { color: colors.secondary },
                  ]}
                >
                  {deadlineInfo.label}
                </Text>
              </View>
            </View>

            {task.urgencyScore !== undefined && !task.isCompleted && (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>⚡</Text>
                <View>
                  <Text style={styles.infoLabel}>SMART MIX URGENCY SCORE</Text>
                  <Text style={styles.scoreHighlight}>{task.urgencyScore} pts</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <CustomButton
          title={task.isCompleted ? 'Mark as Incomplete' : '✓ Mark as Completed'}
          variant={task.isCompleted ? 'secondary' : 'primary'}
          onPress={() => toggleTaskCompletion(task)}
          style={styles.actionBtn}
        />

        <CustomButton
          title="Delete Task"
          variant="danger"
          onPress={handleDelete}
          style={styles.deleteBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.cardSecondary,
  },
  editBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  statusBanner: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  activeBanner: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  completedBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusBannerText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    marginLeft: 8,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: spacing.md,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  descBox: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  descriptionText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  deadlineBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  scoreHighlight: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  actionBtn: {
    marginBottom: spacing.md,
  },
  deleteBtn: {
    marginBottom: spacing.xl,
  },
});
