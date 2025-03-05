import React from 'react';
import {Image, Platform, TouchableOpacity} from 'react-native';
import {COLORS} from '../../../../conts';
import {useUser} from '../../../../hooks';
// import Intercom from '@intercom/intercom-react-native';

export const LiveChatButton = ({style}) => {
  const {data} = useUser();

  React.useEffect(() => {
    // Intercom.setBottomPadding(Platform.OS == 'ios' ? 50 : 150);
    // Intercom.setLauncherVisibility(data ? 'VISIBLE' : 'GONE');
    // Intercom.setLauncherVisibility('GONE');
  }, []);
  if (!data) {
    return null;
  }
  return null;
};
