import React from 'react';
import {
  Button,
  CustomPicker,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  PageIndicator,
  SearchInput,
  Text,
} from '../../../components/general';
import {AppNav, MainHeader} from '../../../components/layouts';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {COLORS, GENERAL} from '../../../../conts';
import {fetchRequest, formatAmount} from '../../../../helper';
import {useQuery} from 'react-query';
import {GiftCard, UploadImage} from '../../../components/giftCard';
import {useOrientation} from '../../../../hooks';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Toast from '../../../components/toast/Toast';

const Card = ({children}) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: COLORS.white,
        borderRadius: 18,
        marginBottom: 10,
      }}>
      {children}
    </View>
  );
};

const TypeBtn = ({item, index, onPress, selected}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{flex: 1, marginTop: 20, marginRight: index ? 1 : 12}}>
      <View
        style={{
          height: 68,
          borderRadius: 12,
          backgroundColor: selected ? '#E9E6F7' : '#F5F5F5',
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {item?.image}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            height: 27,
            width: 27,
            borderWidth: 0.5,
            borderColor: selected ? COLORS.primary : '#C6CDD5',
            borderRadius: 20,
            marginRight: 10,
            backgroundColor: '#F4F4F4',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {selected && (
            <View
              style={{
                height: 14,
                width: 14,
                backgroundColor: COLORS.primary,
                borderRadius: 20,
              }}
            />
          )}
        </View>
        <Text size={14} semiBold color={COLORS.dark}>
          {item?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

let validationSchema;

export const SellGiftCardScreen = ({navigation, route}) => {
  const {width} = useWindowDimensions();
  const [state, setState] = React.useState({
    cardType: {
      name: 'Physical Card',
      value: 'Physical',
    },
    images: [],
  });

  const getGiftCards = async () => {
    try {
      const response = await fetchRequest({
        path: `giftcard`,
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      return response?.data;
    } catch (error) {
      console.log(error, 'error error error');
      throw error;
      //send the request after some seconds
    }
  };

  const getGiftCardsSubCategory = async id => {
    try {
      const response = await fetchRequest({
        path: `giftcard/sub-category/${id}`,
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      return response?.data;
    } catch (error) {
      console.log(error, 'error error error');
      throw error;
      //send the request after some seconds
    }
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
    validateForm,
    isValid,
  } = useFormik({
    initialValues: {
      cardCategory: '',
      cardSubCategory: '',
      amount: '',
      ecode: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      if (!values.ecode && state?.images?.length == 0) {
        Toast.show(
          'error',
          'Upload gift cards images or add ecode to continue',
        );
        return false;
      }
      navigation.navigate('SellGiftCardSummaryScreen', {
        ...values,
        selectedImages: state?.images,
        cardType: state?.cardType,
      });
    },
  });

  const {
    data: giftCardData,
    error,
    isFetching,
    isLoading,
    isRefetching,
  } = useQuery('getGiftCards', getGiftCards);
  const {data: giftCardDataSub, isFetching: isFetchingSubGiftcard} = useQuery(
    'getGiftCardsSub' + values?.cardCategory?.id,
    () => getGiftCardsSubCategory(values?.cardCategory?.id),
  );

  validationSchema = yup.object().shape({
    cardCategory: yup.object().required('Please choose card category'),
    cardSubCategory: yup.object().required('Please choose card sub category'),
    amount: yup
      .number()
      .required('Enter amount')
      .min(
        values?.cardSubCategory?.minimumAcceptableAmount,
        `Amount cannot be less than ${
          values?.cardSubCategory?.minimumAcceptableAmount || 0
        }`,
      ),
  });

  return (
    <CustomSafeAreaView>
      <MainHeader title={'Sell Gift Cards'} nav />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginBottom: 20,
          marginTop: 0,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        }}>
        {['50%', '0%'].map(per => (
          <PageIndicator
            style={{width: width / 2 - 25}}
            height={2}
            width={per}
          />
        ))}
      </View>
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 40}}>
        <View style={{marginBottom: 30}}>
          <Text size={18} bold>
            Fill in your card details
          </Text>
          <Text style={{marginTop: 5}} medium size={12} color={'#979797'}>
            Please kindly fill in your correct card details below
          </Text>
        </View>
        <Card>
          <Text size={16} semiBold>
            Card Properties
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {[
              {
                name: 'Physical Card',
                value: 'Physical',
                image: (
                  <Image
                    resizeMode="contain"
                    style={{height: 68, width: 119}}
                    source={require('../../../../assets/images/others/physicalCard.png')}
                  />
                ),
              },
              {
                name: 'E-code',
                value: 'E-code',
                image: (
                  <Image
                    resizeMode="contain"
                    style={{height: 68, width: 119}}
                    source={require('../../../../assets/images/others/ecode.png')}
                  />
                ),
              },
            ].map((item, index) => (
              <TypeBtn
                onPress={() => {
                  setState(prevState => ({...prevState, cardType: item}));
                }}
                selected={state?.cardType?.value == item?.value}
                index={index}
                item={item}
              />
            ))}
          </View>
        </Card>
        <Card>
          <Text style={{marginBottom: 20}} size={16} semiBold>
            Choose
          </Text>

          <CustomPicker
            error={touched?.cardCategory && errors?.cardCategory}
            data={giftCardData}
            value={values?.cardCategory}
            onValueChange={value => {
              setFieldValue('cardCategory', value);
            }}
            placeholder="Gift Card Category"
            onBlur={() => {
              setFieldTouched('cardCategory', true);
            }}
          />
          <CustomPicker
            error={touched?.cardSubCategory && errors?.cardSubCategory}
            data={giftCardDataSub}
            value={values?.cardSubCategory}
            onValueChange={value => {
              setFieldValue('cardSubCategory', value);
            }}
            placeholder="Gift Card Sub-category"
            onBlur={() => {
              setFieldTouched('cardSubCategory', true);
            }}
          />
        </Card>

        <Card>
          <Text style={{marginBottom: 20}} size={16} semiBold>
            Enter Gift Card Amount
          </Text>

          <Input
            keyboardType="numeric"
            value={values.amount}
            error={touched?.amount && errors?.amount}
            onChangeText={handleChange('amount')}
            onBlur={() => setFieldTouched('amount', true)}
            placeholder="Amount"
          />
          <View
            style={{
              height: 60,
              backgroundColor: values?.amount ? '#E9E6F7' : '#F5F5F5',
              borderRadius: 16,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text bold color={values?.amount ? COLORS.darkBlue : '#848A94'}>
              {GENERAL.nairaSign}
              {formatAmount(values?.amount * values?.cardSubCategory?.rate)}
            </Text>
            {values?.cardSubCategory?.rate && (
              <View
                style={{
                  height: 34,
                  backgroundColor: COLORS.white,
                  paddingHorizontal: 10,
                  borderRadius: 32,
                  justifyContent: 'center',
                }}>
                <Text size={12} bold>
                  Rate: {values?.cardSubCategory?.rate}
                </Text>
              </View>
            )}
          </View>
        </Card>

        <Card>
          <Text style={{marginBottom: 20}} size={16} semiBold>
            Enter Comments/Card E-Code
          </Text>

          <Input
            value={values.ecode}
            error={touched?.ecode && errors?.ecode}
            onChangeText={handleChange('ecode')}
            onBlur={() => setFieldTouched('ecode', true)}
            // placeholder="Amount"
          />
        </Card>

        <Card>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Text style={{}} size={16} semiBold>
              Upload Gift Card Image(s)
            </Text>
            <View
              style={{
                height: 26,
                width: 26,
                backgroundColor: COLORS.primary,
                borderRadius: 26,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text semiBold size={14} color={COLORS.white}>
                {state?.images?.length}
              </Text>
            </View>
          </View>

          <UploadImage
            selectedImages={state?.images}
            updateImages={images => {
              setState(prevState => ({...prevState, images: images}));
            }}
          />
        </Card>

        <Button
          onPress={() => {
            submitForm();
          }}
          title={'Next'}
          style={{marginTop: 20}}
        />
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
