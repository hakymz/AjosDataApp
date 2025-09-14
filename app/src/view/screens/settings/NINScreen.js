import {useFormik} from 'formik';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, GENERAL} from '../../../conts';
import {
  BottomSheets,
  Button,
  CircleButton,
  CustomSafeAreaView,
  Icons,
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
import {launchImageLibrary} from 'react-native-image-picker';
let validationSchema;
export const NINScreen = ({navigation, route}) => {
  const {data} = useUser();
  const details = route?.params || {};

  validationSchema = yup.object().shape({
    nin: yup.string().required('Enter NIN').max(11),
    image: yup.object().required('Select image'),
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
      nin: __DEV__ ? '22233555025' : '',
      image: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      submitKYC(values);
    },
  });

  const submitKYC = async values => {
    try {
      const formData = new FormData();
      formData.append('type', 'document');

      const uri =
        GENERAL.platform == 'ios'
          ? values?.image?.uri?.replace?.('file://', '')
          : values?.image?.uri;

      formData.append('file', {
        name: values?.image?.fileName,
        type: values?.image?.type,
        uri: uri,
      });

      const response1 = await fetchRequest({
        path: '/fileupload',
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData,
        method: 'POST',
      });
      console.log(response1?.data?.[0]);

      const response = await fetchRequest({
        path: 'kyc/nin',
        data: {...values, image: response1?.data?.[0]},
        method: 'POST',
      });
      console.log(response);

      queryClient.invalidateQueries({queryKey: ['userData']});
      navigation.navigate('HomeScreen');
      openSuccessScreen({
        navigation: navigation,
        subTitle: 'We have successfully verified your NIN',
        btnTitle: 'Create Dollar Card',
        proceed: () => {
          navigation.navigate('DollarCardScreen');
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <View style={{paddingHorizontal: 20}}>
        <CircleButton />
      </View>
      <KeyboardAvoidingViewWrapper
        addMinHeight
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
              <Icons.DollarCard />
              <Text medium size={16}>
                We Need This to Proceed
              </Text>
            </View>
          }
          rightIcon={<></>}
        />
        <Text medium style={{marginBottom: 30}} size={14} color={'#979797'}>
          You need to Verify your BVN and NIN to generate a Virtual Dollar Card.
        </Text>
        <Input
          conStyle={{}}
          placeholder="Enter NIN"
          value={values.nin}
          error={touched?.nin && errors?.nin}
          onChangeText={value => {
            setFieldValue('nin', value);
          }}
          onFocus={() => {}}
          onBlur={() => setFieldTouched('nin', true)}
        />

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 154,
            borderColor: '#E9F1FF',
            borderWidth: 1,
            borderRadius: 18,
          }}>
          <Text semiBold size={16} color={COLORS.darkBlue}>
            Upload NIN Slip
          </Text>
          <TouchableOpacity
            onPress={async () => {
              const deviceImages = await launchImageLibrary({
                selectionLimit: 1,
                mediaType: 'photo',
                quality: 0.5,
              });
              setFieldValue('image', deviceImages?.assets?.[0]);
            }}
            style={{
              backgroundColor: '#F2F0FA',
              height: 50,
              width: 50,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            {values?.image?.uri && (
              <Icons.DeletePen
                size={20}
                style={{position: 'absolute', zIndex: 1, right: -5, top: -10}}
                onPress={() => {
                  setFieldValue('image', {});
                }}
              />
            )}

            {values?.image?.uri ? (
              <Image
                style={{height: 50, width: 50, borderRadius: 12}}
                source={{uri: values?.image?.uri}}
              />
            ) : (
              <Image
                style={{height: 33, width: 33}}
                source={require('../../../assets/images/others/album.png')}
              />
            )}
          </TouchableOpacity>
        </View>
        {errors?.image && (
          <Text size={12} medium style={{marginTop: 10}} color={COLORS.error}>
            {errors?.image}
          </Text>
        )}

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginTop: 20,
          }}>
          <Button
            titleStyle={{color: 'white'}}
            title={'Verify Me'}
            onPress={() => {
              submitForm();
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
