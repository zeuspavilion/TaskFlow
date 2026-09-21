import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { TaskFilterState, TaskStatus, PriorityLevel, SortOption } from '../types';
import { colors, borderRadius, spacing } from '../theme';
import { SortModal } from './SortModal';

interface FilterBarProps {
  filter: TaskFilterState;
  onChangeFilter: React.Dispatch<React.SetStateAction<TaskFilterState>>;
  categories: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  categories,
}) => {
  const [showSortModal, setShowSortModal] = useState(false);

  const statusOptions: { id: TaskStatus; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
  ];

  const priorityOptions: { id: PriorityLevel | 'all'; label: string; color?: string }[] = [
    { id: 'all', label: 'All Pri' },
    { id: 'high', label: 'High', color: colors.priorityHigh },
    { id: 'medium', label: 'Med', color: colors.priorityMedium },
    { id: 'low', label: 'Low', color: colors.priorityLow },
  ];

  return (
    <View style={styles.container}>
      {/* Search Input and Sort Button Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search tasks by title, tag or description..."
            placeholderTextColor={colors.textMuted}
            value={filter.search}
            onChangeText={(text) => onChangeFilter((prev) => ({ ...prev, search: text }))}
            style={styles.searchInput}
          />
          {filter.search ? (
            <TouchableOpacity
              onPress={() => onChangeFilter((prev) => ({ ...prev, search: '' }))}
              style={styles.clearBtn}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowSortModal(true)}
          style={[
            styles.sortBtn,
            filter.sortBy === 'smart' && styles.smartSortActive,
          ]}
        >
          <Text style={styles.sortBtnIcon}>⚡</Text>
          <Text style={styles.sortBtnText}>
            {filter.sortBy === 'smart' ? 'Smart' : 'Sort'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Tabs */}
      <View style={styles.statusRow}>
        {statusOptions.map((st) => {
          const isActive = filter.status === st.id;
          return (
            <TouchableOpacity
              key={st.id}
              activeOpacity={0.7}
              onPress={() => onChangeFilter((prev) => ({ ...prev, status: st.id }))}
              style={[styles.statusTab, isActive && styles.activeStatusTab]}
            >
              <Text style={[styles.statusText, isActive && styles.activeStatusText]}>
                {st.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.verticalDivider} />

        {/* Priority quick filter pills */}
        {priorityOptions.map((pri) => {
          const isActive = filter.priority === pri.id;
          return (
            <TouchableOpacity
              key={pri.id}
              activeOpacity={0.7}
              onPress={() => onChangeFilter((prev) => ({ ...prev, priority: pri.id }))}
              style={[
                styles.priPill,
                isActive && styles.activePriPill,
                pri.color && isActive ? { borderColor: pri.color } : null,
              ]}
            >
              <Text
                style={[
                  styles.priText,
                  isActive && styles.activePriText,
                  pri.color ? { color: pri.color } : null,
                ]}
              >
                {pri.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Category Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => {
          const isActive = filter.category?.toLowerCase() === cat.toLowerCase();
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.7}
              onPress={() =>
                onChangeFilter((prev) => ({
                  ...prev,
                  category: cat === 'All' ? 'All' : cat,
                }))
              }
              style={[styles.categoryChip, isActive && styles.activeCategoryChip]}
            >
              <Text
                style={[styles.categoryChipText, isActive && styles.activeCategoryChipText]}
              >
                {cat === 'All' ? '🏷️ All Tags' : `#${cat}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort selection bottom sheet */}
      <SortModal
        visible={showSortModal}
        selectedSort={filter.sortBy}
        onSelectSort={(sort: SortOption) =>
          onChangeFilter((prev) => ({ ...prev, sortBy: sort }))
        }
        onClose={() => setShowSortModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingVertical: 4,
  },
  clearBtn: {
    padding: 4,
  },
  clearIcon: {
    color: colors.textMuted,
    fontSize: 14,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSecondary,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
    marginLeft: 8,
  },
  smartSortActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  sortBtnIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  sortBtnText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardSecondary,
    marginRight: 6,
  },
  activeStatusTab: {
    backgroundColor: colors.primary,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#FFF',
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.surfaceBorder,
    marginHorizontal: 4,
  },
  priPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginLeft: 4,
  },
  activePriPill: {
    backgroundColor: colors.inputBackground,
  },
  priText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activePriText: {
    fontWeight: '800',
  },
  categoryScroll: {
    paddingRight: 10,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: colors.secondary,
  },
  categoryChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeCategoryChipText: {
    color: colors.secondary,
    fontWeight: '700',
  },
});
