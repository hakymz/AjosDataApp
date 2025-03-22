import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useBillsData} from '../../../hooks';
import {Text} from '../general';
import {useQuery} from 'react-query';
import {COLORS} from '../../../conts';
import {useNavigation} from '@react-navigation/native';
import {Image} from '../general/image';

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

  const list = [
    {
      name: 'James',
      image: require('../../../assets/images/avatars/avatar.png'),
    },
    {
      name: 'Chioma',
      image: require('../../../assets/images/avatars/avatar2.png'),
    },
    {
      name: 'Shaggy',
      image: require('../../../assets/images/avatars/avatar3.png'),
    },
    {
      name: 'Bimbota',
      image: require('../../../assets/images/avatars/avatar4.png'),
    },
  ];
  return (
    <View
      style={{
        height: 202,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        paddingVertical: 20,
        justifyContent: 'space-between',
      }}>
      <View style={{paddingHorizontal: 20}}>
        <Text size={16} semiBold>
          Recent Beneficiaries 😎
        </Text>
        <Text size={12} medium color={'#898A8D'}>
          You can select any of these to perform a new transaction
        </Text>
      </View>

      {/* {customersData?.length > 0 && (
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
      )} */}
      <ScrollView
        contentContainerStyle={{flex: 0, paddingHorizontal: 20}}
        style={{flexGrow: 0}}
        horizontal>
        {list.map(item => (
          <TouchableOpacity style={{width: 70, marginRight: 10}}>
            <Image style={{width: 64, height: 64}} source={item?.image} />
            <Text
              style={{marginTop: 5}}
              textAlign={'center'}
              medium
              color={COLORS.primary}
              size={11}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
