import React from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {COLORS, GENERAL, IMAGES} from '../../../conts';
import {
  BioButton,
  Button,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  SupportButton,
  Text,
} from '../../components/general';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useLayouts, useUser} from '../../../hooks';

import {
  authUserWithBiometric,
  fetchRequest,
  getUserDetailsFromKeyChain,
  saveUserDetailsToKeyChain,
} from '../../../helper';
import {Image} from '../../components/general/image';
import FastImage from 'react-native-fast-image';
import Toast from '../../components/toast/Toast';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please input email')
    .email('Please input a valid email'),
  password: yup.string().required('Please input password'),
});

export const SignInWithBiometricScreen = ({navigation}) => {
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
      // Login user
      updateUserData({
        loggedIn: true,
        data: {...response?.data, token: response?.token},
        settings: currentSettings,
      });
    } catch (error) {
      console.log(error, 'errr');
    }
  };

  const SignInWithAuth = async () => {
    try {
      let auth = true;

      const details = await getUserDetailsFromKeyChain();
      console.log(details, 'keyChainDetails');

      if (details) {
        if (details?.username && details?.password) {
          signIn({
            ...details,
            email: details?.username,
          });
        } else {
          Toast.show('error', 'Authentication failed.');
        }
      }
    } catch (error) {
      console.log(error, 'error noww p');
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

          <View style={{marginTop: 40, marginBottom: 20}}>
            <Image
              resizeMode={FastImage.resizeMode.cover}
              style={{height: 110, width: 110, borderRadius: 100}}
              source={
                data?.user?.avatar == 'NULL'
                  ? IMAGES.person
                  : {uri: data?.user?.avatar}
              }
            />
          </View>

          {/* Inputs Section */}
          <View style={{marginTop: 20, flex: 1}}>
            <Text size={16} style={{marginBottom: 15}}>
              Welcome Back,{' '}
              <Text size={16} fontWeight={'700'}>
                {data?.user?.firstName}
              </Text>
            </Text>
            <Formik
              innerRef={formikRef}
              initialValues={{
                email: data?.user?.email,
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
                    <View style={{flexDirection: 'row', marginTop: 30}}>
                      <BioButton
                        onPress={SignInWithAuth}
                        icon={
                          Platform.OS == 'ios' ? (
                            <Icons.FaceId size={24} />
                          ) : (
                            <Icons.FingerPrint size={24} />
                          )
                        }
                        title={Platform.OS == 'ios' ? 'Face-ID' : 'Biometrics'}
                      />
                      <View style={{width: 15}} />
                      <Button
                        fontSize={16}
                        style={{width: 'auto', flex: 1}}
                        onPress={() => {
                          Keyboard.dismiss();
                          handleSubmit();
                        }}
                        title="Log-in"
                      />
                    </View>

                    <View style={{alignItems: 'center', marginTop: 40}}>
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
                          updateUserData({
                            data: data,
                            settings: {...settings, biometric: false},
                          });
                          navigation.navigate('SignInScreen');
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
                          LOG OUT
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
