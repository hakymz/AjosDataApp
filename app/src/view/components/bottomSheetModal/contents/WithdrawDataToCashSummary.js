import React from 'react';
import {View, Keyboard} from 'react-native';
import {BottomSheets, Button, PageInput, Text} from '../../general';

import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {GENERAL} from '../../../../conts';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {SuccessHomeBtn, SuccessShadowBtn} from '../../../screens/general';

export const WithdrawDataToCashSummary = ({data}) => {
  const navigation = useNavigation();

  console.log(data);
  const List = ({title, details, detailsColor = '#4961AC'}) => {
    return (
      <View
        style={{
          height: 54,
          backgroundColor: '#F8F8F8',
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 8,
          marginBottom: 15,
        }}>
        <Text
          numberOfLines={1}
          style={{flex: 1}}
          md
          size={13}
          color={'#979797'}>
          {title}
        </Text>
        <Text
          md
          numberOfLines={1}
          style={{flex: 1}}
          textAlign={'right'}
          size={18}
          color={detailsColor}>
          {details}
        </Text>
      </View>
    );
  };

  const proceed = async pin => {
    try {
      const response = await fetchRequest({
        path: '/wallet/withdraw',
        data: {
          amount: data?.amount * 1,
          accountNumber: data?.accountNo,
          accountName: data?.accountName,
          bankCode: data?.bank?.code,
          transactionPin: pin,
        },
        pageError: {
          navigation,
        },
      });

      openSuccessScreen({
        navigation,
        title: (
          <Text color={'#27A770'} size={18}>
            {response?.message}
          </Text>
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
    } catch (error) {}
  };

  return (
    <View style={{paddingHorizontal: 24, paddingBottom: 20}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Withdrawal Summary
      </Text>
      <Text md style={{marginTop: 20}} size={14} color={'#000'}>
        Here is a summary of your withdrawal and how much would be left in your
        wallet.
      </Text>

      <View style={{marginTop: 20}}>
        <List
          title={'Wallet Balance after'}
          details={`${GENERAL.nairaSign}${formatAmount(
            data?.balance - data?.amount > 0 ? data?.balance - data?.amount : 0,
          )}`}
          detailsColor="#979797"
        />
        <Text
          style={{marginBottom: 5, marginTop: 20}}
          bd
          size={12}
          color={'#4961AC'}>
          Bank selected
        </Text>
        <List title={data?.bank?.name} details={data?.accountNo} />
        <List
          title={'Withdrawal Amount'}
          details={`${GENERAL.nairaSign}${formatAmount(data?.amount)}`}
        />
        <View style={{flexDirection: 'row', marginTop: 40}}>
          <Button
            onPress={() => {
              deleteNumber();
              BottomSheets.hide();
            }}
            fontSize={14}
            type="lightGrey"
            style={{width: 122, marginRight: 10, paddingHorizontal: 0}}
            title={'Cancel'}
          />
          <Button
            onPress={() => {
              Keyboard.dismiss();
              BottomSheets.hide();
              navigation.navigate('PinScreen', {
                proceed: pin => {
                  proceed(pin);
                },
              });
            }}
            fontSize={14}
            style={{width: 'auto', flex: 1, paddingHorizontal: 0}}
            title={'Continue'}
          />
        </View>
      </View>
    </View>
  );
};
