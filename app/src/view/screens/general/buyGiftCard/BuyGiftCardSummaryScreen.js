import React from 'react';
import {ScrollView, View} from 'react-native';
import {COLORS, GENERAL} from '../../../../conts';
import {useLayouts} from '../../../../hooks';
import {
  BalanceContainer,
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {SectionList} from '../../../components/lists';
import {Image} from '../../../components/general/image';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {CardProccessing} from '../../../components/bottomSheetModal/content';
export const BuyGiftCardSummaryScreen = ({navigation, route}) => {
  const details = route?.params || {};
  let realAmount = 0;

  if (details?.denominationType == 'FIXED') {
  }

  if (details?.denominationType == 'FIXED') {
    realAmount = details.selectedDenominationsMap?.amount * details.quantity;
  } else {
    realAmount =
      (details?.minSenderDenomination / details?.minRecipientDenomination) *
      details?.amount *
      details.quantity;
  }

  const buyGiftCard = async pin => {
    try {
      const response = await fetchRequest({
        path: 'giftcard/order',
        data: {
          productId: details?.productId,
          quantity: details?.quantity,
          countryCode: details?.currencyCode,
          unitPrice: details?.amount,
          transactionPin: pin,
        },
        method: 'POST',
        pageError: {navigation},
      });

      navigation.navigate('HomeScreen');
      openSuccessScreen({
        navigation,
        btnTitle: 'View Transaction History',
        indicatorWidth: '100%',
        indicatorText: '100% complete',
        subTitle: 'All done, your GIFT CODE is located below',
        secondBtnText: 'View Gift Code(s)',
        secondBtnProceed: () => {
          BottomSheets.show({
            component: <CardProccessing />,
            customSnapPoints: [350, 350],
          });
        },
        proceed: () => navigation.navigate('HistoryNavigation'),
      });
    } catch (error) {
      console.log(error, 'error ....');
    }
  };

  const {minHeight} = useLayouts();
  const dataList = [
    {
      title: details?.brand?.brandName,
      des: 'Gift Card Brand',
      right: <View></View>,
    },
    {
      title: details?.productName,
      des: 'Gift Card Sub-category',
      right: (
        <View>
          <Image
            style={{height: 38, width: 38, borderRadius: 100}}
            source={{uri: details?.logoUrls[0]}}
          />
        </View>
      ),
    },
    {
      title: `${details?.amount} x ${details?.quantity}pcs`,
      des: 'Amount',
      right: (
        <Text semiBold lineHeight={24} size={20}>
          ₦{formatAmount(realAmount)}
        </Text>
      ),
    },
  ];
  return (
    <CustomSafeAreaView>
      <AppNav title={'Summary'} line />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
          paddingHorizontal: 20,
          minHeight: minHeight - 80,
        }}>
        <View style={{marginTop: 10}}>
          <SectionList item={dataList} />
          <BalanceContainer style={{marginTop: 10}} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingHorizontal: 0,
            paddingTop: 40,
          }}>
          <View
            style={{
              padding: 20,
              backgroundColor: '#F8F8F9',
              marginBottom: 20,
              borderRadius: 15,
            }}>
            <Text color={COLORS.primary} lineHeight={14} size={12}>
              <Text
                color={COLORS.primary}
                style={{textDecorationLine: 'underline'}}
                size={12}
                bold>
                TRADE TERMS:{' '}
              </Text>
              Understand that the amount payable can change if you upload in the
              wrong (sub)category. To be safe, please read the trade terms
              below: We are not liable for any error from you, please keep your
              card safe, and make sure no one is watching while you upload your
              card.
            </Text>
          </View>
          <View style={{paddingHorizontal: 30}}>
            <Button
              type="black"
              title={'Purchase'}
              onPress={() => {
                navigation.navigate('PinScreen', {
                  method: pin => {
                    buyGiftCard(pin);
                  },
                });
              }}
            />
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
