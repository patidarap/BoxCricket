import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({ size = 'md', horizontal }) => {
  const { theme } = useTheme();
  const space = theme.spacing[size];

  return <View style={horizontal ? { width: space } : { height: space }} />;
};
