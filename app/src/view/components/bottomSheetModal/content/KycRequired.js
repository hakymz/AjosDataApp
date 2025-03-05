import React from 'react';
import {Image, View} from 'react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {BottomSheets, Button, Text} from '../../general';
import {useNavigation} from '@react-navigation/native';
export const KycRequired = () => {
  const navigation = useNavigation();
  return (
    <View style={{paddingHorizontal: 30, marginBottom: 30}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 30,
        }}>
        <Text bold color={COLORS.primary} lineHeight={25} size={20}>
          KYC Required
        </Text>
        <Image
          source={IMAGES.error}
          style={{height: 25, width: 28, resizeMode: 'contain'}}
        />
      </View>
      <Text color={'#666766'} lineHeight={18}>
        Dear Customer, we need you to submit a few details for verification for
        you to proceed with further transactions.
      </Text>
      <View style={{paddingHorizontal: 15, marginTop: 40}}>
        <Button
          type="black"
          title={'Submit KYC'}
          onPress={() => {
            BottomSheets.hide();
            navigation.navigate('KycScreen');
          }}
        />
      </View>
    </View>
  );
};
