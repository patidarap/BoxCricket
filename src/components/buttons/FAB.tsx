import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '../common/Text';
import {useTheme} from '../../hooks/useTheme';

interface FABProps {
  onPress: () => void;
  icon?: string;
}

export const FAB: React.FC<FABProps> = ({onPress, icon = '+'}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
