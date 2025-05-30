import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {Icons} from '../others';
export const CloseButton = ({style, onPress, icon}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={onPress || navigation.goBack}
      style={{
        height: 44,
        width: 44,
        borderRadius: 44,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        ...style,
      }}>
      {icon || <Icons.Close size={20} />}
    </TouchableOpacity>
  );
};
