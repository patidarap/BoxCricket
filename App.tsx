import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from './src/store/store';
import {AppNavigator} from './src/navigation/AppNavigator';
import {useTheme} from './src/hooks/useTheme';
import {restoreAuth} from './src/store/slices/authSlice';
import {apiClient} from './src/api/client';
import PrimaryFlashMessage from './src/components/common/FlashMessage';

const AppContent = () => {
  const {theme}= useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore auth state from AsyncStorage on app start
    const restoreAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userStr = await AsyncStorage.getItem('user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          apiClient.setAuthToken(token);
          dispatch(restoreAuth({user, token}));
          console.log('Auth restored from AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to restore auth:', error);
      }
    };

    restoreAuthState();
  }, [dispatch]);

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppNavigator />
      <PrimaryFlashMessage />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
