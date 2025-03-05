import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {BottomSheets, Icons, Text} from '../../general';
import {COLORS} from '../../../../conts';
import {useNavigation} from '@react-navigation/native';

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
export const PayBillsEducation = ({}) => {
  const navigation = useNavigation();
  const list = [
    {
      name: 'WAEC E-pin',
      icon: <Icons.Lock size={24} />,
      onPress: () => {
        BottomSheets.hide();
        navigation.navigate('EPinScreen', {type: 'waec'});
      },
    },
    {
      name: 'NECO E-pin',
      icon: <Icons.Lock size={24} />,
      onPress: () => {
        BottomSheets.hide();
        navigation.navigate('EPinScreen', {type: 'neco'});
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
