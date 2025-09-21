import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {useBillsData} from '../../../hooks';
import {Text} from '../general';
import {useQuery} from 'react-query';
import {COLORS} from '../../../conts';
import {Image} from '../general/image';
import {removeCountryCode} from '../../../helper';

export const RecentCustomers = ({onPress, value}) => {
  const {getCustomers} = useBillsData();
  const {data: customersData} = useQuery({
    queryKey: ['getCustomersAirtimeCom'],
    queryFn: getCustomers,
  });

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
        overflow: 'hidden',
      }}>
      <View style={{paddingHorizontal: 20}}>
        <Text size={16} semiBold>
          Recent Beneficiaries 😎
        </Text>
        <Text size={12} medium color={'#898A8D'}>
          You can select any of these to perform a new transaction
        </Text>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{marginHorizontal: 20}}
        style={{flexGrow: 0}}
        horizontal>
        {customersData?.result.map((item, index) => (
          <TouchableOpacity
            disabled={!onPress}
            onPress={() => {
              onPress(removeCountryCode(item?.phone_number));
            }}
            style={{width: 70, marginRight: 10}}>
            <Image
              style={{width: 64, height: 64}}
              source={list[index % list.length].image}
            />
            <Text
              style={{marginTop: 5}}
              textAlign={'center'}
              medium
              color={COLORS.primary}
              size={11}>
              {item?.fullname}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
