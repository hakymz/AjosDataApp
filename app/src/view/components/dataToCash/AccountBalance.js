import React from 'react';
import {View} from 'react-native';
import {Text} from '../general';
import {COLORS, GENERAL} from '../../../conts';
import {useQuery} from 'react-query';
import {fetchRequest, formatAmount} from '../../../helper';

export const AccountBalance = ({setBalance}) => {
  const convertToCashGetBalance = async values => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/reseller/sim/balance',
        method: 'GET',
        showLoader: false,
      });

      return response?.data;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  const {data: balance, error} = useQuery(
    'convertToCashGetBalance',
    convertToCashGetBalance,
  );

  React.useEffect(() => {
    setBalance(balance?.availableBalance);
  }, [balance]);

  console.log(balance, 'balanceee...');
  return (
    <View
      style={{
        height: 120,
        backgroundColor: '#F7F7F7',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 20,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text md color={'#484848'} size={11}>
          Available Balance
        </Text>
        <Text md color={'#484848'} size={11}>
          Total Data Sold
        </Text>
      </View>

      <View style={{flexDirection: 'row', flex: 1, marginTop: 10}}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text color={'#4961AC'} bd size={16}>
            {GENERAL.nairaSign}
            {formatAmount(balance?.availableBalance)}
          </Text>
        </View>
        <View style={{width: 10}} />
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              marginBottom: 5,
              borderRadius: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <Text md size={10} color={'#484848'}>
              All Time
            </Text>

            <Text
              textAlign={'right'}
              numberOfLines={1}
              style={{paddingLeft: 5, flex: 1}}
              color={'#4961AC'}
              bd
              size={14}>
              {balance?.alltimeSold}GB
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              borderRadius: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <Text md size={10} color={'#484848'}>
              Today
            </Text>
            <Text
              textAlign={'right'}
              numberOfLines={1}
              style={{paddingLeft: 5, flex: 1}}
              color={'#4961AC'}
              bd
              size={14}>
              {balance?.soldToday}GB
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
