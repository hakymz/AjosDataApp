import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomSheets, Text} from '../../general';

import {useBillsData} from '../../../../hooks';
import {useQuery} from 'react-query';
import {COLORS} from '../../../../conts';

const List = ({item, onPress}) => {
  let customerNumber = item?.customerNumber?.split('+234');
  if (customerNumber[1]) {
    customerNumber =
      customerNumber?.[1]?.[0] == '0'
        ? customerNumber?.[1]
        : '0' + customerNumber?.[1];
  } else {
    customerNumber = item?.customerNumber;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(customerNumber);
      }}
      style={{
        ...styles.list,
      }}>
      <View style={{flex: 1}}>
        <Text size={14} fontWeight={'500'} color={'#7F8192'}>
          {item?.customerName}
        </Text>
        <Text
          style={{marginTop: 3}}
          size={18}
          fontWeight={800}
          color={'#7F8192'}>
          {customerNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const SavedCustomers = ({onPress, number}) => {
  const {addCustomers, getCustomers} = useBillsData();

  const {
    data: customersData,
    status,
    refetch,
    isSuccess,
    isLoading,
    error,
  } = useQuery('getCustomersBottomModal', getCustomers);

  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Customers
      </Text>

      <View
        style={{marginTop: 30, marginBottom: 25, paddingHorizontal: 20}}></View>

      <View>
        {isLoading && (
          <View style={{marginTop: 20}}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        )}
        {customersData?.map(item => (
          <List
            item={item}
            onPress={value => {
              BottomSheets.hide();
              onPress(value);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 72,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
