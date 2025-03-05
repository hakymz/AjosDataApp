import React from 'react';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {useBillsData, useTradeData, useUser} from '../../../../hooks';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {Image, Keyboard, View} from 'react-native';

import {
  BalanceContainer,
  BigInput,
  CustomPicker,
  FeeContainer,
  Input,
  Text,
} from '../../general';
import {TransactionStatusModal} from '../../bottomSheetModal';
import {useNavigation} from '@react-navigation/native';
import {s} from 'react-native-size-matters';
import {SectionList} from '../../lists';
import {BillSummary} from '../../../screens/general/summary/content';
const validationSchema = yup.object().shape({
  billersCode: yup.string().required('Please input Account ID | User ID'),
  name: yup.string().required('Please input customer name'),
  variation_code: yup.object().required('Please select meter type'),
  amount: yup
    .number()
    .required('Please input amount')
    .min(1000, 'Min amount of 1000NGN'),
});

export const ElectricityForm = React.forwardRef(
  ({data, setDisableButton}, ref) => {
    const [state, setState] = React.useState({
      amountInputIsFocused: false,
      amount: 0,
    });

    const {data: userData} = useUser();
    const navigation = useNavigation();

    const {getVariationCodeById, electricityVariationCodes} = useBillsData();
    const {allRates} = useTradeData();

    React.useEffect(() => {
      getVariationCodeById(data?.serviceID, 'electricityVariationCodes');
    }, []);

    const buyElectricity = async values => {
      try {
        const response = await fetchRequest({
          path: 'billpayment/purchase-electricity',
          method: 'POST',
          pageError: {navigation},
          data: {
            ...values,
            serviceID: data.serviceID,
            variation_code: values?.variation_code?.value,
            phone: userData?.user?.phoneNumber,
          },
        });

        if (response?.status == 'success') {
          navigation.navigate('HomeScreen');
          openSuccessScreen({
            navigation,
            secondBtn: true,
            secondBtnText: 'View Electricity Token',
            secondBtnProceed: () => {
              navigation.navigate('SummaryNextScreen', {
                data: {
                  section: (
                    <BillSummary
                      details={{
                        amount: values?.amount,
                        operator: data?.name,
                        accountNo: {
                          accountNo: values?.billersCode,
                          name: 'Account ID | User ID',
                        },
                        accountNo: {
                          accountNo: values?.billersCode,
                          name: 'Account ID | User ID',
                        },
                        accountName: {
                          accountName: values?.name,
                          name: 'Account Name',
                        },
                        type: {
                          type: values?.variation_code?.value,
                          name: 'Meter Type',
                        },
                        token: {
                          token: response?.data?.token,
                          name: 'Electricity Token',
                        },
                        icon: (
                          <Image
                            source={{uri: data?.image}}
                            style={{
                              height: s(40),
                              width: s(40),
                              borderRadius: 100,
                            }}
                          />
                        ),
                        transactionId:
                          response?.data?.content?.transactions?.transactionId,
                      }}
                    />
                  ),
                },
              });
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

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
        name: '',
      },
      validationSchema: validationSchema,
      onSubmit: values => {
        const sectionListData = [
          {
            title: data?.name,
            des: 'Operator',
            right: (
              <Image
                source={{uri: data?.image}}
                style={{height: s(40), width: s(40), borderRadius: 100}}
              />
            ),
          },
          {des: 'Account ID | User ID', title: values?.billersCode},
          {
            title: `+${GENERAL.nairaSign}${allRates.bills?.nairaFee}`,
            des: 'Amount',
            right: (
              <Text lineHeight={30} size={20} semiBold>
                {GENERAL.nairaSign}
                {formatAmount(values?.amount)}
              </Text>
            ),
          },
          {des: 'Bundle Type', title: values?.variation_code?.name},
          {des: 'Account Name', title: values?.name},
        ];
        navigation.navigate('BillsSummaryScreen', {
          proceed: () => buyElectricity(values),
          summary: (
            <>
              <SectionList item={sectionListData} />
              <BalanceContainer style={{marginTop: 10}} />
            </>
          ),
        });
      },
    });

    const verifyMeterNumber = async (value, type, setFieldValue) => {
      if (!type) {
        setFieldTouched('type', true);
        validateField('type');
      }

      if (value.length > 8) {
        setFieldValue('name', '');
        try {
          const response = await fetchRequest({
            path: 'billpayment/verify-account',
            method: 'POST',
            data: {
              serviceID: data?.serviceID,
              billersCode: value,
              type: type?.value,
            },
            // displayMessage: false,
            showLoader: false,
          });

          if (response?.status == 'success' && response?.data) {
            setFieldValue('name', response?.data?.content?.Customer_Name);
          } else {
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        setFieldValue('name', '');
      }
    };

    React.useEffect(() => {
      if (
        values?.billersCode &&
        values?.amount &&
        values?.name &&
        values?.variation_code &&
        isValid
      ) {
        setDisableButton(false);
      } else {
        setDisableButton(true);
      }
    }, [values, isValid]);

    ref.current = submitForm;

    return (
      <View>
        <View style={{paddingHorizontal: 20}}>
          <Input
            placeholder="Account ID | User ID"
            textColor={{active: COLORS.black, blur: COLORS.inputGrey}}
            fontFamily={FONTS.EINA04_FONTS.semiBold}
            keyboardType="numeric"
            value={values.billersCode}
            error={touched?.billersCode && errors?.billersCode}
            onChangeText={value => {
              verifyMeterNumber(value, values?.variation_code, setFieldValue);
              setFieldValue('billersCode', value);
            }}
            onBlur={() => {
              setFieldTouched('billersCode', true);
            }}
            conStyle={{marginBottom: 10}}
            backgroundColor={COLORS.background}
          />

          <Input
            textColor={{active: COLORS.primary, blur: COLORS.primary}}
            fontFamily={FONTS.EINA04_FONTS.semiBold}
            value={values.name}
            error={touched?.name && errors?.name}
            editable={false}
            conStyle={{marginBottom: 10}}
            placeholder="Customer name"
            backgroundColor={COLORS.background}
            onChangeText={value => {
              setFieldValue('name', value);
            }}
          />

          <CustomPicker
            style={{backgroundColor: COLORS.background}}
            error={touched?.variation_code && errors?.variation_code}
            value={values.variation_code}
            placeholder="Meter Type"
            data={[
              {name: `Prepaid ${data?.name}`, value: 'prepaid'},
              {name: `Postpaid ${data?.name}`, value: 'postpaid'},
            ]}
            setTouched={() => {
              setFieldTouched('variation_code', true);
            }}
            onValueChange={value => {
              setFieldValue('variation_code', value);
              verifyMeterNumber(values?.billersCode, value, setFieldValue);
            }}
          />
        </View>
        {/* amount input */}
        <BigInput
          showCurrencyLogo
          onChangeText={value => setFieldValue('amount', value)}
          onBlur={() => setFieldTouched('amount', true)}
          value={values?.amount}
          error={touched?.amount && errors?.amount}
          currency
          textColor={{
            active: COLORS.white,
            blur: COLORS.inputGrey,
            placeholderTextColor: COLORS.inputGrey,
          }}
          backgroundColor={{
            active: COLORS.black,
            blur: COLORS.background,
          }}
          placeholder="0"
          title={'How much'}
          type="background"
        />
        <FeeContainer
          style={{marginHorizontal: 20}}
          fee={`${GENERAL.nairaSign}${allRates.bills?.nairaFee}`}
        />
      </View>
    );
  },
);
