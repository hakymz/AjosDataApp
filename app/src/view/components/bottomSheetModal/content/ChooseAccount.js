import React from 'react';
import {View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, IMAGES} from '../../../../conts';
import {formatAmount} from '../../../../helper';
import {useUser} from '../../../../hooks';
import {selectNGNWallet, selectUSDWallet} from '../../../../selectors.js';
import {BottomSheets, CheckBox, Text} from '../../general';
import {Image} from '../../general/image';
import Line from '../../general/others/Line';

const List = ({
  currencyName,
  currency,
  balance,
  sign,
  icon,
  selected,
  onPress,
}) => {
  return (
    <View
      style={{
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{paddingRight: 10}}>
        <CheckBox onPress={() => onPress(currency)} isChecked={selected} />
      </View>
      <View style={{flex: 1}}>
        <Text size={16} semiBold>
          {currencyName}{' '}
          <Text size={12} semiBold color={COLORS.primary}>
            ({currency})
          </Text>
        </Text>
        <Text style={{marginTop: 10}} size={11}>
          Available Balance
        </Text>
        <Text semiBold color={COLORS.primary} size={14}>
          {sign}
          {formatAmount(balance)}
        </Text>
      </View>

      <View>
        <Image style={{height: s(20), width: s(20)}} source={icon} />
      </View>
    </View>
  );
};
export const ChooseAccount = () => {
  const {updateUserData, settings, data} = useUser();
  const nairaWallet = selectNGNWallet(data)?.balance || 0;
  const dollarWallet = selectUSDWallet(data)?.balance || 0;

  return (
    <View>
      <Text
        textAlign={'center'}
        style={{marginBottom: 30}}
        bold
        color={COLORS.primary}
        lineHeight={25}
        size={20}>
        Choose Account
      </Text>
      <List
        onPress={currency => {
          updateUserData({settings: {...settings, currency}});
          BottomSheets.hide();
        }}
        selected={settings?.currency == 'NGN'}
        currencyName={'Naira Account'}
        currency="NGN"
        balance={nairaWallet}
        icon={IMAGES.ngLogo}
        sign="₦"
      />
      <Line style={{marginVertical: 25}} />
      <List
        onPress={currency => {
          updateUserData({settings: {...settings, currency}});
          BottomSheets.hide();
        }}
        selected={settings?.currency == 'USD'}
        currencyName={'Dollar Account'}
        currency="USD"
        balance={dollarWallet}
        icon={IMAGES.usaLogo}
        sign="$"
      />
    </View>
  );
};
