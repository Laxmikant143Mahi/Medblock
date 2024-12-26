import React from 'react';
import { Platform } from 'react-native';
import { TextInput } from 'react-native-paper';

const DateTimePickerWeb = ({ value, onChange, mode = 'date' }) => {
  if (Platform.OS === 'web') {
    return (
      <TextInput
        mode="outlined"
        label={mode === 'date' ? 'Date' : 'Time'}
        value={value.toISOString().split('T')[0]}
        onChangeText={(text) => {
          const newDate = new Date(text);
          onChange({ type: 'set', nativeEvent: { timestamp: newDate.getTime() } });
        }}
        type={mode}
      />
    );
  }
  
  // For non-web platforms, import the actual DateTimePicker
  const DateTimePicker = require('@react-native-community/datetimepicker').default;
  return <DateTimePicker value={value} onChange={onChange} mode={mode} />;
};

export default DateTimePickerWeb;
