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
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[styles.button, style]}
      labelStyle={styles.label}
      {...props}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;
