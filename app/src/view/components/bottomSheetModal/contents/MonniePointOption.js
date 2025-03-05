import React from 'react';
import {Image, View} from 'react-native';
import {BottomSheets, Button, Icons, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {PageList} from '../../lists';
import {COLORS, IMAGES} from '../../../../conts';
import {AccountDetails} from './AccountDetails';
import {useNavigation} from '@react-navigation/native';
import {fetchRequest, openBrowser} from '../../../../helper';
import {useUser} from '../../../../hooks';
import {VerifyBVN} from './VerifyBVN';
import {OpayQRScanCode} from './OpayQRScanCode';

const List = ({item}) => {
  return (
    <PageList
      onPress={() => {
        item?.onPress();
      }}>
      <Text size={16} fontWeight={'500'} color={COLORS.blue}>
        {item?.name}
      </Text>
      {item?.icon}
    </PageList>
  );
};
export const MonniePointOption = () => {
  const navigation = useNavigation();
  const {data} = useUser();

  const bvnVerified = data?.user?.isVerified?.bvn;
  const ninVerified = data?.user?.isVerified?.nin;

  const generateAccountNumber = async (
    gateway = 'moniepoint',
    type = 'bank',
    amount = '',
  ) => {
    try {
      const response = await fetchRequest({
        path: `/wallet/top-up?gateway=${gateway}&type=${type}`,
        data: {amount: amount * 1},
      });

      return response;
    } catch (error) {
      console.log(error, 'errrr');
    }
  };

  const generateAccountNumberOrGetMoniePointAccountNo = async () => {
    try {
      const response = await fetchRequest({
        path: !data?.user?.virtualAccount
          ? `/wallet/virtual-account?gateway=moniepoint`
          : `wallet/my-virtual-account?gateway=moniepoint`,
        method: data?.user?.virtualAccount ? 'GET' : 'POST',
      });

      return response;
    } catch (error) {
      console.log(error, 'errorrr');
    }
  };
  const topupProvidersList = [
    {
      name: 'Bank Transfer',
      icon: <Icons.Bank size={20} />,
      onPress: async () => {
        if (!bvnVerified && !ninVerified) {
          BottomSheets.show({
            component: <VerifyBVN wallet={'Moniepoint'} />,
            customSnapPoints: [570, 570],
          });
        } else {
          BottomSheets.hide();
          const data = await generateAccountNumberOrGetMoniePointAccountNo(
            'moniepoint',
          );

          const accountDetails = data?.data?.body?.responseBody?.accounts?.[0];

          if (accountDetails) {
            BottomSheets.show({
              component: (
                <AccountDetails
                  details={{
                    accountName: accountDetails?.accountName,
                    accountNumber: accountDetails?.accountNumber,
                    bankName: accountDetails?.bankName,
                    name: 'Moniepoint',
                    image: IMAGES.moniepoint,
                  }}
                />
              ),
            });
          }
        }
      },
    },
    {
      name: 'Card Payment',
      icon: <Icons.Vault size={20} />,
      onPress: () => {
        if (!bvnVerified && !ninVerified) {
          BottomSheets.show({
            component: <VerifyBVN wallet={'Moniepoint'} />,
            customSnapPoints: [570, 570],
          });
        } else {
          BottomSheets.hide();
          navigation.navigate('TopUpAmountScreen', {
            proceed: async amount => {
              const data = await generateAccountNumber(
                'moniepoint',
                'card',
                amount * 1 + 20,
              );

              const accountDetails =
                data?.data?.responseBody?.checkoutUrl || '';

              navigation?.goBack();
              if (accountDetails) {
                openBrowser(accountDetails);
              }
            },
          });
        }
      },
    },
  ];
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Top-up Wallet
      </Text>
      <Text
        size={14}
        fontWeight={'500'}
        style={{marginTop: 30, paddingLeft: 10}}>
        Choose a Moniepoint payment method
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
        <Image
          style={{height: 63, width: 63, borderRadius: 10, marginRight: 5}}
          source={IMAGES.moniepoint}
        />
        <Text md color={COLORS.blue} size={25}>
          Moniepoint Payment
        </Text>
      </View>
      <View style={{flex: 1, marginTop: 20}}>
        {topupProvidersList?.map(item => (
          <List item={item} />
        ))}
      </View>

      <View style={{paddingTop: 20}}>
        <Text lineHeight={16} color={'#828282'} size={12} fontWeight={'400'}>
          Get a fixed Moniepoint account number or pay using your Debit card.
        </Text>
      </View>
    </View>
  );
};
