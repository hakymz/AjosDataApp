import React from 'react';
import {selectContactPhone} from 'react-native-select-contact';
import {PermissionsAndroid} from 'react-native';
import grantPermission from './grantPermission';
import Toast from '../../view/components/toast/Toast';
import {PERMISSIONS} from 'react-native-permissions';
import {GENERAL} from '../../conts';

const selectContact = async () => {
  try {
    const selection = await selectContactPhone();

    if (!selection) {
      return '';
    } else {
      const {selectedPhone} = selection;
      return selectedPhone.number.replace(/[()-]/g, '').replace(/ /g, '');
    }
  } catch (error) {
    throw error;
  }
};

export const pickerPhoneNo = async (callBack = () => {}) => {
  try {
    let permissionGranted;
    if (GENERAL.platform == 'android') {
      permissionGranted = await grantPermission(
        GENERAL.platform == 'ios'
          ? PERMISSIONS.IOS.CONTACTS
          : PERMISSIONS.ANDROID.READ_CONTACTS,
      );
    }

    if (permissionGranted || GENERAL.platform == 'ios') {
      const contact = await selectContact();
      callBack(contact);
    } else {
      return '';
    }
  } catch (error) {
    console.log(error);
    Toast.show('error', 'Could not select contact');
  }
};
