import React from 'react';
import {View, Image} from 'react-native';
import {
  BottomSheets,
  Button,
  Icons,
  PageInput,
  PagePicker,
  Text,
} from '../../general';
import LottieView from 'lottie-react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useBillsData, useUser} from '../../../../hooks';
import {PageList} from '../../lists';
import CustomDatePicker from '../../general/inputs/DatePicker';
import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

let validationSchema;

const types = [
  {name: 'BVN', value: 'BVN'},
  {name: 'NIN', value: 'NIN'},
];

export const VerifyBVN = ({wallet}) => {
  const {data} = useUser();
  // console.log(data?.user?.phoneNumber);
  const navigation = useNavigation();
  const {getAndUpdateUserData} = useUser();
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
      bvn: __DEV__ ? '22233555025' : '',
      dob: '',
      type: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      try {
        verifyBvn(values);
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (values?.type?.name == 'NIN') {
    validationSchema = yup.object().shape({
      bvn: yup.string().required('Please enter NIN'),
      type: yup.object().required('Please choose type'),
    });
  } else {
    validationSchema = yup.object().shape({
      dob: yup.string().required('Please choose date of birth'),
      bvn: yup.string().required('Please enter BVN'),
      type: yup.object().required('Please choose type'),
    });
  }

  const verifyBvn = async values => {
    const dob = moment(values?.dob, 'DD/MMM/yyyy').format('DD-MMM-yyyy');

    try {
      let response;
      if (values?.type?.name == 'NIN') {
        response = await fetchRequest({
          path: '/kyc/nin',
          data: {
            nin: values?.bvn,
          },
          pageError: {
            navigation,
          },
        });
      } else {
        response = await fetchRequest({
          path: '/kyc/bvn',
          data: {
            bvn: values?.bvn,
            dob,
            phoneNumber: data?.user?.phoneNumber,
          },
          pageError: {
            navigation,
          },
        });
      }

      if (response.status == 'success' && response?.data) {
        openSuccessScreen({
          navigation,
          title:
            'BVN Successfully Verified, click below to Access account details',
          btnTitle: 'Okay',
        });
        getAndUpdateUserData();
        BottomSheets.hide();
      }
    } catch (error) {
      BottomSheets.hide();
    }
  };

  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Verify BVN
      </Text>

      <View style={{marginTop: 30, marginBottom: 25, paddingHorizontal: 20}}>
        <Text size={14} fontWeight={'500'}>
          You need to Verify your BVN to generate a {wallet} accout
        </Text>
      </View>

      <View>
        <PagePicker
          error={touched?.type && errors?.type}
          data={types}
          value={values?.type}
          onValueChange={value => {
            setFieldValue('type', value);
          }}
          placeholder="Select BVN or NIN"
          onBlur={() => {
            setFieldTouched('type', true);
          }}
        />
        <PageInput
          rightIcon={<Icons.SmallPadlock size={20} />}
          value={values.bvn}
          error={touched?.bvn && errors?.bvn}
          onChangeText={handleChange('bvn')}
          onBlur={() => setFieldTouched('bvn', true)}
          placeholder={values?.type?.name == 'NIN' ? 'Enter NIN' : 'Enter BVN'}
        />
        {values?.type?.name == 'BVN' && (
          <PageList
            style={{paddingHorizontal: 0}}
            backgroundColor={COLORS.white}>
            <CustomDatePicker
              error={touched?.dob && errors?.dob}
              // defaultDate={values?.dob}
              placeholder="DD-MM-YYYY"
              onValueChange={value => {
                console.log(value, ' value.... adfata');
                setFieldValue('dob', value);
              }}
              conStyle={{
                marginBottom: 0,
                flex: 1,
                paddingHorizontal: 0,
                backgroundColor: COLORS.white,
              }}
              rightIcon={<Icons.Calender size={20} />}
            />
          </PageList>
        )}
      </View>
      <View style={{flexDirection: 'row', marginTop: 30}}>
        <Button
          onPress={() => {
            BottomSheets.hide();
          }}
          type="lightGrey"
          style={{
            width: 122,
            paddingHorizontal: 10,
          }}
          fontSize={14}
          title={'Cancel'}
        />
        <View style={{width: 10}} />
        <Button
          onPress={() => {
            submitForm();
          }}
          style={{flex: 1, paddingHorizontal: 10}}
          fontSize={14}
          title={`Verify Details`}
        />
      </View>
      <View style={{paddingTop: 30}}>
        <Text lineHeight={'16'} color={'#828282'} size={12} fontWeight={'400'}>
          We need to verify your details to generate a virtual account for you,
          so you can Top-up your wallet
        </Text>
      </View>
    </View>
  );
};
