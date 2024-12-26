import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Card, Avatar, Searchbar, Portal, Modal, useTheme, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../../components/CustomButton';
import LoadingScreen from '../../components/LoadingScreen';
import { fetchUsers, updateUserRole, deleteUser } from '../../store/slices/userSlice';

const UserCard = ({ user, onRoleChange, onDelete }) => {
  const theme = useTheme();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return theme.colors.error;
      case 'ngo':
        return theme.colors.primary;
      default:
        return theme.colors.secondary;
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.userHeader}>
          <Avatar.Text
            size={40}
            label={user.name.charAt(0)}
            backgroundColor={getRoleColor(user.role)}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={[styles.roleChip, { backgroundColor: getRoleColor(user.role) }]}>
              <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {user.role === 'ngo' && user.organizationDetails && (
          <View style={styles.orgDetails}>
            <Text style={styles.orgName}>{user.organizationDetails.name}</Text>
            <Text style={styles.orgAddress}>{user.organizationDetails.address}</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <CustomButton
            mode="outlined"
            onPress={() => onRoleChange(user)}
            style={styles.actionButton}
          >
            Change Role
          </CustomButton>
          <CustomButton
            mode="outlined"
            onPress={() => onDelete(user)}
            style={[styles.actionButton, styles.deleteButton]}
            textColor={theme.colors.error}
          >
            Delete User
          </CustomButton>
        </View>
      </Card.Content>
    </Card>
  );
};

const ManageUsersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleRoleUpdate = async (newRole) => {
    try {
      await dispatch(updateUserRole({ userId: selectedUser._id, role: newRole }));
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteUser(user._id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.organizationDetails?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search users..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onRoleChange={handleRoleChange}
              onDelete={handleDeleteUser}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={showRoleModal}
          onDismiss={() => {
            setShowRoleModal(false);
            setSelectedUser(null);
          }}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Change User Role</Text>
          <List.Section>
            <List.Item
              title="User"
              left={() => <List.Icon icon="account" />}
              onPress={() => handleRoleUpdate('user')}
            />
            <List.Item
              title="NGO"
              left={() => <List.Icon icon="account-group" />}
              onPress={() => handleRoleUpdate('ngo')}
            />
            <List.Item
              title="Admin"
              left={() => <List.Icon icon="shield-account" />}
              onPress={() => handleRoleUpdate('admin')}
            />
          </List.Section>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBar: {
    margin: 16,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  roleChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  orgDetails: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '500',
  },
  orgAddress: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  deleteButton: {
    borderColor: 'red',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ManageUsersScreen;
