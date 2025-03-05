import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text} from '../text';
import {COLORS} from '../../../../conts';
export const BioButton = ({title, icon, onPress, style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 53,
        backgroundColor: COLORS.lightGrey,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        ...style,
      }}>
      {icon}
      <Text size={16} style={{paddingLeft: 10}} fontWeight={'700'}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
