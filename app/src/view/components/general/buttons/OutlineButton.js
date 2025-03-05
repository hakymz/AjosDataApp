import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text} from '../text';

export const OutlineButton = ({title, style, onPress = () => {}}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress?.();
      }}
      activeOpacity={0.7}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: '#7F8192',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}>
      <Text fontWeight={'700'} color="#7F8192">
        {title}
      </Text>
    </TouchableOpacity>
  );
};
