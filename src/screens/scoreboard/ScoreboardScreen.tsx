import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import {Container} from '../../components/common/Container';
import {Text} from '../../components/common/Text';
import {Spacer} from '../../components/common/Spacer';
import {ScreenHeader} from '../../components/headers/ScreenHeader';
import {PrimaryButton} from '../../components/buttons/PrimaryButton';
import {useTheme} from '../../hooks/useTheme';
import {useMatchStore} from '../../store';

export const ScoreboardScreen = ({navigation, route}: any) => {
  const {theme} = useTheme();
  const {matchId} = route.params;
  const matches = useMatchStore(state => state.matches);
  const match = matches.find(m => m.id === matchId);

  const [teamA, setTeamA] = useState({runs: 0, wickets: 0, overs: 0, balls: 0});
  const [teamB, setTeamB] = useState({runs: 0, wickets: 0, overs: 0, balls: 0});
  const [currentInnings, setCurrentInnings] = useState<'teamA' | 'teamB'>('teamA');

  if (!match) {
    return (
      <Container center>
        <Text>Match not found</Text>
      </Container>
    );
  }

  const currentTeam = currentInnings === 'teamA' ? teamA : teamB;
  const setCurrentTeam = currentInnings === 'teamA' ? setTeamA : setTeamB;

  const addRuns = (runs: number) => {
    setCurrentTeam(prev => ({
      ...prev,
      runs: prev.runs + runs,
      balls: prev.balls + 1,
      overs: Math.floor((prev.balls + 1) / 6),
    }));
  };

  const addWicket = () => {
    setCurrentTeam(prev => ({
      ...prev,
      wickets: prev.wickets + 1,
      balls: prev.balls + 1,
      overs: Math.floor((prev.balls + 1) / 6),
    }));
  };

  const switchInnings = () => {
    setCurrentInnings(currentInnings === 'teamA' ? 'teamB' : 'teamA');
  };

  return (
    <Container padding={false}>
      <ScreenHeader
        title="Scoreboard"
        leftIcon={<Text style={{fontSize: 24}}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h5" center>
          {match.title}
        </Text>
        <Spacer size="xl" />

        {/* Team A Score */}
        <View
          style={[
            styles.scoreCard,
            {
              backgroundColor:
                currentInnings === 'teamA'
                  ? theme.colors.primary + '20'
                  : theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              borderWidth: 2,
              borderColor:
                currentInnings === 'teamA'
                  ? theme.colors.primary
                  : theme.colors.border,
            },
          ]}>
          <Text variant="h5">Team A</Text>
          <Spacer size="md" />
          <View style={styles.scoreRow}>
            <Text variant="h1" color={theme.colors.primary}>
              {teamA.runs}/{teamA.wickets}
            </Text>
            <Text variant="h5" color={theme.colors.textSecondary}>
              ({teamA.overs}.{teamA.balls % 6} overs)
            </Text>
          </View>
        </View>

        <Spacer size="lg" />

        {/* Team B Score */}
        <View
          style={[
            styles.scoreCard,
            {
              backgroundColor:
                currentInnings === 'teamB'
                  ? theme.colors.primary + '20'
                  : theme.colors.card,
              borderRadius: theme.borderRadius.lg,
              borderWidth: 2,
              borderColor:
                currentInnings === 'teamB'
                  ? theme.colors.primary
                  : theme.colors.border,
            },
          ]}>
          <Text variant="h5">Team B</Text>
          <Spacer size="md" />
          <View style={styles.scoreRow}>
            <Text variant="h1" color={theme.colors.primary}>
              {teamB.runs}/{teamB.wickets}
            </Text>
            <Text variant="h5" color={theme.colors.textSecondary}>
              ({teamB.overs}.{teamB.balls % 6} overs)
            </Text>
          </View>
        </View>

        <Spacer size="xl" />

        {/* Controls */}
        <View
          style={[
            styles.controls,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
            },
          ]}>
          <Text variant="h5" center>
            Batting: {currentInnings === 'teamA' ? 'Team A' : 'Team B'}
          </Text>
          <Spacer size="lg" />

          <Text variant="bodyMedium">Add Runs</Text>
          <Spacer size="md" />
          <View style={styles.buttonRow}>
            {[0, 1, 2, 3, 4, 6].map(runs => (
              <TouchableOpacity
                key={runs}
                style={[
                  styles.runButton,
                  {
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.md,
                  },
                ]}
                onPress={() => addRuns(runs)}>
                <Text variant="h5" style={{color: '#FFFFFF'}}>
                  {runs}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Spacer size="lg" />

          <PrimaryButton
            title="Wicket"
            onPress={addWicket}
            variant="secondary"
          />

          <Spacer size="md" />

          <PrimaryButton
            title="Switch Innings"
            onPress={switchInnings}
            variant="outline"
          />
        </View>

        <Spacer size="xl" />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  scoreCard: {
    padding: 24,
    alignItems: 'center',
  },
  scoreRow: {
    alignItems: 'center',
  },
  controls: {
    padding: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  runButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
