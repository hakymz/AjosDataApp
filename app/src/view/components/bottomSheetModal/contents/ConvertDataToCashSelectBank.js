import React from 'react';
import {
  View,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';

import {useNavigation} from '@react-navigation/native';

import {COLORS, GENERAL} from '../../../../conts';
import {
  capitalizeWord,
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {TransactionSummary} from './TransactionSummary';
import {SuccessHomeBtn, SuccessShadowBtn} from '../../../screens/general';
import {useQuery} from 'react-query';
const getBanks = async () => {
  try {
    const response = await fetchRequest({
      path: '/wallet/banks',
      method: 'GET',
      showLoader: false,
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const ConvertDataToCashSelectBank = ({onChange}) => {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');

  const Section = ({title, item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onChange(item);
          BottomSheets.hide();
        }}
        style={{
          height: 54,
          backgroundColor: '#F8F8F8',
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginBottom: 10,
        }}>
        <Text size={13} md color={'#979797'}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const {data: banks, status} = useQuery('getBanks', getBanks);

  const selectedBank = React.useMemo(() => {
    return (
      banks?.filter?.(item => item.name?.includes(search?.toUpperCase?.())) ||
      []
    );
  }, [banks, search]);

  return (
    <View style={{paddingHorizontal: 24, paddingBottom: 20}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Banks{' '}
      </Text>

      <View
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: '#EAECF0',
          borderRadius: 10,
          marginBottom: 20,
          marginTop: 20,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}>
        <TextInput
          placeholderTextColor={'#EAECF0'}
          onChangeText={value => {
            setSearch(value);
          }}
          style={{color: '#EAECF0'}}
          placeholder="Search"
        />
      </View>
      {!banks && (
        <View
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={COLORS.primary} size={'large'} />
        </View>
      )}

      {selectedBank?.map(item => (
        <Section title={item?.name} item={item} />
      ))}
    </View>
  );
};
