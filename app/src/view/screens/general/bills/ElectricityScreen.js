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
import {COLORS, ELECTRICITY, FONTS} from '../../../../conts';

import {useBillsData, useLayouts, useUser} from '../../../../hooks';
import {
  BillsTransactionSummary,
  TransactionSummary,
} from '../../../components/bottomSheetModal/contents';
import {useQuery} from 'react-query';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {
  Copy,
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import Toast from '../../../components/toast/Toast';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';
import {RecentCustomers} from '../../../components/home';

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
      billersCode: __DEV__ ? '1111111111111' : '',
      amount: '',
      variation_code: '',
      provider: '',
      name: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const providerName = values?.provider?.serviceID
        ?.split?.('-')?.[0]
        ?.toUpperCase?.();
      const transactionsData = [
        {title: 'Token Amount', details: formatAmount(values?.amount)},
        {title: 'Meter Number', details: values?.billersCode},
        {title: 'Customer’s Name', details: values?.name},
      ];

      BottomSheets.show({
        component: (
          <BillsTransactionSummary
            title={'Electricity Token Resell'}
            image={values?.provider.image}
            amount={values?.amount}
            data={transactionsData}
            serviceName={`${providerName} Token`}
            btnTitle="Purchase Token"
            proceed={proceed}
          />
        ),
        customSnapPoints: [650, 650],
      });
    },
  });

  const proceed = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/vtpass/purchase-electricity',
        data: {
          ...values,
          serviceID: values?.provider?.serviceID,
          billersCode: values?.billersCode,
          variation_code: values?.variation_code?.value,
          amount: values?.amount * 1,
          phone: data?.user?.phoneNumber,
          transactionPin,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });

      console.log(response, 'response response ');

      openSuccessScreen({
        navigation,
        title: (
          <Text color={'#27A770'} size={18}>
            Token Purchased Successfully
          </Text>
        ),

        btnComponent: (
          <View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 80,
                justifyContent: 'center',
              }}>
              <SuccessHomeBtn title={'Go Home'} />
              <SuccessShadowBtn
                title={'View Receipt'}
                onPress={() => {
                  BottomSheets.show({
                    component: <TransactionSummary details={response?.data} />,
                    customSnapPoints: ['85%', '85%'],
                  });
                }}
              />
            </View>

            <View style={{paddingHorizontal: 20, marginTop: 40}}>
              <View
                style={{
                  height: 94,
                  backgroundColor: '#EFF1FB',
                  borderRadius: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text md color={COLORS.blue}>
                    Token
                  </Text>
                  <Icons.Copy
                    size={20}
                    onPress={() => {
                      Copy(
                        response?.data?.receiptDetails?.metaInfo?.moredetails
                          ?.purchase_code,
                      );
                    }}
                  />
                </View>
                <Text style={{marginTop: 10}} color={COLORS.blue} size={19} md>
                  {
                    response?.data?.receiptDetails?.metaInfo?.moredetails?.purchase_code?.split?.(
                      'Token :',
                    )?.[1]
                  }
                </Text>
              </View>
            </View>
          </View>
        ),
      });
    } catch (error) {
      console.log(error, 'errrss');
    }
  };

  const verifyMeterNumber = async (value, type, setFieldValue) => {
    console.log(values.provider?.serviceID, type?.value, 'messssssss');

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

        console.log(response);

        if (response?.data?.content?.error) {
          Toast.show('error', response?.data?.content?.error);
        }

        console.log(response?.data, 'Customer_Name Customer_Name');
        if (response?.status == 'success' && response?.data) {
          setFieldValue('name', response?.data?.content);
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
                  name: `Prepaid ${values?.provider?.name || ''}`,
                  value: 'prepaid',
                },
                {
                  name: `Postpaid ${values?.provider?.name || ''}`,
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
          <RecentCustomers
            value={values?.phone}
            onPress={phone => {
              const network = getNumberNetwork(phone);
              const selectedNetworkData = getNumberNetwork(network);
              setValues({
                ...values,
                phone: phone,
                network: state?.bypass ? null : selectedNetworkData,
              });
            }}
          />
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
