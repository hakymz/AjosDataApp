import React from 'react';
import {View, StatusBar, SafeAreaView, Image} from 'react-native';
import {COLORS, FONTS} from '../../../conts';

import {
  CircleButton,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';

import {useLayouts, useUser} from '../../../hooks';
import Toast from '../../components/toast/Toast';
import {fetchRequest, openSuccessScreen} from '../../../helper';
import {BackNav} from '../../components/layouts/general/BackNav';

export const OtpScreen = ({navigation, route}) => {
  const {email, token, type, _id} = route?.params || {};

  const {updateUserData, data, settings} = useUser();

  const [state, setState] = React.useState({
    showButton: false,
    error: false,
    resendOtp: false,
    remainSecond: 60,
    inputs: ['', '', '', ''],
    errors: ['', '', '', ''],
    focusedIndex: null,
  });

  const inputsRef = React.useRef([]);
  const countDownSecRef = React.useRef();

  const clear = () => {
    setTimeout(() => {
      inputsRef?.current?.[0]?.focus();
    }, 500);
    setState(prevState => ({
      ...prevState,
      inputs: ['', '', '', ''],
      errors: ['', '', '', ''],
    }));
  };

  const handleChange = (value, index) => {
    setState(prevState => {
      const newInputsValue = prevState.inputs;
      newInputsValue[index] = value;
      if (newInputsValue?.[index]) {
        inputsRef?.current?.[index + 1]?.focus();
      }

      if (prevState?.inputs[3]) {
        verifyOtp(newInputsValue?.join?.(''));
      }

      return {
        ...prevState,
        inputs: newInputsValue,
      };
    });
  };

  const verifyOtp = async values => {
    try {
      const response = await fetchRequest({
        path: type == 'resetPassword' ? 'auth/verify-otp' : 'auth/verify-email',
        data:
          type == 'resetPassword'
            ? {
                resetToken: token,
                otp: values,
              }
            : {
                signUpToken: token,
                otp: values,
              },
        pageError: {
          navigation,
        },
      });
      if (type == 'resetPassword') {
        navigation.navigate('ChangePasswordScreen', {resetToken: token});
      } else {
        navigation.navigate('WelcomeScreen');
      }
    } catch (error) {
      console.log(error);
    } finally {
      clear();
    }
  };

  const sendLink = async values => {
    try {
      const response = await fetchRequest({
        path: 'auth/resend-otp',
        data: {
          email,
          type,
        },
      });
      console.log(response, 'otp');

      if (response?.status == 'success') {
        countDownSec();
      } else {
        // Toast.show('error', response?.message || null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const countDownSec = () => {
    clearInterval(countDownSecRef.current);
    setState(prevState => ({...prevState, remainSecond: 60, resendOtp: false}));
    countDownSecRef.current = setInterval(() => {
      setState(prevState => {
        let resendOtp = false;
        if (prevState?.remainSecond < 1) {
          resendOtp = true;
          clearInterval(countDownSecRef.current);
        }
        const remainSecond =
          prevState?.remainSecond > 0
            ? prevState?.remainSecond - 1
            : prevState?.remainSecond;

        return {...prevState, remainSecond, resendOtp};
      });
    }, 1000);
  };

  React.useEffect(() => {
    countDownSec();

    return () => {
      clearInterval(countDownSecRef.current);
    };
  }, []);
  React.useState(() => {
    if (type == 'resend') {
      sendLink();
    }
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          minHeight: '100%',
          paddingBottom: 20,
        }}>
        <CircleButton />
        <View>
          <Text
            semiBold
            size={25}
            style={{paddingTop: 30}}
            color={COLORS.darkBlue}>
            Verification Code
          </Text>
          <Text
            lineHeight={'22'}
            style={{marginTop: 10}}
            color={'#868D95'}
            size={14}>
            Check your Email inbox, we have sent the code to
            <Text lineHeight={'22'} color={'#868D95'} size={14} bold>
              {' '}
              {email}
            </Text>{' '}
          </Text>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 30}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {['-', '-', '-', '-']?.map((_, index) => {
              return (
                <View>
                  <Input
                    backgroundColor={{
                      active: COLORS.white,
                      blur:
                        state.inputs?.[index] == '' ? '#ECF2F7' : COLORS.white,
                    }}
                    textColor={{
                      active: 'white',
                      blur: COLORS.dark,
                    }}
                    error={state.errors?.[index]}
                    keyboardType="numeric"
                    maxLength={1}
                    value={state.inputs?.[index]}
                    onFocus={() => {
                      setState(prevState => ({
                        ...prevState,
                        focusedIndex: index,
                      }));
                    }}
                    onChangeText={value => {
                      handleChange(value, index);
                      setState(prevState => {
                        const errors = prevState.errors;
                        errors[index] = '';
                        return {...prevState, errors};
                      });
                    }}
                    ref={ref => inputsRef.current.push(ref)}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 60,
                      paddingHorizontal: 10,
                      marginHorizontal: 5,
                    }}
                    inputStyle={{
                      textAlign: 'center',
                      fontSize: 15,
                      fontFamily: FONTS.PLUS_JAKARTA_SANS_FONTS.medium,
                    }}
                    placeholder=""
                  />
                </View>
              );
            })}
          </View>
          <Text
            color={COLORS.red}
            textAlign={'center'}
            fontWeight={700}
            style={{marginTop: 20}}
            size={13}>
            (00:
            {`${
              state?.remainSecond > 0
                ? state?.remainSecond < 10
                  ? '0' + state?.remainSecond
                  : state?.remainSecond
                : '00'
            }`}
            )
          </Text>
        </View>

        <View>
          {state?.remainSecond < 1 && (
            <Text
              textAlign={'center'}
              lineHeight={'24'}
              size={14}
              color={'#3D3A3B'}
              style={{marginTop: 15}}>
              Didn’t receive a code?{' '}
              <Text
                textAlign={'center'}
                onPress={sendLink}
                lineHeight={'24'}
                style={{textDecorationLine: 'underline'}}
                fontWeight={'700'}
                color={'#D12431'}>
                Resend Code
              </Text>
            </Text>
          )}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Image
            style={{height: 222, width: 222}}
            source={require('../../../assets/images/others/noEmail.png')}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
