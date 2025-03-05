import React from 'react';
import {StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';

import {Text} from '../text';
import {useUser} from '../../../../hooks';
import {formatAmount} from '../../../../helper';
export const BalanceContainer = ({style}) => {
  const {data} = useUser();
  return (
    <View style={{paddingHorizontal: 20, alignItems: 'center'}}>
      <View style={{...styles.con, ...style}}>
        <Text numberOfLines={1} color={'#9C9C9C'} size={12} semiBold>
          {formatAmount(data?.wallet?.naira?.balance)} = Available Balance
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    height: s(24),
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});
