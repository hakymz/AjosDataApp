import React from 'react';
import {
  Image,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, FONTS} from '../../../../conts';
import {
  Button,
  CheckBox,
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {fetchRequest} from '../../../../helper';
import {useQuery} from 'react-query';
const Btn = ({title, icon}) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: COLORS.white,
        borderRadius: 32,
      }}>
      <View></View>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export const DollarCardDetailsScreen = ({navigation}) => {
  const [state, setState] = React.useState({});
  const getDollarCards = async () => {
    try {
      const response = await fetchRequest({
        path: '/virtual-card',
        method: 'GET',

        headers: {debounceToken: new Date().getTime()},
      });

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const {data} = useQuery('getDollarCards', getDollarCards);

  if (data?.data?.length === 0) {
    navigation.replace('DollarCardScreen');
  }
  return (
    <CustomSafeAreaView style={{backgroundColor: COLORS.background}}>
      <MainHeader nav title={'Dollar Card'} />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: COLORS.background,
          paddingHorizontal: 20,
          marginTop: 10,
          paddingBottom: 80,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 20,
            justifyContent: 'space-between',
          }}>
          <Text size={25} semiBold color={COLORS.darkBlue}>
            Cards
          </Text>
          <View
            style={{
              height: 35,
              backgroundColor: COLORS.white,
              paddingHorizontal: 18,
              borderRadius: 32,
              justifyContent: 'center',
            }}>
            <Text size={12} bold color={'#151521'}>
              View Card Details
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              height: 183,
              flex: 1,
              marginRight: 15,
            }}>
            <Image
              style={{
                height: 183,
                width: '100%',
                borderRadius: 18,
                position: 'absolute',
              }}
              source={require('../../../../assets/images/others/cardBg.png')}
            />
            <View style={{flex: 1, paddingHorizontal: 20, paddingVertical: 20}}>
              <Text
                textAlign={'center'}
                fontType={FONTS.MONTSERRAT}
                semiBold
                size={12}
                color={'#111B21'}>
                Bankole Ajanlekoko
              </Text>
              <Text
                medium
                style={{marginTop: 20}}
                textAlign={'center'}
                size={20}>
                **** 5652 3356 3447
              </Text>

              <Text size={11} style={{marginTop: 60}} textAlign={'center'}>
                Exp{' '}
                <Text semiBold size={11} textAlign={'center'}>
                  **/**
                </Text>
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 183,
              width: 38,
              borderWidth: 1.4,
              borderRadius: 18,
              borderStyle: 'dashed',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 100,
                transform: [{rotate: '-90deg'}],
                left: -33,
                top: -20,
              }}>
              <Text size={12} medium style={{}} color={'#151521'}>
                Add Card
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  con: {
    height: 310,
    backgroundColor: COLORS.yellow,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  iconCon: {
    height: 42,
    width: 42,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
