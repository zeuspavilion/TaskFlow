import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskStats } from '../types';
import { colors, borderRadius, spacing, shadows } from '../theme';

interface StatsCardProps {
  stats: TaskStats | null;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  if (!stats) return null;

  const completionRate = stats.completionRate || 0;

  return (
    <View style={styles.card}>
      {/* Header with Progress Bar */}
      <View style={styles.progressHeader}>
        <View>
          <Text style={styles.label}>PRODUCTIVITY PROGRESS</Text>
          <Text style={styles.progressSubtext}>
            {stats.completed} of {stats.total} tasks completed
          </Text>
        </View>
        <Text style={styles.percentText}>{completionRate}%</Text>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View style={[styles.bar, { width: `${Math.min(completionRate, 100)}%` }]} />
      </View>

      {/* Metric Counters */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricNumber, { color: colors.secondary }]}>
            {stats.pending}
          </Text>
          <Text style={styles.metricLabel}>Pending</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={[styles.metricNumber, { color: colors.success }]}>
            {stats.completed}
          </Text>
          <Text style={styles.metricLabel}>Completed</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={[styles.metricNumber, { color: colors.priorityHigh }]}>
            {stats.overdue}
          </Text>
          <Text style={styles.metricLabel}>Overdue</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={[styles.metricNumber, { color: colors.priorityMedium }]}>
            {stats.highPriority}
          </Text>
          <Text style={styles.metricLabel}>High Priority</Text>
        </View>
      </View>
    </View>
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  progressSubtext: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  percentText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  track: {
    height: 8,
    backgroundColor: colors.inputBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  bar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
