import React from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
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
    name: 'Receipts',
    Icon: <Icons.Clipboard size={24} />,
    onPress: navigation => {
      navigation.navigate('HistoryScreen');
    },
    backgroundColor: '#CBDB31',
    textColor: COLORS.darkBlue,
  },
  {
    name: 'Refer + Earn',
    Icon: <Icons.BombEmoji size={24} />,
    onPress: navigation => {
      navigation.navigate('ShareScreen');
    },
  },
  {
    name: 'Customers',
    Icon: <Icons.ChatRound size={24} />,
    onPress: navigation => {
      navigation.navigate('CustomersScreen');
    },
  },
];

const Button = ({item}) => {
  const {width} = useLayouts();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => item?.onPress?.(navigation)}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: item?.backgroundColor || '#E9E6F7',
        height: 50,
        borderRadius: 30,
        paddingHorizontal: 15,
      }}>
      <View activeOpacity={0.7} style={{marginRight: 10}}>
        {item.Icon}
      </View>

      <Text
        textAlign={'center'}
        numberOfLines={2}
        color={item?.textColor || '#151521'}
        size={12}
        bold
        style={{flex: 1}}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};
export const MenuButtons = () => {
  return (
    <View
      style={{
        ...style.con,
      }}>
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 20}}
        showsHorizontalScrollIndicator={false}
        horizontal>
        {menus.map(item => (
          <Button item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  con: {
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
