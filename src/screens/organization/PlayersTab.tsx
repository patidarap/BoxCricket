import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { Avatar } from '../../components/common/Avatar';
import { FAB } from '../../components/buttons/FAB';
import { BottomSheet } from '../../components/modals/BottomSheet';
import { Input } from '../../components/forms/Input';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { RootState } from '../../store/store';
import { organizationService } from '../../api/organizationService';
import { showSuccessMessage, showDangerMessage } from '../../utils/flashMessage';

export const PlayersTab = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  
  const { theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentOrganization = useSelector(
    (state: RootState) => state.organization.currentOrganization,
  );

  const isAdmin = currentOrganization?.createdBy === user?.id;

  useEffect(() => {
    if (currentOrganization) {
      fetchMembers();
    }
  }, [currentOrganization]);

  const fetchMembers = async () => {
    if (!currentOrganization) return;
    
    try {
      const response = await organizationService.getMembers(
        currentOrganization._id || currentOrganization.id
      );
      console.log('Members fetched:', response);
      
      if (response.success && response.data) {
        setMembers(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching members:', error);
    }
  };

  const handleAddPlayer = async () => {
    if (!playerName.trim() || !playerEmail.trim() || !currentOrganization) return;

    try {
      setLoading(true);
      const response = await organizationService.addMembers(
        currentOrganization._id || currentOrganization.id,
        [{ name: playerName.trim(), email: playerEmail.trim() }]
      );
      
      console.log('Member added:', response);
      
      if (response.success) {
        showSuccessMessage(response.message || 'Player added successfully');
        setPlayerName('');
        setPlayerEmail('');
        setShowAddModal(false);
        fetchMembers();
      }
    } catch (error: any) {
      console.error('Error adding player:', error);
      showDangerMessage(error.message || 'Failed to add player');
    } finally {
      setLoading(false);
    }
  };

  const renderPlayer = ({ item }: any) => (
    <View
      style={[
        styles.playerCard,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.md,
        },
      ]}
    >
      <Avatar name={item.userId?.name || 'Player'} uri={item.userId?.avatar} size="md" />
      <View style={styles.playerInfo}>
        <Text variant="bodyMedium">{item.userId?.name || 'Unknown'}</Text>
        <Text variant="caption" color={theme.colors.textSecondary}>
          {item.userId?.email || 'No email'}
        </Text>
      </View>
      {item.role === 'admin' && (
        <View
          style={[
            styles.adminBadge,
            {
              backgroundColor: theme.colors.primary + '20',
              borderRadius: theme.borderRadius.sm,
            },
          ]}
        >
          <Text
            variant="caption"
            style={{ color: theme.colors.primary, fontWeight: '600' }}
          >
            ADMIN
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item, index) => item._id || item.id || index.toString()}
          renderItem={renderPlayer}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48 }}>👥</Text>
          <Spacer size="md" />
          <Text variant="body" color={theme.colors.textSecondary} center>
            No players yet
          </Text>
          {isAdmin && (
            <Text variant="bodySmall" color={theme.colors.textSecondary} center>
              Add players to get started
            </Text>
          )}
        </View>
      )}

      {isAdmin && (
        <View style={styles.fabContainer}>
          <FAB onPress={() => setShowAddModal(true)} />
        </View>
      )}

      <BottomSheet
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Player"
      >
        <View>
          <Input
            placeholder="Player Name"
            value={playerName}
            onChangeText={setPlayerName}
            autoFocus
          />
          <Input
            placeholder="Email Address"
            value={playerEmail}
            onChangeText={setPlayerEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Spacer size="md" />
          <View style={styles.modalButtons}>
            <PrimaryButton
              title="Cancel"
              onPress={() => setShowAddModal(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <Spacer size="md" horizontal />
            <PrimaryButton
              title="Add"
              onPress={handleAddPlayer}
              disabled={!playerName.trim() || !playerEmail.trim() || loading}
              loading={loading}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
