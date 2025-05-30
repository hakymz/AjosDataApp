import React from 'react';
import {View} from 'react-native';
import {Text} from '../../general';
import {COLORS, GENERAL} from '../../../../conts';
import {useUser} from '../../../../hooks';
import {formatAmount} from '../../../../helper';
export const BillsBalance = ({style}) => {
  const {data} = useUser();
  return (
    <View
      style={{
        height: 34,
        backgroundColor: '#E9E6F7',
        borderRadius: 32,
        paddingHorizontal: 25,
        alignItems: 'center',
        marginHorizontal: 10,
        justifyContent: 'center',
        ...style,
      }}>
      <Text
        color={COLORS.darkBlue}
        size={12}
        fontWeight={'700'}
        textAlign={'center'}>
        Available funds: {GENERAL.nairaSign}
        {formatAmount(data?.wallet?.naira?.balance)}
      </Text>
    </View>
  );
};
