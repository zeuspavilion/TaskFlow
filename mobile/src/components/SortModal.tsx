import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SortOption } from '../types';
import { colors, borderRadius, spacing } from '../theme';

interface SortModalProps {
  visible: boolean;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onClose: () => void;
}

const sortOptions: { id: SortOption; title: string; subtitle: string; icon: string }[] = [
  {
    id: 'smart',
    title: '⚡ Smart Mix Algorithm (Bonus)',
    subtitle: 'Ranks by composite Urgency Score (Priority + Deadline Proximity + Time)',
    icon: '⚡',
  },
  {
    id: 'deadline',
    title: '⏰ Deadline (Nearest First)',
    subtitle: 'Tasks due soonest appear at the top',
    icon: '⏰',
  },
  {
    id: 'priority',
    title: '🔥 Priority (High to Low)',
    subtitle: 'High priority tasks first, then Medium, then Low',
    icon: '🔥',
  },
  {
    id: 'dateTime',
    title: '📅 Scheduled Date-Time',
    subtitle: 'Sorted chronologically by scheduled time',
    icon: '📅',
  },
  {
    id: 'createdAt',
    title: '✨ Recently Created',
    subtitle: 'Newest tasks first',
    icon: '✨',
  },
];

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  selectedSort,
  onSelectSort,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.handle} />
              <Text style={styles.title}>Sort Tasks By</Text>

              {sortOptions.map((opt) => {
                const isSelected = selectedSort === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelectSort(opt.id);
                      onClose();
                    }}
                    style={[styles.optionItem, isSelected && styles.selectedItem]}
                  >
                    <View style={styles.optionTextContainer}>
                      <Text style={[styles.optionTitle, isSelected && styles.selectedText]}>
                        {opt.title}
                      </Text>
                      <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
                    </View>
                    {isSelected ? <Text style={styles.checkIcon}>✓</Text> : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.surfaceBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    marginBottom: 8,
    backgroundColor: colors.inputBackground,
  },
  selectedItem: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectedText: {
    color: colors.primary,
  },
  optionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  checkIcon: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
