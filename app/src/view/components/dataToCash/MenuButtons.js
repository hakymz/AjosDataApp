import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {BottomSheets, Icons} from '../general';
import {Text} from '../general';
import {COLORS} from '../../../conts';
import {useNavigation} from '@react-navigation/native';
import {useLayouts} from '../../../hooks';

import {
  AddNumberDataToCash,
  WithdrawDataToCash,
} from '../bottomSheetModal/contents';
// import Intercom from '@intercom/intercom-react-native';

const Button = ({item}) => {
  const {width} = useLayouts();
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={() => item?.onPress?.(navigation)}
        style={{...style.btn}}>
        <View
          activeOpacity={0.7}
          style={{
            ...style.iconCon,
            backgroundColor: item?.backgroundColor || '#F9F4F4',
          }}>
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
export const MenuButtons = ({balance}) => {
  const navigation = useNavigation();
  const menus = [
    {
      name: 'Add Number',
      Icon: <Icons.PlusCircle size={22} />,
      onPress: () => {
        BottomSheets.show({
          component: <AddNumberDataToCash />,
        });
      },
    },
    {
      name: 'Withdraw',
      Icon: <Icons.Cash size={22} />,
      onPress: () => {
        BottomSheets.show({
          component: <WithdrawDataToCash balance={balance} />,
        });
      },
    },

    {
      name: 'History',
      Icon: <Icons.History size={22} />,
      onPress: () => {
        navigation.navigate('HistoryNavigation');
      },
    },
    {
      name: 'Chat Support',
      Icon: <Icons.ChatGreen size={22} />,
      onPress: () => {
        Intercom.present();
      },
      backgroundColor: '#EDF9F3',
    },
  ];
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
    height: 53,
    width: 53,
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
