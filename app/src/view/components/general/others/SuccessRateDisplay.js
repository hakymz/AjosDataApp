import React from 'react';
import {View} from 'react-native';
import {Text} from '../text';
import {COLORS} from '../../../../conts';
import {useQuery} from 'react-query';
import {fetchRequest} from '../../../../helper';
export const SuccessRateDisplay = ({type = '', network = ''}) => {
  const getSuccessRate = async () => {
    try {
      const response = await fetchRequest({
        path: 'transaction/success-rate',
        showLoader: false,
        method: 'GET',
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  };
  const {data} = useQuery('getSuccessRate', getSuccessRate);

  let selectedPercentage = 0;

  if (network) {
    selectedPercentage = data?.[type]?.[network];
  } else {
    selectedPercentage = data?.[type];
  }

  if (typeof selectedPercentage == 'object') {
    selectedPercentage = 0;
  }

  return (
    <View style={{paddingHorizontal: 20}}>
      <Text fontWeight={'700'} color={COLORS.dark} size={14}>
        Success Delivery Rate
      </Text>
      <Text
        style={{marginTop: 10}}
        fontWeight={'500'}
        color={'#7F8192'}
        size={11}>
        NB: Rate at which plan is usually successfully purchased
      </Text>
      <View style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            height: 8,
            flex: 1,
            backgroundColor: '#E8F1E8',
            borderRadius: 8,
            marginRight: 10,
          }}>
          <View
            style={{
              height: 8,
              width: `${selectedPercentage || 0}%`,
              backgroundColor: '#179338',
              borderRadius: 8,
            }}
          />
        </View>
        <View
          style={{
            height: 40,
            width: 55,
            backgroundColor: '#E8F1E8',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text color={'#179338'} fontWeight={700} size={13}>
            {selectedPercentage || 0}%
          </Text>
        </View>
      </View>
    </View>
  );
};
