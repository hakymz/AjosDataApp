import React from 'react';
import {View} from 'react-native';
import {Text} from '../text';
import {Button} from './Button';
import {COLORS} from '../../../../conts';
export const ErrorButton = ({isFetching, refetch}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}>
      <Text style={{marginBottom: 20}}>Something went wrong</Text>
      <Button
        loading={isFetching}
        onPress={refetch}
        fontSize={14}
        textColor={COLORS.white}
        title={'Try again'}
        style={{backgroundColor: '#F45D48', height: 50}}
      />
    </View>
  );
};
