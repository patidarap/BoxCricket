import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '../../components/common/Container';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { Input } from '../../components/forms/Input';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import {
  validateEmail,
  validateName,
  validatePhone,
} from '../../utils/validators';
import { authService } from '../../api';
import { showSuccessMessage, showDangerMessage } from '../../utils/flashMessage';

export const SignupScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const newErrors = { name: '', email: '', phone: '' };

    if (!validateName(name)) {
      newErrors.name = 'Please enter a valid name (min 2 characters)';
    }
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (newErrors.name || newErrors.email || newErrors.phone) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.sendOTP({
        name: name.trim(),
        email: email.trim(),
        mobile: phone.trim(),
      });
      console.log('OTP sent successfully:', response);
      
      if (response.success) {
        showSuccessMessage('OTP sent to your email');
        setLoading(false);
        navigation.navigate('OTPVerification', {
          email: email.trim(),
          name: name.trim(),
          phone: phone.trim(),
          isSignup: true,
        });
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Send OTP error:', error);
      const errorMessage = error.message || 'Failed to send OTP. Please try again.';
      showDangerMessage(errorMessage);
      setErrors({ ...newErrors, email: errorMessage });
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Spacer size="xl" />
        <Text variant="h1" style={{ fontSize: 48 }}>
          🏏
        </Text>
        <Spacer size="xl" />
        <Text variant="h2">Sign Up</Text>
        <Spacer size="sm" />
        <Text variant="body" color={theme.colors.textSecondary}>
          Create your account to get started
        </Text>
        <Spacer size="xxl" />

        <Input
          label="Full Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={text => {
            setName(text);
            setErrors({ ...errors, name: '' });
          }}
          error={errors.name}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setErrors({ ...errors, email: '' });
          }}
          error={errors.email}
        />

        <Input
          label="Phone Number"
          placeholder="Enter 10-digit phone number"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={text => {
            setPhone(text);
            setErrors({ ...errors, phone: '' });
          }}
          error={errors.phone}
          leftIcon={<Text variant="body">+91</Text>}
        />

        <Spacer size="xl" />

        <PrimaryButton
          title="Send OTP"
          onPress={handleSignup}
          loading={loading}
          disabled={!name.trim() || !email.trim() || !phone.trim()}
        />

        <Spacer size="lg" />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text variant="body" color={theme.colors.textSecondary} center>
            Already have an account?{' '}
            <Text variant="body" color={theme.colors.primary}>
              Login
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
});
