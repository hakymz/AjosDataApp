import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../conts';
import {Icons, Text} from '../general';
export const PageList = ({
  name,
  backgroundColor,
  icon,
  onPress,
  children,
  style,
}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor || COLORS.white,
        height: 68,
        borderRadius: 16,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EAECF0',
        shadowColor: '#7F8192',
        shadowOpacity: 0.12,
        shadowRadius: 15,
        elevation: 20,
        shadowOffset: {height: 10},
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style,
      }}>
      {children}
    </TouchableOpacity>
  );
};
