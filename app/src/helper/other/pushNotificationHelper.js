import {GENERAL} from '../../conts';
// import messaging from '@react-native-firebase/messaging';
import {fetchRequest} from '.';
import {Platform} from 'react-native';
import grantPermission from './grantPermission';
import {PERMISSIONS} from 'react-native-permissions';
import Toast from '../../view/components/toast/Toast';
// import Intercom from '@intercom/intercom-react-native';
const OsVer = Platform.constants['Release'];

const sendKeyToServer = async token => {
  try {
    const response = await fetchRequest({
      path: '/settings/firebasetoken',
      displayMessage: false,
      showLoader: false,
      data: {token: token},
      method: 'PATCH',
    });
    console.log(response, 'token sendt');
  } catch (error) {
    console.log(error);
  }
};

export const pushNotificationHelper = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    let permissionGranted = true;
    if (GENERAL.platform == 'android' && OsVer > 12) {
      permissionGranted = await grantPermission(
        PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      );
    }
    if (enabled && permissionGranted) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        sendKeyToServer(fcmToken);
        await messaging().subscribeToTopic(
          Platform.OS == 'ios' ? 'ios' : 'android',
        );
        await messaging().subscribeToTopic('general');
        if (__DEV__) {
          console.log('yess dev');
          await messaging().subscribeToTopic('test');
        }
      }
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      });
    } else {
      Toast.show(
        'error',
        'Please grant NOTIFICATION permission to receive push notifications from us',
      );
    }
  } catch (error) {
    console.log(error, 'P erorr');
  }
  console.log('yess push ,,,,,');
};
