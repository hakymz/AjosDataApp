import React from 'react';
import {View} from 'react-native';
import {s} from 'react-native-size-matters';
import {Text} from '../../general';

export const Status = ({title = 'Payment was successful!', subTitle}) => {
  return (
    <View>
      <View style={{height: 160}}></View>
      <Text
        style={{marginTop: 30}}
        numberOfLines={2}
        size={24}
        medium
        lineHeight={28}
        textAlign={'center'}>
        {title}
      </Text>
      {subTitle && (
        <Text
          style={{marginTop: 5}}
          numberOfLines={4}
          size={16}
          lineHeight={18}
          textAlign={'center'}>
          {subTitle}
        </Text>
      )}
    </View>
  );
};

export default Status;
