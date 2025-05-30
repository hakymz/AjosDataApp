import React from 'react';
import {View} from 'react-native';

import {COLORS} from '../../../conts';
import {fetchRequest, openSuccessScreen} from '../../../helper';
import {useLayouts, useUser} from '../../../hooks';
import {
  Button,
  CustomSafeAreaView,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';
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
    <CustomSafeAreaView backgroundColor={COLORS.white} style={{flex: 1}}>
      <MainHeader
        backgroundColor={COLORS.white}
        nav
        title={<></>}
        icon={<Icons.Delete />}
      />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <View style={{marginTop: 20}}>
          <Text bold size={18} color={'#D12431'}>
            Delete Profile
          </Text>
          <Text medium size={14} color={'#979797'} style={{marginTop: 10}}>
            Dear Customer, we don’t want you to leave. But if you decide to,
            know this is an{' '}
            <Text bold size={14} color={'#979797'} style={{marginTop: 10}}>
              irreversible process
            </Text>{' '}
            and we will delete all your details from our servers.
          </Text>

          <Text medium size={14} color={'#979797'} style={{marginTop: 20}}>
            Please fill the form below to proceed.
          </Text>
        </View>
        <View style={{marginTop: 40}}>
          <Input
            onChangeText={handleChange('email')}
            onBlur={() => setFieldTouched('email', true)}
            error={touched?.email && errors?.email}
            value={values?.email}
            placeholder="Email"
          />
          <Input
            onChangeText={handleChange('phoneNumber')}
            onBlur={() => setFieldTouched('phoneNumber', true)}
            error={touched?.phoneNumber && errors?.phoneNumber}
            value={values?.phoneNumber}
            placeholder="Phone Number"
          />
          <Input
            onChangeText={handleChange('password')}
            onBlur={() => setFieldTouched('password', true)}
            error={touched?.password && errors?.password}
            value={values?.password}
            placeholder="Password"
            password
          />
          {/* <Input
            onChangeText={handleChange('reason')}
            onBlur={() => setFieldTouched('reason', true)}
            error={touched?.reason && errors?.reason}
            value={values?.reason}
            placeholder="Reason for Deleting account"
          /> */}
        </View>
        <View
          style={{
            flex: 1,

            justifyContent: 'flex-end',
          }}>
          <Button
            onPress={submitForm}
            type="lightGrey"
            style={{
              paddingHorizontal: 10,
            }}
            fontSize={14}
            title={'Delete my account'}
          />

          <Button
            onPress={navigation.goBack}
            style={{marginTop: 10}}
            fontSize={14}
            title={`Cancel`}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
