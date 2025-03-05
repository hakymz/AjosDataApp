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
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  OrLine,
  SocialButton,
  SupportButton,
  Text,
} from '../../components/general';
import {Formik} from 'formik';
import * as yup from 'yup';
import {AppNav} from '../../components/layouts';
import {useLayouts, useUser} from '../../../hooks';
import {HeaderImage} from '../../components/auth';
import {fetchRequest, saveUserDetailsToKeyChain} from '../../../helper';
import Toast from '../../components/toast/Toast';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please input email')
    .email('Please input a valid email'),
  password: yup.string().required('Please input password'),
});

export const SignInScreen = ({navigation}) => {
  const {data, updateUserData, settings} = useUser();
  const {minHeight} = useLayouts();
  const formikRef = React.useRef();

  const signIn = async value => {
    try {
      const response = await fetchRequest({
        path: '/auth/login/',
        data: value,
      });

      await saveUserDetailsToKeyChain(value);

      const currentSettings = {
        hideBalance: false,
        biometric: false,
        currency: 'NGN',
        ...settings,
        notification: false,
      };

      if (!response?.data?.user?.isVerified?.email) {
        navigation.navigate('OtpScreen', {
          email: value?.email,
          type: 'resend',
          _id: response?.data?.user?._id,
        });
      } else {
        // Login user
        updateUserData({
          loggedIn: true,
          data: {...response?.data, token: response?.token},
          settings: currentSettings,
        });
      }
    } catch (error) {
      console.log(error, 'errrss');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingBottom: 20,
          minHeight,
          paddingHorizontal: 30,
        }}>
        <View style={{marginTop: 0, flex: 1}}>
          <Text bd size={35} textAlign="left" style={{paddingTop: 30}}>
            Log In
          </Text>
          {/* 
          <View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <SocialButton title={'GOOGLE'} />
            <View style={{width: 15}} />
            <SocialButton
              title={'FACEBOOK'}
              style={{backgroundColor: '#F5F6FA'}}
            />
          </View>
          <View style={{marginTop: 15}}>
            <OrLine />
          </View> */}

          {/* Inputs Section */}
          <View style={{marginTop: 15, flex: 1, marginTop: 40}}>
            <Formik
              innerRef={formikRef}
              initialValues={{
                email: __DEV__ ? 'kyymzy@gmail.com' : data?.user?.email,
                password: __DEV__ ? '12345678' : '',
              }}
              validationSchema={validationSchema}
              onSubmit={values => {
                signIn(values);
              }}>
              {({
                values,
                errors,
                handleChange,
                handleSubmit,
                touched,
                setFieldTouched,
                setFieldValue,
              }) => (
                <View style={{flex: 1}}>
                  <View>
                    <Input
                      placeholder="Enter Email Address"
                      value={values.email}
                      error={touched?.email && errors?.email}
                      onChangeText={value => {
                        setFieldValue('email', value?.trim?.());
                      }}
                      onFocus={() => {}}
                      onBlur={() => setFieldTouched('email', true)}
                    />
                    <Input
                      password
                      placeholder="Enter Password"
                      value={values.password}
                      error={touched?.password && errors?.password}
                      onChangeText={value => {
                        setFieldValue('password', value);
                      }}
                      onFocus={() => {}}
                      onBlur={() => setFieldTouched('password', true)}
                    />
                    <Text
                      onPress={() =>
                        navigation.navigate('ForgotPasswordScreen')
                      }
                      size={14}
                      semiBold
                      fontWeight={'500'}
                      color={'#5771F9'}
                      style={{
                        textAlign: 'right',
                        marginBottom: 20,
                        marginHorizontal: 20,
                        marginTop: 20,
                        textDecorationLine: 'underline',
                      }}>
                      Forgot Password?
                    </Text>
                    <Button
                      style={{marginTop: 30}}
                      onPress={() => {
                        Keyboard.dismiss();
                        handleSubmit();
                      }}
                      title="Log-in"
                    />
                    <View style={{alignItems: 'center', marginTop: 30}}>
                      <SupportButton />
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      marginBottom: 20,
                      paddingHorizontal: 10,
                    }}>
                    <View style={{marginTop: 30}}>
                      <Text fontWeight={'700'} color={'#151940'}>
                        Don’t have an account?
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          navigation.navigate('SignUpScreen');
                        }}
                        style={{
                          marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{marginRight: 20}}
                          size={16}
                          fontWeight={'700'}
                          color={COLORS.primary}>
                          REGISTER
                        </Text>
                        <Icons.ArrowRed size={15} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
