import React from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {BottomSheets, Icons, Text} from '../general';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../conts';
import {GiftCardsOptions} from '../bottomSheetModal/modalContents';

const ServiceCard = ({item}) => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        if (item?.onPress) {
          item?.onPress?.();
        } else {
          navigation.navigate(item?.screen);
        }
      }}
      style={{
        width: width / 3 - 25,
        height: 118,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}>
      <View
        style={{
          height: 32,
          width: 32,
          backgroundColor: '#F4F3FF',
          borderRadius: 32,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {item?.icon}
      </View>
      <View style={{marginTop: 10}}>
        <Text size={14} bold color={'#303437'}>
          {item?.name}
        </Text>
        <Text size={12} medium color={'#72777A'}>
          {item?.details}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const Services = ({navigation}) => {
  const listData = [
    {
      name: 'Data',
      details: 'Purchase',
      icon: <Icons.Data size={18} />,
      screen: 'SellDataScreen',
    },
    {
      name: 'Airtime',
      details: 'Purchase',
      icon: <Icons.Airtime size={18} />,
      screen: 'SellAirtimeScreen',
    },
    {
      name: 'Bill',
      details: 'Payment',
      icon: <Icons.Bill size={18} />,
      screen: 'BillsScreen',
    },
    {
      name: 'SMS',
      details: 'Bulk SMS',
      icon: <Icons.Sms size={18} />,
      screen: 'BulkSmsScreen',
    },
    {
      name: 'Giftcard',
      details: 'Buy/Sell',
      icon: <Icons.Giftcard size={18} />,
      onPress: () => {
        BottomSheets.show({component: <GiftCardsOptions />});
      },
    },
    {
      name: 'Dollar',
      details: 'Card',
      icon: <Icons.DollarCard size={18} />,
      screen: 'DollarCardScreen',
    },
  ];
  return (
    <View style={{marginTop: 20}}>
      <FlatList
        contentContainerStyle={{paddingHorizontal: 20}}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        numColumns={3}
        data={listData}
        renderItem={({item}) => <ServiceCard item={item} />}
      />
    </View>
  );
};
