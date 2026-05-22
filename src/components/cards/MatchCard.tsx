import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../common/Text';
import { Spacer } from '../common/Spacer';
import { useTheme } from '../../hooks/useTheme';
import { Match } from '../../types';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { getMatchStatusColor } from '../../utils/helpers';

interface MatchCardProps {
  match: Match;
  onPress?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
  const { theme } = useTheme();
  const statusColor = getMatchStatusColor(match.status);

  const paidPlayers = match.players.filter(
    p => p.paymentStatus === 'paid',
  ).length;
  const totalPlayers = match.numberOfPlayers;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.lg,
          shadowColor: theme.isDark ? '#000' : '#000',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="h5">{match.title}</Text>
          <Spacer size="xs" />
          <Text variant="bodySmall" color={theme.colors.textSecondary}>
            {match.groundName}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
          <Text
            variant="caption"
            style={{ color: statusColor, fontWeight: '600' }}
          >
            {match.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Spacer size="md" />

      <View style={styles.row}>
        <View style={styles.infoItem}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Date
          </Text>
          <Text variant="bodyMedium">{formatDate(match.date)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Time
          </Text>
          <Text variant="bodyMedium">{formatTime(match.time)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Amount
          </Text>
          <Text variant="bodyMedium" color={theme.colors.primary}>
            {formatCurrency(match.amountPerPlayer)}
          </Text>
        </View>
      </View>

      <Spacer size="md" />

      <View style={styles.footer}>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>
          {paidPlayers}/{totalPlayers} Paid
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progress,
              {
                width: `${(paidPlayers / totalPlayers) * 100}%`,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  footer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 3,
  },
});
