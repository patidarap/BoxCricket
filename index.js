import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {notificationService} from './src/services/notificationService';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
  if (remoteMessage.notification) {
    await notificationService.displayNotification(
      remoteMessage.notification.title || 'Notification',
      remoteMessage.notification.body || '',
      remoteMessage.data,
    );
  }
});

AppRegistry.registerComponent(appName, () => App);
