import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {COLORS, FONTS} from '../../../../conts';
import {
  Button,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';

import {BackNav} from '../../../components/layouts';
import {useUser} from '../../../../hooks';
import * as yup from 'yup';
import {useFormik} from 'formik';

const validationSchema = yup.object().shape({
  password: yup.string().required('Please input password'),
});

export const ResetPinPasswordScreen = ({navigation, route}) => {
  const {proceed = () => {}} = route?.params || {};
  const {settings} = useUser();
  const [state, setState] = React.useState({});

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
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      navigation.navigate('SetPinScreen', {
        type: 'reset',
        password: values?.password,
      });
    },
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <BackNav />

      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 30,
          minHeight: '100%',
          paddingBottom: 20,
        }}>
        <View>
          <Text bd size={35} textAlign="left" style={{paddingTop: 50}}>
            Enter Password
          </Text>

          <Text
            lineHeight={'22'}
            style={{marginTop: 30, marginBottom: 40}}
            color={'#3D3A3B'}
            size={16}>
            Please enter your Password so we are can help you create a new pin.
          </Text>

          <Input
            password
            placeholder="Enter Password"
            value={values.password}
            error={touched?.password && errors?.password}
            onChangeText={value => {
              setFieldValue('password', value);
            }}
            onFocus={() => {}}
            onBlur={() => setFieldTouched('password', true)}
          />
        </View>
        {/* Inputs Section */}
        <View style={{marginTop: 30, height: 220}}>
          <Button
            type={state?.buttonDisabled ? 'grey' : 'primary'}
            onPress={() => {
              submitForm();
            }}
            style={{marginTop: 40}}
            title={'Continue'}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  iconCon: {
    height: s(29),
    width: s(29),
    backgroundColor: '#402274',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 230,
    height: 60,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
});
