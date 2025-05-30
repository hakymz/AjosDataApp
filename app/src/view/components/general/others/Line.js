import React from 'react';
import {View} from 'react-native';
const Line = ({style}) => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#DEDEDE',
        marginVertical: 20,
        ...style,
      }}
    />
  );
};

export default Line;
