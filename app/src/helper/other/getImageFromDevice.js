import React from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
export const getImageFromDevice = async type => {
  try {
    let result;
    if (type == 'camera') {
      result = await launchCamera({quality: 0.5, mediaType: 'photo'});
    } else {
      result = await launchImageLibrary({quality: 0.7, mediaType: 'photo'});
    }
    return result.assets;
  } catch (error) {
    throw error;
  }
};
