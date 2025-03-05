import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text} from '../text';
import {COLORS} from '../../../../conts';
export const SocialButton = ({title, style}) => {
  return (
    <TouchableOpacity
      style={{
        height: 53,
        backgroundColor: COLORS.lightGrey,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      <Text fontWeight={'700'}>{title}</Text>
    </TouchableOpacity>
  );
};
