import React from 'react';
import {View, Keyboard} from 'react-native';
import {
  formatAmount,
  getWallet,
  scaleFont,
  trimString,
} from '../../../../helper';
import {useTradeData, useUser} from '../../../../hooks';

import {Formik} from 'formik';
import * as yup from 'yup';
import {
  BigInput,
  BottomSheets,
  Button,
  Icons,
  Input,
  Text,
} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {ConfirmationPage} from './ConfirmationPage';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

export const Form = ({coin}) => {
  const {data} = useUser();
  const {coinsData, convertCurrency, convertedPrice} = useTradeData();

  React.useEffect(() => {
    convertCurrency(coin.unit, 'USD');
  }, []);

  const currentWalletBalance = getWallet(
    data.wallets?.mywallet,
    coin?.unit,
  )?.nairaAmount;

  const validationSchema = yup.object().shape({
    amount: yup
      .string()
      .required('Please input amount')
      .test('min-amount', 'Min amount of 10$', value => {
        const formatedAmount = value;
        return formatedAmount >= 10;
      })
      .test('account-balance', 'More than Wallet Ballance', value => {
        const formatedAmount = value;
        return (
          formatedAmount * coinsData?.buyRate?.ratePerDollar <
          currentWalletBalance
        );
      }),
  });
  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 40,
        minHeight: '100%',
        paddingTop: 20,
        paddingHorizontal: 10,
      }}>
      <Formik
        initialValues={{
          amount: 0.0,
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          BottomSheets.show({
            component: (
              <ConfirmationPage
                buyRate={coinsData?.buyRate}
                amount={values?.amount}
                coin={coin}
                convertedPrice={convertedPrice}
              />
            ),
            customSnapPoints: [570, 570],
          });
        }}>
        {({
          values,
          errors,
          handleChange,
          handleSubmit,
          touched,
          setFieldTouched,
          setFieldValue,
          setFieldError,
          setValues,
          status,
        }) => (
          <View style={{marginTop: 10}}>
            <BigInput
              value={values?.amount}
              error={touched?.amount && errors?.amount}
              onChangeText={value => {
                setFieldValue('amount', value);
              }}
              title="How Much?"
              backgroundColor={'#F3F7FF'}
              currency="$"
              placeholder="0.00"
              onBlur={() => setFieldTouched('amount', true)}
            />
            <View
              style={{
                marginTop: 10,
                alignItems: 'flex-end',
                paddingHorizontal: 10,
              }}>
              <Text
                style={{width: '80%'}}
                numberOfLines={1}
                size={16}
                semiBold
                color={COLORS.lightBlue}
                textAlign="right">
                Equivalent -{' '}
                {!isNaN((values?.amount / convertedPrice?.rate).toString?.())
                  ? trimString?.(values?.amount / convertedPrice?.rate, 9)
                  : '0.00'}{' '}
                {coin?.unit}
              </Text>
              <Text
                style={{marginTop: 2, width: '80%'}}
                numberOfLines={1}
                size={16}
                medium
                color={COLORS.lightBlue}
                textAlign="right">
                Fee - 0.00543 BTC | $4.64
              </Text>
            </View>

            <View style={{marginTop: 40}}>
              {/* amount input */}
              <Input
                editable={false}
                value={formatAmount(
                  coinsData?.buyRate?.ratePerDollar * values?.amount,
                )}
                onChangeText={value => {
                  setFieldValue('amount', value);
                }}
                onBlur={() => {
                  setFieldTouched('amount', true);
                }}
                inputStyle={{
                  fontSize: scaleFont(20),
                  fontFamily: FONTS.WORKSANS_FONTS.regular,
                }}
                conStyle={{marginBottom: 10}}
                placeholder="0.00"
                keyboardType="numeric"
                backgroundColor={COLORS.blueGrey}
                textColor={COLORS.lightBlue}
                leftIcon={
                  <Text
                    color={COLORS.lightBlue}
                    size={20}
                    style={{
                      top: 4,
                      paddingRight: 1,
                    }}>
                    ₦
                  </Text>
                }
              />
              <Text medium textAlign="center" color="#A1A1A1">
                We will credit your crypto wallet soon
              </Text>
            </View>

            <Button
              style={{marginTop: 40}}
              onPress={() => {
                Keyboard.dismiss();
                handleSubmit();
              }}
              title="Initiate Transaction"
              rightIcon={<Icons.CircleArrowYellow />}
            />
          </View>
        )}
      </Formik>
    </BottomSheetScrollView>
  );
};
