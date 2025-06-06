import React from 'react';
import {View, StatusBar, SafeAreaView, Keyboard, Image} from 'react-native';
import {COLORS} from '../../../conts';
import {
  BottomSheets,
  Button,
  CheckBox,
  CircleButton,
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
import {AppNav} from '../../components/layouts';
import {useLayouts, useUser} from '../../../hooks';
import {GenderPopup} from '../../components/auth';
import Toast from '../../components/toast/Toast';
import {fetchRequest, openBrowser, openLink} from '../../../helper';
import {TermsAndCondition} from '../../components/bottomSheetModal/content';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please input email')
    .email('Please input a valid email'),
});
export const SignUpEmailScreen = ({navigation, route}) => {
  const data = route?.params || {};
  console.log(data?.phone);

  const [state, setState] = React.useState({
    isChecked: true,
    buttonDisabled: true,
    gender: 'Male',
  });

  const signUp = async () => {
    // Reg user
    try {
      const response = await fetchRequest({
        path: '/auth/register',
        data: {
          email: values?.email,
          ...data,
          phoneNumber: `+234${data?.phone}`,
        },
        pageError: {
          navigation,
          proceed: signUp,
        },
      });

      if (response.status == 'success' && response?.data) {
        navigation.navigate('OtpScreen', {
          ...data,
          ...values,
          _id: response?.data?._id,
        });
      } else {
        Toast.show('error', response?.message);
      }
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
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      fullName: '',
      username: '',
    },
    validationSchema,
    onSubmit: values => {
      signUp();
    },
  });

  React.useEffect(() => {
    if (values.email && isValid) {
      setState(prevState => ({...prevState, buttonDisabled: false}));
    } else {
      setState(prevState => ({...prevState, buttonDisabled: true}));
    }
  }, [values, isValid]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          minHeight: '100%',
          paddingBottom: 20,
        }}>
        <View>
          <CircleButton />
          <Text
            semiBold
            color={COLORS.darkBlue}
            size={25}
            style={{paddingTop: 30}}>
            Validate your Email
          </Text>
          <Text style={{marginTop: 10}} color={'#868D95'} size={14}>
            Please enter a valid Email Address so we can verify you.
          </Text>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 30}}>
          <View>
            <Input
              placeholder="Email address"
              value={values.email}
              error={touched?.email && errors?.email}
              onChangeText={value => {
                setFieldValue('email', value?.trim?.());
              }}
              onBlur={() => setFieldTouched('email', true)}
            />
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Image
            style={{height: 222, width: 222}}
            source={require('../../../assets/images/others/validateEmail.png')}
          />
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            title="Continue"
            onPress={() => {
              submitForm();
              Keyboard.dismiss();
              navigation.navigate('OtpScreen');
            }}
          />
          <View style={{marginTop: 30}}>
            <Text
              onPress={() => {
                navigation.navigate('SignInScreen');
              }}
              size={14}
              textAlign={'center'}
              color={'#848A94'}>
              Have an Account?{' '}
              <Text size={14} color={COLORS.primary}>
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
