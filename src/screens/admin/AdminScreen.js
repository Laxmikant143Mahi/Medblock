import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Searchbar, FAB, Portal, Modal, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import LoadingScreen from '../../components/LoadingScreen';
import { fetchMedicines } from '../../store/slices/medicineSlice';

const AdminScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    manufacturer: '',
    batchNumber: '',
    barcode: '',
    manufacturingDate: '',
    expiryDate: '',
    category: '',
  });

  const theme = useTheme();
  const dispatch = useDispatch();
  
  const { medicines, loading } = useSelector((state) => state.medicine);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMedicines({}));
  }, [dispatch]);

  const handleAddMedicine = () => {
    // Implement medicine addition logic
    setIsAddModalVisible(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage Medicines and Users</Text>
        </View>

        <Searchbar
          placeholder="Search medicines..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsNumber}>{medicines.length}</Text>
              <Text style={styles.statsLabel}>Total Medicines</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsNumber}>
                {medicines.filter(m => m.verified).length}
              </Text>
              <Text style={styles.statsLabel}>Verified</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsNumber}>
                {medicines.filter(m => m.reports.length > 0).length}
              </Text>
              <Text style={styles.statsLabel}>Reports</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          {medicines
            .filter(m => m.reports.length > 0)
            .slice(0, 5)
            .map(medicine => (
              <Card key={medicine._id} style={styles.reportCard}>
                <Card.Content>
                  <Text style={styles.medicineName}>{medicine.name}</Text>
                  <Text style={styles.reportCount}>
                    {medicine.reports.length} Reports
                  </Text>
                  <Text style={styles.reportIssue}>
                    Latest: {medicine.reports[medicine.reports.length - 1].issue}
                  </Text>
                </Card.Content>
              </Card>
            ))}
        </View>

        <Portal>
          <Modal
            visible={isAddModalVisible}
            onDismiss={() => setIsAddModalVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Add New Medicine</Text>
            <CustomInput
              label="Medicine Name"
              value={newMedicine.name}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, name: text })}
            />
            <CustomInput
              label="Manufacturer"
              value={newMedicine.manufacturer}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, manufacturer: text })}
            />
            <CustomInput
              label="Batch Number"
              value={newMedicine.batchNumber}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, batchNumber: text })}
            />
            <CustomInput
              label="Barcode"
              value={newMedicine.barcode}
              onChangeText={(text) => setNewMedicine({ ...newMedicine, barcode: text })}
            />
            <CustomButton onPress={handleAddMedicine}>Add Medicine</CustomButton>
          </Modal>
        </Portal>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setIsAddModalVisible(true)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  searchBar: {
    margin: 16,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statsCard: {
    flex: 1,
    margin: 4,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsLabel: {
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  reportCard: {
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '500',
  },
  reportCount: {
    marginTop: 4,
    opacity: 0.7,
  },
  reportIssue: {
    marginTop: 4,
    color: 'red',
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
});

export default AdminScreen;
