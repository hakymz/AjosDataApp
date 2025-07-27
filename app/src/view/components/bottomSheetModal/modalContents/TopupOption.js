import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Text} from '../../general';
import {PageList} from '../../lists';
import {fetchRequest} from '../../../../helper';
import {useUser} from '../../../../hooks';
import {useNavigation} from '@react-navigation/native';

export const TopupOption = ({}) => {
  const {user} = useUser();
  console.log(user);
  const navigation = useNavigation();
  const getAccount = async () => {
    try {
      const response = await fetchRequest({
        path: 'wallet/virtual-account?gateway=palmpay',
      });
    } catch (error) {}
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
      onPress: () => {
        getAccount();
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
    },
    {
      name: 'Opay Virtual Account',
      image: (
        <Image
          style={{height: 48, width: 48}}
          source={require('../../../../assets/images/others/opay.png')}
        />
      ),
    },
    {
      name: '9Payment Bank',
      image: (
        <Image
          style={{height: 28, width: 75}}
          source={require('../../../../assets/images/others/9bank.png')}
        />
      ),
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
              if (!user?.bvn) {
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
