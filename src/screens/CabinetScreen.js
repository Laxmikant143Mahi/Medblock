import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, FAB, Portal, Modal, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import MedicineCard from '../components/MedicineCard';
import LoadingScreen from '../components/LoadingScreen';
import { addToCabinet } from '../store/slices/medicineSlice';

const CabinetScreen = ({ route, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { cabinet, loading } = useSelector((state) => state.medicine);

  useEffect(() => {
    if (route.params?.medicine) {
      setSelectedMedicine(route.params.medicine);
      setShowAddModal(true);
    }
  }, [route.params?.medicine]);

  const handleAddMedicine = async () => {
    if (!selectedMedicine || !quantity || !expiryDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(addToCabinet({
        medicineId: selectedMedicine._id,
        quantity: parseInt(quantity),
        expiryDate,
      }));
      setShowAddModal(false);
      setSelectedMedicine(null);
      setQuantity('');
      setExpiryDate(new Date());
    } catch (error) {
      Alert.alert('Error', 'Failed to add medicine to cabinet');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const filteredMedicines = cabinet.filter(item =>
    item.medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });

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
        {sortedMedicines.length > 0 ? (
          sortedMedicines.map((item) => (
            <MedicineCard
              key={item._id}
              medicine={item.medicine}
              showExpiry
              showQuantity
              onPress={() => navigation.navigate('MedicineDetails', { medicine: item })}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your medicine cabinet is empty</Text>
            <Text style={styles.emptySubtext}>
              Add medicines by scanning their barcodes or manually entering details
            </Text>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => {
            setShowAddModal(false);
            setSelectedMedicine(null);
          }}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Add to Cabinet</Text>
          {selectedMedicine && (
            <MedicineCard medicine={selectedMedicine} />
          )}
          <CustomInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            left={<CustomInput.Icon name="numeric" />}
          />
          <CustomButton
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            Expiry Date: {expiryDate.toLocaleDateString()}
          </CustomButton>
          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
          <CustomButton
            mode="contained"
            onPress={handleAddMedicine}
            loading={loading}
            disabled={!selectedMedicine || !quantity || !expiryDate}
          >
            Add to Cabinet
          </CustomButton>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Scan')}
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
  dateButton: {
    marginVertical: 8,
  },
});

export default CabinetScreen;
