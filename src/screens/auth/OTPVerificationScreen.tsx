import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Container } from '../../components/common/Container';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { authService } from '../../api';
import { setUser } from '../../store/slices/authSlice';
import { apiClient } from '../../api/client';

export const OTPVerificationScreen = ({ navigation, route }: any) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { email, name, phone } = route.params;
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<any[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      console.log('OTP incomplete');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOTP({
        name: name,
        email: email,
        mobile: phone,
        otp: otpCode,
      });

      console.log('=== OTP Verification Success ===');
      console.log('Full Response:', JSON.stringify(response, null, 2));
      console.log('Token:', response.data?.token);
      console.log('User Data:', JSON.stringify(response.data?.user, null, 2));
      console.log('================================');

      if (response.data?.token && response.data?.user) {
        // Store token and user in Redux and AsyncStorage
        const userData = {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          mobile: response.data.user.mobile,
          role: response.data.user.role,
        };

        apiClient.setAuthToken(response?.data?.token);
        dispatch(
          setUser({
            user: userData,
            token: response.data.token,
          }),
        );
      }

      setLoading(false);
      navigation.replace('Main');
    } catch (error: any) {
      setLoading(false);
      console.error('=== OTP Verification Error ===');
      console.error('Error:', JSON.stringify(error, null, 2));
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      console.error('==============================');

      // Show error to user
      alert(error.message || 'Invalid OTP. Please try again.');
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

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
        <Text variant="h2">Verify OTP</Text>
        <Spacer size="sm" />
        <Text variant="body" color={theme.colors.textSecondary}>
          Enter the 6-digit code sent to {email}
        </Text>
        <Spacer size="xxl" />

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: digit
                    ? theme.colors.primary
                    : theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Spacer size="xl" />

        <PrimaryButton
          title="Verify & Continue"
          onPress={handleVerify}
          loading={loading}
          disabled={!isOtpComplete}
        />

        <Spacer size="lg" />

        <Text variant="bodySmall" color={theme.colors.textSecondary} center>
          Didn't receive code?{' '}
          <Text variant="bodySmall" color={theme.colors.primary}>
            Resend
          </Text>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
});
