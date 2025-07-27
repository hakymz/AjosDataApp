import {useFormik} from 'formik';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, GENERAL} from '../../../conts';
import {
  Button,
  CircleButton,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../components/general';
import {AppNav, BackNav, MainHeader} from '../../components/layouts';
import * as yup from 'yup';
import Line from '../../components/general/others/Line';
import {useUser} from '../../../hooks';
import {
  dateToString,
  fetchRequest,
  getImageFromDevice,
  openSuccessScreen,
  uploadImage,
} from '../../../helper';
import {useQueryClient} from 'react-query';
import CustomDatePicker from '../../components/general/inputs/DatePicker';
import moment from 'moment';
import {Preloader} from '../../components/loaders';
import {PageList} from '../../components/lists';
let validationSchema;
export const KycScreen = ({navigation, route}) => {
  const {data} = useUser();
  const details = route?.params || {};

  const [state, setState] = React.useState({userIdImage: null, selfie: null});
  const {governmentIssuedCard, selfie, bankVerification} =
    data?.user?.isVerified?.[0];

  if (!bankVerification) {
    yup.object().shape({
      bvn: yup.string().required('Enter BVN').max(11),
      dob: yup.string().required('Choose date of birth'),
    });
  }
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
      bvn: data?.user?.bvn == 'NULL' ? '' : data?.user?.bvn,
      dob: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      submitKYC(values);
    },
  });

  const getImage = async () => {
    try {
      const result = await getImageFromDevice('camera');

      const {fileName, type} = result?.[0] || {};
      const uri =
        GENERAL.platform == 'ios'
          ? result?.[0]?.uri?.replace?.('file://', '')
          : result?.[0]?.uri;
      return {name: fileName, type, uri};
    } catch (error) {
      throw error;
    }
  };

  const submitKYC = async values => {
    const formData = new FormData();

    let response;
    let response2;

    try {
      if (!bankVerification) {
        const dob = dateToString(values?.dob)?.split('/');
        let newDob = `${dob[1]}-${dob[0]}-${dob[2]}`;

        response = await fetchRequest({
          path: 'settings/validate-bvn',
          data: {...values, dob: newDob},
          method: 'POST',
        });
      }
      let license;
      let selfie;

      if (state.selfie || state.userIdImage) {
        Preloader.show();
        if (state.userIdImage) {
          license = await uploadImage([state.userIdImage]);
        }
        if (state.selfie) {
          selfie = await uploadImage([state.selfie]);
        }

        response2 = await fetchRequest({
          path: 'settings/kyc',
          data: {license: license?.[0], selfie: selfie?.[0]},
          method: 'POST',
        });
      }

      if (response || response2) {
        queryClient.invalidateQueries({queryKey: ['userData']});
        navigation.navigate('HomeScreen');
        openSuccessScreen({
          navigation: navigation,
          btnTitle: 'Head back to Settings',
          title: 'Submitted successfully',
          indicatorWidth: null,
          subTitle: 'We will notify you when we are done with our checks 👌',
          proceed: () => navigation.navigate('SettingsScreen'),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const enableButton = () => {
    if (isValid && values?.bvn && !bankVerification) {
      return true;
    } else if (
      (state.selfie && !selfie) ||
      (state.userIdImage && !governmentIssuedCard)
    ) {
      return true;
    } else {
      return false;
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
          You need to Verify your BVN to generate a Moniepoint account
        </Text>
        <Input
          conStyle={{}}
          editable={!bankVerification}
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
