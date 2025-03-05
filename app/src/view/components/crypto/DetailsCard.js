import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../conts';
import {fetchRequest} from '../../../helper';
import {useTradeData} from '../../../hooks';
import {
  BuyCrypto,
  ExternalCryptoWallet,
  SellCrypto,
} from '../bottomSheetModal/content';
import {BottomSheets, Icons, Text} from '../general';
import {Button} from './Button';
import {Form} from './sell/Form';

const generateExternalWalletAddress = async coin => {
  BottomSheets.hide();
  try {
    const response = await fetchRequest({
      path: 'crypto/create-wallet',
      data: {
        coinCode: coin?.unit?.toLowerCase(),
        environment: 'test',
      },
    });

    if (response.status == 'success' && response?.data) {
      BottomSheets.show({
        component: (
          <ExternalCryptoWallet
            details={{address: response?.data?.address, ...coin}}
          />
        ),
        customSnapPoints: [660, 660],
      });
    } else {
      Toast.show('error', response?.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const DetailsCard = ({coin, buyRate}) => {
  const {convertCurrency} = useTradeData();

  React.useEffect(() => {
    convertCurrency(coin.unit, 'USD');
  }, []);
  const enabledSellCoins = {BTC: true, TRX: true, LTC: true};
  const SellButtonIcon = () => {
    if (!enabledSellCoins[coin?.unit]) {
      return (
        <Icons.ArrowWhite size={18} style={{transform: [{rotate: '180deg'}]}} />
      );
    }

    if (coin?.unit == 'BTC' || coin?.unit == 'USDT') {
      return (
        <Icons.Arrow size={18} style={{transform: [{rotate: '180deg'}]}} />
      );
    }

    return (
      <Icons.ArrowWhite size={18} style={{transform: [{rotate: '180deg'}]}} />
    );
  };

  return (
    <View
      style={{
        borderRadius: 15,
        backgroundColor: '#F3F7FF',
        marginTop: 10,
        padding: 20,
        justifyContent: 'center',
      }}>
      <View style={{flexDirection: 'row', width: '100%'}}>
        <Image
          style={{height: s(86), width: s(86), resizeMode: 'contain'}}
          source={coin?.avatar}
        />
        <View style={{flex: 1, marginLeft: 10, marginTop: 10}}>
          <Text
            lineHeight={14}
            color={COLORS.primary}
            medium
            size={12}
            numberOfLines={3}>
            Dont be left out trading Crypto With amazing rates with Amazing
            speed.
          </Text>
          <Text lineHeight={18} style={{marginTop: 5}} color={COLORS.lightBlue}>
            {coin.unit} Rate | ₦{buyRate?.ratePerDollar}/$
          </Text>
        </View>
      </View>
      {/* Buttons section */}
      <View style={{marginTop: 20}}>
        <Button
          disabled={coin.unit != 'BTC'}
          iconConBackgroundColor={coin.unit != 'BTC' ? '#C2CFEE' : '#402274'}
          icon={
            coin.unit != 'BTC' ? (
              <Icons.ArrowWhite size={18} />
            ) : (
              <Icons.Arrow size={18} />
            )
          }
          title={'Buy ' + coin.unit}
          onPress={() =>
            BottomSheets.show({
              component: <BuyCrypto coin={coin} />,
              backgroundColor: COLORS.white,
              customSnapPoints: [620, 620],
            })
          }
          backgroundColor={coin.unit != 'BTC' ? '#D0DBF7' : COLORS.primary}
        />

        <Button
          iconConBackgroundColor={
            !enabledSellCoins[coin?.unit] ? '#C2CFEE' : '#5E70C2'
          }
          disabled={!enabledSellCoins[coin?.unit]}
          onPress={() => generateExternalWalletAddress(coin)}
          icon={<SellButtonIcon />}
          title={'Receive ' + coin.unit}
          backgroundColor={
            !enabledSellCoins[coin?.unit] ? '#D0DBF7' : COLORS.lightBlue
          }
        />

        <Button
          iconConBackgroundColor={
            !enabledSellCoins[coin?.unit] ? '#C2CFEE' : '#2D994A'
          }
          disabled={!enabledSellCoins[coin?.unit]}
          onPress={() =>
            BottomSheets.show({
              component: <Form coin={coin} />,
              backgroundColor: COLORS.white,
              customSnapPoints: [600, 600],
            })
          }
          icon={<SellButtonIcon />}
          title={'Sell ' + coin.unit}
          backgroundColor={
            !enabledSellCoins[coin?.unit] ? '#D0DBF7' : COLORS.green
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
