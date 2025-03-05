import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {useQuery} from 'react-query';
import {COLORS, FONTS} from '../../../../conts';
import {fetchRequest} from '../../../../helper';
import {
  BottomSheets,
  Button,
  CustomPicker,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../general';
import {useFormik} from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  country: yup.object().required('Choose country'),
});
export const Country = ({onChange}) => {
  const navigation = useNavigation();

  const getCountry = async () => {
    try {
      const response = await fetchRequest({
        path: 'giftcard/countries',
        method: 'GET',
        // displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success' && response?.data?.length > 0) {
        return response?.data;
      }
    } catch (error) {
      throw error;
      //send the request after some seconds
    }
  };

  const {data, error} = useQuery('getCountry', getCountry);
  console.log(data, 'kkkk');
  console.log(error, 'kkkk');

  const {
    values,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    isValid,
  } = useFormik({
    initialValues: {
      country: '',
    },
    validationSchema,
    onSubmit: values => {
      BottomSheets.hide();
      navigation.navigate('BuyGiftCardScreen', values.country);
    },
  });

  return (
    <View style={{paddingHorizontal: 30}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingHorizontal: 30,
        }}>
        <Text
          style={{flex: 1}}
          bold
          textAlign={'center'}
          color={COLORS.primary}
          lineHeight={25}
          size={20}>
          Select Country
        </Text>
      </View>

      <Text semiBold textAlign={'center'}>
        What Country do you want to buy from?
      </Text>
      <Text style={{paddingTop: 20}} size={12} textAlign={'center'}>
        This will help us filter all the available cards from the purchase
        country of choice
      </Text>
      <CustomPicker
        onValueChange={value => setFieldValue('country', value)}
        error={touched.country && errors.country}
        name={'country'}
        value={values?.country}
        placeholder={'Choose country'}
        data={data}
        style={{backgroundColor: '#F8F8F8', marginTop: 25}}
      />
      <View style={{paddingHorizontal: 10, marginTop: 20}}>
        <Button type="black" title={'Get Started'} onPress={handleSubmit} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  search: {
    height: s(55),
    backgroundColor: '#F8F8F8',
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 20,
  },
});
