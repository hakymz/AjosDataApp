import {useFormik} from 'formik';
import React from 'react';
import {
  BigInput,
  Button,
  CustomSafeAreaView,
  FeeContainer,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import * as yup from 'yup';
import {COLORS, GENERAL} from '../../../../conts';
import {useLayouts, useTradeData, useUser} from '../../../../hooks';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useQuery} from 'react-query';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';

const validationSchema = yup.object().shape({
  fromCurrency: yup.number().required('Please input amount'),
  toCurrency: yup.number().required('Please input amount'),
});

const getRates = async () => {
  try {
    const response = await fetchRequest({
      path: 'wallet/rate',
      displayMessage: false,
      showLoader: false,
      method: 'GET',
      data: {fromCurrency: 'USD', toCurrency: 'NGN', amount: 1},
    });

    console.log(response, 'response');
    return response;
  } catch (error) {
    throw error;
  }
};

const swap = async (data, navigation) => {
  console.log(data);
  try {
    const response = await fetchRequest({
      path: 'wallet/swap',
      pageError: {navigation},
      data: {
        amount: data?.amount * 1,
        fromCurrency: data?.fromCurrency,
        toCurrency: data?.toCurrency,
        transactionPin: data?.pin,
      },
    });
    if (response?.status == 'success' && response?.data) {
      navigation.navigate('HomeScreen');
      openSuccessScreen({
        navigation,
      });
    }
  } catch (error) {
    console.log(error, 'erroor ,,,,,');
  }
};

export const SwapCurrencyScreen = ({navigation}) => {
  const {settings} = useUser();
  const {allRates} = useTradeData();

  const [state, setState] = React.useState({
    fromCurrency: settings?.currency == 'NGN' ? 'NGN' : 'USD',
    toCurrency: settings?.currency == 'NGN' ? 'USD' : 'NGN',
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    submitForm,
    handleSubmit,
    isValid,
  } = useFormik({
    initialValues: {fromCurrency: '', toCurrency: ''},
    validationSchema: validationSchema,

    onSubmit: values => {
      navigation.navigate('PinScreen', {
        method: pin => {
          swap(
            {
              pin,
              amount:
                state?.fromCurrency == 'NGN'
                  ? values?.fromCurrency
                  : values?.toCurrency,
              ...state,
            },
            navigation,
          );
        },
      });
    },
  });

  const currentRate = allRates?.currency_swap?.rate;
  const fee = allRates?.currency_swap?.charge;

  console.log(values);

  return (
    <CustomSafeAreaView>
      <AppNav title={'Swap Currency'} line />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <BigInput
          currencyArrow
          currencyLogoBackground={{active: COLORS.black, blur: COLORS.black}}
          currencyLogoColor={{active: COLORS.white, blur: COLORS.white}}
          showCurrencyLogo
          onChangeText={value => {
            if (state.fromCurrency == 'NGN') {
              setFieldValue('fromCurrency', value);
              setFieldValue('toCurrency', (value / currentRate)?.toString?.());
            } else {
              setFieldValue('toCurrency', value);
              setFieldValue(
                'fromCurrency',
                (value * currentRate)?.toString?.(),
              );
            }
          }}
          onBlur={() =>
            setFieldTouched(
              state?.fromCurrency == 'NGN' ? 'fromCurrency' : 'toCurrency',
              true,
            )
          }
          value={
            state?.fromCurrency == 'NGN'
              ? values?.fromCurrency
              : values?.toCurrency
          }
          error={
            state?.fromCurrency == 'NGN'
              ? touched?.fromCurrency && errors?.fromCurrency
              : touched?.toCurrency && errors?.toCurrency
          }
          currency={state?.fromCurrency == 'NGN' ? 'NGN' : 'USD'}
          textColor={{
            active: COLORS.black,
            blur: COLORS.inputGrey,
            placeholderTextColor: COLORS.inputGrey,
          }}
          backgroundColor={{
            active: COLORS.background,
            blur: COLORS.background,
          }}
          placeholder="0"
          title={'You Pay'}
          type="background"
        />

        <View
          style={{
            justifyContent: 'flex-end',
            paddingHorizontal: 30,
            flexDirection: 'row',
          }}>
          <View style={{right: 30, alignItems: 'flex-end'}}>
            <Text size={12} semiBold style={{marginTop: 30}}>
              {state?.fromCurrency == 'NGN'
                ? `${GENERAL.nairaSign}1`
                : `${GENERAL.dollarSign}1`}{' '}
              ={' '}
              <Text size={12} semiBold color={COLORS.primary}>
                {state?.fromCurrency == 'NGN'
                  ? `${(1 / currentRate).toFixed(4) ?? 0}`
                  : `${currentRate || 0}`}
              </Text>
            </Text>

            <Text size={12} semiBold style={{marginTop: 20}}>
              {state?.fromCurrency == 'NGN'
                ? `${GENERAL.nairaSign}`
                : `${GENERAL.dollarSign}`}
              {state?.fromCurrency == 'NGN'
                ? formatAmount((values?.fromCurrency * fee) / 100 ?? 0)
                : formatAmount((values?.toCurrency * fee) / 100 ?? 0)}{' '}
              ={' '}
              <Text size={12} semiBold color={COLORS.primary}>
                Fee
              </Text>
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                setState(prevState => ({
                  ...prevState,
                  fromCurrency:
                    prevState?.fromCurrency == 'NGN' ? 'USD' : 'NGN',
                  toCurrency: prevState?.toCurrency == 'USD' ? 'NGN' : 'USD',
                }));
              }}
              style={style.iconCon}>
              <MyIcons.DoubleArrow size={18} />
            </TouchableOpacity>
            <View style={{height: 105, width: 2, backgroundColor: '#F1F1F1'}} />
          </View>
        </View>

        <BigInput
          editable={false}
          currencyArrow
          currencyLogoBackground={{active: COLORS.black, blur: COLORS.black}}
          currencyLogoColor={{active: COLORS.white, blur: COLORS.white}}
          showCurrencyLogo
          onChangeText={value => {
            if (state.fromCurrency == 'NGN') {
              setFieldValue('toCurrency', value);
              setFieldValue(
                'fromCurrency',
                (value * currentRate)?.toString?.(),
              );
            } else {
              setFieldValue('fromCurrency', value);
              setFieldValue('toCurrency', (value / currentRate)?.toString?.());
            }
          }}
          onBlur={() =>
            setFieldTouched(
              state?.fromCurrency == 'NGN' ? 'toCurrency' : 'fromCurrency',
              true,
            )
          }
          value={
            state?.fromCurrency == 'NGN'
              ? values?.toCurrency - (values?.toCurrency * fee) / 100 ?? 0
              : values?.fromCurrency - (values?.fromCurrency * fee) / 100 ?? 0
          }
          error={
            state?.fromCurrency == 'NGN'
              ? touched?.toCurrency && errors?.toCurrency
              : touched?.fromCurrency && errors?.fromCurrency
          }
          currency={state?.fromCurrency == 'NGN' ? 'USD' : 'NGN'}
          textColor={{
            active: COLORS.black,
            blur: COLORS.inputGrey,
            placeholderTextColor: COLORS.inputGrey,
          }}
          backgroundColor={{
            active: COLORS.background,
            blur: COLORS.background,
          }}
          placeholder="0"
          title={'You Get'}
          type="background"
        />

        <Text size={12} semiBold style={{marginTop: 25, paddingHorizontal: 20}}>
          The Naira (NGN) equivalent would be deposited in your NGN wallet.
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: 40,
            paddingHorizontal: 30,
          }}>
          <Button
            disabled={!values.fromCurrency || !values?.toCurrency || !isValid}
            textColor={'white'}
            type={
              values.fromCurrency && values?.toCurrency && isValid
                ? 'black'
                : 'grey'
            }
            onPress={() => {
              handleSubmit();
            }}
            title="Continue"
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  iconCon: {
    height: 38,
    width: 38,
    backgroundColor: '#F1F1F1',
    position: 'absolute',
    borderRadius: 100,
    marginTop: 20,
    left: -19,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
