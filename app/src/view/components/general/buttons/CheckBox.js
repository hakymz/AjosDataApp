import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {MyIcons} from '../others';
export const CheckBox = ({isChecked, ...props}) => {
  return (
    <TouchableOpacity
      style={{
        height: 20,
        width: 20,
        borderWidth: 1.2,
        backgroundColor: isChecked ? '#E0F4DF' : '#E4E4E4',
        borderRadius: 4,
        borderColor: isChecked ? '#E0F4DF' : '#979797',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...props}>
      {isChecked && (
        <View
          style={{
            height: 10,
            width: 10,
            backgroundColor: '#3BA935',
            borderRadius: 10,
          }}
        />
      )}
    </TouchableOpacity>
  );
};
