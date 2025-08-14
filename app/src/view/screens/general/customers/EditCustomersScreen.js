import React from 'react';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';
import {Image, StyleSheet, View} from 'react-native';
import {AVATAR, COLORS} from '../../../../conts';

import {useBillsData} from '../../../../hooks';

import * as yup from 'yup';
import {useFormik} from 'formik';
const validationSchema = yup.object().shape({
  phoneNumber: yup.string().required('Please enter customer name'),
  fullname: yup.string().required('Please enter phone number'),
});
export const EditCustomersScreen = ({navigation, route}) => {
  const {updateCustomers} = useBillsData();
  const customer = route?.params || {};

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
      phoneNumber: customer?.phone_number,
      fullname: customer?.fullname,
      email: customer?.email,
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      BottomSheets.hide();
      await updateCustomers({
        ...values,
        phoneNumber: values?.phoneNumber,
        id: customer?.id,
      });
      navigation.goBack();
    },
  });

  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <MainHeader
        backgroundColor={COLORS.white}
        nav
        title={<></>}
        icon={<Image style={{height: 50, width: 50}} source={AVATAR.avatar} />}
      />

      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}>
        <View>
          <Text bold size={18}>
            Edit Customers
          </Text>
          <Text
            style={{marginTop: 5, marginBottom: 40}}
            size={12}
            medium
            color={'#979797'}>
            You can edit or change any detail provided the below to help you
            make this customer’s details more accutate.
          </Text>
          <Input
            value={values.fullname}
            error={touched?.fullname && errors?.fullname}
            onChangeText={handleChange('fullname')}
            onBlur={() => setFieldTouched('fullname', true)}
            placeholder="Enter Customers Name"
          />
          <Input
            value={values.phoneNumber}
            error={touched?.phoneNumber && errors?.phoneNumber}
            onChangeText={handleChange('phoneNumber')}
            onBlur={() => setFieldTouched('phoneNumber', true)}
            placeholder="Customer’s Number"
          />
          <Input
            value={values.email}
            error={touched?.email && errors?.email}
            onChangeText={handleChange('email')}
            onBlur={() => setFieldTouched('email', true)}
            placeholder="Email address"
          />
          <Text color={'#979797'} medium size={12}>
            This email address field is optional
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            disabled={!isValid}
            onPress={submitForm}
            title={'Save Edits'}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 70,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
});
