import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PriorityLevel } from '../types';
import { colors, borderRadius, spacing } from '../theme';

interface PrioritySelectorProps {
  selected: PriorityLevel;
  onSelect: (priority: PriorityLevel) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({ selected, onSelect }) => {
  const options: { id: PriorityLevel; label: string; color: string; bg: string; icon: string }[] = [
    {
      id: 'low',
      label: 'Low',
      color: colors.priorityLow,
      bg: colors.priorityLowBg,
      icon: '🟢',
    },
    {
      id: 'medium',
      label: 'Medium',
      color: colors.priorityMedium,
      bg: colors.priorityMediumBg,
      icon: '🟡',
    },
    {
      id: 'high',
      label: 'High',
      color: colors.priorityHigh,
      bg: colors.priorityHighBg,
      icon: '🔴',
    },
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>PRIORITY LEVEL</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.7}
              onPress={() => onSelect(opt.id)}
              style={[
                styles.optionBtn,
                isSelected && {
                  backgroundColor: opt.bg,
                  borderColor: opt.color,
                },
              ]}
            >
              <Text style={styles.icon}>{opt.icon}</Text>
              <Text
                style={[
                  styles.optionText,
                  isSelected && { color: opt.color, fontWeight: '800' },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  icon: {
    fontSize: 12,
    marginRight: 6,
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
