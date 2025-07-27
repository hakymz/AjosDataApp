import {SafeAreaView, View, StatusBar, Image} from 'react-native';
import React from 'react';
import {COLORS} from '../../../../conts';
import {
  Button,
  CircleButton,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';

import {useFormik} from 'formik';
import * as yup from 'yup';
import {Input} from '../../../components/general';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {BackNav} from '../../../components/layouts';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Please input password')
    .min(8, 'Min length of 8'),
  confirmPassword: yup
    .string()
    .required('Please confirm password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});
export const ChangePasswordScreen = ({navigation, route}) => {
  const {resetToken} = route?.params || {};

  const changePassword = async value => {
    try {
      const response = await fetchRequest({
        path: '/auth/reset-password',
        data: {...value, resetToken},
      });

      navigation.navigate('ChangePasswordSuccessScreen');
    } catch (error) {
      console.log(error);
    }
  };

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
    isValid,
  } = useFormik({
    initialValues: {
      password: __DEV__ ? 'Hakymzco2*' : '',
      confirmPassword: __DEV__ ? 'Hakymzco2*' : '',
    },
    validationSchema,
    onSubmit: values => {
      changePassword(values);
    },
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        // bounces={false}
        addMinHeight
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}>
        <CircleButton />
        <View style={{marginTop: 0, flex: 1}}>
          <Text
            color={COLORS.darkBlue}
            semiBold
            size={25}
            style={{paddingTop: 30}}>
            Create a new password
          </Text>

          <Text size={14} color={'#868D95'} style={{marginTop: 10}}>
            Please enter a secure password and make sure your write it down
            somewhere safe.
          </Text>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Image
              style={{height: 184, width: 184}}
              source={require('../../../../assets/images/others/securityShield.png')}
            />
          </View>

          <View style={{marginTop: 40, width: '100%', flex: 1}}>
            <View style={{flex: 1}}>
              <Input
                password
                placeholder="Enter New Password"
                value={values.password}
                error={touched?.password && errors?.password}
                onChangeText={value => {
                  setFieldValue('password', value);
                }}
                onFocus={() => {}}
                onBlur={() => setFieldTouched('password', true)}
              />
              <Input
                password
                placeholder="Confirm Password"
                value={values.confirmPassword}
                error={touched?.confirmPassword && errors?.confirmPassword}
                onChangeText={value => {
                  setFieldValue('confirmPassword', value);
                }}
                onFocus={() => {}}
                onBlur={() => setFieldTouched('confirmPassword', true)}
              />

              <View
                style={{
                  flex: 1,
                  marginBottom: 20,
                  marginTop: 50,
                }}>
                <Button
                  disabled={!isValid}
                  onPress={() => {
                    submitForm();
                  }}
                  title="Save New Password"
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
