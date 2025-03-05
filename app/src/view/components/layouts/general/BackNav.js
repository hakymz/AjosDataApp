import {StatusBar, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {s} from 'react-native-size-matters';
import {CircleButton, Icons, NavigationButton, Text} from '../../general';
import {COLORS} from '../../../../conts';
import Line from '../../general/others/Line';
import {useNavigation} from '@react-navigation/native';
export const BackNav = ({style, backgroundColor = COLORS.white}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor,
        ...style,
        padding: 20,
      }}>
      <TouchableOpacity
        onPress={navigation.goBack}
        style={{
          height: 47,
          width: 47,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowOpacity: 1,
          shadowRadius: 12,
          backgroundColor: COLORS.white,
          borderRadius: 15,
          shadowOffset: {height: 10},
        }}>
        <Icons.ArrowLeft size={20} />
      </TouchableOpacity>
    </View>
  );
};
