import React from 'react';
import {View, Keyboard} from 'react-native';
import {BottomSheets, Button, PageInput, Text} from '../../general';

import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {GENERAL} from '../../../../conts';
import Toast from '../../toast/Toast';

const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .required('Please input amount')
    .min(100, 'Min amount of 100NGN'),
});

export const WithdrawDataToCash = ({balance}) => {
  const navigation = useNavigation();

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    handleChange,
    setValues,
    submitForm,
    resetForm,
    isValid,
  } = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      if (values?.amount > balance) {
        Toast.show('error', 'Insufficient balance');
      }
      BottomSheets.hide();
      navigation.navigate('WithdrawDataToCashScreen', {amount: values?.amount});
    },
  });

  return (
    <View style={{paddingHorizontal: 24, paddingBottom: 20}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Withdraw
      </Text>
      <Text style={{marginTop: 20}} size={12} color={'#828282'}>
        This can only be withdrawn to a bank account of your choice, pls make
        sure you have added one.
      </Text>

      <View style={{marginTop: 20}}>
        <PageInput
          keyboardType={'numeric'}
          handleScroll={GENERAL.platform == 'ios'}
          showTextError={true}
          // handleScroll
          placeholder="Amount"
          value={values.amount}
          error={touched?.amount && errors?.amount}
          onChangeText={handleChange('amount')}
          onBlur={() => {
            setFieldTouched('amount', true);
          }}
          rightIcon={
            <Text md size={12} color={'#9A9A9A'}>
              Amount
            </Text>
          }
        />

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
            onPress={() => {
              Keyboard.dismiss();
              submitForm();
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
