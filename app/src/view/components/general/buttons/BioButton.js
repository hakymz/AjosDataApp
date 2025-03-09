import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text} from '../text';
import {COLORS} from '../../../../conts';
export const BioButton = ({title, icon, onPress, style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 38,
        backgroundColor: '#ECF2F7',
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        ...style,
      }}>
      {icon}
      <Text
        semiBold
        color={COLORS.darkBlue}
        size={14}
        style={{paddingLeft: 10}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
