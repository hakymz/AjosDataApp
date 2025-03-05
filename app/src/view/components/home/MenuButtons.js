import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';
import {BottomSheets, Icons, MyIcons} from '../general';
import {Text} from '../general';
import {COLORS, MESSAGES} from '../../../conts';
import {
  ChooseAccountTopup,
  Country,
  CreateDollarCard,
  GiftCardOptions,
  Topup,
} from '../bottomSheetModal/content';
import {useNavigation} from '@react-navigation/native';
import {useLayouts, useOrientation} from '../../../hooks';
import Line from '../general/others/Line';
import Toast from '../toast/Toast';
import {TopupWallet} from '../bottomSheetModal/contents';
// import Intercom from '@intercom/intercom-react-native';

const menus = [
  {
    name: 'Fund wallet',
    Icon: <Icons.PlusCircle size={22} />,
    onPress: () => {
      BottomSheets.show({
        component: <TopupWallet />,
        customSnapPoints: [580, 580],
      });
    },
  },
  {
    name: 'Customers',
    Icon: <Icons.DoublePerson size={22} />,
    onPress: navigation => {
      navigation.navigate('CustomersScreen');
    },
  },

  {
    name: 'Refer | Earn',
    Icon: <Icons.Share size={22} />,
    onPress: navigation => {
      navigation.navigate('ShareScreen');
    },
  },
  {
    name: 'Live Chat',
    Icon: <Icons.LiveChat size={22} />,
    onPress: () => {
      Intercom.present();
    },
  },
];

const Button = ({item}) => {
  const {width} = useLayouts();
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={() => item?.onPress?.(navigation)}
        style={style.btn}>
        <View activeOpacity={0.7} style={style.iconCon}>
          {item.Icon}
        </View>
      </TouchableOpacity>
      <Text
        textAlign={'center'}
        numberOfLines={2}
        color={COLORS.black}
        size={12}
        fontWeight={'700'}
        style={{flex: 1, marginTop: 10}}>
        {item.name}
      </Text>
    </View>
  );
};
export const MenuButtons = () => {
  return (
    <View
      style={{
        ...style.con,
      }}>
      {menus.map(item => (
        <Button item={item} />
      ))}
    </View>
  );
};

const style = StyleSheet.create({
  con: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'space-between',
    marginTop: 20,
    flexDirection: 'row',
  },
  iconCon: {
    height: s(40),
    width: s(40),
    backgroundColor: COLORS.light,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 53,
    width: 53,
    flex: 1,
    height: '100%',
  },
});
