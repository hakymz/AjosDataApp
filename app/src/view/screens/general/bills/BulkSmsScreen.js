import React from 'react';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Icons,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
  TextArea,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../../../conts';
import * as yup from 'yup';

import {useLayouts, useUser} from '../../../../hooks';

import {useFormik} from 'formik';

import {fetchRequest, openSuccessScreen} from '../../../../helper';

import Toast from '../../../components/toast/Toast';

import {
  AddNumberForBulkSmsOption,
  TransactionSummary,
} from '../../../components/bottomSheetModal/modalContents';
const validationSchema = yup.object().shape({
  message: yup.string().required('Please enter message'),
  sender: yup.string().required('Please add sender'),
});

export const BulkSmsScreen = ({navigation}) => {
  const {minHeight} = useLayouts();
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

      navigation.navigate('HomeScreen');
      openSuccessScreen({
        navigation,
        btnTitle: 'Go to receipt',
        subTitle:
          'We have successfully sent the Airtime to the mobile number inputed.',
        proceed: () => {
          BottomSheets.show({
            component: <TransactionSummary details={response?.data} />,
          });
        },
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
                {values?.contacts?.length > 0 ? (
                  <Icons.EditPenCircle
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
                ) : (
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
                )}

                {values?.contacts?.length > 0 && (
                  <Icons.DeletePen
                    size={27}
                    onPress={() => {
                      setFieldValue('contacts', []);
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
