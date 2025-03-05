import React from 'react';
import {
  BottomSheets,
  Button,
  CheckBox,
  CustomSafeAreaView,
  Icons,
  Input,
  OutlineButton,
  PagePicker,
  SuccessRateDisplay,
  Text,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, GENERAL, NETWORKS} from '../../../../conts';
import * as yup from 'yup';
import {useBillsData, useLayouts, useUser} from '../../../../hooks';
import {
  ResellTransactionSummary,
  SavedCustomers,
  TransactionSummary,
} from '../../../components/bottomSheetModal/contents';
import {useQuery} from 'react-query';
import {useFormik} from 'formik';
import {
  fetchRequest,
  formatAmount,
  getNumberNetwork,
  openSuccessScreen,
  pickerPhoneNo,
  validateNumberNetwork,
} from '../../../../helper';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';
import {useIsFocused} from '@react-navigation/native';
import {RecentCustomers} from '../../../components/home';

let validationSchema;

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

const getPlans = async (network = 'MTN') => {
  try {
    const response = await fetchRequest({
      path: `billpayment/data/plans?network=${network?.toUpperCase?.()}&platform=apisubportal`,
      displayMessage: true,
      showLoader: false,
      method: 'GET',
    });

    return response?.data;
  } catch (error) {
    console.log(error, 'errrss');
    throw error;
  }
};

const getGiftingPlans = async (network = 'mtn') => {
  try {
    const response = await fetchRequest({
      path: `billpayment/vtpass/variation-code?serviceId=${network?.toLocaleLowerCase?.()}-data`,
      displayMessage: true,
      showLoader: false,
      method: 'GET',
    });

    return response?.data?.content?.varations;
  } catch (error) {
    console.log(error, 'errrss');
    throw error;
  }
};

export const SellDataScreen = ({navigation, route}) => {
  const [state, setState] = React.useState({
    buttonDisabled: false,
    bypass: false,
  });

  const {minHeight} = useLayouts();
  const {getCustomers} = useBillsData();
  const isFocused = useIsFocused();
  const {getAndUpdateUserData} = useUser();
  let {network, variation_code, variation_code_data, initialData, phoneNo} =
    route?.params || {};

  let selectedNetwork = NETWORKS[0];
  if (network == 'airtel') {
    selectedNetwork = NETWORKS[1];
  } else if (network == 'glo') {
    selectedNetwork = NETWORKS[3];
  }

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
    validateForm,
    isValid,
  } = useFormik({
    initialValues: {
      phone: phoneNo || '',
      network: !network
        ? ''
        : typeof network == 'string'
        ? selectedNetwork
        : network,
      amount: !network
        ? ''
        : variation_code?.amount || variation_code?.variation_amount,
      type: !network
        ? ''
        : network == 'airtel' || network == 'glo'
        ? variation_code_data
        : {name: 'SME', value: 'SME'},
      variation_code: variation_code || {},
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      BottomSheets.show({
        component: (
          <ResellTransactionSummary
            details={{
              ...values,
              type: 'Data',
            }}
            proceed={sellData}
            btnTitle="Data"
          />
        ),
        customSnapPoints: ['85%', '85%'],
      });
    },
  });

  validationSchema = yup.object().shape({
    network: yup.object().required('Please choose network'),
    type: yup.object().required('Please choose type'),
    variation_code: yup.object().required('Please select data plan'),
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
  const {
    data: plansData,
    error: plansError,
    refetch: refetchPlans,
    isFetching,
  } = useQuery({
    queryFn: () => getPlans(values?.network?.name),
    queryKey: 'getPlans' + values?.network?.name,
    initialData: initialData,
  });

  React.useEffect(() => {
    refetchPlans();
  }, [values?.network]);

  const {
    data: giftingPlansData,
    error: plansGiftingError,
    refetch: refetchGiftingPlans,
  } = useQuery('getGiftingPlans' + values?.network?.name, () =>
    getGiftingPlans(values?.network?.name, network),
  );

  React.useEffect(() => {
    refetchPlans();
    refetchGiftingPlans();
  }, [values?.network]);

  React.useEffect(() => {
    refetchGiftingPlans();
  }, [values?.type]);

  const mainDataPlans = React.useMemo(() => {
    const plansDataFiltered = plansData?.filter(
      item =>
        item?.type?.toLowerCase?.() == values?.type?.value?.toLowerCase?.(),
    );

    const data = plansDataFiltered?.map?.(item => ({
      ...item,
      name: `${item?.network} ${item?.plan} ${item?.type}`,
    }));
    return data || [];
  }, [plansData, values?.type]);

  const mainGiftingDataPlans = React.useMemo(() => {
    const data = giftingPlansData?.map?.(item => ({
      ...item,
      name: `${item?.name}`,
    }));
    return data || [];
  }, [giftingPlansData, values?.type]);

  const dataRes = React.useMemo(() => {
    const currentType = [];

    plansData?.forEach?.(item => {
      if (!currentType?.includes(item?.type)) {
        currentType.push(item?.type);
      }
    });

    currentType.push('GIFTING');

    const mapType = currentType?.map?.(item => ({name: item, value: item}));
    return [...mapType];
  }, [plansData]);

  React.useEffect(() => {
    validateForm();
  }, [state?.bypass]);

  const sellData = async (transactionPin, useCashback) => {
    try {
      let response;
      if (values?.type?.name == 'GIFTING') {
        response = await fetchRequest({
          path: 'billpayment/vtpass/purchase-data',
          data: {
            serviceID: values?.network?.name?.toLowerCase?.() + '-data',
            amount: values?.amount * 1,
            billersCode: values?.phone,
            variation_code: values?.variation_code?.variation_code,
            phone: values?.phone,
            transactionPin,
          },
          pageError: {
            navigation,
          },
          headers: {debounceToken: new Date().getTime()},
        });
      } else {
        response = await fetchRequest({
          path: 'billpayment/reseller/data',
          data: {
            useCashback,
            transactionPin,
            network: `${values?.variation_code?.network?.toUpperCase?.()}`,
            phone: values?.phone,
            networkId: values?.variation_code?.id,
            amount: values?.amount * 1,
            type: values?.variation_code?.type,
            platform: values?.variation_code?.platform,
          },
          pageError: {
            navigation,
          },
          headers: {debounceToken: new Date().getTime()},
        });
      }

      openSuccessScreen({
        number: values?.phone,
        navigation,
        title: (
          <Text color={'#27A770'} size={18}>
            Data Successfully sold to{' '}
            <Text color={'#27A770'} size={18} fontWeight={'700'}>
              {values?.phone}
            </Text>
          </Text>
        ),

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
      getAndUpdateUserData();
    } catch (error) {
      console.log(error, 'errrss');
    }
  };

  const {data: customersData, refetch} = useQuery(
    'getCustomersDataScreen',
    getCustomers,
  );

  React.useEffect(() => {
    if (
      values.network &&
      values.amount &&
      values.phone &&
      values.variation_code &&
      isValid
    ) {
      setState(prevState => ({...prevState, buttonDisabled: false}));
    } else {
      setState(prevState => ({...prevState, buttonDisabled: true}));
    }
  }, [values, isValid]);

  React.useEffect(() => {
    refetch();
  }, [isFocused]);

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
            Sell Data
          </Text>
          <View style={{marginTop: 20}}>
            <Text
              fontWeight={'500'}
              color={COLORS.dark}
              size={14}
              style={{
                marginTop: 0,
                marginBottom: 10,
                paddingHorizontal: 10,
              }}>
              Customer’s Phone Number
            </Text>
            <Input
              keyboardType="numeric"
              value={values.phone}
              error={touched?.phone && errors?.phone}
              onChangeText={value => {
                const network = getNumberNetwork(value);

                setValues({
                  ...values,
                  phone: value,
                  network: state?.bypass ? null : network,
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
                      setValues({
                        ...values,
                        phone: phone,
                        network: state?.bypass ? null : network,
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
            <View style={{marginBottom: 20}}>
              <RecentCustomers
                value={values?.phone}
                onPress={phone => {
                  const network = getNumberNetwork(phone);
                  setValues({
                    ...values,
                    phone: phone,
                    network: state?.bypass ? null : network,
                  });
                }}
              />
            </View>

            <PagePicker
              error={touched?.network && errors?.network}
              data={NETWORKS}
              value={values?.network}
              onValueChange={value => {
                setValues({...values, network: value, type: ''});
              }}
              placeholder="Select Network"
              onBlur={() => {
                setFieldTouched('network', true);
              }}
            />
            <PagePicker
              data={dataRes}
              onValueChange={value => {
                setFieldValue('type', value);
              }}
              value={values?.type}
              error={touched?.type && errors?.type}
              placeholder="Select Data type"
              onBlur={() => {
                setFieldTouched('type', true);
              }}
            />
            <PagePicker
              loading={isFetching}
              value={values?.variation_code}
              error={touched?.variation_code && errors?.variation_code}
              onValueChange={value => {
                if (values?.variation_code?.name != value?.name) {
                  setValues({
                    ...values,
                    variation_code: value,
                    amount: value?.amount || value?.variation_amount,
                  });
                }
              }}
              data={
                (values?.type?.name == 'GIFTING'
                  ? mainGiftingDataPlans
                  : mainDataPlans) ?? []
              }
              onBlur={() => {
                setFieldTouched('variation_code', true);
              }}
              placeholder="Select Data plan"
            />
            <SuccessRateDisplay
              type={
                values?.type?.name?.toLowerCase() == 'gifting'
                  ? 'data'
                  : 'dataResell'
              }
              network={
                values?.type?.name?.toLowerCase() == 'gifting'
                  ? values?.network?.name?.toLowerCase()
                  : values?.type?.name?.toLowerCase()
              }
            />
            <View style={{paddingHorizontal: 10, marginTop: 15}}>
              <Input
                showTextError={false}
                error={touched?.amount && errors?.amount}
                editable={false}
                textColor={COLORS.blue}
                placeholder="0.00"
                backgroundColor="#EFF1FB"
                value={formatAmount(values?.amount)}
                rightIcon={
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text fontWeight={'500'} color={COLORS.green} size={11}>
                      Cashback{' '}
                      {GENERAL.nairaSign +
                        formatAmount(
                          (values?.amount * values?.variation_code?.cashback) /
                            100,
                        )}{' '}
                    </Text>
                    {/* <Text
                      color={errors?.amount ? COLORS.errorRed : '#9A9A9A'}
                      fontWeight={'500'}
                      size={12}>
                      {errors?.amount ? errors?.amount : 'Amount'}
                    </Text> */}
                  </View>
                }
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
