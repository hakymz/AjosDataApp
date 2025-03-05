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
import {OpayOption} from './OpayOption';
import {MonniePointOption} from './MonniePointOption';

const List = ({item}) => {
  return (
    <PageList
      onPress={() => {
        item?.onPress();
      }}>
      <Text size={16} fontWeight={'500'} color={COLORS.blue}>
        {item?.name}
      </Text>
      {item?.mainIcon || (
        <Image
          style={{height: 36, width: 36, marginRight: 5, borderRadius: 100}}
          source={item?.icon}
        />
      )}
    </PageList>
  );
};
export const TopupWallet = () => {
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
      console.log(response);

      return response;
    } catch (error) {}
  };
  const topupProvidersList = [
    {
      name: 'Moniepoint',
      icon: IMAGES.moniepoint,
      onPress: () => {
        if (!bvnVerified && !ninVerified) {
          BottomSheets.show({
            component: <VerifyBVN wallet={'Moniepoint'} />,
            customSnapPoints: [570, 570],
          });
        } else {
          BottomSheets.hide();
          // navigation.navigate('TopUpAmountScreen', {
          //   proceed: async amount => {
          //     const data = await generateAccountNumber(
          //       'moniepoint',
          //       'bank',
          //       amount,
          //     );
          //     const accountDetails = data?.data?.responseBody;

          //     if (accountDetails) {
          //       BottomSheets.show({
          //         component: (
          //           <AccountDetails
          //             details={{
          //               accountName: accountDetails?.accountName,
          //               accountNumber: accountDetails?.accountNumber,
          //               bankName: accountDetails?.bankName,
          //               name: 'Moniepoint',
          //               image: IMAGES.moniepoint,
          //             }}
          //           />
          //         ),
          //       });
          //     }
          //   },
          // });
          BottomSheets.show({
            component: <MonniePointOption />,
            customSnapPoints: [570, 570],
          });
        }
      },
    },
    {
      name: 'Paystack',
      icon: IMAGES.paystack,
      onPress: () => {
        try {
          // if (!bvnVerified) {
          //   BottomSheets.show({
          //     component: <VerifyBVN wallet={'Paystack'} />,
          //     customSnapPoints: [570, 570],
          //   });
          // } else {

          // }

          BottomSheets.hide();
          navigation.navigate('TopUpAmountScreen', {
            proceed: async amount => {
              const response = await generateAccountNumber(
                'paystack',
                'bank',
                amount * 1 + 20,
              );

              if (response?.data?.authorization_url) {
                openBrowser(response?.data?.authorization_url || '');
              }
            },
          });
        } catch (error) {
          console.log(error, 'error noww');
        }
      },
    },
    {
      name: 'Bank Transfer',
      mainIcon: <Icons.Bank size={20} />,
      onPress: () => {
        BottomSheets.hide();
        navigation.navigate('TopUpAmountScreen', {
          proceed: async amount => {
            try {
              const data = await generateAccountNumber('opay', 'bank', amount);

              const accountDetails = data?.data;

              if (accountDetails?.cashierUrl) {
                openBrowser(accountDetails?.cashierUrl);
              }
            } catch (error) {
              console.log(error);
            }
          },
        });
      },
    },

    {
      name: 'Opay Wallet',
      // mainIcon: <Icons.Vault size={20} />,
      icon: IMAGES.opay,
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
        Choose a payment method
      </Text>

      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: '#9BB3FF',
          backgroundColor: '#EFF1FB',
          marginTop: 10,
          borderRadius: 10,
        }}>
        <Text size={12} bd color={COLORS.blue}>
          NB: A fee of 20 will be charged on any Payment made
        </Text>
      </View>
      <View style={{flex: 1, marginTop: 20}}>
        {topupProvidersList?.map(item => (
          <List item={item} />
        ))}
      </View>

      <View style={{paddingTop: 20}}>
        <Text lineHeight={16} color={'#828282'} size={12} fontWeight={'400'}>
          Select what method you will like to use toTop-up your Data Seller
          Wallet.
        </Text>
        <Text
          style={{marginTop: 20}}
          lineHeight={16}
          color={'#828282'}
          size={12}
          fontWeight={'800'}>
          NB: A fee of 20 will be charged on any Payment made
        </Text>
      </View>
    </View>
  );
};
