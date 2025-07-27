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
import {AVATAR, COLORS} from '../../../../conts';
import {
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';

import {MainHeader} from '../../../components/layouts';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {useQueryClient} from 'react-query';
import {PageList} from '../../../components/lists';

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
export const ChangePinScreen = ({navigation, route}) => {
  const [state, setState] = React.useState({
    error: false,
    pin: [],
    currentPin: [],
    oldPin: [],
  });

  const queryClient = useQueryClient();

  const addOrDeletePin = (number, state, setState) => {
    let pin = [...state?.pin];
    let title = state?.title;
    let currentPin = state.currentPin;
    let oldPin = state.oldPin;
    let error = false;
    console.log(oldPin, title, 'oldPinoldPin ');

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
          if (oldPin?.length == 0 && pin.length == 4) {
            oldPin = pin?.join('');
            title = 'Your New 4-digit unique PIN';
            pin = [];
          } else if (currentPin?.length == 0 && pin.length == 4) {
            currentPin = pin?.join('');
            title = 'Confirm your 4-digit unique PIN';
            pin = [];
          } else if (currentPin?.length == 4) {
            if (pin?.join('') != currentPin) {
              error = 'Pin must match';
              pin = [];
              currentPin = '';
              oldPin = '';
              title = '';
            } else {
              setPin();
            }
          }
        }
      }
    }

    setState(prevState => ({
      ...prevState,
      pin,
      currentPin,
      oldPin,
      title,
      error,
    }));
  };

  const setPin = async () => {
    try {
      const response = await fetchRequest({
        path: 'settings/change-transaction-pin',
        data: {
          oldPin: state?.oldPin,
          newPin: state?.currentPin,
          confirmPin: state?.currentPin,
        },
      });
      navigation.goBack();
      openSuccessScreen({
        navigation,
        title: 'You are a sure Plug🔌',
        subTitle: 'We have successfully saved your new unique 4-digit PIN.',
        btnTitle: 'Go Home',
        proceed: () => navigation.navigate('HomeScreen'),
      });
      queryClient.invalidateQueries({queryKey: ['userData']});
    } catch (error) {}
  };

  const Btn = ({value}) => {
    return (
      <TouchableOpacity
        disabled={!value}
        onPress={() => {
          addOrDeletePin(value, state, setState);
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
          {value == 'Delete' ? <Icons.DeletePenBlue /> : value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <CustomSafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <MainHeader
        backgroundColor={COLORS.white}
        nav
        title={<></>}
        icon={<Icons.Unlock size={30} />}
      />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          marginTop: 20,
        }}>
        <View>
          <Text size={18} bold color={COLORS.darkBlue}>
            Security
          </Text>
          <Text
            style={{marginTop: 5, marginBottom: 25}}
            size={12}
            medium
            color={'#979797'}>
            You can change or reset your password or PIN to enable a safer app
            experience
          </Text>
          <PageList rightIcon={<></>}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icons.AddCategory />
              <Text style={{marginLeft: 8}} size={14} semiBold>
                Change PIN
              </Text>
            </View>
          </PageList>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 20}}>
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
            size={16}
            color={state?.error ? COLORS.error : COLORS.primary}
            style={{marginTop: 40, marginBottom: 30}}
            textAlign={'center'}>
            {state?.error
              ? state?.error
              : !state?.title
              ? 'Current 4-digit unique PIN'
              : state?.title}
          </Text>
          <FlatList
            data={numberList}
            renderItem={({item}) => <Btn value={item} />}
            numColumns={3}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
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
