import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Button, PageInput, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useBillsData} from '../../../../hooks';
import Clipboard from '@react-native-clipboard/clipboard';
import {getNumberNetwork} from '../../../../helper';
import {PageList} from '../../lists';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from 'react-query';

const validationSchema = yup.object().shape({
  phoneNo: yup.string().required('Please enter phone no'),
  network: yup.object().required('Please select network'),
});
3;

export const openClipboardNumberModal = async () => {
  try {
    const clipboardText = await fetchCopiedText();
    let phoneNumber = clipboardText?.trim?.().replace?.(/ /g, '');
    if (phoneNumber.match(/[a-zA-Z]+/g)) {
      return false;
    }

    if (phoneNumber?.includes('234') || phoneNumber?.includes('233')) {
      phoneNumber =
        phoneNumber?.split('233')?.[1] || phoneNumber?.split('234')?.[1];
    }

    if (phoneNumber[0] != '0') {
      phoneNumber = '0' + phoneNumber;
    }
    const numberNetwork = getNumberNetwork(phoneNumber);
    if (numberNetwork) {
      return {network: numberNetwork, phoneNo: phoneNumber};
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchCopiedText = async () => {
  const text = await Clipboard.getString();
  return text;
};

export const CopyNumberFromClipboard = ({}) => {
  const {addCustomers} = useBillsData();
  const navigation = useNavigation();
  const {getCustomers, getAirtimeData} = useBillsData();
  const {data: airtimeData, error: airtimeDataError} = useQuery(
    'getAirtimeDataClip',
    getAirtimeData,
  );

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
      network: '',
      phoneNo: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      BottomSheets.hide();
      addCustomers({
        ...values,
        customerNumber: '+234' + values?.customerNumber,
      });
    },
  });

  const getNetwork = network => {
    return airtimeData?.content?.filter?.(
      item => item?.serviceID == network?.name?.toLowerCase?.(),
    )?.[0];
  };

  React.useEffect(() => {
    (async () => {
      const clipboardText = await openClipboardNumberModal();

      setValues({
        ...values,
        phoneNo: clipboardText?.phoneNo,
        network: clipboardText?.network,
      });
    })();
  }, []);

  return (
    <View style={{paddingHorizontal: 24}}>
      <View
        style={{
          marginBottom: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{width: 55, height: 55, marginBottom: 20}}
          source={require('../../../../assets/images/others/clipboard.png')}
        />
        <Text textAlign={'center'} bd size={16} fontWeight={'500'}>
          We found a Number in your Clipboard
        </Text>
        <Text textAlign={'center'} size={14} color={COLORS.blue}>
          Do you want to Sell{' '}
          <Text bd textAlign={'center'} size={14} color={COLORS.blue}>
            Data
          </Text>{' '}
          or{' '}
          <Text bd textAlign={'center'} size={14} color={COLORS.blue}>
            Airtime
          </Text>{' '}
          to this number?
        </Text>
      </View>

      <View>
        <PageList>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <Text size={22} bd color={COLORS.blue}>
              {values?.phoneNo}
            </Text>
            <Image
              style={{height: 40, width: 40, borderRadius: 40}}
              source={values?.network?.image}
            />
          </View>
        </PageList>
      </View>
      <View style={{marginTop: 20}}>
        <Button
          onPress={() => {
            navigation.navigate('SellDataScreen', {...values});
            BottomSheets.hide();
          }}
          style={{flex: 1, marginTop: 10, backgroundColor: '#4961AC'}}
          fontSize={14}
          title={'Sell Data'}
        />

        <Button
          onPress={() => {
            const network = getNetwork(values?.network);
            navigation.navigate('SellAirtimeScreen', {...values, network});
            BottomSheets.hide();
          }}
          style={{flex: 1, marginTop: 10, backgroundColor: '#179338'}}
          fontSize={14}
          title={'Sell Airtime'}
        />
      </View>
    </View>
  );
};
