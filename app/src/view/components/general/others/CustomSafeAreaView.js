import React from 'react';
import {SafeAreaView} from 'react-native';
import {COLORS} from '../../../../conts';

export const CustomSafeAreaView = ({style, scrollable, children, ...props}) => {
  return (
    <SafeAreaView
      style={{backgroundColor: COLORS.white, flex: 1, ...style}}
      {...props}>
      {children}
    </SafeAreaView>
  );
};
