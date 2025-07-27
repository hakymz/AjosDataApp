import React from 'react';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Icons,
  Input,
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
  openErrorScreen,
  openSuccessScreen,
} from '../../../../helper';

import Toast from '../../../components/toast/Toast';
import {SuccessHomeBtn, SuccessShadowBtn} from '../SuccessScreen';
import {ScrollView} from 'react-native-gesture-handler';
import {
  AddNumberForBulkSms,
  AddNumberForBulkSmsOption,
} from '../../../components/bottomSheetModal/modalContents';
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
      contacts: [],
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      if (values.contacts?.length == 0) {
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

  console.log(values.contacts);

  const sendSms = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: 'sms/send-bulk',
        data: {
          from: values?.sender,
          receiver: [...values.contacts],
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
        btnTitle: 'Go to receipt',
        proceed: () => {},
      });
      getAndUpdateUserData();
    } catch (error) {
      console.log(error, 'errrss');
    }
  };

  return (
    <CustomSafeAreaView>
      <MainHeader nav title={'Bulk SMS'} />
      <KeyboardAvoidingViewWrapper
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <View style={{marginTop: 10}}>
          <Text size={12} color={'#898A8D'}>
            Enter the details for the SMS to be sent in bulk.
          </Text>

          <View style={{marginTop: 20, marginBottom: 10}}>
            <Input
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
              placeholder="Enter text here"
              value={values.message}
              error={touched?.message && errors?.message}
              onChangeText={handleChange('message')}
              onBlur={() => {
                setFieldTouched('message', true);
              }}
            />

            <View
              style={{
                height: 60,
                backgroundColor: COLORS.white,
                borderRadius: 16,
                flex: 1,
                paddingVertical: 5,
                marginTop: 15,
                borderWidth: 1,
                borderColor: '#E9F1FF',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text size={16} color={'#848A94'}>
                  {values?.contacts?.length < 1
                    ? 'Add Numbers'
                    : `[${values?.contacts?.length}] added`}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icons.PlusCircle
                  onPress={() => {
                    BottomSheets.show({
                      component: (
                        <AddNumberForBulkSmsOption
                          onValueChange={value => {
                            setFieldValue('contacts', value);
                          }}
                          currentContacts={values?.contacts}
                        />
                      ),
                    });
                  }}
                />
                {values?.contacts?.length > 0 && (
                  <Icons.DeletePen
                    size={27}
                    onPress={() => {
                      BottomSheets.show({
                        component: (
                          <AddNumberForBulkSms
                            onValueChange={value => {
                              setFieldValue('contacts', value);
                            }}
                            currentContacts={values?.contacts}
                          />
                        ),
                      });
                    }}
                  />
                )}

                {values?.contacts?.length < 1 && (
                  <Text
                    style={{marginLeft: 5}}
                    medium
                    size={13}
                    color={'#151521'}>
                    Add Contact(s)
                  </Text>
                )}
              </View>
            </View>
            <Text style={{marginTop: 20}} size={12} color={'#828282'}>
              You can add singular phone numbers, by typing and pasting or by
              importing a{' '}
              <Text size={12} fontWeight={700} color={'#828282'}>
                .CSV
              </Text>{' '}
              file containing your contacts.
            </Text>
          </View>

          <Button
            onPress={() => {
              submitForm();
            }}
            style={{marginTop: 40}}
            title={'Purchase'}
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
