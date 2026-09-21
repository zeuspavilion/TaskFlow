import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
}) => {
  const getContainerStyle = (): ViewStyle => {
    let base: ViewStyle = styles.base;

    // Size
    if (size === 'sm') base = { ...base, paddingVertical: 8, paddingHorizontal: 14 };
    if (size === 'lg') base = { ...base, paddingVertical: 16, paddingHorizontal: 28 };

    // Variant
    switch (variant) {
      case 'secondary':
        return { ...base, backgroundColor: colors.cardSecondary, borderColor: colors.surfaceBorder, borderWidth: 1 };
      case 'danger':
        return { ...base, backgroundColor: colors.danger };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case 'ghost':
        return { ...base, backgroundColor: 'transparent' };
      case 'primary':
      default:
        return { ...base, backgroundColor: colors.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    let baseText: TextStyle = styles.text;

    if (size === 'sm') baseText = { ...baseText, fontSize: 13 };
    if (size === 'lg') baseText = { ...baseText, fontSize: 17 };

    switch (variant) {
      case 'outline':
      case 'ghost':
        return { ...baseText, color: colors.primary };
      case 'secondary':
        return { ...baseText, color: colors.textPrimary };
      case 'primary':
      case 'danger':
      default:
        return { ...baseText, color: colors.textPrimary };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), (disabled || loading) && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFF'} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text style={[getTextStyle(), leftIcon ? { marginLeft: 8 } : null, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
