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
export const PayBills = ({}) => {
  const navigation = useNavigation();
  const list = [
    {
      name: 'Electricity Token',
      icon: <Icons.Light size={24} />,
      onPress: () => {
        BottomSheets.hide();
        navigation.navigate('ElectricityScreen');
      },
    },
    {
      name: 'TV Subscription',
      icon: <Icons.Tv size={24} />,
      onPress: () => {
        BottomSheets.hide();
        navigation.navigate('TvScreen');
      },
    },
    {
      name: 'E-pin | WAEC or NECO',
      icon: <Icons.Lock size={24} />,
      onPress: () => {
        BottomSheets.show({
          component: <PayBillsEducation />,
          customSnapPoints: [400, 400],
        });
      },
    },
  ];
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Pay Bills
      </Text>

      <View style={{marginTop: 30, marginBottom: 30}}>
        <Text color={'#828282'} size={12}>
          You can select any of the Bill options below to proceed to enter more
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
