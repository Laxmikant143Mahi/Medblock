import { MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    primaryContainer: '#E3F2FD',
    secondary: '#03DAC6',
    secondaryContainer: '#E0F7FA',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#B00020',
    errorContainer: '#FDECEA',
    success: '#4CAF50',
    successContainer: '#E8F5E9',
    warning: '#FFC107',
    warningContainer: '#FFF8E1',
    info: '#2196F3',
    infoContainer: '#E3F2FD',
  },
  roundness: 8,
};

export default theme;
