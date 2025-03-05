import React from 'react';
import {View, StatusBar, SafeAreaView, TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../../../../conts';

import {
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';

import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {BackNav} from '../../../components/layouts/general/BackNav';
import Toast from '../../../components/toast/Toast';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';

export const OtpScreenDataToCash = ({navigation, route}) => {
  const {phone} = route?.params || {};

  const [state, setState] = React.useState({
    showButton: false,
    error: false,
    resendOtp: false,
    remainSecond: 60,
    inputs: ['', '', '', '', '', ''],
    errors: ['', '', '', '', '', ''],
    focusedIndex: null,
  });

  const inputsRef = React.useRef([]);
  const countDownSecRef = React.useRef();

  const clear = () => {
    setState(prevState => ({
      ...prevState,
      inputs: ['', '', '', '', '', ''],
      errors: ['', '', '', '', '', ''],
    }));
    setTimeout(() => {
      inputsRef?.current?.[0]?.focus();
    }, 100);
  };

  const handleChange = async (value, index) => {
    const currentState = {...state};

    const newInputsValue = currentState.inputs;
    newInputsValue[index] = value;
    if (newInputsValue?.[index]) {
      inputsRef?.current?.[index + 1]?.focus();
    }

    if (currentState?.inputs[5]) {
      const response = await verifyOtp(newInputsValue?.join?.(''));
    }

    const errors = currentState.errors;
    errors[index] = '';

    try {
      setState(prevState => ({...prevState, inputs: newInputsValue}));
    } catch (error) {}
  };

  const verifyOtp = async values => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/reseller/verify-otp',
        data: {
          phoneNumber: phone,
          code: values * 1,
        },
        pageError: {
          navigation,
        },
      });

      openSuccessScreen({
        navigation,
        title: `We have successfully linked you to this number ${phone}`,
        btnTitle: 'Proceed to login',

        btnComponent: (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 80,
              justifyContent: 'center',
            }}>
            <SuccessHomeBtn title={'Go Home'} />
            <SuccessShadowBtn
              title={'Convert Data'}
              onPress={() => {
                navigation.navigate('DataToCashScreen');
              }}
            />
          </View>
        ),
        proceed: () => {
          navigation.navigate('SignInScreen');
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      clear();
    }
  };

  const sendLink = async values => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/reseller/sim-linking',
        data: {
          phoneNumber: phone,
        },
      });

      countDownSec();
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

  const proceed = () => {
    if (!state?.inputs[5]) {
      Toast.show('error', 'Please enter Otp to continue.');
    } else {
      verifyOtp(state?.inputs?.join?.(''));
    }
  };
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
            Enter OTP
          </Text>
          <Text
            lineHeight={'22'}
            style={{marginTop: 30}}
            color={'#3D3A3B'}
            size={16}>
            Please enter your{' '}
            <Text
              lineHeight={'22'}
              color={'#3D3A3B'}
              size={16}
              fontWeight={'700'}>
              6-digit OTP
            </Text>{' '}
            to complete your SIM-Link.{' '}
          </Text>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 30, height: 220}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {['-', '-', '-', '-', '-', '-']?.map((_, index) => {
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
                      width: 50,
                      height: 50,
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
                      fontSize: 30,
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

      {/* <TouchableOpacity
        onPress={() => {
          proceed();
        }}
        style={{
          height: 80,
          width: 80,
          backgroundColor: COLORS.primary,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#820300',
          shadowOpacity: 0.5,
          shadowRadius: 15,
          elevation: 15,
          shadowOffset: {width: 10, height: 10},
          position: 'absolute',
          zIndex: 10,
          right: 24,
          bottom: 24,
        }}>
        <Text md size={14} color={COLORS.white}>
          DONE
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};
