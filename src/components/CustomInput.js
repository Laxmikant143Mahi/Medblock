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
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    backgroundColor: 'white',
  },
});

export default CustomInput;
