import React from 'react';
import {
  BigInput,
  Button,
  CustomPicker,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  SearchInput,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {fetchRequest, openLink} from '../../../../helper';
import {useQuery} from 'react-query';
import {
  GiftCard,
  GiftCardBigInput,
  UploadImage,
} from '../../../components/giftCard';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {s} from 'react-native-size-matters';
import Toast from '../../../components/toast/Toast';
let validationSchema;

export const SellGiftCardNextScreen = ({navigation, route}) => {
  const giftData = route?.params;

  const [state, setState] = React.useState({
    selectedDenominationsMap: null,
    quantity: 1,
    seletedImages: [],
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    submitForm,
    handleSubmit,
    setValues,
    isValid,
  } = useFormik({
    initialValues: {amount: '', total: '', cardSubCategory: '', note: ''},
    validationSchema: validationSchema,

    onSubmit: values => {
      if (values?.note || state?.seletedImages.length > 0) {
        navigation.navigate('SellGiftCardSummaryScreen', {
          ...values,
          ...giftData,
          selectedImages: state.seletedImages,
        });
      } else {
        Toast.show('error', 'Please upload image or add note to continue.');
      }
    },
  });

  validationSchema = yup.object().shape({
    amount: yup
      .number()
      .required('Please input amount')
      .min(values?.cardSubCategory?.minimumAcceptableAmount),
    cardSubCategory: yup.object().required('Select Sub-category'),
  });

  return (
    <CustomSafeAreaView>
      <AppNav title={'Sell Gift Cards'} line />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 30}}>
        <View style={{alignItems: 'flex-end'}}>
          <Text
            numberOfLines={1}
            color={COLORS.primary}
            textAlign={'right'}
            bold
            size={16}
            lineHeight={19}
            style={{marginBottom: 20, width: '80%'}}>
            {giftData.name} Gift Card
          </Text>
        </View>

        <View style={{paddingHorizontal: 20}}>
          <CustomPicker
            style={{backgroundColor: COLORS.background}}
            error={touched?.cardSubCategory && errors?.cardSubCategory}
            value={values.cardSubCategory}
            placeholder="Select Sub-category"
            data={giftData?.cardSubCategories}
            onValueChange={value => {
              setFieldValue('cardSubCategory', value);
              setValues({
                ...values,
                cardSubCategory: value,
                amount: 0,
                total: 0,
              });
            }}
            setTouched={() => {
              setFieldTouched('cardSubCategory', true);
            }}
          />
        </View>

        <GiftCardBigInput
          // editable
          onChangeText={value => {
            setValues({
              ...values,
              amount: value,
              total: value * values?.cardSubCategory?.rate,
            });
          }}
          onBlur={() => {
            setFieldTouched('amount', true);
          }}
          // conutryCode={'USD'}
          // countryLogo={
          //   <Image
          //     source={IMAGES.usaLogo}
          //     style={{height: '100%', width: '100%'}}
          //   />
          // }
          cardLogo={{uri: giftData?.avatar}}
          title={'How much?'}
          placeholder="0"
          error={touched.amount && errors.amount}
          value={values?.amount}
          textColor={{
            active: COLORS.black,
            blur: COLORS.inputGrey,
            placeholderTextColor: COLORS.inputGrey,
          }}
          backgroundColor={COLORS.backgroundColor}
        />
        <View
          style={{
            justifyContent: 'flex-end',
            paddingHorizontal: 30,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text color={COLORS.dark} size={12} semiBold style={{right: 30}}>
            Rate:{' '}
            <Text color={COLORS.primary} size={12} semiBold style={{right: 30}}>
              {values?.cardSubCategory?.rate}
            </Text>
          </Text>

          <View>
            <View style={style.iconCon}>
              <MyIcons.DoubleArrow size={18} />
            </View>
            <View style={{height: 75, width: 2, backgroundColor: '#F1F1F1'}} />
          </View>
        </View>

        <BigInput
          editable={false}
          currencyLogoBackground={{active: COLORS.black, blur: COLORS.black}}
          currencyLogoColor={{active: COLORS.white, blur: COLORS.white}}
          showCurrencyLogo
          onChangeText={value => {
            // setFieldValue('total', value);
          }}
          onBlur={() => setFieldTouched('total', true)}
          value={values?.total}
          error={touched?.total && errors?.total}
          currency="NGN"
          textColor={{
            active: COLORS.black,
            blur: COLORS.inputGrey,
            placeholderTextColor: COLORS.inputGrey,
          }}
          backgroundColor={{
            active: COLORS.background,
            blur: COLORS.background,
          }}
          placeholder="0"
          title={'You Get'}
          type="background"
        />
        <UploadImage
          updateImages={images => {
            setState(prevState => ({...prevState, seletedImages: images}));
          }}
          selectedImages={state.seletedImages}
        />
        <Text semiBold size={12} style={{paddingHorizontal: 20, marginTop: 20}}>
          Please let us know if you have any E-code or special requests in the
          Space Provided below
        </Text>
        <View style={{paddingHorizontal: 20, marginTop: 10}}>
          <Input
            onChangeText={value => {
              setFieldValue('note', value);
            }}
            onBlur={() => setFieldTouched('note', true)}
            value={values?.note}
            error={touched?.note && errors?.note}
            textColor={{
              active: COLORS.black,
              blur: COLORS.inputGrey,
              placeholderTextColor: COLORS.inputGrey,
            }}
            backgroundColor={{
              active: COLORS.background,
              blur: COLORS.background,
            }}
            placeholder="E-code | Notes"
            type="background"
          />
          <Text
            onPress={() => {
              openLink('https://wa.link/8batl7');
            }}
            semiBold
            color={COLORS.primary}
            textAlign={'center'}
            style={{marginTop: 10, textDecorationLine: 'underline'}}>
            Contact Support
          </Text>
        </View>
        <View style={{justifyContent: 'flex-end', flex: 1, paddingTop: 40}}>
          <View style={{paddingHorizontal: 30, paddingTop: 30}}>
            <Button onPress={handleSubmit} type="black" title={'Continue'} />
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  iconCon: {
    height: 38,
    width: 38,
    backgroundColor: '#F1F1F1',
    position: 'absolute',
    borderRadius: 100,
    marginTop: 18,
    left: -19,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
