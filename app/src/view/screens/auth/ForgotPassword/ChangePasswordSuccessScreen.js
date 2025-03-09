import {SafeAreaView, View, StatusBar, Image} from 'react-native';
import React from 'react';
import {COLORS} from '../../../../conts';
import {
  Button,
  CircleButton,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';

import {useFormik} from 'formik';
import * as yup from 'yup';
import {Input} from '../../../components/general';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {BackNav} from '../../../components/layouts';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Please input password')
    .min(8, 'Min length of 8'),
  confirmPassword: yup
    .string()
    .required('Please confirm password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});
export const ChangePasswordSuccessScreen = ({navigation, route}) => {
  const {userId} = route?.params || {};

  const [state, setState] = React.useState({
    isChecked: true,
    buttonDisabled: true,
  });

  const changePassword = async value => {
    try {
      const response = await fetchRequest({
        path: '/auth/reset-password/',
        data: {...value, userId},
      });

      openSuccessScreen({
        navigation,
        title: 'Password Saved successfully',
        subTitle:
          'You can go ahead to Login... Take the new password for a spin, it has to work 🤣',
        btnTitle: 'Log into account',
        indicatorWidth: '',
        indicatorText: '',
        proceed: () => navigation.navigate('SignInScreen'),
      });
    } catch (error) {
      console.log(error);
    }
  };

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
    isValid,
  } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: values => {
      changePassword(values);
    },
  });

  React.useEffect(() => {
    if (values.password && isValid && values?.confirmPassword) {
      setState(prevState => ({...prevState, buttonDisabled: false}));
    } else {
      setState(prevState => ({...prevState, buttonDisabled: true}));
    }
  }, [values, state.isChecked, isValid]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        // bounces={false}
        addMinHeight
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}>
        <CircleButton />
        <View style={{marginTop: 0, flex: 1}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 60,
            }}>
            <Image
              style={{height: 241, width: 295}}
              source={require('../../../../assets/images/others/write.png')}
            />
          </View>

          <Text
            color={COLORS.darkBlue}
            semiBold
            size={25}
            style={{paddingTop: 30}}>
            Password{' '}
            <Text
              color={COLORS.darkBlue}
              bold
              size={25}
              style={{paddingTop: 40}}>
              Reset Done ✅
            </Text>
          </Text>

          <Text size={14} color={'#868D95'} style={{marginTop: 10}}>
            We have successfully created and saved a new password for you.
          </Text>

          <View style={{marginTop: 40, width: '100%', flex: 1}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  marginBottom: 20,
                  marginTop: 60,
                }}>
                <Button
                  titleStyle={{color: COLORS.white}}
                  onPress={() => {
                    submitForm();
                  }}
                  title="Log Me in"
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
