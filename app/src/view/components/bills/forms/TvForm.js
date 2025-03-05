import {Formik, useFormik} from 'formik';
import React from 'react';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
  scaleFont,
} from '../../../../helper';
import {useBillsData, useTradeData, useUser} from '../../../../hooks';
import {Card} from '../../cards';
import {
  BalanceContainer,
  BigInput,
  CustomPicker,
  FeeContainer,
  Input,
  Text,
} from '../../general';
import {View, Image} from 'react-native';
import * as yup from 'yup';
import {TransactionStatusModal} from '../../bottomSheetModal';
import {useNavigation} from '@react-navigation/native';
import {s} from 'react-native-size-matters';
import {SectionList} from '../../lists';

const validationSchema = yup.object().shape({
  billersCode: yup.string().required('Please input smart card no'),
  name: yup.string().required('Please input customer name'),
  amount: yup.number().required('Please input amount'),
  variation_code: yup.object().required('Please choose data'),
});

const verifySmartCard = async (value, setFieldValue, serviceID) => {
  if (value.length > 9) {
    try {
      const response = await fetchRequest({
        path: 'billpayment/verify-account',
        method: 'POST',
        data: {
          serviceID: serviceID,
          billersCode: value,
        },
        // displayMessage: false,
        showLoader: false,
      });

      console.log(response);
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
    }
  } else {
    setFieldValue('name', '');
  }
};

export const TvForm = React.forwardRef(({data, setDisableButton}, ref) => {
  const {data: userData} = useUser();
  const {getVariationCodeById, tvVariationCodes} = useBillsData();
  const {allRates} = useTradeData();
  React.useEffect(() => {
    getVariationCodeById(data?.serviceID, 'tvVariationCodes');
  }, []);

  const navigation = useNavigation();

  const buyTv = async values => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/purchase-tv',
        method: 'POST',
        pageError: {navigation},
        data: {
          ...values,
          amount: parseInt(values?.amount),
          serviceID: data?.serviceID,
          variation_code: values?.variation_code?.variation_code,
          phone: userData?.user?.phoneNumber,
          subscription_type: 'change',
          quantity: 1,
        },
      });

      if (response?.status == 'success') {
        navigation.navigate('HomeScreen');
        openSuccessScreen({navigation});
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
    isValid,
  } = useFormik({
    initialValues: {
      billersCode: __DEV__ ? '1212121212' : '',
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
        proceed: () => buyTv(values),
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
    if (
      values?.billersCode &&
      values?.variation_code &&
      values?.amount &&
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
          textColor={{active: COLORS.black, blur: COLORS.inputGrey}}
          fontFamily={FONTS.EINA04_FONTS.semiBold}
          keyboardType="numeric"
          value={values.billersCode}
          error={touched?.billersCode && errors?.billersCode}
          onChangeText={value => {
            verifySmartCard(value, setFieldValue, data.serviceID);
            setFieldValue('billersCode', value);
          }}
          onBlur={() => {
            setFieldTouched('billersCode', true);
          }}
          conStyle={{marginBottom: 10}}
          placeholder="Smart card Number"
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
          placeholder="Choose package"
          data={tvVariationCodes?.content?.varations}
          onValueChange={value => {
            setValues({
              ...values,
              variation_code: value,
              amount: value?.variation_amount,
            });
          }}
          setTouched={() => {
            setFieldTouched('variation_code', true);
          }}
        />
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
