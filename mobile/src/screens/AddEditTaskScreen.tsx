import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, PriorityLevel } from '../types';
import { useTasks } from '../context/TaskContext';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { PrioritySelector } from '../components/PrioritySelector';
import { CategorySelector } from '../components/CategorySelector';
import { CustomDateTimePicker } from '../components/CustomDateTimePicker';
import { colors, borderRadius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditTask'>;

export const AddEditTaskScreen: React.FC<Props> = ({ route, navigation }) => {
  const { task } = route.params || {};
  const isEditing = Boolean(task);

  const { createTask, updateTask } = useTasks();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dateTime, setDateTime] = useState<Date>(
    task?.dateTime ? new Date(task.dateTime) : new Date()
  );
  // Default deadline 24 hours from now
  const [deadline, setDeadline] = useState<Date>(
    task?.deadline ? new Date(task.deadline) : new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [priority, setPriority] = useState<PriorityLevel>(task?.priority || 'medium');
  const [category, setCategory] = useState(task?.category || 'Work');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Task title is required.');
      return;
    }

    if (deadline.getTime() < dateTime.getTime()) {
      setErrorMsg('Task deadline cannot be earlier than scheduled date & time.');
      return;
    }

    setLoading(true);

    if (isEditing && task) {
      const res = await updateTask(task._id, {
        title: title.trim(),
        description: description.trim(),
        dateTime: dateTime.toISOString(),
        deadline: deadline.toISOString(),
        priority,
        category: category.trim(),
      });
      setLoading(false);

      if (res.success) {
        navigation.goBack();
      } else {
        setErrorMsg(res.message || 'Failed to update task.');
      }
    } else {
      const res = await createTask({
        title: title.trim(),
        description: description.trim(),
        dateTime: dateTime.toISOString(),
        deadline: deadline.toISOString(),
        priority,
        category: category.trim(),
      });
      setLoading(false);

      if (res.success) {
        navigation.goBack();
      } else {
        setErrorMsg(res.message || 'Failed to create task.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Title Input */}
          <CustomInput
            label="Task Title *"
            placeholder="e.g., Complete System Architecture Document"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              setErrorMsg('');
            }}
          />

          {/* Description Input */}
          <CustomInput
            label="Description (Optional)"
            placeholder="Add any notes, subtasks or background context..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          {/* Scheduled Date & Time */}
          <CustomDateTimePicker
            label="Scheduled Date & Time *"
            value={dateTime}
            onChange={setDateTime}
            helperText="When you plan to work on this task"
          />

          {/* Deadline Date & Time */}
          <CustomDateTimePicker
            label="Deadline Date & Time *"
            value={deadline}
            onChange={setDeadline}
            minimumDate={dateTime}
            helperText="Final due date (Used by Smart Mix Algorithm)"
          />

          {/* Priority Level */}
          <PrioritySelector selected={priority} onSelect={setPriority} />

          {/* Category / Tag */}
          <CategorySelector selected={category} onSelect={setCategory} />

          {/* Submit Button */}
          <CustomButton
            title={isEditing ? 'Save Changes' : 'Create Task'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
