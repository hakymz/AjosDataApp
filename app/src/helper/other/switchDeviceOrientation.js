import React from 'react';
import Orientation from 'react-native-orientation-locker';
export const switchDeviceOrientation = () => {
  Orientation.addDeviceOrientationListener(orientation => {
    Orientation.getAutoRotateState(state => {
      if (state) {
        if (orientation == 'LANDSCAPE-RIGHT') {
          Orientation.lockToLandscapeRight();
        } else if (orientation == 'LANDSCAPE-LEFT') {
          Orientation.lockToLandscapeLeft();
        } else {
          Orientation.lockToPortrait();
        }
      }
    });
  });
};
