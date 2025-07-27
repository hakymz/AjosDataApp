import React from 'react';
import {
  BalanceContainer,
  BigInput,
  BottomSheets,
  Button,
  CheckBox,
  CustomPicker,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  PageIndicator,
  Text,
} from '../../../components/general';
import {AppNav, BillsBalance, MainHeader} from '../../../components/layouts';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {COLORS, FONTS, GENERAL, IMAGES} from '../../../../conts';

import * as yup from 'yup';
import {useFormik} from 'formik';
import {Image} from '../../../components/general/image';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {BuyGiftCardTransactionSummary} from '../../../components/bottomSheetModal/modalContents/BuyGiftCardTransactionSummary';

let validationSchema = yup.object().shape({
  amount: yup.object().required('Please input amount'),
});

const QuantityInput = ({quantity, onValueChange = () => {}}) => {
  return (
    <View style={style.quantityInput}>
      <TouchableOpacity
        onPress={() => {
          onValueChange(quantity > 1 ? quantity - 1 : quantity);
        }}
        style={style.quantityInputIconCon}>
        <MyIcons.Minus size={12} />
      </TouchableOpacity>

      <Text size={16} semiBold>
        {quantity || 0}
      </Text>

      <TouchableOpacity
        onPress={() => {
          onValueChange(quantity < 10 ? quantity + 1 : quantity);
        }}
        style={style.quantityInputIconCon}>
        <Text color={'#023248'} semiBold>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const BuyGiftCardNextScreen = ({navigation, route}) => {
  const giftData = route?.params;

  const {width} = useWindowDimensions();

  const [state, setState] = React.useState({
    selectedDenominationsMap: null,
    quantity: 1,
  });
  const fixedRecipientToSenderDenominationsMap = React.useMemo(() => {
    const list = [];

    if (giftData?.fixedRecipientToSenderDenominationsMap) {
      for (const [key = null, value = null] of Object?.entries(
        giftData?.fixedRecipientToSenderDenominationsMap,
      )) {
        list.push({name: key, value: {total: key, amount: value}});
      }
    }

    return list;
  }, []);

  const {
    values,
    errors,
    touched,
    isValid,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
  } = useFormik({
    initialValues: {amount: '', total: ''},
    validationSchema: validationSchema,

    onSubmit: values => {
      BottomSheets.show({
        component: (
          <BuyGiftCardTransactionSummary
            proceed={() => {
              navigation.navigate('PinScreen', {
                proceed: transactionPin => {
                  buyGiftCard(transactionPin);
                },
              });
            }}
            data={{...values, ...state, giftData}}
          />
        ),
      });
    },
  });

  const buyGiftCard = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: '/giftcard/buy',
        data: {
          countryCode: 'NGN',
          productId: giftData?.productId,
          quantity: state?.quantity,
          unitPrice: values?.amount?.value?.total || values?.amount,
          transactionPin: transactionPin,
        },
        pageError: {navigation},
      });
      openSuccessScreen({
        navigation,
        subTitle:
          'We have successfully sent the Gift Card to your default email and to your receipt.',
      });
    } catch (error) {}
  };
  if (giftData?.denominationType != 'FIXED') {
    validationSchema = yup.object().shape({
      amount: yup
        .number()
        .required('Please input amount')
        .min(giftData?.minRecipientDenomination)
        .max(giftData?.maxRecipientDenomination),
    });
  }

  React.useEffect(() => {
    if (giftData?.denominationType == 'FIXED') {
      setFieldValue('total', values?.amount?.value?.amount * state.quantity);
    } else {
      setFieldValue(
        'total',
        (giftData?.minSenderDenomination / giftData?.minRecipientDenomination) *
          values?.amount *
          state.quantity,
      );
    }
  }, [state.quantity, values.amount]);

  return (
    <CustomSafeAreaView>
      <MainHeader title={'Buy Gift Card'} nav />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginBottom: 20,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        }}>
        {['100%', '100%', '50%'].map(per => (
          <PageIndicator
            style={{width: width / 3 - 20}}
            height={4}
            width={per}
          />
        ))}
      </View>
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 0}}>
        <Text style={{marginBottom: 20}} bold size={18} color={COLORS.darkBlue}>
          Fill in the blanks 😎
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              height: 118,
              width: 98,
              backgroundColor: COLORS.white,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 5,
            }}>
            <Image
              style={{height: 50, width: 50}}
              source={{uri: giftData?.logoUrls?.[0]}}
            />
            <Text numberOfLines={1} bold size={14} color={'#303437'}>
              {giftData?.brand?.brandName}
            </Text>
          </View>

          <View
            style={{
              paddingLeft: 20,
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text size={12} medium color={COLORS.black}>
              {giftData?.productName}
            </Text>
            <View style={{marginTop: 20}}>
              <Text size={12} bold color={COLORS.primary}>
                Note:
              </Text>
              <Text medium size={11} color={'#637381'}>
                {giftData?.redeemInstruction?.concise}
              </Text>
            </View>
          </View>
        </View>
        {/* <GiftCardBigInput
          type={giftData?.denominationType}
          data={fixedRecipientToSenderDenominationsMap}
          onChangeText={value => {
            if (giftData?.denominationType == 'FIXED') {
              setFieldValue('amount', value?.total);
              setState(prevState => ({
                ...prevState,
                selectedDenominationsMap: value,
              }));
            } else {
              setFieldValue('amount', value);
            }
          }}
          onBlur={() => {
            setFieldTouched('amount', true);
          }}
          conutryCode={giftData?.country?.isoName}
          countryLogo={giftData?.flagUrl}
          cardLogo={{uri: giftData?.logoUrls?.[0]}}
          title={
            giftData?.denominationType == 'FIXED'
              ? 'Select Amount'
              : 'Card Value'
          }
          placeholder="0.00"
          error={touched.amount && errors.amount}
          value={values?.amount}
          textColor={{
            active: COLORS.white,
            blur: COLORS.white,
            placeholderTextColor: COLORS.white,
          }}
          backgroundColor={COLORS.black}
        /> */}

        <View style={{marginTop: 20}}>
          {giftData?.denominationType == 'FIXED' ? (
            <CustomPicker
              error={touched?.amount && errors?.amount}
              value={values?.amount}
              onValueChange={value => {
                setFieldValue('amount', value);
              }}
              placeholder="Select amonut"
              onBlur={() => {
                setFieldTouched('amount', true);
              }}
              data={fixedRecipientToSenderDenominationsMap}
            />
          ) : (
            <Input
              keyboardType="numeric"
              onChangeText={value => {
                setFieldValue('amount', value);
              }}
              value={values?.amount}
              error={touched?.total && errors?.total}
              currency="NGN"
              placeholder={'Amount'}
              onBlur={() => {
                setFieldTouched('amount', true);
              }}
            />
          )}
        </View>

        <View
          style={{
            justifyContent: 'space-between',
            paddingHorizontal: 30,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#E9E6F7',
            height: 60,
            borderRadius: 16,
            marginBottom: 10,
          }}>
          <View
            style={{
              paddingLeft: 0,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text color={'#848A94'} medium size={14}>
              Quantity
            </Text>
            <QuantityInput
              quantity={state.quantity}
              onValueChange={quantity => {
                setState(prevState => ({...prevState, quantity}));
              }}
            />
            <View style={{alignItems: 'flex-end', flex: 1}}>
              <Text size={16} bold color={COLORS.darkBlue}>
                $
                {formatAmount(
                  (values?.amount?.name || values?.amount) * state?.quantity,
                )}
              </Text>
            </View>
          </View>
        </View>
        <Input
          editable={false}
          value={`${GENERAL.nairaSign}${formatAmount(values?.total)}`}
          error={touched?.total && errors?.total}
          currency="NGN"
          placeholder={'You Pay'}
          inputStyle={{
            color: COLORS.darkBlue,
            fontFamily: FONTS.PLUS_JAKARTA_SANS_FONTS.bold,
          }}
          rightIcon={
            <View
              style={{
                height: 36,
                width: 72,
                backgroundColor: '#DDDDDD',
                borderRadius: 18,
                flexDirection: 'row',
                paddingHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Image style={{height: 20, width: 20}} source={IMAGES.ngLogo} />
              <Text size={12} medium color={'#231F20'}>
                NGN
              </Text>
            </View>
          }
        />

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <BillsBalance />
        </View>
        <View style={{justifyContent: 'flex-end', flex: 1, paddingTop: 80}}>
          <View
            style={{
              marginTop: 20,
              marginBottom: 0,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CheckBox
              isChecked={state.isChecked}
              onPress={() => {
                setState(prevState => ({
                  ...prevState,
                  isChecked: !prevState.isChecked,
                }));
              }}
            />
            <Text
              onPress={() => {
                openLink(CONTACTS.termsLink);
              }}
              color={'#7F8192'}
              fontWeight={'500'}
              style={{paddingLeft: 10}}
              size={12}>
              I’ve read and agree to the Trade Terms
            </Text>
          </View>
          <View style={{paddingTop: 30}}>
            <Button
              disabled={!isValid || !state?.isChecked}
              onPress={handleSubmit}
              title={'Continue'}
            />
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
  quantityInput: {
    width: 109,
    height: 40,
    marginLeft: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityInputIconCon: {
    height: 22,
    width: 22,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
