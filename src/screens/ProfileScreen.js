import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Avatar, List, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../components/CustomButton';
import { logout } from '../store/slices/authSlice';

const ProfileScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={user?.name?.charAt(0) || 'U'}
            backgroundColor={theme.colors.primary}
          />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={[styles.roleChip, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>

        {user?.role === 'ngo' && user?.organizationDetails && (
          <List.Section>
            <List.Subheader>Organization Details</List.Subheader>
            <List.Item
              title="Organization Name"
              description={user.organizationDetails.name}
              left={() => <List.Icon icon="office-building" />}
            />
            <List.Item
              title="Address"
              description={user.organizationDetails.address}
              left={() => <List.Icon icon="map-marker" />}
            />
          </List.Section>
        )}

        <List.Section>
          <List.Subheader>Account Settings</List.Subheader>
          <List.Item
            title="Edit Profile"
            left={() => <List.Icon icon="account-edit" />}
            onPress={() => {/* TODO: Implement edit profile */}}
          />
          <List.Item
            title="Change Password"
            left={() => <List.Icon icon="lock" />}
            onPress={() => {/* TODO: Implement change password */}}
          />
          <List.Item
            title="Notifications"
            left={() => <List.Icon icon="bell" />}
            onPress={() => {/* TODO: Implement notifications settings */}}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>App Settings</List.Subheader>
          <List.Item
            title="Language"
            description="English"
            left={() => <List.Icon icon="translate" />}
            onPress={() => {/* TODO: Implement language settings */}}
          />
          <List.Item
            title="Dark Mode"
            description="Off"
            left={() => <List.Icon icon="theme-light-dark" />}
            onPress={() => {/* TODO: Implement theme settings */}}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Privacy Policy"
            left={() => <List.Icon icon="shield-account" />}
            onPress={() => {/* TODO: Show privacy policy */}}
          />
          <List.Item
            title="Terms of Service"
            left={() => <List.Icon icon="file-document" />}
            onPress={() => {/* TODO: Show terms of service */}}
          />
          <List.Item
            title="App Version"
            description="1.0.0"
            left={() => <List.Icon icon="information" />}
          />
        </List.Section>

        <CustomButton
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          Logout
        </CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  roleText: {
    color: 'white',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: 16,
    borderColor: 'red',
  },
});

export default ProfileScreen;
