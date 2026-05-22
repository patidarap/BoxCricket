import React, {useState} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Container} from '../../components/common/Container';
import {Text} from '../../components/common/Text';
import {Spacer} from '../../components/common/Spacer';
import {Input} from '../../components/forms/Input';
import {PrimaryButton} from '../../components/buttons/PrimaryButton';
import {Avatar} from '../../components/common/Avatar';
import {useTheme} from '../../hooks/useTheme';
import {setUser} from '../../store/slices/authSlice';
import {storage} from '../../utils/storage';
import {generateId} from '../../utils/helpers';

export const ProfileSetupScreen = ({navigation}: any) => {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!name.trim()) return;

    setLoading(true);
    
    const user = {
      id: generateId(),
      name: name.trim(),
      phone: '9876543210',
      email: email.trim() || undefined,
      totalMatches: 0,
      totalRuns: 0,
      totalWickets: 0,
      mvpCount: 0,
      createdAt: new Date().toISOString(),
    };

    await storage.setUser(user);
    dispatch(setUser(user));

    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1000);
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.content}>
        <Spacer size="xxl" />
        <Text variant="h2">Complete Your Profile</Text>
        <Spacer size="sm" />
        <Text variant="body" color={theme.colors.textSecondary}>
          Tell us a bit about yourself
        </Text>
        <Spacer size="xxl" />

        <View style={styles.avatarSection}>
          <Avatar name={name || 'User'} size="xl" />
          <Spacer size="md" />
          <TouchableOpacity>
            <Text variant="bodyMedium" color={theme.colors.primary}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        <Spacer size="xl" />

        <Input
          label="Full Name *"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Input
          label="Email (Optional)"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Spacer size="xl" />

        <PrimaryButton
          title="Complete Setup"
          onPress={handleComplete}
          loading={loading}
          disabled={!name.trim()}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
  },
});
