import {useFormik} from 'formik';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {
  Button,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import * as yup from 'yup';
import {fetchRequest, openSuccessScreen} from '../../../../helper';

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
export const UpdatePasswordScreen = ({navigation}) => {
  const {
    values,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
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

  const updatePassword = async values => {
    try {
      const response = await fetchRequest({
        path: 'settings/change-password',
        data: {
          oldPassword: values?.password,
          password: values?.newPassword,
          confirmPassword: values?.newPassword,
        },
        method: 'PATCH',
      });

      openSuccessScreen({
        navigation,
        title: 'Password Saved successfully',
        subTitle: 'You can go ahead use this to Login... 👌',
        btnTitle: 'Head back to Settings',
        indicatorWidth: null,
        proceed: () => {
          navigation.navigate('SettingsScreen');
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CustomSafeAreaView>
      <AppNav title={'Security'} line />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{paddingTop: 30}}>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <View style={style.iconCon}>
            <MyIcons.LockCardGreen size={22} />
          </View>
          <Text semiBold>Change Password</Text>
        </View>
        <View style={{paddingHorizontal: 30, marginTop: 30}}>
          <Input
            style={{marginBottom: 20}}
            password
            placeholder="Enter Current Password"
            value={values.password}
            error={touched?.password && errors?.password}
            onChangeText={value => {
              setFieldValue('password', value);
            }}
            onFocus={() => {}}
            onBlur={() => setFieldTouched('password', true)}
          />
          <Input
            password
            placeholder="Enter New Password"
            value={values.newPassword}
            error={touched?.newPassword && errors?.newPassword}
            onChangeText={value => {
              setFieldValue('newPassword', value);
            }}
            onFocus={() => {}}
            onBlur={() => setFieldTouched('newPassword', true)}
          />
          <Input
            password
            placeholder="Confirm Password"
            value={values.confirmPassword}
            error={touched?.confirmPassword && errors?.confirmPassword}
            onChangeText={value => {
              setFieldValue('confirmPassword', value);
            }}
            onFocus={() => {}}
            onBlur={() => setFieldTouched('confirmPassword', true)}
          />
        </View>

        <View
          style={{paddingHorizontal: 30, flex: 1, justifyContent: 'flex-end'}}>
          <Button
            title={'Save'}
            disabled={!isValid || !values}
            textColor={'white'}
            type={
              isValid &&
              values?.password &&
              values?.newPassword &&
              values?.confirmPassword
                ? 'black'
                : 'grey'
            }
            onPress={() => {
              // Keyboard.dismiss();
              // submitForm.current();
              handleSubmit();
            }}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  iconCon: {
    height: s(40),
    width: s(40),
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginRight: 10,
  },
});
