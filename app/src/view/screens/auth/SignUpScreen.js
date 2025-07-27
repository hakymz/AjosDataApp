import React from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../../../conts';
import {
  Button,
  CheckBox,
  CircleButton,
  Icons,
  OrLine,
  SocialButton,
} from '../../components/general';
import {
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';

import {s} from 'react-native-size-matters';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useLayouts, useUser} from '../../../hooks';
import Toast from '../../components/toast/Toast';
import {fetchRequest, openLink} from '../../../helper';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('Please input first name'),
  lastName: yup.string().required('Please input last name'),
  // confirmPassword: yup
  //   .string()
  //   .required('Please confirm password')
  //   .oneOf([yup.ref('password'), null], 'Passwords must match'),
  password: yup
    .string()
    .required('Please input password')
    .min(5, 'Min length of 5'),
  phone: yup.string().required('Please input phone number'),
});

export const SignUpScreen = ({navigation}) => {
  const [state, setState] = React.useState({
    isChecked: false,
    buttonDisabled: true,
  });
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
    isValid,
  } = useFormik({
    initialValues: {
      password: __DEV__ ? 'Hakymzco2*' : '',
      phone: __DEV__ ? '09036199523' : '',
      firstName: __DEV__ ? 'Hakym' : '',
      lastName: __DEV__ ? 'Tijani' : '',
      refCode: '',
    },
    validationSchema,
    onSubmit: values => {
      navigation.navigate('SignUpEmailScreen', {...values});
    },
    validateOnMount: true,
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          minHeight: minHeight - s(95),
          paddingBottom: 20,
        }}>
        <CircleButton />
        <View>
          <Text
            color={COLORS.darkBlue}
            semiBold
            size={25}
            textAlign="left"
            style={{paddingTop: 30}}>
            Create Account
          </Text>
          <Text style={{marginTop: 10}} size={14} color={'#868D95'}>
            Please Enter your Information and create your account
          </Text>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 15, marginBottom: 40, marginTop: 30}}>
          <View>
            <Input
              placeholder="First Name"
              value={values?.firstName}
              error={touched?.firstName && errors?.firstName}
              onChangeText={value => {
                setFieldValue('firstName', value);
              }}
              onBlur={() => setFieldTouched('firstName', true)}
            />

            <Input
              placeholder="Last Name"
              value={values?.lastName}
              error={touched?.lastName && errors?.lastName}
              onChangeText={value => {
                setFieldValue('lastName', value);
              }}
              onBlur={() => setFieldTouched('lastName', true)}
            />
            <Input
              keyboardType="numeric"
              placeholder="Phone number"
              value={values?.phone}
              error={touched?.phone && errors?.phone}
              onChangeText={value => {
                setFieldValue('phone', value);
              }}
              onBlur={() => setFieldTouched('phone', true)}
            />

            <Input
              password
              placeholder="Create Password"
              value={values?.password}
              error={touched?.password && errors?.password}
              onChangeText={value => {
                setFieldValue('password', value);
              }}
              onBlur={() => setFieldTouched('password', true)}
            />

            <Input
              placeholder="Referral code (optional)"
              value={values?.refCode}
              error={touched?.refCode && errors?.refCode}
              onChangeText={value => {
                setFieldValue('refCode', value);
              }}
              onBlur={() => setFieldTouched('refCode', true)}
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
                I’ve read and agree to the
                <Text color={'#756EF3'} fontWeight={'500'} size={12}>
                  {' '}
                  terms of use
                </Text>
              </Text>
            </View>
            <Button
              style={{marginTop: 20}}
              disabled={!isValid || !state?.isChecked}
              titleStyle={{color: COLORS.white}}
              type={'primary'}
              title="Create My Plug"
              onPress={() => {
                Keyboard.dismiss();
                submitForm();
              }}
            />
            <View style={{marginTop: 20}}>
              <Text
                onPress={() => {
                  navigation.navigate('SignInScreen');
                }}
                size={14}
                textAlign={'center'}
                color={'#848A94'}>
                Have an Account?{' '}
                <Text semiBold size={14} color={COLORS.primary}>
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
