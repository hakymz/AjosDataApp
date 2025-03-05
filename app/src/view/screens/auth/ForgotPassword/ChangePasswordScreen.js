import {SafeAreaView, View, StatusBar} from 'react-native';
import React from 'react';
import {COLORS} from '../../../../conts';
import {
  Button,
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
  const {userId} = route?.params || {};

  const [state, setState] = React.useState({
    isChecked: true,
    buttonDisabled: true,
  });

  const changePassword = async value => {
    try {
      const response = await fetchRequest({
        path: '/auth/reset-password/',
        data: {...value, userId},
      });

      openSuccessScreen({
        navigation,
        title: 'Password Saved successfully',
        subTitle:
          'You can go ahead to Login... Take the new password for a spin, it has to work 🤣',
        btnTitle: 'Log into account',
        indicatorWidth: '',
        indicatorText: '',
        proceed: () => navigation.navigate('SignInScreen'),
      });
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
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: values => {
      changePassword(values);
    },
  });

  React.useEffect(() => {
    if (values.password && isValid && values?.confirmPassword) {
      setState(prevState => ({...prevState, buttonDisabled: false}));
    } else {
      setState(prevState => ({...prevState, buttonDisabled: true}));
    }
  }, [values, state.isChecked, isValid]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <BackNav />

      <KeyboardAvoidingViewWrapper
        // bounces={false}
        addMinHeight
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 30,
        }}>
        <View style={{alignItems: 'center', marginTop: 0, flex: 1}}>
          <Text bd size={35} style={{paddingTop: 50}}>
            Forgot Password
          </Text>

          <Text
            lineHeight={'22'}
            style={{marginTop: 30}}
            color={'#3D3A3B'}
            size={16}>
            You can now proceed to create a new password, Try not to forget this
            time ☺️
          </Text>

          <View style={{marginTop: 50, width: '100%', flex: 1}}>
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
                  marginTop: 20,
                }}>
                <Button
                  titleStyle={{color: COLORS.white}}
                  type={state?.buttonDisabled ? 'grey' : 'primary'}
                  onPress={() => {
                    submitForm();
                  }}
                  title="Save Password"
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
