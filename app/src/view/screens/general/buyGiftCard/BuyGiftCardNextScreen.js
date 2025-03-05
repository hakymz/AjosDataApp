import React from 'react';
import {
  BigInput,
  Button,
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../../../conts';

import {GiftCardBigInput} from '../../../components/giftCard';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {TouchableOpacity} from 'react-native-gesture-handler';

let validationSchema = yup.object().shape({
  amount: yup.number().required('Please input amount'),
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
    setFieldValue,
    setFieldTouched,
    handleSubmit,
  } = useFormik({
    initialValues: {amount: '', total: ''},
    validationSchema: validationSchema,

    onSubmit: values => {
      navigation.navigate('BuyGiftCardSummaryScreen', {
        ...giftData,
        quantity: state.quantity,
        selectedDenominationsMap: state.selectedDenominationsMap,
        amount: values?.amount,
        total: values?.total,
      });
    },
  });

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
      setFieldValue(
        'total',
        state.selectedDenominationsMap?.amount * state.quantity,
      );
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
      <AppNav title={'Buy Gift Cards'} line />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 30}}>
        <GiftCardBigInput
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
        />
        <View
          style={{
            justifyContent: 'space-between',
            paddingHorizontal: 30,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              paddingLeft: 0,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text semiBold size={12}>
              Quantity
            </Text>
            <QuantityInput
              quantity={state.quantity}
              onValueChange={quantity => {
                setState(prevState => ({...prevState, quantity}));
              }}
            />
          </View>
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
            setFieldValue('total', value);
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
          title={'You Pay'}
          type="background"
        />
        <Text semiBold size={12} style={{paddingHorizontal: 20, marginTop: 30}}>
          The Naira (NGN) equivalent would be deducted from your NGN wallet.
        </Text>
        <View style={{justifyContent: 'flex-end', flex: 1, paddingTop: 80}}>
          <View
            style={{
              backgroundColor: COLORS.backgroundColor,
              marginHorizontal: 20,
              paddingHorizontal: 20,
              paddingVertical: 20,
              justifyContent: 'center',
              borderRadius: 15,
            }}>
            <Text lineHeight={16} color={COLORS.primary} size={12}>
              <Text lineHeight={16} bold size={12} color={COLORS.primary}>
                PURCHASE TERMS:{' '}
              </Text>{' '}
              This card only works in the currency selected above. And can’t be
              returned in cases of errors on the users’ part. So check that
              everything entered is correct, because we would not be liable for
              <Text lineHeight={16} bold size={12} color={COLORS.primary}>
                {' '}
                negligences
              </Text>{' '}
              as these are digital assets.
            </Text>
          </View>
          <View style={{paddingHorizontal: 30, paddingTop: 30}}>
            <Button
              onPress={handleSubmit}
              type="black"
              title={'Review then click here'}
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
    backgroundColor: '#F8F8F9',
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
