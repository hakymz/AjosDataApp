import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, IMAGES} from '../../../../conts';
import {formatAmount} from '../../../../helper';
import {useUser} from '../../../../hooks';
import {selectNGNWallet, selectUSDWallet} from '../../../../selectors.js';
import {BottomSheets, CheckBox, Text} from '../../general';
import {Image} from '../../general/image';
import Line from '../../general/others/Line';
import {UsdTopupNote} from './UsdTopupNote';

const List = ({
  currencyName,
  currency,
  balance,
  sign,
  icon,
  selected,
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      disabled={disabled}
      style={{
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: !disabled ? 1 : 0.3,
      }}>
      <View style={{paddingRight: 10}}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}></View>
        <CheckBox isChecked={selected} />
      </View>
      <View style={{flex: 1}}>
        <Text size={16} semiBold>
          {currencyName}{' '}
          <Text
            size={12}
            semiBold
            color={!disabled ? COLORS.primary : COLORS.black}>
            ({currency})
          </Text>
        </Text>
        <Text style={{marginTop: 10}} size={11}>
          Available Balance
        </Text>
        <Text
          semiBold
          color={!disabled ? COLORS.primary : COLORS.black}
          size={14}>
          {sign}
          {formatAmount(balance)}
        </Text>
      </View>

      <View>
        <Image
          style={{height: s(20), width: s(20), borderRadius: 20}}
          source={icon}
        />
      </View>
    </TouchableOpacity>
  );
};
export const ChooseAccountTopup = () => {
  const {updateUserData, settings, data} = useUser();
  const nairaWallet = selectNGNWallet(data)?.balance || 0;
  const dollarWallet = selectUSDWallet(data)?.balance || 0;
  const [selected, setSelected] = React.useState('');

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
          setSelected('USD');
          setTimeout(() => {
            BottomSheets.show({
              component: <UsdTopupNote currency="USD" />,
              customSnapPoints: [380, 380],
            });
          }, 100);
        }}
        selected={selected}
        currencyName={'Receive Dollar'}
        currency="USD"
        balance={dollarWallet}
        icon={IMAGES.usaLogo}
        sign="$"
      />
      <Line style={{marginVertical: 25}} />
      <List
        disabled
        onPress={currency => {
          updateUserData({settings: {...settings, currency}});
          BottomSheets.hide();
        }}
        currencyName={'Receive Pounds'}
        currency="GBP"
        balance={0}
        icon={IMAGES.ukLogo}
        sign="£"
      />
      <Line style={{marginVertical: 25}} />
      <List
        disabled
        onPress={currency => {
          updateUserData({settings: {...settings, currency}});
          BottomSheets.hide();
        }}
        currencyName={'Receive Euros'}
        currency="EUR"
        balance={0}
        icon={IMAGES.euroLogo}
        sign="€"
      />
    </View>
  );
};
