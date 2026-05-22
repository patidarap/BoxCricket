import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../../components/common/Text';
import { Spacer } from '../../components/common/Spacer';
import { ScreenHeader } from '../../components/headers/ScreenHeader';
import { useTheme } from '../../hooks/useTheme';
import LinearGradient from 'react-native-linear-gradient';

export const MatchDetailsScreen = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { match } = route.params;

  const isTeam1Winner = match.result === 'team1';
  const isTeam2Winner = match.result === 'team2';

  const team1Color = isTeam1Winner ? theme.colors.success : theme.colors.primary;
  const team2Color = isTeam2Winner ? theme.colors.success : theme.colors.error;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Fixed Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 28, color: theme.colors.text }}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Match Title */}
        <Text style={[styles.matchTitle, { color: theme.colors.text }]}>{match.matchNumber}</Text>
        <Spacer size="lg" />

        {/* Scoreboard Header */}
        <View style={[styles.scoreboardHeader, { 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface 
        }]}>
          <LinearGradient
            colors={[team1Color, team1Color + 'CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.teamHeaderLeft}
          >
            <Text style={styles.teamHeaderText}>{match.team1Name}</Text>
          </LinearGradient>

          <View style={[styles.vsContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.vsText, { color: theme.colors.text }]}>VS</Text>
          </View>

          <LinearGradient
            colors={[team2Color + 'CC', team2Color]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.teamHeaderRight}
          >
            <Text style={styles.teamHeaderText}>{match.team2Name}</Text>
          </LinearGradient>
        </View>

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreText, { color: team1Color }]}>
              {match.team1Score}
            </Text>
            <Text style={[styles.oversText, { color: theme.colors.textSecondary }]}>({match.totalOvers} overs)</Text>
            {isTeam1Winner && (
              <View style={[styles.winBadge, { backgroundColor: theme.colors.success }]}>
                <Text style={styles.winText}>WON</Text>
              </View>
            )}
          </View>

          <View style={styles.scoreBox}>
            <Text style={[styles.scoreText, { color: team2Color }]}>
              {match.team2Score}
            </Text>
            <Text style={[styles.oversText, { color: theme.colors.textSecondary }]}>({match.totalOvers} overs)</Text>
            {isTeam2Winner && (
              <View style={[styles.winBadge, { backgroundColor: theme.colors.success }]}>
                <Text style={styles.winText}>WON</Text>
              </View>
            )}
          </View>
        </View>

        <Spacer size="lg" />

        {/* Teams Section */}
        <View style={styles.teamsContainer}>
          {/* Team 1 */}
          <View style={styles.teamColumn}>
            <View style={[styles.teamTitle, { backgroundColor: team1Color }]}>
              <Text style={styles.teamTitleText}>TEAM A</Text>
            </View>

            {/* Captain */}
            <View style={[styles.playerRow, styles.captainRow]}>
              <View style={[styles.playerNumber, { backgroundColor: team1Color }]}>
                <Text style={styles.playerNumberText}>C</Text>
              </View>
              <View style={styles.playerNameBox}>
                <Text style={styles.playerNameText}>
                  {match.team1Captain?.name || 'Unknown'}
                </Text>
              </View>
            </View>

            {/* Players */}
            {match.team1Players && match.team1Players.length > 0 ? (
              match.team1Players.map((player: any, index: number) => (
                <View key={index} style={styles.playerRow}>
                  <View style={[styles.playerNumber, { backgroundColor: team1Color }]}>
                    <Text style={styles.playerNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.playerNameBox}>
                    <Text style={styles.playerNameText}>
                      {player.name || 'Unknown'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.playerRow}>
                <View style={styles.playerNameBox}>
                  <Text style={[styles.playerNameText, { opacity: 0.5 }]}>
                    No players
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Team 2 */}
          <View style={styles.teamColumn}>
            <View style={[styles.teamTitle, { backgroundColor: team2Color }]}>
              <Text style={styles.teamTitleText}>TEAM B</Text>
            </View>

            {/* Captain */}
            <View style={[styles.playerRow, styles.captainRow]}>
              <View style={[styles.playerNumber, { backgroundColor: team2Color }]}>
                <Text style={styles.playerNumberText}>C</Text>
              </View>
              <View style={styles.playerNameBox}>
                <Text style={styles.playerNameText}>
                  {match.team2Captain?.name || 'Unknown'}
                </Text>
              </View>
            </View>

            {/* Players */}
            {match.team2Players && match.team2Players.length > 0 ? (
              match.team2Players.map((player: any, index: number) => (
                <View key={index} style={styles.playerRow}>
                  <View style={[styles.playerNumber, { backgroundColor: team2Color }]}>
                    <Text style={styles.playerNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.playerNameBox}>
                    <Text style={styles.playerNameText}>
                      {player.name || 'Unknown'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.playerRow}>
                <View style={styles.playerNameBox}>
                  <Text style={[styles.playerNameText, { opacity: 0.5 }]}>
                    No players
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 80,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  teamHeaderLeft: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamHeaderRight: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  vsContainer: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scoreBox: {
    alignItems: 'center',
    minWidth: 120,
  },
  scoreText: {
    fontSize: 56,
    fontWeight: 'bold',
    lineHeight: 64,
  },
  oversText: {
    fontSize: 14,
    marginTop: 8,
  },
  winBadge: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  teamsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  teamColumn: {
    flex: 1,
  },
  teamTitle: {
    paddingVertical: 8,
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  teamTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  captainRow: {
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  playerNumber: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerNameBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    height: 40,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  playerNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
