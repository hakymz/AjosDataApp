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
      activeOpacity={0.7}
      style={{
        height: s(46),
        width: s(46),
        backgroundColor: COLORS.black,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      {icon || <Icons.CircleArrowLeftBlue />}
    </TouchableOpacity>
  );
};
