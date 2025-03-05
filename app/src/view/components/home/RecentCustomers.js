import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useBillsData} from '../../../hooks';
import {Text} from '../general';
import {useQuery} from 'react-query';
import {COLORS} from '../../../conts';
import {useNavigation} from '@react-navigation/native';

const List = ({item, onPress, value}) => {
  let customerNumber = item?.customerNumber?.split('+234');
  if (customerNumber[1]) {
    customerNumber =
      customerNumber?.[1]?.[0] == '0'
        ? customerNumber?.[1]
        : '0' + customerNumber?.[1];
  } else {
    customerNumber = item?.customerNumber;
  }

  let selected = value == customerNumber;

  return (
    <TouchableOpacity
      onPress={() => {
        onPress(customerNumber);
      }}
      style={{
        ...styles.list,
        backgroundColor: selected ? '#E8F1E8' : '#F8F8F8',
        borderWidth: 1,
        borderColor: selected ? '#179338' : '#F8F8F8',
      }}>
      <View style={{flex: 1}}>
        <Text
          color={selected ? '#179338' : '#7F8192'}
          numberOfLines={1}
          size={14}
          fontWeight={'500'}>
          {item?.customerName}
        </Text>
        <Text
          numberOfLines={1}
          style={{marginTop: 3}}
          size={14}
          fontWeight={800}
          color={selected ? '#179338' : '#7F8192'}>
          {customerNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export const RecentCustomers = ({onPress, value}) => {
  const {getCustomers} = useBillsData();
  const {
    data: customersData,
    status,
    refetch,
    isSuccess,
    error,
  } = useQuery('getCustomersAirtimeCom', getCustomers);
  const navigation = useNavigation();
  return (
    <View>
      {customersData?.length > 0 && (
        <View style={{marginTop: 25}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              color={COLORS.dark}
              fontWeight={'500'}
              size={14}
              style={{marginBottom: 10}}>
              Recent Customers
            </Text>

            <Text
              onPress={() => {
                navigation.navigate('CustomersScreen', {onPress});
              }}
              color={COLORS.blue}
              fontWeight={'700'}
              size={14}
              style={{marginBottom: 10, textDecorationLine: 'underline'}}>
              View more
            </Text>
          </View>

          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {customersData?.slice?.(0, 3)?.map(item => (
              <List item={item} onPress={onPress} value={value} />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 58,
    width: 130,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
  },
});
