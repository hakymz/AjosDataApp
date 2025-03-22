import {useFormik} from 'formik';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {
  Button,
  CustomSafeAreaView,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../../components/general';
import {AppNav, MainHeader} from '../../../components/layouts';
import * as yup from 'yup';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {PageList} from '../../../components/lists';

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
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <MainHeader
        backgroundColor={COLORS.white}
        nav
        title={<></>}
        icon={<Icons.Unlock size={30} />}
      />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{paddingTop: 20, paddingHorizontal: 20}}>
        <Text size={18} bold color={COLORS.darkBlue}>
          Security
        </Text>
        <Text
          style={{marginTop: 5, marginBottom: 25}}
          size={12}
          medium
          color={'#979797'}>
          You can change or reset your password or PIN to enable a safer app
          experience
        </Text>
        <PageList rightIcon={<></>}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icons.Lock />
            <Text style={{marginLeft: 8}} size={14} semiBold>
              Change Password
            </Text>
          </View>
        </PageList>
        <View style={{marginTop: 30}}>
          <Text
            style={{marginTop: 5, marginBottom: 16}}
            size={12}
            medium
            color={'#898A8D'}>
            Please use a strong password you can remember
          </Text>
          <Input
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

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            title={'Save New Password'}
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
