import React, {useEffect} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import {useSelector} from 'react-redux';
import {Text} from '../../components/common/Text';
import {PrimaryButton} from '../../components/buttons/PrimaryButton';
import {useTheme} from '../../hooks/useTheme';
import {RootState} from '../../store/store';

export const SplashScreen = ({navigation}: any) => {
  const {theme} = useTheme();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigation.replace('Auth');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <ImageBackground
      source={require('../../../assets/images/welcomescreen.png')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text variant="h1" center style={styles.mainTitle}>
            Welcome To
          </Text>
          <Text variant="h1" center style={styles.appName}>
            BoxCricket
          </Text>
          <Text variant="body" center style={styles.tagline}>
            Play • Score • Split
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  mainTitle: {
    color: '#000',
    fontSize: 32,
    fontWeight: '400',
    textShadowRadius: 10,
  },
  appName: {
    color: '#000',
    fontSize: 48,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 10,
    textShadowRadius: 15,
    textAlign: 'center',
  },
  tagline: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    textShadowRadius: 8,
    opacity: 0.9,
  },
});
