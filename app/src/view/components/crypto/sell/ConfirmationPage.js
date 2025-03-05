import React from 'react';
import {View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, FONTS} from '../../../../conts';
import {fetchRequest, formatAmount, trimString} from '../../../../helper';
import {TransactionStatusModal} from '../../bottomSheetModal';
import {NotifyYou} from '../../bottomSheetModal/content';
import {BottomSheets, Button, Icons, Text} from '../../general';

export const ConfirmationPage = ({amount, buyRate, coin, convertedPrice}) => {
  console.log(amount, 'amountr');
  console.log(convertedPrice?.rate, 'amountr');
  const convertCryptoToNaira = async () => {
    try {
      const response = await fetchRequest({
        path: 'crypto/sell',
        data: {
          amount: amount / convertedPrice?.rate,
          basecurrency: coin?.unit,
          currency: 'NGN',
        },
      });
      if (
        response.status == 'success' &&
        response?.data?.mywallet?.length > 0
      ) {
        BottomSheets.show({
          component: <NotifyYou />,
          customSnapPoints: [500, 500],
        });
      } else {
        TransactionStatusModal({type: 'error', message: response?.message});
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{marginTop: 10}}>
      <View
        style={{
          height: s(86),
          backgroundColor: COLORS.blueGrey,
          borderRadius: 20,
          paddingHorizontal: 20,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <Text
          fontType={FONTS.FREDOKA}
          numberOfLines={1}
          style={{width: '80%'}}
          lineHeight={42}
          size={35}
          color={COLORS.voodoo}
          textAlign="right">
          ${amount}
        </Text>
      </View>
      <View
        style={{marginTop: 10, alignItems: 'flex-end', paddingHorizontal: 10}}>
        <Text
          style={{width: '80%'}}
          numberOfLines={1}
          size={16}
          semiBold
          color={COLORS.lightBlue}
          textAlign="right">
          Equivalent -{' '}
          {!isNaN((amount / convertedPrice?.rate).toString?.())
            ? trimString(amount / convertedPrice?.rate, 9)
            : '0.00'}{' '}
          {coin?.unit}
        </Text>
        <Text
          style={{marginTop: 2, width: '100%'}}
          numberOfLines={1}
          size={14}
          medium
          color={COLORS.lightBlue}
          textAlign="right">
          Fees included - 0.00543 BTC | $4.64
        </Text>
      </View>
      <View
        style={{
          height: s(86),
          backgroundColor: COLORS.blueGrey,
          borderRadius: 20,
          paddingHorizontal: 20,
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 40,
          flexDirection: 'row',
        }}>
        <Icons.Naira
          color={COLORS.voodoo}
          style={{marginTop: 10, height: 40, width: 20, marginRight: 5}}
        />
        <Text
          fontType={FONTS.FREDOKA}
          numberOfLines={1}
          style={{maxWidth: '80%'}}
          lineHeight={42}
          size={35}
          color={COLORS.voodoo}
          textAlign="right">
          {formatAmount(amount * buyRate?.ratePerDollar)}
        </Text>
      </View>
      <View
        style={{
          marginTop: 10,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            height: 4,
            width: 4,
            backgroundColor: COLORS.lightBlue,
            borderRadius: 10,
            marginRight: 10,
          }}
        />
        <Text medium textAlign="right" color={COLORS.lightBlue}>
          will be credited in your wallet
        </Text>
      </View>

      <Button
        style={{
          marginTop: 50,
          backgroundColor: COLORS.green,
        }}
        onPress={() => {
          convertCryptoToNaira();
        }}
        title={'Complete Transaction'}
        rightIcon={<Icons.CircleArrowWhite />}
      />
    </View>
  );
};
