import React from 'react';
import {Image, ScrollView, View, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, CONTACTS, FONTS, GENERAL} from '../../../../conts';
import {
  BottomSheets,
  Button,
  CheckBox,
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {TransactionSummary} from '../../../components/bottomSheetModal/contents';
import {useQuery} from 'react-query';

export const DollarCardScreen = ({navigation}) => {
  const [state, setState] = React.useState({isChecked: false});

  const createCard = async (transactionPin, useCashback) => {
    try {
      const response = await fetchRequest({
        path: 'virtual-card/create',
        data: {transactionPin},
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });

      openSuccessScreen({
        navigation,
        subTitle: 'We have successfully created your virtual dollar card.',
        titleComponent: (
          <View>
            <Text textAlign={'center'} semiBold size={25}>
              You card has been{''}
            </Text>
            <Text textAlign={'center'} bold size={25}>
              Plugged🔌
            </Text>
          </View>
        ),
        image: (
          <Image
            style={{height: 285, width: 285}}
            source={require('../../../../assets/images/others/virtualCardCreated.png')}
          />
        ),
        btnTitle: 'Go To Receipt',
        proceed: () => {
          BottomSheets.show({
            component: <TransactionSummary />,
            customSnapPoints: ['85%', '85%'],
          });
        },
      });
      getAndUpdateUserData();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  React.useEffect(() => {}, []);
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
        <Text
          style={{marginBottom: 20}}
          size={25}
          semiBold
          textAlign={'center'}
          color={COLORS.darkBlue}>
          Create your first Card
        </Text>

        <View
          style={{height: 183, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{
              height: 183,
              width: 287,
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
            <Text medium style={{marginTop: 20}} textAlign={'center'} size={20}>
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

        <View style={{marginTop: 20}}>
          <Text medium size={14} color={'#979797'}>
            We will be charging a creation fee for this card.
          </Text>
          <Text style={{marginTop: 5}} size={25} semiBold>
            $3 - ₦5,235.00
          </Text>
          <View style={{alignItems: 'flex-start', marginTop: 10}}>
            <BillsBalance style={{marginHorizontal: 0}} />
          </View>
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View
            style={{
              marginTop: 20,
              marginBottom: 30,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CheckBox
              isChecked={state.isChecked}
              onPress={() => {
                setState(prevState => ({
                  ...prevState,
                  isChecked: !prevState.isChecked,
                }));
              }}
            />
            <Text
              onPress={() => {
                openLink(CONTACTS.termsLink);
              }}
              color={'#7F8192'}
              fontWeight={'500'}
              style={{paddingLeft: 10}}
              size={12}>
              I’ve read and agree to the
              <Text
                style={{textDecorationLine: 'underline'}}
                color={'#756EF3'}
                fontWeight={'500'}
                size={12}>
                {' '}
                terms of use
              </Text>
            </Text>
          </View>

          <Button
            disabled={!state?.isChecked}
            title={'Proceed'}
            onPress={() => {
              navigation.navigate('PinScreen', {
                proceed: pin => createCard(pin),
              });
            }}
          />
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
