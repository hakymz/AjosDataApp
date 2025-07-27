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
import {fetchRequest} from '../../../../helper';
import {useQueryClient} from 'react-query';

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
export const PinScreen = ({navigation, route}) => {
  const {proceed = () => {}} = route?.params || {};
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
          navigation.goBack();

          proceed?.(pin.join(''));
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
          {value == '' && <Icons.FaceId />}
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
        icon={<></>}
      />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          marginTop: 20,
        }}>
        <View>
          <Text size={25} semiBold>
            Please confirm this transaction
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
            Enter your PIN
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
