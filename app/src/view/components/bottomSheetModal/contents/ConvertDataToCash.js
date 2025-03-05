import React from 'react';
import {View, Keyboard} from 'react-native';
import {
  BottomSheets,
  Button,
  CheckBox,
  Input,
  PageInput,
  PagePicker,
  SuccessRateDisplay,
  Text,
} from '../../general';

import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {COLORS, GENERAL, NETWORKS} from '../../../../conts';
import {fetchRequest, formatAmount, openLink} from '../../../../helper';
import {useQuery} from 'react-query';
import {ConvertDataToCashSummary} from './ConvertDataToCashSummary';
const salesTypeList = [
  {name: 'daily', value: 'daily'},
  {name: 'onetime', value: 'onetime'},
];

const validationSchema = yup.object().shape({
  dataAmount: yup.object().required('Please choose amount'),
  salesType: yup.object().required('Please choose sales type'),
});

export const ConvertDataToCash = ({data}) => {
  console.log(data, 'ConvertDataToCash ConvertDataToCash');
  const navigation = useNavigation();
  const [state, setState] = React.useState({isChecked: false});

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
      dataAmount: '',
      salesType: '',
    },
    validationSchema: validationSchema,
    validateOnMount: true,
    onSubmit: values => {
      BottomSheets.hide();
      BottomSheets.show({
        component: <ConvertDataToCashSummary data={{...values, ...data}} />,
      });
    },
  });

  const getPlansConvertToCash = async values => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/reseller/data2cash/plan',
        method: 'GET',
        showLoader: false,
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const {data: plans} = useQuery(
    'getPlansConvertToCash',
    getPlansConvertToCash,
  );

  return (
    <View style={{paddingHorizontal: 24, paddingBottom: 20}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Convert Data to Cash
      </Text>
      <Text style={{marginTop: 20}} size={12} color={'#828282'}>
        You can select how much data to sell from your available data on this
        sim. We will display the cash equivalent.
      </Text>

      <View style={{marginTop: 20}}>
        <PagePicker
          error={touched?.dataAmount && errors?.dataAmount}
          data={plans}
          value={values?.dataAmount}
          onValueChange={value => {
            setValues({...values, dataAmount: value});
          }}
          placeholder="Select Data"
          onBlur={() => {
            setFieldTouched('dataAmount', true);
          }}
        />

        <Text
          style={{marginTop: 0, marginBottom: 20}}
          size={12}
          color={'#828282'}>
          To sell below 5GB, ensure the data amount you intend to sell is the
          only balance left on your SIM.
        </Text>

        <PagePicker
          error={touched?.salesType && errors?.salesType}
          data={salesTypeList}
          value={values?.salesType}
          onValueChange={value => {
            setValues({...values, salesType: value});
          }}
          placeholder="One time sale | Daily sale"
          onBlur={() => {
            setFieldTouched('salesType', true);
          }}
        />
        <Input
          showTextError={false}
          error={touched?.amount && errors?.amount}
          editable={false}
          textColor={COLORS.blue}
          placeholder="0.00"
          backgroundColor="#EFF1FB"
          value={formatAmount(values?.dataAmount?.amount)}
        />

        <View
          style={{
            marginTop: 20,
            marginBottom: 30,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <CheckBox
            isChecked={state.isChecked}
            onPress={() => {
              setState(prevState => ({
                ...prevState,
                isChecked: !prevState.isChecked,
              }));
            }}
          />
          <Text
            onPress={() => {
              openLink('https://dataresell.com/privacy-policy');
            }}
            color={'#7F8192'}
            fontWeight={'500'}
            style={{paddingLeft: 10}}
            size={12}>
            I’ve read and agree to the{' '}
            <Text color={'#314BCE'} fontWeight={'500'} size={12}>
              terms of service
            </Text>
          </Text>
        </View>

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
            type={isValid && state?.isChecked ? 'primary' : 'grey'}
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
