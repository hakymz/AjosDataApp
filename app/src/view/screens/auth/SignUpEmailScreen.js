import React from 'react';
import {View, StatusBar, SafeAreaView, Keyboard, Image} from 'react-native';
import {COLORS} from '../../../conts';
import {BottomSheets, Button, CircleButton} from '../../components/general';
import {
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';

import {useFormik} from 'formik';
import * as yup from 'yup';
import {fetchRequest} from '../../../helper';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please input email')
    .email('Please input a valid email'),
});
export const SignUpEmailScreen = ({navigation, route}) => {
  const data = route?.params || {};

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
      email: __DEV__ ? 'kyymzy@gmail.com' : '',
    },
    validateOnMount: true,
    validationSchema,
    onSubmit: values => {
      signUp(values);
    },
  });

  const signUp = async value => {
    try {
      const response = await fetchRequest({
        path: '/auth/register',
        data: {...data, phoneNumber: data?.phone, email: value?.email},
      });
      console.log(response);

      navigation.navigate('OtpScreen', {
        email: value?.email,
        token: response?.data?.signUpToken,
      });
    } catch (error) {
      console.log(error, 'errrss');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          minHeight: '100%',
          paddingBottom: 20,
        }}>
        <View>
          <CircleButton />
          <Text
            semiBold
            color={COLORS.darkBlue}
            size={25}
            style={{paddingTop: 30}}>
            Validate your Email
          </Text>
          <Text style={{marginTop: 10}} color={'#868D95'} size={14}>
            Please enter a valid Email Address so we can verify you.
          </Text>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 30}}>
          <View>
            <Input
              placeholder="Email address"
              value={values.email}
              error={touched?.email && errors?.email}
              onChangeText={value => {
                setFieldValue('email', value?.trim?.());
              }}
              onBlur={() => setFieldTouched('email', true)}
            />
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Image
            style={{height: 222, width: 222}}
            source={require('../../../assets/images/others/validateEmail.png')}
          />
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            disabled={!isValid}
            title="Continue"
            onPress={() => {
              submitForm();
              Keyboard.dismiss();
            }}
          />
          <View style={{marginTop: 30}}>
            <Text
              onPress={() => {
                navigation.navigate('SignInScreen');
              }}
              size={14}
              textAlign={'center'}
              color={'#848A94'}>
              Have an Account?{' '}
              <Text size={14} color={COLORS.primary}>
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
