import React from 'react';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  PageInput,
  SuccessRateDisplay,
  Text,
  TextArea,
} from '../../../components/general';
import {BillsBalance, MainHeader} from '../../../components/layouts';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS} from '../../../../conts';
import * as yup from 'yup';
import RNFS from 'react-native-fs';
import {useLayouts, useUser} from '../../../../hooks';
import {
  EditNumber,
  TransactionSummary,
} from '../../../components/bottomSheetModal/contents';
import {useFormik} from 'formik';

import DocumentPicker, {types} from 'react-native-document-picker';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';

import Toast from '../../../components/toast/Toast';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';
import {ScrollView} from 'react-native-gesture-handler';
const validationSchema = yup.object().shape({
  message: yup.string().required('Please enter message'),
  sender: yup.string().required('Please add sender'),
});

const ContactsList = ({text, style, onPress}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={() => {
        onPress();
      }}
      style={{
        backgroundColor: '#DCE0F0',
        justifyContent: 'center',
        height: 29,
        borderRadius: 8,
        paddingHorizontal: 7,
        marginRight: 5,
        marginBottom: 3,
        ...style,
      }}>
      <Text numberOfLines={1} color={'#4961AC'} size={15} fontWeight={500}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export const BulkSmsScreen = ({navigation}) => {
  const {minHeight} = useLayouts();
  const {getAndUpdateUserData} = useUser();
  const [contacts, setContacts] = React.useState([]);
  const [state, setState] = React.useState({fileName: '', fileNumbers: []});

  const deleteNumber = index => {
    let currentNumbers = [...contacts];
    currentNumbers = currentNumbers?.filter(
      number => number != currentNumbers?.[index],
    );
    setContacts(currentNumbers);
  };

  const saveUserNumber = (value, index) => {
    const currentNumbers = [...contacts];
    currentNumbers[index] = value;
    setContacts(currentNumbers);
  };

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
      phone: '',
      sender: '',
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      if (contacts?.length == 0 && state?.fileNumbers?.length == 0) {
        Toast.show(
          'error',
          'Please add contacts manually or upload contacts to proceed.',
        );
      } else {
        navigation.navigate('PinScreen', {
          proceed: pin => {
            sendSms(pin);
          },
        });
      }
    },
  });

  const pickerDoc = async () => {
    try {
      const pickerResult = await DocumentPicker.pick({
        allowMultiSelection: false,
      });

      const stringFile = await RNFS.readFile(pickerResult?.[0]?.uri);
      const phoneNumberRegex =
        /(\+?\d{1,2}\s?)?(\(?\d{3}\)?|\d{3})([-.\s]?\d{3}[-.\s]?\d{4})/g;

      const phoneNumbers = stringFile.match(phoneNumberRegex);

      setState(prevState => ({
        ...prevState,
        fileName: pickerResult?.[0]?.name,
        fileNumbers: phoneNumbers,
      }));

      console.log(phoneNumbers, 'docesss');
    } catch (error) {
      console.log(error);
    }
  };

  const sendSms = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: '/messaging/bulk-sms',
        data: {
          from: values?.sender,
          receiver: [...contacts, ...state?.fileNumbers],
          message: values?.message,
          transactionPin,
        },
        pageError: {
          navigation,
        },
        headers: {debounceToken: new Date().getTime()},
      });

      openSuccessScreen({
        navigation,
        title: (
          <Text color={'#27A770'} size={18}>
            Bulk SMS Successfully Sent
          </Text>
        ),

        btnComponent: (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 80,
              justifyContent: 'center',
            }}>
            <SuccessHomeBtn title={'Go Home'} />
            <SuccessShadowBtn
              title={'View Receipt'}
              onPress={() => {
                BottomSheets.show({
                  component: <TransactionSummary details={response?.data} />,
                });
              }}
            />
          </View>
        ),
      });
      getAndUpdateUserData();
    } catch (error) {
      console.log(error, 'errrss');
    }
  };
  return (
    <CustomSafeAreaView>
      <MainHeader />
      <KeyboardAvoidingViewWrapper
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <BillsBalance />
        <View style={{marginTop: 30}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text fontWeight={800} size={18}>
              Bulk SMS
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('BulkSmsRuleScreen');
              }}
              style={{
                height: 30,
                backgroundColor: '#231F20',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 15,
              }}>
              <Text size={12} fontWeight={'500'} color={COLORS.white}>
                Check instructions
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 20, marginBottom: 10}}>
            <PageInput
              showTextError={true}
              value={values.sender}
              error={touched?.sender && errors?.sender}
              onChangeText={handleChange('sender')}
              onBlur={() => {
                setFieldTouched('sender', true);
              }}
              placeholder="Sender Name"
            />
            <TextArea
              value={values.message}
              error={touched?.message && errors?.message}
              onChangeText={handleChange('message')}
              onBlur={() => {
                setFieldTouched('message', true);
              }}
            />
            <Text
              fontWeight={'500'}
              color={COLORS.dark}
              size={14}
              style={{
                marginTop: 10,
                marginBottom: 10,
                paddingHorizontal: 10,
              }}>
              Add contacts Manually
            </Text>
            <View
              style={{
                minHeight: 54,
                maxHeight: 100,
                backgroundColor: '#EFF1FB',
                borderRadius: 8,
                flex: 1,
                paddingVertical: 5,
                justifyContent: 'center',
              }}>
              <ScrollView
                contentContainerStyle={{
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 15,
                    flexWrap: 'wrap',
                  }}>
                  {contacts?.map((number, index) => (
                    <ContactsList
                      onPress={() => {
                        BottomSheets.show({
                          component: (
                            <EditNumber
                              number={number}
                              index={index}
                              saveUserNumber={value => {
                                saveUserNumber(value, index);
                              }}
                              deleteNumber={() => {
                                deleteNumber(index);
                              }}
                            />
                          ),
                        });
                      }}
                      text={number}
                    />
                  ))}
                  <View
                    style={{
                      width: '100%',
                      height: 50,
                    }}>
                    <TextInput
                      onKeyPress={({nativeEvent}) => {
                        if (
                          nativeEvent.key == 'Backspace' &&
                          values?.phone == ''
                        ) {
                          let newNumbers = [...contacts];
                          newNumbers?.pop();
                          setContacts(newNumbers);
                        }
                      }}
                      value={values?.phone}
                      keyboardType="default"
                      onChangeText={value => {
                        console.log('09036199523 08114142857');
                        if (!isNaN(value * 1)) {
                          setFieldValue('phone', value?.trim?.());
                        }

                        if (value.includes(' ') && value?.length > 9) {
                          setFieldValue('phone', '');
                          let splitNumbers = value?.split(' ');
                          splitNumbers = splitNumbers?.filter(item => item);

                          setContacts([...contacts, ...splitNumbers]);
                        }
                      }}
                      onEndEditing={({
                        nativeEvent: {eventCount, target, text},
                      }) => {
                        let value = text;
                        if (value?.length > 9) {
                          console.log('yesssss');
                          setFieldValue('phone', '');
                          setContacts([...contacts, value?.trim?.()]);
                        }
                      }}
                      style={{
                        flex: 1,
                        fontSize: 16,
                        color: COLORS.blue,
                        fontFamily: FONTS.AIRBNBCEREAL_FONTS.Md,
                        height: '100%',
                        // backgroundColor: 'red',
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
            <Text style={{marginTop: 25}} size={12} color={'#828282'}>
              You can add singular phone numbers, by typing and pasting or by
              importing a{' '}
              <Text size={12} fontWeight={700} color={'#828282'}>
                .CSV
              </Text>{' '}
              file containing your contacts.
            </Text>

            <Text
              fontWeight={'500'}
              color={COLORS.dark}
              size={14}
              style={{
                marginTop: 25,
                marginBottom: 10,
                paddingHorizontal: 10,
              }}>
              Upload Contacts
            </Text>
            <TouchableOpacity
              onPress={pickerDoc}
              style={{
                height: 54,
                backgroundColor: '#EFF1FB',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 15,
                flex: 1,
                justifyContent: state?.fileName ? 'space-between' : 'center',
              }}>
              {state?.fileName && (
                <ContactsList style={{flex: 0}} text={state?.fileName} />
              )}

              <Icons.Upload size={24} />
            </TouchableOpacity>
            <Text
              fontWeight={'700'}
              color={COLORS.primary}
              size={13}
              style={{
                marginTop: 10,
                marginBottom: 10,
                paddingHorizontal: 18,
              }}>
              {state?.fileNumbers?.length} Contacts detected
            </Text>
            <PageInput
              editable={false}
              value={`${formatAmount(
                (state?.fileNumbers?.length + contacts?.length) * 4,
              )}`}
              placeholder={'Total Amount'}
              style={{marginBottom: 0}}
              rightIcon={
                <Text size={12} fontWeight={'500'} color={'#9A9A9A'}>
                  Amount
                </Text>
              }
            />
            <Text
              fontWeight={'700'}
              color={COLORS.primary}
              size={13}
              style={{
                marginTop: 10,
                marginBottom: 10,
                paddingHorizontal: 18,
              }}>
              4 NGN/SMS
            </Text>
          </View>
          <SuccessRateDisplay type="bulksms" />
          <Button
            onPress={() => {
              submitForm();
            }}
            style={{marginTop: 40}}
            title={'Send Message'}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 72,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
