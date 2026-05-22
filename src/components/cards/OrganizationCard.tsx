import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '../common/Text';
import {useTheme} from '../../hooks/useTheme';
import {Organization} from '../../types/organization.types';

interface OrganizationCardProps {
  organization: Organization;
  isAdmin: boolean;
  onPress: () => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  isAdmin,
  onPress,
}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="h5">{organization.name}</Text>
          {isAdmin && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.colors.primary + '20',
                  borderRadius: theme.borderRadius.sm,
                },
              ]}>
              <Text
                variant="caption"
                style={{color: theme.colors.primary, fontWeight: '600'}}>
                ADMIN
              </Text>
            </View>
          )}
        </View>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>
          {organization.memberCount || 0} members
        </Text>
      </View>
      <Text style={{fontSize: 20, color: theme.colors.textSecondary}}>→</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
