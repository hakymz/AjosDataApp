import React from 'react';
import {View, StatusBar, SafeAreaView, Keyboard} from 'react-native';
import {COLORS} from '../../../conts';
import {Button} from '../../components/general';
import {
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';

import {useFormik} from 'formik';
import * as yup from 'yup';
import {BackNav} from '../../components/layouts';
import {useUser} from '../../../hooks';
import Toast from '../../components/toast/Toast';
import {fetchRequest} from '../../../helper';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please input email')
    .email('Please input a valid email'),
});
export const ForgotPasswordScreen = ({navigation}) => {
  const {updateUserData, data, settings, logoutUser} = useUser();

  const [state, setState] = React.useState({
    isChecked: true,
    buttonDisabled: true,
  });

  const sendEmail = async values => {
    // Reg user
    try {
      const response = await fetchRequest({
        path: 'auth/forgot-password',
        data: {
          email: values?.email,
        },
      });

      console.log(response);

      if (response.status == 'success' && response?.data) {
        updateUserData({
          data: data,
          settings: {...settings, biometric: false},
        });

        navigation.navigate('OtpScreen', {
          _id: response?.data?._id,
          type: 'resetPassword',
        });
      } else {
        Toast.show('error', response?.message);
      }
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
      email: '',
    },
    validationSchema,
    onSubmit: values => {
      sendEmail(values);
    },
  });

  React.useEffect(() => {
    if (values.email && isValid) {
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
        contentContainerStyle={{
          paddingHorizontal: 30,
          minHeight: '100%',
          paddingBottom: 20,
        }}>
        <View>
          <Text bd size={35} textAlign="left" style={{paddingTop: 50}}>
            Forgot Password
          </Text>
          <Text
            lineHeight={'22'}
            style={{marginTop: 30}}
            color={'#3D3A3B'}
            size={16}>
            Please enter your
            <Text
              lineHeight={'22'}
              color={'#3D3A3B'}
              size={16}
              fontWeight={'700'}>
              {' '}
              email address
            </Text>{' '}
            to reset your password
          </Text>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 30, height: 300}}>
          <View>
            <Input
              placeholder="Enter Email Address"
              value={values.email}
              error={touched?.email && errors?.email}
              onChangeText={value => {
                setFieldValue('email', value);
              }}
              onBlur={() => setFieldTouched('email', true)}
            />
          </View>
          <Button
            style={{marginTop: 60}}
            // disabled={state.buttonDisabled}
            titleStyle={{color: COLORS.white}}
            type={state?.buttonDisabled ? 'grey' : 'primary'}
            title="Send Email"
            onPress={() => {
              // navigation.navigate('OtpScreen');
              submitForm();
              Keyboard.dismiss();
            }}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
