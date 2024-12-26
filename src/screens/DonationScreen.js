import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, FAB, Portal, Modal, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import DonationCard from '../components/DonationCard';
import LoadingScreen from '../components/LoadingScreen';
import { createDonation } from '../store/slices/donationSlice';

const DonationScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const theme = useTheme();
  const dispatch = useDispatch();
  const { donations, loading } = useSelector((state) => state.donation);
  const { cabinet } = useSelector((state) => state.medicine);

  const handleCreateDonation = async () => {
    if (!selectedMedicine || !quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await dispatch(createDonation({
        medicineId: selectedMedicine._id,
        quantity: parseInt(quantity),
        notes,
      }));
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to create donation');
    }
  };

  const resetForm = () => {
    setSelectedMedicine(null);
    setQuantity('');
    setNotes('');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Donations</Text>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <DonationCard
                key={donation._id}
                donation={donation}
                onPress={() => {/* TODO: Navigate to donation details */}}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No donations yet</Text>
              <Text style={styles.emptySubtext}>
                Start donating your unused medicines to help those in need
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => {
            setShowAddModal(false);
            resetForm();
          }}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Create Donation</Text>

          <View style={styles.medicineSelector}>
            <Text style={styles.label}>Select Medicine</Text>
            <ScrollView style={styles.medicineList}>
              {cabinet.map((item) => (
                <CustomButton
                  key={item._id}
                  mode={selectedMedicine?._id === item.medicine._id ? 'contained' : 'outlined'}
                  onPress={() => setSelectedMedicine(item.medicine)}
                  style={styles.medicineButton}
                >
                  {item.medicine.name}
                </CustomButton>
              ))}
            </ScrollView>
          </View>

          <CustomInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            left={<CustomInput.Icon name="numeric" />}
          />

          <CustomInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            left={<CustomInput.Icon name="note" />}
          />

          <CustomButton
            mode="contained"
            onPress={handleCreateDonation}
            loading={loading}
            disabled={!selectedMedicine || !quantity}
            style={styles.submitButton}
          >
            Create Donation
          </CustomButton>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddModal(true)}
      />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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
  medicineSelector: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  medicineList: {
    maxHeight: 150,
  },
  medicineButton: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default DonationScreen;
