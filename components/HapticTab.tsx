import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { Platform } from 'react-native';

// Mock Haptics for web platform
const mockHaptics = {
  impactAsync: () => Promise.resolve(),
  ImpactFeedbackStyle: {
    Light: 'light',
  },
};

// Use real Haptics only on native platforms
const Haptics = Platform.select({
  native: () => require('expo-haptics'),
  default: () => mockHaptics,
})();

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (Platform.OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
