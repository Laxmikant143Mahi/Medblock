import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, FAB, Portal, Modal, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import MedicineCard from '../../components/MedicineCard';
import LoadingScreen from '../../components/LoadingScreen';
import { addMedicine, updateMedicine, deleteMedicine } from '../../store/slices/medicineSlice';

const ManageMedicinesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    batchNumber: '',
    barcode: '',
    manufacturingDate: new Date(),
    expiryDate: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState(null);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { medicines, loading } = useSelector((state) => state.medicine);

  const handleSubmit = async () => {
    try {
      if (selectedMedicine) {
        await dispatch(updateMedicine({ id: selectedMedicine._id, ...formData }));
      } else {
        await dispatch(addMedicine(formData));
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save medicine');
    }
  };

  const handleDelete = async (medicine) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this medicine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMedicine(medicine._id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete medicine');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      name: medicine.name,
      manufacturer: medicine.manufacturer,
      batchNumber: medicine.batchNumber,
      barcode: medicine.barcode,
      manufacturingDate: new Date(medicine.manufacturingDate),
      expiryDate: new Date(medicine.expiryDate),
    });
    setShowAddModal(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        [datePickerType]: selectedDate,
      }));
    }
  };

  const resetForm = () => {
    setSelectedMedicine(null);
    setFormData({
      name: '',
      manufacturer: '',
      batchNumber: '',
      barcode: '',
      manufacturingDate: new Date(),
      expiryDate: new Date(),
    });
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search medicines..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((medicine) => (
            <MedicineCard
              key={medicine._id}
              medicine={medicine}
              showActions
              onEdit={() => handleEdit(medicine)}
              onDelete={() => handleDelete(medicine)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medicines found</Text>
          </View>
        )}
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
          <Text style={styles.modalTitle}>
            {selectedMedicine ? 'Edit Medicine' : 'Add New Medicine'}
          </Text>
          
          <CustomInput
            label="Name"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
          
          <CustomInput
            label="Manufacturer"
            value={formData.manufacturer}
            onChangeText={(text) => setFormData(prev => ({ ...prev, manufacturer: text }))}
          />
          
          <CustomInput
            label="Batch Number"
            value={formData.batchNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, batchNumber: text }))}
          />
          
          <CustomInput
            label="Barcode"
            value={formData.barcode}
            onChangeText={(text) => setFormData(prev => ({ ...prev, barcode: text }))}
          />

          <CustomButton
            mode="outlined"
            onPress={() => {
              setDatePickerType('manufacturingDate');
              setShowDatePicker(true);
            }}
            style={styles.dateButton}
          >
            Manufacturing Date: {formData.manufacturingDate.toLocaleDateString()}
          </CustomButton>

          <CustomButton
            mode="outlined"
            onPress={() => {
              setDatePickerType('expiryDate');
              setShowDatePicker(true);
            }}
            style={styles.dateButton}
          >
            Expiry Date: {formData.expiryDate.toLocaleDateString()}
          </CustomButton>

          {showDatePicker && (
            <DateTimePicker
              value={formData[datePickerType]}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <CustomButton
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          >
            {selectedMedicine ? 'Update Medicine' : 'Add Medicine'}
          </CustomButton>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          resetForm();
          setShowAddModal(true);
        }}
      />
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
  dateButton: {
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default ManageMedicinesScreen;
