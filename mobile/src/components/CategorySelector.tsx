import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface CategorySelectorProps {
  selected: string;
  onSelect: (category: string) => void;
}

const defaultCategories = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Urgent', 'General'];

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect }) => {
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleAddCustom = () => {
    if (customCategory.trim()) {
      onSelect(customCategory.trim());
      setCustomCategory('');
      setShowCustomInput(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>CATEGORY / TAG</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {defaultCategories.map((cat) => {
          const isSelected = selected.toLowerCase() === cat.toLowerCase();
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.7}
              onPress={() => onSelect(cat)}
              style={[styles.chip, isSelected && styles.selectedChip]}
            >
              <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                #{cat}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowCustomInput(!showCustomInput)}
          style={[styles.chip, styles.addChip]}
        >
          <Text style={styles.addChipText}>+ Custom</Text>
        </TouchableOpacity>
      </ScrollView>

      {showCustomInput ? (
        <View style={styles.customInputRow}>
          <TextInput
            placeholder="Type custom tag name..."
            placeholderTextColor={colors.textMuted}
            value={customCategory}
            onChangeText={setCustomCategory}
            style={styles.customInput}
            autoFocus
          />
          <TouchableOpacity onPress={handleAddCustom} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
  chipsContainer: {
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  selectedChipText: {
    color: colors.primary,
    fontWeight: '700',
  },
  addChip: {
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
  },
  addChipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  customInput: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 42,
    color: colors.textPrimary,
    fontSize: 13,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: 16,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
