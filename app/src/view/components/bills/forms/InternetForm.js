import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {Card} from '../../cards';
import React from 'react';
import {
  BalanceContainer,
  BigInput,
  CustomPicker,
  FeeContainer,
  Icons,
  Input,
  Text,
} from '../../general';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
  scaleFont,
} from '../../../../helper';
import {useBillsData, useTradeData} from '../../../../hooks';
import {Image, View} from 'react-native';
import {Formik, useFormik} from 'formik';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {s} from 'react-native-size-matters';
import {SectionList} from '../../lists';

const validationSchema = yup.object().shape({
  accountId: yup.number().required('Please input Account or User ID'),
  amount: yup.number().required('Please input amount'),
  variation_code: yup.object().required('Please choose data'),
});

export const InternetForm = React.forwardRef(
  ({data, setDisableButton}, ref) => {
    const [state, setState] = React.useState({
      fee: 0,
    });
    const {getVariationCodeById, internetVariationCodes} = useBillsData();
    const {allRates} = useTradeData();

    React.useEffect(() => {
      getVariationCodeById(data?.serviceID, 'internetVariationCodes');
    }, [data?.serviceID]);

    const navigation = useNavigation();

    const buyInternet = async values => {
      try {
        const response = await fetchRequest({
          path: 'billpayment/purchase-data',
          method: 'POST',
          pageError: {navigation},
          data: {
            serviceID: values.serviceID,
            billersCode: values?.accountId,
            amount: parseInt(values?.amount),
            variation_code: values?.variation_code?.variation_code,
            variation_name: values?.variation_code?.name,
            phone: values?.accountId,
            quantity: 1,
          },
        });
        if (response?.status == 'success') {
          openSuccessScreen({
            navigation,
            // indicatorWidth: '',
            // indicatorText: 'yes',
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
      handleSubmit,
      submitForm,
      isValid,
    } = useFormik({
      initialValues: {
        accountId: __DEV__ ? '08011111111' : '',
        amount: '',
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
          {des: 'Account ID | User ID ', title: values?.accountId},
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
          {
            des: 'Bundle Type',
            title: values?.variation_code?.name?.split('-')?.[0],
          },
        ];
        navigation.navigate('BillsSummaryScreen', {
          proceed: () => buyInternet({...values, serviceID: data?.serviceID}),
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
        values?.accountId &&
        values?.amount &&
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
            textColor={{active: COLORS.black, blur: COLORS.inputGrey}}
            fontFamily={FONTS.EINA04_FONTS.semiBold}
            value={values.accountId}
            error={touched?.accountId && errors?.accountId}
            onChangeText={handleChange('accountId')}
            onBlur={() => setFieldTouched('accountId', true)}
            conStyle={{marginBottom: 10}}
            placeholder="Account ID | User ID"
            backgroundColor={COLORS.background}
          />
          <CustomPicker
            style={{backgroundColor: COLORS.background}}
            error={touched?.variation_code && errors?.variation_code}
            value={values.variation_code}
            placeholder="Bundle type"
            data={internetVariationCodes?.content?.varations}
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
  },
);
