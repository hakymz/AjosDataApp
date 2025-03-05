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
export const OpayOption = () => {
  const navigation = useNavigation();
  const {data} = useUser();
  const bvnVerified = data?.user?.isVerified?.bvn;
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
    } catch (error) {}
  };
  const topupProvidersList = [
    {
      name: 'Bank Transfer',
      icon: <Icons.Bank size={20} />,
      onPress: () => {
        BottomSheets.hide();
        navigation.navigate('TopUpAmountScreen', {
          proceed: async amount => {
            const data = await generateAccountNumber('opay', 'bank', amount);

            const accountDetails = data?.data?.nextAction;

            if (accountDetails) {
              BottomSheets.show({
                component: (
                  <AccountDetails
                    details={{
                      accountName: 'OPAY',
                      accountNumber: accountDetails?.transferAccountNumber,
                      bankName: accountDetails?.transferBankName,
                      name: 'Opay',
                      image: IMAGES.opay,
                    }}
                  />
                ),
              });
            }
          },
        });
      },
    },
    {
      name: 'Opay Wallet',
      icon: <Icons.Vault size={20} />,
      onPress: () => {
        // if (!bvnVerified) {
        //   BottomSheets.show({
        //     component: <VerifyBVN wallet={'Moniepoint'} />,
        //     customSnapPoints: [570, 570],
        //   });
        // } else {

        // }

        BottomSheets.hide();
        navigation.navigate('TopUpAmountScreen', {
          proceed: async amount => {
            const data = await generateAccountNumber('opay', 'wallet', amount);

            const accountDetails = data?.data;

            if (accountDetails?.cashierUrl) {
              openBrowser(accountDetails?.cashierUrl);
            }
          },
        });
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
        Choose a Opay payment method
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
        <Image style={{height: 63, width: 63}} source={IMAGES.opay} />
        <Text md color={COLORS.blue} size={25}>
          Opay Payment
        </Text>
      </View>
      <View style={{flex: 1, marginTop: 20}}>
        {topupProvidersList?.map(item => (
          <List item={item} />
        ))}
      </View>

      <View style={{paddingTop: 20}}>
        <Text lineHeight={16} color={'#828282'} size={12} fontWeight={'400'}>
          Select what Opay method you will like to use toTop-up your Data Seller
          Wallet.
        </Text>
      </View>
    </View>
  );
};
