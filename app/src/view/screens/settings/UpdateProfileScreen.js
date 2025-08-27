import React from 'react';
import {
  Button,
  CustomSafeAreaView,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';
import {AVATAR, COLORS} from '../../../conts';
import {Image, View} from 'react-native';
import {useUser} from '../../../hooks';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {fetchRequest} from '../../../helper';
import Toast from '../../components/toast/Toast';

let validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Please input phone no')
    .max(11, 'Max length of 11 digits'),
  email: yup.string().required('Please email'),
});

export const UpdateProfileScreen = () => {
  const {data, user, getAndUpdateUserData} = useUser();
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    handleChange,
    validateField,
    setValues,
    submitForm,
    resetForm,
    isValid,
    validateForm,
  } = useFormik({
    initialValues: {phoneNumber: user?.phoneNumber, email: user?.email},
    validationSchema: validationSchema,
    onSubmit: values => {
      saveDetails(values);
    },
  });

  const saveDetails = async values => {
    try {
      const response = await fetchRequest({
        path: '/settings/profile/edit',
        method: 'PATCH',
        data: {
          ...values,
        },
      });

      Toast.show('success', 'Details updated.');
      getAndUpdateUserData();
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
        icon={<Icons.UserTag size={30} />}
      />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}>
        <Text size={18} bold color={COLORS.darkBlue}>
          Account Details
        </Text>
        <Text style={{marginTop: 5}} size={12} medium color={'#979797'}>
          These are the hottest deals at the moment. A lower “%” means the deal
          has little attention on it.
        </Text>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <View style={{}}>
            <Image style={{height: 100, width: 100}} source={AVATAR.avatar3} />
            <View style={{position: 'absolute', right: -35, bottom: 10}}>
              <Icons.PenCircle size={37} />
            </View>
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <Input editable={false} value={user?.firstName} />

          <Input editable={false} value={user?.lastName} />

          <Input
            keyboardType="numeric"
            value={values.email}
            error={touched?.email && errors?.email}
            onChangeText={handleChange('email')}
            onBlur={() => setFieldTouched('email', true)}
            placeholder="Email"
            rightIcon={<Icons.PenCircle size={30} />}
          />
          <Input
            keyboardType="numeric"
            value={values.phoneNumber}
            error={touched?.phoneNumber && errors?.phoneNumber}
            onChangeText={handleChange('phoneNumber')}
            onBlur={() => setFieldTouched('phoneNumber', true)}
            placeholder="Phone Number"
            rightIcon={<Icons.PenCircle size={30} />}
          />
        </View>

        <View style={{flex: 1, marginTop: 20, justifyContent: 'flex-end'}}>
          <Button title={'Save Details'} onPress={submitForm} />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
