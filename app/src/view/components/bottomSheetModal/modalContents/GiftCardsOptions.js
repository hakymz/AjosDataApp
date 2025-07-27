import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Text} from '../../general';
import {PageList} from '../../lists';
import {useNavigation} from '@react-navigation/native';

export const GiftCardsOptions = ({}) => {
  const navigation = useNavigation();
  const list = [
    {
      name: 'Buy a Gift-Card',
      image: (
        <Image
          style={{height: 30, width: 30}}
          source={require('../../../../assets/images/others/buyGiftcard.png')}
        />
      ),
      onPress: () => {
        navigation.navigate('BuyGiftCardCountryScreen');
      },
    },
    {
      name: 'Sell your Gift-Card',
      image: (
        <Image
          style={{height: 30, width: 30}}
          source={require('../../../../assets/images/others/sellGiftcard.png')}
        />
      ),
      onPress: () => {
        navigation.navigate('SellGiftCardScreen');
      },
    },
  ];
  return (
    <View>
      <Text textAlign={'center'} size={22} bold>
        Gift-Cards
      </Text>
      <Text
        size={14}
        style={{marginTop: 5}}
        color={'#868D95'}
        textAlign={'center'}>
        Choose to buy or sell today.
      </Text>
      <View style={{paddingHorizontal: 20, marginTop: 50}}>
        {list?.map(item => (
          <PageList
            onPress={() => {
              BottomSheets.hide();
              item?.onPress?.();
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

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
          }}>
          <Image
            style={{height: 145, width: 145}}
            source={require('../../../../assets/images/others/flyPersonArrow.png')}
          />
        </View>
      </View>
    </View>
  );
};
