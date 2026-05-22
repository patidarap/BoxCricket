import React from 'react';
import {View, ViewProps, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks/useTheme';

interface ContainerProps extends ViewProps {
  padding?: boolean;
  center?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  padding = true,
  center,
  style,
  children,
  ...props
}) => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.colors.background},
        padding && {padding: theme.spacing.md},
        center && styles.center,
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
