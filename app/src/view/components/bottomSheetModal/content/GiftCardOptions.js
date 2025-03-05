import React from 'react';
import {View} from 'react-native';
import {Button, Icons, Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {BottomSheets} from '../BottomSheets';

import {useNavigation} from '@react-navigation/native';
import {BuyGiftCard} from './BuyGiftCard';
import {useTradeData} from '../../../../hooks';

export const GiftCardOptions = ({}) => {
  const navigation = useNavigation();
  const {getAllCountries} = useTradeData();
  React.useEffect(() => {
    getAllCountries();
  }, []);

  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <Text
          textAlign="center"
          fontType={FONTS.FREDOKA}
          color={COLORS.black}
          size={20}
          lineHeight={24}
          style={{
            marginTop: 10,
            flex: 1,
          }}>
          Giftcard Trade
        </Text>
      </View>

      <View style={{paddingHorizontal: 20}}>
        <Text medium textAlign="center" style={{marginTop: 30}}>
          What do you want to do?
        </Text>

        <Button
          titleStyle={{
            fontSize: s(14),
            fontFamily: FONTS.WORKSANS_FONTS.medium,
          }}
          style={{backgroundColor: '#6B7ED6', marginTop: 20}}
          leftIcon={
            <View
              style={{
                height: s(29),
                width: s(29),
                backgroundColor: '#5E70C2',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{rotate: '45deg'}],
              }}>
              <Icons.ArrowWhite size={15} />
            </View>
          }
          title="Buy Giftcard"
          onPress={() => {
            BottomSheets.show({
              component: <BuyGiftCard />,
              backgroundColor: COLORS.white,
              customSnapPoints: [500, 500],
            });
          }}
        />
        <Text
          lineHeight={14}
          textAlign="center"
          style={{marginTop: 10, paddingHorizontal: 10}}
          size={12}
          color="#A1A1A1">
          Buy from many options and use the tokens to ease your daily living.
        </Text>

        <Button
          titleStyle={{
            fontSize: s(14),
            fontFamily: FONTS.WORKSANS_FONTS.medium,
            color: '#555555',
          }}
          style={{backgroundColor: COLORS.yellow, marginTop: 20}}
          leftIcon={
            <View
              style={{
                height: s(29),
                width: s(29),
                backgroundColor: '#EFD031',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icons.ArrowBlack size={15} />
            </View>
          }
          title="Sell Giftcard"
          onPress={() => {
            navigation.navigate('GiftCardScreen');
            BottomSheets.hide();
          }}
        />
        <Text
          lineHeight={14}
          textAlign="center"
          style={{marginTop: 10, paddingHorizontal: 10}}
          size={12}
          color="#A1A1A1">
          Sell your giftcard to us and get paid in Naira instantly.
        </Text>
      </View>
    </View>
  );
};
