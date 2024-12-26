import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, Chip, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { DONATION_STATUS } from '../config';

const getStatusColor = (status, theme) => {
  switch (status) {
    case DONATION_STATUS.PENDING:
      return theme.colors.warning;
    case DONATION_STATUS.ACCEPTED:
      return theme.colors.info;
    case DONATION_STATUS.COLLECTED:
      return theme.colors.success;
    case DONATION_STATUS.COMPLETED:
      return theme.colors.success;
    case DONATION_STATUS.CANCELLED:
      return theme.colors.error;
    default:
      return theme.colors.text;
  }
};

const DonationCard = ({
  donation,
  onPress,
  onAccept,
  onCancel,
  isNGO = false,
}) => {
  const theme = useTheme();
  const statusColor = getStatusColor(donation.status, theme);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Title>Donation #{donation._id.slice(-6)}</Title>
          <Chip
            mode="outlined"
            style={[styles.statusChip, { borderColor: statusColor }]}
            textStyle={{ color: statusColor }}
          >
            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
          </Chip>
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="person-outline" size={20} color={theme.colors.text} />
          <Paragraph style={styles.info}>
            {isNGO ? `Donor: ${donation.donor.name}` : `NGO: ${donation.ngo.name}`}
          </Paragraph>
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="medical-outline" size={20} color={theme.colors.text} />
          <Paragraph style={styles.info}>
            {donation.medicines.length} Medicine(s)
          </Paragraph>
        </View>

        {donation.pickupDate && (
          <View style={styles.infoContainer}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
            <Paragraph style={styles.info}>
              Pickup: {new Date(donation.pickupDate).toLocaleDateString()}
            </Paragraph>
          </View>
        )}

        {donation.status === DONATION_STATUS.PENDING && (
          <View style={styles.actionContainer}>
            {isNGO ? (
              <Button
                mode="contained"
                onPress={onAccept}
                style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
              >
                Accept
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={onCancel}
                style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
              >
                Cancel
              </Button>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusChip: {
    height: 30,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  info: {
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  actionButton: {
    marginLeft: 8,
  },
});

export default DonationCard;
