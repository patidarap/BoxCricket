import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Text} from './Text';
import {useTheme} from '../../hooks/useTheme';
import {getInitials} from '../../utils/formatters';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export const Avatar: React.FC<AvatarProps> = ({name, uri, size = 'md'}) => {
  const {theme} = useTheme();
  const avatarSize = sizeMap[size];
  const fontSize = avatarSize / 2.5;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: theme.colors.primary,
        },
      ]}>
      {uri ? (
        <Image source={{uri}} style={styles.image} />
      ) : (
        <Text
          variant="body"
          style={{fontSize, color: '#FFFFFF', fontWeight: '600'}}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
