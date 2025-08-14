import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {AVATAR, COLORS, IMAGES} from '../../../conts';
import {
  CircleButton,
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';

import {MainHeader} from '../../components/layouts';

import {useQueryClient} from 'react-query';
import {useUser} from '../../../hooks';
import {
  fetchRequest,
  getUserDetailsFromKeyChain,
  saveUserDetailsToKeyChain,
} from '../../../helper';
import Toast from '../../components/toast/Toast';

const numberList = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '',
  '0',
  'Delete',
];
export const LoginWithPinScreen = ({navigation, route}) => {
  const {proceed = () => {}} = route?.params || {};
  const {data, settings, updateUserData} = useUser();
  const [state, setState] = React.useState({
    error: false,
    pin: [],
    currentPin: [],
  });

  const addOrDeletePin = (number, state, setState) => {
    let pin = [...state?.pin];
    let currentPin = state.currentPin;
    let error = false;

    if (number == 'Cancel') {
      pin = [];
      currentPin = '';
    } else if (number == 'Delete') {
      pin.pop();
    } else {
      if (number) {
        if (state?.pin.length < 4) {
          pin = [...state.pin, number];
        }
        if (pin.length == 4) {
          signInWithPin({email: data?.user?.email, pin: pin.join('')});
        }
      }
    }

    setState(prevState => ({
      ...prevState,
      pin,
      currentPin,
      title: '',
      error,
    }));
  };

  const Btn = ({value}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (value == '') {
            if (settings?.biometric) {
              signInWithAuth({});
            } else {
              Toast.show('error', 'Biometric authentication is not enabled.');
            }
          } else {
            addOrDeletePin(value, state, setState);
          }
        }}
        style={{
          height: 60,
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#E9E6F7',
          marginBottom: 10,
          marginHorizontal: 5,
          borderRadius: 32,
          justifyContent: 'center',
        }}>
        <Text size={20} semiBold>
          {value == '' && <Icons.FaceId />}
          {value == 'Delete' ? <Icons.DeletePenBlue /> : value}
        </Text>
      </TouchableOpacity>
    );
  };

  const signInWithPin = async value => {
    try {
      const response = await fetchRequest({
        path: 'auth/login-with-pin',
        data: value,
      });

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
        data: {...response?.data},
        settings: currentSettings,
      });
    } catch (error) {
      console.log(error, 'errr');
    }
  };

  const signInWithAuth = async () => {
    try {
      let auth = true;

      const details = await getUserDetailsFromKeyChain();

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
  const signIn = async value => {
    try {
      const response = await fetchRequest({
        path: '/auth/login',
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
        data: {...response?.data},
        settings: currentSettings,
      });
    } catch (error) {
      console.log(error, 'errr');
    }
  };

  return (
    <CustomSafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          marginTop: 20,
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
        <View>
          <Text color={'#868D95'} size={14} style={{paddingTop: 10}}>
            Welcome back
          </Text>

          <Text semiBold color={COLORS.darkBlue} size={25} style={{}}>
            Holla! {data?.user?.firstName}
          </Text>
        </View>

        {/* Inputs Section */}
        <View style={{marginTop: 70}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {['-', '-', '-', '-']?.map((_, index) => {
              return (
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 60,
                    backgroundColor: '#E9E6F7',
                    marginHorizontal: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {state?.pin[index] && (
                    <View
                      style={{
                        height: 7,
                        width: 7,
                        backgroundColor: state?.error
                          ? COLORS.error
                          : COLORS.darkBlue,
                        borderRadius: 5,
                      }}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Text
            bold
            color={COLORS.primary}
            size={16}
            style={{marginTop: 80, marginBottom: 30}}
            textAlign={'center'}>
            Enter your PIN to Log-in
          </Text>
          <FlatList
            data={numberList}
            renderItem={({item}) => <Btn value={item} />}
            numColumns={3}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            updateUserData({
              data: data,
              settings: {...settings, biometric: false},
            });
            navigation.navigate('SignInScreen');
          }}
          style={{marginTop: 30}}>
          <Text textAlign={'center'} color={'#848A94'}>
            Not me?{' '}
            <Text semiBold textAlign={'center'} color={COLORS.primary}>
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
