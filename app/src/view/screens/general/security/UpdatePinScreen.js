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
  Text,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';
import * as yup from 'yup';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {PageList} from '../../../components/lists';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Enter current password')
    .min(8, 'Min length of 8'),
  newPin: yup.string().required('Enter new pin').min(4, 'Min length of 4'),
  confirmPin: yup
    .string()
    .required('Confirm pin')
    .oneOf([yup.ref('newPin'), null], 'Passwords must match'),
});
export const UpdatePinScreen = ({navigation}) => {
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
      confirmPin: '',
      newPin: '',
    },
    validationSchema,
    onSubmit: values => {
      updatePassword(values);
    },
  });

  const updatePassword = async values => {
    try {
      const response = await fetchRequest({
        path: 'settings/reset-transaction-pin',
        data: {
          newPin: values?.newPin,
          password: values?.password,
          confirmPin: values?.confirmPin,
        },
      });

      openSuccessScreen({
        navigation,
        title: 'Pin Saved successfully',
        subTitle: 'You can go ahead use this for transaction... 👌',
        btnTitle: 'Head back to Settings',
        indicatorWidth: null,
        proceed: () => {
          navigation.goBack();
          navigation.goBack();
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
              Reset Pin
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
            maxLength={4}
            password
            placeholder="Enter New Pin"
            value={values.newPin}
            error={touched?.newPin && errors?.newPin}
            onChangeText={value => {
              setFieldValue('newPin', value);
            }}
            onFocus={() => {}}
            onBlur={() => setFieldTouched('newPin', true)}
          />
          <Input
            maxLength={4}
            password
            placeholder="Confirm Pin"
            value={values.confirmPin}
            error={touched?.confirmPin && errors?.confirmPin}
            onChangeText={value => {
              setFieldValue('confirmPin', value);
            }}
            onFocus={() => {}}
            onBlur={() => setFieldTouched('confirmPin', true)}
          />
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            title={'Save New Pin'}
            disabled={!isValid || !values}
            textColor={'white'}
            type={
              isValid &&
              values?.password &&
              values?.newPin &&
              values?.confirmPin
                ? 'primary'
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
