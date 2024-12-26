import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const CustomButton = ({
  mode = 'contained',
  onPress,
  loading = false,
  disabled = false,
  children,
  style,
  compact = false,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[
        styles.button,
        mode === 'contained' && { backgroundColor: theme.colors.primary },
        compact && styles.compact,
        style,
      ]}
      labelStyle={[styles.label, compact && styles.compactLabel]}
      {...props}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  label: {
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  compact: {
    marginHorizontal: -8,
  },
  compactLabel: {
    paddingVertical: 4,
    fontSize: 14,
  },
});

export default CustomButton;
