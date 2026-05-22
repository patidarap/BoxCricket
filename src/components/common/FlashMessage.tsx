import React, {FC, forwardRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import FlashMessage, {FlashMessageProps} from 'react-native-flash-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from './Text';

const TYPE_CONFIG: Record<string, {bg: string; accent: string; icon: string}> = {
  success: {bg: '#1A2E22', accent: '#34C759', icon: '✓'},
  danger: {bg: '#2E1A1A', accent: '#FF3B30', icon: '✕'},
  warning: {bg: '#2E2A1A', accent: '#FF9500', icon: '⚠'},
  info: {bg: '#1A1E2E', accent: '#007AFF', icon: 'ℹ'},
  default: {bg: '#1C1C1E', accent: '#8E8E93', icon: '•'},
};

const FlashMessageComponent: FC<{message: any}> = ({message}) => {
  const type = message?.type ?? 'default';
  const {bg, accent, icon} = TYPE_CONFIG[type] ?? TYPE_CONFIG.default;
  const {top} = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          marginTop: top + 12,
          backgroundColor: bg,
          opacity: message?.animationValue ?? 1,
        },
      ]}>
      <View style={[styles.accent, {backgroundColor: accent}]} />
      <View style={[styles.iconWrap, {backgroundColor: accent + '30'}]}>
        <Text style={[styles.icon, {color: accent}]}>{icon}</Text>
      </View>
      <View style={styles.textWrap}>
        {!!message?.message && (
          <Text style={styles.title}>{message.message}</Text>
        )}
        {!!message?.description && (
          <Text style={styles.description}>{message.description}</Text>
        )}
      </View>
    </Animated.View>
  );
};

const PrimaryFlashMessage = forwardRef<FlashMessage, Partial<FlashMessageProps>>(
  (props, ref) => (
    <FlashMessage
      ref={ref}
      position="top"
      duration={3000}
      MessageComponent={FlashMessageComponent}
      transitionConfig={animationValue => ({
        transform: [],
        opacity: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      })}
      {...props}
    />
  ),
);

export default PrimaryFlashMessage;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 14,
    paddingRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 4,
    marginRight: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#AEAEB2',
    fontSize: 12,
    marginTop: 2,
  },
});
