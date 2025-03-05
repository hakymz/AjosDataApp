import {useFormik} from 'formik';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, GENERAL} from '../../../conts';
import {
  Button,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../components/general';
import {AppNav} from '../../components/layouts';
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
let validationSchema;
export const KycScreen = ({navigation}) => {
  const {data} = useUser();

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
    <CustomSafeAreaView>
      <AppNav title={'KYC Verification'} line />
      <KeyboardAvoidingViewWrapper addMinHeight>
        {/* BVN section */}
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            paddingHorizontal: 40,
            alignItems: 'center',
          }}>
          <View style={style.iconCon}>
            <MyIcons.LockOpen size={20} />
          </View>
          <View style={{flex: 1, paddingLeft: 10}}>
            <Input
              conStyle={{marginBottom: 0}}
              editable={!bankVerification}
              textColor={
                bankVerification
                  ? {
                      active: COLORS.primary,
                      blur: COLORS.primary,
                    }
                  : {active: COLORS.black, blur: 'rgba(208, 208, 208, 1)'}
              }
              backgroundColor={
                bankVerification
                  ? {
                      active: 'rgba(141, 183, 63, 0.2)',
                      blur: 'rgba(141, 183, 63, 0.2)',
                    }
                  : {
                      active: COLORS.lightGrey,
                      blur: 'rgba(208, 208, 208, 0.3)',
                    }
              }
              placeholder="Enter BVN"
              value={values.bvn}
              error={touched?.bvn && errors?.bvn}
              onChangeText={value => {
                setFieldValue('bvn', value);
              }}
              onFocus={() => {}}
              onBlur={() => setFieldTouched('bvn', true)}
              rightIcon={
                bankVerification && (
                  <View style={{left: -10}}>
                    <MyIcons.TickRound size={20} />
                  </View>
                )
              }
            />
          </View>
        </View>

        {!bankVerification && (
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              paddingHorizontal: 40,
              alignItems: 'center',
            }}>
            <View style={style.iconCon}>
              <MyIcons.Date size={20} />
            </View>
            <View
              style={{
                flex: 1,
                paddingLeft: 10,
                justifyContent: 'center',
              }}>
              <CustomDatePicker
                value={values?.dob}
                error={errors.dob}
                conStyle={{marginBottom: 0}}
                onValueChange={value => {
                  console.log(value);
                  setFieldValue('dob', value);
                }}
                placeholder={'DOB [ MM-DD-YYYY ]'}
              />
            </View>
          </View>
        )}

        {/* Id Section */}
        <View style={{paddingHorizontal: 20}}>
          <Line />
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
            }}>
            <View style={style.iconCon}>
              <MyIcons.TickBox size={20} />
            </View>
            <View style={{flex: 1, paddingLeft: 10}}>
              <Text semiBold>ID Verification</Text>
              <Text size={12} style={{marginTop: 20}}>
                Please upload clear images of any of the following:
              </Text>
              <Text size={12} style={{marginTop: 20}}>
                NB: Make sure there is no reflection and all text are legible.
              </Text>
              <Text semiBold size={12} style={{marginTop: 20}}>
                i. Drivers Licence{'\n'}ii. International Passport{'\n'}iii.
                Voters Card
              </Text>
            </View>
          </View>

          <View style={style.picCon}>
            {!state.userIdImage && (
              <TouchableOpacity
                disabled={governmentIssuedCard}
                onPress={async () => {
                  const image = await getImage();
                  setState(prevState => ({
                    ...prevState,
                    userIdImage: image,
                  }));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <MyIcons.Gallery />
                <Text style={{marginLeft: 5}} semiBold color={COLORS.dark}>
                  Snap ID
                </Text>
              </TouchableOpacity>
            )}

            {state.userIdImage && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                  width: '100%',
                  paddingHorizontal: 33,
                }}>
                <TouchableOpacity
                  disabled={governmentIssuedCard}
                  onPress={async () => {
                    const image = await getImage();
                    setState(prevState => ({
                      ...prevState,
                      userIdImage: image,
                    }));
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <MyIcons.GalleryGreen />
                  <Text
                    style={{marginLeft: 5, textDecorationLine: 'underline'}}
                    semiBold
                    color={COLORS.dark}>
                    Retake Picture
                  </Text>
                </TouchableOpacity>
                <Text
                  onPress={() => {
                    navigation.navigate('PreviewImageScreen', {
                      image: state.userIdImage.uri,
                    });
                  }}
                  semiBold
                  color={'#9D9D9D'}
                  style={{textDecorationLine: 'underline'}}>
                  View image
                </Text>
              </View>
            )}

            {governmentIssuedCard && (
              <View style={{position: 'absolute', right: 10, top: 20}}>
                <MyIcons.TickRound size={20} />
              </View>
            )}
          </View>
        </View>
        {/* Selfie section */}

        <View style={{paddingHorizontal: 20, marginTop: 10}}>
          <Line />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <View style={style.iconCon}>
              <MyIcons.Emoji size={22} />
            </View>
            <Text semiBold style={{marginLeft: 5}}>
              Snap Selfie
            </Text>
          </View>

          <View style={style.picCon}>
            {!state.selfie && (
              <TouchableOpacity
                disabled={selfie}
                onPress={async () => {
                  const image = await getImage();
                  setState(prevState => ({
                    ...prevState,
                    selfie: image,
                  }));
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <MyIcons.Gallery />
                <Text style={{marginLeft: 5}} semiBold color={COLORS.dark}>
                  Take Selfie
                </Text>
              </TouchableOpacity>
            )}

            {state?.selfie && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                  width: '100%',
                  paddingHorizontal: 33,
                }}>
                <TouchableOpacity
                  disabled={selfie}
                  onPress={async () => {
                    const image = await getImage();
                    setState(prevState => ({
                      ...prevState,
                      selfie: image,
                    }));
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <MyIcons.GalleryGreen />
                  <Text
                    style={{marginLeft: 5, textDecorationLine: 'underline'}}
                    semiBold
                    color={COLORS.dark}>
                    Retake Picture
                  </Text>
                </TouchableOpacity>
                <Text
                  onPress={() => {
                    navigation.navigate('PreviewImageScreen', {
                      image: state.selfie.uri,
                    });
                  }}
                  semiBold
                  color={'#9D9D9D'}
                  style={{textDecorationLine: 'underline'}}>
                  View image
                </Text>
              </View>
            )}

            {selfie && (
              <View style={{position: 'absolute', right: 10, top: 20}}>
                <MyIcons.TickRound size={20} />
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingHorizontal: 50,
            marginTop: 20,
          }}>
          <Button
            disabled={!enableButton()}
            titleStyle={{color: 'white'}}
            type={enableButton() ? 'black' : 'grey'}
            title={'Submit KYC'}
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
