import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTasks } from '../context/TaskContext';
import { colors, borderRadius, spacing, shadows } from '../theme';

export const AnalyticsScreen: React.FC = () => {
  const { stats, tasks } = useTasks();

  const highCount = tasks.filter((t) => t.priority === 'high' && !t.isCompleted).length;
  const medCount = tasks.filter((t) => t.priority === 'medium' && !t.isCompleted).length;
  const lowCount = tasks.filter((t) => t.priority === 'low' && !t.isCompleted).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Analytics & Metrics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Productivity Rate Banner */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerEmoji}>📊</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Productivity Health</Text>
            <Text style={styles.bannerSubtitle}>
              {stats?.completionRate && stats.completionRate > 70
                ? 'Excellent! You are crushing your deadlines.'
                : 'Keep pushing! Focus on high-priority and overdue items.'}
            </Text>
          </View>
        </View>

        {/* Priority Breakdown */}
        <Text style={styles.sectionTitle}>ACTIVE TASKS BY PRIORITY</Text>
        <View style={styles.card}>
          <View style={styles.priorityRow}>
            <View style={styles.priorityIndicator}>
              <Text style={styles.dotHigh}>🔴</Text>
              <Text style={styles.priorityText}>High Priority</Text>
            </View>
            <Text style={[styles.priorityCount, { color: colors.priorityHigh }]}>
              {highCount}
            </Text>
          </View>

          <View style={styles.priorityRow}>
            <View style={styles.priorityIndicator}>
              <Text style={styles.dotMed}>🟡</Text>
              <Text style={styles.priorityText}>Medium Priority</Text>
            </View>
            <Text style={[styles.priorityCount, { color: colors.priorityMedium }]}>
              {medCount}
            </Text>
          </View>

          <View style={styles.priorityRow}>
            <View style={styles.priorityIndicator}>
              <Text style={styles.dotLow}>🟢</Text>
              <Text style={styles.priorityText}>Low Priority</Text>
            </View>
            <Text style={[styles.priorityCount, { color: colors.priorityLow }]}>
              {lowCount}
            </Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>CATEGORY BREAKDOWN</Text>
        <View style={styles.card}>
          {stats?.categories && stats.categories.length > 0 ? (
            stats.categories.map((cat) => (
              <View key={cat._id} style={styles.catRow}>
                <Text style={styles.catName}>#{cat._id || 'General'}</Text>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{cat.count} tasks</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyCatText}>No categorized tasks yet</Text>
          )}
        </View>

        {/* Algorithm Highlights */}
        <Text style={styles.sectionTitle}>SMART MIX ALGORITHM DETAILS</Text>
        <View style={styles.card}>
          <Text style={styles.algoText}>
            Our proprietary ranking engine computes a real-time urgency score:
          </Text>
          <View style={styles.formulaBox}>
            <Text style={styles.formulaCode}>
              Score = Priority Weight + Deadline Urgency + Scheduled Alignment
            </Text>
          </View>
          <Text style={styles.algoBullet}>
            • High priority tasks receive +350 pts
          </Text>
          <Text style={styles.algoBullet}>
            • Imminent / overdue deadlines scale exponentially up to +700 pts
          </Text>
          <Text style={styles.algoBullet}>
            • Completed tasks automatically move to the bottom
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
  },
  bannerEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotHigh: { fontSize: 12, marginRight: 8 },
  dotMed: { fontSize: 12, marginRight: 8 },
  dotLow: { fontSize: 12, marginRight: 8 },
  priorityText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  priorityCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  catName: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  catBadge: {
    backgroundColor: colors.inputBackground,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  catBadgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCatText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 10,
  },
  algoText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  formulaBox: {
    backgroundColor: colors.inputBackground,
    padding: 10,
    borderRadius: borderRadius.md,
    marginBottom: 10,
  },
  formulaCode: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  algoBullet: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
});
