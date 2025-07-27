import React from 'react';
import {View} from 'react-native';
import {Text} from '../text';
import {COLORS} from '../../../../conts';
export const PageIndicator = ({title, width, height = 4, style}) => {
  return (
    <View style={{}}>
      {title && (
        <Text textAlign={'right'} size={10} color={'#96979F'}>
          {title}
        </Text>
      )}

      <View
        style={{
          backgroundColor: '#E8E9F1',
          borderRadius: 4,
          marginTop: 5,
          height,
          ...style,
        }}>
        <View
          style={{
            width,
            height: '100%',
            backgroundColor: COLORS.primary,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
};
