import React from 'react';
import {View, Keyboard} from 'react-native';
import {BottomSheets, Button, PageInput, Text} from '../../general';

import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {GENERAL} from '../../../../conts';
import {fetchRequest} from '../../../../helper';

const validationSchema = yup.object().shape({
  number: yup.number().required('Please input phone no'),
});

export const AddNumberDataToCash = ({}) => {
  const navigation = useNavigation();

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
      number: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      BottomSheets.hide();
      sendLink(values);
    },
  });

  const sendLink = async values => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/reseller/sim-linking',
        data: {
          phoneNumber: values?.number,
        },
      });

      navigation.navigate('OtpScreenDataToCash', {phone: values?.number});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{paddingHorizontal: 24, paddingBottom: 20}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Add New Number
      </Text>
      <Text style={{marginTop: 20}} size={12} color={'#828282'}>
        You can ADD any MTN number of your choice and verify the line to enable
        our unique sim-link.
      </Text>

      <View style={{marginTop: 20}}>
        <PageInput
          keyboardType={'numeric'}
          handleScroll={GENERAL.platform == 'ios'}
          showTextError={true}
          // handleScroll
          placeholder="Phone number"
          value={values.number}
          error={touched?.number && errors?.number}
          onChangeText={handleChange('number')}
          onBlur={() => {
            setFieldTouched('number', true);
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 40}}>
          <Button
            onPress={() => {
              BottomSheets.hide();
            }}
            fontSize={14}
            type="lightGrey"
            style={{width: 122, marginRight: 10, paddingHorizontal: 0}}
            title={'Cancel'}
          />
          <Button
            onPress={() => {
              Keyboard.dismiss();
              submitForm();
            }}
            fontSize={14}
            style={{width: 'auto', flex: 1, paddingHorizontal: 0}}
            title={'Request Sim Link'}
          />
        </View>
      </View>
    </View>
  );
};
