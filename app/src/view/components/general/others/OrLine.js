import React from 'react';
import {View} from 'react-native';
import {Text} from '../text';
export const OrLine = ({style}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: 1,
          backgroundColor: '#486484',
          marginVertical: 20,
          width: 62,
          opacity: 0.6,
        }}
      />

      <Text
        style={{marginHorizontal: 10}}
        size={15}
        fontWeight={'500'}
        color={'#486484'}>
        or
      </Text>
      <View
        style={{
          height: 1,
          backgroundColor: '#486484',
          marginVertical: 20,
          width: 62,
          opacity: 0.6,
        }}
      />
    </View>
  );
};
