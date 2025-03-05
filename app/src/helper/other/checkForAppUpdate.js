import checkVersion from 'react-native-store-version';
import VersionNumber from 'react-native-version-number';
import {GENERAL} from '../../conts';

export const checkForAppUpdate = async navigation => {
  try {
    const check = await checkVersion({
      version: VersionNumber.appVersion, // app local version
      iosStoreURL: GENERAL.appsLinkToStore.ios,
      androidStoreURL: GENERAL.appsLinkToStore.android,
    });

    if (check.result === 'new') {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};
