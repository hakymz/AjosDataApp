import {useFormik} from 'formik';
import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import * as yup from 'yup';
import {COLORS, GENERAL} from '../../../conts';
import {
  fetchRequest,
  getImageFromDevice,
  openSuccessScreen,
  uploadImage,
} from '../../../helper';
import {useLayouts, useUser} from '../../../hooks';
import {
  Button,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import {Image} from '../../components/general/image';
import {AppNav} from '../../components/layouts';
import {useQueryClient} from 'react-query';
import {Preloader} from '../../components/loaders';

const validationSchema = yup.object().shape({
  phoneNumber: yup.string().required('Please enter phone number'),
});
export const UpdateProfileScreen = ({navigation}) => {
  const {minHeight} = useLayouts();
  const {data, getUserImage} = useUser();
  const {user} = data || {};
  const [pickedImage, setPickedImage] = React.useState();
  const [profileImageTouch, setProfileImageTouch] = React.useState();
  const queryClient = useQueryClient();
  console.log(user?.country);

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
      phoneNumber: user?.phoneNumber,
      fullname: user?.firstName + ' ' + user?.lastName,
      username: user?.userTag,
      country: user?.country,
    },
    validationSchema: validationSchema,

    onSubmit: values => {
      updateProfile(values);
    },
  });

  const updateProfile = async values => {
    Preloader.show();
    const firstName = values?.fullname?.split(' ')[0]?.trim?.();
    const lastName = values?.fullname?.split(' ')[1]?.trim?.();
    let imagesLink;

    try {
      if (values?.avatar) {
        imagesLink = await uploadImage([values?.avatar]);
      }

      const response = await fetchRequest({
        path: 'settings/profile-update',
        data: imagesLink
          ? {
              firstName,
              lastName,
              country: values?.country,
              phoneNumber: values?.phoneNumber,
              avatar: imagesLink?.[0],
            }
          : {
              firstName,
              lastName,
              country: values?.country,
              phoneNumber: values?.phoneNumber,
            },
        method: 'PATCH',
      });
      queryClient.invalidateQueries({queryKey: ['userData']});
      openSuccessScreen({
        navigation,
        btnTitle: 'Head back to Settings',
        title: 'Saved successfully',
        indicatorWidth: null,
        subTitle: 'Your Profile has been updated on our end!',
        proceed: () => navigation.navigate('SettingsScreen'),
      });
    } catch (error) {
      console.log(error);
    } finally {
      Preloader.hide();
    }
  };

  const getImage = async () => {
    try {
      const result = await getImageFromDevice();

      const {fileName, type} = result?.[0] || {};

      setPickedImage(result?.[0]?.uri);
      const uri =
        GENERAL.platform == 'ios'
          ? result?.[0]?.uri?.replace?.('file://', '')
          : result?.[0]?.uri;

      if (uri) {
        updateProfile({...values, avatar: {uri, name: fileName, type}});
      }
    } catch (error) {
      console.log(error, 'err,,,');
      throw error;
    }
  };

  return (
    <CustomSafeAreaView>
      <AppNav line title={'Profile'} />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          minHeight: minHeight - 80,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
        }}>
        <TouchableOpacity
          onPress={() => setProfileImageTouch(!profileImageTouch)}
          style={{alignItems: 'center', marginTop: 20}}>
          {profileImageTouch && (
            <TouchableOpacity
              onPress={() => {
                getImage();
                setProfileImageTouch(!profileImageTouch);
              }}
              style={style.overLay}>
              <Text semiBold color={COLORS.white}>
                Edit
              </Text>
            </TouchableOpacity>
          )}

          <Image
            source={pickedImage ? {uri: pickedImage} : getUserImage()}
            style={{
              height: s(85),
              width: s(85),
              borderRadius: 100,
            }}
          />
        </TouchableOpacity>
        <Text
          textAlign={'center'}
          style={{paddingHorizontal: 10, marginTop: 20}}
          size={13}>
          You can change your Avatar and phone number
        </Text>
        <View style={{paddingHorizontal: 20, marginTop: 30}}>
          <Input
            placeholder="Enter phone number"
            value={values.phoneNumber}
            error={touched?.phoneNumber && errors?.phoneNumber}
            onChangeText={value => {
              setFieldValue('phoneNumber', value);
            }}
            onFocus={() => {}}
            onBlur={() => setFieldTouched('phoneNumber', true)}
          />
          <Input
            editable={false}
            placeholder="Enter full name"
            value={values.fullname}
            error={touched?.fullname && errors?.fullname}
            onChangeText={value => {
              setFieldValue('fullname', value);
            }}
            onFocus={() => {}}
            onBlur={() => setFieldTouched('fullname', true)}
          />

          <Input
            editable={false}
            placeholder="Enter username"
            value={values.username}
            error={touched?.username && errors?.username}
            onChangeText={value => {
              setFieldValue('username', value);
            }}
            onFocus={() => {}}
            onBlur={() => setFieldTouched('username', true)}
          />
        </View>
        <View
          style={{paddingHorizontal: 30, flex: 1, justifyContent: 'flex-end'}}>
          <Button
            title={'Save'}
            disabled={!isValid || !values?.phoneNumber}
            textColor={'white'}
            type={values.phoneNumber && isValid ? 'black' : 'grey'}
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
  overLay: {
    height: s(85),
    width: s(85),
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    zIndex: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
