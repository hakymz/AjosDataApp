import React from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../../components/general';

import {useLayouts} from '../../../../hooks';
import {AppNav, BackNav} from '../../../components/layouts';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {useQueryClient} from 'react-query';
import {SafeAreaView} from 'react-native';

const DisplayInput = ({state}) => {
  const Dot = ({color}) => {
    return (
      <View
        style={{
          height: s(10),
          width: s(10),
          backgroundColor: color,
          borderRadius: 20,
        }}
      />
    );
  };

  return (
    <View style={{marginTop: 40, alignItems: 'center'}}>
      <View style={style.displayCon}>
        {['', '', '', ''].map((_, index) => (
          <Dot
            color={
              state?.error
                ? COLORS?.red
                : state?.pin[index]
                ? COLORS.primary
                : '#D0D0D0'
            }
          />
        ))}
      </View>
    </View>
  );
};

const Button = ({number, setState, state, proceed}) => {
  return (
    <View style={{flex: 1, height: s(70), justifyContent: 'center'}}>
      <TouchableOpacity
        disabled={state?.error && number != 'del'}
        onPress={() => addOrDeletePin(number, state, setState, proceed)}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        {number == 'del' ? (
          <View
            style={{
              height: s(55),
              width: s(55),
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{rotate: '180deg'}],
            }}>
            <MyIcons.ArrowGreen size={22} />
          </View>
        ) : (
          <Text
            size={25}
            semiBold
            color={'#002444'}
            lineHeight={30}
            textAlign="center">
            {number}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const DisplayButton = ({state, setState, proceed}) => {
  return (
    <View style={{marginTop: 20}}>
      <FlatList
        numColumns={3}
        data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']}
        renderItem={({item}) => {
          return (
            <Button
              number={item}
              state={state}
              setState={setState}
              proceed={proceed}
            />
          );
        }}
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <View
          style={{
            height: s(40),
            width: s(40),
            backgroundColor: COLORS.white,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MyIcons.Pin size={22} />
        </View>
      </View>
    </View>
  );
};

const addOrDeletePin = (number, state, setState, proceed) => {
  let pin = [...state.pin, number];
  let title = state?.title;
  let currentPin = state.currentPin;
  let confirmPin = state.confirmPin;
  let oldPin = state.oldPin;
  let error = false;
  if (number == 'del') {
    pin = state?.pin;
    confirmPin = '';
    pin?.pop();
  } else {
    if (number != '' && state?.pin.length < 4) {
      if (state?.pin.length == 3) {
        if (!state.oldPin && state?.type != 'set') {
          oldPin = pin?.join('');
          pin = [];
          title = 'Enter your Unique 4-digit Pin';
        } else if (!currentPin) {
          currentPin = pin?.join('');
          pin = [];
          title = 'Confirm your 4-digit Pin';
        } else if (!confirmPin) {
          title = 'Confirm your 4-digit Pin';
          confirmPin = pin?.join('');

          // check for pins
          if (pin?.join('') != currentPin) {
            error = true;
          } else {
            console.log('Yezs');
            proceed({...state, pin, confirmPin, currentPin, oldPin});
          }
        }
      }
    }
  }

  setState(prevState => ({
    ...prevState,
    pin,
    confirmPin,
    currentPin,
    oldPin,
    title,
    error,
  }));
};
export const SetPinScreen = ({navigation, route}) => {
  const {type = 'set', password = ''} = route?.params || {};
  console.log(password);

  const [state, setState] = React.useState({
    showButton: false,
    error: false,
    resendOtp: false,
    remainSecond: 60,
    inputs: ['', '', '', ''],
    errors: ['', '', '', ''],
    oldPin: '',
    currentPin: '',
    confirmPin: '',
    focusedIndex: null,
    type,
    title:
      type == 'set'
        ? 'Create PIN'
        : type == 'reset'
        ? 'Enter New PIN'
        : 'Enter Current PIN',
    details:
      type == 'set'
        ? 'Please enter your unique 4-digit PIN to enable you complete transactions safely.'
        : 'Please enter your current 4-digit PIN so we are sure it is you.',
  });

  const getTextDetails = () => {
    if (state?.type == 'set') {
      return (
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
          to enable you complete transactions safely.
        </Text>
      );
    } else if (state?.type == 'reset') {
      if (state?.currentPin?.length > 3) {
        return (
          <Text
            lineHeight={'22'}
            style={{marginTop: 30}}
            color={'#3D3A3B'}
            size={16}>
            Please re-enter your{' '}
            <Text
              lineHeight={'22'}
              color={'#3D3A3B'}
              size={16}
              fontWeight={'700'}>
              4-digit PIN
            </Text>{' '}
            so we are sure it is correct.
          </Text>
        );
      } else {
        return (
          <Text
            lineHeight={'22'}
            style={{marginTop: 30}}
            color={'#3D3A3B'}
            size={16}>
            Please enter your New{' '}
            <Text
              lineHeight={'22'}
              color={'#3D3A3B'}
              size={16}
              fontWeight={'700'}>
              4-digit PIN
            </Text>{' '}
            so we are can help you save your preference.
          </Text>
        );
      }
    } else if (state?.type != 'set') {
      return (
        <Text
          lineHeight={'22'}
          style={{marginTop: 30}}
          color={'#3D3A3B'}
          size={16}>
          Please enter your current{' '}
          <Text
            lineHeight={'22'}
            color={'#3D3A3B'}
            size={16}
            fontWeight={'700'}>
            4-digit PIN
          </Text>{' '}
          so we are sure it is you.
        </Text>
      );
    }
  };

  const inputsRef = React.useRef([]);

  const handleChange = (value, index) => {
    setState(prevState => {
      let currentPin = prevState.currentPin;
      let confirmPin = prevState.confirmPin;
      let oldPin = prevState.oldPin;
      let title = prevState?.title;
      let error = prevState?.error;
      let newInputsValue = prevState.inputs;
      newInputsValue[index] = value;
      if (newInputsValue?.[index]) {
        inputsRef?.current?.[index + 1]?.focus();
      }

      if (newInputsValue?.join('') == '') {
        currentPin = '';
        if (prevState?.type == 'set') {
          title = 'Create PIN';
        } else {
          title = 'Enter Current PIN';
        }
      } else if (prevState?.inputs[3] != '') {
        console.log(prevState?.type);
        if (
          !prevState.oldPin &&
          prevState?.type != 'set' &&
          prevState?.type != 'reset'
        ) {
          oldPin = newInputsValue?.join('');
          newInputsValue = ['', '', '', ''];
          inputsRef?.current?.[0]?.focus();
          title = 'Enter New PIN';
          error = false;
        } else if (!currentPin) {
          currentPin = newInputsValue?.join('');
          newInputsValue = ['', '', '', ''];
          inputsRef?.current?.[0]?.focus();

          title = 'Re-Enter PIN';
          error = false;
        } else if (!confirmPin) {
          title = 'Re-Enter PIN';

          confirmPin = newInputsValue?.join('');

          // check for pins
          if (newInputsValue?.join('') != currentPin) {
            console.log('yess errrror');
            error = true;
          } else {
            setPin();
          }
        }
      } else {
        confirmPin = '';
        error = false;
      }

      return {
        ...prevState,
        inputs: newInputsValue,
        confirmPin,
        currentPin,
        oldPin,
        title,
        error,
      };
    });
  };

  const queryClient = useQueryClient();

  const setPin = async () => {
    const data =
      state?.type == 'set'
        ? {
            newPin: state?.currentPin,
            confirmPin: state?.currentPin,
          }
        : {
            oldPin: state?.oldPin,
            newPin: state?.currentPin,
            confirmPin: state?.currentPin,
          };

    try {
      const response = await fetchRequest({
        path:
          type == 'reset'
            ? 'settings/forgot-transaction-pin'
            : 'settings/change-transaction-pin',
        data:
          type == 'reset'
            ? {
                password: password,
                newPin: state?.currentPin,
                confirmPin: state?.currentPin,
              }
            : data,
      });
      queryClient.invalidateQueries({queryKey: ['userData']});

      openSuccessScreen({
        navigation,
        title: 'New Pin Saved successfully',
        proceed: () => navigation.navigate('ProfileScreen'),
        btnTitle: 'Head back to Profile',
      });
    } catch (error) {
      navigation.goBack();
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
            {state?.title}
          </Text>
          {getTextDetails()}
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
                      setState(prevState => {
                        const errors = prevState.errors;
                        errors[index] = '';
                        return {...prevState, errors};
                      });
                    }}
                    ref={ref => inputsRef.current.push(ref)}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 15,
                    }}
                    conStyle={{height: '100%'}}
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
