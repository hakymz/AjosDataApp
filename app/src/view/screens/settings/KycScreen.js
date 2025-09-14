import {useFormik} from 'formik';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../conts';
import {
  BottomSheets,
  Button,
  CircleButton,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import * as yup from 'yup';
import {useUser} from '../../../hooks';
import {
  dateToString,
  extractError,
  fetchRequest,
  openSuccessScreen,
} from '../../../helper';
import {useQueryClient} from 'react-query';
import CustomDatePicker from '../../components/general/inputs/DatePicker';
import {PageList} from '../../components/lists';
import BottomSheet from '@gorhom/bottom-sheet';
import {NoAddress} from '../../components/bottomSheetModal/modalContents';
let validationSchema;
export const KycScreen = ({navigation, route}) => {
  const {data} = useUser();
  const details = route?.params || {};

  validationSchema = yup.object().shape({
    bvn: yup.string().required('Enter BVN').max(11),
    dob: yup.string().required('Choose date of birth'),
  });

  const queryClient = useQueryClient();

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    submitForm,
    handleSubmit,
    isValid,
  } = useFormik({
    initialValues: {
      bvn: __DEV__ ? '22233555025' : '',
      dob: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      submitKYC(values);
    },
  });

  const submitKYC = async values => {
    try {
      const dob = dateToString(values?.dob)?.split('/');
      let newDob = `${dob[2]}-${dob[1]}-${dob[0]}`;
      console.log(values, newDob, 'newDob newDob');

      const response = await fetchRequest({
        path: 'kyc/bvn',
        data: {...values, dob: newDob},
        method: 'POST',
      });

      console.log(response, 'response response');

      queryClient.invalidateQueries({queryKey: ['userData']});
      navigation.navigate('HomeScreen');
      openSuccessScreen({
        navigation: navigation,
        subTitle: (
          <Text size={14} color={'#868D95'}>
            We have successfully verified your BVN and this was the name we
            found.
            <Text bold style={{marginTop: 20}}>
              {response?.data?.name}
            </Text>
          </Text>
        ),
        btnTitle: 'Give us 5secs',
      });
    } catch (error) {
      const message = extractError(error);
      if (message == 'Kindly setup your address before you can proceed') {
        BottomSheets.show({component: <NoAddress />});
      }
      console.log(error);
    }
  };

  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <View style={{paddingHorizontal: 20}}>
        <CircleButton />
      </View>
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}>
        <PageList
          style={{height: 56}}
          children={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              {details?.image}
              <Text medium size={16}>
                {details?.name}
              </Text>
            </View>
          }
          rightIcon={<></>}
        />
        <Text medium style={{marginBottom: 30}} size={14} color={'#979797'}>
          You need to Verify your BVN to generate a {details?.name} account
        </Text>
        <Input
          conStyle={{}}
          placeholder="Enter BVN"
          value={values.bvn}
          error={touched?.bvn && errors?.bvn}
          onChangeText={value => {
            setFieldValue('bvn', value);
          }}
          onFocus={() => {}}
          onBlur={() => setFieldTouched('bvn', true)}
        />
        <CustomDatePicker
          value={values?.dob}
          error={errors.dob}
          conStyle={{marginBottom: 0}}
          onValueChange={value => {
            console.log(value);
            setFieldValue('dob', value);
          }}
          placeholder={'Date of Birth'}
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginTop: 20,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40,
              marginBottom: 40,
            }}>
            <Image
              style={{height: 186, width: 186}}
              source={require('../../../assets/images/others/profileBvn.png')}
            />
          </View>

          <Button
            titleStyle={{color: 'white'}}
            title={'Plug in my BVN'}
            onPress={() => {
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
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picCon: {
    height: s(85),
    backgroundColor: COLORS.light,
    marginTop: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
