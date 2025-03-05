import {
  SafeAreaView,
  View,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  TextInput,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {COLORS} from '../../../../conts';
import {
  Button,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';

import {useLayouts} from '../../../../hooks';
import {AppNav} from '../../../components/layouts';
import {fetchRequest} from '../../../../helper';
import {useNavigation} from '@react-navigation/native';

const InputsContainer = ({error, setState, userId}) => {
  const navigation = useNavigation();
  const pinsList = ['', '', '', ''];

  const inputsRef = React.useRef([]);
  const [pins, setPins] = React.useState(['', '', '', '']);

  const verifyOtp = async value => {
    try {
      const response = await fetchRequest({
        path: '/auth/verify-otp/',
        data: value,
      });

      setState(prevState => ({
        ...prevState,
        error: false,
      }));
      navigation.navigate('ChangePasswordScreen', {
        userId,
      });
    } catch (error) {
      setPins(['', '', '', '']);
      setState(prevState => ({
        ...prevState,
        error: true,
      }));
      console.log(error);
    }
  };

  React.useEffect(() => {
    console.log('yess');
    console.log(pins);
    if (pins[3]) {
      verifyOtp({userId, code: pins?.join('')});
    }
  }, [pins]);

  return (
    <View style={style.inputsContainer}>
      {pinsList?.map((_, index) => (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TextInput
            ref={ref => inputsRef.current.push(ref)}
            keyboardType="numeric"
            onChangeText={value => {
              currentPins = [...pins];
              currentPins[index] = value[value.length - 1];
              setPins(currentPins);
              setState(prevState => ({
                ...prevState,
                error: false,
              }));
              if (currentPins[index]) {
                inputsRef?.current?.[index].clear();
                inputsRef?.current?.[index + 1]?.focus();
              }

              if (index == 3) {
                Keyboard.dismiss();
              }
            }}
            caretHidden={true}
            style={{
              flex: 1,
              position: 'absolute',
              zIndex: 20,
              width: 20,
              color: 'transparent',
            }}
          />
          <View
            style={{
              height: s(10),
              width: s(10),
              backgroundColor: error
                ? '#EE2933'
                : pins[index] == '' || pins[index] == undefined
                ? COLORS.lightGrey
                : COLORS.primary,
              borderRadius: 10,
            }}
          />
        </View>
      ))}
    </View>
  );
};
export const ForgotPasswordOtpScreen = ({navigation, route}) => {
  const {sendResetLink, userId} = route?.params || {};

  const [state, setState] = React.useState({
    showButton: false,
    lastTimeInputWasUpdated: null,
    email: null,
    error: false,
    resendOtp: false,
    remainSecond: 60,
  });
  const countDownSecRef = React.useRef();

  const {minHeight} = useLayouts();
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <AppNav onPress={navigation.goBack} title={'Enter OTP'} />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 30,
          minHeight: minHeight - 70,
        }}>
        <View style={{alignItems: 'center', marginTop: 0, flex: 1}}>
          <LottieView
            style={{
              width: s(125),
              height: s(125),
              marginTop: 10,
            }}
            autoPlay
            loop={true}
            source={require('../../../../assets/lottieFiles/others/forgotPassword.json')}
          />

          <Text lineHeight={16} style={{paddingTop: 60, textAlign: 'center'}}>
            Please input the OTP sent to your email address and phone number
          </Text>
          <InputsContainer
            userId={userId}
            setState={setState}
            onChangeText={values => {
              console.log(values);
            }}
            error={state.error}
          />
          {state.error && (
            <Text semiBold color={COLORS.red} style={{marginTop: 15}}>
              Incorrect OTP, Try again
            </Text>
          )}

          <View style={{marginTop: 50, width: '100%', flex: 1}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  marginBottom: 20,
                }}>
                <View>
                  {!state.resendOtp && (
                    <Text
                      textAlign={'center'}
                      semiBold
                      size={16}
                      color={'#979797'}
                      style={{
                        marginBottom: 30,
                        textDecorationLine: 'underline',
                      }}>
                      0:{''}
                      {`${
                        state?.remainSecond < 10
                          ? '0' + state?.remainSecond
                          : state?.remainSecond
                      }`}{' '}
                      {state?.remainSecond < 2 ? 'second' : 'seconds'}
                    </Text>
                  )}
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Button
                    disabled={!state.resendOtp}
                    titleStyle={{color: COLORS.white}}
                    onPress={() => {
                      sendResetLink();
                      countDownSec();
                    }}
                    type="grey"
                    title="Resend OTP"
                    style={{
                      width: 'auto',
                      flex: 1,
                      paddingHorizontal: 5,
                      backgroundColor: state.resendOtp
                        ? COLORS.primary
                        : COLORS.lightGrey,
                    }}
                  />
                  <View style={{width: 7}} />

                  <Button
                    onPress={() => {
                      navigation.navigate('ChangePasswordScreen');
                    }}
                    type="black"
                    title="Submit"
                    style={{width: 'auto', flex: 1, paddingHorizontal: 5}}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  inputsContainer: {
    height: s(55),
    backgroundColor: '#F8F8F8',
    width: s(230),
    marginTop: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
