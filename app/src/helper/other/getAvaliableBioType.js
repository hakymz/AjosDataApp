import React from 'react';
import * as Keychain from 'react-native-keychain';
import {GENERAL} from '../../conts';
import DeviceInfo from 'react-native-device-info';

export const getAvaliableBioType = async () => {
  let bioType = null;
  bioType = await Keychain.getSupportedBiometryType();
  try {
    if (GENERAL.platform == 'ios') {
      bioType = await Keychain.getSupportedBiometryType();
    } else {
      const deviceInfo = await DeviceInfo.isPinOrFingerprintSet();
      if (deviceInfo) {
        console.log(bioType);
      }
    }

    return bioType?.toUpperCase?.();
  } catch (error) {
    return null;
  }

  console.log(bioType);
};
