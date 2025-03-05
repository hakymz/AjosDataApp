import React from 'react';
import {View, Image} from 'react-native';
import {Button, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {COLORS, IMAGES} from '../../../../conts';
export const GenerateAccount = ({}) => {
  const topupProvidersList = [
    {name: 'Moniepoint', icon: IMAGES.moniepoint},
    {name: 'Paystack', icon: IMAGES.paystack},
    {name: 'Opay', icon: IMAGES.opay},
  ];
  return (
    <View style={{paddingHorizontal: 20}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Top-up Wallet
      </Text>

      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30}}>
        <Image
          source={topupProvidersList?.[0]?.icon}
          style={{height: 50, width: 50, marginRight: 10}}
        />
        <Text fontWeight={'500'} color={COLORS.blue} size={25}>
          Moniepoint
        </Text>
      </View>

      <View style={{marginTop: 30, marginBottom: 60, paddingHorizontal: 20}}>
        <Text size={14} fontWeight={'500'}>
          You currently don’t have a moniepoint account, click below to generate
          one.
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Button
          type="lightGrey"
          style={{width: 130}}
          fontSize={14}
          title={'Cancel'}
        />
        <View style={{width: 10}} />
        <Button style={{flex: 1}} fontSize={14} title={'Generate Account'} />
      </View>
      <View style={{paddingTop: 30}}>
        <Text lineHeight={'16'} color={'#828282'} size={12} fontWeight={'400'}>
          You cannot proceed till a Virtual bank account is generated from the
          desired Bank.
        </Text>
      </View>
    </View>
  );
};
