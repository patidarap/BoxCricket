import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../common/Text';
import {useTheme} from '../../hooks/useTheme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({label, value, icon, color}) => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
        },
      ]}>
      {icon && (
        <View style={[styles.iconContainer, {backgroundColor: (color || theme.colors.primary) + '20'}]}>
          {icon}
        </View>
      )}
      <Text variant="h3" color={color || theme.colors.primary}>
        {value}
      </Text>
      <Text variant="bodySmall" color={theme.colors.textSecondary}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
});
