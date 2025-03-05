import React from 'react';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Icons,
  Input,
  PageInput,
  PagePicker,
  SuccessRateDisplay,
  Text,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {ScrollView, StyleSheet, View} from 'react-native';
import {COLORS, IMAGES} from '../../../../conts';

import {useBillsData, useLayouts} from '../../../../hooks';
import {
  BillsTransactionSummary,
  TransactionSummary,
} from '../../../components/bottomSheetModal/contents';
import {useQuery} from 'react-query';
import {useFormik} from 'formik';

import * as yup from 'yup';
import {Copy, fetchRequest, openSuccessScreen} from '../../../../helper';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';

const validationSchema = yup.object().shape({
  phone: yup.string().required('Please enter phone no'),
  provider: yup.object().required('Please select provider'),
  amount: yup.number().required('Please enter amount'),
});

export const EPinScreen = ({route, navigation}) => {
  const {type} = route?.params || {};
  console.log(type, 'type');
  const {minHeight} = useLayouts();
  const {getEducationData} = useBillsData();
  const [state, setState] = React.useState({loading: false});

  const {data: educationData} = useQuery('getEducationData', getEducationData);

  const selectedEducationData = React.useMemo(() => {
    const selectedData = educationData?.filter(item =>
      item?.serviceID?.includes(type),
    );
    return selectedData;
  }, [educationData]);

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
      amount: '',
      provider: '',
      phone: __DEV__ ? '08011111111' : '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      try {
        const transactionsData = [
          {
            title: 'Product',
            details:
              type == 'neco'
                ? values?.provider?.name
                : educationVariationCode?.name,
          },
          {title: 'Customer’s Phone number', details: values?.phone},
          {title: 'Validity Period', details: '30 Days'},
        ];
        BottomSheets.show({
          component: (
            <BillsTransactionSummary
              title={'E-pin Resell'}
              image={type == 'neco' ? IMAGES.neco : values?.provider?.image}
              amount={values?.amount}
              data={transactionsData}
              serviceName={`${type?.toUpperCase?.()} E-pin`}
              btnTitle="Purchase E-pin"
              proceed={type == 'neco' ? proceedNeco : proceedWeac}
            />
          ),
          customSnapPoints: [650, 650],
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const getVariationCodeById = async () => {
    try {
      const response = await fetchRequest({
        path:
          'billpayment/vtpass/variation-code?serviceId=' +
          values?.provider?.serviceID,
        method: 'GET',
        // displayMessage: false,
        showLoader: false,
      });

      if (
        response?.status == 'success' &&
        response?.data?.content?.varations?.length > 0
      ) {
        const filteredData = response?.data?.content?.varations?.map?.(
          item => ({
            value: item?.variation_code,
            ...item,
          }),
        );

        return filteredData?.[0];
      }
    } catch (error) {
      console.log(error, 'errrrr');
    }
  };
  const getNecoPrice = async () => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/easyaccess/prices',
        method: 'GET',
        // displayMessage: false,
        showLoader: false,
      });

      return response?.data;
    } catch (error) {
      console.log(error, 'errrrr');
    }
  };

  const proceedWeac = async transactionPin => {
    let type = '';
    if (educationVariationCode?.value == 'waec-registraion') {
      type = 'waec_registraion';
    } else {
      type = 'waec_result';
    }

    try {
      const response = await fetchRequest({
        path: 'billpayment/vtpass/purchase-education?type=' + type,
        data: {
          serviceID: values?.provider?.serviceID,
          variation_code: educationVariationCode?.value,
          amount: values?.amount * 1,
          phone: values?.phone,
          quantity: 1,
          transactionPin,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });

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
                          ?.cards?.[0]?.Pin,
                      );
                    }}
                  />
                </View>
                <Text style={{marginTop: 10}} color={COLORS.blue} size={19} md>
                  {
                    response?.data?.receiptDetails?.metaInfo?.moredetails
                      ?.cards?.[0]?.Pin
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

  const proceedNeco = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/easyaccess/neco',
        data: {
          ...values,
          quantity: 1,
          transactionPin,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });

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
                          ?.pin,
                      );
                    }}
                  />
                </View>
                <Text style={{marginTop: 10}} color={COLORS.blue} size={19} md>
                  {response?.data?.receiptDetails?.metaInfo?.moredetails?.pin}
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

  const {data: educationVariationCode, refetch} = useQuery(
    'getVariationCodeById',
    getVariationCodeById,
  );

  const {data: necoPrice} = useQuery('getNecoPrice', getNecoPrice);

  const necoPriceFilterd = React.useMemo(() => {
    if (necoPrice?.neco) {
      return [
        {name: 'NECO Result Checking ', value: necoPrice?.neco?.toString?.()},
      ];
    }
    return [];
  }, [necoPrice]);

  React.useEffect(() => {
    if (type != 'neco') {
      setFieldValue('amount', educationVariationCode?.variation_amount || '');
    }
  }, [educationVariationCode]);

  React.useEffect(() => {
    refetch();
  }, [values?.provider]);

  React.useEffect(() => {
    if (values.provider && values.amount && values?.phone && isValid) {
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
            {type?.toUpperCase?.()} E-pin
          </Text>
          <View style={{marginTop: 20}}>
            <PagePicker
              error={touched?.provider && errors?.provider}
              value={values.provider}
              onValueChange={value => {
                setFieldValue('provider', value);
                if (type == 'neco') {
                  setFieldValue('amount', value?.value);
                }
              }}
              onBlur={() => {
                setFieldTouched('provider', true);
              }}
              data={type == 'neco' ? necoPriceFilterd : selectedEducationData}
              placeholder="Product"
            />
            <View style={{paddingHorizontal: 10, marginBottom: 10}}>
              <Input
                editable={false}
                value={values.amount}
                error={touched?.amount && errors?.amount}
                onChangeText={handleChange('amount')}
                onBlur={() => setFieldTouched('amount', true)}
                textColor={COLORS.blue}
                placeholder="0.0"
                backgroundColor="#EFF1FB"
              />
            </View>
            <SuccessRateDisplay type="education" />
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
                value={values.phone}
                error={touched?.phone && errors?.phone}
                onChangeText={handleChange('phone')}
                onBlur={() => setFieldTouched('phone', true)}
                textColor={COLORS.blue}
                placeholder="Phone Number"
                backgroundColor="#EFF1FB"
              />
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
                submitForm();
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
