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
  CircleButton,
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
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <CircleButton style={{marginTop: 0}} />
          <View
            style={{
              height: 64,
              width: 64,
              backgroundColor: '#ECF2F7',
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={IMAGES.face} style={{width: 34, height: 46}} />
          </View>
        </View>
        <View style={{marginTop: 0, flex: 1}}>
          <Text color={'#868D95'} size={14} style={{paddingTop: 30}}>
            Welcome back
          </Text>

          <Text semiBold color={COLORS.darkBlue} size={25} style={{}}>
            Holla! {data?.user?.firstName}
          </Text>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Image
              style={{height: 184, width: 184}}
              source={require('../../../assets/images/others/bye.png')}
            />
          </View>

          {/* Inputs Section */}
          <View style={{marginTop: 20, flex: 1}}>
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
                      bold
                      textAlign={'center'}
                      fontWeight={'500'}
                      color={COLORS.primary}
                      style={{
                        marginBottom: 20,
                        marginHorizontal: 20,
                        marginTop: 20,
                        textDecorationLine: 'underline',
                      }}>
                      Forgot Password?
                    </Text>
                    <View style={{marginTop: 20}}>
                      <Button
                        fontSize={16}
                        style={{width: 'auto', flex: 1}}
                        onPress={() => {
                          Keyboard.dismiss();
                          handleSubmit();
                        }}
                        title="Plug Me In"
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 40,
                      }}>
                      <BioButton
                        onPress={SignInWithAuth}
                        icon={
                          Platform.OS == 'ios' ? (
                            <Icons.FaceId size={31} />
                          ) : (
                            <Icons.FingerPrint size={31} />
                          )
                        }
                        title={
                          Platform.OS == 'ios' ? 'Use FaceID' : 'Use Biometrics'
                        }
                      />
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
                      <Text textAlign={'center'} color={'#848A94'}>
                        Not me?{' '}
                        <Text
                          semiBold
                          textAlign={'center'}
                          color={COLORS.primary}>
                          Sign Up
                        </Text>
                      </Text>
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
