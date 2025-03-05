import React from 'react';
import {View} from 'react-native';
import {BottomSheets, Button, PageInput, Text} from '../../general';
import {useFormik} from 'formik';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Enter current password')
    .min(8, 'Min length of 8'),
  newPassword: yup
    .string()
    .required('Enter new password')
    .min(8, 'Min length of 8'),
  confirmPassword: yup
    .string()
    .required('Confirm password')
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

export const ChangePassword = ({}) => {
  const navigation = useNavigation();
  const {
    values,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    submitForm,
    isValid,
  } = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: values => {
      updatePassword(values);
    },
  });
  console.log(errors);

  const updatePassword = async values => {
    try {
      const response = await fetchRequest({
        path: 'settings/change-password',
        data: {
          oldPassword: values?.password,
          password: values?.newPassword,
          confirmPassword: values?.newPassword,
        },
      });

      BottomSheets.hide();
      openSuccessScreen({
        navigation,
        title: 'Password Saved successfully',
        btnTitle: 'Head back to Profile',
        proceed: () => {
          navigation.navigate('ProfileScreen');
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Change Password
      </Text>

      <View
        style={{marginTop: 30, marginBottom: 25, paddingHorizontal: 20}}></View>

      <View>
        <PageInput
          showTextError={true}
          password
          placeholder="Enter Current Password"
          value={values.password}
          error={touched?.password && errors?.password}
          onChangeText={value => {
            console.log(value, 'yesss');
            setFieldValue('password', value);
          }}
          onBlur={() => setFieldTouched('password', true)}
        />
        <PageInput
          showTextError={true}
          password
          placeholder="Enter New Password"
          value={values.newPassword}
          error={touched?.newPassword && errors?.newPassword}
          onChangeText={value => {
            setFieldValue('newPassword', value);
          }}
          onBlur={() => setFieldTouched('newPassword', true)}
        />
        <PageInput
          showTextError={true}
          password
          placeholder="Re-type New Password"
          value={values.confirmPassword}
          error={touched?.confirmPassword && errors?.confirmPassword}
          onChangeText={value => {
            setFieldValue('confirmPassword', value);
          }}
          onBlur={() => setFieldTouched('confirmPassword', true)}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Button
          onPress={() => {
            submitForm();
          }}
          style={{flex: 1, marginTop: 30}}
          fontSize={14}
          title={'Save Password'}
        />
      </View>
    </View>
  );
};
