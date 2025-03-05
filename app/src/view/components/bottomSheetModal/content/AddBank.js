import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Formik} from 'formik';
import React from 'react';
import {View, Keyboard} from 'react-native';
import {COLORS, FONTS} from '../../../../conts';
import {usePayments} from '../../../../hooks';
import {Button, CustomPicker, Icons, Input, Text} from '../../general';
import * as yup from 'yup';
import {fetchRequest} from '../../../../helper';
import Toast from '../../toast/Toast';
import {BottomSheets} from '../BottomSheets';

const validationSchema = yup.object().shape({
  accountNumber: yup.number().required('Please input account number'),
  accountName: yup.string().required('Please input account name'),
  bank: yup.object().required('Please select bank'),
});

export const AddBank = ({title, details, proceed = () => {}, getDetails}) => {
  const [state, setState] = React.useState({
    selectedCard: null,
    accountName: '',
  });

  const {banks} = usePayments();
  const validateBank = async (accountNumber, bank, setFieldValue) => {
    if (accountNumber.length > 9) {
      try {
        const response = await fetchRequest({
          path: `bank/mybankinfo?accountNumber=${accountNumber}&bankCode=${bank?.code}`,
          method: 'GET',
          displayMessage: false,
          showLoader: false,
        });
        console.log(response);
        if (response.status == 'success' && response?.data) {
          setFieldValue('accountName', response?.data?.account_name);
        } else {
          setFieldValue('accountName', '');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setFieldValue('accountName', '');
    }
  };

  const addBank = async values => {
    if (getDetails) {
      getDetails(values);
      BottomSheets.hide();
    } else {
      try {
        const response = await fetchRequest({
          path: `bank/addbank`,
          method: 'POST',
          data: {
            accountNumber: values?.accountNumber,
            bankCode: values?.bank?.code,
          },
        });
        console.log(response);
        if (response.status == 'success' && response?.data) {
          Toast.show('success', response?.message);
          BottomSheets.hide();
          proceed();
        } else {
          Toast.show('error', response?.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={{height: '100%'}}>
      <View style={{paddingBottom: 10}}>
        <Text
          fontType={FONTS.FREDOKA_FONTS}
          color={COLORS.lightBlue}
          size={18}
          style={{textAlign: 'center'}}>
          {title || 'Withdraw'}
        </Text>
        <Text
          color={'#727272'}
          size={14}
          style={{
            textAlign: 'center',
            paddingTop: 30,
            paddingHorizontal: 40,
          }}>
          {details || 'You have no saved bank accounts, please add one below'}
        </Text>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          minHeight: '90%',
          paddingHorizontal: 20,
        }}>
        <Formik
          initialValues={{
            accountName: '',
            accountNumber: '',
            bank: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            addBank(values);
          }}>
          {({
            values,
            errors,
            handleChange,
            handleSubmit,
            touched,
            setFieldTouched,
            setFieldValue,
            setFieldError,
            setValues,
            status,
          }) => (
            <View style={{marginTop: 20, flex: 1}}>
              <CustomPicker
                data={banks}
                error={touched?.bank && errors?.bank}
                value={values.bank}
                placeholder="Select Bank"
                onValueChange={value => {
                  setState(prevState => ({
                    ...prevState,
                    amount: value?.variation_amount,
                  }));

                  setValues({
                    ...values,
                    bank: value,
                    accountNumber: '',
                  });
                }}
              />
              <Input
                keyboardType="numeric"
                value={values.accountNumber}
                error={touched?.accountNumber && errors?.accountNumber}
                onChangeText={value => {
                  setFieldValue('accountNumber', value);
                  validateBank(value, values.bank, setFieldValue);
                }}
                onBlur={() => setFieldTouched('accountNumber', true)}
                conStyle={{marginBottom: 10}}
                placeholder="Enter Account Number"
              />
              <Input
                editable={false}
                value={values.accountName}
                error={touched?.accountName && errors?.accountName}
                onChangeText={handleChange('accountName')}
                onBlur={() => setFieldTouched('accountName', true)}
                conStyle={{marginBottom: 10}}
                placeholder="Account Name"
              />
              <View
                style={{
                  flex: 1,
                  marginTop: 30,
                  justifyContent: 'flex-end',
                }}>
                <Button
                  onPress={() => {
                    handleSubmit();
                    Keyboard.dismiss();
                  }}
                  title="Save Account Details"
                  rightIcon={<Icons.CircleArrowYellow />}
                />
              </View>
            </View>
          )}
        </Formik>
      </BottomSheetScrollView>
    </View>
  );
};
