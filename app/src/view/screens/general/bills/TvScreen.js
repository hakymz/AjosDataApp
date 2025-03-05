import React from 'react';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Icons,
  Input,
  OutlineButton,
  PageInput,
  PagePicker,
  SuccessRateDisplay,
  Text,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {COLORS, ELECTRICITY} from '../../../../conts';
import * as yup from 'yup';

import {useBillsData, useLayouts, useUser} from '../../../../hooks';
import {
  BillsTransactionSummary,
  TransactionSummary,
} from '../../../components/bottomSheetModal/contents';
import {useFormik} from 'formik';
import {useQuery} from 'react-query';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import Toast from '../../../components/toast/Toast';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';

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

export const TvScreen = ({navigation}) => {
  const {data} = useUser();
  const {minHeight} = useLayouts();
  const [state, setState] = React.useState({loading: false});
  const {getVariationCodeById, tvVariationCodes, getTvData} = useBillsData();

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
      billersCode: __DEV__ ? '1212121212' : '',
      amount: '',
      variation_code: '',
      name: '',
      provider: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      console.log(values?.variation_code);
      const transactionsData = [
        {title: 'Sub type', details: values?.variation_code?.name},
        values?.provider?.name != 'ShowMax' && {
          title: 'Customer’s User-ID',
          details: values?.billersCode,
        },
        values?.provider?.name != 'ShowMax' && {
          title: 'Customer’s Name',
          details: values?.name,
        },
        {title: 'Validity Period', details: '30 Days'},
      ];

      const providerName = values?.provider?.serviceID
        ?.split?.('-')?.[0]
        ?.toUpperCase?.();
      BottomSheets.show({
        component: (
          <BillsTransactionSummary
            title={'TV Subscription Resell'}
            image={values?.provider?.image}
            amount={values?.amount}
            data={transactionsData}
            serviceName={`${providerName}`}
            btnTitle="Purchase Subscription"
            proceed={proceed}
          />
        ),
        customSnapPoints: [670, 670],
      });
    },
  });

  console.log(values?.provider);
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

  const proceed = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/vtpass/purchase-tv',
        data: {
          ...values,
          serviceID: values?.provider?.serviceID,
          billersCode: values?.billersCode,
          variation_code: values?.variation_code?.value,
          amount: values?.amount * 1,
          phone: data?.user?.phoneNumber,
          subscription_type: 'change',
          quantity: 1,
          transactionPin,
        },
        pageError: {
          navigation,
        },
      });

      openSuccessScreen({
        navigation,
        title: (
          <Text color={'#27A770'} size={18}>
            Subscription Purchased Successfully
          </Text>
        ),
        btnTitle: 'Okay',
        btnComponent: (
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
        ),
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
          path: 'billpayment/vtpass/verify-account',
          method: 'POST',
          data: {
            serviceID: serviceID,
            billersCode: value,
          },
          // displayMessage: false,
          showLoader: false,
          headers: {debounceToken: new Date().getTime()},
        });

        if (
          response?.status == 'success' &&
          response?.data?.content?.Customer_Name
        ) {
          setFieldValue('name', response?.data?.content?.Customer_Name);
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

  React.useEffect(() => {
    getVariationCodeById(values?.provider?.serviceID, 'tvVariationCodes');
  }, [values?.provider]);

  React.useEffect(() => {
    if (
      values?.billersCode &&
      values?.variation_code &&
      values?.amount &&
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
      <MainHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 70,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <BillsBalance />
        <View style={{marginTop: 30, flex: 1}}>
          <Text fontWeight={800} size={18}>
            Sell TV Subscription
          </Text>
          <View style={{marginTop: 20}}>
            <PagePicker
              error={touched?.provider && errors?.provider}
              value={values.provider}
              data={tvData}
              onValueChange={value => {
                setFieldValue('provider', value);
              }}
              onBlur={() => {
                setFieldTouched('provider', true);
              }}
              placeholder="Select Provider"
            />
            <PagePicker
              error={touched?.variation_code && errors?.variation_code}
              value={values.variation_code}
              data={tvVariationCodes?.variations}
              onValueChange={value => {
                setValues({
                  ...values,
                  variation_code: value,
                  amount: value?.variation_amount,
                });
              }}
              placeholder="Select Type"
            />
            <SuccessRateDisplay type="tv" />

            <View style={{paddingHorizontal: 10}}>
              <Text
                fontWeight={'500'}
                color={COLORS.dark}
                size={14}
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                }}>
                Customer’s User-ID
              </Text>
              <Input
                textColor={COLORS.blue}
                placeholder="User-ID number"
                backgroundColor="#EFF1FB"
                value={values.billersCode}
                error={touched?.billersCode && errors?.billersCode}
                onChangeText={value => {
                  verifySmartCard(
                    value,
                    setFieldValue,
                    values?.provider.serviceID,
                  );
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
              {values?.name && (
                <Input
                  inputStyle={{fontSize: 20}}
                  editable={false}
                  value={values.name}
                  error={touched?.name && errors?.name}
                  onChangeText={value => {
                    setFieldValue('name', value);
                  }}
                  onBlur={() => {
                    setFieldTouched('name', true);
                  }}
                  textColor={'#7F8192'}
                  placeholder="Customer Name"
                  backgroundColor="#F8F8F8"
                />
              )}
            </View>
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
