import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import CustomButton from '../components/CustomButton';
import LoadingScreen from '../components/LoadingScreen';
import { fetchMedicines } from '../store/slices/medicineSlice';
import { fetchDonations } from '../store/slices/donationSlice';

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { cabinet, loading: medicineLoading } = useSelector((state) => state.medicine);
  const { donations, loading: donationLoading } = useSelector((state) => state.donation);

  useEffect(() => {
    dispatch(fetchMedicines({ limit: 5 }));
    dispatch(fetchDonations({ limit: 5 }));
  }, [dispatch]);

  if (medicineLoading || donationLoading) {
    return <LoadingScreen />;
  }

  const expiringMedicines = cabinet.filter(
    (item) =>
      new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name}</Text>
          <Text style={styles.subtitle}>Welcome to MedBlock</Text>
        </View>

        <View style={styles.quickActions}>
          <Card style={[styles.actionCard, { backgroundColor: theme.colors.primary }]}>
            <Card.Content>
              <Ionicons name="scan" size={32} color="white" />
              <Text style={styles.actionText}>Scan Medicine</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.actionCard, { backgroundColor: theme.colors.accent }]}>
            <Card.Content>
              <Ionicons name="medical" size={32} color="white" />
              <Text style={styles.actionText}>My Cabinet</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.actionCard, { backgroundColor: theme.colors.success }]}>
            <Card.Content>
              <Ionicons name="gift" size={32} color="white" />
              <Text style={styles.actionText}>Donate</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expiring Soon</Text>
            <CustomButton
              mode="text"
              onPress={() => navigation.navigate('Cabinet')}
            >
              View All
            </CustomButton>
          </View>

          {expiringMedicines.length > 0 ? (
            expiringMedicines.map((item) => (
              <Card key={item._id} style={styles.medicineCard}>
                <Card.Content>
                  <Text style={styles.medicineName}>{item.medicine.name}</Text>
                  <Text style={styles.expiryDate}>
                    Expires: {new Date(item.expiryDate).toLocaleDateString()}
                  </Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyText}>No medicines expiring soon</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Donations</Text>
            <CustomButton
              mode="text"
              onPress={() => navigation.navigate('Donations')}
            >
              View All
            </CustomButton>
          </View>

          {donations.length > 0 ? (
            donations.map((donation) => (
              <Card key={donation._id} style={styles.donationCard}>
                <Card.Content>
                  <Text style={styles.donationId}>
                    Donation #{donation._id.slice(-6)}
                  </Text>
                  <Text style={styles.donationStatus}>
                    Status: {donation.status}
                  </Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent donations</Text>
          )}
        </View>
      </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionCard: {
    flex: 1,
    margin: 4,
    padding: 8,
  },
  actionText: {
    color: 'white',
    marginTop: 8,
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  medicineCard: {
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '500',
  },
  expiryDate: {
    marginTop: 4,
    opacity: 0.7,
  },
  donationCard: {
    marginBottom: 8,
  },
  donationId: {
    fontSize: 16,
    fontWeight: '500',
  },
  donationStatus: {
    marginTop: 4,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    marginVertical: 16,
  },
});

export default HomeScreen;
