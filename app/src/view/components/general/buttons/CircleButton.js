import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {Icons} from '../others';
export const CircleButton = ({style, onPress, icon}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={onPress || navigation.goBack}
      style={{
        height: 44,
        width: 44,
        borderColor: '#E9F1FF',
        borderWidth: 1,
        borderRadius: 44,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      {icon || <Icons.BackArrowGrey size={20} />}
    </TouchableOpacity>
  );
};
