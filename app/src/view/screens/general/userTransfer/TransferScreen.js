import {useFormik} from 'formik';
import React from 'react';
import {
  BigInput,
  Button,
  CustomSafeAreaView,
  FeeContainer,
  KeyboardAvoidingViewWrapper,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import * as yup from 'yup';
import {COLORS, GENERAL} from '../../../../conts';
import {useLayouts} from '../../../../hooks';
import {View} from 'react-native';

const validationSchema = yup.object().shape({
  amount: yup.number().required('Please input amount'),
});

export const TransferScreen = ({navigation}) => {
  const [disableButton, setDisbleButton] = React.useState(false);
  const {minHeight} = useLayouts();
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
      navigation.navigate('TransferNextScreen', {
        amount: values?.amount,
      });
    },
  });
  return (
    <CustomSafeAreaView>
      <AppNav title={'User - User transfer'} line />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          minHeight: minHeight - 80,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
        }}>
        <BigInput
          currencyLogoBackground={{active: COLORS.black, blur: COLORS.black}}
          currencyLogoColor={{active: COLORS.white, blur: COLORS.white}}
          showCurrencyLogo
          onChangeText={value => setFieldValue('amount', value)}
          onBlur={() => setFieldTouched('amount', true)}
          value={values?.amount}
          error={touched?.amount && errors?.amount}
          currency
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
          title={'How much'}
          type="background"
        />
        <FeeContainer fee={0} style={{marginHorizontal: 20}} />

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: 40,
            paddingHorizontal: 30,
          }}>
          <Button
            // disabled={disableButton}
            textColor={'white'}
            type={values.amount && isValid ? 'black' : 'grey'}
            onPress={() => {
              // Keyboard.dismiss();
              // submitForm.current();
              handleSubmit();
            }}
            title="Continue"
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
