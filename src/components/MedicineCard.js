import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, Chip, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const MedicineCard = ({
  medicine,
  onPress,
  showExpiry = false,
  showQuantity = false,
}) => {
  const theme = useTheme();
  const isExpiringSoon = showExpiry && 
    new Date(medicine.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Title>{medicine.name}</Title>
          <Chip
            mode="outlined"
            style={[
              styles.categoryChip,
              { borderColor: theme.colors.primary },
            ]}
          >
            {medicine.category}
          </Chip>
        </View>

        <Paragraph style={styles.manufacturer}>
          {medicine.manufacturer}
        </Paragraph>

        {showExpiry && (
          <View style={styles.expiryContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={isExpiringSoon ? theme.colors.error : theme.colors.text}
            />
            <Paragraph
              style={[
                styles.expiry,
                isExpiringSoon && { color: theme.colors.error },
              ]}
            >
              Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
            </Paragraph>
          </View>
        )}

        {showQuantity && (
          <View style={styles.quantityContainer}>
            <Ionicons name="cube-outline" size={20} color={theme.colors.text} />
            <Paragraph style={styles.quantity}>
              Quantity: {medicine.quantity}
            </Paragraph>
          </View>
        )}

        {medicine.verified && (
          <View style={styles.verifiedContainer}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={theme.colors.success}
            />
            <Paragraph style={[styles.verified, { color: theme.colors.success }]}>
              Verified
            </Paragraph>
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
    marginBottom: 8,
  },
  categoryChip: {
    height: 30,
  },
  manufacturer: {
    marginBottom: 8,
    opacity: 0.7,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  expiry: {
    marginLeft: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantity: {
    marginLeft: 8,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  verified: {
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default MedicineCard;
