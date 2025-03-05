import React from 'react';
import {View, StatusBar, SafeAreaView, Keyboard} from 'react-native';
import {COLORS} from '../../../conts';
import {
  BottomSheets,
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
          paddingHorizontal: 30,
          minHeight: '100%',
          paddingBottom: 20,
        }}>
        <View>
          <Text bd size={35} textAlign="left" style={{paddingTop: 30}}>
            Register
          </Text>
          <Text
            lineHeight={'22'}
            style={{marginTop: 30}}
            color={'#3D3A3B'}
            size={16}>
            Please enter a valid{' '}
            <Text
              lineHeight={'22'}
              color={'#3D3A3B'}
              size={16}
              fontWeight={'700'}>
              {' '}
              Email Address
            </Text>{' '}
            so we can verify you.
          </Text>
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 30, height: 300}}>
          <View>
            <Text size={16} fontWeight="700" style={{marginBottom: 12}}>
              Enter your Email Address
            </Text>
            <Input
              backgroundColor="#EFF1FB"
              placeholder="Enter Email Address"
              value={values.email}
              error={touched?.email && errors?.email}
              onChangeText={value => {
                setFieldValue('email', value?.trim?.());
              }}
              onBlur={() => setFieldTouched('email', true)}
            />
          </View>
        </View>

        <View>
          <Button
            // disabled={state.buttonDisabled}
            titleStyle={{color: COLORS.white}}
            type={state?.buttonDisabled ? 'grey' : 'primary'}
            title="Register"
            onPress={() => {
              submitForm();
              Keyboard.dismiss();
            }}
          />
          <View style={{marginTop: 10}}>
            <OrLine />
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <SocialButton title={'GOOGLE'} />
            <View style={{width: 15}} />
            <SocialButton
              title={'FACEBOOK'}
              style={{backgroundColor: '#F5F6FA'}}
            />
          </View>

          <View style={{marginTop: 70}}>
            <Text fontWeight={'700'} color={'#151940'}>
              Already have an account?
            </Text>
            <View
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
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
