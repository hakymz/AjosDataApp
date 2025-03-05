import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';

import {useNavigation} from '@react-navigation/native';

import {COLORS, GENERAL} from '../../../../conts';
import {
  capitalizeWord,
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {TransactionSummary} from './TransactionSummary';
import {SuccessHomeBtn, SuccessShadowBtn} from '../../../screens/general';

export const ConvertDataToCashSummary = ({data}) => {
  const navigation = useNavigation();

  const convertToCash = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: `billpayment/reseller/data-to-cash/${data?._id}`,
        data: {
          dataAmount: data?.dataAmount?.plan?.match(/\d+/g)?.[0] * 1,
          salesType: data?.salesType?.value,
          amount: data?.dataAmount?.amount,
          transactionPin,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });

      openSuccessScreen({
        navigation,
        titleComponent: (
          <View>
            <Text textAlign={'center'} color={'#27A770'} size={18}>
              Sale Successfully initiated from
              <Text
                textAlign={'center'}
                color={'#27A770'}
                size={18}
                fontWeight={'700'}>
                {data?.phoneNumber}
              </Text>
            </Text>
            <Text
              textAlign={'center'}
              style={{marginTop: 20}}
              color={'#A3A3A3'}
              size={14}
              md>
              Your order is being processed and you would get SMS alert soon
              once completed.
            </Text>
          </View>
        ),

        btnComponent: (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 80,
              justifyContent: 'center',
            }}>
            <SuccessHomeBtn title={'Go Home'} />
          </View>
        ),
      });
    } catch (error) {
      console.log(error, 'errrss');
    }
  };

  const Section = ({title, des}) => {
    return (
      <View
        style={{
          height: 54,
          backgroundColor: '#F8F8F8',
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginBottom: 10,
        }}>
        <Text size={13} md color={'#979797'}>
          {title}
        </Text>
        <Text
          textAlign={'right'}
          numberOfLines={1}
          style={{flex: 1, marginLeft: 10}}
          bd
          size={16}
          color={'#4961AC'}>
          {des}
        </Text>
      </View>
    );
  };

  return (
    <View style={{paddingHorizontal: 24, paddingBottom: 20}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Summary
      </Text>
      <Text
        lineHeight={18}
        style={{marginTop: 20}}
        size={14}
        color={COLORS.black}>
        This process is automated and should take between{' '}
        <Text bd>1-30minutes</Text> , you will be notified by MTN when it is
        complete
      </Text>
      <View
        style={{
          marginTop: 30,
          marginBottom: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../../../assets/images/others/dataToCashLoading.png')}
        />
      </View>

      <Section title={'Data Amount'} des={`${data?.dataAmount?.plan}`} />
      <Section
        title={'Withdrawal Amount'}
        des={`${GENERAL.nairaSign}${formatAmount(data?.dataAmount?.amount)}`}
      />

      <View
        style={{
          height: 30,
          backgroundColor: '#F8F8F8',
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginBottom: 10,
          justifyContent: 'center',
        }}>
        <Text bd size={14} md color={'#4961AC'}>
          {capitalizeWord(data?.salesType?.name)} Sales
        </Text>
      </View>

      <View style={{marginTop: 20}}>
        <View style={{flexDirection: 'row', marginTop: 40}}>
          <Button
            onPress={() => {
              BottomSheets.hide();
            }}
            fontSize={14}
            type="lightGrey"
            style={{width: 122, marginRight: 10, paddingHorizontal: 0}}
            title={'Cancel'}
          />
          <Button
            textColor={COLORS.white}
            onPress={() => {
              BottomSheets.hide();
              navigation.navigate('PinScreen', {
                proceed: pin => {
                  convertToCash(pin);
                },
              });
            }}
            fontSize={14}
            style={{width: 'auto', flex: 1, paddingHorizontal: 0}}
            title={'Complete Sale'}
          />
        </View>
      </View>
    </View>
  );
};
