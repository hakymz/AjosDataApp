import {getUserDetailsFromKeyChain} from './getUserDetailsFromKeyChain';
import ReactNativeBiometrics from 'react-native-biometrics';
import {getAvaliableBioType} from './getAvaliableBioType';
import Toast from '../../view/components/toast/Toast';

export const enableBiometric = async () => {
  try {
    const bioType = await getAvaliableBioType();
    if (
      bioType == 'FINGERPRINT' ||
      bioType == 'FACEID' ||
      bioType == 'TOUCHID'
    ) {
      const credentials = await getUserDetailsFromKeyChain();
      if (credentials) {
        return true;
      } else {
        return false;
      }
    } else {
      Toast.show('error', 'Please enable your device biometric to continue');
    }
  } catch (error) {
    return false;
  }
};
