import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '../../components/common/Container';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { Avatar } from '../../components/common/Avatar';
import { StatCard } from '../../components/cards/StatCard';
import { useTheme } from '../../hooks/useTheme';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { storage } from '../../utils/storage';
import { formatPhone } from '../../utils/formatters';
import { authService } from '../../api/authService';

export const ProfileScreen = ({ navigation }: any) => {
  const { theme, mode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const scores =
    useSelector((state: RootState) => state.organization.scores) || [];
  const payments =
    useSelector((state: RootState) => state.organization.payments) || [];
  const organizations =
    useSelector((state: RootState) => state.organization.organizations) || [];
  const members =
    useSelector((state: RootState) => state.organization.members) || [];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authService.getProfile();
      console.log('Profile response:', response);
      if (response.success && response.data) {
        setProfileData(response.data);
      }
      console.warn('getProfile response:', response);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate match statistics
  const totalMatches = profileData?.stats?.matchesPlayed || 0;
  const wonMatches = profileData?.stats?.wins || 0;
  const lostMatches = profileData?.stats?.losses || 0;

  // Calculate payment statistics
  const totalPaid = profileData?.stats?.donePayments || 0;
  const totalPending = profileData?.stats?.pendingPayments || 0;

  const handleLogout = async () => {
    await storage.clear();
    dispatch(logout());
    navigation.replace('Auth');
  };

  return (
    <Container padding={false}>
      <ScrollView>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: theme.colors.primary, paddingTop: 60 },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={{ fontSize: 24, color: '#FFFFFF' }}>←</Text>
          </TouchableOpacity>
          <Spacer size="md" />
          <Avatar name={user?.name || ''} uri={user?.avatar} size="lg" />
          <Spacer size="md" />
          <Text variant="h4" style={{ color: '#FFFFFF' }}>
            {user?.name}
          </Text>
          <Text variant="bodySmall" style={{ color: '#FFFFFF', opacity: 0.9 }}>
            {user?.phone ? formatPhone(user.phone) : ''}
          </Text>
          {user?.email && (
            <Text
              variant="bodySmall"
              style={{ color: '#FFFFFF', opacity: 0.9 }}
            >
              {user.email}
            </Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              label="Total Matches"
              value={totalMatches}
              icon={<Text style={{ fontSize: 20 }}>🏏</Text>}
            />
            <Spacer size="md" horizontal />
            <StatCard
              label="Won Matches"
              value={wonMatches}
              icon={<Text style={{ fontSize: 20 }}>🏆</Text>}
              color={theme.colors.success}
            />
          </View>
          <Spacer size="md" />
          <View style={styles.statsRow}>
            <StatCard
              label="Lost Matches"
              value={lostMatches}
              icon={<Text style={{ fontSize: 20 }}>❌</Text>}
              color={theme.colors.error}
            />
            <Spacer size="md" horizontal />
            <StatCard
              label="Organizations"
              value={profileData?.stats?.paidPayments || 0}
              icon={<Text style={{ fontSize: 20 }}>🏢</Text>}
              color={theme.colors.secondary}
            />
          </View>
          <Spacer size="md" />
          <View style={styles.statsRow}>
            <StatCard
              label="Total Paid"
              value={`₹${totalPaid}`}
              icon={<Text style={{ fontSize: 20 }}>💰</Text>}
              color={theme.colors.success}
            />
            <Spacer size="md" horizontal />
            <StatCard
              label="Pending Amount"
              value={`₹${totalPending}`}
              icon={<Text style={{ fontSize: 20 }}>⏳</Text>}
              color={theme.colors.warning}
            />
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem icon="👤" label="Edit Profile" onPress={() => {}} />
          <MenuItem
            icon="🌙"
            label="Dark Mode"
            rightComponent={
              <Switch
                value={mode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <MenuItem
            icon="🔔"
            label="Notifications"
            onPress={() => navigation.navigate('Notifications')}
          />
          <MenuItem
            icon="📜"
            label="Match History"
            onPress={() => navigation.navigate('Matches')}
          />
          <MenuItem icon="💳" label="Payment History" onPress={() => {}} />
          <MenuItem icon="ℹ️" label="About" onPress={() => {}} />
          <MenuItem icon="🚪" label="Logout" onPress={handleLogout} danger />
        </View>

        <Spacer size="xl" />
      </ScrollView>
    </Container>
  );
};

const MenuItem = ({ icon, label, onPress, rightComponent, danger }: any) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuItemLeft}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        <Text
          variant="bodyMedium"
          color={danger ? theme.colors.error : theme.colors.text}
        >
          {label}
        </Text>
      </View>
      {rightComponent || (
        <Text style={{ fontSize: 20, color: theme.colors.textSecondary }}>
          →
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 32,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  statsContainer: {
    padding: 16,
    marginTop: -24,
  },
  statsRow: {
    flexDirection: 'row',
  },
  menu: {
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
