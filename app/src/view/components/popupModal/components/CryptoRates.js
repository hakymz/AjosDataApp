import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useUser} from '../../../../hooks';
import {Text} from '../../general';

import {Copy, fetchRequest} from '../../../../helper';
import {COLORS, GENERAL} from '../../../../conts';
import {useTheme} from '../../../../hooks/useTheme';
import {useQuery} from 'react-query';

const List = ({title, subTitle}) => {
  const {theme} = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
      }}>
      <Text
        color={theme == GENERAL.DarkTheme ? COLORS.white : COLORS.grey}
        size={13}
        numberOfLines={1}
        style={{width: '45%'}}
        semiBold>
        {title}
      </Text>
      <View
        style={{
          width: '50%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <Text
          color={theme == GENERAL.DarkTheme ? COLORS.white : COLORS.grey}
          size={11}
          textAlign={'right'}
          numberOfLines={1}>
          {subTitle}
        </Text>
      </View>
    </View>
  );
};

const getRates = async country => {
  try {
    const response = await fetchRequest({
      path: `crypto/conversion-rate`,
      method: 'GET',
      displayMessage: false,
      showLoader: false,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const CryptoRates = () => {
  const {
    data: {user: {data = ''} = ''},
  } = useUser();

  const {theme} = useTheme();
  const [selectedCurrency, setSelectedCurrency] = React.useState('NGN');

  const currencies = ['NGN', 'CFA'];

  const {data: ratesData, refetch} = useQuery('getRates', () => getRates());

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        {currencies?.map(item => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCurrency(item);
            }}
            style={{marginRight: 10}}>
            <Text
              semiBold
              color={
                selectedCurrency == item
                  ? COLORS.primary
                  : theme == GENERAL.DarkTheme
                  ? COLORS.white
                  : COLORS.grey
              }>
              {item}
            </Text>
            {selectedCurrency == item && (
              <View
                style={{
                  width: 40,
                  height: 2,
                  backgroundColor: COLORS.primary,
                  marginTop: 2,
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <Text
          semiBold
          size={12}
          color={theme == GENERAL.DarkTheme ? COLORS.white : COLORS.grey}>
          Values(in $)
        </Text>
        <Text
          semiBold
          size={12}
          color={theme == GENERAL.DarkTheme ? COLORS.white : COLORS.grey}>
          Rates
        </Text>
      </View>
      <View>
        {ratesData?.data?.cryptRate?.map(item => (
          <List
            title={item?.range}
            subTitle={selectedCurrency == 'CFA' ? item?.cfafee : item?.fee}
          />
        ))}
      </View>
    </View>
  );
};
