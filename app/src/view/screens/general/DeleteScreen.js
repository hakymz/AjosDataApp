import React from 'react';
import {View, Image, ScrollView} from 'react-native';

import {s} from 'react-native-size-matters';
import {IMAGES} from '../../../conts';
import {fetchRequest, openSuccessScreen} from '../../../helper';
import {useLayouts, useUser} from '../../../hooks';
import {
  Button,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import {AppNav} from '../../components/layouts';
import {useFormik} from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  reason: yup.string().required('Please enter reason'),
  email: yup.string().required('Please enter email'),
  phoneNumber: yup.number().required('Please enter phone no'),
  password: yup.string().required('Please enter password'),
});

export const DeleteScreen = ({navigation, route}) => {
  const {deleteUser} = useUser();
  const {minHeight} = useLayouts();

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
      phoneNumber: '',
      email: '',
      password: '',
      reason: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      deleteAccont();
    },
  });
  const deleteAccont = async pin => {
    try {
      const response = await fetchRequest({
        path: 'settings/delete-account',
        data: {...values, phoneNumber: '+234' + values?.phoneNumber},
        method: 'POST',
      });

      deleteUser();
      setTimeout(() => {
        openSuccessScreen({
          navigation,
          title: 'Account Deleted Successfully',
          indicatorWidth: null,
          btnTitle: 'Create a new account',
          proceed: () => {
            navigation.navigate('SignUpScreen');
          },
        });
      }, 200);
    } catch (error) {}
  };
  return (
    <CustomSafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{
          paddingHorizontal: 20,
          minHeight: minHeight - 10,
        }}>
        <View style={{marginTop: 20}}>
          <Text size={35} fontWeight={'700'}>
            Delete Profile
          </Text>

          <Text
            lineHeight={23}
            size={16}
            color={'#3D3A3B'}
            style={{marginTop: 40}}>
            Dear Customer, we don’t want you to leave. But if you decide to,
            know this is an irreversible process and we will delete all your
            details from our servers. {'\n\n'}Please fill the form below to
            proceed.
          </Text>
        </View>
        <View style={{marginTop: 40}}>
          <Text
            fontWeight={'700'}
            size={16}
            color={'#3D3A3B'}
            style={{marginBottom: 10}}>
            Enter your Phone Number
          </Text>
          <Input
            onChangeText={handleChange('phoneNumber')}
            onBlur={() => setFieldTouched('phoneNumber', true)}
            error={touched?.phoneNumber && errors?.phoneNumber}
            value={values?.phoneNumber}
            textColor="#4961AC"
            placeholder="Phone Number"
            backgroundColor="#EFF1FB"
          />
          <Input
            onChangeText={handleChange('email')}
            onBlur={() => setFieldTouched('email', true)}
            error={touched?.email && errors?.email}
            value={values?.email}
            placeholder="Email"
          />
          <Input
            onChangeText={handleChange('password')}
            onBlur={() => setFieldTouched('password', true)}
            error={touched?.password && errors?.password}
            value={values?.password}
            placeholder="Password"
            password
          />
          <Input
            onChangeText={handleChange('reason')}
            onBlur={() => setFieldTouched('reason', true)}
            error={touched?.reason && errors?.reason}
            value={values?.reason}
            placeholder="Reason for Deleting account"
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            flexDirection: 'row',
          }}>
          <Button
            onPress={submitForm}
            type="lightGrey"
            style={{
              flex: 1,
              paddingHorizontal: 10,
            }}
            fontSize={14}
            title={'Delete'}
          />
          <View style={{width: 10}} />
          <Button
            onPress={navigation.goBack}
            style={{flex: 1, paddingHorizontal: 10}}
            fontSize={14}
            title={`Cancel`}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
