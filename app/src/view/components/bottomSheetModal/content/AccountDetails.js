import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, GENERAL, IMAGES} from '../../../../conts';
import {Copy, fetchRequest, formatAmount} from '../../../../helper';
import {useTradeData, useUser} from '../../../../hooks';
import {BottomSheets, Button, CopyIcon, MyIcons, Text} from '../../general';
import Line from '../../general/others/Line';
import {SectionList} from '../../lists';
import {useQuery} from 'react-query';
import {selectNGNWallet, selectUSDWallet} from '../../../../selectors.js';
import {s} from 'react-native-size-matters';
import {UploadProfOfPayment} from './UploadProfOfPayment';
import Share from 'react-native-share';
export const AccountDetails = ({amount, currency}) => {
  console.log(currency, 'currency currencycurrency');
  let {settings: sysSettings, data} = useUser();
  const nairaWallet = selectNGNWallet(data);
  const usdWallet = selectUSDWallet(data);
  const {allRates} = useTradeData();
  let settings = {...sysSettings};
  if (currency) {
    settings.currency = currency;
  }

  const generateNairaAccount = async () => {
    try {
      const response = await fetchRequest({
        path: 'bank/ngn-virtual-account',
        method: 'GET',
        // displayMessage: false,
        showLoader: false,
      });

      console.log(response, 'response response');
      if (response?.status == 'success' && response?.data) {
        return response?.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
      //send the request after some seconds
    }
  };

  const {data: nairaAccountData, error} = useQuery({
    queryKey: 'generateNairaAccount',
    queryFn: generateNairaAccount,
    enabled: settings?.currency == 'NGN',
  });
  console.log(nairaAccountData, 'nairaAccountData');

  const sectionListData =
    settings?.currency == 'USD'
      ? [
          {
            title: 'Snapi Technologies Limited',
            des: 'Account Name',
            right: <CopyIcon text={'Snapi Technologies Limited'} />,
          },
          {
            title: 'Wise | Transferwise',
            des: 'Bank Name',
            right: <CopyIcon text={'Wise | Transferwise'} />,
          },
          {
            title: '8313118814',
            des: 'Account Number',
            right: <CopyIcon text={'8313118814'} />,
          },
          {
            title: 'CMFGUS33',
            des: 'Swift Code',
            right: <CopyIcon text={'CMFGUS33'} />,
          },
          {
            title:
              '30 W. 26th Street, Sixth Floor New York NY 10010, United States',
            des: 'Address',
            right: (
              <CopyIcon
                text={
                  '30 W. 26th Street, Sixth Floor New York NY 10010, United States'
                }
              />
            ),
          },
          {
            title: '026073008',
            des: 'Routing Number',
            right: <CopyIcon text={'026073008'} />,
          },
          {
            title: 'Savings Account',
            des: 'Account Type',
            right: <CopyIcon text={'Savings Account'} />,
          },
        ]
      : [
          {
            title: nairaAccountData?.bank_name,
            des: 'Bank Name',
            right: <CopyIcon />,
          },
          {
            title: nairaAccountData?.account_name,
            des: 'Account Name',
            right: <CopyIcon />,
          },

          {
            title: nairaAccountData?.account_number,
            des: 'Account Number',
            right: <CopyIcon />,
          },
        ];

  const accountDetailsString = `
  Account Name:Snapi Technologies Limited
  Bank Name:Wise | Transferwise
  Account Number:8313118814
  Swift Code:CMFGUS33
  Address:30 W. 26th Street, Sixth Floor New York NY 10010, United States
  Routing Number:026073008
  Account Type:Savings Account`;
  const nairaAccountDetails = `
  Bank Name:${nairaAccountData?.bank_name}
  Account Name:${nairaAccountData?.account_name}
  Account Number:${nairaAccountData?.account_number}
  `;

  return (
    <View style={{marginBottom: 30, minHeight: '85%'}}>
      <View style={styles.headerCon}>
        <Image
          style={{height: 20, width: 20, marginRight: 7}}
          source={settings?.currency == 'USD' ? IMAGES.usaLogo : IMAGES.ngLogo}
        />
        <Text bold color={COLORS.primary} lineHeight={25} size={20}>
          {settings?.currency == 'USD' ? 'Dollar Account' : 'Naira Account'}
        </Text>
        <Text size={12} color={COLORS.primary}>
          {settings?.currency == 'USD' ? ' (USD)' : ' (NGN)'}
        </Text>
      </View>

      <Line />
      <View style={styles.balanceCon}>
        <View>
          <Text color={'#0F1819'} style={{flex: 1}} numberOfLines={1} size={12}>
            {settings?.currency == 'USD'
              ? 'Send this Amount'
              : 'Current Balance'}
          </Text>
          {settings.currency == 'USD' && (
            <Text
              color={'#0F1819'}
              style={{flex: 1}}
              numberOfLines={1}
              size={12}>
              Rate -{' '}
              <Text size={12} semiBold color={COLORS.primary}>
                {allRates?.currency_swap?.rate}/$
              </Text>
            </Text>
          )}
        </View>

        <Text
          textAlign={'right'}
          style={{flex: 1, paddingLeft: 20}}
          numberOfLines={1}
          semiBold
          lineHeight={25}
          color={COLORS.primary}
          size={20}>
          {settings?.currency == 'USD' ? GENERAL.dollarSign : GENERAL.nairaSign}
          {settings?.currency == 'USD'
            ? formatAmount(amount)
            : nairaWallet?.balance}
        </Text>
      </View>
      {nairaAccountData && settings?.currency == 'NGN' && (
        <View>
          <Text
            lineHeight={15}
            size={12}
            semiBold
            style={{paddingHorizontal: 40, marginTop: 20}}>
            {`${
              settings?.currency == 'USD'
                ? 'Add funds to your account by sending a SWIFT or Wire Transfer'
                : 'You can only add fund in Naira (NGN) by transfer to the unique account provided below'
            }`}
          </Text>

          <View style={{paddingHorizontal: 20, marginTop: 20}}>
            <SectionList item={sectionListData} />
          </View>

          <View
            style={{
              paddingHorizontal: 40,
              marginTop: 20,
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <Button
              type="black"
              title={'Share Account details'}
              onPress={() => {
                Share.open({
                  title: 'Account details',
                  message: nairaAccountDetails,
                });
              }}
            />
          </View>
        </View>
      )}

      {settings?.currency == 'USD' && (
        <View>
          <Text
            lineHeight={15}
            size={12}
            semiBold
            style={{paddingHorizontal: 40, marginTop: 20}}>
            {`${
              settings?.currency == 'USD'
                ? 'Add funds to your account by sending a SWIFT or Wire Transfer'
                : 'You can only add fund in Naira (NGN) by transfer to the unique account provided below'
            }`}
          </Text>

          <View style={{paddingHorizontal: 20, marginTop: 20}}>
            <SectionList item={sectionListData} />
          </View>

          <View
            style={{
              paddingHorizontal: 40,
              marginTop: 20,
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            {settings?.currency == 'USD' ? (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    Share.open({
                      title: 'Snapi account details',
                      message: accountDetailsString,
                    });
                  }}
                  style={{
                    height: s(50),
                    width: s(50),
                    backgroundColor: '#EFEFEF',
                    borderRadius: 50,
                    marginRight: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MyIcons.Share size={23} />
                </TouchableOpacity>
                <Button
                  onPress={() => {
                    BottomSheets.show({
                      component: <UploadProfOfPayment amount={amount} />,
                      customSnapPoints: [500, 500],
                    });
                  }}
                  titleStyle={{fontSize: 15}}
                  style={{width: 'auto', flex: 1}}
                  type="black"
                  title={'Upload Payment proof'}
                />
              </View>
            ) : (
              <Button
                type="black"
                title={'Share Account details'}
                onPress={() => {
                  Alert('Yesss');
                  Share.open({
                    title: 'Account details',
                    message: nairaAccountDetails,
                  });
                }}
              />
            )}
          </View>
        </View>
      )}
      {!nairaAccountData && settings?.currency == 'NGN' && (
        <View>
          <ActivityIndicator color={COLORS.primary} size={'large'} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    alignItems: 'center',
  },
  balanceCon: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 35,
  },
});
