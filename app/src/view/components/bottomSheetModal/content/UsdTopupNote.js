import React from 'react';
import {Image, View} from 'react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {BottomSheets, Button, Text} from '../../general';
import {useNavigation} from '@react-navigation/native';
import {UsdTopup} from './UsdTopup';
export const UsdTopupNote = ({currency}) => {
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
          Please Note
        </Text>
        <Image
          source={IMAGES.error}
          style={{height: 25, width: 28, resizeMode: 'contain'}}
        />
      </View>
      <Text size={14} color={'#666766'} lineHeight={18}>
        Transactions take between
        <Text bold color={'#666766'} lineHeight={18}>
          {' '}
          24-96hrs
        </Text>{' '}
        depending on the Bank. Also Banking fees may apply. {'\n'}Maximum
        deposits are capped at{' '}
        <Text bold color={'#666766'} lineHeight={18}>
          $1000
        </Text>{' '}
        per day [Daily Limit]
      </Text>
      <View style={{paddingHorizontal: 15, marginTop: 40}}>
        <Button
          type="black"
          title={'Top-up USD wallet'}
          onPress={() => {
            BottomSheets.show({
              component: <UsdTopup currency={currency} />,
              customSnapPoints: [430, 430],
              scrollview: true,
            });
          }}
        />
      </View>
    </View>
  );
};
