import {Formik, useFormik} from 'formik';
import {Image, View} from 'react-native';
import React from 'react';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {
  extractError,
  fetchRequest,
  formatAmount,
  openErrorScreen,
  openSuccessScreen,
  pickerPhoneNo,
  scaleFont,
} from '../../../../helper';
import {Card} from '../../cards';
import {
  BalanceContainer,
  BigInput,
  CustomPicker,
  FeeContainer,
  Icons,
  Input,
  MyIcons,
  Text,
} from '../../general';
import * as yup from 'yup';
import {useBillsData, useTradeData} from '../../../../hooks';

import {useNavigation} from '@react-navigation/native';
import {SectionList} from '../../lists';
import {s} from 'react-native-size-matters';

const validationSchema = yup.object().shape({
  type: yup.object().required('Please choose type'),
  phone: yup.number().required('Please input phone no'),
  amount: yup.number().required('Please input amount'),
  variation_code: yup.object().required('Please choose data'),
});

const buyAirtimeOrData = async (values, type, navigation, resetForm) => {
  let response;

  try {
    if (type == 'data') {
      response = await fetchRequest({
        path: 'billpayment/purchase-data',
        method: 'POST',
        pageError: {navigation},
        data: {
          serviceID: `${values?.serviceID}-data`,
          billersCode: values?.phone,
          amount: parseInt(values?.amount),
          variation_code: values?.variation_code?.variation_code,
          phone: values?.phone,
          quantity: 1,
        },
      });
    } else {
      response = await fetchRequest({
        path: 'billpayment/purchase-airtime',
        method: 'POST',
        pageError: {navigation},
        data: {
          serviceID: values?.serviceID,
          amount: values?.amount,
          phone: values?.phone,
        },
      });
    }
    navigation.navigate('HomeScreen');
    openSuccessScreen({
      navigation,
    });
  } catch (err) {}
};
export const AirtimeForm = React.forwardRef(({data, setDisableButton}, ref) => {
  const {getVariationCodeById, dataVariationCodes} = useBillsData();
  const {allRates} = useTradeData();

  const [state, setState] = React.useState({
    type: null,
    dataVariationCodes: [],
    fee: '0',
  });
  const navigation = useNavigation();

  React.useEffect(() => {
    if (state.type?.value == 'data') {
      setState(prevState => ({...prevState, dataVariationCodes: []}));
      getVariationCodeById(
        `${data?.name?.toLowerCase?.()}-data`,
        'dataVariationCodes',
      );

      // add validation for data picker input
      validationSchema.fields.variation_code.withMutation(schema => {
        schema.required('Please choose bundle');
      });
    } else {
      validationSchema.fields.variation_code.withMutation(schema => {
        schema.notRequired();
      });
    }
  }, [state.type]);

  React.useEffect(() => {
    setState(prevState => ({...prevState, dataVariationCodes}));
  }, [dataVariationCodes]);

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
    isValid,
  } = useFormik({
    initialValues: {
      phone: __DEV__ ? '08011111111' : '',
      amount: '',
      type: '',
      variation_code: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const sectionListData = [
        {
          title: data?.name,
          des: 'Operator',
          right: (
            <Image
              source={data?.image}
              style={{height: s(40), width: s(40), borderRadius: 100}}
            />
          ),
        },
        {des: 'Phone Number ', title: values?.phone},
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
        values?.type?.value == 'data' && {
          title: `${values?.variation_code?.name}`,
          des: 'Data Type',
        },
      ];

      if (values?.type?.value == 'airtime') {
        sectionListData.pop();
      }
      navigation.navigate('BillsSummaryScreen', {
        proceed: () =>
          buyAirtimeOrData(
            {...values, serviceID: data?.id},
            state.type.value,
            navigation,
            resetForm,
          ),
        summary: (
          <>
            <SectionList item={sectionListData} />
            <BalanceContainer style={{marginTop: 10}} />
          </>
        ),
      });
    },
  });

  React.useEffect(() => {
    if (values?.phone && values?.type && values?.amount && isValid) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [values, isValid]);

  ref.current = submitForm;

  return (
    <View>
      <View style={{paddingHorizontal: 20}}>
        {/* Phone number input */}
        <Input
          textColor={{active: COLORS.black, blur: COLORS.inputGrey}}
          fontFamily={FONTS.EINA04_FONTS.semiBold}
          value={values.phone}
          error={touched?.phone && errors?.phone}
          onChangeText={handleChange('phone')}
          onBlur={() => setFieldTouched('phone', true)}
          conStyle={{marginBottom: 10}}
          placeholder="Phone Number"
          keyboardType="numeric"
          backgroundColor={COLORS.background}
          rightIcon={
            <MyIcons.Contact
              style={{left: -10}}
              size={20}
              onPress={() => {
                pickerPhoneNo(value => {
                  setFieldValue('phone', value);
                });
              }}
            />
          }
        />

        {/* type input */}
        <CustomPicker
          style={{backgroundColor: COLORS.background}}
          error={touched?.type && errors?.type}
          onValueChange={value => {
            setFieldValue('variation_code', '');
            setFieldValue('amount', 0);
            setFieldValue('type', value);
            setState(prevState => ({...prevState, type: value}));
            if (value?.value == 'airtime') {
              validationSchema.fields.amount.withMutation(schema => {
                schema.min(50, `Min amount of ${50}NGN`);
              });
            } else {
              // Reset max and min amount
              validationSchema.fields.amount.withMutation(schema => {
                schema.min(10, `Min amount of 10NGN`);
              });

              validationSchema.fields.amount.withMutation(schema => {
                schema.max(10000000000000, `Max amount of 100000000NGN`);
              });
            }
          }}
          value={values?.type}
          setTouched={() => {
            setFieldTouched('type', true);
          }}
          placeholder="Data or Airtime"
          data={[
            {name: 'Mobile Top-up', value: 'airtime'},
            {name: 'Data Top-up', value: 'data'},
          ]}
          clearError={() => {
            setFieldError('type', false);
          }}
        />

        {/* data input */}
        {state?.type?.value == 'data' && (
          <CustomPicker
            style={{backgroundColor: COLORS.background}}
            error={touched?.variation_code && errors?.variation_code}
            onValueChange={value => {
              setValues({
                ...values,
                variation_code: value,
                amount: value?.variation_amount,
              });
            }}
            value={values?.variation_code}
            placeholder="Data type"
            data={dataVariationCodes?.variations ?? []}
            onBlur={() => {
              setFieldTouched('variation_code', true);
            }}
          />
        )}
      </View>

      {/* amount input */}
      <BigInput
        showCurrencyLogo
        editable={values?.type?.value == 'airtime'}
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
});
