import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { login } from '../../store/slices/authSlice';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
  });

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    
    const result = await dispatch(login({ email, password }));
    if (!result.error) {
      navigation.replace('MainApp');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        // Handle Google login success
        // You'll need to implement the backend integration
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>MedBlock</Text>
          <Text style={styles.subtitle}>Medicine Verification & Expiry Tracker</Text>
        </View>

        {error && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}

        <CustomInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          left={<CustomInput.Icon name="email" />}
        />

        <CustomInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          right={
            <CustomInput.Icon
              name={secureTextEntry ? 'eye-off' : 'eye'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          left={<CustomInput.Icon name="lock" />}
        />

        <CustomButton
          onPress={handleLogin}
          loading={loading}
          disabled={loading || !email || !password}
        >
          Login
        </CustomButton>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <CustomButton
          mode="outlined"
          onPress={handleGoogleLogin}
          icon="google"
          disabled={!request}
        >
          Continue with Google
        </CustomButton>

        <View style={styles.footer}>
          <Text>Don't have an account? </Text>
          <CustomButton
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.linkButton}
          >
            Register
          </CustomButton>
        </View>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  orText: {
    marginHorizontal: 8,
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  linkButton: {
    marginLeft: 4,
  },
});

export default LoginScreen;
