import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Button, Input, Text} from '../../general';
import {useNavigation} from '@react-navigation/native';
import {fetchRequest} from '../../../../helper';
import {COLORS, FONTS, GENERAL, IMAGES} from '../../../../conts';
import {useFormik} from 'formik';
import * as yup from 'yup';

import {BillsBalance} from '../../layouts';
import Toast from '../../toast/Toast';
import {useQueryClient} from 'react-query';
import {useUser} from '../../../../hooks';

let validationSchema;
export const TopupDollarCard = ({card}) => {
  const navigation = useNavigation();
  const queryClients = useQueryClient();
  const {getAndUpdateUserData} = useUser();

  validationSchema = yup.object().shape({
    amount: yup.string().required('Please input amount'),
  });
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    handleChange,
    validateField,
    setValues,
    submitForm,
    resetForm,
    isValid,
    validateForm,
  } = useFormik({
    initialValues: {amount: ''},
    validationSchema: validationSchema,
    onSubmit: values => {
      BottomSheets.hide();
      navigation.navigate('PinScreen', {
        proceed: pin => {
          addFunds?.(pin);
        },
      });
    },
  });

  const addFunds = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: 'virtual-card/topup',
        data: {
          amount: values?.amount,
          cardId: card?.id,
          transactionPin,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });
      queryClients.invalidateQueries({queryKey: [card?.id]});
      Toast.show('success', 'Topup was successful.');

      getAndUpdateUserData();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <View>
      <View style={{paddingHorizontal: 20}}>
        <Text bold size={22} textAlign={'center'}>
          Add-funds to Card
        </Text>
        <Text
          style={{paddingHorizontal: 20}}
          color={'#868D95'}
          size={14}
          textAlign={'center'}>
          Fill in the required info to allow us proceed
        </Text>
      </View>

      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 20,
          marginBottom: 0,
        }}>
        <Input
          currency="$"
          value={values.amount}
          error={touched?.amount && errors?.amount}
          onChangeText={value => setFieldValue('amount', value)}
          onBlur={() => setFieldTouched('amount', true)}
          placeholder="0.0"
          inputStyle={{
            textAlign: 'right',
            color: COLORS.darkBlue,
            fontSize: 16,
            fontFamily: FONTS.PLUS_JAKARTA_SANS_FONTS.bold,
            flex: 0,
          }}
          currencyInput
          leftIcon={
            <View
              style={{
                height: 36,
                width: 72,
                backgroundColor: 'rgba(221, 221, 221, 0.5)',
                borderRadius: 18,
                left: -10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{height: 20, width: 20, marginRight: 5}}
                source={IMAGES.usaLogo}
              />
              <Text size={12} medium color={'#231F20'}>
                USD
              </Text>
            </View>
          }
          style={{height: 56}}
        />
        <Text
          size={12}
          semiBold
          textAlign={'right'}
          style={{opacity: 0.5}}
          color={COLORS.black}>
          Conversion rate: $1 = ₦1,750{' '}
        </Text>
        <Text
          size={12}
          semiBold
          textAlign={'right'}
          style={{opacity: 0.5, marginBottom: 20}}
          color={COLORS.black}>
          Conversion fee: 1%
        </Text>
        <Input
          editable={false}
          currency={GENERAL.nairaSign}
          value={values.amount}
          // error={touched?.amount && errors?.amount}
          placeholder="0.0"
          inputStyle={{
            textAlign: 'right',
            color: COLORS.darkBlue,
            fontSize: 16,
            fontFamily: FONTS.PLUS_JAKARTA_SANS_FONTS.bold,
            flex: 0,
          }}
          currencyInput
          leftIcon={
            <View
              style={{
                height: 36,
                width: 72,
                backgroundColor: 'rgba(221, 221, 221, 0.5)',
                borderRadius: 18,
                left: -10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{height: 20, width: 20, marginRight: 5}}
                source={IMAGES.ngLogo}
              />
              <Text size={12} medium color={'#231F20'}>
                NGN
              </Text>
            </View>
          }
          style={{height: 56}}
        />
        <View style={{alignItems: 'flex-end'}}>
          <BillsBalance style={{marginHorizontal: 0}} />
        </View>

        <Button
          onPress={submitForm}
          style={{marginTop: 30}}
          title={'Add Funds'}
        />
      </View>
    </View>
  );
};
