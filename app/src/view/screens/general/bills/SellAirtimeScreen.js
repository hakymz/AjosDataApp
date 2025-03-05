import React from 'react';
import {
  BottomSheets,
  Button,
  CheckBox,
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
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, GENERAL, NETWORKS} from '../../../../conts';

import {useBillsData, useLayouts, useUser} from '../../../../hooks';
import {
  AddCustomer,
  ResellTransactionSummary,
  SavedCustomers,
  TransactionSummary,
} from '../../../components/bottomSheetModal/contents';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {
  fetchRequest,
  formatAmount,
  getNumberNetwork,
  openSuccessScreen,
  pickerPhoneNo,
  validateNumberNetwork,
} from '../../../../helper';
import {useQuery} from 'react-query';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';
import {useIsFocused} from '@react-navigation/native';
import Toast from '../../../components/toast/Toast';
import {RecentCustomers} from '../../../components/home';

const List = ({item, setFieldValue}) => {
  let customerNumber = item?.customerNumber?.split('+234');
  if (customerNumber[1]) {
    customerNumber =
      customerNumber?.[1]?.[0] == '0'
        ? customerNumber?.[1]
        : '0' + customerNumber?.[1];
  } else {
    customerNumber = item?.customerNumber;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        setFieldValue('phone', customerNumber);
      }}
      style={{
        ...styles.list,
      }}>
      <View style={{flex: 1}}>
        <Text size={14} fontWeight={'500'} color={'#7F8192'}>
          {item?.customerName}
        </Text>
        <Text
          style={{marginTop: 3}}
          size={18}
          fontWeight={800}
          color={'#7F8192'}>
          {customerNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

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
      <MainHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <BillsBalance />
        <View style={{marginTop: 30}}>
          <Text fontWeight={800} size={18}>
            Sell Airtime
          </Text>
          <View style={{marginTop: 0}}>
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
                Customer’s Phone Number
              </Text>
              <Input
                keyboardType="numeric"
                value={values.phone}
                error={touched?.phone && errors?.phone}
                onChangeText={phone => {
                  const network = getNumberNetwork(phone);
                  const selectedNetworkData = getNetwork(network);

                  setValues({
                    ...values,
                    phone: phone,
                    network: state?.bypass ? null : selectedNetworkData,
                  });
                }}
                onBlur={() => setFieldTouched('phone', true)}
                textColor={COLORS.blue}
                placeholder="Phone Number"
                backgroundColor="#EFF1FB"
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      pickerPhoneNo(phone => {
                        const network = getNumberNetwork(phone);
                        const selectedNetworkData = getNetwork(network);
                        setValues({
                          ...values,
                          phone: phone,
                          network: state?.bypass ? null : selectedNetworkData,
                        });
                      });
                    }}
                    style={{
                      height: 36,
                      width: 36,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      right: -5,
                    }}>
                    <Icons.Phone size={20} />
                  </TouchableOpacity>
                }
              />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  isChecked={state?.bypass}
                  onPress={() => {
                    setState(prevState => ({
                      ...prevState,
                      bypass: !prevState?.bypass,
                    }));
                  }}
                />
                <Text style={{marginLeft: 5}} fontWeight={'500'}>
                  Bypass network check
                </Text>
              </View>
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

            <PagePicker
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
                    height: 45,
                    paddingHorizontal: 10,
                    borderColor:
                      item == values?.amount ? '#179338' : COLORS.blue,
                    borderWidth: 1,
                    justifyContent: 'center',
                    marginRight: 10,
                    borderRadius: 10,
                    marginBottom: 10,
                    backgroundColor:
                      item == values?.amount ? '#E8F1E8' : '#EFF1FB',
                  }}>
                  <Text
                    color={item == values?.amount ? '#179338' : COLORS.blue}
                    size={18}
                    fontWeight={'500'}>
                    {GENERAL.nairaSign}
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <PageInput
              keyboardType="numeric"
              value={values.amount}
              error={touched?.amount && errors?.amount}
              onChangeText={handleChange('amount')}
              onBlur={() => setFieldTouched('amount', true)}
              fontSize={18}
              placeholder="0.00"
              rightIcon={
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text fontWeight={'500'} color={COLORS.green} size={11}>
                    Cashback{' '}
                    {GENERAL.nairaSign +
                      formatAmount((values?.amount * cashbackPer) / 100)}{' '}
                  </Text>
                </View>
              }
            />
            <SuccessRateDisplay
              type="airtime"
              network={values?.network?.serviceID}
            />

            {/* <View style={{alignItems: 'center', marginTop: 20}}>
              <OutlineButton
                style={{flex: 0}}
                title={'Add Saved Customer'}
                onPress={() => {
                  BottomSheets.show({
                    component: (
                      <SavedCustomers
                        onPress={value => {
                          setFieldValue('phone', value);
                        }}
                      />
                    ),
                    customSnapPoints: [550, 550],
                  });
                }}
              />
            </View> */}
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
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
