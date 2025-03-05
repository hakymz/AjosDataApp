import React from 'react';
import {View, StatusBar, SafeAreaView} from 'react-native';
import {COLORS, FONTS} from '../../../conts';

import {
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';

import {useLayouts, useUser} from '../../../hooks';
import Toast from '../../components/toast/Toast';
import {fetchRequest, openSuccessScreen} from '../../../helper';
import {BackNav} from '../../components/layouts/general/BackNav';

export const OtpScreen = ({navigation, route}) => {
  const {email, type, _id} = route?.params || {};

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
    setState(prevState => ({
      ...prevState,
      inputs: ['', '', '', ''],
      errors: ['', '', '', ''],
    }));
    setTimeout(() => {
      inputsRef?.current?.[0]?.focus();
    }, 100);
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
        path: '/auth/verify-otp',
        data: {
          userId: _id,
          code: values * 1,
        },
        pageError: {
          navigation,
        },
      });
      if (type == 'resetPassword') {
        navigation.navigate('ChangePasswordScreen', {userId: _id});
      } else {
        openSuccessScreen({
          navigation,
          title: 'It seems everything went well and your app profile is ready.',
          btnTitle: 'Proceed to login',
          proceed: () => {
            navigation.navigate('SignInScreen');
          },
        });
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
      <BackNav />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 30,
          minHeight: '100%',
          paddingBottom: 20,
        }}>
        <View>
          <Text bd size={35} textAlign="left" style={{paddingTop: 50}}>
            Verify Code
          </Text>
          <Text
            lineHeight={'22'}
            style={{marginTop: 30}}
            color={'#3D3A3B'}
            size={16}>
            Check your Email inbox, we have sent the code to{' '}
            <Text
              lineHeight={'22'}
              color={'#3D3A3B'}
              size={16}
              fontWeight={'700'}>
              {email}
            </Text>{' '}
          </Text>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 30, height: 220}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {['-', '-', '-', '-']?.map((_, index) => {
              return (
                <View>
                  <Input
                    backgroundColor={{
                      active: '#4961AC',
                      blur: state.inputs?.[index] == '' ? '#EFF1FB' : '#F8F8F8',
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
                      width: 70,
                      height: 70,
                      borderRadius: 15,
                      paddingHorizontal: 10,
                      shadowColor:
                        state?.focusedIndex == index
                          ? 'rgba(49, 75, 206, 0.4)'
                          : 'transparent',
                      shadowOpacity: 0.3,
                      shadowRadius: 7,
                      shadowOffset: {height: 20},
                    }}
                    inputStyle={{
                      textAlign: 'center',
                      fontSize: 40,
                      fontFamily: FONTS.AIRBNBCEREAL_FONTS.Bd,
                    }}
                    placeholder=""
                  />
                </View>
              );
            })}
          </View>
          <Text fontWeight={700} style={{marginTop: 20}} size={13}>
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
          {state?.remainSecond > 0 && (
            <Text
              lineHeight={'24'}
              size={14}
              color={'#3D3A3B'}
              style={{paddingRight: 40}}>
              This session will end in 60 seconds.
            </Text>
          )}

          {state?.remainSecond < 1 && (
            <Text
              lineHeight={'24'}
              size={14}
              color={'#3D3A3B'}
              style={{paddingRight: 40}}>
              Didn’t receive a code?{' '}
              <Text
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
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
