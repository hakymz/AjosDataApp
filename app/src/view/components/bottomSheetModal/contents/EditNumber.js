import React from 'react';
import {View, Image, TouchableOpacity, Keyboard} from 'react-native';
import {BottomSheets, Button, Icons, PageInput, Text} from '../../general';

import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {GENERAL} from '../../../../conts';

const validationSchema = yup.object().shape({
  number: yup.number().required('Please input phone no'),
});

export const EditNumber = ({
  number,
  saveUserNumber = () => {},
  deleteNumber,
}) => {
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
      number: number,
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      BottomSheets.hide();
      saveUserNumber(values?.number);
    },
  });

  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Edit Numbers
      </Text>

      <View
        style={{
          height: 225,
          backgroundColor: '#EFF1FB',
          marginTop: 20,
          borderRadius: 8,
          paddingTop: 15,
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', paddingHorizontal: 5}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#DCE0F0',
              justifyContent: 'center',
              height: 29,
              borderRadius: 8,
              paddingHorizontal: 7,
              marginRight: 5,
              marginBottom: 3,
              alignItems: 'center',
            }}>
            <Text
              numberOfLines={1}
              color={'#4961AC'}
              size={15}
              fontWeight={500}>
              {number}
            </Text>
          </TouchableOpacity>
          <View
            style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
            <Text md size={14} color={'#000000'}>
              Selected Number
            </Text>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <PageInput
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

          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={() => {
                deleteNumber();
                BottomSheets.hide();
              }}
              fontSize={14}
              type="white"
              style={{width: 122, marginRight: 10, paddingHorizontal: 0}}
              title={'Delete'}
            />
            <Button
              onPress={() => {
                Keyboard.dismiss();
                submitForm();
              }}
              fontSize={14}
              style={{width: 'auto', flex: 1, paddingHorizontal: 0}}
              title={'Save Number'}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
