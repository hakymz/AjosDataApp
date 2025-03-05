import React from 'react';
import {
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {CreditCard} from '../../../components/creditCard';
import {CustomSafeAreaView, MyIcons, Text} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {SectionList} from '../../../components/lists';

const MenuBtn = ({item}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          item?.onPress?.();
        }}
        style={style.iconCon}>
        {item?.icon}
      </TouchableOpacity>
      <Text semiBold size={12} color={COLORS.primary}>
        {item?.name}
      </Text>
    </View>
  );
};
const MenuList = () => {
  const menuList = [
    {
      name: 'Top-up',
      icon: <MyIcons.TopupBlack size={32} />,
      onPress: () => {},
    },
    {name: 'Withdraw', icon: <MyIcons.Minus size={19} />, onPress: null},
    {name: 'Lock card', icon: <MyIcons.LockCard size={19} />, onPress: null},
  ];
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 10,
        marginTop: 25,
      }}>
      {menuList.map(item => (
        <MenuBtn item={item} />
      ))}
    </View>
  );
};

export const DollarCardScreen = () => {
  const CopyIcon = ({text}) => (
    <MyIcons.Copy size={18} onPress={() => Copy(text)} />
  );
  const sectionListData = [
    {
      title: 'Bola Ahmed Tinubu',
      des: 'Name on Card',
      right: <CopyIcon />,
    },
    {title: '4236 4775 3884 3774', des: 'Card Number', right: <CopyIcon />},
    {title: '10/2025', des: 'Expiry Date', right: <CopyIcon />},
    {title: '634', des: 'CVC', right: <CopyIcon />},
    {
      title: '256 Chapman Road STE 105-4',
      des: 'Billing Address',
      right: <CopyIcon />,
    },
    {
      title: 'Newark',
      des: 'City',
      right: <CopyIcon />,
    },
    {
      title: 'Delaware',
      des: 'State',
      right: <CopyIcon />,
    },
    {
      title: '19702',
      des: 'Zip Code',
      right: <CopyIcon />,
    },
  ];
  return (
    <CustomSafeAreaView style={{backgroundColor: COLORS.background}}>
      <AppNav
        title={'Virtual Dollar Card'}
        backgroundColor={COLORS.background}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: COLORS.background,
          paddingHorizontal: 20,
          marginTop: 10,
          paddingBottom: 40,
        }}>
        <CreditCard />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
          }}>
          <View
            style={{
              backgroundColor: '#F1F1F1',
              paddingHorizontal: 15,
              padding: 3,
              borderRadius: 20,
            }}>
            <Text semiBold size={12} color={'#9C9C9C'}>
              Virtual Card
            </Text>
          </View>
        </View>
        <MenuList />
        <View style={{marginTop: 30}}>
          <SectionList
            style={{backgroundColor: COLORS.white}}
            item={sectionListData}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  con: {
    height: 310,
    backgroundColor: COLORS.yellow,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  iconCon: {
    height: 42,
    width: 42,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
