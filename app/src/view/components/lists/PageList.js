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
  rightIcon,
}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor || COLORS.white,
        height: 62,
        borderRadius: 16,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E9F1FF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style,
      }}>
      {children}
      {rightIcon ? (
        rightIcon
      ) : (
        <View
          style={{
            height: 32,
            width: 32,
            borderWidth: 1,
            borderColor: '#E9F1FF',
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icons.ChevronRight size={16} />
        </View>
      )}
    </TouchableOpacity>
  );
};
