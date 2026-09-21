import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { SERVER_URL_KEY, DEFAULT_BASE_URL } from '../api/client';
import { CustomButton } from '../components/CustomButton';
import { colors, borderRadius, spacing, shadows } from '../theme';
import { formatDateOnly } from '../utils/dateUtils';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { stats } = useTasks();

  const [serverUrl, setServerUrl] = useState(DEFAULT_BASE_URL);
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SERVER_URL_KEY).then((val) => {
      if (val) setServerUrl(val);
    });
  }, []);

  const handleSaveUrl = async () => {
    try {
      await AsyncStorage.setItem(SERVER_URL_KEY, serverUrl.trim());
      setIsEditingUrl(false);
      Alert.alert('Success', 'Backend API URL updated successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save server URL');
    }
  };

  const handleResetUrl = async () => {
    await AsyncStorage.removeItem(SERVER_URL_KEY);
    setServerUrl(DEFAULT_BASE_URL);
    setIsEditingUrl(false);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account & Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'TaskFlow User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.createdAt && (
            <Text style={styles.memberSince}>
              Member since {formatDateOnly(user.createdAt)}
            </Text>
          )}
        </View>

        {/* Productivity Overview */}
        <Text style={styles.sectionHeading}>PRODUCTIVITY STATS</Text>
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Tasks Managed</Text>
            <Text style={styles.statValue}>{stats?.total || 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Completed Tasks</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {stats?.completed || 0}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Overall Completion Rate</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats?.completionRate || 0}%
            </Text>
          </View>
        </View>

        {/* Server Endpoint Config (Super helpful for Testing) */}
        <Text style={styles.sectionHeading}>BACKEND API CONFIGURATION</Text>
        <View style={styles.configCard}>
          <Text style={styles.configLabel}>Current API Base URL:</Text>
          {isEditingUrl ? (
            <View style={{ marginTop: 8 }}>
              <TextInput
                value={serverUrl}
                onChangeText={setServerUrl}
                style={styles.urlInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.urlBtnRow}>
                <TouchableOpacity onPress={handleSaveUrl} style={styles.saveUrlBtn}>
                  <Text style={styles.saveUrlText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleResetUrl} style={styles.resetUrlBtn}>
                  <Text style={styles.resetUrlText}>Reset Default</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.urlDisplayRow}>
              <Text style={styles.urlText}>{serverUrl}</Text>
              <TouchableOpacity onPress={() => setIsEditingUrl(true)}>
                <Text style={styles.editUrlText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.configHint}>
            Android Emulator: http://10.0.2.2:5000/api{'\n'}
            Physical Device: http://YOUR_PC_IP:5000/api
          </Text>
        </View>

        {/* Logout */}
        <CustomButton
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
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
  profileCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...shadows.glowPrimary,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  name: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memberSince: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
  },
  sectionHeading: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  statsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  configCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.xl,
  },
  configLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  urlDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: colors.inputBackground,
    padding: 10,
    borderRadius: borderRadius.md,
  },
  urlText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  editUrlText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  urlInput: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: 10,
    color: colors.textPrimary,
    fontSize: 13,
  },
  urlBtnRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  saveUrlBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: borderRadius.sm,
    marginRight: 8,
  },
  saveUrlText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  resetUrlBtn: {
    backgroundColor: colors.cardSecondary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: borderRadius.sm,
  },
  resetUrlText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  configHint: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 8,
    lineHeight: 16,
  },
  logoutBtn: {
    marginTop: spacing.md,
  },
});
