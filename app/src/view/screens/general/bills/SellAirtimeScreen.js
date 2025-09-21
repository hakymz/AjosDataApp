import React from 'react';
import {
  BottomSheets,
  Button,
  CustomPicker,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {Image, Keyboard, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS, GENERAL, NETWORKS} from '../../../../conts';

import {useBillsData, useLayouts, useUser} from '../../../../hooks';

import {useFormik} from 'formik';
import * as yup from 'yup';
import {
  fetchRequest,
  formatAmount,
  getNumberNetwork,
  openSuccessScreen,
  validateNumberNetwork,
} from '../../../../helper';
import {useQuery} from 'react-query';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';
import {useIsFocused} from '@react-navigation/native';
import {RecentCustomers} from '../../../components/home';
import {
  BillsTransactionSummary,
  TransactionSummary,
} from '../../../components/bottomSheetModal/modalContents';

let validationSchema;

const priceList = ['100', '200', '500', '1000'];
export const SellAirtimeScreen = ({navigation, route}) => {
  let {network, phoneNo} = route?.params || {};
  const [state, setState] = React.useState({
    buttonDisabled: false,
    bypass: false,
  });
  const {minHeight} = useLayouts();

  const {data, getAndUpdateUserData} = useUser();
  const {getCustomers, getAirtimeData} = useBillsData();
  const {data: airtimeData, error: airtimeDataError} = useQuery(
    'getAirtimeData',
    getAirtimeData,
  );

  const filterAirtimeData = React.useMemo(() => {
    return airtimeData?.map(item => ({name: item?.network, ...item}));
  }, [airtimeData]);

  const getNetwork = network => {
    return filterAirtimeData?.filter?.(
      item => item?.name?.toLowerCase?.() == network?.name?.toLowerCase?.(),
    )?.[0];
  };

  const isFocused = useIsFocused();
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    handleChange,
    validateField,
    setValues,
    submitForm,
    resetForm,
    isValid,
    validateForm,
  } = useFormik({
    initialValues: {
      phone: phoneNo || '',
      network: network || '',
      amount: '',
      type: 'Airtime',
      variation_code: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const logo = NETWORKS?.filter?.(
        item =>
          item?.name?.toLowerCase?.() == values?.network?.name?.toLowerCase?.(),
      )?.[0]?.image;
      const detailsList = [
        {name: 'Transaction Mobile Number', details: values?.phone},
        {
          name: 'Amount',
          details: `${GENERAL.nairaSign}${formatAmount(values?.amount)}`,
        },
        {name: 'Receivable Cash-back', details: '1% - ₦10.00'},
      ];
      BottomSheets.show({
        component: (
          <BillsTransactionSummary
            logo={logo}
            detailsList={detailsList}
            details={{
              ...values,
              cashbackPer,
            }}
            proceed={sellAirtime}
          />
        ),
      });
    },
  });

  validationSchema = yup.object().shape({
    network: yup.object().required('Please choose network'),
    phone: yup
      .string()
      .required('Please input phone no')
      .max(11, 'Max length of 11 digits')
      .test(
        'validateNumberNetwork',
        !values?.network?.name
          ? 'Select network'
          : `Invalid ${values?.network?.name} number`,
        value =>
          state?.bypass
            ? true
            : validateNumberNetwork(value, values?.network?.name),
      ),
    amount: yup.number().required('Please input amount'),
  });

  const cashbackPer = React.useMemo(() => {
    let currentCashback = airtimeData?.cashback?.filter?.(
      item => item?.network == values?.network?.serviceID,
    )?.[0];
    return currentCashback?.cashback;
  }, [airtimeData, values?.network]);

  const sellAirtime = async (transactionPin, useCashback) => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/airtime/buy',
        data: {
          // ...values,
          phoneNumber: values?.phone,
          useCashback,
          transactionPin,
          networkId: values?.network?.network,
          amount: values?.amount * 1,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });
      resetForm();

      openSuccessScreen({
        navigation,
        proceed: () => {
          BottomSheets.show({
            component: <TransactionSummary details={response?.data} />,
          });
        },
      });
      getAndUpdateUserData();
    } catch (error) {
      throw error;
    }
  };

  React.useEffect(() => {
    if (values.network && values.amount && values.phone && isValid) {
      setState(prevState => ({...prevState, buttonDisabled: false}));
    } else {
      setState(prevState => ({...prevState, buttonDisabled: true}));
    }
  }, [values, isValid]);

  return (
    <CustomSafeAreaView>
      <MainHeader nav title={'Airtime Purchase'} />
      <KeyboardAvoidingViewWrapper
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 150,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <Text size={12} color={'#898A8D'}>
          We will find the network provider for you,😌 we gatchu
        </Text>
        <View style={{marginTop: 20}}>
          <View style={{marginTop: 0}}>
            <CustomPicker
              error={touched?.network && errors?.network}
              data={filterAirtimeData ?? []}
              value={values?.network}
              onValueChange={value => {
                setFieldValue('network', value);
              }}
              placeholder="Select Network"
              onBlur={() => {
                setFieldTouched('network', true);
              }}
            />
            <Input
              onPaste={value => {
                setValues({
                  ...values,
                  phone: value,
                });
              }}
              keyboardType="numeric"
              value={values.phone}
              error={touched?.phone && errors?.phone}
              onChangeText={phone => {
                const network = getNumberNetwork(phone);
                const selectedNetworkData = getNetwork(network);

                setValues({
                  ...values,
                  phone: phone,
                  network:
                    phone?.length > 5 ? selectedNetworkData : values?.network,
                });
              }}
              onBlur={() => setFieldTouched('phone', true)}
              placeholder="Phone Number"
            />

            <Input
              keyboardType="numeric"
              value={values.amount}
              error={touched?.amount && errors?.amount}
              onChangeText={handleChange('amount')}
              onBlur={() => setFieldTouched('amount', true)}
              placeholder="Amount"
              inputStyle={{fontFamily: FONTS.PLUS_JAKARTA_SANS_FONTS.semiBold}}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {priceList?.map(item => (
              <TouchableOpacity
                onPress={() => {
                  setFieldValue('amount', item);
                }}
                style={{
                  height: 40,
                  paddingHorizontal: 15,
                  borderColor: '#CBDB31',
                  borderWidth: 1,
                  justifyContent: 'center',
                  marginRight: 10,
                  borderRadius: 32,
                  marginBottom: 10,
                  backgroundColor:
                    item == values?.amount ? '#CBDB31' : COLORS.white,
                }}>
                <Text color={COLORS.darkBlue} size={12} fontWeight={'700'}>
                  {GENERAL.nairaSign}
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 40,
            }}>
            <BillsBalance />
          </View>

          <View style={{marginBottom: 20}}>
            <RecentCustomers
              value={values?.phone}
              onPress={phone => {
                const network = getNumberNetwork(phone);
                const selectedNetworkData = getNetwork(network);
                setValues({
                  ...values,
                  phone: phone,
                  network: state?.bypass ? null : selectedNetworkData,
                });
              }}
            />
          </View>
        </View>
        <Button
          titleStyle={{color: COLORS.white}}
          type={state?.buttonDisabled ? 'grey' : 'primary'}
          onPress={() => {
            Keyboard.dismiss();
            submitForm();
          }}
          style={{marginTop: 40}}
          title={'Purchase'}
        />
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
