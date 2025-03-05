import React from 'react';
import {Image, View} from 'react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {
  BigInput,
  BottomSheets,
  Button,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../general';
import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {AccountDetails} from './AccountDetails';
const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .required('Please input amount')
    .max(1000, 'Daily limit is $1,000'),
});
export const UsdTopup = ({currency}) => {
  const navigation = useNavigation();

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    submitForm,
    handleSubmit,
    isValid,
  } = useFormik({
    initialValues: {amount: ''},
    validationSchema: validationSchema,

    onSubmit: values => {
      BottomSheets.show({
        component: (
          <AccountDetails amount={values?.amount} currency={currency} />
        ),
        customSnapPoints: ['85%', '85%'],
      });
    },
  });
  return (
    <KeyboardAvoidingViewWrapper
      contentContainerStyle={{paddingHorizontal: 30, marginBottom: 30}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 15,
        }}>
        <Text bold color={COLORS.primary} lineHeight={25} size={20}>
          Enter Amount
        </Text>
      </View>
      <Text
        style={{marginBottom: 20}}
        size={14}
        color={'#666766'}
        lineHeight={18}>
        Please enter how much you want to receive
      </Text>
      <BigInput
        currencyLogoBackground={{active: COLORS.black, blur: COLORS.black}}
        currencyLogoColor={{active: COLORS.white, blur: COLORS.white}}
        showCurrencyLogo
        onChangeText={value => {
          setFieldValue('amount', value);
        }}
        onBlur={() => setFieldTouched('amount', true)}
        value={values?.amount}
        error={touched?.amount && errors?.amount}
        currency={'USD'}
        textColor={{
          active: COLORS.black,
          blur: COLORS.inputGrey,
          placeholderTextColor: COLORS.inputGrey,
        }}
        backgroundColor={{
          active: COLORS.background,
          blur: COLORS.background,
        }}
        placeholder="0"
        title={'How much?'}
        type="background"
      />

      <View style={{paddingHorizontal: 15, marginTop: 40}}>
        <Button
          type="black"
          title={'Proceed'}
          onPress={() => {
            handleSubmit();
          }}
        />
      </View>
    </KeyboardAvoidingViewWrapper>
  );
};
