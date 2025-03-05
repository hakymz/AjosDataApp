import * as Keychain from 'react-native-keychain';
import {Platform} from 'react-native';

export const saveUserDetailsToKeyChain = async data => {
  try {
    await Keychain.setGenericPassword(data?.email, data?.password, {
      accessControl: undefined,
      // accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch (error) {
    throw error;
  }
};
