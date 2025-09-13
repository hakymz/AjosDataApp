import * as Keychain from 'react-native-keychain';
import {Platform} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import Toast from '../../view/components/toast/Toast';

export const getUserDetailsFromKeyChain = async key => {
  try {
    const bio = await ReactNativeBiometrics.simplePrompt({
      promptMessage: 'Confirm biometrics',
    });

    if (bio?.success) {
      const credentials = await Keychain.getGenericPassword(key, {
        accessControl: Platform.OS === 'android' ? undefined : undefined,
      });

      if (credentials?.username && credentials?.password) {
        return credentials;
      } else {
        Toast.show('error', 'Authentication failed.');
        return false;
      }
    } else {
      Toast.show('error', 'Authentication failed.');
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
