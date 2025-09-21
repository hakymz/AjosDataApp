import React from 'react';
import {
  BottomSheets,
  Button,
  CustomPicker,
  CustomSafeAreaView,
  Icons,
  Input,
  PageInput,
  PagePicker,
  SuccessRateDisplay,
  Text,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {COLORS, ELECTRICITY, FONTS, GENERAL} from '../../../../conts';

import {useBillsData, useLayouts, useUser} from '../../../../hooks';

import {useQuery} from 'react-query';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import Toast from '../../../components/toast/Toast';
import {RecentCustomers} from '../../../components/home';
import {
  BillsTransactionSummary,
  TransactionSummary,
} from '../../../components/bottomSheetModal/modalContents';

const validationSchema = yup.object().shape({
  billersCode: yup.string().required('Please enter Meter Number'),
  name: yup.object().required('Please enter customer name'),
  variation_code: yup.object().required('Please select meter type'),
  provider: yup.object().required('Please select provider'),
  amount: yup
    .number()
    .required('Please input amount')
    .min(500, 'Min amount of 1000NGN'),
});

export const ElectricityScreen = ({navigation}) => {
  const {data} = useUser();

  const [state, setState] = React.useState({loading: false});

  const {minHeight} = useLayouts();
  const {getElectricityData} = useBillsData();

  const {data: electricityData} = useQuery(
    'getElectricityData',
    getElectricityData,
  );

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
    validateField,
    isValid,
  } = useFormik({
    initialValues: {
      billersCode: __DEV__ ? '0159004775551' : '',
      amount: '',
      variation_code: '',
      provider: '',
      name: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const providerName = values?.provider?.name
        ?.split?.('-')?.[1]
        ?.toUpperCase?.();
      const detailsList = [
        {name: 'Meter Number', details: values?.billersCode},
        {
          name: 'Token Amount',
          details: `${GENERAL.nairaSign}${formatAmount(values?.amount)}`,
        },
        {
          name: 'Provider + Plan',
          details: `${providerName} - ${values?.variation_code?.value}`,
        },
        {
          name: 'Receivable Cash-back',
          details: `${parseInt(electricityData?.cashback)}% - ${
            GENERAL.nairaSign
          }${(parseInt(electricityData?.cashback) * values?.amount) / 100}`,
        },
      ];

      BottomSheets.show({
        component: (
          <BillsTransactionSummary
            detailsList={detailsList}
            details={{
              ...values,
            }}
            title={'Electricity'}
            logo={values?.provider.image}
            btnTitle="Purchase Token"
            proceed={proceed}
          />
        ),
      });
    },
  });

  const proceed = async (transactionPin, useCashback) => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/electricity/buy',
        data: {
          serviceID: values?.provider?.serviceID,
          billersCode: values?.billersCode,
          variationCode: values?.variation_code?.value,
          amount: values?.amount * 1,
          useCashback,
          transactionPin,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });
      navigation.navigate('HomeScreen');

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

  const verifyMeterNumber = async (value, type, setFieldValue) => {
    setState(prevState => ({...prevState, loading: true}));
    if (!type || !values?.provider) {
      setFieldTouched('variation_code', true);
      validateField('variation_code');

      setFieldTouched('provider', true);
      validateField('provider');
    }

    if (value.length > 8) {
      setFieldValue('name', '');
      try {
        const response = await fetchRequest({
          path: '/billpayment/electricity/verify-meter',
          method: 'POST',
          data: {
            serviceID: values.provider?.serviceID,
            billersCode: value,
            type: type?.value,
          },
          displayMessage: true,
          showLoader: false,
        });

        if (response?.data?.content?.error) {
          Toast.show('error', response?.data?.content?.error);
        }

        if (response?.data?.Customer_Name) {
          setFieldValue('name', response?.data);
        } else {
        }
        setState(prevState => ({...prevState, loading: false}));
      } catch (error) {
        console.log(error, 'error');
        setState(prevState => ({...prevState, loading: false}));
      } finally {
        setState(prevState => ({...prevState, loading: false}));
      }
    } else {
      console.log('yesss');
      setFieldValue('name', '');
      setState(prevState => ({...prevState, loading: false}));
    }
  };

  React.useEffect(() => {
    if (
      values.provider &&
      values.amount &&
      values.variation_code &&
      values?.name &&
      isValid
    ) {
      setState(prevState => ({...prevState, buttonDisabled: false}));
    } else {
      setState(prevState => ({...prevState, buttonDisabled: true}));
    }
  }, [values, isValid]);

  return (
    <CustomSafeAreaView>
      <MainHeader nav title={'Electricity'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 30,
          paddingBottom: 140,
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
              data={electricityData?.content ?? []}
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
              data={[
                {
                  name: `Prepaid`,
                  value: 'prepaid',
                },
                {
                  name: `Postpaid`,
                  value: 'postpaid',
                },
              ]}
              onValueChange={value => {
                setFieldValue('variation_code', value);
              }}
              onBlur={() => {
                setFieldTouched('variation_code', true);
              }}
              placeholder="Meter Type"
            />
          </View>

          <Input
            value={values.amount}
            error={touched?.amount && errors?.amount}
            onChangeText={handleChange('amount')}
            onBlur={() => setFieldTouched('amount', true)}
            fontSize={16}
            fontFamily={FONTS.PLUS_JAKARTA_SANS_FONTS.bold}
            placeholder="Amount"
            textColor={COLORS.darkBlue}
            rightIcon={null}
          />

          <View style={{}}>
            <Input
              onPaste={() => {}}
              value={values.billersCode}
              error={touched?.billersCode && errors?.billersCode}
              onChangeText={value => {
                verifyMeterNumber(value, values?.variation_code, setFieldValue);
                setFieldValue('billersCode', value);
              }}
              onBlur={() => {
                setFieldTouched('billersCode', true);
              }}
              placeholder="Meter number"
            />

            <View
              style={{
                minHeight: 60,
                backgroundColor: '#E9E6F7',
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 15,
                justifyContent: 'center',
              }}>
              {state?.loading ? (
                <View style={{}}>
                  <ActivityIndicator color={COLORS.primary} />
                </View>
              ) : (
                <>
                  {!values?.name && (
                    <Text size={14} medium color={'#848A94'}>
                      Name + Address
                    </Text>
                  )}

                  {values?.name && (
                    <View>
                      <Text medium color={'#5D55E0'}>
                        {values?.name?.Customer_Name}
                      </Text>
                      <Text size={14} bold color={'#5D55E0'}>
                        {values?.name?.Address}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 40,
              marginTop: 20,
            }}>
            <BillsBalance />
          </View>
        </View>

        <View style={{marginBottom: 20}}>
          <RecentCustomers value={values?.phone} />
        </View>
        <View style={{}}>
          <Button
            titleStyle={{color: COLORS.white}}
            type={state?.buttonDisabled ? 'grey' : 'primary'}
            onPress={() => {
              if (!values?.name) {
                Toast.show('error', 'Enter valid Meter number');
              } else {
                submitForm();
              }
            }}
            style={{marginTop: 40}}
            title={'Purchase'}
          />
        </View>
      </ScrollView>
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
