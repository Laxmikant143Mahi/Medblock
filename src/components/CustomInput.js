import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const CustomInput = ({
  mode = 'outlined',
  error = false,
  disabled = false,
  style,
  ...props
}) => {
  return (
    <TextInput
      mode={mode}
      error={error}
      disabled={disabled}
      style={[styles.input, style]}
      outlineStyle={styles.outline}
      contentStyle={styles.content}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
  },
  outline: {
    borderRadius: 8,
  },
  content: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});

CustomInput.Icon = TextInput.Icon;
export default CustomInput;
