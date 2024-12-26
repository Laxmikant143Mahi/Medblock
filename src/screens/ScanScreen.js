import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, Portal, Modal, useTheme } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import CustomButton from '../components/CustomButton';
import MedicineCard from '../components/MedicineCard';
import LoadingScreen from '../components/LoadingScreen';
import { scanMedicine } from '../store/slices/medicineSlice';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { scannedMedicine, loading, error } = useSelector((state) => state.medicine);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      await dispatch(scanMedicine(data));
      setShowModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan medicine. Please try again.');
    }
  };

  const handleAddToCabinet = () => {
    navigation.navigate('Cabinet', { medicine: scannedMedicine });
    setShowModal(false);
    setScanned(false);
  };

  const handleReport = () => {
    navigation.navigate('ReportMedicine', { medicine: scannedMedicine });
    setShowModal(false);
    setScanned(false);
  };

  if (hasPermission === null) {
    return <LoadingScreen message="Requesting camera permission..." />;
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="camera-off" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>No access to camera</Text>
          <Text style={styles.errorSubtext}>
            Please enable camera permissions in your device settings to use the scanner.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
        <Text style={styles.instructions}>
          Align the barcode within the frame to scan
        </Text>
        {scanned && (
          <CustomButton
            mode="contained"
            onPress={() => setScanned(false)}
            style={styles.rescanButton}
          >
            Tap to Scan Again
          </CustomButton>
        )}
      </View>

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => {
            setShowModal(false);
            setScanned(false);
          }}
          contentContainerStyle={styles.modalContent}
        >
          {loading ? (
            <LoadingScreen message="Verifying medicine..." />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={48} color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
              <CustomButton
                mode="contained"
                onPress={() => {
                  setShowModal(false);
                  setScanned(false);
                }}
              >
                Try Again
              </CustomButton>
            </View>
          ) : (
            scannedMedicine && (
              <View>
                <Text style={styles.modalTitle}>Medicine Details</Text>
                <MedicineCard medicine={scannedMedicine} />
                <View style={styles.actionButtons}>
                  <CustomButton
                    mode="contained"
                    onPress={handleAddToCabinet}
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                  >
                    Add to Cabinet
                  </CustomButton>
                  <CustomButton
                    mode="outlined"
                    onPress={handleReport}
                    style={styles.actionButton}
                  >
                    Report Issue
                  </CustomButton>
                </View>
              </View>
            )
          )}
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 100,
  },
  rescanButton: {
    position: 'absolute',
    bottom: 50,
    width: '80%',
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
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 16,
  },
  errorSubtext: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 8,
  },
  actionButtons: {
    marginTop: 16,
  },
  actionButton: {
    marginVertical: 8,
  },
});

export default ScanScreen;
