import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { useTheme } from './useTheme';
import { restoreAuth } from '../store/slices/authSlice';
import { apiClient } from '../api/client';
import { notificationService } from '../services/notificationService';

export const useAppSetup = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userStr = await AsyncStorage.getItem('user');

        if (token && userStr) {
          const user = JSON.parse(userStr);
          apiClient.setAuthToken(token);
          dispatch(restoreAuth({ user, token }));
          console.log('Auth restored from AsyncStorage');
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
      }
    };

    const setupNotifications = async () => {
      const hasPermission = await notificationService.requestPermission();
      if (hasPermission) {
        const token = await notificationService.getFCMToken();
        if (token) {
          console.log('FCM Token:', token);
          await AsyncStorage.setItem('fcmToken', token);
        }
      }
    };

    const setupNotificationHandlers = async () => {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('App opened from quit state:', initialNotification);
      }

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('App opened from background:', remoteMessage);
      });

      const unsubscribeForeground = messaging().onMessage(
        async remoteMessage => {
          console.log('Foreground message:', remoteMessage);
          if (remoteMessage.notification) {
            await notificationService.displayNotification(
              remoteMessage.notification.title || 'Notification',
              remoteMessage.notification.body || '',
              remoteMessage.data,
            );
          }
        },
      );

      const unsubscribeNotifee = notifee.onForegroundEvent(
        ({ type, detail }) => {
          if (type === EventType.PRESS) {
            console.log('Notification pressed:', detail.notification?.data);
          }
        },
      );

      return () => {
        unsubscribeForeground();
        unsubscribeNotifee();
      };
    };

    restoreAuthState();
    setupNotifications();

    let cleanup: (() => void) | undefined;
    setupNotificationHandlers().then(fn => {
      cleanup = fn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [dispatch]);

  return { theme };
};
