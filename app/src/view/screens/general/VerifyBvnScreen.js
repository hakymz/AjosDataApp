import React from 'react';
import {View, Image, ScrollView, Keyboard} from 'react-native';

import {s} from 'react-native-size-matters';
import {AVATAR, COLORS, GENERAL} from '../../../conts';
import {
  Button,
  CircleButton,
  CustomSafeAreaView,
  Icons,
  Input,
  PageInput,
  Text,
} from '../../components/general';
import {Formik} from 'formik';
import * as yup from 'yup';
import {PageList} from '../../components/lists';
import {useUser} from '../../../hooks';
import CustomDatePicker from '../../components/general/inputs/DatePicker';
import Toast from '../../components/toast/Toast';
import {fetchRequest} from '../../../helper';
import {TransactionStatusModal} from '../../components/bottomSheetModal';
import moment from 'moment';

const validationSchema = yup.object().shape({
  bvn: yup.number().required('Please input BVN'),
  dob: yup.string().required('Date of birth'),
});

export const VerifyBvnScreen = ({navigation, route}) => {
  const [verify, setVerify] = React.useState('phoneNumber');

  const {data, getAndUpdateUserData} = useUser();
  React.useEffect(() => {
    if (data?.user?.isVerified?.[0]?.phoneNumber == false) {
      setVerify('phoneNumber');
    } else if (data?.user?.isVerified?.[0]?.bankVerification == false) {
      setVerify('bvn');
    } else {
      setVerify(null);
    }
  }, [data?.user?.isVerified]);

  const verifyBvn = async values => {
    const dob = moment(values?.dob, 'DD/MMM/yyyy').format('DD-MMM-yyyy');

    try {
      const response = await fetchRequest({
        path: '/user/leveltiers/verify-bvn',
        data: {
          ...values,
          dob,
        },
      });

      if (response.status == 'success' && response?.data) {
        Toast.show('success', response?.message);
        setVerify(null);
        getAndUpdateUserData();
      } else {
        TransactionStatusModal({type: 'error', message: response?.message});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPhone = async code => {
    try {
      const response = await fetchRequest({
        path: '/user/leveltiers/verify-phone',
        data: {
          code,
        },
      });

      if (response.status == 'success' && response?.data) {
        Toast.show('success', response?.message);
        setVerify('bvn');
      } else {
        TransactionStatusModal({type: 'error', message: response?.message});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const detailsText =
    verify == 'phoneNumber'
      ? 'Before the next Verification stage you need to Verify your Phone Number'
      : 'Please ensure you have the correct BVN bearing your name, If any form of FRAUD is discovered we will terminate this account.';

  return (
    <CustomSafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        {/* <CircleButton onPress={() => navigation.goBack()} /> */}
      </View>
      <View
        style={{
          height: s(55),
          backgroundColor: '#FAFAFA',
          marginTop: 20,
          marginHorizontal: 40,
          borderRadius: 50,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text color={COLORS.voodoo} size={14} medium>
          Verification
        </Text>
        {/* <Icons.PersonBlue size={35} /> */}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: GENERAL.platform == 'ios' ? 80 : 100,
          minHeight: '90%',
        }}>
        <Formik
          initialValues={{
            bvn: data?.user?.bvn == 'NULL' ? '' : data?.user?.bvn,
            dob: '',
            phoneNumber: data?.user?.phoneNumber,
            firstName: data?.user?.firstName,
            lastName: data?.user?.lastName,
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            verifyBvn(values);
          }}>
          {({
            values,
            errors,
            handleChange,
            handleSubmit,
            touched,
            setFieldTouched,
            setFieldValue,
            setFieldError,
            setValues,
            status,
          }) => (
            <View style={{flex: 1}}>
              {verify == 'phoneNumber' && (
                <PageInput
                  value={values.phoneNumber}
                  error={touched?.phoneNumber && errors?.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={() => setFieldTouched('phoneNumber', true)}
                  placeholder="Enter Phone Number"
                  backgroundColor={'#F7F7F9'}
                  textColor={COLORS.voodoo}
                  keyboardType="numeric"
                />
              )}

              {(verify == null || verify == 'bvn') && (
                <PageInput
                  editable={verify != null}
                  keyboardType="numeric"
                  value={values.bvn}
                  error={touched?.bvn && errors?.bvn}
                  onChangeText={handleChange('bvn')}
                  onBlur={() => setFieldTouched('bvn', true)}
                  placeholder="Enter BVN"
                  backgroundColor={!verify ? '#D8ECDD' : '#F7F7F9'}
                  textColor={!verify ? COLORS?.green : COLORS.voodoo}
                />
              )}

              {verify == 'bvn' && (
                <>
                  <View
                    style={{
                      backgroundColor: '#F7F7F9',
                      height: s(170),
                      borderRadius: 15,
                      justifyContent: 'center',
                      paddingHorizontal: 20,
                      marginBottom: 10,
                    }}>
                    <Input
                      border={false}
                      value={values?.firstName}
                      error={touched?.firstName && errors?.firstName}
                      onChangeText={handleChange('firstName')}
                      onBlur={() => setFieldTouched('firstName', true)}
                      placeholder="First Name"
                      backgroundColor={COLORS.white}
                      textColor={!verify ? COLORS?.green : COLORS.voodoo}
                      conStyle={{marginBottom: 0}}
                    />
                    <Input
                      border={false}
                      value={values.lastName}
                      error={touched?.lastName && errors?.lastName}
                      onChangeText={handleChange('lastName')}
                      onBlur={() => setFieldTouched('lastName', true)}
                      placeholder="Last Name"
                      backgroundColor={COLORS.white}
                      textColor={!verify ? COLORS?.green : COLORS.voodoo}
                      conStyle={{marginBottom: 0, marginTop: 10}}
                    />
                  </View>

                  <PageList
                    backgroundColor={errors?.dob ? '#FFF0F1' : '#F7F7F9'}>
                    <CustomDatePicker
                      border={false}
                      error={touched?.dob && errors?.dob}
                      defaultDate={values?.dob}
                      placeholder="Date of birth"
                      onValueChange={value => {
                        console.log(value, ' value....');
                        setFieldValue('dob', value);
                      }}
                      conStyle={{marginBottom: 0}}
                      rightIcon={<Icons.Calender />}
                    />
                  </PageList>
                </>
              )}

              <View
                style={{
                  paddingHorizontal: 10,
                  marginTop: 20,
                  flexDirection: 'row',
                }}>
                <Image
                  source={AVATAR.boy1}
                  style={{height: s(68), width: s(68), resizeMode: 'contain'}}
                />
                <Text
                  lineHeight={14}
                  color={COLORS.primary}
                  size={12}
                  style={{flex: 1, marginLeft: 10}}>
                  {detailsText}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  paddingBottom: 40,
                  paddingHorizontal: 20,
                  marginTop: 20,
                }}>
                <Button
                  onPress={() => {
                    if (verify == 'phoneNumber') {
                      navigation.navigate('SetPinScreen', {
                        event: 'validate',
                        proceed: code => {
                          navigation.goBack();
                          verifyPhone(code);
                        },
                      });
                    } else {
                      Keyboard.dismiss();
                      handleSubmit();
                    }
                  }}
                  disabled={!verify}
                  title={
                    verify == 'phoneNumber'
                      ? 'Verify and Proceed'
                      : 'Verify BVN and Link'
                  }
                  style={{
                    backgroundColor: !verify ? '#DADADA' : COLORS.green,
                  }}
                  rightIcon={<Icons.CircleArrowWhite />}
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
