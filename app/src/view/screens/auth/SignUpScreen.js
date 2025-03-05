import React from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../../../conts';
import {
  Button,
  CheckBox,
  Icons,
  OrLine,
  SocialButton,
} from '../../components/general';
import {
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';

import {s} from 'react-native-size-matters';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useLayouts, useUser} from '../../../hooks';
import Toast from '../../components/toast/Toast';
import {fetchRequest, openLink} from '../../../helper';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('Please input first name'),
  lastName: yup.string().required('Please input last name'),
  confirmPassword: yup
    .string()
    .required('Please confirm password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  password: yup
    .string()
    .required('Please input password')
    .min(5, 'Min length of 5'),
  phone: yup.string().required('Please input phone number'),
});
export const SignUpScreen = ({navigation}) => {
  const [state, setState] = React.useState({
    isChecked: false,
    buttonDisabled: true,
    gender: 'Male',
  });
  const {minHeight} = useLayouts();

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
      phone: '',
      firstName: '',
      lastName: '',
      refCode: '',
    },
    validationSchema,
    onSubmit: values => {
      navigation.navigate('SignUpEmailScreen', {...values});
    },
  });

  React.useEffect(() => {
    if (
      values.firstName &&
      values.password &&
      values.phone &&
      values.lastName &&
      state.isChecked &&
      isValid
    ) {
      setState(prevState => ({...prevState, buttonDisabled: false}));
    } else {
      setState(prevState => ({...prevState, buttonDisabled: true}));
    }
  }, [values, state.isChecked, isValid]);

  React.useEffect(() => {}, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 30,
          minHeight: minHeight - s(95),
          paddingBottom: 20,
        }}>
        <View>
          <Text bd size={35} textAlign="left" style={{paddingTop: 30}}>
            Register
          </Text>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 15, marginBottom: 40, marginTop: 30}}>
          <View>
            <Input
              placeholder="First Name"
              value={values?.firstName}
              error={touched?.firstName && errors?.firstName}
              onChangeText={value => {
                setFieldValue('firstName', value);
              }}
              onBlur={() => setFieldTouched('firstName', true)}
            />

            <Input
              placeholder="Last Name"
              value={values?.lastName}
              error={touched?.lastName && errors?.lastName}
              onChangeText={value => {
                setFieldValue('lastName', value);
              }}
              onBlur={() => setFieldTouched('lastName', true)}
            />
            <Input
              keyboardType="numeric"
              placeholder="Phone number"
              value={values?.phone}
              error={touched?.phone && errors?.phone}
              onChangeText={value => {
                setFieldValue('phone', value);
              }}
              onBlur={() => setFieldTouched('phone', true)}
            />

            <Input
              password
              placeholder="Create Password"
              value={values?.password}
              error={touched?.password && errors?.password}
              onChangeText={value => {
                setFieldValue('password', value);
              }}
              onBlur={() => setFieldTouched('password', true)}
            />

            <Input
              password
              placeholder="Type Password again"
              value={values?.confirmPassword}
              error={touched?.confirmPassword && errors?.confirmPassword}
              onChangeText={value => {
                setFieldValue('confirmPassword', value);
              }}
              onBlur={() => setFieldTouched('confirmPassword', true)}
            />

            <Input
              textColor="#231F20"
              backgroundColor="#D7E4FF"
              placeholder="Referral code (optional)"
              value={values?.refCode}
              error={touched?.refCode && errors?.refCode}
              onChangeText={value => {
                setFieldValue('refCode', value);
              }}
              onBlur={() => setFieldTouched('refCode', true)}
            />

            <View
              style={{
                marginTop: 0,
                marginBottom: 30,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox
                isChecked={state.isChecked}
                onPress={() => {
                  setState(prevState => ({
                    ...prevState,
                    isChecked: !prevState.isChecked,
                  }));
                }}
              />
              <Text
                onPress={() => {
                  openLink('https://dataresell.com/privacy-policy');
                }}
                color={'#7F8192'}
                fontWeight={'500'}
                style={{paddingLeft: 10}}
                size={12}>
                I’ve read and agree to the{' '}
                <Text color={'#314BCE'} fontWeight={'500'} size={12}>
                  terms{' '}
                </Text>
                of{' '}
                <Text color={'#314BCE'} fontWeight={'500'} size={12}>
                  privacy policy
                </Text>
              </Text>
            </View>
            <Button
              style={{marginTop: 20}}
              disabled={state.buttonDisabled}
              titleStyle={{color: COLORS.white}}
              type={state?.buttonDisabled ? 'grey' : 'primary'}
              title="Register"
              onPress={() => {
                Keyboard.dismiss();
                submitForm();
                // navigation.navigate('SignUpEmailScreen');
              }}
            />
            <View style={{marginTop: 70}}>
              <Text fontWeight={'700'} color={'#151940'}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SignInScreen');
                }}
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{marginRight: 20}}
                  size={16}
                  fontWeight={'700'}
                  color={COLORS.primary}>
                  LOGIN
                </Text>
                <Icons.ArrowRed size={15} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
