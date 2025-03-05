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
import {AppNav, BillsBalance, MainHeader} from '../../../components/layouts';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS, IMAGES} from '../../../../conts';
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
import {Image} from '../../../components/general/image';
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

export const BulkSmsRuleScreen = ({navigation}) => {
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
      <AppNav
        icon={<></>}
        comp={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <Text size={18} fontWeight={800}>
              Bulk SMS Rules & Regulations
            </Text>
            <Icons.CloseRed onPress={navigation.goBack} />
          </View>
        }
        line
      />
      <KeyboardAvoidingViewWrapper
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <Text fontWeight={'500'} color={'#4961AC'} size={16}>
          Please Read carefully
        </Text>
        <Text style={{marginTop: 20}} md size={12}>
          1.⁠ ⁠Messages to DND numbers will not be delivered.
          {'\n'}
          {'\n'}
          2.⁠ ⁠International contents or messages referencing international
          Organizations such as WhatsApp, FaceBook etc are not allowed on the
          route, as they are considered spam by the network operators and would
          be blocked once spotted by the network operator’s firewall.
          {'\n'}
          {'\n'}
          3.⁠ ⁠OTP/authentication contents and contents referencing
          transactional activities are not allowed on the route.
          {'\n'}
          {'\n'}
          5.⁠ ⁠SenderIDs cannot contain digits, as messages with such senderIDs
          will not be delivered.
          {'\n'}
          {'\n'}
          6.⁠ ⁠Keywords such as "win", "promo", "free", "Giveaway",
          "Congratulations!!!"(and the likes) as well as contents relating to
          Politics (as earlier notified by the network operators) are not
          allowed on the route, however, please note that the operators have the
          explicit right to block any content or senderID, at their own
          discretion.
          {'\n'}
          {'\n'}
          7.⁠ ⁠SenderIDs used on the transactional route cannot be used on the
          promotional route.
          {'\n'}
          {'\n'}
          8.⁠ ⁠MTN's explicit rule for the promotional route is that messages
          sent between the hours of 8 pm to 8 am will not be delivered. Hence,
          they will be queued and delivered after the prohibited hours, which
          will be 8 am the following day
          {'\n'}
          {'\n'}
          9.⁠ ⁠SenderIDs on Airtel have to be pre-registered before messages
          with them can be delivered appropriately. In the interim, messages
          with the senderIDs to Airtel subscribers may be delivered with a
          default senderID.
          {'\n'}
          {'\n'}
          To further iterate, contents are blocked by the operators, and at
          their discretion. Also, continuous sending of contents not allowed on
          the route might lead to the network operator’s blocking the senderID
          itself.
        </Text>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Image style={{height: 255}} source={IMAGES.newsPapper} />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('BulkSmsScreen');
          }}
          style={{
            height: 80,
            width: 80,
            backgroundColor: COLORS.primary,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#820300',
            shadowOpacity: 0.5,
            shadowRadius: 15,
            elevation: 15,
            shadowOffset: {width: 10, height: 10},
            position: 'absolute',
            zIndex: 10,
            right: 24,
            bottom: 24,
          }}>
          <Text md size={14} color={COLORS.white}>
            NEXT
          </Text>
        </TouchableOpacity>
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
