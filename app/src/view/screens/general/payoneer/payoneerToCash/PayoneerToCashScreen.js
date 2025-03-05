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
} from '../../../../components/general';
import {AppNav} from '../../../../components/layouts';
import * as yup from 'yup';
import {COLORS, GENERAL, IMAGES} from '../../../../../conts';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useQuery} from 'react-query';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../../helper';
import {useTradeData} from '../../../../../hooks';

const validationSchema = yup.object().shape({
  fromCurrency: yup.number().required('Please input amount'),
  //   toCurrency: yup.number().required('Please input amount'),
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

export const PayoneerToCashScreen = ({navigation}) => {
  const {allRates} = useTradeData();
  console.log(allRates?.payoneer);
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    submitForm,
    handleSubmit,
    isValid,
    setValues,
  } = useFormik({
    initialValues: {fromCurrency: '', toCurrency: ''},
    validationSchema: validationSchema,

    onSubmit: values => {
      navigation.navigate('PayoneerToCashNex1Screen', {...values});
    },
  });

  const currentRate = allRates?.payoneer?.rate;
  const fee = (allRates?.payoneer?.charge * values?.fromCurrency) / 100 ?? 0;

  return (
    <CustomSafeAreaView>
      <AppNav title={<Text semiBold>Payoneer to Cash</Text>} line />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <BigInput
          customIcon={
            <Image
              style={{height: 22, width: 22, right: -5}}
              source={IMAGES.payoneer}
            />
          }
          currencyLogoBackground={{active: COLORS.black, blur: COLORS.black}}
          currencyLogoColor={{active: COLORS.white, blur: COLORS.white}}
          showCurrencyLogo
          onChangeText={value => {
            setValues({
              ...values,
              fromCurrency: value,
              toCurrency: value * currentRate,
            });
          }}
          onBlur={() => setFieldTouched('fromCurrency', true)}
          value={values?.fromCurrency}
          error={touched?.fromCurrency && errors?.fromCurrency}
          currency={'USD'}
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
              $1 ={' '}
              <Text size={12} semiBold color={COLORS.primary}>
                {allRates?.payoneer?.rate || 0}
              </Text>
            </Text>

            <Text size={12} semiBold style={{marginTop: 20}}>
              ${formatAmount(fee)} ={' '}
              <Text size={12} semiBold color={COLORS.primary}>
                Fee
              </Text>
            </Text>
          </View>
          <View>
            <View style={style.iconCon}>
              <MyIcons.DoubleArrow size={18} />
            </View>
            <View style={{height: 105, width: 2, backgroundColor: '#F1F1F1'}} />
          </View>
        </View>

        <BigInput
          editable={false}
          currencyLogoBackground={{active: COLORS.black, blur: COLORS.black}}
          currencyLogoColor={{active: COLORS.white, blur: COLORS.white}}
          showCurrencyLogo
          onChangeText={value => {
            setFieldValue('toCurrency', value);
          }}
          onBlur={() => setFieldTouched('toCurrency', true)}
          value={values?.toCurrency - fee * (allRates?.payoneer?.rate || 0)}
          // error={touched?.toCurrency}
          currency={'NGN'}
          textColor={{
            active: COLORS.black,
            blur: COLORS.black,
            placeholderTextColor: COLORS.black,
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
