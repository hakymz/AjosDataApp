import React from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {Text} from '../text';
export const Button = ({
  type = 'primary',
  big,
  style,
  onPress,
  title = null,
  textColor,
  titleStyle,
  leftIcon,
  rightIcon,
  disabled,
  children,
  fontSize = 18,
  loading,
}) => {
  const configStyle = {
    primary: {backgroundColor: COLORS.primary, textColor: COLORS.white},
    white: {backgroundColor: COLORS.white, textColor: COLORS.voodoo},
    black: {backgroundColor: COLORS.black, textColor: COLORS.white},
    grey: {backgroundColor: COLORS.grey, textColor: COLORS.grey},
    lightGrey: {backgroundColor: COLORS.lightGrey, textColor: '#231F20'},
    red: {backgroundColor: COLORS.red, textColor: COLORS.white},
  };

  const getButtonSize = () => {
    if (big) {
      return s(60);
    } else {
      return 56;
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        height: getButtonSize(),
        backgroundColor: configStyle[type].backgroundColor,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        ...style,
      }}>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={'small'} color={COLORS.secondary} />
        </View>
      ) : (
        <>
          {leftIcon && (
            <View
              style={{
                justifyContent: 'flex-end',
                width: 35,
              }}>
              {leftIcon}
            </View>
          )}

          {title ? (
            <Text
              fontWeight={'800'}
              numberOfLines={1}
              semiBold
              size={fontSize}
              color={textColor || configStyle[type].textColor}
              style={{
                flex: 1,
                textAlign: rightIcon ? 'left' : 'center',
                paddingHorizontal: 20,
                ...titleStyle,
              }}>
              {title}
            </Text>
          ) : (
            children
          )}
          {rightIcon && (
            <View style={{alignItems: 'flex-end', width: 35}}>{rightIcon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};
