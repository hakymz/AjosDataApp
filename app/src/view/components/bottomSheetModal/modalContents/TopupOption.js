import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Text} from '../../general';
import {PageList} from '../../lists';
import {extractError, fetchRequest} from '../../../../helper';
import {useUser} from '../../../../hooks';
import {useNavigation} from '@react-navigation/native';
import {NoAccountNumber} from './NoAccountNumber';
import {AccountDetails} from './AccountDetails';

export const TopupOption = ({}) => {
  const {user} = useUser();

  const isVerified =
    typeof user?.isVerified == 'string'
      ? JSON.parse(user?.isVerified)
      : user?.isVerified;

  const navigation = useNavigation();
  const getAccount = async (type, data) => {
    try {
      const response = await fetchRequest({
        path: `/wallet/virtual-account?gateway=${type}`,
        method: 'GET',
      });

      BottomSheets.show({
        component: <AccountDetails data={{...response?.data, ...data}} />,
      });
    } catch (error) {
      const message = extractError(error);
      if (message == 'Virtual account not found') {
        BottomSheets.show({
          component: <NoAccountNumber type={type} data={data} />,
        });
      }
    }
  };

  const list = [
    {
      name: 'Moniepoint Virtual Account',
      image: (
        <Image
          style={{height: 36, width: 36}}
          source={require('../../../../assets/images/others/moniepoint.png')}
        />
      ),
      bankName: 'Moniepoint',
      onPress: () => {
        getAccount('monnify', list[0]);
      },
    },
    {
      name: 'Palmpay Virtual Account',
      image: (
        <Image
          style={{height: 40, width: 40}}
          source={require('../../../../assets/images/others/palmpay.png')}
        />
      ),
      bankName: 'Palmpay',
      onPress: () => {
        getAccount('palmpay', list[1]);
      },
    },
    {
      name: 'Opay Virtual Account',
      image: (
        <Image
          style={{height: 48, width: 48}}
          source={require('../../../../assets/images/others/opay.png')}
        />
      ),
      bankName: 'Opay',
      onPress: () => {
        getAccount('opay', list[2]);
      },
    },
    {
      name: '9Payment Bank',
      image: (
        <Image
          style={{height: 28, width: 75}}
          source={require('../../../../assets/images/others/9bank.png')}
        />
      ),
      bankName: '9Payment',
      onPress: () => {
        getAccount('palmpay', list[3]);
      },
    },
  ];
  return (
    <View>
      <Text textAlign={'center'} size={22} bold>
        Add-funds to wallet
      </Text>
      <Text
        size={14}
        style={{marginTop: 5}}
        color={'#868D95'}
        textAlign={'center'}>
        Choose one out of the options below
      </Text>
      <View style={{paddingHorizontal: 20, marginTop: 50}}>
        {list?.map(item => (
          <PageList
            onPress={() => {
              BottomSheets.hide();
              if (!isVerified?.bvn) {
                navigation.navigate('KycScreen', {...item});
              } else {
                item?.onPress?.();
              }
            }}
            style={{height: 56}}
            children={
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
                {item?.image}
                <Text medium size={16}>
                  {item?.name}
                </Text>
              </View>
            }
            rightIcon={<></>}
          />
        ))}
      </View>
    </View>
  );
};
