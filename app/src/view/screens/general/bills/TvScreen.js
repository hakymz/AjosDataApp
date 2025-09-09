import React from 'react';
import {
  BottomSheets,
  Button,
  CustomPicker,
  CustomSafeAreaView,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  OutlineButton,
  PageInput,
  PagePicker,
  SuccessRateDisplay,
  Text,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {COLORS, ELECTRICITY, FONTS, GENERAL} from '../../../../conts';
import * as yup from 'yup';

import {useBillsData, useLayouts, useUser} from '../../../../hooks';
import {TransactionSummary} from '../../../components/bottomSheetModal/contents';
import {useFormik} from 'formik';
import {useQuery} from 'react-query';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import Toast from '../../../components/toast/Toast';

import {RecentCustomers} from '../../../components/home';
import {BillsTransactionSummary} from '../../../components/bottomSheetModal/modalContents';

const List = ({item}) => {
  return (
    <View
      style={{
        ...styles.list,
      }}>
      <View style={{flex: 1}}>
        <Text size={14} fontWeight={'500'} color={'#7F8192'}>
          {item?.name}
        </Text>
        <Text
          style={{marginTop: 3}}
          size={18}
          fontWeight={800}
          color={'#7F8192'}>
          {item?.phoneNO}
        </Text>
      </View>
    </View>
  );
};

let validationSchema;

const getTvVariation = async id => {
  try {
    const response = await fetchRequest({
      path: `/billpayment/tv/services/variation/${id}`,
      method: 'GET',
      displayMessage: false,
      showLoader: false,
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const TvScreen = ({navigation}) => {
  const {data} = useUser();
  const {minHeight} = useLayouts();
  const [state, setState] = React.useState({loading: false});
  const {getTvData} = useBillsData();

  const {data: tvData, error} = useQuery('getTvData', getTvData);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    handleChange,
    setValues,
    submitForm,
    isValid,
  } = useFormik({
    initialValues: {
      billersCode: __DEV__ ? '8061705668' : '',
      amount: '',
      variation_code: '',
      name: '',
      provider: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const transactionsData = [
        values?.provider?.name != 'ShowMax' && {
          name: 'Unique Number',
          details: values?.billersCode,
        },

        {
          name: 'Amount',
          details: `${GENERAL.nairaSign}${formatAmount(values?.amount)}`,
        },
        {name: 'Provider + Plan', details: values?.variation_code?.name},
        {
          name: 'Receivable Cash-back',
          details: `${parseInt(tvData?.cashback)}% - ${GENERAL.nairaSign}${
            (parseInt(tvData?.cashback) * values?.amount) / 100
          }`,
        },
      ];

      BottomSheets.show({
        component: (
          <BillsTransactionSummary
            title={'TV Subscription'}
            logo={values?.provider?.image}
            amount={values?.amount}
            detailsList={transactionsData}
            details={{...values}}
            proceed={proceed}
          />
        ),
      });
    },
  });

  const {data: tvVariationCodes} = useQuery(
    'getTvVariation' + values?.provider?.serviceID,
    () => getTvVariation(values?.provider?.serviceID),
  );

  if (values?.provider?.name == 'ShowMax') {
    validationSchema = yup.object().shape({
      amount: yup.number().required('Please input amount'),
      variation_code: yup.object().required('Please choose data'),
      provider: yup.object().required('Please choose provider'),
    });
  } else {
    validationSchema = yup.object().shape({
      billersCode: yup.string().required('Please input smart card no'),
      name: yup.string().required('Please input customer name'),
      amount: yup.number().required('Please input amount'),
      variation_code: yup.object().required('Please choose data'),
      provider: yup.object().required('Please choose provider'),
    });
  }

  const proceed = async (transactionPin, useCashback) => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/tv/buy',
        data: {
          serviceID: values?.provider?.serviceID,
          billersCode: values?.billersCode,
          variationCode: values?.variation_code?.variation_code,
          amount: values?.amount * 1,
          subscriptionType: 'change',
          quantity: 1,
          transactionPin,
          useCashback,
        },
        pageError: {
          navigation,
        },
      });

      openSuccessScreen({
        navigation,

        proceed: () => {
          BottomSheets.show({
            component: <TransactionSummary details={response?.data} />,
          });
        },
      });
    } catch (error) {
      console.log(error, 'errrss');
    }
  };

  const verifySmartCard = async (value, setFieldValue, serviceID) => {
    setState(prevState => ({...prevState, loading: true}));
    if (value.length > 9) {
      try {
        const response = await fetchRequest({
          path: 'billpayment/tv/verify-smartcard',
          method: 'POST',
          data: {
            serviceID: serviceID,
            billersCode: value,
          },
          // displayMessage: false,
          showLoader: false,
          headers: {debounceToken: new Date().getTime()},
        });

        if (response?.data?.Customer_Name) {
          setFieldValue('name', response?.data?.Customer_Name);
        } else {
          setFieldValue('name', '');
        }
      } catch (error) {
        console.log(error, 'err ooooo');
      } finally {
        setState(prevState => ({...prevState, loading: false}));
      }
    } else {
      setState(prevState => ({...prevState, loading: false}));
      setFieldValue('name', '');
    }
  };

  return (
    <CustomSafeAreaView>
      <MainHeader nav title={'Tv-Subscriptions'} />
      <KeyboardAvoidingViewWrapper
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <Text size={12} color={'#898A8D'}>
          We will find the network provider for you,😌 we gatchu
        </Text>

        <View style={{marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <CustomPicker
              error={touched?.provider && errors?.provider}
              value={values.provider}
              data={tvData?.content}
              onValueChange={value => {
                setFieldValue('provider', value);
              }}
              onBlur={() => {
                setFieldTouched('provider', true);
              }}
              placeholder="Select Provider"
            />
            <View width={5} />
            <CustomPicker
              error={touched?.variation_code && errors?.variation_code}
              value={values.variation_code}
              data={tvVariationCodes?.content?.variations}
              onValueChange={value => {
                setValues({
                  ...values,
                  variation_code: value,
                  amount: value?.variation_amount,
                });
              }}
              placeholder="Select Type"
            />
          </View>

          <Input
            fontFamily={
              values.variation_code?.variation_amount
                ? FONTS.PLUS_JAKARTA_SANS_FONTS.bold
                : FONTS.PLUS_JAKARTA_SANS_FONTS.regular
            }
            textColor={
              values?.variation_code?.variation_amount
                ? COLORS.darkBlue
                : '#848A94'
            }
            placeholder="Subscription price"
            backgroundColor="#E9E6F7"
            value={`${GENERAL.nairaSign}${
              values.variation_code?.variation_amount || 0
            }`}
          />

          <Input
            placeholder="Unique Number"
            value={values.billersCode}
            error={touched?.billersCode && errors?.billersCode}
            onChangeText={value => {
              verifySmartCard(value, setFieldValue, values?.provider.serviceID);
              setFieldValue('billersCode', value);
            }}
            onBlur={() => {
              setFieldTouched('billersCode', true);
            }}
          />

          {state?.loading && (
            <View style={{marginTop: 10}}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          )}

          <Input
            editable={false}
            value={values.name}
            error={touched?.name && errors?.name}
            onChangeText={value => {
              setFieldValue('name', value);
            }}
            onBlur={() => {
              setFieldTouched('name', true);
            }}
            textColor={'#848A94'}
            placeholder="Full Name"
            backgroundColor="#EFF1FB"
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 40,
              marginTop: 10,
            }}>
            <BillsBalance />
          </View>
        </View>

        <View style={{marginBottom: 20}}>
          <RecentCustomers value={values?.phone} />
        </View>

        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
          }}>
          <Button
            titleStyle={{color: COLORS.white}}
            type={state?.buttonDisabled ? 'grey' : 'primary'}
            onPress={() => {
              if (values?.provider?.name != 'ShowMax' && !values?.name) {
                Toast.show('error', 'Enter a valid Smart card');
              } else {
                submitForm();
              }
            }}
            style={{marginTop: 40}}
            title={'Purchase'}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 72,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
