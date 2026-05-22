import React from 'react';
import {Text as RNText, TextProps as RNTextProps, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks/useTheme';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'bodyMedium' | 'bodySmall' | 'caption' | 'captionMedium' | 'button';
  color?: string;
  center?: boolean;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  center,
  style,
  children,
  ...props
}) => {
  const {theme} = useTheme();

  return (
    <RNText
      style={[
        theme.typography[variant],
        {color: color || theme.colors.text},
        center && styles.center,
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
});
