import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Button, PageInput, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useBillsData} from '../../../../hooks';

const validationSchema = yup.object().shape({
  customerName: yup.string().required('Please enter customer name'),
  customerNumber: yup.string().required('Please enter phone number'),
});

export const AddCustomer = ({number}) => {
  console.log(number, 'number number number number number');
  const {addCustomers} = useBillsData();
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
      customerNumber: number || (__DEV__ ? '08011111111' : ''),
      customerName: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      BottomSheets.hide();
      addCustomers({
        ...values,
        customerNumber: '+234' + values?.customerNumber,
      });
    },
  });

  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Add Customer
      </Text>

      <View style={{marginTop: 30, marginBottom: 25, paddingHorizontal: 20}}>
        <Text size={14} fontWeight={'500'}>
          Fill in Customers details to save for future transactions
        </Text>
      </View>

      <View>
        <PageInput
          value={values.customerName}
          error={touched?.customerName && errors?.customerName}
          onChangeText={handleChange('customerName')}
          onBlur={() => setFieldTouched('customerName', true)}
          placeholder="Enter Customers Name"
        />
        <PageInput
          editable={number ? false : true}
          value={values.customerNumber}
          error={touched?.customerNumber && errors?.customerNumber}
          onChangeText={handleChange('customerNumber')}
          onBlur={() => setFieldTouched('customerNumber', true)}
          placeholder="Customer’s Number"
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Button
          onPress={() => {
            submitForm();
          }}
          style={{flex: 1, marginTop: 10}}
          fontSize={14}
          title={'Save Customer'}
        />
      </View>
      <View style={{paddingTop: 30}}>
        <Text lineHeight={'16'} color={'#828282'} size={12} fontWeight={'400'}>
          You can access this any time you want to sell any service to this
          customer, life made a little easier.
        </Text>
      </View>
    </View>
  );
};
