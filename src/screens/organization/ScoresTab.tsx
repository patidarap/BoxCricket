import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { FAB } from '../../components/buttons/FAB';
import { BottomSheet } from '../../components/modals/BottomSheet';
import { Input } from '../../components/forms/Input';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { RootState } from '../../store/store';
import { addScore } from '../../store/slices/organizationSlice';
import { generateId } from '../../utils/helpers';
import { organizationService } from '../../api/organizationService';
import { Dropdown } from '../../components/forms/Dropdown';
import {
  showSuccessMessage,
  showDangerMessage,
} from '../../utils/flashMessage';

export const ScoresTab = ({ navigation }: any) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [matchTitle, setMatchTitle] = useState('');
  const [totalOvers, setTotalOvers] = useState('');
  const [teamAName, setTeamAName] = useState('');
  const [teamACaptain, setTeamACaptain] = useState('');
  const [teamAPlayers, setTeamAPlayers] = useState<string[]>([]);
  const [teamARuns, setTeamARuns] = useState('');
  const [teamBName, setTeamBName] = useState('');
  const [teamBCaptain, setTeamBCaptain] = useState('');
  const [teamBPlayers, setTeamBPlayers] = useState<string[]>([]);
  const [teamBRuns, setTeamBRuns] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentOrganization = useSelector(
    (state: RootState) => state.organization.currentOrganization,
  );
  const scores = useSelector((state: RootState) => state.organization.scores);

  const isAdmin = currentOrganization?.createdBy === user?.id;
  const orgScores = scores.filter(
    s => s.organizationId === currentOrganization?.id,
  );

  useEffect(() => {
    if (currentOrganization && showAddModal) {
      fetchMembers();
    }
  }, [currentOrganization, showAddModal]);

  useEffect(() => {
    if (currentOrganization) {
      fetchMatches();
    }
  }, [currentOrganization]);

  const fetchMembers = async () => {
    if (!currentOrganization) return;

    try {
      const response = await organizationService.getMembers(
        currentOrganization._id || currentOrganization.id,
      );

      if (response.success && response.data) {
        setMembers(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchMatches = async () => {
    if (!currentOrganization) return;

    try {
      const response = await organizationService.getMatches(
        currentOrganization._id || currentOrganization.id,
      );

      console.warn('response_getMatches', response);

      if (response.success && response.data && response.data.matches) {
        setMatches(response.data.matches);
      }
    } catch (error: any) {
      console.error('Error fetching matches:', error);
    }
  };

  const playerOptions = members.map(member => ({
    id: member.userId?._id || member.userId?.id || member._id,
    name: member.userId?.name || 'Unknown',
    email: member.userId?.email || '',
  }));

  const availableTeamAPlayers = playerOptions.filter(
    player => player.id !== teamACaptain,
  );

  const availableTeamBCaptains = playerOptions.filter(
    player => player.id !== teamACaptain && !teamAPlayers.includes(player.id),
  );

  const availableTeamBPlayers = playerOptions.filter(
    player =>
      player.id !== teamBCaptain &&
      player.id !== teamACaptain &&
      !teamAPlayers.includes(player.id),
  );

  const handleAddScore = async () => {
    if (
      !matchTitle.trim() ||
      !teamACaptain ||
      !teamBCaptain ||
      !currentOrganization
    )
      return;

    try {
      setLoading(true);

      const teamACaptainName =
        members.find(
          m => (m.userId?._id || m.userId?.id || m._id) === teamACaptain,
        )?.userId?.name || 'Team A';

      const teamBCaptainName =
        members.find(
          m => (m.userId?._id || m.userId?.id || m._id) === teamBCaptain,
        )?.userId?.name || 'Team B';

      const matchData = {
        organizationId: currentOrganization._id || currentOrganization.id,
        matchNumber: matchTitle.trim(),
        team1Name: teamAName.trim() || teamACaptainName,
        team2Name: teamBName.trim() || teamBCaptainName,
        team1Captain: teamACaptain,
        team1Players: teamAPlayers,
        team2Captain: teamBCaptain,
        team2Players: teamBPlayers,
        totalOvers: parseFloat(totalOvers) || 0,
        team1Score: parseInt(teamARuns) || 0,
        team2Score: parseInt(teamBRuns) || 0,
      };

      console.warn('matchData', matchData);

      const response = await organizationService.createMatch(matchData);

      if (response.success) {
        showSuccessMessage(response.message || 'Match created successfully');
        fetchMatches();
        resetForm();
        setShowAddModal(false);
      }
    } catch (error: any) {
      console.error('Error creating match:', error);
      showDangerMessage(error.message || 'Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMatchTitle('');
    setTotalOvers('');
    setTeamAName('');
    setTeamACaptain('');
    setTeamAPlayers([]);
    setTeamARuns('');
    setTeamBName('');
    setTeamBCaptain('');
    setTeamBPlayers([]);
    setTeamBRuns('');
  };

  const renderScore = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.scoreCard,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.md,
        },
      ]}
      onPress={() => navigation.navigate('MatchDetails', { match: item })}
    >
      <Text variant="bodyMedium">{item.matchNumber}</Text>
      <Spacer size="md" />
      <View style={styles.scoreRow}>
        <View
          style={[
            styles.teamScore,
            item.result === 'team1' && styles.winnerTeam,
          ]}
        >
          <Text variant="caption" color={theme.colors.textSecondary}>
            {item.team1Name} (C)
          </Text>
          <Text
            variant="h5"
            color={
              item.result === 'team1'
                ? theme.colors.success
                : theme.colors.primary
            }
          >
            {item.team1Score}
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            ({item.totalOvers} overs)
          </Text>
          {item.result === 'team1' && (
            <Text variant="caption" color={theme.colors.success}>
              Won
            </Text>
          )}
        </View>
        <Text variant="h5" color={theme.colors.textSecondary}>
          vs
        </Text>
        <View
          style={[
            styles.teamScore,
            item.result === 'team2' && styles.winnerTeam,
          ]}
        >
          <Text variant="caption" color={theme.colors.textSecondary}>
            {item.team2Name} (C)
          </Text>
          <Text
            variant="h5"
            color={
              item.result === 'team2'
                ? theme.colors.success
                : theme.colors.primary
            }
          >
            {item.team2Score}
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            ({item.totalOvers} overs)
          </Text>
          {item.result === 'team2' && (
            <Text variant="caption" color={theme.colors.success}>
              Won
            </Text>
          )}
        </View>
      </View>
      {item.result && (
        <>
          <Spacer size="sm" />
          <Text
            variant="bodySmall"
            color={theme.colors.success}
            style={{ textAlign: 'center', fontWeight: '600' }}
          >
            {item.result + ' 🎉'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {matches.length > 0 ? (
        <FlatList
          data={matches}
          keyExtractor={item => item._id || item.id}
          renderItem={renderScore}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 48 }}>📊</Text>
          <Spacer size="md" />
          <Text variant="body" color={theme.colors.textSecondary} center>
            No scores yet
          </Text>
          {isAdmin && (
            <Text variant="bodySmall" color={theme.colors.textSecondary} center>
              Add match scores to track performance
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
        title="Add Score"
      >
        <View>
          <Input
            placeholder="Match Title (e.g. Match 1, Match 2)"
            value={matchTitle}
            onChangeText={setMatchTitle}
          />
          <Input
            placeholder="Total Overs"
            value={totalOvers}
            onChangeText={setTotalOvers}
            keyboardType="numeric"
          />
          <Spacer size="md" />

          <Dropdown
            label="Team A Captain"
            placeholder="Select Team A Captain"
            options={playerOptions}
            value={teamACaptain}
            onSelect={setTeamACaptain}
          />
          <Input
            placeholder="Team A Name (Optional)"
            value={teamAName}
            onChangeText={setTeamAName}
          />
          <Spacer size="sm" />

          <Dropdown
            label="Select Team Player"
            placeholder="Select Team Players"
            options={availableTeamAPlayers}
            value={teamAPlayers[0] || ''}
            onSelect={playerId => {
              if (!teamAPlayers.includes(playerId)) {
                setTeamAPlayers([...teamAPlayers, playerId]);
              }
            }}
            multiple
          />
          {teamAPlayers.length > 0 && (
            <View style={styles.selectedPlayersContainer}>
              {teamAPlayers.map(playerId => {
                const player = playerOptions.find(p => p.id === playerId);
                return (
                  <View
                    key={playerId}
                    style={[
                      styles.playerChip,
                      {
                        backgroundColor: theme.colors.primary + '20',
                        borderRadius: theme.borderRadius.sm,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{ color: theme.colors.primary }}
                    >
                      {player?.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTeamAPlayers(
                          teamAPlayers.filter(id => id !== playerId),
                        )
                      }
                    >
                      <Text
                        style={{
                          color: theme.colors.primary,
                          marginLeft: 8,
                          fontWeight: 'bold',
                        }}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          <Spacer size="sm" />

          <Input
            placeholder="Score "
            value={teamARuns}
            onChangeText={setTeamARuns}
            keyboardType="numeric"
          />
          <Spacer size="md" />

          <Dropdown
            label="Team B Captain"
            placeholder="Select Team B Captain"
            options={availableTeamBCaptains}
            value={teamBCaptain}
            onSelect={setTeamBCaptain}
          />
          <Input
            placeholder="Team B Name (Optional)"
            value={teamBName}
            onChangeText={setTeamBName}
          />
          <Spacer size="sm" />

          <Dropdown
            label="Select Team Player"
            placeholder="Select Team Players"
            options={availableTeamBPlayers}
            value={teamBPlayers[0] || ''}
            onSelect={playerId => {
              if (!teamBPlayers.includes(playerId)) {
                setTeamBPlayers([...teamBPlayers, playerId]);
              }
            }}
            multiple
          />
          {teamBPlayers.length > 0 && (
            <View style={styles.selectedPlayersContainer}>
              {teamBPlayers.map(playerId => {
                const player = playerOptions.find(p => p.id === playerId);
                return (
                  <View
                    key={playerId}
                    style={[
                      styles.playerChip,
                      {
                        backgroundColor: theme.colors.primary + '20',
                        borderRadius: theme.borderRadius.sm,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{ color: theme.colors.primary }}
                    >
                      {player?.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTeamBPlayers(
                          teamBPlayers.filter(id => id !== playerId),
                        )
                      }
                    >
                      <Text
                        style={{
                          color: theme.colors.primary,
                          marginLeft: 8,
                          fontWeight: 'bold',
                        }}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
          <Spacer size="sm" />

          <Input
            placeholder="Score "
            value={teamBRuns}
            onChangeText={setTeamBRuns}
            keyboardType="numeric"
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
              onPress={handleAddScore}
              disabled={
                !matchTitle.trim() || !teamACaptain || !teamBCaptain || loading
              }
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
  scoreCard: {
    padding: 16,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  teamScore: {
    alignItems: 'center',
  },
  winnerTeam: {
    opacity: 1,
  },
  row: {
    flexDirection: 'row',
  },
  selectedPlayersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
