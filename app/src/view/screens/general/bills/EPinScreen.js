import React from 'react';
import {
  BottomSheets,
  Button,
  CustomPicker,
  CustomSafeAreaView,
  Icons,
  Input,
  Text,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {ScrollView, StyleSheet, View} from 'react-native';
import {COLORS, GENERAL, IMAGES} from '../../../../conts';

import {useLayouts} from '../../../../hooks';

import {useQuery} from 'react-query';
import {useFormik} from 'formik';

import * as yup from 'yup';
import {Copy, fetchRequest, openSuccessScreen} from '../../../../helper';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';
import {
  BillsTransactionSummary,
  TransactionSummary,
} from '../../../components/bottomSheetModal/modalContents';

const validationSchema = yup.object().shape({
  phone: yup
    .string('Invalid phone no')
    .required('Please enter phone no')
    .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone no'),
  provider: yup.object().required('Please select provider'),
});

const getVariationCodeById = async () => {
  try {
    const response = await fetchRequest({
      path: `billpayment/education/services`,
      method: 'GET',
      // displayMessage: false,
      showLoader: false,
    });

    if (response?.data) {
      return response?.data;
    }
  } catch (error) {
    console.log(error, 'errrrr');
  }
};
export const EPinScreen = ({route, navigation}) => {
  const {type} = route?.params || {};
  const {minHeight} = useLayouts();
  const [state, setState] = React.useState({loading: false});

  const {data: educationVariationCode, refetch} = useQuery(
    'educationVariationCode',
    getVariationCodeById,
  );

  React.useEffect(() => {
    const selected = educationVariationCode?.filter(
      item => item?.name?.toUpperCase() == type,
    )?.[0];
    setFieldValue('provider', selected);
  }, [educationVariationCode]);

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
          {name: 'Mobile Number', details: values?.phone},
          {
            name: 'Amount',
            details: `${GENERAL.nairaSign}${values?.provider?.amount}`,
          },
          {
            name: 'Product',
            details: values?.provider?.name,
          },

          {
            name: 'Receivable Cash-back',
            details: `${parseInt(values?.provider?.cashback)}% - ${
              GENERAL.nairaSign
            }${
              (parseInt(values?.provider?.cashback) *
                values?.provider?.amount) /
              100
            }`,
          },
        ];

        BottomSheets.show({
          component: (
            <BillsTransactionSummary
              title={`${values?.provider?.name}`}
              logo={IMAGES?.[values?.provider?.name?.toLowerCase?.()]}
              details={{...values, amount: values?.provider?.amount}}
              detailsList={transactionsData}
              proceed={proceed}
            />
          ),
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const proceed = async (transactionPin, useCashback) => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/education/buy',
        data: {
          serviceID: values?.provider?.name,
          phoneNumber: values?.phone,
          transactionPin,
          useCashback,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });

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
      <MainHeader nav title={`${type?.toUpperCase?.()} Token`} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 30,
          paddingBottom: 100,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <Text size={12} color={'#898A8D'}>
          We will fetch the details to make sure its right,😌 we gatchu
        </Text>

        <View style={{marginTop: 30, flex: 1}}>
          <View style={{marginTop: 20}}>
            <CustomPicker
              error={touched?.provider && errors?.provider}
              value={values.provider}
              onValueChange={value => {
                setFieldValue('provider', value);
              }}
              onBlur={() => {
                setFieldTouched('provider', true);
              }}
              data={educationVariationCode}
              placeholder="Product"
            />

            <Input
              editable={false}
              value={values.provider?.amount}
              error={touched?.amount && errors?.amount}
              onChangeText={handleChange('amount')}
              onBlur={() => setFieldTouched('amount', true)}
              textColor={COLORS.blue}
              placeholder="0.0"
              backgroundColor="#EFF1FB"
            />
            <Input
              keyboardType="numeric"
              onPaste={value => {
                setValues({
                  ...values,
                  phone: value,
                });
              }}
              value={values.phone}
              error={touched?.phone && errors?.phone}
              onChangeText={handleChange('phone')}
              onBlur={() => setFieldTouched('phone', true)}
              placeholder="0.0"
            />
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <BillsBalance />
            </View>
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
