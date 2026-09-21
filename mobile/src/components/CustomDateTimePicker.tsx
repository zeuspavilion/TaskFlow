import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, borderRadius, spacing } from '../theme';
import { formatDateOnly, formatTimeOnly } from '../utils/dateUtils';

interface CustomDateTimePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  helperText?: string;
}

export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  label,
  value,
  onChange,
  minimumDate,
  helperText,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate) {
      // Preserve current time
      const newDate = new Date(selectedDate);
      newDate.setHours(value.getHours(), value.getMinutes(), 0, 0);
      onChange(newDate);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate) {
      // Preserve current year/month/day
      const newDate = new Date(value);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      onChange(newDate);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerRow}>
        {/* Date Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowDatePicker(true)}
          style={styles.pickerButton}
        >
          <Text style={styles.icon}>📅</Text>
          <View>
            <Text style={styles.buttonLabel}>DATE</Text>
            <Text style={styles.buttonValue}>{formatDateOnly(value)}</Text>
          </View>
        </TouchableOpacity>

        {/* Time Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowTimePicker(true)}
          style={styles.pickerButton}
        >
          <Text style={styles.icon}>⏰</Text>
          <View>
            <Text style={styles.buttonLabel}>TIME</Text>
            <Text style={styles.buttonValue}>{formatTimeOnly(value)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}

      {showDatePicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={minimumDate}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={value}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
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
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  buttonLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
});
