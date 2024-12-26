import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, useTheme, RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { register } from '../../store/slices/authSlice';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [errors, setErrors] = useState({});

  const theme = useTheme();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'ngo') {
      if (!organizationName.trim()) {
        newErrors.organizationName = 'Organization name is required';
      }
      if (!organizationId.trim()) {
        newErrors.organizationId = 'Organization ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
      ...(role === 'ngo' && {
        organizationName,
        organizationId
      })
    };

    const result = await dispatch(register(userData));
    if (!result.error) {
      navigation.replace('MainApp');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join MedBlock today</Text>
          </View>

          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          <CustomInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            error={!!errors.name}
            helperText={errors.name}
            left={<CustomInput.Icon name="account" />}
          />

          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={!!errors.email}
            helperText={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            left={<CustomInput.Icon name="email" />}
          />

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Register as:</Text>
            <RadioButton.Group onValueChange={value => setRole(value)} value={role}>
              <View style={styles.radioOption}>
                <RadioButton value="user" />
                <Text>User</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="ngo" />
                <Text>NGO</Text>
              </View>
            </RadioButton.Group>
          </View>

          {role === 'ngo' && (
            <>
              <CustomInput
                label="Organization Name"
                value={organizationName}
                onChangeText={setOrganizationName}
                error={!!errors.organizationName}
                helperText={errors.organizationName}
                left={<CustomInput.Icon name="domain" />}
              />
              <CustomInput
                label="Organization ID/Registration Number"
                value={organizationId}
                onChangeText={setOrganizationId}
                error={!!errors.organizationId}
                helperText={errors.organizationId}
                left={<CustomInput.Icon name="identifier" />}
              />
            </>
          )}

          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={!!errors.password}
            helperText={errors.password}
            secureTextEntry={secureTextEntry}
            right={
              <CustomInput.Icon
                name={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            left={<CustomInput.Icon name="lock" />}
          />

          <CustomInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            secureTextEntry={confirmSecureTextEntry}
            right={
              <CustomInput.Icon
                name={confirmSecureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
              />
            }
            left={<CustomInput.Icon name="lock" />}
          />

          <CustomButton
            onPress={handleRegister}
            loading={loading}
            disabled={loading || !name || !email || !password || !confirmPassword}
            style={styles.registerButton}
          >
            Register
          </CustomButton>

          <View style={styles.footer}>
            <Text>Already have an account? </Text>
            <CustomButton
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              Login
            </CustomButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  roleContainer: {
    marginVertical: 16,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  registerButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  linkButton: {
    marginLeft: 4,
  },
});

export default RegisterScreen;
