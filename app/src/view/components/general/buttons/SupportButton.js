import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text} from '../text';
// import Intercom from '@intercom/intercom-react-native';
import {useUser} from '../../../../hooks';
import {openLink} from '../../../../helper';

export const SupportButton = () => {
  const {data} = useUser();
  return (
    <TouchableOpacity
      onPress={() => {
        if (data?.user) {
          Intercom.present();
        } else {
          openLink('mailto:dataresellhelpdesk@gmail.com');
        }
      }}
      activeOpacity={0.7}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: '#7F8192',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text fontWeight={'700'} color="#7F8192">
        Contact Support
      </Text>
    </TouchableOpacity>
  );
};
