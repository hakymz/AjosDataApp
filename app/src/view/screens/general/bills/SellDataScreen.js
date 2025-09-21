import React from 'react';
import {
  BottomSheets,
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
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {COLORS, FONTS, GENERAL, NETWORKS} from '../../../../conts';
import * as yup from 'yup';
import {useBillsData, useLayouts, useUser} from '../../../../hooks';

import {useQuery, useQueryClient} from 'react-query';
import {useFormik} from 'formik';
import {
  fetchRequest,
  formatAmount,
  getNumberNetwork,
  openSuccessScreen,
  scaleFont,
  validateNumberNetwork,
} from '../../../../helper';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';
import {useIsFocused} from '@react-navigation/native';
import {RecentCustomers} from '../../../components/home';
import LinearGradient from 'react-native-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';
import {
  BillsTransactionSummary,
  TransactionSummary,
} from '../../../components/bottomSheetModal/modalContents';

let validationSchema;

const PickerTrigger = ({
  value,
  onValueChange,
  data,
  fontFamily,
  pickerStyle,
}) => {
  const colorScheme = useColorScheme();
  const pickerRef = React.useRef(null);
  let itemColor =
    colorScheme == 'dark'
      ? Platform.OS == 'ios'
        ? COLORS.grey
        : COLORS.white
      : COLORS.black;

  const dataSet = (data ?? [])?.map?.(item => ({
    ...item,
    label:
      item?.name?.toString?.()?.trim?.() || item?.plan?.toString?.()?.trim?.(),
    value: item,
    color: itemColor,
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => pickerRef.current?.togglePicker?.()}
      style={{
        height: 38,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        width: 60,
        position: 'absolute',
        zIndex: 10,
      }}>
      {/* Invisible picker but controlled */}
      <RNPickerSelect
        ref={pickerRef}
        value={value}
        items={dataSet}
        onValueChange={onValueChange}
        placeholder={{
          value: '',
          label: '',
          color: itemColor,
        }}
        useNativeAndroidPickerStyle={false}
        style={
          Platform.OS === 'ios'
            ? {
                inputIOSContainer: {pointerEvents: 'none'},
                inputIOS: {
                  color: 'transparent', // always hidden
                  fontSize: scaleFont(14),
                  fontFamily,
                  ...pickerStyle,
                },
              }
            : {
                inputAndroid: {
                  color: 'transparent',
                  fontSize: scaleFont(14),
                  fontFamily,
                  ...pickerStyle,
                },
                inputAndroidContainer: {pointerEvents: 'none'},
              }
        }
      />
    </TouchableOpacity>
  );
};

const getPlans = async (network = 'MTN') => {
  try {
    const response = await fetchRequest({
      path: `data-vending/plans?network=${network}`,
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

const DataCard = ({data, onPress}) => {
  const {width} = useWindowDimensions();
  const currentWidth = width / 3 - 90 / 3;
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#FFC849', '#CBDB31']}
        style={{
          height: 157,
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
            {data?.validity}
          </Text>

          <Text style={{marginTop: 10}} size={18} bold color={COLORS.darkBlue}>
            {data?.plan?.split?.(' ')?.[0]}
          </Text>
          <Text
            style={{marginTop: 10}}
            size={12}
            semiBold
            color={COLORS.primary}>
            ₦{data?.amount}
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text size={10} bold>
            ₦{formatAmount((data?.cashback / 100) * data?.amount)} Cashback
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const SellDataScreen = ({navigation, route}) => {
  const pickerRef = React.useRef(null);

  const queryClients = useQueryClient();
  const {minHeight} = useLayouts();

  const {getAndUpdateUserData} = useUser();

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
    resetForm,
    validateForm,
    isValid,
  } = useFormik({
    initialValues: {
      phone: '',
      network: NETWORKS[0],
      amount: '',
      type: {name: 'All', value: 'All'},
      variation_code: {},
      validityType: 'Daily',
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
          details: `${GENERAL.nairaSign}${formatAmount(
            values?.variation_code?.amount,
          )}`,
        },
        {
          name: 'Data Type',
          details: `${values?.variation_code?.name}`,
        },
        {
          name: 'Receivable Cash-back',
          details: `${values?.variation_code?.cashback}% - ${
            GENERAL.nairaSign
          }${formatAmount(
            (values?.variation_code?.amount *
              values?.variation_code?.cashback) /
              100,
          )}`,
        },
      ];
      BottomSheets.show({
        component: (
          <BillsTransactionSummary
            logo={logo}
            detailsList={detailsList}
            details={{
              ...values,
              amount: values?.variation_code?.amount,
            }}
            proceed={sellData}
            title="Data Purchase"
          />
        ),
      });
    },
  });

  validationSchema = yup.object().shape({
    network: yup.object().required('Please choose network'),
    type: yup.object().required('Please choose type'),
    phone: yup
      .string()
      .required('Please input phone no')
      .max(11, 'Max length of 11 digits')
      .test(
        'validateNumberNetwork',
        !values?.network?.name
          ? 'Select network'
          : `Invalid ${values?.network?.name} number`,
        value => validateNumberNetwork(value, values?.network?.name),
      ),
  });
  const {data: plansData, refetch: refetchPlans} = useQuery({
    queryFn: () => getPlans(values?.network?.name?.toUpperCase?.()),
    queryKey: [`getPlans'${values?.network?.name}`],
  });

  React.useEffect(() => {
    refetchPlans();
    queryClients.invalidateQueries({
      queryKey: [`getPlans'${values?.network?.name}`],
    });
  }, [values?.network]);

  const mainDataPlans = React.useMemo(() => {
    const plansDataFiltered =
      values?.type?.value == 'All'
        ? plansData
        : plansData?.filter(
            item =>
              item?.type?.toLowerCase?.() ==
              values?.type?.value?.toLowerCase?.(),
          );

    const dataWithValidity = plansDataFiltered?.map?.(item => {
      const days = Number(item?.validity?.split(' ')[0]); // ensure it's a number
      let type = '';
      if (days < 7) {
        type = 'Daily';
      } else if (days < 30) {
        type = 'Weekly';
      } else {
        type = 'Monthly';
      }

      return {
        ...item,
        name: `${item?.network} ${item?.plan} ${item?.type}`,
        validityType: type,
      };
    });

    return dataWithValidity || [];
  }, [plansData, values?.type, values?.validityType]);

  const types = React.useMemo(() => {
    const currentType = [];

    plansData?.forEach?.(item => {
      if (!currentType?.includes(item?.type)) {
        currentType.push(item?.type);
      }
    });

    const mapType = currentType?.map?.(item => ({name: item, value: item}));
    return [{name: 'All', value: 'All'}, ...mapType];
  }, [plansData]);

  const sellData = async (transactionPin, useCashback) => {
    try {
      let response = await fetchRequest({
        path: 'data-vending/purchase',
        data: {
          useCashback,
          transactionPin,
          network: `${values?.variation_code?.network?.toUpperCase?.()}`,
          phone: values?.phone,
          networkId: values?.variation_code?.id,
          amount: values?.variation_code?.amount * 1,
          type: values?.variation_code?.type,
          platform: values?.variation_code?.platform,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });

      getAndUpdateUserData();
      resetForm();

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

  return (
    <CustomSafeAreaView>
      <MainHeader nav title={'Data Purchase'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 30,
          paddingBottom: 70,
          minHeight: minHeight - 70,
        }}>
        <View style={{paddingHorizontal: 20}}>
          <RecentCustomers
            value={values?.phone}
            onPress={phone => {
              const network = getNumberNetwork(phone);

              setValues({
                ...values,
                phone: phone,
                network: network ? network : values?.network,
              });
            }}
          />
          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row'}}>
              <Input
                leftIcon={
                  <View
                    onPress={() => {
                      pickerRef?.current.focus?.();
                      console.log('yesss');
                    }}
                    style={{
                      height: 36,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <PickerTrigger
                      value={values?.network}
                      onValueChange={value =>
                        setValues({...values, network: value})
                      }
                      data={NETWORKS}
                      placeholder="Select Network"
                      error={touched?.network && errors?.network}
                    />
                    <Image
                      source={values?.network?.image}
                      style={{height: 36, width: 36, marginRight: 8}}
                    />

                    <Icons.ChevronDown size={15} />
                  </View>
                }
                onPaste={value => {
                  const network = getNumberNetwork(value);

                  setValues({
                    ...values,
                    phone: value,
                    network: network ? network : values?.network,
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
                    network: network ? network : values?.network,
                  });
                }}
                onBlur={() => setFieldTouched('phone', true)}
                placeholder="Phone Number"
              />
            </View>
          </View>
        </View>
        <View
          style={{
            height: 70,
            backgroundColor: COLORS.white,
            marginTop: 15,
            justifyContent: 'center',
          }}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 20}}
            style={{flexGrow: 0}}
            horizontal>
            {types?.map(item => (
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
              minHeight: 235,
            }}>
            <View style={{marginBottom: 20}}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{}}
                style={{flexGrow: 0}}
                horizontal>
                {['Daily', 'Weekly', 'Monthly']?.map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      setFieldValue('validityType', item);
                    }}
                    style={{
                      height: 34,
                      backgroundColor:
                        values?.validityType == item ? '#E9E6F7' : COLORS.white,
                      paddingHorizontal: 15,
                      marginRight: 7,
                      justifyContent: 'center',
                      borderRadius: 32,
                    }}>
                    <Text
                      bold
                      size={12}
                      color={
                        values?.validityType == item
                          ? COLORS.primary
                          : COLORS.darkBlue
                      }>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View>
              {mainDataPlans.filter(
                item =>
                  item.validityType?.toLowerCase?.() ===
                  values?.validityType?.toLowerCase?.(),
              ) == 0 && (
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
                columnWrapperStyle={{}}
                numColumns={3}
                data={mainDataPlans.filter(
                  item =>
                    item.validityType?.toLowerCase?.() ===
                    values?.validityType?.toLowerCase?.(),
                )}
                renderItem={({item}) => (
                  <DataCard
                    onPress={() => {
                      setFieldValue('variation_code', item);
                      submitForm();
                    }}
                    data={item}
                  />
                )}
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
