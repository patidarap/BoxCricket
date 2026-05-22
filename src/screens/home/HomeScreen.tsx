import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '../../components/common/Container';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { Avatar } from '../../components/common/Avatar';
import { OrganizationCard } from '../../components/cards/OrganizationCard';
import { FAB } from '../../components/buttons/FAB';
import { BottomSheet } from '../../components/modals/BottomSheet';
import { Input } from '../../components/forms/Input';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { RootState } from '../../store/store';
import { setCurrentOrganization } from '../../store/slices/organizationSlice';
import { generateId } from '../../utils/helpers';
import { organizationService } from '../../api/organizationService';
import {
  showSuccessMessage,
  showDangerMessage,
} from '../../utils/flashMessage';

export const HomeScreen = ({ navigation }: any) => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await organizationService.getAll();
      console.warn('organizationService_getAll_response', response);

      if (response.success && response.data?.organizations) {
        setOrganizations(response?.data?.organizations);
      }
    } catch (error: any) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrganizations();
    setRefreshing(false);
  };

  const handleCreateOrganization = async () => {
    if (!orgName.trim()) return;

    try {
      setLoading(true);
      const response = await organizationService.create(orgName.trim());
      console.log('Organization created:', response);

      if (response.success) {
        showSuccessMessage('Organization created successfully');
        setOrgName('');
        setShowCreateModal(false);
        fetchOrganizations();
      }
    } catch (error: any) {
      console.error('Error creating organization:', error);
      showDangerMessage(error.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationPress = (org: any) => {
    dispatch(setCurrentOrganization(org));
    navigation.navigate('OrganizationDetails', { organizationId: org.id });
  };

  const isUserAdmin = (org: any) => {
    return org.createdBy === user?.id;
  };

  return (
    <Container padding={false}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="bodySmall" color={theme.colors.textSecondary}>
              Welcome Back
            </Text>
            <Text variant="h4">{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar name={user?.name || 'User'} uri={user?.avatar} size="md" />
          </TouchableOpacity>
        </View>

        {/* Organizations List */}
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text variant="h5">Organizations</Text>
          <Spacer size="md" />

          {organizations.length > 0 ? (
            organizations.map(org => (
              <OrganizationCard
                key={org.id}
                organization={org}
                isAdmin={isUserAdmin(org)}
                onPress={() => handleOrganizationPress(org)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 20 }}>🏏</Text>
              <Spacer size="md" />
              <Text variant="body" color={theme.colors.textSecondary} center>
                No organizations yet
              </Text>
              <Text
                variant="bodySmall"
                color={theme.colors.textSecondary}
                center
              >
                Create your first organization to get started
              </Text>
            </View>
          )}

          <Spacer size="xxl" />
          <Spacer size="xxl" />
        </ScrollView>

        {/* FAB */}
        <View style={styles.fabContainer}>
          <FAB onPress={() => setShowCreateModal(true)} />
        </View>

        {/* Create Organization Modal */}
        <BottomSheet
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Organization"
        >
          <View>
            <Input
              placeholder="Organization Name"
              value={orgName}
              onChangeText={setOrgName}
              autoFocus
            />
            <Spacer size="md" />
            <View style={styles.modalButtons}>
              <PrimaryButton
                title="Cancel"
                onPress={() => setShowCreateModal(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Spacer size="md" horizontal />
              <PrimaryButton
                title="Create"
                onPress={handleCreateOrganization}
                disabled={!orgName.trim() || loading}
                loading={loading}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </BottomSheet>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    paddingBottom: 20,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
});
