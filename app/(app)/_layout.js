import { Tabs } from 'expo-router';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

export default function AppLayout() {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const getTabScreens = () => {
    switch (user.role) {
      case 'admin':
        return (
          <>
            <Tabs.Screen
              name="dashboard"
              options={{
                title: 'Dashboard',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="medicines"
              options={{
                title: 'Medicines',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'medical' : 'medical-outline'} size={24} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="users"
              options={{
                title: 'Users',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
                ),
              }}
            />
          </>
        );
      case 'ngo':
        return (
          <>
            <Tabs.Screen
              name="dashboard"
              options={{
                title: 'Dashboard',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="donations"
              options={{
                title: 'Donations',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'gift' : 'gift-outline'} size={24} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="schedule"
              options={{
                title: 'Schedule',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} color={color} />
                ),
              }}
            />
          </>
        );
      default:
        return (
          <>
            <Tabs.Screen
              name="home"
              options={{
                title: 'Home',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="scan"
              options={{
                title: 'Scan',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'scan' : 'scan-outline'} size={24} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="cabinet"
              options={{
                title: 'Cabinet',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'medical' : 'medical-outline'} size={24} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="donations"
              options={{
                title: 'Donations',
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons name={focused ? 'gift' : 'gift-outline'} size={24} color={color} />
                ),
              }}
            />
          </>
        );
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {getTabScreens()}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
