import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {COLORS, FONTS} from '../../../../conts';
import {
  BottomSheets,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';

import {BackNav} from '../../../components/layouts';
import {useUser} from '../../../../hooks';
import {authUserWithBiometric} from '../../../../helper';
import {Biometric} from '../../../components/bottomSheetModal/contents';
import {BioMetricSettings} from '../../../components/bottomSheetModal/contents/BioMetricSettings';
import {Preloader} from '../../../components/loaders';

export const PinScreen = ({navigation, route}) => {
  const {proceed = () => {}, type} = route?.params || {};
  const {settings} = useUser();
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

  const handleChange = async (value, index) => {
    const currentState = {...state};

    const newInputsValue = currentState.inputs;
    newInputsValue[index] = value;
    if (newInputsValue?.[index]) {
      inputsRef?.current?.[index + 1]?.focus();
    }

    if (currentState?.inputs[3]) {
      Preloader.show();
      const response = await proceed(newInputsValue?.join?.(''));
      navigation.goBack();
    }

    const errors = currentState.errors;
    errors[index] = '';

    try {
      setState(prevState => ({...prevState, inputs: newInputsValue}));
    } catch (error) {}
  };

  const goBackInInput = index => {
    if (state?.inputs[index] == '') {
      inputsRef?.current?.[index - 1]?.focus?.();
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
            Enter PIN
          </Text>
          {type == 'validate' ? (
            <Text
              lineHeight={'22'}
              style={{marginTop: 30}}
              color={'#3D3A3B'}
              size={16}>
              Please enter your unique{' '}
              <Text
                lineHeight={'22'}
                color={'#3D3A3B'}
                size={16}
                fontWeight={'700'}>
                4-digit PIN
              </Text>{' '}
              {''}
              to enable you activate Biometrics.
            </Text>
          ) : (
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
                4-digit PIN
              </Text>{' '}
              {''}
              to complete the transaction.
            </Text>
          )}
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
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 15,
                    shadowColor:
                      state?.focusedIndex == index
                        ? 'rgba(49, 75, 206, 0.4)'
                        : 'transparent',
                    shadowOpacity: 0.3,
                    shadowRadius: 7,
                    shadowOffset: {height: 20},
                    borderWidth: 1,
                    borderColor: state?.error ? '#EC2B27' : 'transparent',
                  }}>
                  {state.inputs?.[index] != '' &&
                    state?.focusedIndex != index && (
                      <TouchableOpacity
                        activeOpacity={0}
                        onPress={() => {
                          setState(prevState => ({
                            ...prevState,
                            focusedIndex: index,
                          }));

                          inputsRef?.current?.[index]?.focus();
                        }}
                        style={{
                          position: 'absolute',
                          height: '100%',
                          width: '100%',
                          backgroundColor: '#F8F8F8',
                          zIndex: 10,
                          borderRadius: 15,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            height: 17,
                            width: 17,
                            borderRadius: 20,
                            backgroundColor: state?.error
                              ? '#EC2B27'
                              : '#231F20',
                          }}
                        />
                      </TouchableOpacity>
                    )}

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
                      // setState(prevState => {
                      //   const errors = prevState.errors;
                      //   errors[index] = '';
                      //   return {...prevState, errors};
                      // });
                    }}
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        goBackInInput(index);
                      }
                    }}
                    ref={ref => inputsRef.current.push(ref)}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 15,
                    }}
                    conStyle={{height: '100%', paddingHorizontal: 0}}
                    inputStyle={{
                      textAlign: 'center',
                      fontSize: 40,
                      fontFamily: FONTS.AIRBNBCEREAL_FONTS.Bd,
                      paddingHorizontal: 0,
                    }}
                    placeholder=""
                  />
                </View>
              );
            })}
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            {type != 'validate' && (
              <TouchableOpacity
                onPress={async () => {
                  if (!settings?.pinBiometric) {
                    BottomSheets.show({component: <BioMetricSettings />});
                    return false;
                  }
                  try {
                    const auth = await authUserWithBiometric(
                      'Your auth is needed to proceed.',
                    );

                    if (auth) {
                      settings?.transactionPin
                        ?.split('')
                        ?.forEach((element, index) => {
                          handleChange(element, index);
                        });
                    }
                  } catch (error) {
                    Toast.show('error', 'Authentication failed.');
                  }
                }}
                style={{
                  height: 53,
                  width: 155,
                  backgroundColor: '#F8F8F8',
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  marginTop: 10,
                }}>
                {Platform.OS == 'ios' ? (
                  <Icons.FaceId size={23} />
                ) : (
                  <Icons.Biometrics size={23} />
                )}

                <Text style={{marginLeft: 10}} size={16} bd>
                  {Platform.OS == 'ios' ? 'Face-ID' : 'Biometrics'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            onPress={() => {
              navigation.navigate('ResetPinPasswordScreen');
            }}
            style={{textDecorationLine: 'underline'}}
            textAlign={'center'}
            size={16}
            fontWeight={'500'}>
            Reset PIN
          </Text>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  iconCon: {
    height: s(29),
    width: s(29),
    backgroundColor: '#402274',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 230,
    height: 60,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
});
