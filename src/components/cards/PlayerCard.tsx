import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '../common/Text';
import {Avatar} from '../common/Avatar';
import {useTheme} from '../../hooks/useTheme';
import {MatchPlayer} from '../../types';
import {formatCurrency, formatPhone} from '../../utils/formatters';
import {getPaymentStatusColor} from '../../utils/helpers';

interface PlayerCardProps {
  player: MatchPlayer;
  onPress?: () => void;
  showPaymentStatus?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onPress,
  showPaymentStatus = true,
}) => {
  const {theme} = useTheme();
  const statusColor = getPaymentStatusColor(player.paymentStatus);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}>
      <Avatar name={player.name} uri={player.avatar} size="md" />
      
      <View style={styles.info}>
        <Text variant="bodyMedium">{player.name}</Text>
        <Text variant="caption" color={theme.colors.textSecondary}>
          {formatPhone(player.phone)}
        </Text>
        {player.isGuest && (
          <View style={[styles.guestBadge, {backgroundColor: theme.colors.accent + '20'}]}>
            <Text variant="caption" style={{color: theme.colors.accent}}>
              Guest
            </Text>
          </View>
        )}
      </View>

      {showPaymentStatus && (
        <View style={styles.payment}>
          <View style={[styles.statusBadge, {backgroundColor: statusColor + '20'}]}>
            <Text variant="caption" style={{color: statusColor, fontWeight: '600'}}>
              {player.paymentStatus.toUpperCase()}
            </Text>
          </View>
          {player.amountDue > 0 && (
            <Text variant="bodySmall" color={theme.colors.error}>
              Due: {formatCurrency(player.amountDue)}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  guestBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  payment: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
});
