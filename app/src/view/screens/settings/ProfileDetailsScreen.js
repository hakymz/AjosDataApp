import React from 'react';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';
import {AVATAR, COLORS} from '../../../conts';
import {Image, TouchableOpacity, View} from 'react-native';
import {useUser} from '../../../hooks';
import moment from 'moment';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {NoAddress} from '../../components/bottomSheetModal/modalContents';
import {fetchRequest} from '../../../helper';
import Toast from '../../components/toast/Toast';

let validationSchema = yup.object().shape({
  street: yup.string().required('Please enter street'),
  state: yup.string().required('Please enter state'),
  city: yup.string().required('Please enter city'),
  postal_code: yup.string().required('Please enter postal code'),
});
export const ProfileDetailsScreen = ({navigation}) => {
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
    initialValues: {
      phoneNumber: user?.phoneNumber,
      email: user?.email,
      street: user?.customer_address?.street,
      city: user?.customer_address?.city,
      state: user?.customer_address?.state,
      postal_code: user?.customer_address?.postal_code,
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      saveDetails(values);
    },
  });

  const saveDetails = async values => {
    try {
      const response = await fetchRequest({
        path: '/settings/update-address',
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
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}>
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
          </View>

          <View style={{marginTop: 20, alignItems: 'center'}}>
            <Text semiBold size={22} textAlign={'center'}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text
              style={{marginTop: 5}}
              color={'#848A94'}
              textAlign={'center'}
              size={12}>
              {user?.email}
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UpdateProfileScreen');
              }}
              style={{
                height: 25,
                borderWidth: 1,
                borderColor: COLORS.primary,
                borderRadius: 8,
                justifyContent: 'center',
                paddingHorizontal: 13,
                marginTop: 10,
              }}>
              <Text size={12} bold>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <Input editable={false} value={user?.phoneNumber} />
          <Text style={{marginBottom: 10}} size={12} color={'#898A8D'}>
            Date of Registration
          </Text>
          <Input
            editable={false}
            value={moment(data?.user?.created_at).format('DD - MMM - YYYY')}
          />

          <>
            <Text style={{marginBottom: 10}} size={12} color={'#898A8D'}>
              Address
            </Text>
            <Input
              value={values.street}
              error={touched?.street && errors?.street}
              onChangeText={handleChange('street')}
              onBlur={() => setFieldTouched('street', true)}
              placeholder="Street"
              rightIcon={<Icons.PenCircle size={30} />}
            />
            <Input
              value={values.city}
              error={touched?.city && errors?.city}
              onChangeText={handleChange('city')}
              onBlur={() => setFieldTouched('city', true)}
              placeholder="City"
              rightIcon={<Icons.PenCircle size={30} />}
            />
            <Input
              value={values.state}
              error={touched?.state && errors?.state}
              onChangeText={handleChange('state')}
              onBlur={() => setFieldTouched('state', true)}
              placeholder="State"
              rightIcon={<Icons.PenCircle size={30} />}
            />
            <Input
              value={values.postal_code}
              error={touched?.postal_code && errors?.postal_code}
              onChangeText={handleChange('postal_code')}
              onBlur={() => setFieldTouched('postal_code', true)}
              placeholder="Postal code"
              rightIcon={<Icons.PenCircle size={30} />}
            />

            <View style={{flex: 1, marginTop: 20, justifyContent: 'flex-end'}}>
              <Button title={'Save Details'} onPress={submitForm} />
            </View>
          </>
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
