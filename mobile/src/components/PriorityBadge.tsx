import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriorityLevel } from '../types';
import { colors, borderRadius } from '../theme';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const getConfig = () => {
    switch (priority) {
      case 'high':
        return {
          label: 'HIGH',
          color: colors.priorityHigh,
          bg: colors.priorityHighBg,
          dot: '🔴',
        };
      case 'medium':
        return {
          label: 'MED',
          color: colors.priorityMedium,
          bg: colors.priorityMediumBg,
          dot: '🟡',
        };
      case 'low':
      default:
        return {
          label: 'LOW',
          color: colors.priorityLow,
          bg: colors.priorityLowBg,
          dot: '🟢',
        };
    }
  };

  const config = getConfig();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg, borderColor: config.color },
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text
        style={[
          styles.text,
          { color: config.color },
          size === 'sm' ? styles.textSm : styles.textMd,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeMd: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 10,
  },
  textMd: {
    fontSize: 11,
  },
});
