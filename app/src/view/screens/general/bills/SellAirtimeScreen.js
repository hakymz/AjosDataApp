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
import {COLORS, FONTS, GENERAL} from '../../../../conts';

import {useBillsData, useLayouts, useUser} from '../../../../hooks';
import {
  ResellTransactionSummary,
  TransactionSummary,
} from '../../../components/bottomSheetModal/contents';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {
  fetchRequest,
  getNumberNetwork,
  openSuccessScreen,
  validateNumberNetwork,
} from '../../../../helper';
import {useQuery} from 'react-query';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';
import {useIsFocused} from '@react-navigation/native';
import {RecentCustomers} from '../../../components/home';

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

  const getNetwork = network => {
    return airtimeData?.content?.filter?.(
      item => item?.serviceID == network?.name?.toLowerCase?.(),
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
      BottomSheets.show({
        component: (
          <ResellTransactionSummary
            details={{
              ...values,
              cashbackPer,
            }}
            proceed={sellAirtime}
            btnTitle="Airtime"
          />
        ),
        customSnapPoints: ['85%', '85%'],
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
          : `Invalid ${values?.network?.serviceID} number`,
        value =>
          state?.bypass
            ? true
            : validateNumberNetwork(value, values?.network?.serviceID),
      ),
    amount: yup.number().required('Please input amount'),
  });

  const {
    data: customersData,
    status,
    refetch,
    isSuccess,
    error,
  } = useQuery('getCustomersAirtimeScreen', getCustomers);

  const cashbackPer = React.useMemo(() => {
    let currentCashback = airtimeData?.cashback?.filter?.(
      item => item?.network == values?.network?.serviceID,
    )?.[0];
    return currentCashback?.cashback;
  }, [airtimeData, values?.network]);

  const sellAirtime = async (transactionPin, useCashback) => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/vtpass/purchase-airtime',
        data: {
          ...values,
          useCashback,
          transactionPin,
          serviceID: values?.network?.serviceID,
          amount: values?.amount * 1,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });

      openSuccessScreen({
        number: values?.phone,
        navigation,
        title: (
          <Text color={'#27A770'} size={18}>
            Airtime Successfully sold to{' '}
            <Text color={'#27A770'} size={18} fontWeight={'700'}>
              {values?.phone}
            </Text>
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
                // navigation.goBack();
                BottomSheets.show({
                  component: <TransactionSummary details={response?.data} />,
                  customSnapPoints: ['85%', '85%'],
                });
              }}
            />
          </View>
        ),
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

  React.useEffect(() => {
    refetch();
  }, [isFocused]);

  React.useEffect(() => {
    validateForm();
  }, [state?.bypass]);
  return (
    <CustomSafeAreaView>
      <MainHeader nav title={'Airtime Purchase'} />
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
          <View style={{marginTop: 0}}>
            <CustomPicker
              error={touched?.network && errors?.network}
              data={airtimeData?.content}
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
                  network: selectedNetworkData,
                });
              }}
              onBlur={() => setFieldTouched('phone', true)}
              placeholder="Phone Number"
              // rightIcon={
              //   <TouchableOpacity
              //     onPress={() => {
              //       pickerPhoneNo(phone => {
              //         const network = getNumberNetwork(phone);
              //         const selectedNetworkData = getNetwork(network);
              //         setValues({
              //           ...values,
              //           phone: phone,
              //           network: state?.bypass ? null : selectedNetworkData,
              //         });
              //       });
              //     }}
              //     style={{
              //       height: 36,
              //       width: 36,
              //       borderRadius: 12,
              //       justifyContent: 'center',
              //       alignItems: 'center',
              //       right: -5,
              //     }}>
              //     <Icons.Phone size={20} />
              //   </TouchableOpacity>
              // }
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
