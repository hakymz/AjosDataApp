import React from 'react';
import {View, Keyboard} from 'react-native';
import {BigInput, Button, Icons, Input, Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTradeData, useUser} from '../../../../hooks';
import {fetchRequest, formatAmount} from '../../../../helper';
import {Formik} from 'formik';
import * as yup from 'yup';
import {selectNGNWallet} from '../../../../selectors.js/index.js';
import {TransactionStatusModal} from '../TransactionStatusModal';
import {BottomSheets} from '../BottomSheets';
import {NotifyYou} from './NotifyYou';
export const BuyCrypto = ({coin}) => {
  const formikRef = React.useRef();
  const {coinsData, convertCurrency, convertedPrice} = useTradeData();
  const {data, getAndUpdateUserData} = useUser();

  const [state, setState] = React.useState({
    selectedCoinData: null,
    buyRate: coinsData?.buyRate,
  });

  yup.addMethod(yup.string, 'minAmount', function (message) {
    return this.test('minAmountTest', message, value => {
      const formatedAmount = value;
      return formatedAmount >= 50;
    });
  });
  const validationSchema = yup.object().shape({
    amount: yup
      .string()
      .required('Please input amount')
      .minAmount('Min of 50$')
      .test('account-balance', 'More than Wallet Ballance', value => {
        const formatedAmount = value;
        return (
          formatedAmount * state?.buyRate?.ratePerDollar <
          selectNGNWallet(data)?.amount
        );
      }),
  });

  const getSelectedCoinData = () => {
    const selectedCoinData = (coinsData?.coins ?? [])?.filter?.(
      item => coin.unit == item?.symbol,
    )?.[0];
    setState(prevState => ({...prevState, selectedCoinData}));
  };

  React.useEffect(() => {
    getSelectedCoinData();
    convertCurrency(coin.unit, 'USD');
  }, []);

  const buyCrypto = async () => {
    try {
      const response = await fetchRequest({
        path: 'crypto/buy',
        data: {
          amount: state?.buyRate?.ratePerDollar * state?.amount,
          basecurrency: coin?.unit,
          currency: 'NGN',
        },
      });
      if (
        response.status == 'success' &&
        response?.data?.mywallet?.length > 0
      ) {
        getAndUpdateUserData();
        BottomSheets.show({
          component: <NotifyYou />,
          customSnapPoints: [500, 500],
        });
      } else {
        TransactionStatusModal({type: 'error', message: response?.message});
      }
    } catch (error) {}
  };

  return (
    <View style={{height: '100%'}}>
      <Text
        fontType={FONTS.FREDOKA}
        color={COLORS.black}
        size={20}
        lineHeight={24}
        style={{textAlign: 'center', marginTop: 10, marginBottom: 10}}>
        Buy {coin?.name}
      </Text>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          minHeight: '100%',
          paddingTop: 20,
          paddingHorizontal: 10,
        }}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            amount: 0.0,
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            buyCrypto(values);
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
            <View>
              <BigInput
                value={values.amount}
                error={touched?.amount && errors?.amount}
                onChangeText={value => {
                  setState(prevState => ({
                    ...prevState,
                    amount: value,
                  }));
                  setFieldValue('amount', value);
                }}
                title="How Much?"
                backgroundColor={'#F3F7FF'}
                currency="$"
                placeholder="0.00"
                onBlur={() => setFieldTouched('amount', true)}
              />
              <View style={{marginTop: 10, paddingHorizontal: 10}}>
                <Text
                  numberOfLines={1}
                  size={16}
                  semiBold
                  color={COLORS.lightBlue}
                  textAlign="right">
                  NGN - ₦
                  {formatAmount(state?.buyRate?.ratePerDollar * state?.amount)}
                </Text>
                <Text
                  style={{marginTop: 2}}
                  numberOfLines={1}
                  size={16}
                  medium
                  color={COLORS.lightBlue}
                  textAlign="right">
                  Fee - 0.00543 BTC | $4.64
                </Text>
              </View>

              <View style={{marginTop: 40}}>
                <Input
                  value={
                    !isNaN((state?.amount / convertedPrice?.rate).toString?.())
                      ? (state?.amount / convertedPrice?.rate).toString?.()
                      : '0.00'
                  }
                  editable={false}
                  conStyle={{marginBottom: 10}}
                  backgroundColor={'#F3F7FF'}
                  placeholder="0.00"
                  textColor={COLORS.lightBlue}
                  inputStyle={{
                    color: COLORS.lightBlue,
                    fontFamily: FONTS.WORKSANS_FONTS.semiBold,
                    fontSize: 20,
                  }}
                  rightIcon={
                    <Text semiBold color={COLORS.lightBlue}>
                      {coin?.unit}
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
    </View>
  );
};
