import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import {COLORS, IMAGES, MESSAGES} from '../../../../conts';
import {BottomSheets, Button, Text} from '../../general';
import Line from '../../general/others/Line';
import {s} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import Toast from '../../toast/Toast';
const List = ({title, details, ...props}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{
        marginBottom: 30,
        flexDirection: 'row',
        paddingHorizontal: 30,
        marginTop: 30,
      }}
      {...props}>
      <View style={{flex: 1}}>
        <Text style={{marginBottom: 5}} lineHeight={18} size={16} semiBold>
          {title}
        </Text>
        <Text lineHeight={15} size={12} color={'#868686'}>
          {details}
        </Text>
      </View>
      <View style={{width: 50, alignItems: 'flex-end'}}>
        <Image source={IMAGES.payoneer} style={{height: s(22), width: s(22)}} />
      </View>
    </TouchableOpacity>
  );
};
export const Payoneer = () => {
  const navigation = useNavigation();
  return (
    <View style={{marginBottom: 20}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <Text bold color={COLORS.primary} lineHeight={25} size={20}>
          Payoneer-Ex
        </Text>
      </View>
      <List
        onPress={() => {
          BottomSheets.hide();
          Toast.show('success', MESSAGES.comingSoon);
        }}
        title={'Generate Payoneer Link'}
        details={
          'Request payments from your employer, client, family or friends in USD, even if you don’t have a Payoneer account'
        }
      />
      <Line style={{marginVertical: 0}} />

      <List
        onPress={() => {
          BottomSheets.hide();
          navigation.navigate('PayoneerToCashScreen');
        }}
        title={'Payoneer to Cash'}
        details={
          'Exchange your Payoneer USD, GPB or EUR to your local currency at very competitive rates you won’t find anywhere.'
        }
      />
    </View>
  );
};
