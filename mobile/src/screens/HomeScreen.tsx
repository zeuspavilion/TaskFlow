import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { StatsCard } from '../components/StatsCard';
import { FilterBar } from '../components/FilterBar';
import { TaskCard } from '../components/TaskCard';
import { colors, borderRadius, spacing, shadows } from '../theme';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const {
    filteredTasks,
    stats,
    isLoading,
    fetchTasks,
    fetchStats,
    toggleTaskCompletion,
    deleteTask,
    filter,
    setFilter,
    categories,
  } = useTasks();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTasks(), fetchStats()]);
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header Top Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user?.name || user?.email?.split('@')[0] || 'User'} 👋</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddEditTask', {})}
          style={styles.headerAddBtn}
        >
          <Text style={styles.headerAddIcon}>＋</Text>
          <Text style={styles.headerAddText}>New Task</Text>
        </TouchableOpacity>
      </View>

      {/* Task List with Stats & Filter Header */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Statistics Dashboard Card */}
            <StatsCard stats={stats} />

            {/* Filter & Search Bar */}
            <FilterBar
              filter={filter}
              onChangeFilter={setFilter}
              categories={categories}
            />

            {/* List Section Heading */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {filter.status === 'completed'
                  ? 'Completed Tasks'
                  : filter.status === 'pending'
                  ? 'Active Tasks'
                  : 'All Tasks'}{' '}
                ({filteredTasks.length})
              </Text>

              {filter.sortBy === 'smart' && (
                <View style={styles.smartIndicator}>
                  <Text style={styles.smartIndicatorText}>⚡ Smart Score Active</Text>
                </View>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggleComplete={() => toggleTaskCompletion(item)}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item._id })}
            onEdit={() => navigation.navigate('AddEditTask', { task: item })}
            onDelete={() => deleteTask(item._id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✨</Text>
            <Text style={styles.emptyTitle}>
              {isLoading ? 'Loading your tasks...' : 'No tasks found'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {filter.search || filter.status !== 'all' || filter.category !== 'All'
                ? 'Try adjusting your filters or search terms.'
                : 'You have a clean slate! Tap the "+ New Task" button to get started.'}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddEditTask', {})}
        style={styles.fab}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  greeting: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    ...shadows.glowPrimary,
  },
  headerAddIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  headerAddText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 90,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  smartIndicator: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: borderRadius.sm,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  smartIndicatorText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glowPrimary,
  },
  fabText: {
    color: '#FFF',
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
  },
});
