import React from 'react';
import {
  BottomSheets,
  Button,
  CheckBox,
  CustomPicker,
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
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {COLORS, FONTS, GENERAL, NETWORKS} from '../../../../conts';
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
import LinearGradient from 'react-native-linear-gradient';

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

const DataCard = ({}) => {
  const {width} = useWindowDimensions();
  const currentWidth = width / 3 - 100 / 3;
  return (
    <LinearGradient
      // start={{x: 0, y: 0}}
      // end={{x: 1, y: 0}}
      colors={['#FFC849', '#CBDB31']}
      style={{
        height: 157,
        // backgroundColor: '#CBDB31',
        width: currentWidth,
        marginBottom: 20,
        marginHorizontal: 5,
        borderRadius: 12,
      }}>
      <View
        style={{
          height: 127,
          backgroundColor: '#F5F5F5',
          marginTop: 1,
          marginHorizontal: 1,
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text size={12} semiBold color={COLORS.primary}>
          30 Days
        </Text>

        <Text style={{marginTop: 10}} size={18} bold color={COLORS.darkBlue}>
          1.8 GB
        </Text>
        <Text style={{marginTop: 10}} size={12} semiBold color={COLORS.primary}>
          ₦1,500
        </Text>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text size={10} bold>
          ₦30 Cashback
        </Text>
      </View>
    </LinearGradient>
  );
};

export const SellDataScreen = ({navigation, route}) => {
  const [state, setState] = React.useState({
    buttonDisabled: false,
    bypass: false,
  });

  const pickerRef = React.useRef(null);

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
  console.log(mainDataPlans);

  return (
    <CustomSafeAreaView>
      <MainHeader nav title={'Data Purchase'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 30,
          paddingBottom: 40,
          minHeight: minHeight - 70,
        }}>
        <View style={{paddingHorizontal: 20}}>
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
          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row'}}>
              <Input
                leftIcon={
                  <TouchableOpacity
                    onPress={() => {
                      pickerRef?.current.focus?.();
                    }}
                    style={{
                      height: 36,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <CustomPicker
                      ref={pickerRef}
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
                      rightIcon={<></>}
                      innerStyle={{opacity: 1, backgroundColor: 'transparent'}}
                      conStyle={{
                        position: 'absolute',
                        zIndex: 100,
                        height: '100%',
                        marginBottom: 0,
                        marginTop: 0,
                        backgroundColor: 'transparent',
                        width: 70,
                        left: -20,
                        top: -20,
                        zIndex: 0,
                      }}
                    />
                    <Image
                      source={values?.network?.image}
                      style={{height: 36, width: 36, marginRight: 8}}
                    />

                    <Icons.ChevronDown size={15} />
                  </TouchableOpacity>
                }
                onPaste={value => {
                  const network = getNumberNetwork(value);
                  setValues({
                    ...values,
                    phone: value,
                    network: network,
                  });
                }}
                keyboardType="numeric"
                value={values.phone}
                error={touched?.phone && errors?.phone}
                onChangeText={value => {
                  const network = getNumberNetwork(value);

                  setValues({
                    ...values,
                    phone: value,
                    network: network,
                  });
                }}
                onBlur={() => setFieldTouched('phone', true)}
                placeholder="Phone Number"
              />
            </View>
          </View>

          {/* <View style={{flexDirection: 'row'}}>
            <View style={{width: 5}} />
            <CustomPicker
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
          </View> */}

          {/* <CustomPicker
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
          /> */}

          {/* <Input
            fontSize={16}
            fontFamily={FONTS.PLUS_JAKARTA_SANS_FONTS.bold}
            showTextError={false}
            error={touched?.amount && errors?.amount}
            editable={false}
            textColor={COLORS.blue}
            placeholder="Amount"
            backgroundColor="#EFF1FB"
            value={formatAmount(values?.amount)}
          /> */}
        </View>
        <View
          style={{
            height: 70,
            backgroundColor: COLORS.white,
            marginTop: 15,
            justifyContent: 'center',
          }}>
          <ScrollView
            contentContainerStyle={{paddingHorizontal: 20}}
            style={{flexGrow: 0}}
            horizontal>
            {dataRes?.map(item => (
              <TouchableOpacity
                onPress={() => {
                  setFieldValue('type', item);
                }}
                style={{
                  height: 42,
                  backgroundColor: '#F5F5F5',
                  paddingHorizontal: 15,
                  marginRight: 10,
                  justifyContent: 'center',
                  borderRadius: 32,
                  borderWidth: 1,
                  borderColor:
                    item?.name == values?.type?.name
                      ? COLORS.primary
                      : '#F5F5F5',
                }}>
                <Text bold size={12} color={'#848A94'}>
                  {item?.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: COLORS.white,
              marginTop: 15,
              borderRadius: 18,
            }}>
            <Text></Text>

            <View>
              {mainDataPlans?.length == 0 && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 10,
                  }}>
                  <Image
                    style={{height: 128, width: 128}}
                    source={require('../../../../assets/images/others/fly.png')}
                  />
                </View>
              )}

              <FlatList
                columnWrapperStyle={{
                  justifyContent: 'space-evenly',
                }}
                numColumns={3}
                data={mainDataPlans}
                renderItem={({item}) => <DataCard item={item} />}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 40,
            marginTop: 10,
          }}>
          <BillsBalance />
        </View>

        <View style={{marginBottom: 20, paddingHorizontal: 20}}>
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
