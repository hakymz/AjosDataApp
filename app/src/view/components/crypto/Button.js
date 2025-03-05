import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../conts';
import {Text} from '../general';

export const Button = ({
  icon,
  title,
  backgroundColor,
  iconConBackgroundColor,
  onPress,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: backgroundColor || COLORS.primary,
        ...styles.btn,
        ...style,
      }}
      {...props}>
      <View
        style={{
          ...styles.iconCon,
          marginRight: 10,
          backgroundColor: iconConBackgroundColor || '#402274',
        }}>
        {icon}
      </View>
      <Text size={12} medium color={COLORS.white}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconCon: {
    height: s(29),
    width: s(29),
    backgroundColor: '#402274',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    height: s(48),
    flex: 1,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
