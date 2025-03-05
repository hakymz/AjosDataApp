import React from 'react';
import {View} from 'react-native';

export const Card = ({style, children}) => {
  return (
    <View
      style={[
        {
          backgroundColor: '#F3F7FF',
          borderRadius: 15,
          padding: 20,
          justifyContent: 'center',
          marginBottom: 10,
          ...style,
        },
      ]}>
      {children}
    </View>
  );
};
