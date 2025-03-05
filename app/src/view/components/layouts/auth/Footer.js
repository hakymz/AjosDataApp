import React from 'react';
import {View, Image} from 'react-native';
import {s} from 'react-native-size-matters';
import {IMAGES} from '../../../../conts';
export const Footer = ({style}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-end',
        flex: 1,
        marginTop: 40,
        marginBottom: 20,
        ...style,
      }}>
      <Image
        source={IMAGES.Logo}
        style={{width: s(120), height: s(40), resizeMode: 'contain'}}
      />
    </View>
  );
};
