import React from 'react';
import {View, StatusBar, SafeAreaView, Image} from 'react-native';
import {COLORS, FONTS} from '../../../conts';

import {
  Button,
  CircleButton,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';

import {useLayouts, useUser} from '../../../hooks';
import Toast from '../../components/toast/Toast';
import {fetchRequest, openSuccessScreen} from '../../../helper';
import {BackNav} from '../../components/layouts/general/BackNav';

export const WelcomeScreen = ({navigation, route}) => {
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

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          minHeight: '100%',
          paddingBottom: 50,
        }}>
        <CircleButton />

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{height: 316, width: 316}}
            source={require('../../../assets/images/others/about-our-team.png')}
          />
        </View>
        <View>
          <Text
            semiBold
            size={25}
            style={{paddingTop: 30}}
            color={COLORS.darkBlue}>
            Welcome to Ajebo{''}
            <Text
              bold
              size={25}
              style={{paddingTop: 30}}
              color={COLORS.darkBlue}>
              Plug🔌
            </Text>
          </Text>
          <Text
            lineHeight={'22'}
            style={{marginTop: 10}}
            color={'#868D95'}
            size={14}>
            We have successfully created your account, you can go ahead to
            log-in.
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', marginTop: 30}}>
          <Button
            title={'Log Me in'}
            onPress={() => {
              navigation.navigate('SignInScreen');
            }}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
