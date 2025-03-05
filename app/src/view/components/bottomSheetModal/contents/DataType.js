import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {BottomSheets, Button, Icons, PageInput, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {useNavigation} from '@react-navigation/native';
import {PayBillsEducation} from './PayBillsEducation';

const List = ({item}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        item?.onPress?.();
      }}
      style={{
        height: 54,
        backgroundColor: '#F8F8F8',
        marginBottom: 7,
        borderRadius: 8,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text fontWeight={'500'} color={COLORS.blue}>
        {item?.name}
      </Text>
      {item?.icon}
    </TouchableOpacity>
  );
};
export const DataType = ({}) => {
  const navigation = useNavigation();
  const list = [
    {
      name: 'Data Resell',
      icon: <Icons.Wifi size={24} />,
      onPress: () => {
        BottomSheets.hide();
        navigation.navigate('SellDataScreen');
      },
    },
    {
      name: 'Data Gifting',
      icon: <Icons.Gift size={24} />,
      onPress: () => {
        BottomSheets.hide();
        navigation.navigate('SellDataScreen', {type: 'gift'});
      },
    },
  ];
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Sell Data
      </Text>

      <View style={{marginTop: 30, marginBottom: 30}}>
        <Text color={'#828282'} size={12}>
          You can select any of the data options below to proceed to enter more
          details.
        </Text>
      </View>

      <View>
        {list?.map(item => (
          <List item={item} />
        ))}
      </View>
    </View>
  );
};
