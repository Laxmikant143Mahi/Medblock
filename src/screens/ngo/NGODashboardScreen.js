import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import DonationCard from '../../components/DonationCard';
import LoadingScreen from '../../components/LoadingScreen';
import { fetchDonations, updateDonationStatus } from '../../store/slices/donationSlice';
import { DONATION_STATUS } from '../../config';

const NGODashboardScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const dispatch = useDispatch();

  const { donations, loading } = useSelector((state) => state.donation);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDonations({}));
  }, [dispatch]);

  const handleAcceptDonation = async (donationId) => {
    await dispatch(updateDonationStatus({
      donationId,
      status: DONATION_STATUS.ACCEPTED,
      notes: 'Donation accepted by NGO'
    }));
  };

  const handleCollectDonation = async (donationId) => {
    await dispatch(updateDonationStatus({
      donationId,
      status: DONATION_STATUS.COLLECTED,
      notes: 'Medicines collected by NGO'
    }));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const pendingDonations = donations.filter(d => d.status === DONATION_STATUS.PENDING);
  const acceptedDonations = donations.filter(d => d.status === DONATION_STATUS.ACCEPTED);
  const completedDonations = donations.filter(d => 
    [DONATION_STATUS.COLLECTED, DONATION_STATUS.COMPLETED].includes(d.status)
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{user?.organizationName}</Text>
          <Text style={styles.subtitle}>NGO Dashboard</Text>
        </View>

        <Searchbar
          placeholder="Search donations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsNumber}>{pendingDonations.length}</Text>
              <Text style={styles.statsLabel}>Pending</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsNumber}>{acceptedDonations.length}</Text>
              <Text style={styles.statsLabel}>Accepted</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsNumber}>{completedDonations.length}</Text>
              <Text style={styles.statsLabel}>Completed</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Donations</Text>
          {pendingDonations.length > 0 ? (
            pendingDonations.map(donation => (
              <DonationCard
                key={donation._id}
                donation={donation}
                isNGO={true}
                onAccept={() => handleAcceptDonation(donation._id)}
                onPress={() => navigation.navigate('DonationDetails', { donationId: donation._id })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No pending donations</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accepted Donations</Text>
          {acceptedDonations.length > 0 ? (
            acceptedDonations.map(donation => (
              <DonationCard
                key={donation._id}
                donation={donation}
                isNGO={true}
                onCollect={() => handleCollectDonation(donation._id)}
                onPress={() => navigation.navigate('DonationDetails', { donationId: donation._id })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No accepted donations</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collection History</Text>
          {completedDonations.slice(0, 5).map(donation => (
            <DonationCard
              key={donation._id}
              donation={donation}
              isNGO={true}
              onPress={() => navigation.navigate('DonationDetails', { donationId: donation._id })}
            />
          ))}
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
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    marginVertical: 16,
  },
});

export default NGODashboardScreen;
