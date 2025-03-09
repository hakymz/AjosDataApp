import React from 'react';
import {SafeAreaView} from 'react-native';

export const CustomSafeAreaView = ({
  style,
  backgroundColor = '#F5F5F5',
  scrollable,
  children,
  ...props
}) => {
  return (
    <SafeAreaView style={{backgroundColor, flex: 1, ...style}} {...props}>
      {children}
    </SafeAreaView>
  );
};
