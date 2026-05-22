import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '../../components/common/Container';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { Input } from '../../components/forms/Input';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { validateEmail } from '../../utils/validators';
import { authService } from '../../api';
import {
  showSuccessMessage,
  showDangerMessage,
} from '../../utils/flashMessage';

export const LoginScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('Test@gmail.com');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.sendOTP({
        name: '',
        email: email.trim(),
        mobile: '',
      });
      console.log('OTP sent successfully:', response);

      if (response.success) {
        if (response?.data?.isRegistered === false) {
          setLoading(false);
          showDangerMessage(
            response.message || 'Please complete your signup first',
          );
          setError(response.message || 'Please complete your signup first');
          return;
        }

        showSuccessMessage('OTP sent to your email');
        setLoading(false);
        navigation.navigate('OTPVerification', {
          email: email.trim(),
          name: '',
          phone: '',
          isSignup: false,
        });
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Send OTP error:', error);
      const errorMessage =
        error.message || 'Failed to send OTP. Please try again.';
      showDangerMessage(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.content}>
        <Spacer size="xxl" />
        <Text variant="h1" style={{ fontSize: 48 }}>
          🏏
        </Text>
        <Spacer size="xl" />
        <Text variant="h2">Login</Text>
        <Spacer size="sm" />
        <Text variant="body" color={theme.colors.textSecondary}>
          Enter your email to continue
        </Text>
        <Spacer size="xxl" />

        <Input
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setError('');
          }}
          error={error}
        />

        <Spacer size="xl" />

        <PrimaryButton
          title="Send OTP"
          onPress={handleLogin}
          loading={loading}
          disabled={!email.trim()}
        />

        <Spacer size="lg" />

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text variant="body" color={theme.colors.textSecondary} center>
            Don't have an account?{' '}
            <Text variant="body" color={theme.colors.primary}>
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>

        <Spacer size="lg" />

        <Text variant="caption" color={theme.colors.textSecondary} center>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
});
