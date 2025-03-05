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
import {fetchRequest, openSuccessScreen} from '../../../../../helper';

const validationSchema = yup.object().shape({
  transactionId: yup
    .string()
    .required('Please input transaction Id')
    .min(9, 'Min of 9 character'),
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

const sendTransactionId = async (data, navigation) => {
  try {
    const response = await fetchRequest({
      path: 'wallet/send-to-payoneer',
      pageError: {navigation},
      data: {
        transactionId: data?.transactionId,
        amountToSend: data?.fromCurrency,
        amountToReceive: data?.toCurrency,
        currency: 'USD',
      },
    });
    if (response?.status == 'success' && response?.data) {
      navigation.navigate('HomeScreen');
      openSuccessScreen({
        navigation,
        indicatorWidth: '80%',
        indicatorTextColor: '#9C9C9C',
        indicatorText: '80% complete',
        subTitle: 'This should take a few minutes to reflect',
        subTitleColor: '#888888',
      });
    }
  } catch (error) {
    console.log(error, 'erroor ,,,,,');
  }
};

export const PayoneerToCashNex2Screen = ({navigation, route}) => {
  const details = route?.params;

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
    initialValues: {transactionId: ''},
    validationSchema: validationSchema,

    onSubmit: values => {
      sendTransactionId({...values, ...details}, navigation);
    },
  });

  const {data: ratesData} = useQuery('getRates', getRates);

  const currentRate = ratesData?.data?.rate;

  console.log(errors);

  return (
    <CustomSafeAreaView style={{backgroundColor: COLORS.background}}>
      <AppNav
        backgroundColor={COLORS.background}
        title={<Text semiBold>Payoneer to Cash</Text>}
        line
      />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{height: 272, width: 254, marginTop: 20}}
            source={require('../../../../../assets/images/others/payonnerReceipt.png')}
          />
        </View>

        <Text
          size={12}
          bold
          style={{marginTop: 25, paddingHorizontal: 20, marginBottom: 30}}>
          After Payment has been made,{'\n'}COPY the
          <Text size={12} boldItalic>
            {' '}
            TRANSACTION ID
          </Text>
          , as highlighted above. PASTE the{' '}
          <Text size={12} boldItalic>
            TRANSACTION ID
          </Text>{' '}
          in the field below and get your wallet credited in minutes.
        </Text>

        <BigInput
          customIcon={
            <Image
              style={{height: 22, width: 22, right: -5}}
              source={IMAGES.payoneer}
            />
          }
          currencyLogoBackground={{active: COLORS.black, blur: COLORS.black}}
          currencyLogoColor={{active: COLORS.white, blur: COLORS.white}}
          onChangeText={value => {
            setFieldValue('transactionId', value);
          }}
          onBlur={() => setFieldTouched('transactionId', true)}
          value={values?.transactionId}
          error={errors?.transactionId}
          textColor={{
            active: COLORS.black,
            blur: '#868686',
            placeholderTextColor: COLORS.inputGrey,
          }}
          backgroundColor={{
            active: COLORS.white,
            blur: COLORS.white,
          }}
          placeholder="#"
          title={'Paste your Transaction ID'}
          type="background"
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: 40,
            paddingHorizontal: 30,
          }}>
          <Button
            disabled={!values.transactionId || !isValid}
            textColor={'white'}
            type={values.transactionId && isValid ? 'black' : 'grey'}
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
