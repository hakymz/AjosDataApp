import React from 'react';
import {View} from 'react-native';
import {Text} from '../../general';
import {COLORS, GENERAL} from '../../../../conts';
import {useUser} from '../../../../hooks';
import {formatAmount} from '../../../../helper';
export const BillsBalance = () => {
  const {data} = useUser();
  return (
    <View
      style={{
        height: 93,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 25,
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 10,
      }}>
      <View
        style={{
          backgroundColor: '#EEEEEE',
          height: 49,
          flex: 1,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          color={COLORS.primary}
          size={25}
          fontWeight={'800'}
          textAlign={'center'}>
          {GENERAL.nairaSign}
          {formatAmount(data?.wallet?.naira?.balance)}
        </Text>
      </View>
      <View
        style={{
          height: 40,
          width: 40,
          backgroundColor: '#E6E6E6',
          borderRadius: 100,
          left: -5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text lineHeight={'39.06'} fontWeight={'800'} size={30}>
          🤑
        </Text>
      </View>
    </View>
  );
};
