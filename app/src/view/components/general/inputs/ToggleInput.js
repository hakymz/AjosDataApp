import React from 'react';
import {View} from 'react-native';
import {s} from 'react-native-size-matters';
import {Switch} from '..';
import {COLORS} from '../../../../conts';
import {Text} from '../text';

export const ToggleInput = ({
  title,
  enableSwitch,
  onValueChange,
  style,
  click,
}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style,
      }}>
      <Switch
        enabled={enableSwitch}
        onValueChange={onValueChange}
        onPress={click}
      />
    </View>
  );
};
