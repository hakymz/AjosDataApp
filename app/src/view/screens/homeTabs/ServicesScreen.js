import React from 'react';
import {Image, ScrollView, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, GENERAL, IMAGES, MESSAGES} from '../../../conts';
import {useUser} from '../../../hooks';

import {
  AccountDetails,
  Country,
  KycRequired,
  Payoneer,
  Paypal,
  UsdTopupNote,
} from '../../components/bottomSheetModal/content';
import {
  BottomSheets,
  CustomSafeAreaView,
  Icons,
  MyIcons,
  Text,
} from '../../components/general';
import {Header} from '../../components/layouts';
import {SectionList} from '../../components/lists';
import Toast from '../../components/toast/Toast';

export const ServicesScreen = ({navigation, route}) => {
  const {settings, data} = useUser();
  const sectionListData = [
    {
      icon: <MyIcons.BankGreen size={20} />,
      title: 'Sell Data',
      des: 'Buy from us and Sell to your customers',
      desStyle: {fontSize: s(12)},
      onPress: () => navigation.navigate('WithdrawScreen', {title: 'Transfer'}),
    },
    {
      icon: <MyIcons.SellGiftCard size={20} />,
      title: 'Sell Airtime',
      des: 'Get Airtime at lower rates than usual',
      desStyle: {fontSize: s(12)},
      onPress: () => {
        navigation.navigate('SellGiftCardScreen');
      },
    },
    {
      icon: <MyIcons.CardGreen size={20} />,
      title: 'Bulk SMS',
      des: 'Stay professional with Bulk SMS',
      desStyle: {fontSize: s(12)},
      onPress: () => {},
    },
    {
      icon: <Image source={IMAGES.payoneer} style={{height: 22, width: 22}} />,
      title: 'Payoneer Exchange',
      des: 'Sell or receive Payoneer funds for Naira',
      desStyle: {fontSize: s(12)},
      onPress: () =>
        BottomSheets.show({
          component: <Payoneer />,
          customSnapPoints: [420, 420],
        }),
    },
    {
      icon: <Image source={IMAGES.paypal} style={{height: 22, width: 22}} />,
      title: 'PayPal Exchange',
      des: 'Sell or receive PayPal funds for Naira',
      desStyle: {fontSize: s(12)},
      onPress: () =>
        BottomSheets.show({
          component: <Paypal />,
          customSnapPoints: [420, 420],
        }),
    },
    {
      icon: <MyIcons.DollarCardGreen size={20} />,
      title: 'Dollar Card',
      des: 'Make internal payments in dollars',
      desStyle: {fontSize: s(12)},
      onPress: () => {
        Toast.show('success', MESSAGES.comingSoon);
        return;

        navigation.navigate('DollarCardScreen');
      },
    },
    {
      icon: <MyIcons.PayBills size={20} />,
      title: 'Bill Payment',
      des: 'Pay your bills and get token in seconds',
      desStyle: {fontSize: s(12)},
      onPress: () => navigation.navigate('BillsScreen'),
    },
    {
      icon: <MyIcons.TopUpGreen size={21} />,
      title: 'Top-up USD or NGN wallet',
      des: 'Add Dollars or Naira to your wallet',
      desStyle: {fontSize: s(12)},
      onPress: () => {
        if (settings.currency == 'NGN' && !data?.generatedAccount?.naira) {
          Toast.show('success', MESSAGES.comingSoon);
          return;
        }

        if (
          data?.user?.kycStatus == 'NULL' ||
          data?.user?.kycStatus == 'pending' ||
          data?.user?.kycStatus == 'failed'
        ) {
          BottomSheets.show({
            component: <KycRequired />,
            customSnapPoints: [350, 350],
          });
        } else if (settings?.currency == GENERAL.USD) {
          BottomSheets.show({
            component: <UsdTopupNote />,
            customSnapPoints: [380, 380],
          });
        } else if (
          settings?.currency == GENERAL.NGN &&
          data?.generatedAccount?.naira
        ) {
          BottomSheets.show({
            component: <AccountDetails currency={'NGN'} />,
            customSnapPoints:
              settings?.currency == GENERAL.USD
                ? ['85%', '85%']
                : ['75%', '75%'],
          });
        }
      },
    },
    {
      icon: <MyIcons.SendGreen size={21} />,
      title: 'Send - Withdrawal',
      des: 'Send funds to USD or NGN bank',
      desStyle: {fontSize: s(12)},
      onPress: () => navigation.navigate('WithdrawScreen'),
    },
    {
      icon: <MyIcons.UserGreen size={21} />,
      title: 'User-User Transfer',
      des: 'Send/receive money on Snapi',
      desStyle: {fontSize: s(12)},
      onPress: () => navigation.navigate('TransferScreen'),
    },
  ];
  return (
    <CustomSafeAreaView style={{backgroundColor: COLORS.background}}>
      <Header text="Services offered" />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: GENERAL.platform == 'ios' ? 80 : 100,
        }}>
        <View
          style={{
            height: 115,
            backgroundColor: COLORS.black,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}>
          <View>
            <Text
              style={{marginBottom: 20, marginTop: 20, paddingHorizontal: 60}}
              size={13}
              color={COLORS.white}>
              How can we serve you today?
            </Text>
          </View>
        </View>

        <View>
          <SectionList
            style={{
              backgroundColor: COLORS.white,
              paddingTop: 20,
              top: -40,
              marginHorizontal: 20,
            }}
            item={sectionListData}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
